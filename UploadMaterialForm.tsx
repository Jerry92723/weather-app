"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { KIND_KEYS, kindLabel } from "@/lib/utils";

type NodeOpt = { id: string; label: string };

export function UploadMaterialForm({ courseId, nodes }: { courseId: string; nodes: NodeOpt[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    fd.set("courseId", courseId);
    const res = await fetch("/api/materials", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "上传失败");
      setBusy(false);
      return;
    }
    e.currentTarget.reset();
    setOpen(false);
    router.refresh();
  }

  return (
    <div className="paper-card p-5">
      <button onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between text-left">
        <span className="font-serif text-lg text-ink">＋ 上传本周资料</span>
        <span className="text-sm text-accent">{open ? "收起 ▲" : "展开 ▼"}</span>
      </button>

      {open && (
        <form onSubmit={onSubmit} className="mt-5 grid gap-4 md:grid-cols-2">
          <label className="md:col-span-2 block">
            <span className="mb-1 block text-sm text-ink-soft">资料标题 *</span>
            <input
              required
              name="title"
              placeholder="如：第3章 栈与队列 课件"
              className="w-full rounded-lg border hairline bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">资料类型</span>
            <select
              name="kind"
              className="w-full rounded-lg border hairline bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent"
            >
              {KIND_KEYS.map((k) => (
                <option key={k} value={k}>{kindLabel(k)}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">所属周次</span>
            <input
              type="number"
              name="week"
              min={1}
              max={20}
              placeholder="如 3"
              className="w-full rounded-lg border hairline bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-accent"
            />
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">挂到知识点（可选）</span>
            <select
              name="nodeId"
              defaultValue=""
              className="w-full rounded-lg border hairline bg-paper px-3 py-2.5 text-sm outline-none focus:border-accent"
            >
              <option value="">不挂载</option>
              {nodes.map((n) => (
                <option key={n.id} value={n.id}>{n.label}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-sm text-ink-soft">课件 / 教材文件</span>
            <input
              type="file"
              name="file"
              className="w-full rounded-lg border hairline bg-paper px-2 py-2 text-sm text-ink-soft file:mr-3 file:rounded-md file:border-0 file:bg-accent file:px-3 file:py-1.5 file:text-sm file:text-cream"
            />
          </label>

          <label className="md:col-span-2 block">
            <span className="mb-1 block text-sm text-ink-soft">补充备注（可选）</span>
            <textarea
              name="note"
              rows={2}
              placeholder="本课重点、疑问等"
              className="w-full rounded-lg border hairline bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
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
              {busy ? "上传中…" : "存入书斋"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
