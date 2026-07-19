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
  title: "沙宇栋 | 数字电源与嵌入式控制简历",
  description: "沙宇栋的在线简历与技术博客入口，聚焦数字电源、C2000、DAB、SiC 功率硬件、电力电子控制和嵌入式调试。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "沙宇栋 | 数字电源与嵌入式控制简历",
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
