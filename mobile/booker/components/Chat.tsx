import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Send, User, ChevronLeft } from 'lucide-react-native';
import { api } from '../services/api';
import { useAuthStore } from '../store/authStore';

interface Message {
    id: number;
    message: string;
    sender_name: string;
    is_me: boolean;
    created_at: string;
}

interface ChatProps {
    requestId: number;
    onClose?: () => void;
}

export default function Chat({ requestId, onClose }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const flatListRef = useRef<FlatList>(null);
    const { user } = useAuthStore();

    const fetchMessages = async () => {
        try {
            const response = await api.get(`/chat/?request_id=${requestId}`);
            // Detect if message is from me based on sender ID or name logic from backend
            // ideally backend adds 'is_me' flag
            setMessages(response.data);
        } catch (error) {
            console.log("Error fetching messages", error);
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim()) return;
        setSending(true);
        try {
            await api.post('/chat/', {
                request: requestId,
                message: inputText,
            });
            setInputText('');
            fetchMessages(); // Refresh immediately
        } catch (error) {
            console.error("Failed to send", error);
        } finally {
            setSending(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000); // Poll every 3s
        return () => clearInterval(interval);
    }, [requestId]);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-gray-50"
        >
            <View className="p-4 bg-white border-b border-gray-200 flex-row items-center">
                {onClose && (
                    <TouchableOpacity onPress={onClose} className="mr-3">
                        <ChevronLeft size={24} color="#374151" />
                    </TouchableOpacity>
                )}
                <View>
                    <Text className="font-bold text-gray-800 text-lg">Provider Chat</Text>
                    <Text className="text-xs text-gray-500">Request #{requestId}</Text>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                className="flex-1 px-4"
                contentContainerStyle={{ paddingVertical: 16 }}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
                renderItem={({ item }) => (
                    <View className={`mb-3 flex-row ${item.is_me ? 'justify-end' : 'justify-start'}`}>
                        {!item.is_me && (
                            <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center mr-2 self-end mb-1">
                                <User size={14} color="#6b7280" />
                            </View>
                        )}
                        <View
                            className={`px-4 py-2 rounded-2xl max-w-[75%] ${item.is_me
                                    ? 'bg-blue-600 rounded-tr-none'
                                    : 'bg-white border border-gray-200 rounded-tl-none'
                                }`}
                        >
                            <Text className={`${item.is_me ? 'text-white' : 'text-gray-800'}`}>
                                {item.message}
                            </Text>
                            <Text className={`text-[10px] mt-1 ${item.is_me ? 'text-blue-200' : 'text-gray-400'}`}>
                                {new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <Text className="text-center text-gray-400 mt-10">No messages yet. Say hi!</Text>
                }
            />

            <View className="p-3 bg-white border-t border-gray-200 flex-row items-center">
                <TextInput
                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2 text-gray-800 h-10"
                    placeholder="Type a message..."
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity
                    className="bg-blue-600 w-10 h-10 rounded-full items-center justify-center"
                    onPress={sendMessage}
                    disabled={sending}
                >
                    {sending ? <ActivityIndicator size="small" color="#fff" /> : <Send size={18} color="#fff" />}
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}
