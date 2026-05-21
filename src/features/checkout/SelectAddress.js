import React from "react";
import {useTranslation} from "react-i18next";
import styles from "./addressForm.module.css";
import {useGetAllAddressesQuery} from "../../app/services/x3Api";
import {useDispatch, useSelector} from "react-redux";
import {authSelector} from "../auth/authSlice";
import {cartSelector, setShippingAddress} from "../cart/cartSlice";
import AddressRow from "../addresses/AddressRow";
import {orange} from "@mui/material/colors";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {useHistory} from "react-router";

const SelectAddress = () => {
    const {t} = useTranslation();
    const {user} = useSelector(authSelector);

    const {labClient} = useSelector(cartSelector);

    const {data, isFetching, isError, error} = useGetAllAddressesQuery(
        labClient ? labClient.id : user.codeclientGC
    );

    const {shippingAddress} = useSelector(cartSelector);

    const {push} = useHistory();

    const dispatch = useDispatch();
    if (isFetching) return <></>;

    const handleSelectAddress = (addressNumber) => {
        const addressSelected = data?.adresseslivraison.adresselivraison.find(
            (address) => address.numero === addressNumber);

        const facurationAddress = data?.adresseslivraison.adresselivraison.find(
            (address) => address.numero === "FAC");

        dispatch(setShippingAddress({zipCode: addressSelected.codepostal, address: addressSelected.numero, finalClientEmail : facurationAddress?.eMail}));
    };


    const selectedShippingAddress = data?.adresseslivraison.adresselivraison.find(
        (address) => address.numero === shippingAddress.address
    );

    if (!data) return <div className={styles.address}>{t("checkout.deliveryAddress")}</div>;

    if (isError) return <div>{error}</div>;

    return (
        <div className={styles.address}>
            <h3>{t("checkout.deliveryAddress")}</h3>
            <div className={styles.inputContainer}>
                {" "}
                {!shippingAddress.length ? (
                    <div className={styles.description}>
                        <WarningAmberIcon sx={{color: orange[500]}} fontSize="small"/>{" "}
                        {t("checkout.addressMissing")}
                    </div>
                ) : (
                    <div className={styles.addressSelected}>
                        <AddressRow item={selectedShippingAddress}/>
                    </div>
                )}
                <span className={styles.inputSpan}>
          <select
              value={shippingAddress.address}
              onChange={(e) => handleSelectAddress(e.target.value)}
          >
            <option value="" className={styles.defaultAddress}>
              {t("checkout.selectAddressPlaceholder")}
            </option>
              {data &&
                  data.adresseslivraison.adresselivraison.map((item, index) => (
                      <option key={index} value={item.numero}>
                          {item.libelle}, {item.adresse}, {item.codepostal}, {item.ville}
                      </option>
                  ))}
          </select>{" "}
        </span>{" "}
            </div>
        </div>
    );
};

export default SelectAddress;
