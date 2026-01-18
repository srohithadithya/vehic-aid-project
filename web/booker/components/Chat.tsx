'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { apiClient } from '@/lib/api';
import { Send, User, Wrench } from 'lucide-react';
import { clsx } from 'clsx';

interface Message {
    id: number;
    sender: number;
    sender_name: string;
    message: string;
    is_read: boolean;
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
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchMessages = useCallback(async () => {
        try {
            const response = await apiClient.get(`/chat/?request_id=${requestId}`);
            setMessages(response.data);
        } catch (error) {
            console.error('Failed to fetch messages', error);
        } finally {
            setLoading(false);
        }
    }, [requestId]);

    useEffect(() => {
        fetchMessages();
        // Poll for new messages every 3 seconds
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    useEffect(() => {
        // Auto-scroll to bottom when new messages arrive
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            await apiClient.post('/chat/', {
                request: requestId,
                message: newMessage.trim()
            });
            setNewMessage('');
            fetchMessages(); // Refresh messages immediately
        } catch (error) {
            console.error('Failed to send message', error);
            alert('Failed to send message. Please try again.');
        } finally {
            setSending(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading chat...</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[500px] bg-white dark:bg-zinc-900 rounded-xl shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10">
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                    <Wrench className="w-5 h-5 mr-2 text-blue-500" />
                    Chat with Provider
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {messages.length === 0 ? 'No messages yet' : `${messages.length} message${messages.length !== 1 ? 's' : ''}`}
                </p>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-4"
            >
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                            <Send className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400">No messages yet</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                            Start a conversation with your service provider
                        </p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={clsx(
                                'flex items-start space-x-3',
                                msg.is_me ? 'flex-row-reverse space-x-reverse' : ''
                            )}
                        >
                            {/* Avatar */}
                            <div className={clsx(
                                'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0',
                                msg.is_me
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-200 dark:bg-zinc-700 text-gray-600 dark:text-gray-300'
                            )}>
                                {msg.is_me ? <User className="w-4 h-4" /> : <Wrench className="w-4 h-4" />}
                            </div>

                            {/* Message Bubble */}
                            <div className={clsx(
                                'flex flex-col max-w-[70%]',
                                msg.is_me ? 'items-end' : 'items-start'
                            )}>
                                <div className={clsx(
                                    'rounded-2xl px-4 py-2.5 shadow-sm',
                                    msg.is_me
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white'
                                )}>
                                    <p className="text-sm leading-relaxed">{msg.message}</p>
                                </div>
                                <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 px-1">
                                    {new Date(msg.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
                <div className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your message..."
                        disabled={sending}
                        className="flex-1 rounded-lg border-0 py-2.5 px-4 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-zinc-700 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 dark:bg-zinc-800 disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {sending ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
