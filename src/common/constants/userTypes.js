// User type taxonomy — must mirror app/Constants/UserType.php on the backend.

export const USER_TYPE = Object.freeze({
    DISTRIBUTEUR: "DISTRIBUTEUR",
    ADV_INTER:    "ADV_INTER",
    LABORATOIRE:  "LABORATOIRE",
    LDA:          "LDA",
});

export const isDistributor = (user) =>
    Boolean(user && user.user_type === USER_TYPE.DISTRIBUTEUR);

export const isAdvInter = (user) =>
    Boolean(user && user.user_type === USER_TYPE.ADV_INTER);

// Spec §16: anything outside France uses the English UI.
export const shouldUseEnglish = (user) => {
    const country = (user && user.billing_country_code) || "";
    return country !== "" && country.toUpperCase() !== "FR";
};

// Default route per user_type — used by auth redirects after login.
export const defaultRouteForUser = (user) => {
    if (isAdvInter(user)) return "/adv-inter/orders";
    if (isDistributor(user)) return "/distributor";
    return "/profile/account";
};
