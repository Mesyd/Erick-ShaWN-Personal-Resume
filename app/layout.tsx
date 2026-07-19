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
  title: "Erick.ShaWn | 电子行业嵌入式与电源控制简历",
  description: "Erick.ShaWn 的在线简历与技术博客入口，聚焦 C2000、DSP、数字电源、逆变器控制、电源硬件和嵌入式调试。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Erick.ShaWn | 电子行业嵌入式与电源控制简历",
    description: "在线简历、项目证据与技术文章入口，面向电子行业求职展示。",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
