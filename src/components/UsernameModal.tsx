'use client';

import { useState } from 'react';
import { useChatStore } from '@/store/chatStore';
import { socketService } from '@/services/socketService';
import { v4 as uuidv4 } from 'uuid';

export default function UsernameModal() {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { setCurrentUser, setConnectionStatus, addMessage, setUsers, addUser } = useChatStore();

  const setupSocketListeners = () => {
    // 참가 성공
    socketService.onJoinSuccess((data) => {
      console.log('✅ Join success:', data);
      setCurrentUser(data.user);
      setConnectionStatus('connected');
      setIsLoading(false);
    });

    // 참가 에러
    socketService.onJoinError((error) => {
      console.error('❌ Join error:', error);
      setError(error.message);
      setConnectionStatus('error');
      setIsLoading(false);
    });

    // 메시지 수신
    socketService.onMessageReceived((message) => {
      console.log('📥 Message received:', message);
      addMessage(message);
    });

    // 사용자 입장
    socketService.onUserJoined((user) => {
      console.log('👤 User joined:', user);
      addUser(user);
    });

    // 사용자 목록 업데이트
    socketService.onUsersUpdate((users) => {
      console.log('👥 Users updated:', users);
      setUsers(users);
    });

    // 연결 상태 업데이트
    socketService.onConnectionStatus((status) => {
      console.log('🔄 Connection status:', status);
      setConnectionStatus(status === 'connected' ? 'connected' : 'disconnected');
    });

    // 메시지 에러
    socketService.onMessageError((error) => {
      console.error('💬 Message error:', error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      setConnectionStatus('connecting');

      // Socket 연결 및 이벤트 리스너 설정
      await socketService.connect();
      setupSocketListeners();
      
      // 방에 참가 요청
      socketService.joinRoom(username.trim());
      
      console.log('🔄 Connection and join requested');
      
    } catch (error) {
      console.error('❌ Failed to connect:', error);
      setConnectionStatus('error');
      setError('Failed to connect to server');
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md mx-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">💬</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to ChatApp!</h2>
          <p className="text-gray-600">Enter your username to start chatting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              autoFocus
              maxLength={20}
              disabled={isLoading}
            />
            {username && (
              <p className="mt-2 text-sm text-gray-500">
                You&apos;ll join as: <span className="font-medium text-blue-600">{username}</span>
              </p>
            )}
            {error && (
              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={!username.trim() || isLoading}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Joining...
              </div>
            ) : (
              'Join Chat'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}