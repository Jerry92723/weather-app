import { kindColor, kindLabel } from "@/lib/utils";

export function Tag({ text, tone }: { text: string; tone?: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] leading-4"
      style={{
        borderColor: tone || "var(--color-line)",
        color: tone || "var(--color-ink-soft)",
        backgroundColor: (tone || "#888") + "14"
      }}
    >
      {text}
    </span>
  );
}

export function KindBadge({ kind }: { kind: string }) {
  const color = kindColor(kind);
  return (
    <span
      className="inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px] font-medium"
      style={{ color, backgroundColor: color + "16" }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />
      {kindLabel(kind)}
    </span>
  );
}

export function EmptyState({ icon, title, desc, action }: { icon: string; title: string; desc: string; action?: React.ReactNode }) {
  return (
    <div className="paper-card flex flex-col items-center gap-3 px-6 py-12 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-mist text-2xl text-accent">{icon}</span>
      <p className="font-serif text-lg text-ink">{title}</p>
      <p className="max-w-sm text-sm text-ink-soft">{desc}</p>
      {action}
    </div>
  );
}

export function SectionTitle({ kicker, title, right }: { kicker?: string; title: string; right?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        {kicker && <p className="mb-1 text-[11px] uppercase tracking-[0.2em] text-brass">{kicker}</p>}
        <h2 className="font-serif text-2xl text-ink">{title}</h2>
      </div>
      {right}
    </div>
  );
}
