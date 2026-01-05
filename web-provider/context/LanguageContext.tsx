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
        'nav.dashboard': 'Job Dashboard',
        'nav.history': 'Job History',
        'nav.profile': 'Partner Profile',
        'hero.title': 'Drive. Help. Earn.',
        'hero.subtitle': "Join India's premium roadside assistance network. Get instant payouts and IoT-enabled dispatch.",
        'home.cta': 'Start Driving',
        'home.learn': 'Learn More',
        'feature.payout': 'Daily Settlements',
        'feature.payout_desc': 'Payments are processed automatically every 24 hours.',
        'feature.dispatch': 'Smart Dispatch',
        'feature.dispatch_desc': 'IoT-enabled tracking ensures you get jobs that are actually nearby.',
        'feature.trust': 'Verified Trust',
        'feature.trust_desc': 'Build your reputation with our world-class rating system.',
        'portal.title': 'Partner Portal',
        'portal.subtitle': 'Manage your service requests',
        'portal.online': 'You are Online',
        'portal.offline': 'You are Offline',
        'portal.active_jobs': 'Active Jobs',
        'portal.new_requests': 'New Requests',
        'portal.accept': 'Accept Job',
        'portal.manage': 'Manage Job',
        'portal.no_jobs': 'No new requests available nearby.',
        'job.back': 'Back to Dashboard',
        'job.details': 'Job Details',
        'job.customer': 'Customer',
        'job.location': 'Location',
        'job.call': 'Call Customer',
        'job.navigate': 'Navigate',
        'job.actions': 'Job Actions',
        'job.mark_arrived': 'Mark as Arrived / In Progress',
        'job.complete': 'Complete Job',
        'job.completed_success': 'Job Completed Successfully',
        'job.notes': 'Notes',
        'job.no_notes': 'No notes provided.',
        'login.title': 'Partner Login',
        'login.subtitle': 'Sign in to manage service requests',
        'login.username': 'Username',
        'login.password': 'Password',
        'login.button': 'Portal Login',
        'login.signing_in': 'Signing in...',
    },
    hi: {
        'nav.dashboard': 'जॉब डैशबोर्ड',
        'nav.history': 'पुराना रिकॉर्ड',
        'nav.profile': 'पार्टनर प्रोफाइल',
        'hero.title': 'ड्राइव करें। मदद करें। कमाएं।',
        'hero.subtitle': 'भारत के प्रीमियम रोडसाइड सहायता नेटवर्क में शामिल हों। तत्काल भुगतान और IoT-सक्षम डिस्पैच प्राप्त करें।',
        'home.cta': 'ड्राइविंग शुरू करें',
        'home.learn': 'और जानें',
        'feature.payout': 'दैनिक भुगतान',
        'feature.payout_desc': 'भुगतान हर 24 घंटे में अपने आप हो जाता है।',
        'feature.dispatch': 'स्मार्ट डिस्पैच',
        'feature.dispatch_desc': 'IoT-सक्षम ट्रैकिंग सुनिश्चित करती है कि आपको आस-पास के जॉब मिले।',
        'feature.trust': 'सत्यापित विश्वास',
        'feature.trust_desc': 'हमारी विश्व स्तरीय रेटिंग प्रणाली के साथ अपनी प्रतिष्ठा बनाएं।',
        'portal.title': 'पार्टनर पोर्टल',
        'portal.subtitle': 'अपने सेवा अनुरोधों को प्रबंधित करें',
        'portal.online': 'आप ऑनलाइन हैं',
        'portal.offline': 'आप ऑफलाइन हैं',
        'portal.active_jobs': 'सक्रिय कार्य',
        'portal.new_requests': 'नए अनुरोध',
        'portal.accept': 'कार्य स्वीकार करें',
        'portal.manage': 'कार्य प्रबंधित करें',
        'portal.no_jobs': 'आस-पास कोई नया अनुरोध उपलब्ध नहीं है।',
        'job.back': 'डैशबोर्ड पर वापस जाएं',
        'job.details': 'जॉब विवरण',
        'job.customer': 'ग्राहक',
        'job.location': 'स्थान',
        'job.call': 'ग्राहक को कॉल करें',
        'job.navigate': 'नेविगेट करें',
        'job.actions': 'जॉब क्रियाएं',
        'job.mark_arrived': 'पहुंचे / प्रगति पर मार्क करें',
        'job.complete': 'जॉब पूरा करें',
        'job.completed_success': 'जॉब सफलतापूर्वक पूरा हो गया',
        'job.notes': 'नोट्स',
        'job.no_notes': 'कोई नोट्स नहीं दिए गए।',
        'login.title': 'पार्टनर लॉग इन',
        'login.subtitle': 'सेवा अनुरोधों को प्रबंधित करने के लिए साइन इन करें',
        'login.username': 'उपयोगकर्ता नाम',
        'login.password': 'पासवर्ड',
        'login.button': 'पोर्टल लॉगिन',
        'login.signing_in': 'साइन इन हो रहा है...',
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
