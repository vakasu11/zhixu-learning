import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "知序 · 智能学习助手",
  description: "公开可访问的计算机核心课程智能学习工作台，含 84 个知识点详解、思维导图与独立学习进度。",
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
