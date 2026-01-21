import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput as RNTextInput,
  TouchableOpacity,
  RefreshControl,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card, colors, spacing, typography } from '@vehic-aid/ui';
import { useChat } from '@vehic-aid/chat';

export default function ChatScreen() {
  const {
    conversations,
    selectedConversation,
    messages,
    isLoading,
    sendMessage,
    selectConversation,
    refreshConversations,
  } = useChat();

  const [messageText, setMessageText] = useState('');
  const [showConversationList, setShowConversationList] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  if (showConversationList) {
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={refreshConversations} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.headerIcon}>
            <Ionicons name="add-circle" size={28} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Conversations List */}
        <View style={styles.conversationsList}>
          {conversations.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[typography.h3, { color: colors.gray[500] }]}>No conversations</Text>
              <Text style={[typography.body, { color: colors.gray[400], marginTop: spacing.sm }]}>
                Start a new conversation with a provider
              </Text>
            </View>
          ) : (
            conversations.map((conversation) => (
              <TouchableOpacity
                key={conversation.id}
                onPress={() => {
                  selectConversation(conversation);
                  setShowConversationList(false);
                }}
                activeOpacity={0.7}
              >
                <Card style={styles.conversationCard}>
                  <View style={styles.conversationContent}>
                    <View style={styles.conversationHeader}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{conversation.participantAvatar}</Text>
                      </View>
                      <View style={styles.conversationInfo}>
                        <Text style={[typography.h3, styles.participantName]}>
                          {conversation.participantName}
                        </Text>
                        <Text
                          style={[typography.caption, styles.lastMessage]}
                          numberOfLines={1}
                        >
                          {conversation.lastMessage?.content || 'No messages'}
                        </Text>
                      </View>
                      {conversation.unreadCount > 0 && (
                        <View style={styles.unreadBadge}>
                          <Text style={styles.unreadCount}>{conversation.unreadCount}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </Card>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    );
  }

  // Chat View
  return (
    <View style={styles.chatContainer}>
      {/* Chat Header */}
      <View style={styles.chatHeader}>
        <TouchableOpacity
          onPress={() => setShowConversationList(true)}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color={colors.primary} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[typography.h3, styles.participantName]}>
            {selectedConversation?.participantAvatar} {selectedConversation?.participantName}
          </Text>
          <Text style={[typography.caption, { color: colors.gray[500] }]}>Active now</Text>
        </View>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="call" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageWrapper,
              message.senderId === 'user' ? styles.sentMessage : styles.receivedMessage,
            ]}
          >
            {message.senderId !== 'user' && (
              <Text style={styles.avatarSmall}>{selectedConversation?.participantAvatar}</Text>
            )}
            <View
              style={[
                styles.messageBubble,
                message.senderId === 'user' ? styles.sentBubble : styles.receivedBubble,
              ]}
            >
              <Text
                style={[
                  typography.body,
                  {
                    color: message.senderId === 'user' ? colors.white : colors.gray[900],
                  },
                ]}
              >
                {message.content}
              </Text>
              <Text
                style={[
                  typography.caption,
                  {
                    color: message.senderId === 'user' ? 'rgba(255,255,255,0.7)' : colors.gray[500],
                    marginTop: spacing.xs,
                  },
                ]}
              >
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <RNTextInput
            style={styles.input}
            placeholder="Type a message..."
            placeholderTextColor={colors.gray[400]}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={styles.attachButton}
            onPress={() => console.log('Attach media')}
          >
            <Ionicons name="attach" size={22} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
          onPress={() => {
            if (messageText.trim()) {
              sendMessage(messageText);
              setMessageText('');
            }
          }}
          disabled={!messageText.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={messageText.trim() ? colors.white : colors.gray[400]}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Conversation List Styles
  container: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.gray[900],
  },
  headerIcon: {
    padding: spacing.sm,
  },
  conversationsList: {
    paddingVertical: spacing.md,
  },
  conversationCard: {
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
  },
  conversationContent: {
    padding: spacing.md,
  },
  conversationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    fontSize: 24,
  },
  conversationInfo: {
    flex: 1,
  },
  participantName: {
    marginBottom: spacing.xs,
  },
  lastMessage: {
    color: colors.gray[500],
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unreadCount: {
    color: colors.white,
    fontSize: 12,
    fontWeight: '700',
  },
  emptyState: {
    paddingVertical: spacing.xl,
    alignItems: 'center',
  },

  // Chat View Styles
  chatContainer: {
    flex: 1,
    backgroundColor: colors.gray[50],
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  backButton: {
    marginRight: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  headerAction: {
    padding: spacing.sm,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
  },
  messageWrapper: {
    flexDirection: 'row',
    marginVertical: spacing.sm,
    alignItems: 'flex-end',
  },
  sentMessage: {
    justifyContent: 'flex-end',
  },
  receivedMessage: {
    justifyContent: 'flex-start',
  },
  avatarSmall: {
    fontSize: 20,
    marginRight: spacing.sm,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 16,
  },
  sentBubble: {
    backgroundColor: colors.primary,
  },
  receivedBubble: {
    backgroundColor: colors.gray[100],
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderRadius: 24,
    paddingHorizontal: spacing.md,
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: spacing.md,
    color: colors.gray[900],
    maxHeight: 100,
  },
  attachButton: {
    marginLeft: spacing.sm,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.gray[200],
  },
});
