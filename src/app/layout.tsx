import type { Metadata } from "next";
import { Inter, Noto_Sans_KR, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SkipLink from "@/components/SkipLink";
import { WebVitals } from "./web-vitals";
import Analytics from "@/components/Analytics";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const notoSansKR = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  preload: false, // CJK 폰트는 preload를 false로 설정해야 합니다
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

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
    <html lang="ko">
      <body
        className={`${inter.variable} ${notoSansKR.variable} ${jetBrainsMono.variable} antialiased bg-black text-gray-100 flex flex-col min-h-screen`}
      >
        <WebVitals />
        <Analytics />
        <SkipLink />
        <Header />
        <main id="main-content" className="flex-1" tabIndex={-1}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
