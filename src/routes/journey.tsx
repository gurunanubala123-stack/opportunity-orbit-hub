import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocIcon } from "@/components/site/doc-icon";
import { JOURNEY, getDocument } from "@/data/documents";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/journey")({
  head: () => ({
    meta: [
      { title: "Your 18+ document journey — AdultPass" },
      { name: "description", content: "The best order to get your adult documents in India: birth certificate, Aadhaar, PAN, bank, voter ID, licence and passport." },
      { property: "og:title", content: "Your 18+ document journey — AdultPass" },
      { property: "og:description", content: "Eight steps, in the right order, so each document unlocks the next." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: JourneyPage,
});

function JourneyPage() {
  const { isDone, toggle } = useProgress();
  const steps = JOURNEY.map((s) => getDocument(s)!).filter(Boolean);
  const next = steps.find((s) => !isDone(s.slug));

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">The recommended route</p>
      <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">
        Your <em className="text-gold">18+ journey</em>
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Each document is proof for the next one. Follow this order and you will never be stuck asking for a paper you don't have yet.
      </p>

      <ol className="relative mt-14 space-y-6 before:absolute before:left-[27px] before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-gradient-to-b before:from-primary before:via-gold-line before:to-transparent">
        {steps.map((d, i) => {
          const done = isDone(d.slug);
          const isNext = next?.slug === d.slug;
          return (
            <li key={d.slug} className="relative flex gap-6 animate-rise" style={{ animationDelay: `${i * 80}ms` }}>
              <button
                onClick={() => toggle(d.slug)}
                aria-label={done ? `Mark ${d.name} not done` : `Mark ${d.name} done`}
                className={cn(
                  "relative z-10 grid size-14 shrink-0 place-items-center rounded-full border-2 font-display text-xl transition",
                  done ? "border-success bg-success text-primary-foreground" : "border-gold-line bg-card text-primary",
                  isNext && "animate-pulse-ring border-primary",
                )}
              >
                {done ? <Check className="size-6" /> : i + 1}
              </button>
              <div className={cn("card-shine flex-1 rounded-2xl border bg-card-gradient p-6 shadow-card transition", isNext ? "border-primary shadow-glow" : "border-border")}>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <DocIcon slug={d.slug} className="size-5 text-primary" />
                    <h2 className="font-display text-2xl">{d.name}</h2>
                    {isNext && <span className="rounded-full bg-primary px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-widest text-primary-foreground">Do this next</span>}
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="glass" size="sm" className="rounded-full">
                      <Link to="/documents/$slug" params={{ slug: d.slug }}>Guide</Link>
                    </Button>
                    <Button asChild variant="gold" size="sm" className="rounded-full">
                      <a href={d.officialUrl} target="_blank" rel="noopener noreferrer">Apply <ArrowUpRight /></a>
                    </Button>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{d.tagline}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
