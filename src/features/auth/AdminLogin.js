import React, {useState} from "react";
import {Field, Form} from "react-final-form";
import toast from "react-hot-toast";
import {useHistory} from "react-router";
import {useTranslation} from "react-i18next";
import {usePostAdminLoginMutation} from "../../app/services/lumenApi";
import SubmitButton from "../../common/components/buttons/SubmitButton";
import {defaultRouteForUser} from "../../common/constants/userTypes";
import {setLanguageFromUser} from "../../i18n";
import styles from "./login.module.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {IconButton} from "@mui/material";

const AdminLogin = () => {
    const {push} = useHistory();
    const {t} = useTranslation();

    const [login] = usePostAdminLoginMutation();

    const [showPassword, setShowPassord] = useState(false);

    const handleShowPassword = () => {
        setShowPassord(!showPassword);
    };

    const onSubmit = async (values) => {
        try {
            const payload = await login(values).unwrap();
            // The backend returns HTTP 200 + {success: 0} on bad creds, so
            // unwrap() doesn't throw. Validate the flags before navigating.
            if (!payload?.success || !payload?.user || !payload?.token) {
                toast.error(t("login.invalidCredentials"));
                return;
            }
            setLanguageFromUser(payload.user);
            push(defaultRouteForUser(payload.user));
        } catch (error) {
            toast.error(t("login.invalidCredentials"));
        }
    };

    return (
        <div className={styles.loginContainer}>
            <div className={styles.login}>
                <h2 className={styles.title}>{t("login.title")}</h2>

                <Form
                    onSubmit={onSubmit}
                    validate={(values) => {
                        const errors = {};
                        if (!values.email) {
                            errors.email = t("common.requiredField");
                        }
                        if (!values.password) {
                            errors.password = t("common.requiredField");
                        }
                        return errors;
                    }}
                    render={({submitError, handleSubmit, submitting}) => (
                        <form onSubmit={handleSubmit} className={styles.loginFormContainer}>
                            <div className={styles.loginForm}>
                                <Field name="email" type="email">
                                    {({input, meta}) => (
                                        <div className={styles.inputContainer}>
                      <span className={styles.inputSpan}>
                        <input {...input} type="text" placeholder={"*" + t("login.email")}/>
                      </span>{" "}
                                            {(meta.error || meta.submitError) && meta.touched && (
                                                <span className={styles.errorText}>
                          {meta.error || meta.submitError}
                        </span>
                                            )}
                                        </div>
                                    )}
                                </Field>
                                <Field name="password">
                                    {({input, meta}) => (
                                        <div className={styles.inputContainer}>
                      <span className={styles.inputSpan}>
                        <input
                            {...input}
                            type={showPassword ? "text" : "password"}
                            placeholder={"*" + t("login.password")}
                        />
                        <IconButton onClick={handleShowPassword}>
                          {showPassword ? (
                              <VisibilityOffIcon/>
                          ) : (
                              <VisibilityIcon/>
                          )}
                        </IconButton>
                      </span>{" "}
                                            {meta.error && meta.touched && (
                                                <span className={styles.errorText}>{meta.error}</span>
                                            )}
                                        </div>
                                    )}
                                </Field>
                                {submitError && <div className="error">{submitError}</div>}{" "}
                                <div className={styles.buttons}>
                                    <SubmitButton
                                        buttonText={submitting ? t("login.submitting") : t("login.submit")}
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
    );
};

export default AdminLogin;
