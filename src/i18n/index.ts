import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import el from "./locales/el.json";

i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            el: { translation: el },
        },
        lng: "el",
        fallbackLng: "el",
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;