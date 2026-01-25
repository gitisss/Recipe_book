import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import he from './locales/he.json';
import en from './locales/en.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            he: {
                translation: he,
            },
            en: {
                translation: en,
            },
        },
        fallbackLng: 'he',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    }, (err) => {
        if (!err) {
            document.dir = i18n.dir();
            document.documentElement.lang = i18n.language;
        }
    });

// Listen for language changes
i18n.on('languageChanged', (lng) => {
    document.dir = i18n.dir(lng);
    document.documentElement.lang = lng;
});

export const isRTL = () => i18n.dir() === 'rtl';

export default i18n;
