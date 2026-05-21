import React, {useState} from "react";
import {Field, Form} from "react-final-form";
import toast from "react-hot-toast";
import {useHistory, useLocation, useParams} from "react-router";
import {useGetAllAddressesQuery, useGetUnlockClientQuery, usePostX3AddressMutation,} from "../../app/services/x3Api";
import SubmitButton from "../../common/components/buttons/SubmitButton";
import styles from "./addressForm.module.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {useSelector} from "react-redux";
import {authSelector} from "../auth/authSlice";
import Spinner from "../../common/components/spinner/Spinner";

const AddressForm = () => {
    const {push} = useHistory();

    const {state} = useLocation();

    const checkout = () => {
        if (state && state.recap) {
            return true;
        } else {
            return false;
        }
    };

    const {id} = useParams();

    const {user} = useSelector(authSelector);

    const {data} = useGetAllAddressesQuery(user.codeclientGC, {
        selectFromResult: ({data}) => ({
            data: data?.adresseslivraison.adresselivraison.find(
                (address) => address.numero === id
            ),
        }),
    });

    const fixedAddress =
        data &&
        Object.fromEntries(Object.entries(data).filter(([_, v]) => v !== " "));

    const headAddress = {
        clientCode: user.codeclientGC,
        addressNumber: id,
    };

    const [isSubmitting, setIsSUbmitting] = useState(false);

    const [triggetSetAddress] = usePostX3AddressMutation();

    const {
        data: unlockClient,
        isFetching,
        isError,
        error,
    } = useGetUnlockClientQuery(user.codeclientGC);

    const onSubmit = (values) => {
        setIsSUbmitting(true);
        try {
            triggetSetAddress({...headAddress, ...values})
                .unwrap()
                .then((response) => {
                    if (response.success === 1) {
                        state.type === "create" && toast.success("L'adresse a été créée.");
                        state.type === "update" &&
                        toast.success("L'adresse a été mise à jour.");
                        push("/profile/addresses", {checkout: checkout()});
                    } else {
                        setIsSUbmitting(false);
                        state.type === "create" &&
                        toast.error("L'adresse n'a pas pu être créee.", {
                            id: "errorAddress",
                        });
                        state.type === "update" &&
                        toast.error("L'adresse n'a pas pu être modifiée.", {
                            id: "errorAddress",
                        });
                    }
                });
        } catch (error) {
            setIsSUbmitting(false);
            state.type === "create" &&
            toast.error("L'adresse n'a pas pu être créee.", {
                id: "errorAddress",
            });
            state.type === "update" &&
            toast.error("L'adresse n'a pas pu être modifiée.", {
                id: "errorAddress",
            });
        }
    };

    if (isFetching) return <></>;

    if (!unlockClient) {
        push("/profile/addresses");
        toast.error("Quelque chose s'est mal passé.");
    }

    if (isError) return <div>{error}</div>;

    if (isSubmitting) return <Spinner/>;
    return (
        <>
            <div
                className={styles.goBack}
                onClick={() => push("/profile/addresses", {checkout: checkout()})}
            >
                <ArrowBackIosNewIcon/> Mes adresses
            </div>
            <div className={styles.registerContainer}>
                <div className={styles.register}>
                    {state.type === "update" ? (
                        <h2 className={styles.title}> Modifier une adresse </h2>
                    ) : (
                        <h2 className={styles.title}> Créer une adresse </h2>
                    )}
                    <Form
                        onSubmit={onSubmit}
                        validate={(values) => {
                            const errors = {};
                            if (!values.designation) {
                                errors.designation = "Ce champs est requis";
                            }
                            if (!values.address) {
                                errors.address = "Ce champs est requis";
                            }
                            if (!values.zipCode) {
                                errors.zipCode = "Ce champs est requis";
                            }
                            if (!values.city) {
                                errors.city = "Ce champs est requis";
                            }
                            if (!values.phone) {
                                errors.phone = "Ce champs est requis";
                            }
                            return errors;
                        }}
                        render={({submitError, handleSubmit, submitting}) => (
                            <form
                                onSubmit={handleSubmit}
                                className={styles.registerFormContainer}
                            >
                                <div className={styles.registerForm}>
                                    <div className={styles.twoFieldsRow}>
                                        <Field
                                            name="designation"
                                            type="text"
                                            initialValue={fixedAddress && fixedAddress.libelle}
                                            defaultValue=""
                                        >
                                            {({input, meta}) => (
                                                <div className={styles.inputContainer}>
                          <span className={styles.inputSpan}>
                            {" "}
                              <input
                                  {...input}
                                  type="text"
                                  placeholder="*Libellé"
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
                                        <Field
                                            name="address"
                                            type="text"
                                            initialValue={fixedAddress && fixedAddress.adresse}
                                            defaultValue=""
                                        >
                                            {({input, meta}) => (
                                                <div className={styles.inputContainer}>
                          <span className={styles.inputSpan}>
                            {" "}
                              <input
                                  {...input}
                                  type="text"
                                  placeholder="*Adresse"
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
                                    </div>
                                    <div className={styles.twoFieldsRow}>
                                        <Field
                                            name="address2"
                                            type="text"
                                            initialValue={fixedAddress && fixedAddress.adresses2}
                                            defaultValue=""
                                        >
                                            {({input, meta}) => (
                                                <div className={styles.inputContainer}>
                          <span className={styles.inputSpan}>
                            {" "}
                              <input
                                  {...input}
                                  type="text"
                                  placeholder="Complément adresse 1"
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
                                        <Field
                                            name="address3"
                                            type="text"
                                            initialValue={fixedAddress && fixedAddress.adresse3}
                                            defaultValue=""
                                        >
                                            {({input, meta}) => (
                                                <div className={styles.inputContainer}>
                          <span className={styles.inputSpan}>
                            {" "}
                              <input
                                  {...input}
                                  type="text"
                                  placeholder="Complément adresse 2"
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
                                    </div>
                                    {" "}
                                    <div className={styles.twoFieldsRow}>
                                        <Field
                                            name="zipCode"
                                            type="text"
                                            initialValue={fixedAddress && fixedAddress.codepostal}
                                            defaultValue=""
                                        >
                                            {({input, meta}) => (
                                                <div className={styles.inputContainer}>
                          <span className={styles.inputSpan}>
                            {" "}
                              <input
                                  {...input}
                                  type="text"
                                  placeholder="*Code Postal"
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
                                        <Field
                                            name="city"
                                            type="text"
                                            initialValue={fixedAddress && fixedAddress.ville}
                                            defaultValue=""
                                        >
                                            {({input, meta}) => (
                                                <div className={styles.inputContainer}>
                          <span className={styles.inputSpan}>
                            {" "}
                              <input
                                  {...input}
                                  type="text"
                                  placeholder="*Ville"
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
                                    </div>
                                    {" "}
                                    <div className={styles.twoFieldsRow}>
                                        <Field
                                            name="phone"
                                            type="text"
                                            initialValue={fixedAddress && fixedAddress.telephone}
                                            defaultValue=""
                                        >
                                            {({input, meta}) => (
                                                <div className={styles.inputContainer}>
                          <span className={styles.inputSpan}>
                            {" "}
                              <input
                                  {...input}
                                  type="text"
                                  placeholder="*Téléphone"
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
                                        <Field
                                            name="fax"
                                            type="text"
                                            initialValue={fixedAddress && fixedAddress.fax}
                                            defaultValue=""
                                        >
                                            {({input, meta}) => (
                                                <div className={styles.inputContainer}>
                          <span className={styles.inputSpan}>
                            {" "}
                              <input {...input} type="text" placeholder="Fax"/>
                          </span>{" "}
                                                    {(meta.error || meta.submitError) && meta.touched && (
                                                        <span className={styles.errorText}>
                              {meta.error || meta.submitError}
                            </span>
                                                    )}
                                                </div>
                                            )}
                                        </Field>
                                    </div>
                                    {submitError && <div className="error">{submitError}</div>}
                                    <div className={styles.buttons}>
                                        <SubmitButton
                                            buttonText={
                                                state.type === "update" ? "Modifier" : "Créer"
                                            }
                                            disabled={isSubmitting}
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

export default AddressForm;