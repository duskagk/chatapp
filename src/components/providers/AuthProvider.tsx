"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authAPI } from "@/lib/api";

interface User {
  id: string;
  username: string;
  email: string;
  image?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트시 사용자 정보 확인
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);

      // 쿠키에서 토큰 확인
      const hasToken =
        document.cookie.includes("auth-token") ||
        document.cookie.includes("better-auth.session_token");

      if (!hasToken) {
        setUser(null);
        return;
      }

      // 백엔드에서 사용자 정보 조회
      const userData = await authAPI.getMe();

      if (userData.user) {
        setUser(userData.user);
        // 로컬스토리지에도 저장
        localStorage.setItem("user", JSON.stringify(userData.user));
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
      localStorage.removeItem("user");

      // 쿠키 정리
      document.cookie =
        "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });

      if (response.user) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));

        // 토큰이 쿠키에 자동으로 설정됨 (BetterAuth)
      } else {
        throw new Error("Login failed: No user data received");
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Login failed";
      throw new Error(message);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await authAPI.register({ name, email, password });

      // 회원가입 성공 후 자동 로그인이 안 될 수 있으므로 수동 로그인
      if (response.user) {
        // BetterAuth는 회원가입 후 자동 로그인될 수 있음
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || error.message || "Registration failed";
      throw new Error(message);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      // 로컬 상태 정리
      setUser(null);
      localStorage.removeItem("user");

      // 쿠키 정리
      document.cookie =
        "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

      // 홈으로 리다이렉트
      window.location.href = "/";
    }
  };

  const refreshUser = async () => {
    await checkAuthStatus();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 커스텀 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// 로그인 필요한 컴포넌트에서 사용할 훅
export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/auth/login";
    }
  }, [isAuthenticated, isLoading]);

  return { isAuthenticated, isLoading };
}
