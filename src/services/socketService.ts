import { io, Socket } from 'socket.io-client';
import { Message, User } from '@/types/chat';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(serverUrl: string = 'http://localhost:3001'): Promise<Socket> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(serverUrl, {
          transports: ['websocket', 'polling'],
          reconnection: true,
          reconnectionAttempts: this.maxReconnectAttempts,
          reconnectionDelay: 1000,
        });

        this.socket.on('connect', () => {
          console.log('✅ Connected to server:', this.socket?.id);
          this.reconnectAttempts = 0;
          resolve(this.socket!);
        });

        this.socket.on('connect_error', (error) => {
          console.error('❌ Connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('🔌 Disconnected:', reason);
        });

        this.socket.on('reconnect_attempt', (attempt) => {
          console.log(`🔄 Reconnection attempt ${attempt}`);
          this.reconnectAttempts = attempt;
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(username: string, roomId: string = 'general') {
    if (this.socket) {
      console.log(`🏠 Joining room: ${roomId} as ${username}`);
      this.socket.emit('join-room', { username, roomId });
    }
  }

  sendMessage(message: Omit<Message, 'id' | 'timestamp'>) {
    if (this.socket) {
      console.log('📤 Sending message:', message);
      this.socket.emit('send-message', message);
    }
  }

  sendTyping(username: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('user-typing', { username, isTyping });
    }
  }

  // 새로운 이벤트 리스너들
  onJoinSuccess(callback: (data: { user: User; roomId: string }) => void) {
    if (this.socket) {
      this.socket.on('join-success', callback);
    }
  }

  onJoinError(callback: (error: { message: string; code: string }) => void) {
    if (this.socket) {
      this.socket.on('join-error', callback);
    }
  }

  onMessageError(callback: (error: { message: string }) => void) {
    if (this.socket) {
      this.socket.on('message-error', callback);
    }
  }

  // 기존 이벤트 리스너들
  onMessageReceived(callback: (message: Message) => void) {
    if (this.socket) {
      this.socket.on('message-received', (message) => {
        console.log('📥 Message received:', message);
        callback(message);
      });
    }
  }

  onUserJoined(callback: (user: User) => void) {
    if (this.socket) {
      this.socket.on('user-joined', (user) => {
        console.log('👤 User joined:', user);
        callback(user);
      });
    }
  }

  onUserLeft(callback: (user: User) => void) {
    if (this.socket) {
      this.socket.on('user-left', (user) => {
        console.log('👋 User left:', user);
        callback(user);
      });
    }
  }

  onUsersUpdate(callback: (users: User[]) => void) {
    if (this.socket) {
      this.socket.on('room-users', (users) => {
        console.log('👥 Users updated:', users);
        callback(users);
      });
    }
  }

  onTypingUpdate(callback: (data: { username: string; isTyping: boolean }) => void) {
    if (this.socket) {
      this.socket.on('user-typing-update', callback);
    }
  }

  onConnectionStatus(callback: (status: 'connected' | 'disconnected' | 'error') => void) {
    if (this.socket) {
      this.socket.on('connect', () => {
        console.log('🟢 Connection status: connected');
        callback('connected');
      });
      this.socket.on('disconnect', () => {
        console.log('🔴 Connection status: disconnected');
        callback('disconnected');
      });
      this.socket.on('connect_error', () => {
        console.log('❌ Connection status: error');
        callback('error');
      });
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

export const socketService = new SocketService();