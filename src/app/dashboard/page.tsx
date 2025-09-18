"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import apiClient, { authAPI } from "@/lib/api";
import DeleteAccountForm from "@/components/DeleteAccountForm";
import CreateRoomModal from "@/components/CreateRoomModal";

interface ChatRoom {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  isPrivate: boolean;
}

interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface Friend {
  id: string;
  username: string;
  status: "online" | "offline" | "away";
  avatar?: string;
  lastSeen?: string;
}

// 초기 임시 데이터
const initialMockRooms: ChatRoom[] = [
  {
    id: "1",
    name: "일반",
    description: "자유로운 대화를 나누는 공간입니다",
    memberCount: 42,
    lastMessage: "안녕하세요!",
    lastMessageTime: "방금 전",
    isPrivate: false,
  },
  {
    id: "2",
    name: "개발자 모임",
    description: "개발 관련 정보를 공유해요",
    memberCount: 28,
    lastMessage: "React 18 업데이트 소식 들었나요?",
    lastMessageTime: "5분 전",
    isPrivate: false,
  },
  {
    id: "3",
    name: "게임 이야기",
    description: "게임에 대한 모든 이야기",
    memberCount: 35,
    lastMessage: "오늘 새로운 업데이트 나왔어요",
    lastMessageTime: "12분 전",
    isPrivate: false,
  },
];

const mockFriends: Friend[] = [
  {
    id: "1",
    username: "김개발",
    status: "online",
    lastSeen: "지금",
  },
  {
    id: "2",
    username: "이디자인",
    status: "away",
    lastSeen: "10분 전",
  },
  {
    id: "3",
    username: "박기획",
    status: "offline",
    lastSeen: "2시간 전",
  },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<"rooms" | "friends">("rooms");
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  // 모달 상태
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCreateRoomModalOpen, setIsCreateRoomModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/auth/login");
    }
  };

  const getStatusColor = (status: Friend["status"]) => {
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

  const getStatusText = (status: Friend["status"]) => {
    switch (status) {
      case "online":
        return "온라인";
      case "away":
        return "자리비움";
      case "offline":
        return "오프라인";
      default:
        return "알 수 없음";
    }
  };

  // 새 채팅룸 생성 핸들러
  const handleCreateRoom = async (roomData: {
    name: string;
    description: string;
    isPrivate: boolean;
  }) => {
    try {
      // 새 룸 ID 생성 (임시로 현재 시간 사용)
      const newRoomId = Date.now().toString();

      const newRoom: ChatRoom = {
        id: newRoomId,
        name: roomData.name,
        description: roomData.description,
        memberCount: 1, // 생성자만
        lastMessage: undefined,
        lastMessageTime: undefined,
        isPrivate: roomData.isPrivate,
      };

      // 채팅룸 목록에 추가
      setChatRooms((prev) => [...prev, newRoom]);

      // TODO: 실제 API 호출
      console.log("새 채팅룸 생성:", newRoom);

      // 생성된 채팅룸으로 이동
      router.push(`/chat/${newRoomId}`);
    } catch (error) {
      console.error("채팅룸 생성 실패:", error);
      throw error; // 모달에서 에러 처리
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        const userData = await authAPI.getMe();
        setCurrentUser(userData.user);
      } catch (error: any) {
        console.error("사용자 정보 가져오기 실패:", error);
        setError(error.message);

        if (error.response?.status === 401) {
          router.push("/auth/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleDeletionSuccess = () => {
    setIsDeleteModalOpen(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* 사이드바 */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        {/* 사용자 정보 */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {currentUser?.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">
                {currentUser?.name}
              </h3>
              <p className="text-sm text-gray-500">{currentUser?.email}</p>
            </div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("rooms")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "rooms"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            채팅룸
          </button>
          <button
            onClick={() => setActiveTab("friends")}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === "friends"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            친구
          </button>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "rooms" && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-900">채팅룸 목록</h4>
                <button
                  onClick={() => setIsCreateRoomModalOpen(true)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  + 새 룸
                </button>
              </div>

              <div className="space-y-2">
                {chatRooms &&
                  chatRooms.map((room) => (
                    <Link
                      key={room.id}
                      href={`/chat/${room.id}`}
                      className="block p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h5 className="font-medium text-gray-900">
                              {room.name}
                            </h5>
                            {room.isPrivate && (
                              <svg
                                className="w-4 h-4 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                                />
                              </svg>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {room.description}
                          </p>
                          {room.lastMessage && (
                            <p className="text-xs text-gray-600 mt-2 truncate">
                              {room.lastMessage}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-400">
                            {room.memberCount}명
                          </span>
                          {room.lastMessageTime && (
                            <p className="text-xs text-gray-400 mt-1">
                              {room.lastMessageTime}
                            </p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          )}

          {activeTab === "friends" && (
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-gray-900">친구 목록</h4>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  + 친구 추가
                </button>
              </div>

              <div className="space-y-2">
                {mockFriends.map((friend) => (
                  <div
                    key={friend.id}
                    className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <div className="relative">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {friend.username.charAt(0)}
                        </span>
                      </div>
                      <div
                        className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
                          friend.status
                        )}`}
                      />
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">
                        {friend.username}
                      </h5>
                      <p className="text-xs text-gray-500">
                        {getStatusText(friend.status)} • {friend.lastSeen}
                      </p>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700">
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단 메뉴 */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              설정
            </button>

            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              회원탈퇴
            </button>

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            ChatApp에 오신 것을 환영합니다!
          </h2>
          <p className="text-gray-600 mb-6 max-w-md">
            왼쪽에서 채팅룸을 선택하거나 친구와 대화를 시작해보세요.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">
                  채팅룸 참여
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  다양한 주제의 채팅룸에 참여해보세요
                </p>
                <div className="text-2xl font-bold text-blue-600">
                  {chatRooms.length}
                </div>
                <p className="text-xs text-gray-500">개의 활성 룸</p>
              </div>

              <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-2">
                  온라인 친구
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  지금 온라인인 친구들과 채팅하세요
                </p>
                <div className="text-2xl font-bold text-green-600">
                  {mockFriends.filter((f) => f.status === "online").length}
                </div>
                <p className="text-xs text-gray-500">명 온라인</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 모달들 */}
      {isDeleteModalOpen && (
        <DeleteAccountForm
          onClose={() => setIsDeleteModalOpen(false)}
          onSuccess={handleDeletionSuccess}
        />
      )}

      {isCreateRoomModalOpen && (
        <CreateRoomModal
          isOpen={isCreateRoomModalOpen}
          onClose={() => setIsCreateRoomModalOpen(false)}
          onCreateRoom={handleCreateRoom}
        />
      )}
    </div>
  );
}
