import path from "path";

/** 各类资料的显示标签与配色 */
export const KIND_META: Record<string, { label: string; color: string }> = {
  courseware: { label: "课件", color: "#3f5a3a" },
  textbook: { label: "教材", color: "#9c4a2e" },
  note: { label: "笔记", color: "#a8852f" },
  other: { label: "其他", color: "#565a54" }
};

export const KIND_KEYS = ["courseware", "textbook", "note", "other"];

export function kindLabel(kind: string): string {
  return KIND_META[kind]?.label ?? "其他";
}

export function kindColor(kind: string): string {
  return KIND_META[kind]?.color ?? "#565a54";
}

/** 由原始文件名生成落盘文件名（安全化） */
export function safeFileName(name: string): string {
  const base = path.basename(name).replace(/[^a-zA-Z0-9._\u4e00-\u9fa5-]/g, "_");
  const stamp = Date.now().toString(36);
  const ext = path.extname(base);
  const stem = path.basename(base, ext).slice(0, 60) || "file";
  return `${stem}_${stamp}${ext}`;
}

/** 简易日期格式化 */
export function formatDate(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** 简体中文星期 */
export function weekLabel(n: number | null | undefined): string {
  if (!n || n <= 0) return "未分周";
  return `第 ${n} 周`;
}

/** 是否为本学期内（用于概览统计，此处简单返回 true 便于演示） */
export function isThisSemester(_d: Date): boolean {
  return true;
}
