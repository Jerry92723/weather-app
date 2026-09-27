import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { KnowledgeTree } from "@/components/courses/KnowledgeTree";
import { UploadMaterialForm } from "@/components/courses/UploadMaterialForm";
import { NoteForm } from "@/components/courses/NoteForm";
import { KindBadge } from "@/components/ui/bits";
import { formatDate, weekLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      nodes: { orderBy: { order: "asc" } },
      materials: { orderBy: { createdAt: "desc" }, include: { node: true } },
      notes: { orderBy: { createdAt: "desc" }, include: { node: true } }
    }
  });

  if (!course) notFound();

  const nodeOptions = course.nodes.map((n) => ({
    id: n.id,
    label: `${n.type === "topic" ? "知识点" : "章"} · ${n.title}`
  }));

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/courses" className="text-sm text-ink-soft hover:text-accent">
        ← 返回课程书斋
      </Link>

      <header className="mt-3 mb-8 fade-up">
        <div className="flex items-center gap-4">
          <span
            className="grid h-14 w-14 shrink-0 place-items-center rounded-lg text-cream font-serif text-2xl shadow-book"
            style={{ backgroundColor: course.accentColor }}
          >
            {course.name.slice(0, 1)}
          </span>
          <div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-brass">
              {course.code || "COURSE"} · {course.semester || "本学期"}
            </p>
            <h1 className="font-serif text-3xl text-ink">{course.name}</h1>
            {course.instructor && <p className="mt-1 text-sm text-ink-soft">授课 · {course.instructor}</p>}
          </div>
        </div>
        {course.description && (
          <p className="mt-4 max-w-3xl text-sm text-ink-soft">{course.description}</p>
        )}
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        {/* 左：知识框架 + 笔记 */}
        <div className="flex flex-col gap-6">
          <div className="fade-up fade-up-1">
            <KnowledgeTree nodes={course.nodes} courseId={course.id} />
          </div>
          <div className="fade-up fade-up-2">
            <NoteForm courseId={course.id} nodes={nodeOptions} />
          </div>
          {course.notes.length > 0 && (
            <div className="fade-up fade-up-3">
              <h3 className="mb-3 font-serif text-lg text-ink">沉淀笔记</h3>
              <ul className="flex flex-col gap-3">
                {course.notes.map((n) => (
                  <li key={n.id} className="paper-card p-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-ink">{n.title}</p>
                      <span className="text-[11px] text-ink-soft">{formatDate(n.createdAt)}</span>
                    </div>
                    {n.content && <p className="mt-1.5 whitespace-pre-wrap text-sm text-ink-soft">{n.content}</p>}
                    {n.node && <p className="mt-2 text-xs text-brass">↳ {n.node.title}</p>}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* 右：上传 + 资料 */}
        <div className="flex flex-col gap-6">
          <div className="fade-up fade-up-1">
            <UploadMaterialForm courseId={course.id} nodes={nodeOptions} />
          </div>

          <div className="fade-up fade-up-2">
            <h3 className="mb-3 font-serif text-lg text-ink">资料卷宗</h3>
            {course.materials.length === 0 ? (
              <div className="paper-card px-6 py-10 text-center text-sm text-ink-soft">
                还没有资料，每周上传课件与教材，慢慢攒起来。
              </div>
            ) : (
              <ul className="paper-card divide-y divide-line/70 overflow-hidden">
                {course.materials.map((m) => (
                  <li key={m.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-parchment/40">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">
                        {m.title}
                        {m.fileName && <span className="ml-2 text-xs font-normal text-ink-soft">{m.fileName}</span>}
                      </p>
                      <p className="mt-0.5 text-xs text-ink-soft">
                        {weekLabel(m.week)} · {formatDate(m.createdAt)}
                        {m.node && <span className="ml-2 text-brass">↳ {m.node.title}</span>}
                      </p>
                    </div>
                    <KindBadge kind={m.kind} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
