import recorded from "./__fixtures__/eshop-back-galaxy-responses.json";
import {RESOURCES} from "../i18n/translations";
import {
    SMILEYS_STATUS,
    SMILEYS_UNAVAILABLE_CODES,
    isSmileysUnavailable,
    loginFailureKey,
    smileysMessageKey,
    smileysStatus,
} from "./galaxy";

const NEW_MODE = {REACT_APP_GALAXY_API_MODE: "new"};

const asRtkResult = ({status, body}) =>
    status >= 200 && status < 300 ? {data: body} : {error: {status, data: body}};

const translationOf = (language, key) =>
    key.split(".").reduce((node, part) => node?.[part], RESOURCES[language].translation);

const getSmileysCases = Object.entries(recorded.getSmileys);
const loginCases = Object.entries(recorded.login);

describe("contract with the e-shop back Galaxy routes", () => {
    it("is recorded against the galaxy-api 6e6fc05 contract", () => {
        expect(recorded.source.galaxyApi).toMatch(/6e6fc05/);
    });

    it.each(getSmileysCases)("classifies the getSmileys %s response", (name, response) => {
        const status = smileysStatus(asRtkResult(response), NEW_MODE);

        expect(status).toBe(response.expect);
        expect(Object.values(SMILEYS_STATUS)).toContain(status);
    });

    it.each(getSmileysCases.filter(([, response]) => response.expect !== SMILEYS_STATUS.OK))(
        "has a message in every language for the getSmileys %s response",
        (name, response) => {
            const key = smileysMessageKey(smileysStatus(asRtkResult(response), NEW_MODE));

            ["fr", "en"].forEach((language) => expect(translationOf(language, key)).toEqual(expect.any(String)));
        }
    );

    it("has no error message for a balance", () => {
        expect(smileysMessageKey(smileysStatus(asRtkResult(recorded.getSmileys.balance), NEW_MODE))).toBeNull();
    });

    it("knows every Galaxy code the back can send for the balance", () => {
        const codes = getSmileysCases
            .map(([, response]) => response.body.code)
            .filter((code) => typeof code === "string");

        expect([...codes].sort()).toEqual([...SMILEYS_UNAVAILABLE_CODES].sort());
        codes.forEach((code) => expect(isSmileysUnavailable({success: 0, code})).toBe(true));
    });

    it("keeps an ambiguous Salesforce account apart from an unknown user", () => {
        const ambiguous = smileysStatus(asRtkResult(recorded.getSmileys.accountAmbiguous), NEW_MODE);
        const notMember = smileysStatus(asRtkResult(recorded.getSmileys.accountNotMember), NEW_MODE);
        const unknown = smileysStatus(asRtkResult(recorded.getSmileys.userNotFound), NEW_MODE);

        expect(new Set([ambiguous, notMember, unknown]).size).toBe(3);
        expect(recorded.getSmileys.accountAmbiguous.body.accounts).toBe(2);
    });

    it("does not show a refused partner client as a missing balance", () => {
        expect(smileysStatus(asRtkResult(recorded.getSmileys.partnerClientUnknown), NEW_MODE)).not.toBe(SMILEYS_STATUS.ERROR);
        expect(smileysMessageKey(SMILEYS_STATUS.PARTNER_REFUSED)).toBe("smileys.galaxyUnavailable");
    });

    it.each(loginCases)("maps the %s login response to its message", (name, response) => {
        const {data, error} = asRtkResult(response);
        const key = loginFailureKey(error || data, NEW_MODE);

        expect(key).toBe(response.expect);
        for (const language of ["fr", "en"]) {
            expect(translationOf(language, key)).toEqual(expect.any(String));
        }
    });

    it("never reports a refused partner client as wrong credentials", () => {
        for (const name of ["partnerClientUnknown", "partnerScopeDenied"]) {
            const {error} = asRtkResult(recorded.login[name]);
            expect(loginFailureKey(error, NEW_MODE)).not.toBe("login.invalidCredentials");
        }
    });
});
