import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "知序 · AI 学习助手",
  description: "面向计算机核心课程的个人 AI 学习工作台。",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="antialiased">{children}</body>
    </html>
  );
}
