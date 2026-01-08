'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        'nav.dashboard': 'Dashboard',
        'nav.users': 'Users',
        'nav.bookings': 'Bookings',
        'nav.payments': 'Payments',
        'nav.iot': 'IoT Fleet',
        'nav.ai': 'AI Monitor',
        'nav.analytics': 'Analytics',
        'header.title': 'Command Center',
    },
    hi: {
        'nav.dashboard': 'डैशबोर्ड',
        'nav.users': 'उपयोगकर्ता',
        'nav.bookings': 'बुकिंग',
        'nav.payments': 'भुगतान',
        'nav.iot': 'आईओटी बेड़े',
        'nav.ai': 'एआई मॉनिटर',
        'nav.analytics': 'एनालिटिक्स',
        'header.title': 'कमांड सेंटर',
    }
};

const LanguageContext = createContext<LanguageState | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('en');

    const t = (key: string) => {
        return translations[language][key] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
