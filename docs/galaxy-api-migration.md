# Migration vers les nouvelles routes galaxy-api (front)

## Pourquoi

L'ancienne LaGalaxy (SSO `ssogalaxy`, API Symfony `api-galaxy`) est remplacée par **galaxy-api** et par Keycloak `s4a`. Le front de l'e-shop n'appelle pas Galaxy directement : il passe par le back Lumen (`eshopbd-back`), qui porte le client galaxy-api. Le front change pour quatre raisons :

- l'arrivée depuis Galaxy n'apporte plus de `?token=` legacy, mais un retour Keycloak `?code=&state=` ;
- le solde de smileys est cloisonné par compte Salesforce : le front envoie `salesforceAccountId` ;
- les codes d'erreur smileys changent, et les refus d'autorisation partenaire (`partner_client`) de galaxy-api doivent être distingués d'un mauvais mot de passe ;
- les URLs Galaxy du front deviennent configurables par environnement.

Les helpers Galaxy du front sont regroupés dans `src/common/utils/galaxy.js`. Les appels HTTP restent dans les services RTK existants (`lumenApi`, `x3Api`).

## Mode legacy / new

Le front ne parle pas à galaxy-api : il parle au back e-shop, mais la forme des appels dépend du mode du back. `REACT_APP_GALAXY_API_MODE` (lu au build par CRA, résolu par `galaxyApiMode()` / `isNewGalaxyApi()` dans `src/common/utils/galaxy.js`) suit donc le `GALAXY_API_MODE` du back :

- `legacy` (**défaut** : valeur absente, vide ou inconnue) : mêmes appels que `main`. `/login-sso` envoie `{token}` lu tel quel dans `?token=` et n'appelle jamais `galaxy/login-url` ; `getSmileys/{suid}` sans `salesforceAccountId` ; `post-order` sans `salesforceAccountId` ; lecture du corps legacy `smileys/total` (`ERR-SMY-002` = utilisateur Galaxy non reconnu) ; tout échec de connexion affiche « identifiants invalides ». Seule différence gardée : un échec de `getSmileys` affiche « Aucun Smileys » au lieu de planter la page (`<div>{error}</div>` sur un objet RTK, corrigé par `c1f0d91`) ;
- `new` (valeur explicite) : le comportement décrit ci-dessous.

La branche peut donc être fusionnée et déployée avant le cutover sans changer le comportement. Le mode du front doit être `new` seulement quand le back l'est aussi.

## Correspondance des appels

| Fichier | Avant | Après | Auth | Changement |
|---|---|---|---|---|
| `src/features/auth/LoginSSO.js` | `POST login-sso {token}` avec le `?token=` du SSO legacy | sans paramètre : `GET galaxy/login-url` puis redirection vers Keycloak `s4a`. Au retour : `POST login-sso {code, state}`, et le back appelle galaxy-api `GET /integrations/eshop/me` | Keycloak (code + PKCE, porté par le back) | `?token=` reste envoyé tel quel (compatibilité avec un back en mode legacy). `?error=` de Keycloak renvoie vers `/login`. Une réponse `success: 0` ou une erreur renvoie vers `/login` avec le message de `loginFailureKey()` (voir « Codes d'erreur »). |
| `src/features/auth/Login.js` | `POST reverse-login-sso {email, password}` vers le SSO legacy | même appel. Le back utilise Keycloak (`grant_type=password`) puis `GET /integrations/eshop/me` | token utilisateur Keycloak | Même appel. Identifiants refusés : HTTP 401 `GALAXY_INVALID_CREDENTIALS` au lieu de 500. Refus partenaire (502) et utilisateur inactif (403) ont leur propre message. |
| `src/features/checkout/Smileys.js`, `src/features/profile/Profile.js` | `GET middleware/getSmileys/{suid}` (proxy de S4A `smileys/total`) | `GET middleware/getSmileys/{suid}?salesforceAccountId={sfuid}`, et le back appelle galaxy-api `GET /integrations/eshop/users/{uuid}/smileys/balance` | `client_credentials` (back) | `result` reste un entier de smileys. `ERR-SMY-002` est remplacé par les codes de « Codes d'erreur », lus par `smileysStatus()`. |
| `src/features/checkout/Recap.js` | `POST middleware/post-order {…, smileyamount, uuid}` (débit S4A `smileys/consume`) | même appel avec `salesforceAccountId: user.sfuid` (absent pour une commande de laboratoire), et le back appelle galaxy-api `POST /integrations/eshop/users/{uuid}/smileys/debits` | `client_credentials` (back) | L'id du panier sert de référence idempotente. |
| `src/common/components/downloadBillCell/downloadBillCell.js` | lien en dur `https://api-galaxy.biotech-dental.com/api/factureGalaxyPdf/{sfuid}/{id}` | `REACT_APP_INVOICE_PDF_BASE_URL` (même valeur par défaut) | — | C'est un proxy Sage X3 du middleware, pas une route galaxy-api : seule l'URL devient configurable. |
| `src/common/components/header/Header.js`, `src/features/auth/askSignUp.js` | lien en dur `https://www.biotechgalaxy.com/` | `REACT_APP_GALAXY_FRONT_URL` (même valeur par défaut) | — | Lien vers galaxy-front, configurable par environnement. |
| `src/common/utils/apiConstants.js` | `URL_OAUTH`, `URL_API_S4A` (Keycloak et S4A legacy, inutilisés) | supprimés | — | — |

## Codes d'erreur

Le back traduit les erreurs galaxy-api en codes `GALAXY_*`. Le front les lit dans `src/common/utils/galaxy.js` : `smileysStatus()` + `smileysMessageKey()` pour le solde, `loginFailureKey()` pour la connexion.

| Réponse du back | Cause côté galaxy-api | Front |
|---|---|---|
| `getSmileys` 200 `{success: 1, result}` | solde | affiché |
| `getSmileys` 200 `GALAXY_USER_NOT_FOUND` / `GALAXY_USER_INACTIVE` | 404 `PARTNER_USER_NOT_FOUND` / 403 `PARTNER_USER_INACTIVE` | `smileys.galaxyNotRecognized` |
| `getSmileys` 200 `GALAXY_ACCOUNT_AMBIGUOUS` (+ `accounts`) | 409 `ACCOUNT_AMBIGUOUS` : plusieurs comptes Salesforce, pas de `salesforceAccountId` | `smileys.accountAmbiguous` |
| `getSmileys` 200 `GALAXY_ACCOUNT_NOT_MEMBER` | 403 `ACCOUNT_NOT_MEMBER` : `user.sfuid` n'est pas un compte de l'utilisateur | `smileys.accountNotMember` |
| `getSmileys` 200 `GALAXY_ACCOUNT_UNAVAILABLE` | autre 403/409 | `smileys.galaxyNotRecognized` |
| `getSmileys` 502 `GALAXY_PARTNER_CLIENT_UNKNOWN` / `GALAXY_PARTNER_SCOPE_DENIED` | 403 : client `biotech-dental-eshop` absent de `partner_client` ou scope manquant | `smileys.galaxyUnavailable` |
| `getSmileys` 502 sans code Galaxy | galaxy-api ou Salesforce indisponible | `smileys.noSmileys` |
| `login-sso` / `reverse-login-sso` 502 `GALAXY_PARTNER_CLIENT_UNKNOWN` / `GALAXY_PARTNER_SCOPE_DENIED` | 403 sur `/integrations/eshop/me` | `login.galaxyUnavailable`, pas « identifiants invalides » |
| `login-sso` / `reverse-login-sso` 403 `GALAXY_USER_INACTIVE` | 403 `PARTNER_USER_INACTIVE` | `login.galaxyInactive` |
| `login-sso` / `reverse-login-sso` 401 `GALAXY_INVALID_CREDENTIALS` | Keycloak refuse, 401 ou utilisateur inconnu | `login.invalidCredentials` |

Le front envoie toujours `salesforceAccountId = user.sfuid` quand il le connaît, ce qui évite `ACCOUNT_AMBIGUOUS` pour le solde. Il ne connaît pas la liste des comptes d'un utilisateur et ne peut donc pas proposer de choix : le message invite à contacter le support.

## Variables d'environnement

Variables lues au build par CRA (sur Railway : variables du service, prises en compte au prochain build). Le script les écrit dans `.env.local`, qui est ignoré par git :

| Variable | Défaut | Rôle |
|---|---|---|
| `REACT_APP_GALAXY_API_MODE` | `legacy` | `legacy` (défaut, valeur absente ou vide) = appels de `main` ; `new` = nouvelles routes du back, à poser au cutover |
| `REACT_APP_GALAXY_FRONT_URL` | `https://www.biotechgalaxy.com/` | lien « LaGalaxy Biotech Dental » |
| `REACT_APP_INVOICE_PDF_BASE_URL` | `https://api-galaxy.biotech-dental.com/api/factureGalaxyPdf` | base des PDF de factures |

Aucun secret côté front. La configuration Keycloak (URL, realm, client, secret, redirect URI) et galaxy-api est portée par le back : voir `docs/galaxy-api-migration.md` de `eshopbd-back`, qui donne aussi la ligne `partner_client` à insérer dans galaxy-api.

## Client Keycloak à créer dans `s4a`

Le même client confidentiel `biotech-dental-eshop` que le back (standard flow + PKCE S256, direct access grants, service account, mapper d'audience galaxy-api, mapper `galaxy_uuid`). Le rôle `SERVICE` n'est plus nécessaire : galaxy-api autorise le client par sa ligne `partner_client` :

```sql
INSERT INTO `partner_client`
  (`clientId`, `name`, `scopes`, `userAccess`, `platformId`, `planetId`, `isActive`, `createdAt`, `updatedAt`)
SELECT 'biotech-dental-eshop', 'Biotech Dental e-shop', '["users:read","smileys:read","smileys:debit"]', 'ANY_USER',
       p.`id`, NULL, 1, CURRENT_TIMESTAMP(3), CURRENT_TIMESTAMP(3)
FROM `platform` p
WHERE p.`code` = 'BIOTECH_DENTAL_E_SHOP'
ON DUPLICATE KEY UPDATE `scopes` = VALUES(`scopes`), `userAccess` = VALUES(`userAccess`),
  `platformId` = VALUES(`platformId`), `isActive` = 1, `updatedAt` = CURRENT_TIMESTAMP(3);
```

`ANY_USER` est obligatoire : le back lit le solde et débite avec un token de compte de service, sans `galaxy_uuid`. Sans cette ligne, galaxy-api répond 403 `PARTNER_CLIENT_UNKNOWN` ; avec un scope manquant ou en `TOKEN_USER`, 403 `PARTNER_SCOPE_DENIED`. Il doit avoir comme redirect URI la page `/login-sso` du front de chaque environnement, par exemple `https://shop.biotech-dental.com/login-sso`.

## Script d'installation

```bash
scripts/setup-galaxy-api.sh                    # interactif
scripts/setup-galaxy-api.sh --non-interactive --mode new      # cutover
scripts/setup-galaxy-api.sh --non-interactive --mode legacy   # rollback
scripts/setup-galaxy-api.sh --non-interactive \
  --eshop-api-url https://eshopbd-back-production.up.railway.app/api \
  --galaxy-api-url https://01.api.new-recette.biotechgalaxy.secure4all.tech \
  --keycloak-url https://01.oauth.recette.biotechgalaxy.secure4all.tech/auth
echo "$SECRET" | scripts/setup-galaxy-api.sh --client-secret-stdin   # valide aussi le secret, sans l'écrire
```

Le script :

1. vérifie `node` et `curl` ;
2. met à jour `.env.local` (idempotent), avec `REACT_APP_GALAXY_API_MODE=legacy` par défaut ;
3. vérifie le realm Keycloak `s4a` (découverte OIDC) et, si un secret est fourni sur stdin, obtient un token `client_credentials` ;
4. appelle `GET /health` de galaxy-api ;
5. en mode `new` seulement, vérifie que le back renvoie une URL de connexion Keycloak (`GET /api/galaxy/login-url`) ;
6. affiche un récapitulatif OK/KO.

## Ordre de déploiement

1. galaxy-api : version avec `partner_client` déployée (validée à `6e6fc05`), ligne `partner_client` insérée ;
2. client Keycloak `biotech-dental-eshop` configuré ;
3. back e-shop `feat/galaxy-api-new-routes` et ce front fusionnés et déployés à l'avance, en `legacy` (aucune variable à poser) : rien ne change ;
4. cutover : `GALAXY_API_MODE=new` sur le back puis redéploiement, puis `REACT_APP_GALAXY_API_MODE=new` sur le front puis nouveau build et redéploiement. Aucun changement de code ;
5. galaxy-front : rien à faire, la planète `biotech` est déjà en stratégie `KEYCLOAK` vers `/login-sso`.

## Rollback

Remettre `REACT_APP_GALAXY_API_MODE=legacy` (ou supprimer la variable) sur le front puis reconstruire et redéployer, et `GALAXY_API_MODE=legacy` sur le back puis redéployer. Le front retrouve exactement les appels de `main`.

Si seul le back repasse en `legacy`, un front resté en `new` reste compatible pour `/login-sso?token=…` (envoyé tel quel) et `salesforceAccountId` (ignoré par le back legacy), mais l'entrée `/login-sso` sans paramètre renvoie vers `/login` (`galaxy/login-url` répond 404) et le solde legacy n'est pas lu : repasser les deux.

## Tests

- `CI=true npm test -- --watchAll=false` : tests du mode (`legacy` par défaut, `new` seulement explicite) et des appels legacy / new dans `src/common/utils/galaxy.test.js` et `src/features/auth/LoginSSO.test.js` (`{token}` sans `galaxy/login-url` en legacy, `galaxy/login-url` puis `{code, state}` en new), tests de `src/common/utils/galaxy.test.js` (lecture du retour Keycloak, construction des URLs, scoping du solde, codes d'erreur) et tests de contrat `src/common/utils/galaxy.contract.test.js`.
- Tests de contrat seuls : `CI=true npx react-scripts test --watchAll=false galaxy.contract`. Ils sont lancés en mode `new` et rejouent les réponses du back enregistrées dans `src/common/utils/__fixtures__/eshop-back-galaxy-responses.json` (back `feat/galaxy-api-new-routes` au commit `1a0733a`, cas de `tests/GalaxyApiContractTest.php`, qui rejoue lui-même galaxy-api `6e6fc05`), telles que RTK Query les présente (`data` en 2xx, `error: {status, data}` sinon), et vérifient le statut, le message fr/en, et que chaque code du back est connu du front. Si le back ajoute un code, mettre à jour la fixture et `galaxy.js`.
- `npm run build`.
- Recette manuelle : planète Biotech Dental depuis galaxy-front, connexion par `/login`, solde et débit de smileys au checkout, téléchargement d'une facture.

## Écarts connus

- Les comptes doivent avoir un mot de passe dans Keycloak `s4a` (voir le doc du back).
- Le formulaire `/login` envoie encore le mot de passe au back (direct grant Keycloak). La cible est de le remplacer par une redirection vers `/login-sso`.
- Commande pour un client de laboratoire : le compte Salesforce du client final n'est pas connu du front ; galaxy-api prend le compte unique ou refuse s'il y en a plusieurs (409 `ACCOUNT_AMBIGUOUS`, journalisé par le back, la commande n'est pas bloquée). Le solde affiché reste celui du laborantin, comme avant.
- Pas de sélection de compte Salesforce dans le front : `GALAXY_ACCOUNT_AMBIGUOUS` affiche un message, sans choix possible.
- Factures PDF, réseau et contrôle d'email restent sur le middleware Sage / Salesforce : ce ne sont pas des routes galaxy-api.
