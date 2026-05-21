import { useEffect, useState } from "react";
import {
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
    Divider,
} from "@mui/material";

import LanguageSwitcher from "./ui/LanguageSwitcher";
import PopUp from "././ui/popup/PopUp";
import { useTranslation } from 'react-i18next';

const DEFAULT_API = import.meta.env.VITE_API_URL;

export default function MySettings() {
    const { t } = useTranslation();
    const [apiUrl, setApiUrl] = useState("");
    const [error, setError] = useState("");

    // popup state
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const saved = localStorage.getItem("apiUrl");
        setApiUrl(saved || DEFAULT_API);
    }, []);

    const validate = (url: string) => {
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            return t('settings.validation.mustStart');
        }
        return "";
    };

    const handleSave = () => {
        const err = validate(apiUrl);

        if (err) {
            setError(err);
            setSuccess(false);
            setMessage(err);
            setSubmitted(true);
            return;
        }

        localStorage.setItem("apiUrl", apiUrl);

        setError("");
        setSuccess(true);
        setMessage(t('settings.savedMessage'));
        setSubmitted(true);
    };

    return (
        <Paper
            sx={{
                p: 3,
                maxWidth: 450,
                margin: "40px auto",
                borderRadius: 2,
            }}
        >
            <Typography variant="h6" sx={{ mb: 2 }}>
                {t('settings.title')}
            </Typography>

            <Divider sx={{ mb: 2 }} />

            {/* Language */}
            <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
            >
                <Typography variant="body2">
                    {t('settings.language')}
                </Typography>

                <LanguageSwitcher />
            </Stack>

            <Divider sx={{ mb: 2 }} />

            {/* API URL */}
            <Stack spacing={2}>
                <TextField
                    label={t('settings.backendUrlLabel')}
                    size="small"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    error={Boolean(error)}
                    helperText={error || t('settings.backendUrlHelper')}
                    fullWidth
                />

                <Button
                    variant="contained"
                    onClick={handleSave}
                    sx={{ textTransform: "none" }}
                >
                    {t('common.save')}
                </Button>
            </Stack>

            {/* POPUP */}
            {submitted && (
                    <PopUp
                    title={t('settings.title')}
                    success={success}
                    popUpMessage={message}
                    setSubmitted={setSubmitted}
                />
            )}
        </Paper>
    );
}