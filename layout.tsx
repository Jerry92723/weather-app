import type { Metadata } from "next";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileBar } from "@/components/layout/MobileBar";

export const metadata: Metadata = {
  title: "学林阁 · 大学学习工作台",
  description: "每门课独立知识库，每周沉淀课件与教材，Pre 一键调用。"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex min-w-0 flex-1 flex-col">
            <MobileBar />
            <main className="flex-1 px-5 py-8 md:px-10 md:py-10">{children}</main>
            <footer className="px-8 pb-6 text-center text-xs text-ink-soft/60">
              学林阁 · 本学期学习工作台 — 知识因沉淀而生长
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
