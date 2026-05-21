import {Fab} from "@mui/material";
import React from "react";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import CircularProgress from "@mui/material/CircularProgress";
import {useSelector} from "react-redux";
import {authSelector} from "../../../features/auth/authSlice";
import {x3Api} from "../../../app/services/x3Api";

const DownloadCreditCell = ({id}) => {
    const {user} = useSelector(authSelector);

    const [trigger, {data, isLoading, isError}] =
        x3Api.endpoints.seeCredit.useLazyQuery();

    const handleDownloadCredit = (id) => {
        trigger({
            clientCode: user.codeclientGC,
            numero: id,
        });
    };

    return (
        <>
            {isLoading ? (
                <CircularProgress color="inherit"/>
            ) : isError ? (
                <div></div>
            ) : data ? (
                <Fab size="small" color="secondary" aria-label="saved">
                    <CheckIcon onClick={() => handleDownloadCredit(id)}/>
                </Fab>
            ) : (
                <Fab
                    size="small"
                    aria-label="save"
                    color="primary"
                    onClick={() => handleDownloadCredit(id)}
                >
                    <SaveIcon/>
                </Fab>
            )}
        </>
    );
};

export default DownloadCreditCell;
