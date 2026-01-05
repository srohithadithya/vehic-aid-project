import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const resources = {
    en: {
        translation: {
            "assistance": "Assistance",
            "autocare": "AutoCare",
            "ai_support": "AI Support",
            "history": "History",
            "book_now": "Book Now",
            "diagnostic_report": "Diagnostic Report",
            "overall_health": "Overall Health",
            "service_type": "Service Type",
            "location": "Location",
            "vehicle_info": "Vehicle Info",
            "request_assistance": "Request Assistance",
            "select_service": "Select a Service"
        }
    },
    hi: {
        translation: {
            "assistance": "सहायता",
            "autocare": "ऑटोकेयर",
            "ai_support": "एआई सहायता",
            "history": "इतिहास",
            "book_now": "अभी बुक करें",
            "diagnostic_report": "नैदानिक रिपोर्ट",
            "overall_health": "कुल स्वास्थ्य",
            "service_type": "सेवा का प्रकार",
            "location": "स्थान",
            "vehicle_info": "वाहन की जानकारी",
            "request_assistance": "सहायता का अनुरोध करें",
            "select_service": "एक सेवा चुनें"
        }
    }
};

const LANGUAGE_KEY = 'user-language';

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
