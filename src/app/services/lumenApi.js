import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ROOT_URL_LUMEN} from "../../common/utils/apiConstants";

const baseQuery = fetchBaseQuery({
    baseUrl: ROOT_URL_LUMEN,
    prepareHeaders: (headers, {getState}) => {
        const lumenToken = getState().auth.lumenToken;
        if (lumenToken) {
            headers.set("authorization", `Bearer ${lumenToken}`);
        }
        return headers;
    },
});

export const lumenApi = createApi({
    reducerPath: "lumenApi",
    baseQuery: baseQuery,
    tagTypes: ["Wishlists", "Auth", "Orders"],
    endpoints: (build) => ({
        postLoginLumen: build.mutation({
            query(body) {
                return {
                    url: "login-sso",
                    method: "POST",
                    body,
                };
            },
        }),
        postAdminLogin: build.mutation({
            query(body) {
                return {
                    url: "login-admin",
                    method: "POST",
                    body,
                };
            },
        }),
        postReverseLogin: build.mutation({
            query(body) {
                return {
                    url: "reverse-login-sso",
                    method: "POST",
                    body,
                };
            },
        }),
        getLogout: build.query({
            query: () => "logout",
        }),
        getRefreshJwt: build.query({
            query: () => "logout",
        }),
        postOrderConfirm: build.mutation({
            query(body) {
                return {
                    url: "order",
                    method: "POST",
                    body,
                };
            },
        }),
        getWishlists: build.query({
            query: () => "wishlist",
            providesTags: (result) =>
                result
                    ? [
                        result.wishlist.map(({id}) => ({type: "Wishlists", id})),
                        {type: "Wishlists", id: "LIST"},
                    ]
                    : [{type: "Wishlists", id: "LIST"}],
        }),
        getWishlist: build.query({
            query: (id) => `wishlist/${id}`,
            providesTags: (result, error, id) => [{type: "Wishlists", id}],
        }),
        postWishlist: build.mutation({
            query(body) {
                return {
                    url: "wishlist",
                    method: "POST",
                    body,
                };
            },
            invalidatesTags: [{type: "Wishlists", id: "LIST"}],
        }),
        updateWishlist: build.mutation({
            query(data) {
                const {id, ...body} = data;
                return {
                    url: `wishlist/${id}`,
                    method: "PUT",
                    body,
                };
            },
            invalidatesTags: (result, error, {id}) => [
                {type: "Wishlists", id},
                {type: "Wishlists", id: "LIST"},
            ],
        }),
        deleteWishlist: build.mutation({
            query(id) {
                return {
                    url: `wishlist/${id}`,
                    method: "DELETE",
                };
            },
            invalidatesTags: (result, error, {id}) => [
                {type: "Wishlists", id},
                {type: "Wishlists", id: "LIST"},
            ],
        }),
        updatePassword: build.mutation({
            query(body) {
                return {
                    url: "update-password",
                    method: "POST",
                    body,
                };
            },
        }),
        postOrder: build.mutation({
            query(body) {
                return {
                    url: "order",
                    method: "POST",
                    body,
                };
            },
            invalidatesTags: [{type: "Orders", id: "LIST"}],
        }),
        getOrders: build.query({
            query: () => "order",
            providesTags: (result) =>
                result
                    ? [
                        result.order.map(({id}) => ({type: "Orders", id})),
                        {type: "Orders", id: "LIST"},
                    ]
                    : [{type: "Orders", id: "LIST"}],
        }),
        getOrder: build.query({
            query: (id) => `order/${id}`,
            providesTags: (result, error, id) => [{type: "Orders", id}],
        }),

        // ---- Distributor / ADV_INTER endpoints (spec §7, §10–§14) ----
        postDistributorOrder: build.mutation({
            query(body) {
                return {url: "distributor/order", method: "POST", body};
            },
            // Bust the LIST cache AND the distributor-pending cache so the
            // freshly-created order shows up on /profile/shipments without
            // a manual reload.
            invalidatesTags: [
                {type: "Orders", id: "LIST"},
                {type: "Orders", id: "DIST_PENDING"},
            ],
        }),
        getMyPendingDistributorOrders: build.query({
            query: () => "distributor/my-pending-orders",
            providesTags: [{type: "Orders", id: "DIST_PENDING"}],
        }),
        getAdvInterOrders: build.query({
            query: (params = {}) => ({
                url: "adv-inter/orders",
                params,   // {search, status, sort, direction, page, per_page}
            }),
            providesTags: [{type: "Orders", id: "ADV"}],
        }),
        getAdvInterOrder: build.query({
            query: (id) => `adv-inter/orders/${id}`,
            providesTags: (result, error, id) => [{type: "Orders", id: `ADV-${id}`}],
        }),
        updateAdvInterOrder: build.mutation({
            query: ({id, body}) => ({
                url: `adv-inter/orders/${id}`,
                method: "PUT",
                body,
            }),
            invalidatesTags: (result, error, {id}) => [
                {type: "Orders", id: "ADV"},
                {type: "Orders", id: `ADV-${id}`},
            ],
        }),
        getAdvInterZsohPreview: build.query({
            query: (id) => `adv-inter/orders/${id}/preview-zsoh`,
        }),
        postAdvInterSend: build.mutation({
            query(id) {
                return {url: `adv-inter/orders/${id}/send`, method: "POST"};
            },
            invalidatesTags: [{type: "Orders", id: "ADV"}],
        }),
        postAdvInterUpload: build.mutation({
            query(formData) {
                return {
                    url: "adv-inter/upload",
                    method: "POST",
                    body: formData,
                    formData: true,
                };
            },
        }),
        postAdvInterCreateOrder: build.mutation({
            query(body) {
                return {url: "adv-inter/orders", method: "POST", body};
            },
            invalidatesTags: [{type: "Orders", id: "ADV"}],
        }),
        archiveAdvInterOrder: build.mutation({
            query(id) {
                return {url: `adv-inter/orders/${id}/archive`, method: "POST"};
            },
            invalidatesTags: [{type: "Orders", id: "ADV"}],
        }),
        unarchiveAdvInterOrder: build.mutation({
            query(id) {
                return {url: `adv-inter/orders/${id}/unarchive`, method: "POST"};
            },
            invalidatesTags: [{type: "Orders", id: "ADV"}],
        }),
        duplicateAdvInterOrder: build.mutation({
            query(id) {
                return {url: `adv-inter/orders/${id}/duplicate`, method: "POST"};
            },
            invalidatesTags: [{type: "Orders", id: "ADV"}],
        }),
    }),
});

export const {
    useGetWishlistQuery,
    usePostWishlistMutation,
    useDeleteWishlistMutation,
    useUpdateWishlistMutation,
    useGetWishlistsQuery,
    usePostLoginLumenMutation,
    usePostRegisterLumenMutation,
    useUpdatePasswordMutation,
    usePostForgotPasswordMutation,
    usePostSendNewPasswordMutation,
    usePostReverseLoginMutation,
    usePostAttachSSOMutation,
    usePostOrderConfirmMutation,
    usePostAdminLoginMutation,
    usePostOrderMutation,
    useGetOrderQuery,
    useGetOrdersQuery,
    usePostDistributorOrderMutation,
    useGetMyPendingDistributorOrdersQuery,
    useGetAdvInterOrdersQuery,
    useGetAdvInterOrderQuery,
    useUpdateAdvInterOrderMutation,
    useGetAdvInterZsohPreviewQuery,
    usePostAdvInterSendMutation,
    usePostAdvInterUploadMutation,
    usePostAdvInterCreateOrderMutation,
    useArchiveAdvInterOrderMutation,
    useUnarchiveAdvInterOrderMutation,
    useDuplicateAdvInterOrderMutation,
} = lumenApi;
