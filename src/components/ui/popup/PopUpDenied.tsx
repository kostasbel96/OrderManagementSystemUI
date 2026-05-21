import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from 'react-i18next';

interface PopUpDeniedProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    popUpMessage: string;
    progress: number;
    success: boolean;
}

const PopUpDenied = ({setSubmitted, title, popUpMessage,
                     progress, success}: PopUpDeniedProps)=>{
    const { t } = useTranslation();
    const lc = title?.toLowerCase?.() ?? "";
    let detectedKey = 'order';
    if (lc.includes("product")) detectedKey = 'product';
    else if (lc.includes("customer")) detectedKey = 'customer';
    else if (lc.includes("route")) detectedKey = 'route';
    else if (lc.includes("driver")) detectedKey = 'driver';
    else if (lc.includes("receipt")) detectedKey = 'receipt';
    else if (lc.includes("supplier")) detectedKey = 'supplier';
    const popUpTitle = t(`typeNames.${detectedKey}`);

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
            {t('messages_ext.cannotBeAdded', { message: popUpMessage, type: popUpTitle })}
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