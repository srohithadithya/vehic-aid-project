import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Message {
    id: number;
    sender: 'customer' | 'provider';
    message: string;
    timestamp: string;
}

export default function ProviderChatScreen({ route }: any) {
    const { requestId, customerName } = route.params;
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    const fetchMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_API_URL}/chat/?request_id=${requestId}`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );
            if (response.ok) {
                const data = await response.json();
                setMessages(data.messages || []);
            }
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/chat/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    request_id: requestId,
                    message: newMessage
                })
            });

            if (response.ok) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => (
        <View
            style={[
                styles.messageBubble,
                item.sender === 'provider' ? styles.myMessage : styles.theirMessage,
            ]}
        >
            <Text style={[
                styles.messageText,
                item.sender === 'provider' && styles.myMessageText
            ]}>
                {item.message}
            </Text>
            <Text style={[
                styles.timestamp,
                item.sender === 'provider' && styles.myTimestamp
            ]}>
                {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={90}
        >
            <View style={styles.header}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{customerName?.[0] || 'C'}</Text>
                </View>
                <View style={styles.headerText}>
                    <Text style={styles.headerTitle}>{customerName || 'Customer'}</Text>
                    <Text style={styles.headerSubtitle}>Request #{requestId}</Text>
                </View>
                <View style={styles.headerActions}>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="call" size={22} color="#2563eb" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionButton}>
                        <Ionicons name="videocam" size={22} color="#2563eb" />
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.messagesList}
                onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
            />

            <View style={styles.inputContainer}>
                <TouchableOpacity style={styles.attachButton}>
                    <Ionicons name="attach" size={24} color="#6b7280" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    multiline
                />
                <TouchableOpacity
                    style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
                    onPress={sendMessage}
                    disabled={!newMessage.trim()}
                >
                    <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        elevation: 2,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    },
    headerText: {
        flex: 1,
        marginLeft: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6b7280',
        marginTop: 2,
    },
    headerActions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionButton: {
        padding: 8,
    },
    messagesList: {
        padding: 16,
    },
    messageBubble: {
        maxWidth: '75%',
        padding: 12,
        borderRadius: 16,
        marginBottom: 8,
    },
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#2563eb',
    },
    theirMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e5e7eb',
    },
    messageText: {
        fontSize: 16,
        color: '#111827',
    },
    myMessageText: {
        color: '#fff',
    },
    timestamp: {
        fontSize: 11,
        color: '#6b7280',
        marginTop: 4,
    },
    myTimestamp: {
        color: '#dbeafe',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    attachButton: {
        padding: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#f3f4f6',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 8,
        maxHeight: 100,
        fontSize: 16,
    },
    sendButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#2563eb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});
