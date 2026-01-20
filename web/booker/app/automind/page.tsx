'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiClient } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Bot, Send, Sparkles, MapPin, Wrench, Loader2,
    CalendarCheck, Info, ShieldCheck, Zap, HelpCircle,
    ChevronRight, BatteryLow, Fuel, Trash2
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';
import { useRouter } from 'next/navigation';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    type?: 'info' | 'action' | 'error';
    actionData?: any;
}

export default function AutoMindPage() {
    const { user } = useAuth();
    const { t } = useLanguage();
    const router = useRouter();
    const scrollRef = useRef<HTMLDivElement>(null);

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: "Welcome to AutoMind Intelligence. I am your all-in-one automotive guardian. I can diagnose issues, answer questions about VehicAid, or immediately dispatch help. How can I assist you today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    // Auto-scroll to bottom
    useEffect(() => {
        const scrollArea = document.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollArea) {
            scrollArea.scrollTop = scrollArea.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (overrideInput?: string) => {
        const textToSend = overrideInput || input;
        if (!textToSend.trim()) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: textToSend
        };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        // --- Logic: Determine if this is a Support Query or a Booking Request ---
        const lowerText = textToSend.toLowerCase();

        // 1. Check if it's a general question (Support)
        if (lowerText.includes('how') || lowerText.includes('what') || lowerText.includes('cost') || lowerText.includes('price') || lowerText.includes('can i')) {
            setTimeout(() => {
                let response = "VehicAid provides 24/7 roadside assistance across India. Our pricing starts at just ₹49 for basic help. You can see all plans in the Subscriptions section.";

                if (lowerText.includes('price') || lowerText.includes('cost')) {
                    response = "Basic services start at ₹49. For premium members, most standard help (Jumpstarts, Fuel delivery, etc.) is included for free up to 5km!";
                } else if (lowerText.includes('contact') || lowerText.includes('call')) {
                    response = "You can call our emergency helpline at +91-1800-VEHICAID any time.";
                }

                setMessages(prev => [...prev, {
                    id: (Date.now() + 1).toString(),
                    role: 'assistant',
                    content: response,
                    type: 'info'
                }]);
                setLoading(false);
            }, 1000);
            return;
        }

        // 2. Otherwise, treat as an Agentic Booking (Executor)
        try {
            const res = await apiClient.post('/services/automind/', {
                description: textToSend,
                latitude: 12.9716, // Default to Bangalore (ideally use geolocation)
                longitude: 77.5946
            });

            const aiResponse = res.data.message || "I've analyzed your situation.";

            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: aiResponse
            }]);

            if (res.data.status === 'SUCCESS') {
                setMessages(prev => [...prev, {
                    id: (Date.now() + 2).toString(),
                    role: 'assistant',
                    content: "✅ MISSION TRIGGERED: I have successfully dispatched a provider to your coordinates. You can track them in your dashboard.",
                    type: 'action',
                    actionData: { requestId: res.data.request_id }
                }]);
            }
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm having trouble connecting to the dispatch network. You can try our manual booking form if this is urgent.",
                type: 'error'
            }]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([{
            id: '1',
            role: 'assistant',
            content: "AutoMind reset. Ready for new instructions."
        }]);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white pt-24 pb-12 px-4 selection:bg-indigo-500/30">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[120px] -mr-96 -mt-96" />
                <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px] -ml-96 -mb-96" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
            </div>

            <div className="max-w-5xl mx-auto space-y-8 relative z-10">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold tracking-widest uppercase">
                            <Sparkles className="w-3 h-3" />
                            Next-Gen Intelligence
                        </div>
                        <h1 className="text-5xl md:text-6xl font-black tracking-tight">
                            Auto<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Mind</span>
                        </h1>
                        <p className="text-slate-400 text-lg max-w-xl">
                            The intelligent core of VehicAid. Describe, diagnose, and dispatch with a single conversation.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={clearChat}
                            className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl"
                        >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear History
                        </Button>
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <Bot className="w-6 h-6" />
                        </div>
                    </div>
                </div>

                {/* Main Interaction Area */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[650px]">

                    {/* Sidebar: Knowledge & Context */}
                    <div className="hidden lg:flex lg:col-span-4 flex-col gap-4">
                        <Card className="flex-1 bg-white/5 border-white/10 p-5 rounded-3xl backdrop-blur-xl flex flex-col gap-6">
                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                    <Info className="w-4 h-4" />
                                    Smart Context
                                </h3>
                                <div className="space-y-3">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-xs text-slate-400 mb-1">User Profile</p>
                                        <p className="font-semibold">{user?.username || 'Guest'}</p>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <p className="text-xs text-slate-400 mb-1">Active Plan</p>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                            <p className="font-semibold text-emerald-400">Premium Elite</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Capabilities</h3>
                                <ul className="space-y-3">
                                    {[
                                        { icon: Zap, text: "Instant Dispatch", color: "text-yellow-400" },
                                        { icon: ShieldCheck, text: "Safety Analysis", color: "text-blue-400" },
                                        { icon: HelpCircle, text: "Technical Support", color: "text-purple-400" },
                                    ].map((cap, i) => (
                                        <li key={i} className="flex items-center gap-3 text-sm text-slate-300">
                                            <cap.icon className={`w-4 h-4 ${cap.color}`} />
                                            {cap.text}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="mt-auto p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                                <p className="text-xs text-indigo-300 leading-relaxed">
                                    AutoMind is learning. I currently excel at identifying tire, battery, and engine breakdown patterns.
                                </p>
                            </div>
                        </Card>
                    </div>

                    {/* Main Chat Interface */}
                    <Card className="lg:col-span-8 bg-white/5 border-white/10 flex flex-col rounded-3xl backdrop-blur-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
                        {/* Messages Area */}
                        <div className="flex-1 min-h-0 relative">
                            <ScrollArea className="h-full p-6">
                                <div className="space-y-6">
                                    <AnimatePresence initial={false}>
                                        {messages.map((msg) => (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, y: 15, scale: 0.98 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div className={`group relative max-w-[85%] p-4 rounded-2xl ${msg.role === 'user'
                                                    ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/20'
                                                    : msg.type === 'error'
                                                        ? 'bg-red-500/10 border border-red-500/20 text-red-200 rounded-tl-none'
                                                        : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5'
                                                    }`}>
                                                    <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>

                                                    {msg.type === 'action' && msg.actionData && (
                                                        <Button
                                                            onClick={() => router.push('/dashboard')}
                                                            className="mt-4 w-full bg-white text-indigo-600 hover:bg-slate-100 font-bold rounded-xl"
                                                        >
                                                            Track Provider
                                                            <ChevronRight className="w-4 h-4 ml-1" />
                                                        </Button>
                                                    )}

                                                    <span className="absolute -bottom-5 left-0 text-[10px] text-slate-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest mt-2 block">
                                                        {msg.role === 'user' ? 'You' : 'AutoMind'}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))}
                                        {loading && (
                                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                                                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                                                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                                                    <span className="text-sm text-slate-400 font-medium italic">AutoMind is thinking...</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </ScrollArea>
                        </div>

                        {/* Input Footer */}
                        <div className="p-4 bg-white/5 border-t border-white/5 backdrop-blur-xl">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-3"
                            >
                                <div className="flex-1 relative group">
                                    <Input
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Type an emergency or a question..."
                                        disabled={loading}
                                        className="h-14 bg-white/5 border-white/10 rounded-2xl pl-12 pr-4 text-white focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-600"
                                    />
                                    <Bot className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                                </div>
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={loading || !input.trim()}
                                    className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 hover:scale-105 transition-transform shadow-lg shadow-indigo-500/20"
                                >
                                    <Send className="w-6 h-6" />
                                </Button>
                            </form>
                        </div>
                    </Card>
                </div>

                {/* Quick Shortcuts */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { icon: BatterLow, label: "Dead Battery", text: "My car won't start, clicks when I turn the key." },
                        { icon: MapPin, label: "Flat Tire", text: "Got a puncture on the highway, need help changing it." },
                        { icon: Fuel, label: "Empty Tank", text: "Out of petrol, please deliver 5 liters." },
                        { icon: HelpCircle, label: "How it works?", text: "How does VehicAid works and what are the prices?" }
                    ].map((item, i) => (
                        <button
                            key={i}
                            onClick={() => handleSend(item.text)}
                            className="bg-white/5 border border-white/10 p-4 rounded-2xl text-left hover:bg-white/10 hover:border-white/20 transition-all group"
                        >
                            <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <item.icon className="w-5 h-5 text-indigo-400" />
                            </div>
                            <p className="font-bold text-sm text-white mb-1">{item.label}</p>
                            <p className="text-[10px] text-slate-500 line-clamp-1">{item.text}</p>
                        </button>
                    ))}
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}

function BatterLow(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="16" height="10" x="2" y="7" rx="2" ry="2" />
            <line x1="22" x2="22" y1="11" y2="13" />
            <line x1="6" x2="6" y1="11" y2="13" />
        </svg>
    )
}
