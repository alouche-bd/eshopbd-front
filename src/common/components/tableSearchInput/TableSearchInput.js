import React from "react";
import SearchIcon from "@mui/icons-material/Search";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import styles from "./tableSearchInput.module.css";

const TableSearchInput = (props) => {
    return (
        <div className={styles.searchContainer}>
            <TextField
                variant="standard"
                value={props.value}
                onChange={props.onChange}
                placeholder="Rechercher"
                InputProps={{
                    startAdornment: <SearchIcon fontSize="small"/>,
                    endAdornment: (
                        <IconButton
                            title="Clear"
                            aria-label="Clear"
                            size="small"
                            style={{visibility: props.value ? "visible" : "hidden"}}
                            onClick={props.clearSearch}
                        >
                            <ClearIcon fontSize="small"/>
                        </IconButton>
                    ),
                }}
            />
        </div>
    );
};

export default TableSearchInput;
