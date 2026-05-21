import React, {useEffect, useState} from "react";
import {Container} from "@mui/material";
import {useLocation} from "react-router";
import {x3Api} from "../../app/services/x3Api";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import {useSelector} from "react-redux";
import {productsSelector} from "./ProductsSlice";
import {animateScroll} from "react-scroll";
import {getSortedProducts} from "../../common/utils/productsFunctions";
import {ShopHeader, ShopProducts} from "../../common/components/shop";
import {Col, Row} from "react-bootstrap";
import Paginator from "react-hooks-paginator";

const useQuery = () => {
    const {search} = useLocation();
    return search.split("?query=")[1];
};

const ProductSearchResults = () => {

    const searchQuery = useQuery();

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
        let sortedProducts = getSortedProducts(allProducts, sortType, sortValue);
        const filterSortedProducts = getSortedProducts(
            sortedProducts,
            filterSortType,
            filterSortValue
        );
        sortedProducts = filterSortedProducts;
        setSortedProducts(sortedProducts);
        setCurrentData(sortedProducts.slice(offset, offset + pageLimit));
    }, [offset, allProducts, sortType, sortValue, filterSortType, filterSortValue]);


    const [trigger, {data, isLoading, isError, originalArgs}] =
        x3Api.endpoints.getProductsBySearchQuery.useLazyQuery();

    useEffect(() => {
        if (searchQuery) {
            trigger(searchQuery)
        }
    }, [searchQuery]);


    if (isLoading) return <></>;
    if (!data)
        return (
            <div>
                <p>
                    <CloudOffIcon/>
                    Aucun produit
                </p>
            </div>
        );
    if (isError) return <div>Quelque chose s'est mal passé</div>;
    return (
        <>
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

                {/* shop page body */}
                <div className="shop-page-content__body space-mt--r130 space-mb--r130">
                    <Container className="wide">
                        <Row>

                            <Col>
                                {/* shop products */}
                                <ShopProducts layout="list" products={currentData} search={true}/>

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

export default ProductSearchResults;
