import axios from "axios";

// API 기본 설정
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Axios 인스턴스 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 쿠키 전송 허용
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (토큰 자동 추가)
apiClient.interceptors.request.use(
  (config) => {
    // 브라우저에서만 실행
    if (typeof window !== "undefined") {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.log("[API] Request error:", error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => {
    console.log(`[API] Response:`, response.status, response.data);
    return response;
  },
  (error) => {
    console.log("[API] Response error:", error.response?.data || error.message);

    // 401 에러시 로그아웃 처리
    if (error.response?.status === 401) {
      // 토큰 삭제
      if (typeof window !== "undefined") {
        document.cookie =
          "auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        localStorage.removeItem("user");

        // 로그인 페이지로 리다이렉트 (현재 페이지가 auth 페이지가 아닌 경우)
        if (!window.location.pathname.startsWith("/auth")) {
          window.location.href = "/auth/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

// 토큰 가져오기 헬퍼
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "auth-token") {
      return value;
    }
  }
  return null;
}

// API 함수들
export const authAPI = {
  // 회원가입
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }) => {
    const response = await apiClient.post("/api/auth/sign-up/email", userData);
    return response.data;
  },

  // 로그인
  login: async (credentials: { email: string; password: string }) => {
    const response = await apiClient.post(
      "/api/auth/sign-in/email",
      credentials
    );
    return response.data;
  },

  // 로그아웃
  logout: async () => {
    const response = await apiClient.post("/api/auth/sign-out");
    return response.data;
  },

  // 현재 사용자 정보
  getMe: async () => {
    const response = await apiClient.get("/api/auth/get-session");
    return response.data;
  },

  // Google OAuth
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/api/auth/sign-in/google`;
  },

  // Naver OAuth
  naverLogin: () => {
    window.location.href = `${API_BASE_URL}/api/auth/sign-in/naver`;
  },

  // Kakao OAuth
  kakaoLogin: () => {
    window.location.href = `${API_BASE_URL}/api/auth/sign-in/kakao`;
  },

  deleteAccount: async (password: string) => {
    const response = await apiClient.post("/api/auth/delete-user", {
      password, // 보안을 위해 현재 비밀번호를 함께 전송
    });
    return response.data;
  },
};

export const userAPI = {
  // 사용자 프로필 조회
  getProfile: async () => {
    const response = await apiClient.get("/api/user/profile");
    return response.data;
  },

  // 사용자 프로필 업데이트
  updateProfile: async (profileData: { username?: string; email?: string }) => {
    const response = await apiClient.put("/api/user/profile", profileData);
    return response.data;
  },
};

export const chatAPI = {
  // 채팅룸 목록 조회
  getRooms: async () => {
    const response = await apiClient.get("/api/chat/rooms");
    return response.data;
  },

  // 특정 채팅룸 조회
  getRoom: async (roomId: string) => {
    const response = await apiClient.get(`/api/chat/rooms/${roomId}`);
    return response.data;
  },

  // 채팅룸 메시지 조회
  getMessages: async (roomId: string, page = 1, limit = 50) => {
    const response = await apiClient.get(`/api/chat/rooms/${roomId}/messages`, {
      params: { page, limit },
    });
    return response.data;
  },

  // 메시지 전송
  sendMessage: async (roomId: string, content: string) => {
    const response = await apiClient.post(
      `/api/chat/rooms/${roomId}/messages`,
      {
        content,
      }
    );
    return response.data;
  },

  // 채팅룸 생성
  createRoom: async (roomData: {
    name: string;
    description?: string;
    isPrivate?: boolean;
  }) => {
    const response = await apiClient.post("/api/chat/rooms", roomData);
    return response.data;
  },
};

// 기본 export
export default apiClient;
