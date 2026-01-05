'use client';

import Link from 'next/link';
import { ShieldCheck, Map, Wallet } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';

export default function ProviderHome() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500 selection:text-black">
      <Navbar />

      <main className="container mx-auto px-6 py-20 text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          {t('hero.title').split('.').slice(0, 2).join('.')} <span className="text-green-500">{t('hero.title').split('.').slice(2).join('')}</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          {t('hero.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-20">
          <Link href="/login" className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition text-lg">
            {t('home.cta')}
          </Link>
          <Link href="/about" className="px-8 py-4 bg-gray-900 border border-gray-700 text-white font-bold rounded-xl hover:bg-gray-800 transition text-lg">
            {t('home.learn')}
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-green-500">
              <Wallet />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('feature.payout')}</h3>
            <p className="text-gray-400">{t('feature.payout_desc')}</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-green-500">
              <Map />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('feature.dispatch')}</h3>
            <p className="text-gray-400">{t('feature.dispatch_desc')}</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-2xl border border-gray-800">
            <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center mb-4 text-green-500">
              <ShieldCheck />
            </div>
            <h3 className="text-xl font-bold mb-2">{t('feature.trust')}</h3>
            <p className="text-gray-400">{t('feature.trust_desc')}</p>
          </div>
        </div>
      </main>
    </div>
  );
}
