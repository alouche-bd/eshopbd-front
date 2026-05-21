import React from "react";
import styles from "./customButton.module.css";

const CustomButton = (props) => {
    return (
        <button
            onClick={props.onClick}
            className={`${props.extraClassName}
        ${
                props.buttonStyle === "dark"
                    ? styles.bannerButtonDark
                    : styles.bannerButtonLight
            }`}
        >
            {props.buttonText ? props.buttonText : "Découvrir"}
        </button>
    );
};

export default CustomButton;
