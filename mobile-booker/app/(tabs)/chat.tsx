import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBooking } from '../../src/context/BookingContext';
import Colors from '../../constants/Colors';
import { useColorScheme } from '../../components/useColorScheme';
import { LucideSend, LucideBot, LucideUser, LucideSparkles, LucideCalendarCheck } from 'lucide-react-native';
import Animated, { FadeIn, SlideInRight, SlideInLeft } from 'react-native-reanimated';
import { useRouter } from 'expo-router';

interface Message {
    id: string;
    text: string;
    sender: 'ai' | 'user';
    serviceSuggestion?: string;
}

export default function AISupportScreen() {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', text: "Hello! I'm your Vehic-Aid Assistant. Describe your vehicle problem and I'll help you find the right service.", sender: 'ai' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const { dispatch } = useBooking();
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const router = useRouter();
    const flatListRef = useRef<FlatList>(null);

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
        dispatch({ type: 'SET_SERVICE', payload: suggestion as any });
        dispatch({ type: 'NEXT_STEP' });
        router.push('/(tabs)');
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <Animated.View
            entering={item.sender === 'ai' ? SlideInLeft : SlideInRight}
            style={[
                styles.messageContainer,
                item.sender === 'ai' ? styles.aiMessage : styles.userMessage,
                { backgroundColor: item.sender === 'ai' ? theme.card : theme.tint }
            ]}
        >
            <View style={styles.messageHeader}>
                {item.sender === 'ai' ? <LucideBot size={16} color={theme.tint} /> : <LucideUser size={16} color="#fff" />}
                <Text style={[styles.senderName, { color: item.sender === 'ai' ? theme.tabIconDefault : 'rgba(255,255,255,0.7)' }]}>
                    {item.sender === 'ai' ? 'Vehic-Aid AI' : 'You'}
                </Text>
            </View>
            <Text style={[styles.messageText, { color: item.sender === 'ai' ? theme.text : '#fff' }]}>{item.text}</Text>

            {item.serviceSuggestion && (
                <TouchableOpacity
                    style={styles.bookButton}
                    onPress={() => handleInstantBook(item.serviceSuggestion!)}
                >
                    <LucideCalendarCheck size={18} color="#fff" />
                    <Text style={styles.bookButtonText}>Instant Book {item.serviceSuggestion}</Text>
                </TouchableOpacity>
            )}
        </Animated.View>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <LucideSparkles color={theme.tint} size={24} />
                <Text style={[styles.title, { color: theme.text }]}>AI Assistant</Text>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.list}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={100}
            >
                <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                    <TextInput
                        style={[styles.input, { color: theme.text }]}
                        placeholder="E.g. My car is making a clicking sound..."
                        placeholderTextColor={theme.tabIconDefault}
                        value={input}
                        onChangeText={setInput}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, { backgroundColor: theme.tint }]}
                        onPress={handleSend}
                        disabled={loading}
                    >
                        <LucideSend size={20} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    list: {
        padding: 20,
        paddingBottom: 40,
    },
    messageContainer: {
        maxWidth: '85%',
        padding: 15,
        borderRadius: 20,
        marginBottom: 15,
        elevation: 2,
    },
    aiMessage: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 5,
    },
    userMessage: {
        alignSelf: 'flex-end',
        borderBottomRightRadius: 5,
    },
    messageHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    senderName: {
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 5,
        textTransform: 'uppercase',
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        margin: 20,
        borderRadius: 25,
        borderWidth: 1,
    },
    input: {
        flex: 1,
        paddingHorizontal: 15,
        paddingVertical: 10,
        fontSize: 16,
        maxHeight: 100,
    },
    sendButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    bookButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#10b981',
        padding: 12,
        borderRadius: 12,
        marginTop: 15,
        justifyContent: 'center',
    },
    bookButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 8,
        fontSize: 14,
    },
});
