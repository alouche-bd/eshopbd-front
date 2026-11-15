# Migration vers les nouvelles routes galaxy-api (front)

## Pourquoi

L'ancienne LaGalaxy (SSO `ssogalaxy`, API Symfony `api-galaxy`) est remplacée par **galaxy-api** et par Keycloak `s4a`. Le front de l'e-shop n'appelle pas Galaxy directement : il passe par le back Lumen (`eshopbd-back`), qui porte le client galaxy-api. Le front change pour quatre raisons :

- l'arrivée depuis Galaxy n'apporte plus de `?token=` legacy, mais un retour Keycloak `?code=&state=` ;
- le solde de smileys est cloisonné par compte Salesforce : le front envoie `salesforceAccountId` ;
- les codes d'erreur smileys changent ;
- les URLs Galaxy du front deviennent configurables par environnement.

Les helpers Galaxy du front sont regroupés dans `src/common/utils/galaxy.js`. Les appels HTTP restent dans les services RTK existants (`lumenApi`, `x3Api`).

## Correspondance des appels

| Fichier | Avant | Après | Auth | Changement |
|---|---|---|---|---|
| `src/features/auth/LoginSSO.js` | `POST login-sso {token}` avec le `?token=` du SSO legacy | sans paramètre : `GET galaxy/login-url` puis redirection vers Keycloak `s4a`. Au retour : `POST login-sso {code, state}`, et le back appelle galaxy-api `GET /integrations/eshop/me` | Keycloak (code + PKCE, porté par le back) | `?token=` reste envoyé tel quel (compatibilité avec un back en mode legacy). `?error=` de Keycloak renvoie vers `/login`. |
| `src/features/auth/Login.js` | `POST reverse-login-sso {email, password}` vers le SSO legacy | même appel. Le back utilise Keycloak (`grant_type=password`) puis `GET /integrations/eshop/me` | token utilisateur Keycloak | Aucun changement côté front. Identifiants refusés : HTTP 401 au lieu de 500. |
| `src/features/checkout/Smileys.js`, `src/features/profile/Profile.js` | `GET middleware/getSmileys/{suid}` (proxy de S4A `smileys/total`) | `GET middleware/getSmileys/{suid}?salesforceAccountId={sfuid}`, et le back appelle galaxy-api `GET /integrations/eshop/users/{uuid}/smileys/balance` | `client_credentials` (back) | `result` reste un entier de smileys. `ERR-SMY-002` est remplacé par `GALAXY_USER_NOT_FOUND` / `GALAXY_ACCOUNT_UNAVAILABLE`. |
| `src/features/checkout/Recap.js` | `POST middleware/post-order {…, smileyamount, uuid}` (débit S4A `smileys/consume`) | même appel avec `salesforceAccountId: user.sfuid` (absent pour une commande de laboratoire), et le back appelle galaxy-api `POST /integrations/eshop/users/{uuid}/smileys/debits` | `client_credentials` (back) | L'id du panier sert de référence idempotente. |
| `src/common/components/downloadBillCell/downloadBillCell.js` | lien en dur `https://api-galaxy.biotech-dental.com/api/factureGalaxyPdf/{sfuid}/{id}` | `REACT_APP_INVOICE_PDF_BASE_URL` (même valeur par défaut) | — | C'est un proxy Sage X3 du middleware, pas une route galaxy-api : seule l'URL devient configurable. |
| `src/common/components/header/Header.js`, `src/features/auth/askSignUp.js` | lien en dur `https://www.biotechgalaxy.com/` | `REACT_APP_GALAXY_FRONT_URL` (même valeur par défaut) | — | Lien vers galaxy-front, configurable par environnement. |
| `src/common/utils/apiConstants.js` | `URL_OAUTH`, `URL_API_S4A` (Keycloak et S4A legacy, inutilisés) | supprimés | — | — |

## Variables d'environnement

Variables lues au build par CRA. Le script les écrit dans `.env.local`, qui est ignoré par git :

| Variable | Défaut | Rôle |
|---|---|---|
| `REACT_APP_GALAXY_FRONT_URL` | `https://www.biotechgalaxy.com/` | lien « LaGalaxy Biotech Dental » |
| `REACT_APP_INVOICE_PDF_BASE_URL` | `https://api-galaxy.biotech-dental.com/api/factureGalaxyPdf` | base des PDF de factures |

Aucun secret côté front. La configuration Keycloak (URL, realm, client, secret, redirect URI) et galaxy-api est portée par le back : voir `docs/galaxy-api-migration.md` de `eshopbd-back`.

## Client Keycloak à créer dans `s4a`

Le même client confidentiel `biotech-dental-eshop` que le back (standard flow + PKCE S256, direct access grants, service account avec le rôle `SERVICE`, mapper d'audience galaxy-api, mapper `galaxy_uuid`). Il doit avoir comme redirect URI la page `/login-sso` du front de chaque environnement, par exemple `https://shop.biotech-dental.com/login-sso`.

## Script d'installation

```bash
scripts/setup-galaxy-api.sh                    # interactif
scripts/setup-galaxy-api.sh --non-interactive \
  --eshop-api-url https://eshopbd-back-production.up.railway.app/api \
  --galaxy-api-url https://01.api.new-recette.biotechgalaxy.secure4all.tech \
  --keycloak-url https://01.oauth.recette.biotechgalaxy.secure4all.tech/auth
echo "$SECRET" | scripts/setup-galaxy-api.sh --client-secret-stdin   # valide aussi le secret, sans l'écrire
```

Le script :

1. vérifie `node` et `curl` ;
2. met à jour `.env.local` (idempotent) ;
3. vérifie le realm Keycloak `s4a` (découverte OIDC) et, si un secret est fourni sur stdin, obtient un token `client_credentials` ;
4. appelle `GET /health` de galaxy-api ;
5. vérifie que le back renvoie une URL de connexion Keycloak (`GET /api/galaxy/login-url`) ;
6. affiche un récapitulatif OK/KO.

## Ordre de déploiement

1. galaxy-api : `feat/eshop-new-routes` mergée et déployée ;
2. client Keycloak `biotech-dental-eshop` configuré ;
3. back e-shop `feat/galaxy-api-new-routes` déployé, script lancé, `GALAXY_API_ENABLED=true` ;
4. ce front (`feat/galaxy-api-new-routes`) ;
5. galaxy-front : rien à faire, la planète `biotech` est déjà en stratégie `KEYCLOAK` vers `/login-sso`.

## Rollback

Le rollback se fait sur le back : `GALAXY_API_ENABLED=false`. Le front reste compatible :

- `/login-sso?token=…` envoie `{token}`, comme avant ;
- le paramètre `salesforceAccountId` est ignoré par le chemin legacy.

Seule l'entrée `/login-sso` sans paramètre renvoie vers `/login`, car `galaxy/login-url` répond 404 quand le flag est coupé. Pour revenir aussi au front précédent, redéployer `origin/main`.

## Tests

- `CI=true npm test -- --watchAll=false` : tests de `src/common/utils/galaxy.test.js` (lecture du retour Keycloak, construction des URLs, scoping du solde, codes d'erreur).
- `npm run build`.
- Recette manuelle : planète Biotech Dental depuis galaxy-front, connexion par `/login`, solde et débit de smileys au checkout, téléchargement d'une facture.

## Écarts connus

- Les comptes doivent avoir un mot de passe dans Keycloak `s4a` (voir le doc du back).
- Le formulaire `/login` envoie encore le mot de passe au back (direct grant Keycloak). La cible est de le remplacer par une redirection vers `/login-sso`.
- Commande pour un client de laboratoire : le compte Salesforce du client final n'est pas connu du front ; galaxy-api prend le compte unique ou refuse s'il y en a plusieurs. Le solde affiché reste celui du laborantin, comme avant.
- Factures PDF, réseau et contrôle d'email restent sur le middleware Sage / Salesforce : ce ne sont pas des routes galaxy-api.
