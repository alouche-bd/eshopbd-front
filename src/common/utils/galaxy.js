const DEFAULT_GALAXY_FRONT_URL = "https://www.biotechgalaxy.com/";
const DEFAULT_INVOICE_PDF_BASE_URL = "https://api-galaxy.biotech-dental.com/api/factureGalaxyPdf";

export const SMILEYS_UNAVAILABLE_CODES = ["GALAXY_USER_NOT_FOUND", "GALAXY_ACCOUNT_UNAVAILABLE"];

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
