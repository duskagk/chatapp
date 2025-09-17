"use client";

import { useChatStore } from "@/store/chatStore";

export default function UsersList() {
  const { users, currentUser } = useChatStore();

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Online Users ({users.length})
        </h3>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto">
        {users.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-500">No users online</p>
          </div>
        ) : (
          <div className="p-2 space-y-1">
            {users.map((user) => {
              const isCurrentUser = user.id === currentUser?.id;

              return (
                <div
                  key={user.id}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isCurrentUser
                      ? "bg-blue-100 text-blue-800"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                      isCurrentUser ? "bg-blue-600" : "bg-green-500"
                    }`}
                  >
                    {user.username[0].toUpperCase()}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p
                        className={`text-sm font-medium truncate ${
                          isCurrentUser ? "text-blue-800" : "text-gray-700"
                        }`}
                      >
                        {user.username}
                        {isCurrentUser && " (You)"}
                      </p>

                      {/* Online indicator */}
                      <div
                        className={`w-2 h-2 rounded-full ${
                          user.isOnline ? "bg-green-500" : "bg-gray-400"
                        }`}
                      ></div>
                    </div>

                    <p className="text-xs text-gray-500 truncate">
                      {user.isOnline ? "Online" : "Offline"}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          {users.filter((u) => u.isOnline).length} online now
        </p>
      </div>
    </div>
  );
}
