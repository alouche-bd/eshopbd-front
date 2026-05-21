// get products
export const getProducts = (products, category, type, limit) => {
    const finalProducts = category ? products.filter((product) => product.category.filter((single) => single === category)[0]) : products;
    return (finalProducts && finalProducts.slice(0, limit ? limit : finalProducts.length));
};

// get product discount price
export const getDiscountPrice = (price, discount) => {
    return discount && discount > 0 ? price - price * (discount / 100) : price;
};

// get product cart quantity
export const getProductCartQuantity = (cartItems, product, color, size) => {
    let productInCart = cartItems.filter((single) => single.id === product.id && (single.selectedProductColor ? single.selectedProductColor === color : true) && (single.selectedProductSize ? single.selectedProductSize === size : true))[0];
    if (cartItems.length >= 1 && productInCart) {
        if (product.variation) {
            return cartItems.filter((single) => single.id === product.id && single.selectedProductColor === color && single.selectedProductSize === size)[0].quantity;
        } else {
            return cartItems.filter((single) => product.id === single.id)[0].quantity;
        }
    } else {
        return 0;
    }
};

//get products based on category
export const getSortedProducts = (products, sortType, sortValue) => {
    if (products && sortType && sortValue) {
        if (sortType === "category") {
            return products.filter((product) => {
                if (Array.isArray(sortValue)) {
                    if (sortValue.length === 2) {
                        return ((Object.values(product.marketing.catalogue1).includes(sortValue[0]) && Object.values(product.marketing.catalogue1).includes(sortValue[1])) || (product.marketing.catalogue2 && Object.values(product.marketing.catalogue2).includes(sortValue[0]) && Object.values(product.marketing.catalogue2).includes(sortValue[1])) || (product.marketing.catalogue3 && Object.values(product.marketing.catalogue3).includes(sortValue[0]) && Object.values(product.marketing.catalogue3).includes(sortValue[1]))

                        )
                    }
                    if (sortValue.length === 3) {
                        return ((Object.values(product.marketing.catalogue1).includes(sortValue[0]) && Object.values(product.marketing.catalogue1).includes(sortValue[1]) && Object.values(product.marketing.catalogue1).includes(sortValue[2])) || (product.marketing.catalogue2 && Object.values(product.marketing.catalogue2).includes(sortValue[0]) && Object.values(product.marketing.catalogue2).includes(sortValue[1]) && Object.values(product.marketing.catalogue2).includes(sortValue[2])) || (product.marketing.catalogue3 && Object.values(product.marketing.catalogue3).includes(sortValue[0]) && Object.values(product.marketing.catalogue3).includes(sortValue[1]) && Object.values(product.marketing.catalogue3).includes(sortValue[2])))
                    }
                } else {
                    return ((Object.values(product.marketing.catalogue1).filter((single) => single === sortValue)[0]) || (product.marketing.catalogue2 && Object.values(product.marketing.catalogue2).filter((single) => single === sortValue)[0]) || (product.marketing.catalogue3 && Object.values(product.marketing.catalogue3).filter((single) => single === sortValue)[0]))
                }
            });
        }
        if (sortType === "corps") {
            return products.filter((product) => product.diametrecorp === sortValue);
        }
        if (sortType === "angul") {
            return products.filter((product) => product.angulation === sortValue);
        }
        if (sortType === "taille") {
            return products.filter((product) => product.taille === sortValue);
        }
        if (sortType === "col") {
            return products.filter((product) => product.col === sortValue);
        }
        if (sortType === "ext") {
            return products.filter((product) => product.diamexterne === sortValue);
        }
        if (sortType === "longueur") {
            return products.filter((product) => product.longueur === sortValue);
        }
        if (sortType === "hauteur") {
            return products.filter((product) => product.hauteur === sortValue);
        }
        if (sortType === "ref") {
            return products.filter((product) => product.reference.toLowerCase().startsWith(sortValue));
        }
        if (sortType === "tag") {
            return products.filter((product) => product.famille === sortValue);
        }
        if (sortType === "size") {
            return products.filter((product) => product.variation && product.variation.filter((single) => single.size.filter((single) => single.name === sortValue)[0])[0]);
        }
        if (sortType === "filterSort") {
            let sortProducts = [...products];
            if (sortValue === "default") {
                return sortProducts;
            }
            if (sortValue === "priceHighToLow") {
                return sortProducts.sort((a, b) => {
                    return b.puttc - a.puttc;
                });
            }
            if (sortValue === "priceLowToHigh") {
                return sortProducts.sort((a, b) => {
                    return a.puttc - b.puttc;
                });
            }
            if (sortValue === "refHighToLow") {
                return sortProducts.sort((a, b) => {
                    return a.reference.localeCompare(b.reference);
                });
            }
            if (sortValue === "refLowToHigh") {
                return sortProducts.sort((a, b) => {
                    return b.reference.localeCompare(a.reference);
                });
            }
        }
    }
    return products;
};

// get individual element
const getIndividualItemArray = (array) => {
    let individualItemArray = array.filter((v, i, self) => i === self.indexOf(v));
    return individualItemArray;
};

const isObject = (obj) => obj != null && obj.constructor.name === "Object";

function removeKeys(obj, keys) {
    let index;
    for (const prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            switch (typeof (obj[prop])) {
                case 'string':
                    index = keys.indexOf(prop);
                    if (index > -1) {
                        delete obj[prop];
                    }
                    break;
                case 'object':
                    index = keys.indexOf(prop);
                    if (index > -1) {
                        delete obj[prop];
                    } else {
                        removeKeys(obj[prop], keys);
                    }
                    break;
            }
        }
    }
}


function nestGroupsBy(arr, properties) {
    properties = Array.from(properties);
    if (properties.length === 1) {
        return groupBy(arr, properties[0]);
    }
    const property = properties.shift();
    var grouped = groupBy(arr, property);
    for (let key in grouped) {
        grouped[key] = nestGroupsBy(grouped[key], Array.from(properties));
    }
    removeKeys(grouped, "undefined");
    return grouped;
}

function groupBy(conversions, property) {
    return conversions.reduce((acc, obj) => {
        let key = obj[property];
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(obj);
        return acc;
    }, {});
}

// get individual categories
export const getIndividualCategories = (products, currentCat, currenStringCat) => {
    let productCategories = [];
    let properties = ['niv1', 'niv2', 'niv3', 'niv4', 'niv5', 'niv6', 'niv7'];
    let currentNiv = properties[currentCat - 1];
    let slicedProperties = properties.slice(currentCat);
    products && products.map((product) => {
        const catalogue1 = product.marketing.catalogue1;
        const catalogue2 = product.marketing.catalogue2;
        const catalogue3 = product.marketing.catalogue3;
        if (catalogue1[currentNiv] && catalogue1[currentNiv] === decodeURIComponent(currenStringCat).trim()) {
            return productCategories.push(catalogue1);
        } else if (catalogue2 && catalogue2[currentNiv] && catalogue2[currentNiv] === decodeURIComponent(currenStringCat).trim()) {
            return productCategories.push(catalogue2);
        } else if (catalogue3 && catalogue3[currentNiv] && catalogue3[currentNiv] === decodeURIComponent(currenStringCat).trim()) {
            return productCategories.push(catalogue3);
        }
    });

    return nestGroupsBy(productCategories, slicedProperties);
};

// get individual tags
export const getIndividualTags = (products) => {
    let productTags = [];
    products && products.map((product) => {
        return (productTags.push(product.famille)

        );
    });
    const individualProductTags = getIndividualItemArray(productTags);
    return individualProductTags;
};

// get individual tags
export const getIndividualDiamCorps = (products) => {
    let productDiamCorp = [];
    products && products.map((product) => {
        if (product.diametrecorp !== "" && product.diametrecorp !== ".000" && product.diametrecorp !== 'diam贲e commun') {
            return (productDiamCorp.push(product.diametrecorp)

            )
        }

    });
    const individualProductDiamCorps = getIndividualItemArray(productDiamCorp);
    return individualProductDiamCorps.sort(function (a, b) {
        return b - a
    }).reverse();
};

// get individual tags
export const getIndividualhauteur = (products) => {
    let productDiamCorp = [];
    products && products.map((product) => {
        if (product.hauteur !== "" && product.hauteur !== ".000") {

            return (productDiamCorp.push(product.hauteur)

            )
        }

    });
    const individualProductDiamCorps = getIndividualItemArray(productDiamCorp);
    return individualProductDiamCorps.sort(function (a, b) {
        return b - a
    }).reverse();
};

// get individual tags
export const getIndividualLongueur = (products) => {
    let productDiamCorp = [];
    products && products.map((product) => {
        if (product.longueur !== "" && product.longueur !== ".000") {
            return (productDiamCorp.push(product.longueur)

            )
        }

    });
    const individualProductDiamCorps = getIndividualItemArray(productDiamCorp);
    return individualProductDiamCorps.sort(function (a, b) {
        return b - a
    }).reverse();
};

// get individual tags
export const getIndividualDiamExt = (products) => {
    let productDiamCorp = [];
    products && products.map((product) => {
        if (product.diamexterne !== "" && product.diamexterne !== ".000") {
            return (

                productDiamCorp.push(product.diamexterne)

            )
        }

    });
    const individualProductDiamCorps = getIndividualItemArray(productDiamCorp);
    return individualProductDiamCorps.sort(function (a, b) {
        return b - a
    }).reverse();
};

// get individual tags
export const getIndividualTaille = (products) => {
    let productDiamCorp = [];
    products && products.map((product) => {
        if (product.taille !== "" && product.taille !== ".000") {
            return (productDiamCorp.push(product.taille)

            )
        }

    });
    const individualProductDiamCorps = getIndividualItemArray(productDiamCorp);
    const order = ["COURT", "NORMAL", "MOYEN", "LONG"];

    const orderedArray = individualProductDiamCorps.sort((a, b) => {
        return order.indexOf(a) - order.indexOf(b)
    })
    return orderedArray;
};


// get individual tags
export const getIndividualAngul = (products) => {
    let productDiamCorp = [];
    products && products.map((product) => {
        if (product.angulation !== "" && product.angulation !== ".000") {
            return (

                productDiamCorp.push(product.angulation)

            )
        }

    });
    const individualProductDiamCorps = getIndividualItemArray(productDiamCorp);
    return individualProductDiamCorps.sort(function (a, b) {
        return b - a
    }).reverse();
};
// get individual tags
export const getIndividualDiamCol = (products) => {
    let productDiamCorp = [];
    products && products.map((product) => {
        if (product.col !== "" && product.col !== ".000") {
            return (productDiamCorp.push(product.col)

            )
        }

    });
    const individualProductDiamCorps = getIndividualItemArray(productDiamCorp);
    const order = ["S", "M", "L", "XL"];

    const orderedArray = individualProductDiamCorps.sort((a, b) => {
        return order.indexOf(a) - order.indexOf(b)
    })
    return orderedArray;
};

// get individual sizes
export const getProductsIndividualSizes = (products) => {
    let productSizes = [];
    products && products.map((product) => {
        return (product.variation && product.variation.map((single) => {
            return single.size.map((single) => {
                return productSizes.push(single.name);
            });
        }));
    });
    const individualProductSizes = getIndividualItemArray(productSizes);
    return individualProductSizes;
};

// get product individual sizes
export const getIndividualSizes = (product) => {
    let productSizes = [];
    product.variation && product.variation.map((singleVariation) => {
        return (singleVariation.size && singleVariation.size.map((singleSize) => {
            return productSizes.push(singleSize.name);
        }));
    });
    const individualSizes = getIndividualItemArray(productSizes);
    return individualSizes;
};

export const setActiveSort = (e) => {
    const filterButtons = document.querySelectorAll(".single-sidebar-widget__list button, .tag-container button, .single-filter-widget__list button");
    filterButtons.forEach((item) => {
        item.classList.remove("active");
    });
    e.currentTarget.classList.add("active");
};

export const setActiveLayout = (e) => {
    const gridSwitchBtn = document.querySelectorAll(".grid-icons button");
    gridSwitchBtn.forEach((item) => {
        item.classList.remove("active");
    });
    e.currentTarget.classList.add("active");
};