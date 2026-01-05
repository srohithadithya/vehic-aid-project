import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
    en: {
        translation: {
            "dashboard": "Dashboard",
            "jobs": "Jobs",
            "active_jobs": "Active Jobs",
            "history": "History",
            "navigate": "Navigate",
            "start_trip": "Start Trip",
            "arrival": "I've Arrived",
            "complete": "Complete Job",
            "online": "Online",
            "offline": "Offline"
        }
    },
    hi: {
        translation: {
            "dashboard": "डैशबोर्ड",
            "jobs": "कार्य",
            "active_jobs": "सक्रिय कार्य",
            "history": "इतिहास",
            "navigate": "नेविगेट करें",
            "start_trip": "यात्रा शुरू करें",
            "arrival": "मैं आ गया हूँ",
            "complete": "कार्य पूरा करें",
            "online": "ऑनलाइन",
            "offline": "ऑफलाइन"
        }
    }
};

const LANGUAGE_KEY = 'provider-language';

const initI18n = async () => {
    let savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
    if (!savedLanguage) {
        savedLanguage = 'en';
    }

    i18n
        .use(initReactI18next)
        .init({
            resources,
            lng: savedLanguage,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            }
        });
};

initI18n();

export default i18n;
