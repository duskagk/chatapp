import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChatApp - 실시간 채팅 서비스",
  description:
    "친구들과 실시간으로 소통하고, 다양한 채팅룸에서 새로운 사람들을 만나보세요",
  keywords: ["채팅", "실시간", "메신저", "채팅앱", "소통"],
  authors: [{ name: "ChatApp Team" }],
  openGraph: {
    title: "ChatApp - 실시간 채팅 서비스",
    description:
      "친구들과 실시간으로 소통하고, 다양한 채팅룸에서 새로운 사람들을 만나보세요",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${inter.variable} antialiased font-sans`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
