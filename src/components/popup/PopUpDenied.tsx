import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface PopUpDeniedProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    popUpMessage: string;
}

const PopUpDenied = ({setSubmitted, title, popUpMessage}: PopUpDeniedProps)=>{
    let popUpTitle;

    if (title.includes("product")){
        popUpTitle = "Product"
    } else if (title.includes("customer")){
        popUpTitle = "Customer"
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
        </Alert>
    )
}

export default PopUpDenied;