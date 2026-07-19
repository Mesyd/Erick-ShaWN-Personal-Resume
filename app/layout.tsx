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
  title: "Erick.ShaWn | 嵌入式与电源硬件技术博客",
  description: "Erick.ShaWn 的个人技术博客，沉淀 C2000、DSP、F280049C、逆变器控制、电源硬件和嵌入式调试文章。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Erick.ShaWn | 嵌入式与电源硬件技术博客",
    description: "从 CSDN 迁移而来的嵌入式、DSP、数字电源和控制算法知识库。",
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
