import styles from "./register.module.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {Field, Form} from "react-final-form";
import SubmitButton from "../../common/components/buttons/SubmitButton";
import React from "react";
import {useHistory} from "react-router";
import toast from "react-hot-toast";
import {useAskRegistrationMutation} from "../../app/services/x3Api";

const AskSignUp = () => {
    const {push} = useHistory();

    const [askRegistration] = useAskRegistrationMutation();


    const onSubmit = async (values) => {
        try {
            await askRegistration(values).unwrap();
            push("/");
            toast.success('Votre demande d\'inscription a bien été prise en compte. Nos équipes vous confirmeront par email la création de votre espace LaGalaxy.')
        } catch (error) {
            toast.error('Votre demande n\'a pas pu aboutir.')
        }
    };

    const countries = [
        "Autriche",
        "Belgique",
        "Chypre",
        "Estonie",
        "Finlande",
        "France",
        "Allemagne",
        "Grèce",
        "Irlande",
        "Italie",
        "Lettonie",
        "Lituanie",
        "Luxembourg",
        "Malte",
        "Pays-Bas",
        "Portugal",
        "Slovaquie",
        "Slovénie",
        "Espagne"
    ]

    return (<>
        <div className={styles.goBack} onClick={() => push("/login")}>
            <ArrowBackIosNewIcon/> Se connecter
        </div>
        <div className={styles.registerContainer}>
            <div className={styles.register}>
                <h2 className={styles.title}>Demande de création de compte</h2>
                <p className="mx-3">Si vous êtes déjà client Biotech Dental, merci d'activer votre compte <a
                    href="https://www.biotechgalaxy.com/" target="_blank" rel="noreferrer">LaGalaxy</a></p>
                <Form
                    onSubmit={onSubmit}
                    validate={(values) => {
                        const errors = {};
                        if (!values.lastname) {
                            errors.lastname = "Ce champs est requis";
                        }
                        if (!values.firstname) {
                            errors.firstname = "Ce champs est requis";
                        }
                        if (!values.social) {
                            errors.social = "Ce champs est requis";
                        }
                        if (!values.email) {
                            errors.email = "Ce champs est requis";
                        }
                        if (!values.phone) {
                            errors.phone = "Ce champs est requis";
                        }
                        if (!values.billingStreet) {
                            errors.billingStreet = "Ce champs est requis";
                        }
                        if (!values.billingZipCode) {
                            errors.billingZipCode = "Ce champs est requis";
                        }
                        if (!values.billingCity) {
                            errors.billingCity = "Ce champs est requis";
                        }
                        if (!values.billingCountry) {
                            errors.billingCountry = "Ce champs est requis";
                        }
                        if (!values.shippingStreet) {
                            errors.shippingStreet = "Ce champs est requis";
                        }
                        if (!values.shippingZipCode) {
                            errors.shippingZipCode = "Ce champs est requis";
                        }
                        if (!values.shippingCity) {
                            errors.shippingCity = "Ce champs est requis";
                        }
                        if (!values.shippingCountry) {
                            errors.shippingCountry = "Ce champs est requis";
                        }

                        return errors;
                    }}
                    render={({submitError, handleSubmit, submitting}) => (<form
                        onSubmit={handleSubmit}
                        className={styles.registerFormContainer}
                    >
                        <div className={styles.registerForm}>
                            <div className="mb-5 mt-5">Coordonnées</div>
                            <div className="row">
                                <div className="col-sm-4">
                                    <Field name="lastname" type="text">
                                        {({input, meta}) => (<div className={styles.inputContainer}>
                        <span className={styles.inputSpan}>
                          {" "}
                            <input {...input} type="text" placeholder="*Nom"/>
                        </span>{" "}
                                            {(meta.error || meta.submitError) && meta.touched && (
                                                <span className={styles.errorText}>
                            {meta.error || meta.submitError}
                          </span>)}
                                        </div>)}
                                    </Field>
                                </div>
                                <div className="col-sm-4">
                                    <Field name="firstname" type="text">
                                        {({input, meta}) => (<div className={styles.inputContainer}>
                        <span className={styles.inputSpan}>
                          {" "}
                            <input {...input} type="text" placeholder="*Prénom"/>
                        </span>{" "}
                                            {(meta.error || meta.submitError) && meta.touched && (
                                                <span className={styles.errorText}>
                            {meta.error || meta.submitError}
                          </span>)}
                                        </div>)}
                                    </Field>
                                </div>

                                <div className="col-sm-4">
                                    <Field name="social" type="text">
                                        {({input, meta}) => (<div className={styles.inputContainer}>
                        <span className={styles.inputSpan}>
                          {" "}
                            <input {...input} type="text" placeholder="*Raison sociale"/>
                        </span>{" "}
                                            {(meta.error || meta.submitError) && meta.touched && (
                                                <span className={styles.errorText}>
                            {meta.error || meta.submitError}
                          </span>)}
                                        </div>)}
                                    </Field>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <Field name="email" type="text">
                                        {({input, meta}) => (<div className={styles.inputContainer}>
                        <span className={styles.inputSpan}>
                          {" "}
                            <input {...input} type="text" placeholder="*Email"/>
                        </span>{" "}
                                            {(meta.error || meta.submitError) && meta.touched && (
                                                <span className={styles.errorText}>
                            {meta.error || meta.submitError}
                          </span>)}
                                        </div>)}
                                    </Field>
                                </div>
                                <div className="col-sm-6">
                                    <Field name="phone" type="text">
                                        {({input, meta}) => (<div className={styles.inputContainer}>
                        <span className={styles.inputSpan}>
                          {" "}
                            <input {...input} type="text" placeholder="*Téléphone"/>
                        </span>{" "}
                                            {(meta.error || meta.submitError) && meta.touched && (
                                                <span className={styles.errorText}>
                            {meta.error || meta.submitError}
                          </span>)}
                                        </div>)}
                                    </Field>
                                </div>

                            </div>
                            <div className="mb-5 mt-5">Adresse de facturation</div>
                            <Field name="billingStreet" type="text">
                                {({input, meta}) => (<div className={styles.inputContainer}>
                        <span className={styles.inputSpan}>
                          {" "}
                            <input {...input} type="text" placeholder="*Adresse"/>
                        </span>{" "}
                                    {(meta.error || meta.submitError) && meta.touched && (
                                        <span className={styles.errorText}>
                            {meta.error || meta.submitError}
                          </span>)}
                                </div>)}
                            </Field>
                            <div className="row">
                                <div className="col-sm-4">

                                    <Field name="billingZipCode" type="text">
                                        {({input, meta}) => (<div className={styles.inputContainer}>
                        <span className={styles.inputSpan}>
                          {" "}
                            <input {...input} type="text" placeholder="*Code Postal"/>
                        </span>{" "}
                                            {(meta.error || meta.submitError) && meta.touched && (
                                                <span className={styles.errorText}>
                            {meta.error || meta.submitError}
                          </span>)}
                                        </div>)}
                                    </Field>
                                </div>
                                <div className="col-sm-4">
                                    <Field name="billingCity" type="text">
                                        {({input, meta}) => (<div className={styles.inputContainer}>
                        <span className={styles.inputSpan}>
                          {" "}
                            <input {...input} type="text" placeholder="*Ville"/>
                        </span>{" "}
                                            {(meta.error || meta.submitError) && meta.touched && (
                                                <span className={styles.errorText}>
                            {meta.error || meta.submitError}
                          </span>)}
                                        </div>)}
                                    </Field>
                                </div>

                                <div className="col-sm-4">
                                    <Field name="billingCountry" component="select" className={styles.inputSpan}>

                                        {countries.map(country => (
                                            <option value={country}>{country}</option>
                                        ))}

                                    </Field>
                                </div>
                            </div>
                            <div className="mb-5 mt-5">Adresse de livraison</div>
                            <Field name="shippingStreet" type="text">
                                {({input, meta}) => (<div className={styles.inputContainer}>
                        <span className={styles.inputSpan}>
                          {" "}
                            <input {...input} type="text" placeholder="*Adresse"/>
                        </span>{" "}
                                    {(meta.error || meta.submitError) && meta.touched && (
                                        <span className={styles.errorText}>
                            {meta.error || meta.submitError}
                          </span>)}
                                </div>)}
                            </Field>
                            <div className="row">
                                <div className="col-sm-4">
                                    <Field name="shippingZipCode" type="text">
                                        {({input, meta}) => (<div className={styles.inputContainer}>
                        <span className={styles.inputSpan}>
                          {" "}
                            <input {...input} type="text" placeholder="*Code Postal"/>
                        </span>{" "}
                                            {(meta.error || meta.submitError) && meta.touched && (
                                                <span className={styles.errorText}>
                            {meta.error || meta.submitError}
                          </span>)}
                                        </div>)}
                                    </Field>
                                </div>
                                <div className="col-sm-4">
                                    <Field name="shippingCity" type="text">
                                        {({input, meta}) => (<div className={styles.inputContainer}>
                        <span className={styles.inputSpan}>
                          {" "}
                            <input {...input} type="text" placeholder="*Ville"/>
                        </span>{" "}
                                            {(meta.error || meta.submitError) && meta.touched && (
                                                <span className={styles.errorText}>
                            {meta.error || meta.submitError}
                          </span>)}
                                        </div>)}
                                    </Field>
                                </div>

                                <div className="col-sm-4">
                                    <Field name="shippingCountry" component="select" className={styles.inputSpan}>

                                        {countries.map(country => (
                                            <option value={country}>{country}</option>
                                        ))}

                                    </Field>
                                </div>

                            </div>

                            {submitError && <div className="error">{submitError}</div>}
                            <div className={styles.buttons}>
                                <SubmitButton
                                    buttonText="Envoyer ma demande"
                                    disabled={submitting}
                                    type="submit"
                                    buttonStyle="dark"
                                />
                            </div>
                        </div>
                    </form>)}
                />
            </div>
        </div>
    </>);


}

export default AskSignUp;