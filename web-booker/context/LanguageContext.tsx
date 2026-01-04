'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es' | 'fr' | 'de';

interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
    en: {
        'nav.book': 'Book Service',
        'nav.sub': 'Subscriptions',
        'nav.about': 'About',
        'hero.title': 'Roadside Assistance Reimagined.',
    },
    es: {
        'nav.book': 'Reservar Servicio',
        'nav.sub': 'Suscripciones',
        'nav.about': 'Acerca de',
        'hero.title': 'Asistencia en Carretera Reinventada.',
    },
    fr: {
        'nav.book': 'Réserver',
        'nav.sub': 'Abonnements',
        'nav.about': 'À propos',
        'hero.title': 'L\'assistance routière réinventée.',
    },
    de: {
        'nav.book': 'Service Buchen',
        'nav.sub': 'Abonnements',
        'nav.about': 'Uber uns',
        'hero.title': 'Pannenhilfe neu gedacht.',
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
