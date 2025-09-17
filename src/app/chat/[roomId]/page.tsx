"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";

interface Message {
  id: string;
  userId: string;
  username: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  members: Array<{
    id: string;
    username: string;
    status: "online" | "offline" | "away";
  }>;
}

// 임시 데이터
const mockMessages: Message[] = [
  {
    id: "1",
    userId: "1",
    username: "김개발",
    content: "안녕하세요! 새로 들어왔습니다.",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30분 전
    isOwn: false,
  },
  {
    id: "2",
    userId: "2",
    username: "이디자인",
    content: "반가워요! 잘 부탁드립니다 😊",
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25분 전
    isOwn: false,
  },
  {
    id: "3",
    userId: "me",
    username: "나",
    content: "안녕하세요! 저도 처음입니다.",
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20분 전
    isOwn: true,
  },
  {
    id: "4",
    userId: "3",
    username: "박기획",
    content: "오늘 새로운 기능에 대해 이야기해볼까요?",
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10분 전
    isOwn: false,
  },
];

const mockRooms = {
  "1": {
    id: "1",
    name: "일반",
    description: "자유로운 대화를 나누는 공간입니다",
    memberCount: 42,
    members: [
      { id: "1", username: "김개발", status: "online" as const },
      { id: "2", username: "이디자인", status: "online" as const },
      { id: "3", username: "박기획", status: "away" as const },
    ],
  },
  "2": {
    id: "2",
    name: "개발자 모임",
    description: "개발 관련 정보를 공유해요",
    memberCount: 28,
    members: [
      { id: "1", username: "김개발", status: "online" as const },
      { id: "4", username: "최코더", status: "offline" as const },
    ],
  },
};

export default function ChatRoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomId = params.roomId as string;

  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [newMessage, setNewMessage] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const room = mockRooms[roomId as keyof typeof mockRooms];

  useEffect(() => {
    // 채팅방이 존재하지 않으면 404 처리
    if (!room) {
      router.push("/dashboard");
      return;
    }

    // 스크롤을 맨 아래로
    scrollToBottom();

    // TODO: 소켓 연결
    setIsConnected(true);

    return () => {
      // TODO: 소켓 연결 해제
      setIsConnected(false);
    };
  }, [roomId, room, router]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      userId: "me",
      username: "나",
      content: newMessage.trim(),
      timestamp: new Date(),
      isOwn: true,
    };

    setMessages((prev) => [...prev, message]);
    setNewMessage("");

    // TODO: 소켓으로 메시지 전송
    console.log("메시지 전송:", message);

    setTimeout(scrollToBottom, 100);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            채팅방을 찾을 수 없습니다
          </h1>
          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            대시보드로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-semibold">#</span>
            </div>
            <div>
              <h1 className="font-semibold text-gray-900">{room.name}</h1>
              <p className="text-sm text-gray-500">{room.description}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* 연결 상태 */}
          <div className="flex items-center space-x-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span className="text-sm text-gray-500">
              {isConnected ? "연결됨" : "연결 중..."}
            </span>
          </div>

          {/* 멤버 보기 */}
          <button
            onClick={() => setShowMembers(!showMembers)}
            className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-sm text-gray-600">{room.memberCount}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* 메시지 영역 */}
        <div className="flex-1 flex flex-col">
          {/* 메시지 리스트 */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => {
              const showAvatar =
                index === 0 || messages[index - 1].userId !== message.userId;
              const showTime =
                index === messages.length - 1 ||
                messages[index + 1].userId !== message.userId ||
                messages[index + 1].timestamp.getTime() -
                  message.timestamp.getTime() >
                  60000; // 1분

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isOwn ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`flex max-w-xs lg:max-w-md ${
                      message.isOwn ? "flex-row-reverse" : "flex-row"
                    } space-x-2`}
                  >
                    {/* 아바타 */}
                    <div
                      className={`flex-shrink-0 ${
                        message.isOwn ? "ml-2" : "mr-2"
                      }`}
                    >
                      {showAvatar ? (
                        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-semibold">
                            {message.username.charAt(0)}
                          </span>
                        </div>
                      ) : (
                        <div className="w-8 h-8" />
                      )}
                    </div>

                    {/* 메시지 버블 */}
                    <div className="flex flex-col">
                      {showAvatar && !message.isOwn && (
                        <span className="text-sm font-medium text-gray-900 mb-1 px-3">
                          {message.username}
                        </span>
                      )}

                      <div
                        className={`px-4 py-2 rounded-lg ${
                          message.isOwn
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>

                      {showTime && (
                        <span
                          className={`text-xs text-gray-500 mt-1 px-3 ${
                            message.isOwn ? "text-right" : "text-left"
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* 메시지 입력 */}
          <div className="border-t border-gray-200 p-4">
            <form onSubmit={handleSendMessage} className="flex space-x-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`#${room.name}에 메시지 보내기...`}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={!isConnected}
              />
              <button
                type="submit"
                disabled={!newMessage.trim() || !isConnected}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                전송
              </button>
            </form>
          </div>
        </div>

        {/* 멤버 리스트 사이드바 */}
        {showMembers && (
          <div className="w-64 bg-gray-50 border-l border-gray-200 p-4">
            <h3 className="font-semibold text-gray-900 mb-4">
              멤버 ({room.memberCount})
            </h3>

            <div className="space-y-3">
              {room.members.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-semibold">
                        {member.username.charAt(0)}
                      </span>
                    </div>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                        member.status
                      )}`}
                    />
                  </div>
                  <span className="text-sm text-gray-900">
                    {member.username}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
