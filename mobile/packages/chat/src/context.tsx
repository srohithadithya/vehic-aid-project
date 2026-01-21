import React, { createContext, useState, useEffect, useCallback } from 'react';
import RealtimeService, { Message, Conversation } from '@vehic-aid/realtime';

export interface ChatContextType {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Message[];
  isLoading: boolean;
  isTyping: boolean;
  unreadCount: number;

  // Methods
  selectConversation: (conversation: Conversation) => void;
  sendMessage: (content: string) => void;
  markAsRead: (messageId: string) => void;
  emitTyping: (isTyping: boolean) => void;
  refreshConversations: () => void;
}

export const ChatContext = createContext<ChatContextType>({
  conversations: [],
  selectedConversation: null,
  messages: [],
  isLoading: false,
  isTyping: false,
  unreadCount: 0,
  selectConversation: () => {},
  sendMessage: () => {},
  markAsRead: () => {},
  emitTyping: () => {},
  refreshConversations: () => {},
});

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Mock conversations data for demo
  const mockConversations: Conversation[] = [
    {
      id: '1',
      participantId: 'provider_1',
      participantName: 'Raj Kumar',
      participantAvatar: '👨‍🔧',
      unreadCount: 2,
      lastMessage: {
        id: 'msg_1',
        senderId: 'provider_1',
        senderName: 'Raj Kumar',
        content: 'On my way! ETA 5 minutes',
        timestamp: Date.now() - 3600000,
        read: true,
      },
    },
    {
      id: '2',
      participantId: 'provider_2',
      participantName: 'Priya Singh',
      participantAvatar: '👩‍🔧',
      unreadCount: 1,
      lastMessage: {
        id: 'msg_2',
        senderId: 'provider_2',
        senderName: 'Priya Singh',
        content: 'Service completed successfully ✓',
        timestamp: Date.now() - 7200000,
        read: true,
      },
    },
    {
      id: '3',
      participantId: 'provider_3',
      participantName: 'Amit Patel',
      participantAvatar: '👨‍🔨',
      unreadCount: 0,
      lastMessage: {
        id: 'msg_3',
        senderId: 'provider_3',
        senderName: 'Amit Patel',
        content: 'Thanks for the generous tip!',
        timestamp: Date.now() - 86400000,
        read: true,
      },
    },
  ];

  // Mock messages for selected conversation
  const getMockMessages = (conversationId: string): Message[] => {
    const mockData: Record<string, Message[]> = {
      '1': [
        {
          id: 'msg_100',
          senderId: 'user',
          senderName: 'You',
          content: 'Hi, I need immediate towing service',
          timestamp: Date.now() - 600000,
          read: true,
        },
        {
          id: 'msg_101',
          senderId: 'provider_1',
          senderName: 'Raj Kumar',
          content: 'Sure! I can be there in 10 minutes',
          timestamp: Date.now() - 540000,
          read: true,
        },
        {
          id: 'msg_102',
          senderId: 'user',
          senderName: 'You',
          content: 'Location is near MG Road, Bangalore',
          timestamp: Date.now() - 480000,
          read: true,
        },
        {
          id: 'msg_103',
          senderId: 'provider_1',
          senderName: 'Raj Kumar',
          content: 'On my way! ETA 5 minutes',
          timestamp: Date.now() - 360000,
          read: true,
        },
      ],
      '2': [
        {
          id: 'msg_200',
          senderId: 'user',
          senderName: 'You',
          content: 'Thank you for the excellent service!',
          timestamp: Date.now() - 7200000,
          read: true,
        },
        {
          id: 'msg_201',
          senderId: 'provider_2',
          senderName: 'Priya Singh',
          content: 'Service completed successfully ✓',
          timestamp: Date.now() - 7140000,
          read: true,
        },
      ],
      '3': [
        {
          id: 'msg_300',
          senderId: 'user',
          senderName: 'You',
          content: 'You deserve it! Great work today',
          timestamp: Date.now() - 86400000,
          read: true,
        },
        {
          id: 'msg_301',
          senderId: 'provider_3',
          senderName: 'Amit Patel',
          content: 'Thanks for the generous tip!',
          timestamp: Date.now() - 86340000,
          read: true,
        },
      ],
    };
    return mockData[conversationId] || [];
  };

  useEffect(() => {
    // Initialize conversations
    setConversations(mockConversations);
    setUnreadCount(mockConversations.reduce((sum, conv) => sum + conv.unreadCount, 0));

    // Setup real-time listeners
    RealtimeService.onMessageReceived((message: Message) => {
      if (selectedConversation && message) {
        setMessages((prev) => [...prev, message]);
      }
    });

    RealtimeService.onConversationUpdate((updated) => {
      setConversations(updated);
    });
  }, [selectedConversation]);

  const selectConversation = useCallback((conversation: Conversation) => {
    setSelectedConversation(conversation);
    setMessages(getMockMessages(conversation.id));
  }, []);

  const sendMessage = useCallback(
    (content: string) => {
      if (!selectedConversation || !content.trim()) return;

      const newMessage: Message = {
        id: `msg_${Date.now()}`,
        senderId: 'user',
        senderName: 'You',
        content: content.trim(),
        timestamp: Date.now(),
        read: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      RealtimeService.sendMessage(selectedConversation.id, content, (sentMessage) => {
        console.log('Message sent:', sentMessage);
      });
    },
    [selectedConversation]
  );

  const markAsRead = useCallback((messageId: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, read: true } : msg))
    );
    RealtimeService.markAsRead(messageId);
  }, []);

  const emitTyping = useCallback(
    (typing: boolean) => {
      if (selectedConversation) {
        setIsTyping(typing);
        RealtimeService.emitTyping(selectedConversation.id, typing);
      }
    },
    [selectedConversation]
  );

  const refreshConversations = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => {
      setConversations(mockConversations);
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        selectedConversation,
        messages,
        isLoading,
        isTyping,
        unreadCount,
        selectConversation,
        sendMessage,
        markAsRead,
        emitTyping,
        refreshConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within ChatProvider');
  }
  return context;
};
