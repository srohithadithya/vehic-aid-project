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
        'nav.book': 'Book Service',
        'nav.sub': 'Subscriptions',
        'nav.health': 'Vehicle Health',
        'nav.support': 'AutoMind AI',
        'nav.dashboard': 'Dashboard',
        'hero.title': 'Roadside Assistance Reimagined.',
        'hero.subtitle': 'Fast, reliable, and professional help when you need it most.',
        'health.title': 'AutoCare Health Engine',
        'health.status': 'System Status',
        'support.title': 'AutoMind Intelligence',
        'support.placeholder': 'Describe your vehicle issue or ask a question...',
    },
    hi: {
        'nav.book': 'सेवा बुक करें',
        'nav.sub': 'सदस्यता',
        'nav.health': 'वाहन स्वास्थ्य',
        'nav.support': 'ऑटोमाइंड एआई',
        'nav.dashboard': 'डैशबोर्ड',
        'hero.title': 'ब्रेकडाउन सहायता, अब और भी आसान।',
        'hero.subtitle': 'जब आपको सबसे अधिक आवश्यकता हो, तब तेज़ और विश्वसनीय सहायता।',
        'health.title': 'ऑटोकेयर हेल्थ इंजन',
        'health.status': 'सिस्टम की स्थिति',
        'support.title': 'ऑटोमाइंड इंटेलिजेंस',
        'support.placeholder': 'अपने वाहन की समस्या बताएं या कोई प्रश्न पूछें...',
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
