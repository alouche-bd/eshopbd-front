import React, {useState} from "react";
import styles from "./selectClient.module.css";
import {useGetNetworkQuery} from "../../app/services/x3Api";
import {useDispatch, useSelector} from "react-redux";
import {authSelector} from "../auth/authSlice";
import {cartSelector, setLabClient} from "../cart/cartSlice";
import {useHistory} from "react-router";
import SubmitButton from "../../common/components/buttons/SubmitButton";

const SelectClient = () => {
    const {user} = useSelector(authSelector);

    const {cartItems, labClient} = useSelector(cartSelector);

    const {isFetching, data, error, isError} = useGetNetworkQuery(user.sfuid);

    const [hideSelect, setHideSelect] = useState(!!labClient)

    const {push} = useHistory();

    const dispatch = useDispatch();

    if (isFetching) return <></>;

    const handleSelectClient = (id) => {
        const client = data.find((d) => d.idSageX3 === id)
        dispatch(setLabClient({id: id, company: client.name, suid: client.suid}))
    };

    const handleRemoveClient = () => {
        dispatch(setLabClient(null))
    }

    if (!data) return <div className={styles.address}>Vos clients</div>;

    if (isError) return <div>{error}</div>;

    return (
        <div className={styles.client}>
            {" "}
            {!labClient || !hideSelect ? (
                <div className={styles.description}>
                    <h3 className={styles.inputContainer}>Vos clients</h3>
                    <p>Attention, si vous ne sélectionnez pas de client, la commande sera facturée en votre nom</p>
                    <select
                        className={styles.description}
                        onChange={(e) => handleSelectClient(e.target.value)}
                    >
                        <option value="" className={styles.defaultAddress}>
                            Sélectionner un client
                        </option>
                        {data &&
                            data.map((item, index) => (
                                <option key={index} value={item.idSageX3}>
                                    {item.idSageX3} - {item.name} - {item.billingPostalCode}
                                </option>
                            ))}
                    </select>
                    <div>
                        <SubmitButton
                            buttonText="Sélectioner le client"
                            onClick={() => setHideSelect(true)}
                        />
                    </div>
                </div>
            ) : (
                <div className={styles.client}>
                    <h3>Client : </h3>
                    <div className={styles.clientInfos}>
                        {labClient ?
                            <p>
                                {labClient.id} - {labClient.company}
                            </p>
                            :
                            <p>
                                {user.id} - {labClient.company}
                            </p>
                        }
                        <div className={styles.buttonsRow}>
                            <SubmitButton
                                buttonText="Choisir un autre client"
                                onClick={() => setHideSelect(false)}
                            />
                            <SubmitButton
                                buttonText="Commander pour moi"
                                buttonStyle="dark"
                                onClick={handleRemoveClient}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectClient;
