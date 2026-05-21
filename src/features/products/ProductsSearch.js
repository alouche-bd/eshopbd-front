import React, {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {x3Api} from "../../app/services/x3Api";
import SearchIcon from "@mui/icons-material/Search";
import styles from "./productsSearch.module.css";
import {Grid} from "@mui/material";
import {importAllImages,} from "../../common/utils/helperFunctions";
import logoBd from "../../assets/img/logos/hexagone_blanc.png";
import CircularProgress from "@mui/material/CircularProgress";
import {useDispatch, useSelector} from "react-redux";
import {setSearchBarClose} from "./ProductsSlice";
import {useHistory} from "react-router";
import CloseIcon from "@mui/icons-material/Close";
import {addToCart, cartSelector, removeFromCart} from "../cart/cartSlice";
import {authSelector} from "../auth/authSlice";
import {addWishlist, removeWishlist, wishlistSelector} from "../wishlist/wishlistSlice";
import {PRODUCT_IMG_BASE} from "../../common/utils/apiConstants";



const ProductsSearch = ({scrolled}) => {
    const dispatch = useDispatch();
    const {t} = useTranslation();

    const [modalShow, setModalShow] = useState(false);

    const {cartItems} = useSelector(cartSelector);

    const {push} = useHistory();

    let ref = useRef(null);

    const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
            dispatch(setSearchBarClose());
        }
    };

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    });

    const [searchResults, setSearchResults] = useState(null);

    const [searchInput, setSearchInput] = useState("");

    const [showProgress, setShowProgress] = useState(false);

    const [trigger, {data, isLoading, isError}] =
        x3Api.endpoints.getProductsBySearchQueryTop.useLazyQuery();

    useEffect(() => {
        if (!isLoading) {
            setShowProgress(false);
        }
        if (!isLoading && data) {
            setSearchResults(data);
        }
        if (!data) {
            setSearchResults(null);
        }
    }, [isLoading, data, searchResults]);

    let lockRequest = false;

    const [timer, setTimer] = useState(null);
    const handleInputChange = (input) => {
        let filterValue = input.trim();

        setSearchInput(input);

        if (filterValue !== "0" && filterValue.length >= 2) {
            if (!lockRequest) {
                lockRequest = true;

                clearTimeout(timer);

                setShowProgress(true);

                const newTimer = setTimeout(() => {
                    try {
                        trigger(filterValue)
                    } catch (error) {
                        // handling in useEffect()
                    }
                }, 600);

                setTimer(newTimer);
            }
        }
    };

    const handleInputChangee = (input) => {
        setSearchInput(input);
        if (input.length > 2) {
            trigger(input);
            setShowProgress(true);
        }
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart(product));
    };
    const handleRemoveFromCart = (product) => {
        dispatch(removeFromCart(product));
    };

    const handleAddWishlist = (product) => {
        dispatch(addWishlist(product));
    };
    const handleRemoveWishlist = (product) => {
        dispatch(removeWishlist(product));
    };

    const {wishlistItems} = useSelector(wishlistSelector)

    const {isAuth} = useSelector(authSelector);

    const handleClick = () => {
        dispatch(setSearchBarClose());
        push(`/search-results?query=${searchInput}`);
    };


    const handleClickOneProduct = (reference) => {
        dispatch(setSearchBarClose());
        push(`/product/${reference}`);
    };

    if (!data || isError) {
        return (
            <div className={styles.searchContainer} ref={ref}>
                <div className={styles.selectCell}>
                    <input
                        autoComplete="off"
                        type="text"
                        name="text"
                        list="product-search"
                        placeholder={t("product.searchBarPlaceholder")}
                        className={styles.searchInput}
                        onChange={(e) => handleInputChange(e.target.value)}
                    />
                    <span className={styles.searchIcon}>
            {" "}
                        {showProgress ? (
                            <CircularProgress color="inherit"/>
                        ) : (
                            <SearchIcon/>
                        )}
          </span>
                </div>
                <>
                    <div className={`${styles.resultsContainer} ${scrolled ? styles.scroll : styles.noScroll}`}>

            <span className={styles.closeSearch}>
              <CloseIcon onClick={() => dispatch(setSearchBarClose())}/>
            </span>
                        <div className={styles.resultsBox}>{searchInput.length < 2 ?
                            <h5 style={{textTransform: "none"}}>
                                {t("product.searchHintMin")}
                            </h5>
                            : isLoading ?
                                <h5 style={{textTransform: "none"}}>
                                    <CircularProgress color="inherit"/>
                                </h5>
                                :
                                <h5 style={{textTransform: "none"}}>
                                    {t("product.searchNoResults")}
                                </h5>
                        }
                        </div>
                    </div>
                </>
            </div>
        );
    }

    const returnCatalogue = (product) => {
        const catalogue = Object.values(product.marketing.catalogue1);
        const removeNull = catalogue.filter(element => {
            return element !== null;
        });
        const encodedCatalogue = removeNull.map((level) => (
            encodeURIComponent(level)
        ));
        return encodedCatalogue.join('/')

    }


    return (
        <div className={styles.searchContainer} ref={ref}>
            <div className={styles.selectCell}>
                <input
                    autoComplete="off"
                    type="text"
                    name="text"
                    list="product-search"
                    placeholder="Que recherchez vous ?"
                    className={styles.searchInput}
                    onChange={(e) => handleInputChange(e.target.value)}
                />
                <span className={styles.searchIcon}>
          {" "}
                    {showProgress ? <CircularProgress color="inherit"/> : <SearchIcon/>}
        </span>
            </div>
            <>
                <div className={`${styles.resultsContainer} ${scrolled ? styles.scroll : styles.noScroll}`}>
          <span className={styles.closeSearch}>
            <CloseIcon onClick={() => dispatch(setSearchBarClose())}/>
          </span>
                    <div className={styles.resultsBox}>
                        {!searchResults && (
                            <h5 style={{textTransform: "none"}}>
                                {t("product.searchNoResults")}
                            </h5>
                        )}
                        {searchResults &&
                            searchResults.slice(0, 4).map((product, index) => (
                                <>
                                    <Grid
                                        container
                                        direction="row"
                                        justifyContent="start"
                                        alignItems="center"
                                        className={styles.cartTableRow}
                                        key={index}
                                    >
                                        <Grid item xs={2}>
                                            <div className={styles.image}>
                                                <img
                                                    src={
                                                        PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".jpg"
                                                            ? PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".jpg"
                                                            : PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".png"
                                                                ? PRODUCT_IMG_BASE + "/" + product.reference.replace('/', '%2F') + ".png"
                                                                : logoBd
                                                    }
                                                    alt={product.reference}
                                                />
                                            </div>
                                        </Grid>
                                        <Grid item xs={5} onClick={() => handleClickOneProduct(product.reference)}
                                              className={styles.hoverRef}>
                                            <p className={styles.ref}
                                            >{product.reference}</p>
                                            <p className={styles.productDesignation}>
                                                {product.reference === '31_322_231_01-2G'
                                                    ? 'Ti-Base à vissage angulé avec sa vis pour pilier conique Ø4 mm'
                                                    :
                                                    product.reference === '31_323_232_01-2G'
                                                        ? 'Ti-Base à vissage angulé avec sa vis pour pilier conique Ø 4,9 mm'
                                                        :
                                                        product.designation}
                                            </p>
                                            {product.marketing && <p className={styles.productCat}>

                                                {decodeURIComponent(returnCatalogue(product)).toLowerCase()}


                                            </p>}
                                        </Grid>
                                        <Grid item xs={1}>
                                            {isAuth &&
                                                <p className={styles.productDesignation}>
                                                    {product.puttc} €
                                                </p>
                                            }
                                        </Grid>
                                        <Grid item xs={2}>
                                            {cartItems.filter(
                                                (cartItem) => cartItem.reference === product.reference
                                            )[0] ?
                                                <button
                                                    onClick={() => handleRemoveFromCart(product)}
                                                    className="lezada-button--green  lezada-button--medium"
                                                >
                                                    {t("product.removeFromCart")}
                                                </button>
                                                :
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="lezada-button  lezada-button--medium"
                                                >
                                                    {t("product.addToCart")}
                                                </button>
                                            }
                                        </Grid>
                                        <Grid item xs={2}></Grid>
                                    </Grid>
                                </>
                            ))}
                        {searchResults && (
                            <button
                                onClick={handleClick}
                                className="lezada-button  lezada-button--medium mt-5"
                            >
                                {t("product.seeAllResults")}
                            </button>
                        )}
                    </div>
                </div>
            </>
        </div>
    );
};

export default ProductsSearch;
