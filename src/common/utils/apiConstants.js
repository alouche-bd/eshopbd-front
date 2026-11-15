const ENV = "DEV";
export const ROOT_URL_LUMEN =
    ENV === "DEV"
        ? ("https://eshopbd-back-production.up.railway.app/api/")
        : ("https://api.shop.biotech-dental.com/api/");
export const BASE_BDD = "BDRCT";

// CDN base for product images. Files there are keyed by product reference,
// e.g. `<PRODUCT_IMG_BASE>/<reference>.jpg`. No trailing slash; callers add
// the separator + file name themselves. Override via REACT_APP_PRODUCT_IMG_BASE
// in Railway → Variables if the CDN URL ever changes.
export const PRODUCT_IMG_BASE = "https://1-files-biotech-dental-clt-cdn.secure4all.xyz/data/Eshop_bd";
