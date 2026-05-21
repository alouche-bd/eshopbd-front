import React from "react";
import {Field, Form} from "react-final-form";
import toast from "react-hot-toast";
import {useUpdatePasswordMutation} from "../../app/services/lumenApi";
import SubmitButton from "../../common/components/buttons/SubmitButton";
import styles from "./changePassword.module.css";

const ChangePassword = () => {
    const [updatePassword] = useUpdatePasswordMutation();
    const onSubmit = async (values) => {
        try {
            await updatePassword(values).unwrap();
            toast.success("Mot de passe modifié avec succés.");
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
        <div className={styles.loginContainer}>
            <Form
                onSubmit={onSubmit}
                validate={(values) => {
                    const errors = {};
                    if (!values.oldPassword) {
                        errors.oldPassword = "Ce champs est requis";
                    }
                    if (!values.newPassword) {
                        errors.newPassword = "Ce champs est requis";
                    }
                    if (!values.newPassword_confirmation) {
                        errors.newPassword_confirmation = "Ce champs est requis";
                    } else if (values.newPassword_confirmation !== values.newPassword) {
                        errors.newPassword_confirmation =
                            "Les mots de passe doivent être identiques";
                    }
                    return errors;
                }}
                render={({submitError, handleSubmit, submitting, reset}) => (
                    <form
                        onSubmit={(event) => {
                            handleSubmit(event).then(reset);
                        }}
                    >
                        <div className={styles.loginForm}>
                            <Field name="oldPassword">
                                {({input, meta}) => (
                                    <div className={styles.inputContainer}>
                    <span className={styles.inputSpan}>
                      <input
                          {...input}
                          type="password"
                          placeholder="Mot de passe*"
                      />
                    </span>{" "}
                                        {(meta.error || meta.submitError) && meta.touched && (
                                            <span className={styles.errorText}>
                        {meta.error || meta.submitError}
                      </span>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <Field name="newPassword">
                                {({input, meta}) => (
                                    <div className={styles.inputContainer}>
                    <span className={styles.inputSpan}>
                      <input
                          {...input}
                          type="password"
                          placeholder="Nouveau mot de passe*"
                      />
                    </span>{" "}
                                        {(meta.error || meta.submitError) && meta.touched && (
                                            <span className={styles.errorText}>
                        {meta.error || meta.submitError}
                      </span>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <Field name="newPassword_confirmation">
                                {({input, meta}) => (
                                    <div className={styles.inputContainer}>
                    <span className={styles.inputSpan}>
                      <input
                          {...input}
                          type="password"
                          placeholder="Confirmation du nouveau mot de passe*"
                      />
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
                                <SubmitButton buttonText="Modifier" type="submit"/>
                            </div>
                        </div>
                    </form>
                )}
            />{" "}
        </div>
    );
};

export default ChangePassword;
