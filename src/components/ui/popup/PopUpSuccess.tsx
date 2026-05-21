import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from 'react-i18next';


interface FormPopUpProps {
    setSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
    title: string;
    progress: number;
    success: boolean;
}



const PopUpSuccess = ({setSubmitted, title, progress, success}: FormPopUpProps) => {
    const { t } = useTranslation();
    let detectedKey: string | null = null;
    const lc = title?.toLowerCase?.() ?? "";
    if (lc.includes("product")) detectedKey = 'product';
    else if (lc.includes("customer")) detectedKey = 'customer';
    else if (lc.includes("route")) detectedKey = 'route';
    else if (lc.includes("driver")) detectedKey = 'driver';
    else if (lc.includes("receipt")) detectedKey = 'receipt';
    else if (lc.includes("supplier")) detectedKey = 'supplier';
    else if (lc.includes("order")) detectedKey = 'order';
    const popUpTitle = detectedKey ? t(`typeNames.${detectedKey}`) : title;

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
            {t('messages_ext.savedGeneric', { item: popUpTitle })}
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