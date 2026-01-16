'use client';

import { useState, useEffect, useRef } from 'react';
import { apiClient } from '@/lib/api';
import { Send, MessageCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
    id: number;
    sender_name: string;
    message: string;
    is_me: boolean;
    created_at: string;
}

interface ChatProps {
    requestId: number;
}

export function Chat({ requestId }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 4000); // Polling every 4s
        return () => clearInterval(interval);
    }, [requestId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const response = await apiClient.get(`/chat/?request_id=${requestId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const messageToSend = newMessage;
        setNewMessage('');

        try {
            const response = await apiClient.post('/chat/', {
                request: requestId,
                message: messageToSend
            });
            setMessages((prev: Message[]) => [...prev, { ...response.data, is_me: true }]);
        } catch (error) {
            console.error('Failed to send message', error);
            setNewMessage(messageToSend); // restore on failure
        }
    };

    return (
        <div className="flex flex-col h-[450px] bg-white dark:bg-zinc-900 rounded-3xl shadow-xl ring-1 ring-gray-900/5 dark:ring-white/10 overflow-hidden border border-white/5">
            <div className="p-5 border-b dark:border-white/10 bg-gray-50/50 dark:bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">Customer Support</h3>
                        <p className="text-[10px] text-green-500 font-bold uppercase tracking-wider">Online</p>
                    </div>
                </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                {messages.length === 0 && !loading && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-2 opacity-50">
                        <MessageCircle className="w-12 h-12 text-gray-400" />
                        <p className="text-gray-500 text-sm">No messages yet.<br />Start the conversation!</p>
                    </div>
                )}
                {messages.map((msg: Message) => (
                    <div key={msg.id} className={clsx("flex flex-col", msg.is_me ? "items-end" : "items-start")}>
                        <div className={clsx(
                            "max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed",
                            msg.is_me
                                ? "bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-500/20"
                                : "bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-gray-200 rounded-tl-none"
                        )}>
                            {msg.message}
                        </div>
                        <span className="text-[10px] text-gray-500 mt-1.5 px-1 font-medium">
                            {msg.is_me ? 'You' : msg.sender_name} • {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-gray-50/50 dark:bg-white/5 border-t dark:border-white/10 flex gap-3">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Message customer..."
                    className="flex-1 bg-white dark:bg-zinc-800 border-none rounded-2xl px-5 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-inner"
                />
                <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 text-white p-3 rounded-2xl transition-all shadow-lg shadow-blue-500/30"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
