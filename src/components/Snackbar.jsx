import { Snackbar as MuiSnackbar, Alert } from "@mui/material";
import { useNotification } from "../contexts/NotificationContext";

function Snackbar() {
    const { notification, closeNotification } = useNotification();

    const getSeverity = () => {
        switch (notification?.type) {
            case "success":
                return "success";
            case "error":
                return "error";
            case "warning":
                return "warning";
            case "info":
                return "info";
            default:
                return "info";
        }
    };

    return (
        <MuiSnackbar
            open={!!notification}
            autoHideDuration={5000}
            onClose={closeNotification}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
            <Alert
                onClose={closeNotification}
                severity={getSeverity()}
                variant="filled"
                sx={{ width: "100%" }}>
                {notification?.message}
            </Alert>
        </MuiSnackbar>
    );
}

export default Snackbar;
