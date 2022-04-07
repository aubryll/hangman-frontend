import React from "react";
import { Alert, Snackbar as MUISnackbar, IconButton, AlertColor } from "@mui/material";

type SnackbarProps = Omit<React.ComponentProps<typeof MUISnackbar>, "onClose"> & {
    severity?: AlertColor;
    onClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
};

const CustSnackbar = ({
    open,
    message,
    severity = "success",
    onClose,
    autoHideDuration = 6000,
    ...other
}: SnackbarProps) => {
    return (
        <MUISnackbar
            open={open}
            autoHideDuration={autoHideDuration}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            {...other}
            onClose={onClose}
        >
            <Alert severity={severity} sx={{ width: "100%" }} onClose={onClose}>
                {message}
            </Alert>
        </MUISnackbar>
    );
};

const Snackbar = React.memo(CustSnackbar);
export default Snackbar;
