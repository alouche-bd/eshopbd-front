import React, {useEffect} from "react";
import {Field, Form} from "react-final-form";
import toast from "react-hot-toast";
import {useHistory} from "react-router";
import {usePostRegisterLumenMutation} from "../../app/services/lumenApi";
import {x3Api} from "../../app/services/x3Api";
import SubmitButton from "../../common/components/buttons/SubmitButton";
import styles from "./register.module.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Register = () => {
    const {push} = useHistory();

    const [register] = usePostRegisterLumenMutation();

    const [triggerEmailExists, {data, isLoading, isError, originalArgs}] =
        x3Api.endpoints.getEmailExists.useLazyQuery();

    const onSubmit = (values) => {
        try {
            triggerEmailExists(values.email);
        } catch (error) {
            toast.error("Une erreur est survenue, merci de réessayer.");
        }
    };

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
                } else {
                    try {
                        await register({
                            ...data.trouves[0],
                            email: originalArgs,
                            sso: false,
                        }).unwrap();
                        push("/login");
                        toast.success(
                            "Un email contenant votre mot de passe vous a été envoyé."
                        );
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
    });

    return (
        <>
            <div className={styles.goBack} onClick={() => push("/login")}>
                <ArrowBackIosNewIcon/> Se connecter
            </div>
            <div className={styles.registerContainer}>
                <div className={styles.register}>
                    <h2 className={styles.title}>Créer un compte</h2>
                    <p className={styles.description}>
                        Si votre email est reconnu par nos services et peut être rattaché à
                        une fiche client, vous recevrez automatiquement votre mot de passe
                        par email.
                    </p>
                    <Form
                        onSubmit={onSubmit}
                        validate={(values) => {
                            const errors = {};
                            if (!values.email) {
                                errors.email = "Ce champs est requis";
                            }
                            return errors;
                        }}
                        render={({submitError, handleSubmit, submitting}) => (
                            <form
                                onSubmit={handleSubmit}
                                className={styles.registerFormContainer}
                            >
                                <div className={styles.registerForm}>
                                    <Field name="email" type="email">
                                        {({input, meta}) => (
                                            <div className={styles.inputContainer}>
                        <span className={styles.inputSpan}>
                          {" "}
                            <input {...input} type="email" placeholder="*Email"/>
                        </span>{" "}
                                                {(meta.error || meta.submitError) && meta.touched && (
                                                    <span className={styles.errorText}>
                            {meta.error || meta.submitError}
                          </span>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                    {submitError && <div className="error">{submitError}</div>}
                                    <div className={styles.buttons}>
                                        <SubmitButton
                                            buttonText="Créer mon compte"
                                            disabled={submitting}
                                            type="submit"
                                            buttonStyle="dark"
                                        />
                                    </div>
                                </div>
                            </form>
                        )}
                    />
                </div>
            </div>
        </>
    );
};

export default Register;
