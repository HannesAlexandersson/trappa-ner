import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import da from "./da/da.json";
import de from "./de/de.json";
import en from "./en/en.json";
import fi from "./fi/fi.json";
import no from "./no/no.json";
import sv from "./sv/sv.json";

export const translations = { en, sv, da, no, fi, de };
export const languageOptions = {
    en: {
        name: "English",
        flag: "🇬🇧",
    },
    sv: {
        name: "Svenska",
        flag: "🇸🇪",
    },
    da: {
        name: "Dansk",
        flag: "🇩🇰",
    },
    no: {
        name: "Norsk",
        flag: "🇳🇴",
    },
    fi: {
        name: "Suomi",
        flag: "🇫🇮",
    },
    de: {
        name: "Deutsch",
        flag: "🇩🇪",
    },
} as const;
const i18n = new I18n(translations);

// Set the locale once at the beginning of your app.
i18n.locale = getLocales()[0].languageCode ?? "sv";

// When a value is missing from a language, it'll fall back to another language
i18n.enableFallback = true;
i18n.defaultLocale = "en";

export default i18n;
