import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface PopUpDeniedProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    popUpMessage: string;
    progress: number;
    success: boolean;
}

const PopUpDenied = ({setSubmitted, title, popUpMessage,
                     progress, success}: PopUpDeniedProps)=>{
    let popUpTitle;

    if (title.toLowerCase().includes("product")){
        popUpTitle = "Product"
    } else if (title.toLowerCase().includes("customer")){
        popUpTitle = "Customer"
    } else if (title.toLowerCase().includes("route")) {
        popUpTitle = "Route"
    } else {
        popUpTitle = "Order"
    }

    return (
        <Alert
            severity="error"
            variant="filled"
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
            action={
                <IconButton
                    color="inherit"
                    size="small"
                    onClick={() => setSubmitted(false)}
                    sx={{ mb: 1 }}
                >
                    <CloseIcon />
                </IconButton>
            }
        >
            {`${popUpMessage} ${popUpTitle} cannot be added!`}
            <div
                style={{
                    height: 4,
                    background: "#ddd",
                    marginTop: 10,
                    borderRadius: 4,
                    overflow: "hidden",
                }}
            >
                <div
                    style={{
                        width: `${progress}%`,
                        height: "100%",
                        background: success ? "green" : "red",
                        transition: "width 0.03s linear",
                    }}
                />
            </div>
        </Alert>
    )
}

export default PopUpDenied;