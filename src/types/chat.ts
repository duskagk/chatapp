export interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  type: "user" | "system";
}

export interface User {
  id: string;
  username: string;
  isOnline: boolean;
  joinedAt: Date;
}

export interface ChatRoom {
  id: string;
  name: string;
  users: User[];
  messages: Message[];
  createdAt: Date;
}

export interface SocketEvents {
  // Client to Server
  "join-room": (data: { username: string; roomId: string }) => void;
  "send-message": (message: Omit<Message, "id" | "timestamp">) => void;
  "user-typing": (data: { username: string; isTyping: boolean }) => void;

  // Server to Client
  "message-received": (message: Message) => void;
  "user-joined": (user: User) => void;
  "user-left": (user: User) => void;
  "user-typing-update": (data: { username: string; isTyping: boolean }) => void;
  "room-users": (users: User[]) => void;
  "connection-status": (status: "connected" | "disconnected" | "error") => void;
}
