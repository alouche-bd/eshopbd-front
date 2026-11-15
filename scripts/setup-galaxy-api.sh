#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
ENV_FILE="${ROOT_DIR}/.env.local"
INTERACTIVE=1

GALAXY_FRONT_URL="${REACT_APP_GALAXY_FRONT_URL:-}"
INVOICE_PDF_BASE_URL="${REACT_APP_INVOICE_PDF_BASE_URL:-}"
ESHOP_API_URL="${ESHOP_API_URL:-https://api.shop.biotech-dental.com/api}"
GALAXY_API_URL="${GALAXY_API_BASE_URL:-https://01.fr.api.biotechgalaxy.com}"
KEYCLOAK_URL="${GALAXY_KEYCLOAK_URL:-https://01.fr.oauth.biotechgalaxy.com/auth}"
REALM="${GALAXY_KEYCLOAK_REALM:-s4a}"
CLIENT_ID="${GALAXY_KEYCLOAK_CLIENT_ID:-biotech-dental-eshop}"
CLIENT_SECRET="${GALAXY_KEYCLOAK_CLIENT_SECRET:-}"

usage() {
  cat <<'USAGE'
Usage: scripts/setup-galaxy-api.sh [options]

Writes the front Galaxy variables to .env.local, then checks the Keycloak s4a
realm, galaxy-api and the e-shop back login wiring.

Options:
  --env-file PATH          file to update (default: ./.env.local, git-ignored)
  --galaxy-front-url URL   REACT_APP_GALAXY_FRONT_URL
  --invoice-pdf-url URL    REACT_APP_INVOICE_PDF_BASE_URL
  --eshop-api-url URL      e-shop back API base (default: https://api.shop.biotech-dental.com/api)
  --galaxy-api-url URL     galaxy-api base URL (health check)
  --keycloak-url URL       Keycloak base, before /realms
  --realm NAME             Keycloak realm (default: s4a)
  --client-id ID           Keycloak client of the e-shop (default: biotech-dental-eshop)
  --client-secret-stdin    read the client secret from stdin to validate it (never written)
  --non-interactive        never prompt
  -h, --help               show this help
USAGE
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --env-file) ENV_FILE="$2"; shift 2 ;;
    --galaxy-front-url) GALAXY_FRONT_URL="$2"; shift 2 ;;
    --invoice-pdf-url) INVOICE_PDF_BASE_URL="$2"; shift 2 ;;
    --eshop-api-url) ESHOP_API_URL="$2"; shift 2 ;;
    --galaxy-api-url) GALAXY_API_URL="$2"; shift 2 ;;
    --keycloak-url) KEYCLOAK_URL="$2"; shift 2 ;;
    --realm) REALM="$2"; shift 2 ;;
    --client-id) CLIENT_ID="$2"; shift 2 ;;
    --client-secret-stdin) IFS= read -r CLIENT_SECRET; shift ;;
    --non-interactive) INTERACTIVE=0; shift ;;
    -h|--help) usage; exit 0 ;;
    *) echo "Unknown option: $1" >&2; usage >&2; exit 2 ;;
  esac
done

RESULTS=()
FAILED=0

record() {
  RESULTS+=("$1 $2")
  if [[ "$1" == "KO" ]]; then
    FAILED=1
  fi
}

summary() {
  echo
  echo "=== galaxy-api setup summary ==="
  for line in "${RESULTS[@]}"; do
    echo "  ${line}"
  done
  if [[ "${FAILED}" -eq 0 ]]; then
    echo "Result: OK"
  else
    echo "Result: KO"
  fi
}

trap summary EXIT

for bin in node curl; do
  if command -v "${bin}" >/dev/null 2>&1; then
    record OK "prerequisite ${bin}"
  else
    record KO "prerequisite ${bin} is missing"
    exit 1
  fi
done

touch "${ENV_FILE}"

current() {
  local line
  line="$(grep -E "^$1=" "${ENV_FILE}" | tail -n 1 || true)"
  printf '%s' "${line#*=}"
}

ask() {
  local name="$1" value="$2" fallback="$3" answer
  if [[ -z "${value}" ]]; then
    value="$(current "${name}")"
  fi
  if [[ -z "${value}" ]]; then
    value="${fallback}"
  fi
  if [[ "${INTERACTIVE}" -eq 1 && -t 0 ]]; then
    read -r -p "${name} [${value}]: " answer
    value="${answer:-${value}}"
  fi
  printf '%s' "${value}"
}

set_env() {
  ENV_FILE="${ENV_FILE}" NAME="$1" VALUE="$2" node -e '
    const fs = require("fs");
    const {ENV_FILE: file, NAME: name, VALUE: value} = process.env;
    const lines = fs.existsSync(file) ? fs.readFileSync(file, "utf8").split(/\r?\n/).filter((l, i, a) => i < a.length - 1 || l !== "") : [];
    let found = false;
    const next = lines.map((line) => {
      if (line.startsWith(name + "=")) {
        found = true;
        return name + "=" + value;
      }
      return line;
    });
    if (!found) next.push(name + "=" + value);
    fs.writeFileSync(file, next.join("\n") + "\n");
  '
}

json_field() {
  FIELD="$1" node -e '
    let raw = "";
    process.stdin.on("data", (c) => (raw += c)).on("end", () => {
      let value;
      try { value = JSON.parse(raw); } catch { value = undefined; }
      for (const key of process.env.FIELD.split(".")) value = value == null ? undefined : value[key];
      process.stdout.write(value == null || typeof value === "object" ? "" : String(value));
    });
  '
}

GALAXY_FRONT_URL="$(ask REACT_APP_GALAXY_FRONT_URL "${GALAXY_FRONT_URL}" "https://www.biotechgalaxy.com/")"
INVOICE_PDF_BASE_URL="$(ask REACT_APP_INVOICE_PDF_BASE_URL "${INVOICE_PDF_BASE_URL}" "https://api-galaxy.biotech-dental.com/api/factureGalaxyPdf")"
set_env REACT_APP_GALAXY_FRONT_URL "${GALAXY_FRONT_URL}"
set_env REACT_APP_INVOICE_PDF_BASE_URL "${INVOICE_PDF_BASE_URL%/}"
record OK "${ENV_FILE} updated"

DISCOVERY="$(curl -sS --max-time 20 "${KEYCLOAK_URL%/}/realms/${REALM}/.well-known/openid-configuration" || true)"
if [[ -n "$(printf '%s' "${DISCOVERY}" | json_field authorization_endpoint)" ]]; then
  record OK "Keycloak realm ${REALM} discovered"
else
  record KO "Keycloak realm ${REALM} not reachable on ${KEYCLOAK_URL%/}"
fi

if [[ -n "${CLIENT_SECRET}" ]]; then
  TOKEN_RESPONSE="$(printf '%s' "${CLIENT_SECRET}" | curl -sS --max-time 20 -X POST \
    "${KEYCLOAK_URL%/}/realms/${REALM}/protocol/openid-connect/token" \
    --data-urlencode "grant_type=client_credentials" \
    --data-urlencode "client_id=${CLIENT_ID}" \
    --data-urlencode "client_secret@-" || true)"
  if [[ -n "$(printf '%s' "${TOKEN_RESPONSE}" | json_field access_token)" ]]; then
    record OK "Keycloak client_credentials token for ${CLIENT_ID}"
  else
    record KO "Keycloak token refused for ${CLIENT_ID}: $(printf '%s' "${TOKEN_RESPONSE}" | json_field error_description)"
  fi
else
  record OK "Keycloak client secret not provided, token check skipped (done by the back script)"
fi

HEALTH="$(curl -sS --max-time 20 "${GALAXY_API_URL%/}/health" || true)"
if [[ "$(printf '%s' "${HEALTH}" | json_field status)" == "true" ]]; then
  record OK "galaxy-api reachable (${GALAXY_API_URL%/}/health)"
else
  record KO "galaxy-api health check failed on ${GALAXY_API_URL%/}/health"
fi

LOGIN_URL="$(curl -sS --max-time 20 "${ESHOP_API_URL%/}/galaxy/login-url" || true)"
AUTHORIZE="$(printf '%s' "${LOGIN_URL}" | json_field url)"
if [[ "${AUTHORIZE}" == "${KEYCLOAK_URL%/}/realms/${REALM}/protocol/openid-connect/auth?"* ]]; then
  record OK "e-shop back issues Keycloak login URLs (${ESHOP_API_URL%/}/galaxy/login-url)"
else
  record KO "e-shop back login URL missing or not on ${KEYCLOAK_URL%/} (is GALAXY_API_ENABLED=true on the back?)"
fi

[[ "${FAILED}" -eq 0 ]]
