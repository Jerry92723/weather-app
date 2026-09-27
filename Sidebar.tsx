"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "学园总览", sub: "Dashboard" },
  { href: "/courses", label: "课程知识库", sub: "Courses" },
  { href: "/materials", label: "资料库", sub: "Materials" },
  { href: "/prep", label: "Pre 工作台", sub: "Speech Desk" }
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="w-60 shrink-0 hidden md:flex flex-col border-r hairline bg-parchment/40 px-5 py-8">
      <Link href="/" className="group mb-10 block">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-md bg-accent text-cream font-serif text-xl shadow-book">
            学
          </span>
          <div>
            <p className="font-serif text-lg leading-tight text-ink">学林阁</p>
            <p className="text-xs text-ink-soft tracking-widest">STUDY · HALL</p>
          </div>
        </div>
      </Link>

      <nav className="flex flex-col gap-1.5">
        {NAV.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-baseline justify-between rounded-lg px-4 py-3 transition-colors ${
                active
                  ? "bg-accent text-cream shadow-book"
                  : "text-ink-soft hover:bg-mist hover:text-ink"
              }`}
            >
              <span className="font-serif text-[15px]">{item.label}</span>
              <span className={`text-[11px] tracking-wider ${active ? "text-cream/70" : "text-ink-soft/60"}`}>
                {item.sub}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto rounded-lg border hairline bg-cream p-4 text-xs text-ink-soft">
        <p className="mb-1 font-serif text-sm text-ink">使用小记</p>
        <p>每门课建独立知识库 → 每周传课件教材 → 沉淀知识点，做 Pre 时一键调用。</p>
      </div>
    </aside>
  );
}
