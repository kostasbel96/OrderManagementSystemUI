import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";


interface FormPopUpProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    progress: number;
    success: boolean;
}



const PopUpSuccess = ({setSubmitted, title, progress, success}: FormPopUpProps) => {
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

export default PopUpSuccess;