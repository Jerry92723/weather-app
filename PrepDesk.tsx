"use client";

import { useMemo, useState } from "react";
import { KindBadge } from "./bits";
import { kindLabel, weekLabel } from "/lib/utils";

type Course = {
  id: string;
  name: string;
  accentColor: string;
  materials: Array<{
    id: string;
    title: string;
    kind: string;
    week: number | null;
    note: string | null;
    node: { id: string; title: string } | null;
  }>;
};

export function PrepDesk({ courses }: { courses: Course[] }) {
  const [courseId, setCourseId] = useState(courses[0]?.id || "");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [title, setTitle] = useState("");
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("");
  const [nodeId, setNodeId] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ outline: string; script: string } | null>(null);
  const [error, setError] = useState("");

  const course = courses.find((c) => c.id === courseId);
  const nodeSet = useMemo(() => {
    const m = new Map<string, string>();
    course?.materials.forEach((x) => x.node && m.set(x.node.id, x.node.title));
    return [...m.entries()].map(([id, t]) => ({ id, t }));
  }, [course]);

  const filtered = useMemo(() => {
    return (course?.materials || []).filter((m) => {
      if (q && !m.title.includes(q) && !(m.note || "").includes(q)) return false;
      if (kind && m.kind !== kind) return false;
      if (nodeId && m.node?.id !== nodeId) return false;
      return true;
    });
  }, [course, q, kind, nodeId]);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function generate() {
    if (!courseId || selected.size === 0) {
      setError("请先选择课程，并在右侧勾选要引用的资料。");
      return;
    }
    setBusy(true);
    setError("");
    const res = await fetch("/api/prep", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        courseId,
        materialIds: [...selected],
        title: title.trim() || undefined
      })
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) {
      setError(data.error || "生成失败");
      return;
    }
    setResult({ outline: data.outline, script: data.script });
  }

  function downloadList() {
    const mats = (course?.materials || []).filter((m) => selected.has(m.id));
    const lines = [
      `# 引用材料清单`,
      ``,
      `主题：${title || `${course?.name} · 分享`}`,
      `课程：${course?.name}`,
      `生成时间：${new Date().toLocaleString("zh-CN")}`,
      ``,
      `共 ${mats.length} 份资料：`,
      ``
    ];
    mats.forEach((m, i) => {
      lines.push(`${i + 1}. 【${kindLabel(m.kind)}】《${m.title}》${m.week ? `（第${m.week}周）` : ""}${m.node ? ` → ${m.node.title}` : ""}${m.note ? `\n    备注：${m.note}` : ""}`);
    });
    const blob = new Blob([lines.join("\n")], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `材料清单_${title || "pre"}.md`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function downloadTxt(kind: "outline" | "script", name: string) {
    if (!result) return;
    const blob = new Blob([result[kind]], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      {/* 左：选择 */}
      <div className="flex flex-col gap-6">
        <div className="paper-card p-5 fade-up fade-up-1">
          <h3 className="mb-3 font-serif text-lg text-ink">① 选择课程</h3>
          <div className="flex flex-wrap gap-2">
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setCourseId(c.id);
                  setSelected(new Set());
                  setNodeId("");
                }}
                className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                  courseId === c.id ? "bg-accent text-cream border-accent" : "bg-cream text-ink-soft hover:border-accent"
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>
          {courses.length === 0 && (
            <p className="mt-2 text-sm text-ink-soft">还没有课程，先到「课程知识库」建立吧。</p>
          )}
        </div>

        <div className="paper-card p-5 fade-up fade-up-2">
          <h3 className="mb-3 font-serif text-lg text-ink">② 挑选资料</h3>
          <div className="mb-3 grid grid-cols-[1fr_auto_auto] gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="筛选标题…"
              className="rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
            />
            <select value={kind} onChange={(e) => setKind(e.target.value)} className="rounded-lg border hairline bg-paper px-2 text-sm outline-none">
              <option value="">类型</option>
              {["courseware", "textbook", "note", "other"].map((k) => (
                <option key={k} value={k}>{kindLabel(k)}</option>
              ))}
            </select>
            <select value={nodeId} onChange={(e) => setNodeId(e.target.value)} className="rounded-lg border hairline bg-paper px-2 text-sm outline-none">
              <option value="">知识点</option>
              {nodeSet.map((n) => (
                <option key={n.id} value={n.id}>{n.t}</option>
              ))}
            </select>
          </div>

          <div className="max-h-[420px] space-y-2 overflow-auto pr-1">
            {filtered.length === 0 && (
              <p className="rounded-lg border border-dashed hairline p-6 text-center text-sm text-ink-soft">没有可选的资料。</p>
            )}
            {filtered.map((m) => {
              const on = selected.has(m.id);
              return (
                <label
                  key={m.id}
                  className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                    on ? "border-accent bg-accent/8" : "hairline bg-paper hover:bg-parchment/40"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={on}
                    onChange={() => toggle(m.id)}
                    className="h-4 w-4 accent-[#3f5a3a]"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-ink">{m.title}</p>
                    <p className="text-xs text-ink-soft">
                      {weekLabel(m.week)}{m.node ? ` · ${m.node.title}` : ""}
                    </p>
                  </div>
                  <KindBadge kind={m.kind} />
                </label>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-ink-soft">已选 {selected.size} 份</span>
            <div className="flex gap-2">
              {selected.size > 0 && (
                <button onClick={() => setSelected(new Set())} className="text-accent underline-offset-4 hover:underline">
                  清空
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 右：生成 */}
      <div className="flex flex-col gap-6">
        <div className="paper-card p-5 fade-up fade-up-2">
          <h3 className="mb-3 font-serif text-lg text-ink">③ 生成演讲</h3>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="给这次 Pre 起个标题（可选）"
            className="mb-3 w-full rounded-lg border hairline bg-paper px-3.5 py-2.5 text-sm outline-none focus:border-accent"
          />
          <div className="flex flex-wrap gap-3">
            <button
              onClick={generate}
              disabled={busy || selected.size === 0}
              className="rounded-lg bg-accent px-6 py-2.5 text-sm text-cream shadow-book transition-transform hover:-translate-y-0.5 disabled:opacity-40"
            >
              {busy ? "生成中…" : "生成提纲与讲稿"}
            </button>
            <button
              onClick={downloadList}
              disabled={selected.size === 0}
              className="rounded-lg border hairline bg-cream px-5 py-2.5 text-sm text-ink-soft hover:bg-parchment disabled:opacity-40"
            >
              导出材料清单
            </button>
          </div>
          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          {!result && selected.size === 0 && (
            <p className="mt-4 rounded-lg border border-dashed hairline p-4 text-sm text-ink-soft">
              挑选左侧资料后，点击生成。提纲与讲稿会根据所选课件、教材与笔记自动组织。
            </p>
          )}
        </div>

        {result && (
          <div className="flex flex-col gap-6 fade-up">
            <div className="paper-card p-5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-serif text-lg text-ink">演讲提纲</h3>
                <button
                  onClick={() => downloadTxt("outline", "演讲提纲")}
                  className="text-sm text-accent underline-offset-4 hover:underline"
                >
                  导出 .txt
                </button>
              </div>
              <textarea
                value={result.outline}
                onChange={(e) => setResult((r) => (r ? { ...r, outline: e.target.value } : r))}
                rows={12}
                className="w-full whitespace-pre-wrap rounded-lg border hairline bg-paper p-3 font-serif text-sm leading-6 text-ink outline-none focus:border-accent"
              />
            </div>
            <div className="paper-card p-5">
              <div className="mb-2 flex items-center justify-between">
                <h3 className="font-serif text-lg text-ink">讲稿草稿</h3>
                <button
                  onClick={() => downloadTxt("script", "讲稿草稿")}
                  className="text-sm text-accent underline-offset-4 hover:underline"
                >
                  导出 .txt
                </button>
              </div>
              <textarea
                value={result.script}
                onChange={(e) => setResult((r) => (r ? { ...r, script: e.target.value } : r))}
                rows={10}
                className="w-full whitespace-pre-wrap rounded-lg border hairline bg-paper p-3 font-serif text-sm leading-6 text-ink outline-none focus:border-accent"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
