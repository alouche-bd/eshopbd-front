import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import SubmitButton from "../buttons/SubmitButton";

const FormDialog = (props) => {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleValidate = () => {
        props.actionFunction();
        setOpen(false);
    };

    return (
        <div>
            <SubmitButton
                onClick={handleClickOpen}
                buttonText={props.buttonText}
                buttonStyle={props.buttonStyle}
            />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>{props.dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{props.dialogContentText}</DialogContentText>
                    {props.textfield && (
                        <TextField
                            autoFocus
                            margin="dense"
                            id={props.inputId}
                            label={props.inputLabel}
                            type={props.inputType}
                            fullWidth
                            variant="standard"
                            onChange={props.onChange}
                            required
                        />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>{props.goBack}</Button>
                    <Button onClick={handleValidate}>{props.validate}</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default FormDialog;
