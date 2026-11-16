import {
    galaxyApiMode,
    galaxyFrontUrl,
    invoicePdfUrl,
    isNewGalaxyApi,
    isSmileysUnavailable,
    legacySsoToken,
    loginFailureKey,
    orderSmileysAccount,
    readGalaxyCallback,
    smileysArgs,
    smileysPath,
    smileysStatus,
    SMILEYS_STATUS,
} from "./galaxy";

const NEW_MODE = {REACT_APP_GALAXY_API_MODE: "new"};
const LEGACY_MODE = {};

describe("Galaxy API mode", () => {
    it.each([
        ["unset", {}],
        ["empty", {REACT_APP_GALAXY_API_MODE: ""}],
        ["legacy", {REACT_APP_GALAXY_API_MODE: "legacy"}],
        ["unknown", {REACT_APP_GALAXY_API_MODE: "galaxy-api"}],
        ["truthy", {REACT_APP_GALAXY_API_MODE: "true"}],
    ])("is legacy when the variable is %s", (name, env) => {
        expect(galaxyApiMode(env)).toBe("legacy");
        expect(isNewGalaxyApi(env)).toBe(false);
    });

    it("is new only for an explicit new", () => {
        expect(galaxyApiMode(NEW_MODE)).toBe("new");
        expect(isNewGalaxyApi({REACT_APP_GALAXY_API_MODE: " NEW "})).toBe(true);
    });

    it("defaults to legacy in the test build", () => {
        expect(galaxyApiMode()).toBe("legacy");
    });
});

describe("legacy mode", () => {
    const user = {suid: "uuid-1", sfuid: "001G500001JW73MIAT"};

    it("reads the raw ?token= like main", () => {
        expect(legacySsoToken("?token=abc%2Bdef")).toBe("abc%2Bdef");
        expect(legacySsoToken("")).toBeUndefined();
    });

    it("asks the legacy balance route without a Salesforce account", () => {
        expect(smileysArgs(user, LEGACY_MODE)).toEqual({uuid: "uuid-1"});
        expect(smileysPath(smileysArgs(user, LEGACY_MODE))).toBe("getSmileys/uuid-1");
    });

    it("sends no salesforceAccountId with the order", () => {
        expect(orderSmileysAccount(user, null, LEGACY_MODE)).toEqual({});
        expect(orderSmileysAccount(user, {suid: "lab"}, LEGACY_MODE)).toEqual({});
    });

    it("reads the legacy smileys/total body", () => {
        expect(smileysStatus({data: {code: "OK", result: 640}}, LEGACY_MODE)).toBe(SMILEYS_STATUS.OK);
        expect(smileysStatus({data: {code: "ERR-SMY-002"}}, LEGACY_MODE)).toBe(SMILEYS_STATUS.USER_UNKNOWN);
        expect(smileysStatus({}, LEGACY_MODE)).toBe(SMILEYS_STATUS.ERROR);
        expect(smileysStatus({error: {status: 500}}, LEGACY_MODE)).toBe(SMILEYS_STATUS.ERROR);
    });

    it("reports every login failure as invalid credentials", () => {
        expect(loginFailureKey({data: {code: "GALAXY_PARTNER_CLIENT_UNKNOWN"}}, LEGACY_MODE)).toBe("login.invalidCredentials");
        expect(loginFailureKey({data: {code: "GALAXY_USER_INACTIVE"}}, LEGACY_MODE)).toBe("login.invalidCredentials");
    });
});

describe("new mode", () => {
    it("sends the Salesforce account with the order, not for a laboratory client", () => {
        const user = {suid: "uuid-1", sfuid: "001G5"};

        expect(orderSmileysAccount(user, null, NEW_MODE)).toEqual({salesforceAccountId: "001G5"});
        expect(orderSmileysAccount(user, {suid: "lab"}, NEW_MODE)).toEqual({salesforceAccountId: undefined});
    });

    it("does not read a galaxy-api balance as the legacy body", () => {
        expect(smileysStatus({data: {code: "OK", result: 640}}, NEW_MODE)).toBe(SMILEYS_STATUS.ERROR);
        expect(smileysStatus({data: {success: 1, result: 640}}, NEW_MODE)).toBe(SMILEYS_STATUS.OK);
    });
});

describe("galaxy helpers", () => {
    it("reads the Keycloak callback parameters", () => {
        expect(readGalaxyCallback("?state=abc&code=xyz&session_state=s")).toEqual({
            code: "xyz",
            state: "abc",
            error: null,
            token: null,
        });
        expect(readGalaxyCallback("?error=access_denied")).toEqual({
            code: null,
            state: null,
            error: "access_denied",
            token: null,
        });
        expect(readGalaxyCallback("?token=legacy")).toMatchObject({code: null, token: "legacy"});
        expect(readGalaxyCallback("")).toEqual({code: null, state: null, error: null, token: null});
    });

    it("scopes the smiley balance on the user's Salesforce account", () => {
        const args = smileysArgs({suid: "uuid-1", sfuid: "001G500001JW73MIAT"}, NEW_MODE);

        expect(args).toEqual({uuid: "uuid-1", salesforceAccountId: "001G500001JW73MIAT"});
        expect(smileysPath(args)).toBe("getSmileys/uuid-1?salesforceAccountId=001G500001JW73MIAT");
        expect(smileysPath(smileysArgs({suid: "uuid-1"}, NEW_MODE))).toBe("getSmileys/uuid-1");
    });

    it("flags the galaxy-api balance error codes", () => {
        expect(isSmileysUnavailable({success: 0, code: "GALAXY_USER_NOT_FOUND"})).toBe(true);
        expect(isSmileysUnavailable({success: 0, code: "GALAXY_ACCOUNT_UNAVAILABLE"})).toBe(true);
        expect(isSmileysUnavailable({success: 0, code: "GALAXY_ACCOUNT_AMBIGUOUS"})).toBe(true);
        expect(isSmileysUnavailable({success: 0, code: "GALAXY_PARTNER_SCOPE_DENIED"})).toBe(true);
        expect(isSmileysUnavailable({success: 1, result: 120})).toBe(false);
        expect(isSmileysUnavailable(undefined)).toBe(false);
    });

    it("builds configurable Galaxy URLs", () => {
        expect(galaxyFrontUrl({})).toBe("https://www.biotechgalaxy.com/");
        expect(galaxyFrontUrl({REACT_APP_GALAXY_FRONT_URL: "https://galaxy.test/"})).toBe("https://galaxy.test/");
        expect(invoicePdfUrl("001G5", "FAC 1", {})).toBe(
            "https://api-galaxy.biotech-dental.com/api/factureGalaxyPdf/001G5/FAC%201"
        );
        expect(invoicePdfUrl("001G5", "FAC1", {REACT_APP_INVOICE_PDF_BASE_URL: "https://pdf.test/x/"})).toBe(
            "https://pdf.test/x/001G5/FAC1"
        );
    });
});
