import React, {useState} from "react";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import styles from "./scrollTop.module.css";

const ScrollTop = () => {
    const [showScroll, setShowScroll] = useState(false);

    const checkScrollTop = () => {
        if (!showScroll && window.pageYOffset > 400) {
            setShowScroll(true);
        } else if (showScroll && window.pageYOffset <= 400) {
            setShowScroll(false);
        }
    };

    const scrollTop = () => {
        window.scrollTo({top: 0, behavior: "smooth"});
    };

    window.addEventListener("scroll", checkScrollTop);

    return (
        <KeyboardArrowUpIcon
            className={styles.scrollTop}
            onClick={scrollTop}
            fontSize="large"
            style={{height: 40, display: showScroll ? "flex" : "none"}}
        />
    );
};

export default ScrollTop;
