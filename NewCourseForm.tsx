"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewCourseForm({ accents }: { accents: string[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [color, setColor] = useState(accents[0]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    fd.set("accentColor", color);
    const res = await fetch("/api/courses", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "创建失败");
      setBusy(false);
      return;
    }
    router.refresh();
    router.push(`/courses/${data.id}`);
  }

  return (
    <div className="paper-card p-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="font-serif text-lg text-ink">＋ 新建课程知识库</span>
        <span className="text-sm text-accent">{open ? "收起 ▲" : "展开 ▼"}</span>
      </button>

      {open && (
        <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2 block">
            <span className="mb-1 block text-sm text-ink-soft">课程名称 *</span>
            <input
              required
              name="name"
              placeholder="如：数据结构与算法"
              className="w-full rounded-lg border hairline bg-paper px-3.5 py-2.5 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">课程代码</span>
            <input
              name="code"
              placeholder="如：CS201"
              className="w-full rounded-lg border hairline bg-paper px-3.5 py-2.5 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">授课老师</span>
            <input
              name="instructor"
              placeholder="如：王老师"
              className="w-full rounded-lg border hairline bg-paper px-3.5 py-2.5 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">学期</span>
            <input
              name="semester"
              placeholder="如：2026 秋季"
              className="w-full rounded-lg border hairline bg-paper px-3.5 py-2.5 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          <div className="block">
            <span className="mb-1 block text-sm text-ink-soft">书斋色标</span>
            <div className="flex gap-2 pt-1.5">
              {accents.map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setColor(a)}
                  aria-label="选择色标"
                  className={`h-7 w-7 rounded-full transition-transform ${color === a ? "scale-125 ring-2 ring-offset-2 ring-ink/40" : "hover:scale-110"}`}
                  style={{ backgroundColor: a }}
                />
              ))}
            </div>
          </div>
          <label className="md:col-span-2 block">
            <span className="mb-1 block text-sm text-ink-soft">课程简介</span>
            <textarea
              name="description"
              rows={2}
              placeholder="这门课主要讲什么？"
              className="w-full rounded-lg border hairline bg-paper px-3.5 py-2.5 text-ink outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>
          {error && <p className="md:col-span-2 text-sm text-red-600">{error}</p>}
          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg border hairline bg-cream px-4 py-2 text-sm text-ink-soft hover:bg-parchment"
            >
              取消
            </button>
            <button
              disabled={busy}
              className="rounded-lg bg-accent px-5 py-2 text-sm text-cream shadow-book transition-transform hover:-translate-y-0.5 disabled:opacity-50"
            >
              {busy ? "创建中…" : "建立书斋"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
