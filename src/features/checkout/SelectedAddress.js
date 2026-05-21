import React from "react";
import styles from "./addressForm.module.css";
import {cartSelector} from "../cart/cartSlice";
import AddressRow from "../addresses/AddressRow";
import {useSelector} from "react-redux";
import {useGetAllAddressesQuery} from "../../app/services/x3Api";
import {authSelector} from "../auth/authSlice";

const SelectedAddress = () => {
    const {user} = useSelector(authSelector);

    const {data, isFetching, isError, error} = useGetAllAddressesQuery(
        user.codeclientGC
    );

    const {shippingAddress} = useSelector(cartSelector);

    if (isFetching) return <></>;

    const selectedShippingAddress = data?.adresseslivraison.adresselivraison.find(
        (address) => address.numero === shippingAddress
    );

    if (!data) return <div className={styles.address}>Adresse de livraison</div>;

    if (isError) return <div>{error}</div>;

    return (
        <div className={styles.address}>
            <h3>Adresse de livraison</h3>
            <div className={styles.inputContainer}>
                {" "}
                <div className={styles.addressSelected}>
                    <AddressRow item={selectedShippingAddress}/>
                </div>
            </div>
        </div>
    );
};

export default SelectedAddress;
