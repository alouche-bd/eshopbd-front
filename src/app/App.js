import React, {useEffect} from "react";
import Container from "@mui/material/Container";
import {Redirect, Route, Switch} from "react-router";
import {setLanguageFromUser} from "../i18n";
import {authSelector} from "../../src/features/auth/authSlice";
import {isAdvInter, isDistributor} from "../../src/common/constants/userTypes";
import Header from "../../src/common/components/header/Header";
import Footer from "../../src/common/components/footer/Footer";
import Home from "../../src/common/pages/Home";
import Cart from "../../src/features/cart/Cart";
import NotFound from "../../src/common/pages/NotFound";
import {Toaster} from "react-hot-toast";
import ProfileDashboard from "../../src/features/profile/ProfileDashboard";
import SessionWishlist from "../../src/features/wishlist/SessionWishlist";
import StoredWishlist from "../../src/features/wishlist/StoredWishlist";
import Login from "../../src/features/auth/Login";
import Register from "../../src/features/auth/Register";
import PrivateRoute from "../../src/common/components/PrivateRoute";
import {useSelector} from "react-redux";
import Spinner from "../../src/common/components/spinner/Spinner";
import LoginSSO from "../../src/features/auth/LoginSSO";
import AddressForm from "../../src/features/addresses/AddressForm";
import Shipment from "../../src/features/shipments/Shipment";
import Recap from "../../src/features/checkout/Recap";
import ProductSearchResults from "../../src/features/products/ProductsSearchResults";
import Catalogue from "../features/catalogue/Catalogue";
import ScrollToTop from "../common/utils/scrollTop";
import OneProduct from "../features/products/OneProduct";
import ShipmentWeb from "../features/shipments/ShipmentWeb";
import AskSignUp from "../features/auth/askSignUp";
import AdminLogin from "../features/auth/AdminLogin";
import LabCart from "../features/cart/LabCart";
import LDACart from "../features/cart/LDA/LDACart";
import RecapLda from "../features/checkout/LDA/RecapLDA";
import ShipmentLda from "../features/shipments/LDA/ShipmentLda";
import DistributorCart from "../features/distributor/DistributorCart";
import DistributorCheckout from "../features/distributor/DistributorCheckout";
import AdvInterUpload from "../features/advInter/AdvInterUpload";
import AdvInterOrderEditor from "../features/advInter/AdvInterOrderEditor";

const App = () => {

    // Spec §16: switch the UI to English when billing_country_code !== "FR",
    // for ALL users (not only distributors). The user is loaded from
    // localStorage on first render, so this fires once on boot AND every
    // time the auth slice updates (e.g. after a fresh login).
    const {user} = useSelector(authSelector);
    useEffect(() => {
        setLanguageFromUser(user);
    }, [user]);

    // The previous implementation replaced the entire route tree with a
    // <Spinner/> while any x3Api query was pending. That caused an
    // unmount/remount loop whenever a request failed: the rejected query
    // hid the spinner, the page remounted, the query fired again, etc.
    //
    // Replaced with no global gate — RTK Query does NOT auto-retry, so a
    // failed request stays failed. The errorToastMiddleware surfaces the
    // failure as a toast (see store.js). Individual pages remain free to
    // show their own inline loaders where they make sense.

    return (
        <React.Fragment>
            <div>
                <Toaster/>
            </div>
            <ScrollToTop/>
            <Header/>

            <main className={(isDistributor(user) || isAdvInter(user)) ? "mb-lg-5" : "mt-lg-5 mb-lg-5"}

            >
                <Container maxWidth={false} disableGutters={true}>
                    <>
                        <Switch>
                            <PrivateRoute exact path="/cart" component={Cart}/>
                                <PrivateRoute exact path="/lab-cart/:idsf/:company" component={LDACart}/>
                                <PrivateRoute exact path="/lab-cart/recap/:idsf/:company" component={RecapLda}/>
                                <PrivateRoute exact path="/recap" component={Recap}/>
                                {/* Distributor workflow (spec §4, §6, §7) */}
                                <PrivateRoute exact path="/distributor" component={DistributorCart}/>
                                <PrivateRoute exact path="/distributor/checkout" component={DistributorCheckout}/>
                                {/* ADV_INTER workflow (spec §10, §11, §14) */}
                                <PrivateRoute exact path="/adv-inter/orders" component={AdvInterUpload}/>
                                <PrivateRoute exact path="/adv-inter/orders/:id" component={AdvInterOrderEditor}/>
                                <PrivateRoute exact path="/whishlist" component={SessionWishlist}/>
                                <Route
                                    exact
                                    path="/catalogue/:niveau1/:niveau2?/:niveau3?/:niveau4?"
                                    component={Catalogue}
                                />
                                <Route
                                    exact
                                    path="/search-results"
                                    component={ProductSearchResults}
                                />
                                <PrivateRoute
                                    exact
                                    path="/wishlist/:id"
                                    component={StoredWishlist}
                                />
                                <Route
                                    exact
                                    path="/product/:reference"
                                    component={OneProduct}
                                />
                                <PrivateRoute
                                    exact
                                    path="/profile/:tab"
                                    component={ProfileDashboard}
                                />
                                <PrivateRoute
                                    exact
                                    path="/profile/address/:id"
                                    component={AddressForm}
                                />
                                <PrivateRoute
                                    exact
                                    path="/profile/shipments/:id"
                                    component={Shipment}
                                />
                                <PrivateRoute
                                    exact
                                    path="/profile/shipments-lda/:id"
                                    component={ShipmentLda}
                                />
                                <PrivateRoute
                                    exact
                                    path="/profile/shipmentsWeb/:id"
                                    component={ShipmentWeb}
                                />
                                <Route exact path="/ask-registration" component={AskSignUp}/>
                                <Route exact path="/login-sso" component={LoginSSO}/>
                                <Route exact path="/not-found" component={NotFound}/>
                                <Route exact path="/login" component={Login}/>
                                <Route exact path="/register" component={Register}/>
                                <Route exact path="/" component={Home}/>
                                <Route exact path="/admin/login" component={AdminLogin}/>
                                <Redirect to="/not-found"/>
                        </Switch>
                    </>
                </Container>
            </main>
            <Footer/>
        </React.Fragment>
    );
};

export default App;
