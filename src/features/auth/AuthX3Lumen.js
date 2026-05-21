import React, {useEffect} from "react";
import toast from "react-hot-toast";
import {useHistory} from "react-router";
import {usePostRegisterLumenMutation} from "../../app/services/lumenApi";
import {useGetEmailExistsQuery} from "../../app/services/x3Api";
import {useSelector} from "react-redux";
import {authSelector} from "../auth/authSlice";
import Spinner from "../../common/components/spinner/Spinner";

const AuthX3Lumen = () => {
    const {push} = useHistory();

    const [register] = usePostRegisterLumenMutation();

    const {user} = useSelector(authSelector);

    const {data, isLoading, isError, originalArgs} = useGetEmailExistsQuery(
        user.email
    );

    useEffect(() => {
        const postRegistration = async () => {
            if (!isLoading && !isError && data) {
                if (data?.nbresultats === 0) {
                    toast.error(
                        "Votre email n'a pas été reconnu, merci de contacter l'assistance des ventes.",
                        {
                            id: "failedEmail",
                        }
                    );
                    push("/");
                } else {
                    try {
                        await register({
                            ...data.trouves[0],
                            email: originalArgs,
                            sso: true,
                        });
                        push("/");
                    } catch (error) {
                        if (error.data.errors) {
                            let validationErrors = [];
                            for (let key in error.data.errors) {
                                validationErrors.push(error.data.errors[key][0]);
                            }
                            validationErrors.map((err, index) =>
                                toast.error(err, {id: `${index}`})
                            );
                        } else {
                            toast.error(error.data.message, {id: "singleError"});
                        }
                    }
                }
            }
        };
        postRegistration();
    }, []);

    return <Spinner/>;
};

export default AuthX3Lumen;
