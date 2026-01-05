'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const toggle = () => {
        setLanguage(language === 'en' ? 'hi' : 'en');
    };

    return (
        <button
            onClick={toggle}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-full border border-gray-700 hover:border-green-500 transition-colors bg-gray-900/50"
        >
            <Globe className="h-4 w-4 text-green-500" />
            <span className="text-xs font-bold uppercase tracking-tighter">{language}</span>
        </button>
    );
}
