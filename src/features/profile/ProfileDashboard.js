import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import PersonIcon from "@mui/icons-material/Person";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {Box} from "@mui/system";
import Profile from "./Profile";
import Bills from "../bills/Bills";
import Addresses from "../addresses/Addresses";
import WishlistList from "../wishlist/WhishlistList";
import ShipmentsList from "../shipments/ShipmentsList";
import LogoutIcon from "@mui/icons-material/Logout";
import Credits from "../credits/Credits";
import DescriptionIcon from "@mui/icons-material/Description";
import {useHistory, useParams} from "react-router";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import styles from "./profileDashboard.module.css";
import {authSelector, logout} from "../auth/authSlice";
import {useDispatch, useSelector} from "react-redux";
import {clearCart} from "../cart/cartSlice";
import {clearWishlist} from "../wishlist/wishlistSlice";
import {clearProducts} from "../products/ProductsSlice";
import PeopleIcon from '@mui/icons-material/People';
import LabClient from "../network/LabClients";
import ShipmentListLDA from "../shipments/LDA/ShipmentListLDA";
import {isAdvInter, isDistributor} from "../../common/constants/userTypes";

const drawerWidth = 240;

// Sidebar layouts per user_type. Titles are translation keys resolved via
// useTranslation(); items with `external: true` navigate to a top-level
// route (e.g. /distributor) rather than a /profile/:tab.
const navLinks = [
    {link: "account",   icon: <PersonIcon/>,         titleKey: "profile.nav.profile"},
    {link: "wishlist",  icon: <FavoriteIcon/>,       titleKey: "profile.nav.wishlists"},
    {link: "shipments", icon: <LocalShippingIcon/>,  titleKey: "profile.nav.orders"},
    {link: "credits",   icon: <AttachMoneyIcon/>,    titleKey: "profile.nav.credits"},
    {link: "bills",     icon: <DescriptionIcon/>,    titleKey: "profile.nav.bills"},
    {link: "addresses", icon: <ContactMailIcon/>,    titleKey: "profile.nav.addresses"},
];

const navLinksLab = [
    {link: "account",   icon: <PersonIcon/>,         titleKey: "profile.nav.profile"},
    {link: "wishlist",  icon: <FavoriteIcon/>,       titleKey: "profile.nav.wishlists"},
    {link: "clients",   icon: <PeopleIcon/>,         titleKey: "profile.nav.clients"},
    {link: "shipments", icon: <LocalShippingIcon/>,  titleKey: "profile.nav.orders"},
    {link: "credits",   icon: <AttachMoneyIcon/>,    titleKey: "profile.nav.credits"},
    {link: "bills",     icon: <DescriptionIcon/>,    titleKey: "profile.nav.bills"},
    {link: "addresses", icon: <ContactMailIcon/>,    titleKey: "profile.nav.addresses"},
];

const navLinksAdmin = [
    {link: "clients",       icon: <PeopleIcon/>,        titleKey: "profile.nav.clients"},
    {link: "shipments-lda", icon: <LocalShippingIcon/>, titleKey: "profile.nav.orders"},
];

// Distributor sidebar — spec §4: dedicated landing + Create-order entry.
const navLinksDistributor = [
    {link: "distributor",   icon: <AddShoppingCartIcon/>, titleKey: "profile.nav.createOrder", external: true, to: "/distributor"},
    {link: "account",       icon: <PersonIcon/>,          titleKey: "profile.nav.profile"},
    {link: "shipments",     icon: <LocalShippingIcon/>,   titleKey: "profile.nav.orders"},
    {link: "bills",         icon: <DescriptionIcon/>,     titleKey: "profile.nav.bills"},
    {link: "addresses",     icon: <ContactMailIcon/>,     titleKey: "profile.nav.addresses"},
];

// ADV_INTER sidebar — spec §10: only the upload page.
const navLinksAdvInter = [
    {link: "adv-inter", icon: <UploadFileIcon/>, titleKey: "profile.nav.advInterUpload", external: true, to: "/adv-inter/orders"},
];

const pickNavLinks = (user) => {
    if (isAdvInter(user))    return navLinksAdvInter;
    if (isDistributor(user)) return navLinksDistributor;
    if (user.user_type === "LDA")         return navLinksAdmin;
    if (user.user_type === "LABORATOIRE") return navLinksLab;
    return navLinks;
};

const ProfileDashboard = () => {
    const {tab} = useParams();
    const {t} = useTranslation();

    const dispatch = useDispatch();

    const {push} = useHistory();

    const {user} = useSelector(authSelector);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(clearCart());
        dispatch(clearWishlist());
        dispatch(clearProducts());
        push("/");
    };

    const links = pickNavLinks(user);

    return (
        <Box sx={{display: "flex", justifyContent: "center"}}>
            <Drawer
                sx={{
                    width: drawerWidth,
                    display: {xs: 'none', sm: 'none', md: 'block'},
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        position: "inherit",
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <List>
                    {links.map((link, index) => {
                        const target = link.external ? link.to : `/profile/${link.link}`;
                        return (
                            <ListItem key={index}>
                                <Link
                                    to={target}
                                    className={tab === link.link ? styles.selected : styles.link}
                                >
                                    <ListItemIcon>{link.icon}</ListItemIcon>
                                    <ListItemText primary={t(link.titleKey)}/>
                                </Link>
                            </ListItem>
                        );
                    })}
                    <ListItem key={5} onClick={handleLogout}>
                        <ListItemIcon>
                            <LogoutIcon/>
                        </ListItemIcon>
                        <ListItemText primary={t("profile.nav.logout")} className={styles.logout}/>
                    </ListItem>
                </List>
            </Drawer>
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    bgcolor: "background.default",
                    p: 3,
                    justifyContent: "center",
                }}
            >
                {tab === "account" ? (
                    <Profile/>
                ) : tab === "wishlist" ? (
                    <WishlistList/>
                ) : tab === "addresses" ? (
                    <Addresses/>
                ) : tab === "bills" ? (
                    <Bills/>
                ) : tab === "credits" ? (
                    <Credits/>
                ) : tab === "shipments" ? (
                    <ShipmentsList/>
                ) : tab === "clients" ? (
                    <LabClient/>
                ) : tab === "shipments-lda" ? (
                        <ShipmentListLDA/>
                    )
                    : (
                        "null"
                    )}
            </Box>
        </Box>
    );
};

export default ProfileDashboard;
