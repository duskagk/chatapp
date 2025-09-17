import { create } from "zustand";
import { Message, User } from "@/types/chat";

interface ChatState {
  // Connection state
  isConnected: boolean;
  connectionStatus: "connecting" | "connected" | "disconnected" | "error";

  // User state
  currentUser: User | null;
  users: User[];

  // Messages state
  messages: Message[];

  // UI state
  isUsernameSet: boolean;
  isTyping: boolean;
  typingUsers: string[];

  // Actions
  setConnectionStatus: (
    status: "connecting" | "connected" | "disconnected" | "error"
  ) => void;
  setCurrentUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  addMessage: (message: Message) => void;
  addUser: (user: User) => void;
  removeUser: (userId: string) => void;
  setIsTyping: (isTyping: boolean) => void;
  setTypingUsers: (usernames: string[]) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  // Initial state
  isConnected: false,
  connectionStatus: "disconnected",
  currentUser: null,
  users: [],
  messages: [],
  isUsernameSet: false,
  isTyping: false,
  typingUsers: [],

  // Actions
  setConnectionStatus: (status) =>
    set({
      connectionStatus: status,
      isConnected: status === "connected",
    }),

  setCurrentUser: (user) =>
    set({
      currentUser: user,
      isUsernameSet: !!user,
    }),

  setUsers: (users) => set({ users }),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),

  addUser: (user) =>
    set((state) => ({
      users: [...state.users.filter((u) => u.id !== user.id), user],
    })),

  removeUser: (userId) =>
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
    })),

  setIsTyping: (isTyping) => set({ isTyping }),

  setTypingUsers: (usernames) =>
    set({
      typingUsers: usernames.filter(
        (name) => name !== get().currentUser?.username
      ),
    }),

  clearMessages: () => set({ messages: [] }),
}));
