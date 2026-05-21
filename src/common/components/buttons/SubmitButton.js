import React from "react";
import styles from "./submitButton.module.css";

const SubmitButton = (props) => {
    return (
        <button
            type={props.type}
            disabled={props.disabled}
            onClick={props.onClick}
            className={`${props.extraClassName}
      ${
                props.buttonStyle === "dark"
                    ? styles.bannerButtonDark
                    : styles.bannerButtonLight
            }`}
        >
            {props.buttonText}
        </button>
    );
};

export default SubmitButton;
