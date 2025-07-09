import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    template: '%s | 단덕 블로그',
    default: '단덕 블로그', // 기본 제목
  },
  description: 'Obsidian 노트로 만든 개인 블로그입니다.',
  authors: [{ name: '단덕' }],
  keywords: ['블로그', 'Obsidian', 'Next.js', '개발'],
  
  // Open Graph 설정 (Facebook, Instagram, Threads 공통)
  openGraph: {
    title: '단덕 블로그',
    description: 'Obsidian 노트로 만든 개인 블로그입니다.',
    url: 'https://danduck.dev',
    siteName: '단덕 블로그',
    locale: 'ko_KR',
    type: 'website',
    images: [{
      url: 'https://your-domain.com/og-image.jpg', // 1200x630 권장
      width: 1200,
      height: 630,
      alt: '단덕 블로그 대표 이미지',
    }],
  },
  
  // Meta 플랫폼 추가 설정
  other: {
    // 페이스북 앱 ID (Insights 용)
    'fb:app_id': 'your_facebook_app_id',
    
    // 메타 쓰레드 최적화
    'og:site_name': '단덕 블로그',
    'og:locale': 'ko_KR',
    'og:locale:alternate': 'en_US',
  },
  
  // robots 설정
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
