import { useEffect, useState } from "react";
import {
    Button,
    Paper,
    Stack,
    TextField,
    Typography,
    Divider, MenuItem, Box,
} from "@mui/material";

import LanguageSwitcher from "./ui/LanguageSwitcher";
import PopUp from "././ui/popup/PopUp";
import { useTranslation } from 'react-i18next';
import {useUIStore} from "../hooks/store/useUIStore.ts";

const DEFAULT_API = import.meta.env.VITE_API_URL;

export default function MySettings() {
    const { t } = useTranslation();
    const [apiUrl, setApiUrl] = useState("");
    const [error, setError] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [success, setSuccess] = useState(false);
    const [message, setMessage] = useState("");

    const { lowStockThreshold, setLowStockThreshold, currency, setCurrency, setLocale } = useUIStore();
    const [thresholdInput, setThresholdInput] = useState(lowStockThreshold);

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
        setLowStockThreshold(thresholdInput);
        localStorage.setItem("lowStockThreshold", thresholdInput.toString());
        setError("");
        setSuccess(true);
        setMessage(t('settings.savedMessage'));
        setSubmitted(true);
    };

    return (
        <Paper sx={{ p: 3, maxWidth: 450, margin: "40px auto", borderRadius: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>{t('settings.title')}</Typography>

            <Divider sx={{ mb: 2 }} />

            {/* Language */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                <Box>
                    <Typography variant="body2" fontWeight={500}>{t('settings.language')}</Typography>
                    <Typography variant="caption" color="text.secondary">{t('settings.languageHelper')}</Typography>
                </Box>
                <LanguageSwitcher setLocale={setLocale} />
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Low Stock Threshold */}
            <Box mb={1}>
                <Typography variant="body2" fontWeight={500} mb={0.5}>{t('settings.lowStockThreshold')}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>{t('settings.lowStockThresholdHelper')}</Typography>
                <TextField
                    size="small"
                    type="number"
                    value={thresholdInput}
                    onChange={(e) => setThresholdInput(Number(e.target.value))}
                    inputProps={{ min: 1 }}
                    fullWidth
                />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Currency */}
            <Box mb={1}>
                <Typography variant="body2" fontWeight={500} mb={0.5}>{t('settings.currency')}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>{t('settings.currencyHelper')}</Typography>
                <TextField
                    select
                    size="small"
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    fullWidth
                >
                    <MenuItem value="EUR">Euro (€)</MenuItem>
                    <MenuItem value="USD">Dollar ($)</MenuItem>
                    <MenuItem value="GBP">Pound (£)</MenuItem>
                </TextField>
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* API URL */}
            <Box mb={1}>
                <Typography variant="body2" fontWeight={500} mb={0.5}>{t('settings.backendUrlLabel')}</Typography>
                <Typography variant="caption" color="text.secondary" display="block" mb={1}>{t('settings.backendUrlHelper')}</Typography>
                <TextField
                    size="small"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    error={Boolean(error)}
                    helperText={error}
                    fullWidth
                    sx={{ mb: 2 }}
                />
                <Button
                    variant="contained"
                    onClick={handleSave}
                    fullWidth
                    sx={{ textTransform: "none" }}
                >
                    {t('common.save')}
                </Button>
            </Box>

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