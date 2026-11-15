import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Printer, RotateCcw, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocIcon } from "@/components/site/doc-icon";
import { CATEGORIES, DOCUMENTS } from "@/data/documents";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tracker")({
  head: () => ({
    meta: [
      { title: "My document tracker — AdultPass" },
      { name: "description", content: "Tick off every adult document you've applied for and see your readiness score." },
      { property: "og:title", content: "My document tracker — AdultPass" },
      { property: "og:description", content: "Your personal progress across 15 adult documents, saved in your browser." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TrackerPage,
});

function TrackerPage() {
  const { done, isDone, toggle, reset } = useProgress();
  const total = DOCUMENTS.length;
  const pct = Math.round((done.length / total) * 100);
  const essentials = DOCUMENTS.filter((d) => d.essential);
  const essentialDone = essentials.filter((d) => isDone(d.slug)).length;
  const R = 70, C = 2 * Math.PI * R;

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Saved on this device</p>
          <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">My <em className="text-gold">tracker</em></h1>
        </div>
        <div className="flex gap-2">
          <Button variant="glass" className="rounded-full" onClick={() => window.print()}><Printer /> Print</Button>
          <Button variant="ghost" className="rounded-full" onClick={reset}><RotateCcw /> Reset</Button>
        </div>
      </div>

      <section className="certificate-frame guilloche mt-10 grid items-center gap-10 rounded-3xl border border-gold-line bg-card-gradient p-8 shadow-glow md:grid-cols-[auto_1fr]">
        <div className="relative mx-auto size-44">
          <svg viewBox="0 0 160 160" className="size-full -rotate-90">
            <circle cx="80" cy="80" r={R} fill="none" stroke="var(--color-muted)" strokeWidth="10" />
            <circle cx="80" cy="80" r={R} fill="none" stroke="var(--color-primary)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={C} strokeDashoffset={C - (C * pct) / 100} className="transition-[stroke-dashoffset] duration-700" />
          </svg>
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="font-display text-5xl text-gold">{pct}%</p>
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">ready</p>
            </div>
          </div>
        </div>
        <div>
          <p className="flex items-center gap-3 font-display text-3xl">
            {essentialDone === essentials.length ? <Trophy className="size-8 text-primary" /> : null}
            {essentialDone}/{essentials.length} essentials · {done.length}/{total} total
          </p>
          <p className="mt-2 text-muted-foreground">
            {essentialDone === essentials.length
              ? "Legendary — you have every essential adult document."
              : "Finish the six essentials first: birth certificate, Aadhaar, PAN, Voter ID, Driving Licence and Passport."}
          </p>
          <Button asChild variant="gold" className="mt-6 rounded-full"><Link to="/journey">See recommended order</Link></Button>
        </div>
      </section>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {CATEGORIES.map((cat) => (
          <section key={cat}>
            <h2 className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{cat}</h2>
            <ul className="mt-3 space-y-2">
              {DOCUMENTS.filter((d) => d.category === cat).map((d) => {
                const ok = isDone(d.slug);
                return (
                  <li key={d.slug} className={cn("flex items-center gap-3 rounded-2xl border p-3 transition", ok ? "border-success/40 bg-success/5" : "border-border bg-card/50")}>
                    <button
                      onClick={() => toggle(d.slug)}
                      aria-label={ok ? `Mark ${d.name} not done` : `Mark ${d.name} done`}
                      className={cn("grid size-8 shrink-0 place-items-center rounded-full border transition", ok ? "border-success bg-success text-primary-foreground" : "border-gold-line hover:bg-primary/10")}
                    >
                      {ok && <Check className="size-4" />}
                    </button>
                    <DocIcon slug={d.slug} className="size-4 text-primary" />
                    <Link to="/documents/$slug" params={{ slug: d.slug }} className={cn("flex-1 text-sm hover:text-primary", ok && "text-muted-foreground line-through")}>
                      {d.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
