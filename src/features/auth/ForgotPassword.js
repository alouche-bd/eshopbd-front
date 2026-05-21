import React from "react";
import {Field, Form} from "react-final-form";
import styles from "./forgotPassword.module.css";
import SubmitButton from "../../common/components/buttons/SubmitButton";
import {useHistory} from "react-router";
import toast from "react-hot-toast";
import {usePostForgotPasswordMutation} from "../../app/services/lumenApi";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const ForgotPassword = () => {
    const {push} = useHistory();

    const [forgotPassword] = usePostForgotPasswordMutation();

    const onSubmit = async (values) => {
        try {
            await forgotPassword(values).unwrap();
            toast.success("Email de réinitialisation envoyé avec succés.");
            push("/login");
        } catch (error) {
            if (error.data.errors) {
                let validationErrors = [];
                for (let key in error.data.errors) {
                    validationErrors.push(error.data.errors[key][0]);
                }
                validationErrors.map((err) => toast.error(err));
            } else {
                toast.error(error.data.message);
            }
        }
    };

    return (
        <>
            <div className={styles.goBack} onClick={() => push("/login")}>
                <ArrowBackIosNewIcon/> Se connecter
            </div>
            <div className={styles.loginContainer}>
                <div className={styles.login}>
                    <h2 className={styles.title}>Mot de passe oublié</h2>
                    <p className={styles.description}>
                        Merci d'entrer votre adresse email, un lien pour réinitialiser votre
                        mot de passe vous sera envoyé après validation du formulaire.
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
                                className={styles.loginFormContainer}
                            >
                                <div className={styles.loginForm}>
                                    <Field name="email" type="email">
                                        {({input, meta}) => (
                                            <div className={styles.inputContainer}>
                        <span className={styles.inputSpan}>
                          <input {...input} type="text" placeholder="*Email"/>
                        </span>{" "}
                                                {(meta.error || meta.submitError) && meta.touched && (
                                                    <span className={styles.errorText}>
                            {meta.error || meta.submitError}
                          </span>
                                                )}
                                            </div>
                                        )}
                                    </Field>
                                    <div className={styles.buttons}>
                                        <SubmitButton
                                            buttonText="Valider"
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

export default ForgotPassword;
