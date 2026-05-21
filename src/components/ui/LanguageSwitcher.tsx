import { useTranslation } from "react-i18next";
import { FormControl, Select, MenuItem, Box } from "@mui/material";

type Lang = "en" | "el";

export default function LanguageSwitcher() {
    const { i18n, t } = useTranslation();

    const changeLang = (lang: Lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem("lang", lang);
    };

    return (
        <Box
            sx={{
                padding: "4px 8px",
                borderRadius: 2,
                display: "inline-flex",
            }}
        >
            <FormControl size="small">
                <Select
                    value={i18n.language as Lang}
                    onChange={(e) => changeLang(e.target.value as Lang)}
                    sx={{
                        width: 160, // 🔥 fixed width εδώ
                    }}
                    renderValue={(value) => {
                        return value === "el" ? `🇬🇷 ${t('language.greek')}` : `🇬🇧 ${t('language.english')}`;
                    }}
                >
                    <MenuItem value="el">🇬🇷 {t('language.greek')}</MenuItem>
                    <MenuItem value="en">🇬🇧 {t('language.english')}</MenuItem>
                </Select>
            </FormControl>
        </Box>
    );
}