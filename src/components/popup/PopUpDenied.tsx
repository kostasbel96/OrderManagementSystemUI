import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

interface PopUpDeniedProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
}

const PopUpDenied = ({setSubmitted, title}: PopUpDeniedProps)=>{
    let popUpTitle;

    if (title.includes("Product")){
        popUpTitle = "Product"
    } else if (title.includes("Customer")){
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
            {`${popUpTitle} cannot be added!`}
        </Alert>
    )
}

export default PopUpDenied;