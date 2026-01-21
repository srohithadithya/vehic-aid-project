import io, { Socket } from 'socket.io-client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  content: string;
  timestamp: number;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage?: Message;
  unreadCount: number;
}

export interface LiveNotification {
  id: string;
  type: 'job' | 'message' | 'payment' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  timestamp: number;
  read: boolean;
}

export interface LocationUpdate {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

let socket: Socket | null = null;

export const RealtimeService = {
  /**
   * Initialize WebSocket connection
   */
  async initialize(userId: string, token: string, serverUrl: string = 'http://localhost:3000') {
    return new Promise<void>((resolve, reject) => {
      try {
        socket = io(serverUrl, {
          auth: {
            userId,
            token,
          },
          reconnection: true,
          reconnectionDelay: 1000,
          reconnectionDelayMax: 5000,
          reconnectionAttempts: 5,
        });

        socket.on('connect', () => {
          console.log('[RealtimeService] Connected to server');
          AsyncStorage.setItem('@realtime_connected', 'true');
          resolve();
        });

        socket.on('disconnect', () => {
          console.log('[RealtimeService] Disconnected from server');
          AsyncStorage.removeItem('@realtime_connected');
        });

        socket.on('error', (error: any) => {
          console.error('[RealtimeService] Connection error:', error);
          reject(error);
        });
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Disconnect WebSocket
   */
  disconnect() {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
  },

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return socket?.connected ?? false;
  },

  /**
   * Send message
   */
  sendMessage(conversationId: string, content: string, onSent?: (message: Message) => void) {
    if (!socket) return;

    socket.emit('message:send', { conversationId, content }, (message: Message) => {
      onSent?.(message);
    });
  },

  /**
   * Listen for new messages
   */
  onMessageReceived(callback: (message: Message) => void) {
    if (!socket) return;
    socket.on('message:received', callback);
  },

  /**
   * Listen for typing status
   */
  onUserTyping(callback: (data: { userId: string; isTyping: boolean }) => void) {
    if (!socket) return;
    socket.on('user:typing', callback);
  },

  /**
   * Emit typing status
   */
  emitTyping(conversationId: string, isTyping: boolean) {
    if (!socket) return;
    socket.emit('user:typing', { conversationId, isTyping });
  },

  /**
   * Mark message as read
   */
  markAsRead(messageId: string) {
    if (!socket) return;
    socket.emit('message:read', { messageId });
  },

  /**
   * Listen for live notifications
   */
  onNotification(callback: (notification: LiveNotification) => void) {
    if (!socket) return;
    socket.on('notification:receive', callback);
  },

  /**
   * Listen for job updates (new jobs, job accepted, etc.)
   */
  onJobUpdate(callback: (data: any) => void) {
    if (!socket) return;
    socket.on('job:update', callback);
  },

  /**
   * Listen for location updates from other users
   */
  onLocationUpdate(callback: (location: LocationUpdate) => void) {
    if (!socket) return;
    socket.on('location:update', callback);
  },

  /**
   * Send location update
   */
  sendLocationUpdate(latitude: number, longitude: number, accuracy: number) {
    if (!socket) return;
    socket.emit('location:update', { latitude, longitude, accuracy, timestamp: Date.now() });
  },

  /**
   * Listen for payment notifications
   */
  onPaymentUpdate(callback: (data: any) => void) {
    if (!socket) return;
    socket.on('payment:update', callback);
  },

  /**
   * Listen for conversation list updates
   */
  onConversationUpdate(callback: (conversations: Conversation[]) => void) {
    if (!socket) return;
    socket.on('conversations:update', callback);
  },

  /**
   * Remove all listeners
   */
  removeAllListeners() {
    if (!socket) return;
    socket.removeAllListeners();
  },

  /**
   * Remove specific listener
   */
  removeListener(event: string, callback?: (...args: any[]) => void) {
    if (!socket) return;
    if (callback) {
      socket.off(event, callback);
    } else {
      socket.off(event);
    }
  },
};

export default RealtimeService;
