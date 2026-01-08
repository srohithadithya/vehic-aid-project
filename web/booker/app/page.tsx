'use client';

import { BookingProvider } from "@/context/BookingContext";
import BookingWizard from "@/components/booking/BookingWizard";
import { Navbar } from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Wizard */}
      <section className="relative py-12 md:py-20 lg:py-24 overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>

        <div className="container mx-auto px-4 text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight lg:text-7xl mb-6">
            {t('hero.title').split('.')[0]} <br className="hidden md:block" />
            <span className="text-primary">{t('hero.title').split('.')[1] || 'Reimagined.'}</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            {t('hero.subtitle')}
          </p>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <BookingProvider>
            <div className="bg-background/80 backdrop-blur-xl border rounded-2xl shadow-2xl p-6 md:p-8 max-w-4xl mx-auto ring-1 ring-white/20">
              <BookingWizard />
            </div>
          </BookingProvider>
        </div>

        <div className="mt-20 text-center">
          <p className="text-sm text-muted-foreground">Trusted by thousands of drivers worldwide.</p>
        </div>
      </section>
    </main>
  );
}
