// src/components/DeleteAccountForm.tsx (예시 경로)

"use client";

import { useState } from "react";
import { authAPI } from "@/lib/api";

interface DeleteAccountFormProps {
  onClose: () => void; // 모달을 닫는 함수
  onSuccess: () => void; // 탈퇴 성공 시 처리할 함수
}

export default function DeleteAccountForm({
  onClose,
  onSuccess,
}: DeleteAccountFormProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("비밀번호를 입력해주세요.");
      return;
    }

    // 최종 확인
    if (
      !window.confirm(
        "정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authAPI.deleteAccount(password);
      alert("계정이 성공적으로 삭제되었습니다.");
      onSuccess(); // 성공 콜백 호출
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        "계정 삭제에 실패했습니다. 비밀번호를 확인해주세요.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // 모달 배경
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {/* 모달 컨텐츠 */}
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-red-600">회원 탈퇴</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
          >
            &times;
          </button>
        </div>
        <p className="mb-4 text-gray-600">
          계정을 삭제하려면 현재 비밀번호를 입력해주세요. 이 작업은 되돌릴 수
          없습니다.
        </p>
        <form onSubmit={handleDelete}>
          <div className="mb-4">
            <label
              htmlFor="password-delete"
              className="block text-sm font-medium text-gray-700"
            >
              비밀번호
            </label>
            <input
              id="password-delete"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="현재 비밀번호"
              required
            />
          </div>

          {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
            >
              {isLoading ? "삭제 중..." : "계정 삭제"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
