"use client";

import { useChatStore } from "@/store/chatStore";

export default function ConnectionStatus() {
  const { connectionStatus, isConnected } = useChatStore();

  const getStatusConfig = () => {
    switch (connectionStatus) {
      case "connected":
        return {
          color: "bg-green-500",
          text: "Connected",
          textColor: "text-green-700",
        };
      case "connecting":
        return {
          color: "bg-yellow-500",
          text: "Connecting...",
          textColor: "text-yellow-700",
        };
      case "disconnected":
        return {
          color: "bg-gray-400",
          text: "Disconnected",
          textColor: "text-gray-700",
        };
      case "error":
        return {
          color: "bg-red-500",
          text: "Connection Error",
          textColor: "text-red-700",
        };
      default:
        return {
          color: "bg-gray-400",
          text: "Unknown",
          textColor: "text-gray-700",
        };
    }
  };

  const { color, text, textColor } = getStatusConfig();

  return (
    <div className="flex items-center space-x-2">
      <div
        className={`w-3 h-3 rounded-full ${color} ${
          connectionStatus === "connecting" ? "animate-pulse" : ""
        }`}
      ></div>
      <span className={`text-sm font-medium ${textColor}`}>{text}</span>
    </div>
  );
}
