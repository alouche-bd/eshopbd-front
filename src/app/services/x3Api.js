import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import {ROOT_URL_LUMEN} from "../../common/utils/apiConstants";
import {returnNewDesignation} from "../../common/utils/designations";

export const x3Api = createApi({
    reducerPath: "x3Api",
    baseQuery: fetchBaseQuery({
        baseUrl: ROOT_URL_LUMEN + "middleware/",
    }),
    tagTypes: ["Addresses", "Bills", "Products", "Orders"],
    endpoints: (build) => ({
        getAllAddresses: build.query({
            query: (clientCode) =>
                `shippingAddresses/${clientCode}`,
            keepUnusedDataFor: 3600,
            providesTags: (result) =>
                result
                    ? [
                        result.adresseslivraison.adresselivraison.map(({numero}) => ({
                            type: "Addresses",
                            numero,
                        })),
                        {type: "Addresses", numero: "LIST"},
                    ]
                    : [{type: "Addresses", numero: "LIST"}],
        }),
        getBillStatus: build.query({
            query: (billNumber) =>
                `billingStatus/${billNumber}`,
        }),
        getAllBills: build.query({
            query: (clientCode) =>
                `bills/${clientCode}`,
            transformResponse: (response) => {
                if (response.nbresultats > 0) {
                    const newBills = response.documents.document.map((bill) => ({
                        ...bill,
                        id: bill.numero,
                    }));
                    return newBills.filter((bill) => bill.totalttc !== 0);
                } else {
                    return false;
                }
            },
            keepUnusedDataFor: 3600,
        }),
        getAllCredits: build.query({
            query: (clientCode) =>
                `credits/${clientCode}`,
            transformResponse: (response) => {
                if (response.nbresultats > 0) {
                    const newCredits = response.documents.document.map((credit) => ({
                        ...credit,
                        id: credit.numero,
                    }));
                    return newCredits;
                } else {
                    return false;
                }
            },
            keepUnusedDataFor: 3600,
        }),
        getSmileys: build.query({
            query: (uuid) =>
                `getSmileys/${uuid}`,
        }),
        postConsumeSmileys: build.mutation({
            query(body) {
                return {
                    url: `consume-smileys`,
                    method: "POST",
                    body
                };
            },
        }),
        GetNetwork: build.query({
            query: (sfid) =>
                `get-network-links/${sfid}`,
            transformResponse: (response) => {
                if (response.nbResults > 0) {
                    const clients = response.clients.client.map((c) => ({
                        ...c,
                        id: c.idSageX3,
                    }));

                    return clients.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0))
                } else {
                    return false;
                }
            },
        }),
        getBillsAndStatus: build.query({
            query: (clientCode) =>
                `billsAndStatus/${clientCode}`,
            transformResponse: (response) => {
                if (response.nbresultats > 0) {
                    const newBills = response.documents.document.map((bill) => ({
                        ...bill,
                        id: bill.numero,
                    }));
                    return newBills.filter((bill) => bill.totalttc !== 0);
                } else {
                    return false;
                }
            },
            keepUnusedDataFor: 3600,
        }),
        postGetRepartition: build.mutation({
            query(body) {
                return {
                    url: `repartition`,
                    method: "POST",
                    body
                };
            },
        }),
        postX3Doc: build.mutation({
            query(body) {
                return {
                    url: `document`,
                    method: "POST",
                    body
                };
            },
            invalidatesTags: [{type: "Orders", numero: "LIST"}],
            keepUnusedDataFor: 3600,
        }),
        getX3Doc: build.mutation({
            query(body) {
                return {
                    url: `document`,
                    method: "POST",
                    body
                };
            },
            invalidatesTags: [{type: "Addresses", numero: "LIST"}],
        }),
        postX3Address: build.mutation({
            query(body) {
                return {
                    url: `postAddress`,
                    method: "POST",
                    body
                };
            },
            invalidatesTags: [{type: "Addresses", numero: "LIST"}],
        }),
        getAllShipments: build.query({
            query: (clientCode) =>
                `shipments/${clientCode}`,
            transformResponse: (response) => {
                if (response.length > 0) {
                    const newShipments = response.map((credit) =>
                        credit.numero.startsWith("BIOCO")
                            ? {
                                ...credit,
                                id: credit.numero,
                            }
                            : {
                                ...credit,
                                id: credit.numero,
                                totalht: !credit.numero.startsWith("BIOCO") && !credit.numero.startsWith("WEB") && 0,
                                totalttc: !credit.numero.startsWith("BIOCO") && !credit.numero.startsWith("WEB") && 0,
                            }
                    );
                    return newShipments;
                } else {
                    return false;
                }
            },
            providesTags: (result) =>
                result
                    ? [
                        result.map(({numero}) => ({
                            type: "Orders",
                            numero,
                        })),
                        {type: "Orders", numero: "LIST"},
                    ]
                    : [{type: "Orders", numero: "LIST"}],
        }),
        seeBill: build.query({
            query: ({clientCode, numero}) =>
                `bill/${clientCode}/${numero}`,
        }),
        seeProduct: build.query({
            query: (reference) =>
                `products/${reference}`,
            transformResponse: (response) => {
                if (response.nbresultats > 0) {
                    return response.articles.article.map((prod) => {
                        return returnNewDesignation(prod)
                    })
                }
            },

        }),
        seeCredit: build.query({
            query: ({clientCode, numero}) =>
                `credit/${clientCode}/${numero}`,
        }),
        getAllProducts: build.query({
            query: () => `products`,
            transformResponse: (response) => {
                if (response.nbresultats > 0) {
                    return response.articles.article
                }
            },
            keepUnusedDataFor: 3600,
        }),
        postOrder: build.mutation({
            query(body) {
                return {
                    url: `post-order`,
                    method: "POST",
                    body,
                };
            },
        }),
        postLdaProduct: build.mutation({
            query(body) {
                return {
                    url: `ldaProduct`,
                    method: "POST",
                    body,
                };
            },
        }),
        postOrderLda: build.mutation({
            query(body) {
                return {
                    url: `post-order-lda`,
                    method: "POST",
                    body,
                };
            },
        }),
        confirmOrder: build.mutation({
            query(body) {
                return {
                    url: `confirm-order`,
                    method: "POST",
                    body,
                };
            },
        }),
        askRegistration: build.mutation({
            query(body) {
                return {
                    url: `ask-registration`,
                    method: "POST",
                    body,
                };
            },
        }),
        getProductsByCatalogue: build.query({
            query: (niveau) => {
                const {
                    niveau1,
                    niveau2,
                    niveau3,
                    niveau4,
                    niveau5,
                    niveau6,
                    niveau7,
                } = niveau;
                const returnUrl = () => {
                    let url = `productsByCatalogue/${(
                        niveau1
                    )}`;
                    if (niveau2 !== undefined) {
                        url =
                            url +
                            "/" +
                            (niveau2);
                        if (niveau3 !== undefined) {
                            url =
                                url +
                                "/" +
                                (niveau3);
                            if (niveau4 !== undefined) {
                                url =
                                    url +
                                    "/" +
                                    (niveau4);
                            }
                            if (niveau5 !== undefined) {
                                url =
                                    url +
                                    "/" +
                                    (niveau5);
                            }
                            if (niveau6 !== undefined) {
                                url =
                                    url +
                                    "/" +
                                    (niveau6);
                            }
                            if (niveau7 !== undefined) {
                                url =
                                    url +
                                    "/" +
                                    (niveau7);
                            }
                        }
                    }
                    url = url + ``;
                    return url;
                };
                return {
                    url: returnUrl(),
                };
            },
            transformResponse: (response) => {
                let sortBy = [{
                    prop: 'catalogueniv1',
                    direction: 1
                },
                    {
                        prop: 'catalogueniv2',
                        direction: 1
                    },
                    {
                        prop: 'catalogueniv3',
                        direction: 1
                    },
                    {
                        prop: 'catalogueniv4',
                        direction: 1
                    },
                    {
                        prop: 'diametrecorp',
                        direction: 1
                    }, {
                        prop: 'col',
                        direction: 1
                    },
                    {
                        prop: 'longueur',
                        direction: 1
                    }, {
                        prop: 'hauteur',
                        direction: 1
                    },
                    {
                        prop: 'angulation',
                        direction: 1
                    },
                    {
                        prop: 'taille',
                        direction: 1
                    },
                    {
                        prop: 'diamexterne',
                        direction: 1
                    }];
                const order = ["S", "M", "L", "XL"];
                const orderTwo = ["COURT", "NORMAL", "MOYEN", "LONG"];

                if (response.nbresultats > 0) {
                    const newArray = response.articles.article.filter(
                        (article) => article.puttc !== 0
                    );
                    const newTable = newArray.map((prod) => {
                        return returnNewDesignation(prod)
                    })
                    return newTable.sort(function (a, b) {
                        let i = 0, result = 0;
                        while (i < sortBy.length && result === 0) {

                            if (sortBy[i].prop === 'col') {
                                result = (order.indexOf(a[sortBy[i].prop]) - order.indexOf(b[sortBy[i].prop]));
                            } else if (sortBy[i].prop === 'hauteur' && a.hauteur !== "" && a.hauteur !== ".000") {
                                result = sortBy[i].direction * (parseFloat(a[sortBy[i].prop]) < parseFloat(b[sortBy[i].prop]) ? -1 : (parseFloat(a[sortBy[i].prop]) > parseFloat(b[sortBy[i].prop]) ? 1 : 0));
                            } else if (sortBy[i].prop === 'diametrecorp' && a.diametrecorp !== "" && a.diametrecorp !== ".000") {
                                result = sortBy[i].direction * (parseFloat(a[sortBy[i].prop]) < parseFloat(b[sortBy[i].prop]) ? -1 : (parseFloat(a[sortBy[i].prop]) > parseFloat(b[sortBy[i].prop]) ? 1 : 0));
                            } else if (sortBy[i].prop === 'longueur' && a.longueur !== "" && a.longueur !== ".000") {
                                result = sortBy[i].direction * (parseFloat(a[sortBy[i].prop]) < parseFloat(b[sortBy[i].prop]) ? -1 : (parseFloat(a[sortBy[i].prop]) > parseFloat(b[sortBy[i].prop]) ? 1 : 0));
                            } else if (sortBy[i].prop === 'diamexterne' && a.diamexterne !== "" && a.diamexterne !== ".000") {
                                result = sortBy[i].direction * (parseFloat(a[sortBy[i].prop]) < parseFloat(b[sortBy[i].prop]) ? -1 : (parseFloat(a[sortBy[i].prop]) > parseFloat(b[sortBy[i].prop]) ? 1 : 0));
                            } else if (sortBy[i].prop === 'taille') {
                                result = (orderTwo.indexOf(a[sortBy[i].prop]) - orderTwo.indexOf(b[sortBy[i].prop]));

                            } else if (sortBy[i].prop === 'angul' && a.angulation !== "" && a.angulation !== ".000") {
                                result = sortBy[i].direction * (parseFloat(a[sortBy[i].prop]) < parseFloat(b[sortBy[i].prop]) ? -1 : (parseFloat(a[sortBy[i].prop]) > parseFloat(b[sortBy[i].prop]) ? 1 : 0));
                            } else {
                                result = sortBy[i].direction * (a[sortBy[i].prop] < b[sortBy[i].prop] ? -1 : (a[sortBy[i].prop] > b[sortBy[i].prop] ? 1 : 0));
                            }

                            i++;

                        }
                        return result;
                    })
                }
            },
            keepUnusedDataFor: 5
        }),
        getProductsBySearchQuery: build.query({
            query: (search) =>
                `productsBySearchQuery/${encodeURIComponent(
                    search
                )}`,
            transformResponse: (response) => {
                if (response.nbresultats > 0) {
                    const newArray = response.articles.article.filter(
                        (article) => article.puttc !== 0
                    );
                    return newArray.map((prod) => {
                        return returnNewDesignation(prod)
                    })
                }
            },
            keepUnusedDataFor: 3600,
        }),
        getProductsByCode: build.query({
            query: (search) =>
                `productsByCode/${encodeURIComponent(
                    search
                )}`,
            transformResponse: (response) => {
                console.log(response)
                if (response.nbresultats > 0) {
                    return response.articles.article.map((prod) => {
                        return returnNewDesignation(prod)
                    })
                }
            },
            keepUnusedDataFor: 3600,
        }),
        getProductsBySearchQueryTop: build.query({
            query: (search) =>
                `productsBySearchQueryTop/${encodeURIComponent(
                    search
                )}`,
            transformResponse: (response) => {
                if (response.nbresultats > 0) {
                    const newArray = response.articles.article.filter(
                        (article) => article.puttc !== 0
                    );
                    return newArray.map((prod) => {
                        return returnNewDesignation(prod)
                    })
                }
            },
            keepUnusedDataFor: 3600,
        }),
        getCatalogue: build.query({
            query: () => `catalogue`,
            transformResponse: (response) => {
                if (response.nbresultats > 0) {
                    const newCatalogue = {
                        niveau1: [
                            response.catalogue.niveau1[3],
                            response.catalogue.niveau1[4],
                            response.catalogue.niveau1[6],
                            response.catalogue.niveau1[5],
                            response.catalogue.niveau1[1],
                            response.catalogue.niveau1[2],
                            response.catalogue.niveau1[0],
                        ],
                    };
                    return newCatalogue;
                }
            },
            keepUnusedDataFor: 3600,
        }),
        getEmailExists: build.query({
            query: (email) => `checkEmail/${email}`,
        }),
        getBillLines: build.query({
            query: (arg) =>
                `billLines/${arg.clientCode}/${arg.billNumber}`,
            keepUnusedDataFor: 3600,
        }),
        getOrderLines: build.query({
            query: (arg) =>
                `orderLines/${arg.clientCode}/${arg.id}`,
            keepUnusedDataFor: 3600,
        }),
        getWebOrderLines: build.query({
            query: (arg) =>
                `webOrderLines/${arg.clientCode}/${arg.id}`,
            keepUnusedDataFor: 3600,
        }),
        getSoldCredits: build.query({
            query: (clientCode) =>
                `creditsSold/${clientCode}`,
            transformResponse: (response) => {
                if (response.nbresultats > 0) {
                    const newArray = response.credits.credit.filter(
                        (credit) => credit.libelle !== "OFFERT"
                    );
                    return newArray;
                }
            },
            keepUnusedDataFor: 3600,
        }),
        getTopTenArticles: build.query({
            query: (cat) =>
                `catalogueTopTenProducts/${cat}`,
            transformResponse: (response) => {
                if (response.nbresultats > 0) {
                    return response.articles.article
                }
            },
            keepUnusedDataFor: 3600,
        }),
        getClientInfos: build.query({
            query: (clientCode) =>
                `clientInfos/${clientCode}`,
            keepUnusedDataFor: 3600,
        }),
        getUnlockClient: build.query({
            query: (clientCode) =>
                `unlockClient/${clientCode}`,
            keepUnusedDataFor: 3600,
        }),
        getStockLDA: build.query({
            query: (ref) => `stock-lda/${encodeURIComponent(ref)}`,
            transformResponse: (response) => {
                const newArray = response.batches.batch.filter(
                    (batch) => batch.availableQuantity >= 1
                );
                return {
                    ...response,
                    batches: {
                        batch: newArray,
                    },
                }
            },
        }),

        // ---- Distributor / ADV_INTER endpoints (spec §5, §15, §7, §10–§14) ----

        // §5 — product authorization check before adding to cart for distributors.
        getProductAuthorization: build.query({
            query: ({reference, billingCountry}) =>
                `product-authorization/${encodeURIComponent(reference)}/${encodeURIComponent(billingCountry)}`,
            keepUnusedDataFor: 0, // never cache — authorization can flip per Sage update
        }),

        // §1 — explicit v3 lireInfoClient (used in case the front needs to
        // re-sync without re-logging in).
        getClientInfoV3: build.query({
            query: (clientCode) => `client-info-v3/${encodeURIComponent(clientCode)}`,
        }),
    }),
});

export const {
    useGetAllAddressesQuery,
    useGetAllBillsQuery,
    useSeeBillQuery,
    usePostOrderMutation,
    useGetAllShipmentsQuery,
    useGetProductsByCatalogueQuery,
    useGetCatalogueQuery,
    useGetEmailExistsQuery,
    useGetSoldCreditsQuery,
    useGetTopTenArticlesQuery,
    useGetBillStatusQuery,
    useGetClientInfosQuery,
    useGetBillsAndStatusQuery,
    useGetAllCreditsQuery,
    usePostGetRepartitionMutation,
    useGetDevisQuery,
    useGetProductsBySearchQueryTop,
    useGetProductsBySearchQuery,
    usePostGetProductsBycatalogueMutation,
    usePostX3AddressMutation,
    useGetOrderLinesQuery,
    useGetUnlockClientQuery,
    usePostX3DocMutation,
    useGetSmileysQuery,
    usePostConsumeSmileysMutation,
    useSeeProductQuery,
    useGetWebOrderLinesQuery,
    useConfirmOrderMutation,
    useAskRegistrationMutation,
    useGetNetworkQuery,
    useGetProductsByCodeQuery,
    useGetStockLDAQuery,
    usePostOrderLdaMutation,
    usePostLdaProductMutation,
    useGetProductAuthorizationQuery,
    useLazyGetProductAuthorizationQuery,
    useGetClientInfoV3Query,
} = x3Api;
