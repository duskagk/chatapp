"use client";

import { useEffect, useRef, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
// import UsersList from "./UsersList";
import UsersList from "./UsersList";

export default function ChatInterface() {
  const { messages, users, currentUser } = useChatStore();
  const [showUsers, setShowUsers] = useState(false);

  return (
    <div className="flex flex-1 overflow-hidden bg-white rounded-lg shadow-lg mx-4 mb-4">
      {/* Sidebar - Users List */}
      <div
        className={`${
          showUsers ? "w-64" : "w-0"
        } transition-all duration-300 overflow-hidden border-r border-gray-200 bg-gray-50`}
      >
        <UsersList />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowUsers(!showUsers)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
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
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  # General
                </h2>
                <p className="text-sm text-gray-500">
                  {users.length} member{users.length !== 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-hidden">
          <MessageList />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200">
          <MessageInput />
        </div>
      </div>
    </div>
  );
}
