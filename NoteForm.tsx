"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NoteForm({ courseId, nodes }: { courseId: string; nodes: { id: string; label: string }[] }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) return;
    setBusy(true);
    const fd = new FormData(e.currentTarget);
    fd.set("courseId", courseId);
    const res = await fetch("/api/notes", { method: "POST", body: fd });
    if (res.ok) {
      setTitle("");
      setContent("");
      router.refresh();
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="paper-card grid gap-3 p-5">
      <h3 className="font-serif text-lg text-ink">记一笔</h3>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        name="title"
        required
        placeholder="笔记标题"
        className="w-full rounded-lg border hairline bg-paper px-3.5 py-2 text-sm outline-none focus:border-accent"
      />
      <div className="grid gap-2 md:grid-cols-[1fr_auto]">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          name="content"
          rows={2}
          placeholder="记录要点、疑问、联想…"
          className="w-full rounded-lg border hairline bg-paper px-3.5 py-2 text-sm outline-none focus:border-accent"
        />
        <button
          disabled={busy || !title.trim()}
          className="rounded-lg bg-brass px-5 text-sm text-cream disabled:opacity-40"
        >
          存下
        </button>
      </div>
    </form>
  );
}
