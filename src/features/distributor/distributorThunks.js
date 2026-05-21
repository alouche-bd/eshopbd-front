import toast from "react-hot-toast";
import i18n from "../../i18n";
import {addAndSetQuantity, addToCart} from "../cart/cartSlice";
import {x3Api} from "../../app/services/x3Api";

/**
 * Thunk that runs the §5 product-authorization check before adding a product
 * to the distributor cart. Used by the product list / search / detail pages
 * when the logged-in user is a distributor.
 *
 *   dispatch(addToDistributorCart({product, quantity, user}))
 *
 * Spec rules:
 *   - success === false                 → error toast, do not add
 *   - authorization === false           → "unauthorized" toast, do not add
 *   - authorization === true            → add to cart
 *
 * Translation strings are pulled from i18next directly because thunks live
 * outside the React render tree; the language is already correct because
 * setLanguageFromUser(user) was called after login (see src/i18n.js).
 */
export const addToDistributorCart = ({product, quantity = 1, user}) =>
    async (dispatch) => {
        const t = i18n.t.bind(i18n);
        const billingCountry = (user && user.billing_country_code) || "";

        if (!billingCountry) {
            toast.error(t("product.checkFailed"));
            return false;
        }

        try {
            const {data, error} = await dispatch(
                x3Api.endpoints.getProductAuthorization.initiate({
                    reference: product.reference,
                    billingCountry,
                }, {forceRefetch: true})
            );

            if (error || !data) {
                toast.error(t("product.checkFailed"));
                return false;
            }
            if (data.success === false) {
                toast.error(data.message || t("product.checkFailed"));
                return false;
            }
            if (data.authorization === false) {
                toast.error(t("product.unauthorized"));
                return false;
            }

            if (quantity > 1) {
                dispatch(addAndSetQuantity({...product, quantity}));
            } else {
                dispatch(addToCart(product));
            }
            toast.success(t("product.added"));
            return true;
        } catch (e) {
            toast.error(t("product.checkFailed"));
            return false;
        }
    };
