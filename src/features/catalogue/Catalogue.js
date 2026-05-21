import React, {useEffect, useState} from "react"
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import {productsSelector} from "../products/ProductsSlice";
import {useGetProductsByCatalogueQuery} from "../../app/services/x3Api";
import {useParams} from "react-router";
import {Col, Container, Row} from "react-bootstrap";
import Paginator from "react-hooks-paginator";
import {SlideDown} from "react-slidedown";
import BreadcrumbOne from "../../common/components/Breadcrumb/BreadcrumbOne";
import {ShopFilter, ShopHeader, ShopProducts, ShopSidebar} from "../../common/components/shop";
import {getSortedProducts} from "../../common/utils/productsFunctions";
import {animateScroll} from "react-scroll";
import {Link} from "react-router-dom"


const Catalogue = () => {
    const {t} = useTranslation();
    const {allProducts} = useSelector(productsSelector);

    const [layout, setLayout] = useState("grid four-column");
    const [sortType, setSortType] = useState("");
    const [sortValue, setSortValue] = useState("");
    const [filterSortType, setFilterSortType] = useState("");
    const [filterSortValue, setFilterSortValue] = useState("");
    const [offset, setOffset] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentData, setCurrentData] = useState([]);
    const [sortedProducts, setSortedProducts] = useState([]);
    const [shopTopFilterStatus, setShopTopFilterStatus] = useState(false);

    const pageLimit = 16;

    const getLayout = (layout) => {
        setLayout(layout);
    };


    const scrollToTop = () => {
        animateScroll.scrollToTop({
            duration: 0
        });
    };

    const getSortParams = (sortType, sortValue) => {
        setSortType(sortType);
        setSortValue(sortValue);
    };

    const getFilterSortParams = (sortType, sortValue) => {
        setFilterSortType(sortType);
        setFilterSortValue(sortValue);
    };

    useEffect(() => {
        if (allProducts && allProducts.length > 0) {
            let sortedProducts = getSortedProducts(allProducts, sortType, sortValue);
            const filterSortedProducts = getSortedProducts(
                sortedProducts,
                filterSortType,
                filterSortValue
            );
            sortedProducts = filterSortedProducts;
            setSortedProducts(sortedProducts);
            setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
        }
    }, [offset, allProducts, sortType, sortValue, filterSortType, filterSortValue]);


    const {niveau1, niveau2, niveau3, niveau4} = useParams();

    const {data, error, isFetching, isError} = useGetProductsByCatalogueQuery({
        niveau1: niveau1,
        niveau2: niveau2,
        niveau3: niveau3,
        niveau4: niveau4,
    });

    const loc = [niveau1, niveau2, niveau3, niveau4];


    const lastNonNull = decodeURI(loc.filter(x => x != null).slice(-1)[0])

    const indexOfLastNonNull = loc.indexOf(lastNonNull);

    if (isFetching) return <></>;

    if (!data)
        return (
            <div>{t("catalogue.empty")}</div>
        );
    if (isError) return <div>{error}</div>;

    const path = [
        {
            libelle: niveau1,
            path: "/catalogue/" + niveau1
        },
        {
            libelle: niveau2,
            path: "/catalogue/" + niveau1 + "/" + niveau2
        },
        {
            libelle: niveau3,
            path: "/catalogue/" + niveau1 + "/" + niveau2 + "/" + niveau3
        },
        {
            libelle: niveau4,
            path: "/catalogue/" + niveau1 + "/" + niveau2 + "/" + niveau3 + "/" + niveau4
        }
    ]

    return (
        <>
            <BreadcrumbOne
                pageTitle={decodeURIComponent(lastNonNull)}
                backgroundImage="/assets/images/backgrounds/breadcrumb-bg-1.png"
            >
                <ul className="breadcrumb__list">
                    {path.map((location, index) => (
                        location.libelle &&
                        <li>
                            {index !== indexOfLastNonNull ?
                                <Link to={location.path}>
                                    {decodeURIComponent(location.libelle)}
                                </Link>
                                :
                                decodeURIComponent(location.libelle)
                            }
                        </li>
                    ))}
                </ul>
            </BreadcrumbOne>
            <div className="shop-page-content">
                {/* shop page header */}
                <ShopHeader
                    getLayout={getLayout}
                    getFilterSortParams={getFilterSortParams}
                    productCount={allProducts.length}
                    sortedProductCount={currentData.length}
                    shopTopFilterStatus={shopTopFilterStatus}
                    setShopTopFilterStatus={setShopTopFilterStatus}
                    layoutClass="wide"
                />

                {/* shop header filter */}
                <SlideDown closed={!shopTopFilterStatus}>
                    <ShopFilter products={allProducts} getSortParams={getSortParams}/>
                </SlideDown>

                {/* shop page body */}
                <div className="shop-page-content__body space-mt--r130 space-mb--r130">
                    <Container className="wide">
                        <Row>
                            <Col
                                lg={3}
                                className="order-2 order-lg-1 space-mt-mobile-only--50"
                            >
                                {/* shop sidebar */}
                                <ShopSidebar
                                    products={allProducts}
                                    getSortParams={getSortParams}
                                    currentCat={indexOfLastNonNull + 1}
                                    currentStringCat={lastNonNull}
                                    setCurrentPage={setCurrentPage}
                                />
                            </Col>

                            <Col lg={9} className="order-1 order-lg-2">
                                {/* shop products */}
                                <ShopProducts layout={layout} products={currentData}/>

                                {/* shop product pagination */}
                                <div className="pro-pagination-style" onClick={scrollToTop}>
                                    <Paginator
                                        totalRecords={sortedProducts.length}
                                        pageLimit={pageLimit}
                                        pageNeighbours={2}
                                        setOffset={setOffset}
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        pageContainerClass="mb-0 mt-0"
                                        pagePrevText="«"
                                        pageNextText="»"
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </div>
            </div>
        </>
    );
};

export default Catalogue