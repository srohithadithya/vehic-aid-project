'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

export function LanguageToggle() {
    const { language, setLanguage } = useLanguage();

    const toggle = () => {
        const nextLang = language === 'en' ? 'hi' : 'en';
        setLanguage(nextLang);
    };

    return (
        <Button variant="ghost" size="icon" onClick={toggle} title={`Current: ${language.toUpperCase()}`}>
            <Globe className="h-5 w-5" />
            <span className="sr-only">Toggle Language</span>
            <span className="absolute top-0 right-0 text-[10px] font-bold bg-primary text-primary-foreground px-1 rounded-bl-sm">
                {language.toUpperCase()}
            </span>
        </Button>
    );
}
