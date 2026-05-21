import React from "react";
import styles from "./notFound.module.css";
import logoBd from "../../assets/img/logos/hexagone_blanc.png";
import {useHistory} from "react-router";
import SubmitButton from "../../common/components/buttons/SubmitButton";

const NotFound = () => {
    const {push} = useHistory();
    return (
        <div className={styles.container}>
            {" "}
            <div className={styles.box}>
                <div className={styles.logo}>
                    <img src={logoBd} alt="logo BD"/>
                </div>
                <div className={styles.code}>
                    <div>404</div>
                </div>
                <div className={styles.text}>La page demandée n'existe pas.</div>
                <div className={styles.button}>
                    <SubmitButton
                        buttonText="Retourner à l'accueil"
                        buttonStyle="dark"
                        onClick={() => push("/")}
                    />
                </div>
            </div>
        </div>
    );
};

export default NotFound;
