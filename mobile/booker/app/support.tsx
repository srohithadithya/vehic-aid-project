import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import Colors from '../constants/Colors';
import { useColorScheme } from '../components/useColorScheme';
import { LucideSend, LucideBot, LucideUser, LucidePhone } from 'lucide-react-native';

export default function SupportScreen() {
    const colorScheme = useColorScheme();
    const theme = Colors[colorScheme ?? 'light'];
    const [messages, setMessages] = useState([
        { id: '1', text: 'Hello! I am your VehicAid assistant. How can I help you today?', sender: 'bot' }
    ]);
    const [inputText, setInputText] = useState('');

    const sendMessage = () => {
        if (!inputText.trim()) return;

        const userMsg = { id: Date.now().toString(), text: inputText, sender: 'user' };
        setMessages(prev => [...prev, userMsg]);
        setInputText('');

        // Simulate AI Response
        setTimeout(() => {
            const botMsg = {
                id: (Date.now() + 1).toString(),
                text: "I see you're asking about that. Our support team is available 24/7. Would you like to connect with a human agent?",
                sender: 'bot'
            };
            setMessages(prev => [...prev, botMsg]);
        }, 1000);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={[
            styles.messageBubble,
            item.sender === 'user' ? styles.userBubble : styles.botBubble,
            item.sender === 'bot' && { backgroundColor: theme.card }
        ]}>
            {item.sender === 'bot' && (
                <View style={styles.botIcon}>
                    <LucideBot size={16} color={theme.text} />
                </View>
            )}
            <Text style={[
                styles.messageText,
                item.sender === 'user' ? { color: '#fff' } : { color: theme.text }
            ]}>
                {item.text}
            </Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.container, { backgroundColor: theme.background }]}
            keyboardVerticalOffset={100}
        >
            <View style={styles.header}>
                <Text style={[styles.headerTitle, { color: theme.text }]}>AI Support</Text>
                <TouchableOpacity style={[styles.sosButton, { backgroundColor: '#ef4444' }]}>
                    <LucidePhone size={20} color="#fff" style={{ marginRight: 5 }} />
                    <Text style={{ color: '#fff', fontWeight: 'bold' }}>Emergency Call</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={messages}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.listContent}
            />

            <View style={[styles.inputContainer, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Type a message..."
                    placeholderTextColor={theme.tabIconDefault}
                    value={inputText}
                    onChangeText={setInputText}
                />
                <TouchableOpacity onPress={sendMessage} style={[styles.sendButton, { backgroundColor: theme.tint }]}>
                    <LucideSend size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(150,150,150,0.1)',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    sosButton: {
        flexDirection: 'row',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        alignItems: 'center',
    },
    listContent: {
        padding: 20,
        paddingBottom: 20,
    },
    messageBubble: {
        maxWidth: '80%',
        padding: 15,
        borderRadius: 20,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userBubble: {
        alignSelf: 'flex-end',
        backgroundColor: '#9d50bb', // Primary Tint
        borderBottomRightRadius: 2,
    },
    botBubble: {
        alignSelf: 'flex-start',
        borderBottomLeftRadius: 2,
        borderWidth: 1,
        borderColor: 'rgba(150,150,150,0.1)',
    },
    botIcon: {
        marginRight: 10,
    },
    messageText: {
        fontSize: 16,
        lineHeight: 22,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        alignItems: 'center',
        borderTopWidth: 1,
    },
    input: {
        flex: 1,
        height: 50,
        borderRadius: 25,
        paddingHorizontal: 20,
        marginRight: 10,
        backgroundColor: 'rgba(150,150,150,0.1)',
    },
    sendButton: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
