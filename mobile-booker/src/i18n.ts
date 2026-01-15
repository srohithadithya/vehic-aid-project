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
            "select_service": "Select a Service",
            "diagnostic_status": "Diagnostics",
            "vehicle_exchange": "Vehicle Exchange",
            "vehicle_placement": "Vehicle Placement",
            "helpline": "24/7 Helpline",
            "my_vehicles": "My Vehicles",
            "wallet": "Wallet & Payments",
            "subscriptions": "Subscriptions & Plans",
            "iot_device": "IoT Device Status",
            "support": "Support & Help",
            "settings": "Settings",
            "about": "About VehicAid",
            "upgrade_now": "Upgrade Now",
            "toll_free": "Toll Free",
            "call_now": "Call Now"
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
            "select_service": "एक सेवा चुनें",
            "diagnostic_status": "नैदानिक",
            "vehicle_exchange": "वाहन विनिमय",
            "vehicle_placement": "वाहन प्लेसमेंट",
            "helpline": "24/7 हेल्पलाइन",
            "my_vehicles": "मेरे वाहन",
            "wallet": "वॉलेट और भुगतान",
            "subscriptions": "सब्सक्रिप्शन और प्लान",
            "iot_device": "IoT डिवाइस स्थिति",
            "support": "सहायता और मदद",
            "settings": "सेटिंग्स",
            "about": "VehicAid के बारे में",
            "upgrade_now": "अभी अपग्रेड करें",
            "toll_free": "टोल फ्री",
            "call_now": "अभी कॉल करें"
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
