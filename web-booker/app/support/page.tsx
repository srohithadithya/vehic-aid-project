'use client';

import { useState, useRef, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { LucideSend, LucideBot, LucideUser, LucideSparkles, LucideCalendarCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface Message {
    id: string;
    text: string;
    sender: 'ai' | 'user';
    serviceSuggestion?: string;
}

export default function SupportPage() {
    const { t } = useLanguage();
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hello! I'm your Vehic-Aid Assistant. Describe your vehicle problem and I'll help you find the right service.", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: input, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // Simulate AI Triage
        setTimeout(() => {
            let suggestion = "MECHANIC";
            let response = "I've analyzed your description. It sounds like a mechanical issue. Would you like me to book a roadside mechanic for you?";

            const lowerInput = input.toLowerCase();
            if (lowerInput.includes('tow') || lowerInput.includes('stuck') || lowerInput.includes('accident')) {
                suggestion = "TOWING";
                response = "That sounds serious. I recommend booking a Tow Truck immediately to move your vehicle to safety.";
            } else if (lowerInput.includes('battery') || lowerInput.includes('start')) {
                suggestion = "JUMPSTART";
                response = "It might be a dead battery. I can dispatch a specialist for a quick Jumpstart.";
            } else if (lowerInput.includes('fuel') || lowerInput.includes('gas')) {
                suggestion = "FUEL";
                response = "Ran out of fuel? No worries, I can send a fuel delivery truck to your location.";
            }

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                sender: 'ai',
                serviceSuggestion: suggestion
            };
            setMessages(prev => [...prev, aiMsg]);
            setLoading(false);
        }, 1500);
    };

    const handleInstantBook = (suggestion: string) => {
        // In a real app, we'd set the wizard state here. 
        // For now, we'll redirect to the home page (booking wizard)
        router.push('/');
    };

    return (
        <main className="min-h-screen bg-background flex flex-col">
            <Navbar />

            <div className="flex-1 container mx-auto max-w-4xl p-4 md:p-6 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <LucideSparkles className="text-primary" size={24} />
                    </div>
                    <h1 className="text-2xl font-bold">{t('support.title')}</h1>
                </div>

                {/* Chat Feed */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto space-y-6 pr-4 custom-scrollbar"
                >
                    <AnimatePresence>
                        {messages.map((item) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: item.sender === 'ai' ? -20 : 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className={`flex ${item.sender === 'ai' ? 'justify-start' : 'justify-end'}`}
                            >
                                <div className={`max-w-[80%] p-5 rounded-2xl shadow-sm ${item.sender === 'ai' ? 'bg-card border' : 'bg-primary text-primary-foreground'
                                    }`}>
                                    <div className="flex items-center space-x-2 mb-2">
                                        {item.sender === 'ai' ? <LucideBot size={14} className="text-primary" /> : <LucideUser size={14} />}
                                        <span className={`text-[10px] uppercase font-bold tracking-widest ${item.sender === 'ai' ? 'text-muted-foreground' : 'text-primary-foreground/70'
                                            }`}>
                                            {item.sender === 'ai' ? 'Assistant' : 'You'}
                                        </span>
                                    </div>
                                    <p className="text-sm md:text-base leading-relaxed">{item.text}</p>

                                    {item.serviceSuggestion && (
                                        <button
                                            onClick={() => handleInstantBook(item.serviceSuggestion!)}
                                            className="mt-4 w-full flex items-center justify-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl transition-all scale-100 active:scale-95"
                                        >
                                            <LucideCalendarCheck size={18} />
                                            <span>Instant Book {item.serviceSuggestion}</span>
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                <div className="bg-card border p-4 rounded-2xl flex space-x-1">
                                    <span className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                                    <span className="w-2 h-2 bg-muted-foreground/30 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Input area */}
                <div className="mt-6">
                    <div className="relative group">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={t('support.placeholder')}
                            className="w-full bg-card border rounded-2xl py-5 px-6 pr-16 focus:ring-2 focus:ring-primary outline-none transition-all shadow-lg text-sm md:text-base"
                        />
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="absolute right-3 top-3 p-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-opacity active:scale-95"
                        >
                            <LucideSend size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
