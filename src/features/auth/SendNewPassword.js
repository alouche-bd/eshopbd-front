import React, {useEffect} from "react";
import {useHistory, useParams} from "react-router";
import {usePostSendNewPasswordMutation} from "../../app/services/lumenApi";
import toast from "react-hot-toast";
import Spiner from "../../common/components/spinner/Spinner";

const SendNewPassword = () => {
    const {push} = useHistory();

    const {token} = useParams();

    const [sendPassword] = usePostSendNewPasswordMutation();

    useEffect(() => {
        sendPassword({token: token})
            .unwrap()
            .then(() => {
                toast.success("Nouveau mot de passe envoyé.", {
                    id: "passwordSent",
                });
                push("/login");
            })
            .catch((error) => {
                if (error.data.errors) {
                    let validationErrors = [];
                    for (let key in error.data.errors) {
                        validationErrors.push(error.data.errors[key][0]);
                    }
                    validationErrors.map((err) => toast.error(err));
                } else {
                    toast.error(error.data.message);
                }
            });
    });

    return <Spiner/>;
};

export default SendNewPassword;
