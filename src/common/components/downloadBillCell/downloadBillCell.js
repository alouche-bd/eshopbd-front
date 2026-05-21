import {Fab} from "@mui/material";
import React from "react";
import SaveIcon from "@mui/icons-material/Save";
import {useSelector} from "react-redux";
import {authSelector} from "../../../features/auth/authSlice";

const DownloadBillCell = ({id}) => {
    const {user} = useSelector(authSelector);
    return (
        <>
            <a href={`https://api-galaxy.biotech-dental.com/api/factureGalaxyPdf/${user.sfuid}/${id}`} target="_blank" rel="noreferrer">
                <Fab
                    size="small"
                    aria-label="save"
                    color="primary"
                >
                    <SaveIcon/>
                </Fab>
            </a>
        </>
    );
};

export default DownloadBillCell;
