import {
    galaxyFrontUrl,
    invoicePdfUrl,
    isSmileysUnavailable,
    readGalaxyCallback,
    smileysArgs,
    smileysPath,
} from "./galaxy";

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
        const args = smileysArgs({suid: "uuid-1", sfuid: "001G500001JW73MIAT"});

        expect(args).toEqual({uuid: "uuid-1", salesforceAccountId: "001G500001JW73MIAT"});
        expect(smileysPath(args)).toBe("getSmileys/uuid-1?salesforceAccountId=001G500001JW73MIAT");
        expect(smileysPath(smileysArgs({suid: "uuid-1"}))).toBe("getSmileys/uuid-1");
    });

    it("flags the galaxy-api balance error codes", () => {
        expect(isSmileysUnavailable({success: 0, code: "GALAXY_USER_NOT_FOUND"})).toBe(true);
        expect(isSmileysUnavailable({success: 0, code: "GALAXY_ACCOUNT_UNAVAILABLE"})).toBe(true);
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
