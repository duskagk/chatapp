import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 인증이 필요한 경로들
const protectedRoutes = ["/dashboard", "/chat"];

// 로그인된 사용자는 접근할 수 없는 경로들 (이미 로그인된 상태라면 리다이렉트)
const authRoutes = ["/auth/login", "/auth/register"];

// 공개 경로들 (인증 없이 접근 가능)
const publicRoutes = ["/", "/api"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // API 라우트는 미들웨어에서 제외
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 정적 파일들은 미들웨어에서 제외
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // BetterAuth 세션 토큰 확인
  const sessionToken = request.cookies.get("better-auth.session_token");
  const authToken = request.cookies.get("auth-token"); // 백엔드에서 설정하는 토큰
  const isAuthenticated = !!(sessionToken?.value || authToken?.value);

  console.log(`[Middleware] ${pathname} - Authenticated: ${isAuthenticated}`);

  // 보호된 경로 체크
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 1. 인증이 필요한 페이지인데 로그인되지 않은 경우
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. 이미 로그인된 사용자가 auth 페이지에 접근하려는 경우
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 3. 루트 경로에서 로그인된 사용자는 대시보드로 리다이렉트
  if (pathname === "/" && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 나머지는 통과
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
