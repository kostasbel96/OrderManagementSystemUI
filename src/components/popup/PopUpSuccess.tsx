import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";


interface FormPopUpProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
}



const PopUpSuccess = ({setSubmitted, title}: FormPopUpProps) => {
    let popUpTitle;

    if (title.includes("Product")){
        popUpTitle = "Product"
    } else if (title.includes("Customer")){
        popUpTitle = "Customer"
    } else {
        popUpTitle = "Order"
    }

    return (
        <>
            <Alert
                severity="success"
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
                        <CheckIcon />
                    </IconButton>
                }
            >
                {`${popUpTitle} added successfully!`}
            </Alert>

        </>
    )
}

export default PopUpSuccess;