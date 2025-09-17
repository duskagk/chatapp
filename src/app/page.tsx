import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* 헤더 섹션 */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            실시간 채팅을
            <span className="text-blue-600"> 더 쉽게</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            친구들과 실시간으로 소통하고, 다양한 채팅룸에서 새로운 사람들을
            만나보세요
          </p>
        </div>

        {/* 기능 소개 */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-6 h-6 text-blue-600"
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
            <h3 className="text-xl font-semibold mb-2">실시간 채팅</h3>
            <p className="text-gray-600">
              빠르고 안정적인 실시간 메시징으로 끊김없는 소통을 경험하세요
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-6 h-6 text-green-600"
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
            </div>
            <h3 className="text-xl font-semibold mb-2">다양한 채팅룸</h3>
            <p className="text-gray-600">
              관심사별 채팅룸에 참여하거나 나만의 채팅룸을 만들어보세요
            </p>
          </div>

          <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 mx-auto">
              <svg
                className="w-6 h-6 text-purple-600"
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
            </div>
            <h3 className="text-xl font-semibold mb-2">보안 & 프라이버시</h3>
            <p className="text-gray-600">
              안전한 환경에서 걱정 없이 대화를 나누실 수 있습니다
            </p>
          </div>
        </div>

        {/* CTA 버튼들 */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/auth/register"
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            지금 시작하기
          </Link>
          <Link
            href="/auth/login"
            className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg border-2 border-gray-300 hover:bg-gray-50 transition-colors duration-200"
          >
            로그인
          </Link>
        </div>

        {/* 부가 정보 */}
        {/* <div className="mt-12 text-sm text-gray-500">
          <p>
            이미 <strong>1,000+</strong> 명의 사용자가 함께하고 있습니다
          </p>
        </div> */}
      </div>
    </div>
  );
}
