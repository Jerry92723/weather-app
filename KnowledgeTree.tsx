"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Node = {
  id: string;
  title: string;
  type: string;
  parentId: string | null;
  note?: string | null;
  children?: Node[];
};

function toTree(flat: Node[]): Node[] {
  const map = new Map<string, Node>();
  flat.forEach((n) => map.set(n.id, { ...n, children: [] }));
  const roots: Node[] = [];
  flat.forEach((n) => {
    const node = map.get(n.id)!;
    if (n.parentId && map.has(n.parentId)) {
      map.get(n.parentId)!.children!.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

export function KnowledgeTree({ nodes, courseId }: { nodes: Node[]; courseId: string }) {
  const router = useRouter();
  const tree = toTree(nodes);
  const [addingFor, setAddingFor] = useState<string>("root");
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  async function addNode(parentId: string | null) {
    if (!title.trim()) return;
    setBusy(true);
    const res = await fetch("/api/nodes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, parentId, title: title.trim(), note: note.trim() || null })
    });
    if (res.ok) {
      setTitle("");
      setNote("");
      setAddingFor("root");
      router.refresh();
    }
    setBusy(false);
  }

  function renderNode(node: Node, depth: number) {
    const type = node.type === "topic" ? "知识点" : "章";
    return (
      <div key={node.id} className="group">
        <div className="flex items-center gap-2 py-1.5" style={{ paddingLeft: depth * 20 }}>
          <span
            className={`grid h-6 w-6 shrink-0 place-items-center rounded font-serif text-xs ${
              node.type === "topic" ? "bg-rust/15 text-rust" : "bg-accent/15 text-accent"
            }`}
          >
            {type}
          </span>
          <span className="text-sm text-ink group-hover:text-accent transition-colors">{node.title}</span>
          <button
            onClick={() => {
              setAddingFor(node.id);
              setTitle("");
              setNote("");
            }}
            className="ml-1 rounded px-1.5 text-xs text-ink-soft opacity-0 transition-opacity hover:text-accent group-hover:opacity-100"
          >
            + 子项
          </button>
        </div>
        {node.children && node.children.map((c) => renderNode(c, depth + 1))}
      </div>
    );
  }

  return (
    <div className="paper-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-serif text-lg text-ink">知识框架</h3>
        <span className="text-xs text-ink-soft">章节 / 知识点</span>
      </div>

      <div className="mb-4 rounded-lg border hairline bg-parchment/50 p-4">
        <p className="mb-2 text-xs text-ink-soft">
          {addingFor === "root" ? "新增顶层章节 / 知识点" : "在选中节点下新增子项"}
        </p>
        <div className="flex flex-wrap gap-2">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="节点标题"
            className="min-w-40 flex-1 rounded-lg border hairline bg-paper px-3 py-2 text-sm outline-none focus:border-accent"
          />
          <button
            type="button"
            onClick={() => setAddingFor("root")}
            className={`rounded-lg px-3 text-sm ${addingFor === "root" ? "bg-accent text-cream" : "border hairline bg-cream text-ink-soft"}`}
          >
            顶层
          </button>
          <button
            disabled={busy || !title.trim()}
            onClick={() => addNode(addingFor === "root" ? null : addingFor)}
            className="rounded-lg bg-rust px-4 text-sm text-cream disabled:opacity-40"
          >
            添加
          </button>
        </div>
      </div>

      {tree.length === 0 ? (
        <p className="rounded-lg border border-dashed hairline p-6 text-center text-sm text-ink-soft">
          先搭好知识框架（章节 → 知识点），之后课件与笔记都挂到对应节点下。
        </p>
      ) : (
        <div className="max-h-80 overflow-auto pr-2">{tree.map((n) => renderNode(n, 0))}</div>
      )}
    </div>
  );
}
