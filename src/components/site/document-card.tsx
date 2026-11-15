import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Check, Clock, IndianRupee, UserRound } from "lucide-react";
import { useRef, type MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import type { AdultDocument } from "@/data/documents";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";
import { DocIcon } from "./doc-icon";

export function DocumentCard({ doc, index = 0 }: { doc: AdultDocument; index?: number }) {
  const { isDone, toggle } = useProgress();
  const done = isDone(doc.slug);
  const ref = useRef<HTMLElement>(null);

  // Gentle 3D tilt that follows the cursor
  const onMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 8).toFixed(2)}deg) translateY(-4px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <article
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ animationDelay: `${Math.min(index, 10) * 60}ms` }}
      className={cn(
        "group card-shine certificate-frame animate-rise flex flex-col rounded-2xl border border-border bg-card-gradient p-6 shadow-card transition-[transform,box-shadow,border-color] duration-300 ease-out will-change-transform hover:border-gold-line hover:shadow-glow",
        done && "border-success/50",
      )}
    >
      <div className="guilloche pointer-events-none absolute inset-0 rounded-2xl opacity-70" aria-hidden />

      <header className="relative flex items-start justify-between gap-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-full border border-gold-line bg-background/60 text-primary transition-transform duration-500 group-hover:rotate-[360deg]">
          <DocIcon slug={doc.slug} className="size-6" />
        </div>
        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground">No.</p>
          <p className="font-display text-3xl leading-none text-gold">{doc.serial}</p>
        </div>
      </header>

      <div className="relative mt-5 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-accent">
            {doc.category}
          </span>
          {doc.essential && (
            <span className="rounded-full bg-primary/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary">
              Essential
            </span>
          )}
          {done && (
            <span className="flex items-center gap-1 rounded-full bg-success/15 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-success">
              <Check className="size-3" /> Done
            </span>
          )}
        </div>
        <h3 className="mt-3 font-display text-[1.75rem] font-semibold leading-tight">{doc.name}</h3>
        <p className="text-sm text-primary/80">{doc.hindi}</p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{doc.tagline}</p>

        <dl className="mt-5 grid gap-2 border-t border-dashed border-border pt-4 text-xs">
          <div className="flex items-center gap-2"><UserRound className="size-3.5 text-primary" /><dt className="sr-only">Age</dt><dd>{doc.ageNote}</dd></div>
          <div className="flex items-center gap-2"><IndianRupee className="size-3.5 text-primary" /><dt className="sr-only">Fee</dt><dd>{doc.fee}</dd></div>
          <div className="flex items-center gap-2"><Clock className="size-3.5 text-primary" /><dt className="sr-only">Time</dt><dd>{doc.time}</dd></div>
        </dl>
      </div>

      <footer className="relative mt-6 flex flex-col gap-2">
        <Button asChild variant="gold" className="w-full rounded-full">
          <a href={doc.officialUrl} target="_blank" rel="noopener noreferrer">
            {doc.actionLabel} <ArrowUpRight />
          </a>
        </Button>
        <div className="grid grid-cols-2 gap-2">
          <Button asChild variant="glass" size="sm" className="rounded-full">
            <Link to="/documents/$slug" params={{ slug: doc.slug }}>Full guide</Link>
          </Button>
          <Button
            variant={done ? "teal" : "glass"}
            size="sm"
            className="rounded-full"
            onClick={() => toggle(doc.slug)}
            aria-pressed={done}
          >
            <Check /> {done ? "Completed" : "Mark done"}
          </Button>
        </div>
      </footer>
    </article>
  );
}
