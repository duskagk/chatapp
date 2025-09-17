"use client";

import { useEffect, useRef } from "react";
import { useChatStore } from "@/store/chatStore";
import { format } from "date-fns";

export default function MessageList() {
  const { messages, currentUser } = useChatStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTimestamp = (timestamp: Date) => {
    return format(new Date(timestamp), "HH:mm");
  };

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-gray-500 text-2xl">💬</span>
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No messages yet
          </h3>
          <p className="text-gray-500">
            Start the conversation by sending your first message!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message) => {
        const isOwnMessage = message.user === currentUser?.username;
        const isSystemMessage = message.type === "system";

        if (isSystemMessage) {
          return (
            <div key={message.id} className="flex justify-center">
              <div className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full">
                {message.content}
              </div>
            </div>
          );
        }

        return (
          <div
            key={message.id}
            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md ${
                isOwnMessage ? "order-2" : "order-1"
              }`}
            >
              {!isOwnMessage && (
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">
                      {message.user[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {message.user}
                  </span>
                  <span className="text-xs text-gray-500">
                    {formatTimestamp(message.timestamp)}
                  </span>
                </div>
              )}

              <div
                className={`rounded-lg px-4 py-2 ${
                  isOwnMessage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                <p className="break-words">{message.content}</p>
                {isOwnMessage && (
                  <p className="text-xs text-blue-200 mt-1 text-right">
                    {formatTimestamp(message.timestamp)}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
