const DEFAULT_GALAXY_FRONT_URL = "https://www.biotechgalaxy.com/";
const DEFAULT_INVOICE_PDF_BASE_URL = "https://api-galaxy.biotech-dental.com/api/factureGalaxyPdf";

export const SMILEYS_STATUS = {
    OK: "ok",
    USER_UNKNOWN: "userUnknown",
    ACCOUNT_AMBIGUOUS: "accountAmbiguous",
    ACCOUNT_NOT_MEMBER: "accountNotMember",
    UNAVAILABLE: "unavailable",
    PARTNER_REFUSED: "partnerRefused",
    ERROR: "error",
};

const SMILEYS_CODE_STATUS = {
    GALAXY_USER_NOT_FOUND: SMILEYS_STATUS.USER_UNKNOWN,
    GALAXY_USER_INACTIVE: SMILEYS_STATUS.USER_UNKNOWN,
    GALAXY_ACCOUNT_AMBIGUOUS: SMILEYS_STATUS.ACCOUNT_AMBIGUOUS,
    GALAXY_ACCOUNT_NOT_MEMBER: SMILEYS_STATUS.ACCOUNT_NOT_MEMBER,
    GALAXY_ACCOUNT_UNAVAILABLE: SMILEYS_STATUS.UNAVAILABLE,
    GALAXY_PARTNER_CLIENT_UNKNOWN: SMILEYS_STATUS.PARTNER_REFUSED,
    GALAXY_PARTNER_SCOPE_DENIED: SMILEYS_STATUS.PARTNER_REFUSED,
};

const SMILEYS_STATUS_MESSAGE = {
    [SMILEYS_STATUS.USER_UNKNOWN]: "smileys.galaxyNotRecognized",
    [SMILEYS_STATUS.ACCOUNT_AMBIGUOUS]: "smileys.accountAmbiguous",
    [SMILEYS_STATUS.ACCOUNT_NOT_MEMBER]: "smileys.accountNotMember",
    [SMILEYS_STATUS.UNAVAILABLE]: "smileys.galaxyNotRecognized",
    [SMILEYS_STATUS.PARTNER_REFUSED]: "smileys.galaxyUnavailable",
    [SMILEYS_STATUS.ERROR]: "smileys.galaxyUnavailable",
};

export const SMILEYS_UNAVAILABLE_CODES = Object.keys(SMILEYS_CODE_STATUS);

const PARTNER_REFUSAL_CODES = ["GALAXY_PARTNER_CLIENT_UNKNOWN", "GALAXY_PARTNER_SCOPE_DENIED"];

export const galaxyFrontUrl = (env = process.env) =>
    env.REACT_APP_GALAXY_FRONT_URL || DEFAULT_GALAXY_FRONT_URL;

export const invoicePdfUrl = (sfuid, invoiceNumber, env = process.env) => {
    const base = (env.REACT_APP_INVOICE_PDF_BASE_URL || DEFAULT_INVOICE_PDF_BASE_URL).replace(/\/+$/, "");
    return `${base}/${encodeURIComponent(sfuid)}/${encodeURIComponent(invoiceNumber)}`;
};

export const readGalaxyCallback = (search) => {
    const params = new URLSearchParams(search || "");
    return {
        code: params.get("code"),
        state: params.get("state"),
        error: params.get("error"),
        token: params.get("token"),
    };
};

export const smileysArgs = (user) => ({
    uuid: user?.suid,
    salesforceAccountId: user?.sfuid || undefined,
});

export const smileysPath = ({uuid, salesforceAccountId}) =>
    salesforceAccountId
        ? `getSmileys/${uuid}?salesforceAccountId=${encodeURIComponent(salesforceAccountId)}`
        : `getSmileys/${uuid}`;

export const isSmileysUnavailable = (data) =>
    Boolean(data && SMILEYS_UNAVAILABLE_CODES.includes(data.code));

const galaxyCode = (value) => value?.data?.code ?? value?.code;

export const smileysStatus = ({data, error} = {}) => {
    if (error) {
        return SMILEYS_CODE_STATUS[galaxyCode(error)] || SMILEYS_STATUS.ERROR;
    }
    if (data?.success === 1 && Number.isInteger(data.result)) {
        return SMILEYS_STATUS.OK;
    }
    return SMILEYS_CODE_STATUS[data?.code] || SMILEYS_STATUS.ERROR;
};

export const smileysMessageKey = (status) => SMILEYS_STATUS_MESSAGE[status] || null;

export const loginFailureKey = (failure) => {
    const code = galaxyCode(failure);
    if (PARTNER_REFUSAL_CODES.includes(code)) {
        return "login.galaxyUnavailable";
    }
    if (code === "GALAXY_USER_INACTIVE") {
        return "login.galaxyInactive";
    }
    return "login.invalidCredentials";
};
