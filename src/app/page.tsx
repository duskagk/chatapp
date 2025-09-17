"use client";

import { useEffect, useState } from "react";
import { useChatStore } from "@/store/chatStore";
import UsernameModal from "@/components/UsernameModal";
import ChatInterface from "@/components/ChatInterface";
import ConnectionStatus from "@/components/ConnectionStatus";

export default function ChatPage() {
  const { isUsernameSet, currentUser } = useChatStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 컴포넌트 마운트 후 로딩 상태 해제
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Chat App...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto h-screen flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">💬</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-800">ChatApp</h1>
            </div>

            <div className="flex items-center space-x-4">
              {currentUser && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {currentUser.username[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="text-gray-700 font-medium">
                    {currentUser.username}
                  </span>
                </div>
              )}
              <ConnectionStatus />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {!isUsernameSet ? <UsernameModal /> : <ChatInterface />}
        </main>
      </div>
    </div>
  );
}
