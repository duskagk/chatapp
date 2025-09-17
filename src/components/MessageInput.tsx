"use client";

import { useState, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { socketService } from "@/services/socketService";

export default function MessageInput() {
  const [message, setMessage] = useState("");
  const { currentUser } = useChatStore(); // addMessage 제거!
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !currentUser) {
      console.log("❌ Cannot send message:", {
        message: message.trim(),
        currentUser,
      });
      return;
    }

    console.log("📤 Sending message:", message.trim());

    const newMessage = {
      user: currentUser.username,
      content: message.trim(),
      type: "user" as const,
    };

    // Socket.io로만 메시지 전송 (로컬 추가 하지 않음!)
    socketService.sendMessage(newMessage);

    // 메시지 입력 필드 초기화
    setMessage("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  // 디버깅 정보 표시 (나중에 제거 가능)
  const debugInfo = `Socket: ${
    socketService.isConnected() ? "🟢" : "🔴"
  } | User: ${currentUser?.username || "None"}`;

  return (
    <div className="p-4">
      {/* 디버깅 정보 (임시) */}
      <div className="text-xs text-gray-500 mb-2 p-2 bg-gray-100 rounded">
        {debugInfo}
      </div>

      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleInput}
            onKeyDown={handleKeyPress}
            placeholder="Type your message... (Press Enter to send)"
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all min-h-[48px] max-h-[120px]"
            rows={1}
            maxLength={1000}
          />

          {/* Character count */}
          <div className="absolute bottom-2 right-3 text-xs text-gray-400">
            {message.length}/1000
          </div>
        </div>

        <button
          type="submit"
          disabled={!message.trim()}
          className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          title="Send message"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  );
}
