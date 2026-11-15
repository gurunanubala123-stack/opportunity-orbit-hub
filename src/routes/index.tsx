import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bot, Mic, Search, ShieldCheck, Sparkle } from "lucide-react";
import { useMemo, useState } from "react";
import heroImg from "@/assets/hero-documents.jpg";
import { Button } from "@/components/ui/button";
import { DocumentCard } from "@/components/site/document-card";
import { CATEGORIES, DOCUMENTS, type Category } from "@/data/documents";
import { useProgress } from "@/hooks/use-progress";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AdultPass — Apply for every 18+ document from one page" },
      {
        name: "description",
        content: "Aadhaar update, PAN, Voter ID, Driving Licence, Passport, Birth Certificate and 9 more — official links, guides and an AI helper.",
      },
      { property: "og:title", content: "AdultPass — Every 18+ document in one page" },
      { property: "og:description", content: "Official links, step-by-step guides, a progress tracker and a talking AI helper for new adults in India." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FILTERS: ("All" | "Essential" | Category)[] = ["All", "Essential", ...CATEGORIES];

function Index() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [q, setQ] = useState("");
  const { done } = useProgress();

  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return DOCUMENTS.filter((d) =>
      filter === "All" ? true : filter === "Essential" ? d.essential : d.category === filter,
    ).filter((d) => !term || `${d.name} ${d.hindi} ${d.tagline} ${d.category}`.toLowerCase().includes(term));
  }, [filter, q]);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[1.05fr_1fr] lg:pt-20">
          <div className="animate-rise">
            <p className="inline-flex items-center gap-2 rounded-full border border-gold-line bg-card/60 px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.25em] text-primary">
              <Sparkle className="size-3.5" /> Just turned 18?
            </p>
            <h1 className="mt-6 font-display text-5xl font-semibold leading-[0.95] sm:text-7xl">
              All your adult papers.
              <br />
              <em className="text-gold">One single page.</em>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground">
              Aadhaar, PAN, Voter ID, Driving Licence, Passport and more — with the right official link, the papers
              you need and the steps to follow. No more hunting through ten government sites.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild variant="gold" size="xl">
                <a href="#documents">
                  Explore documents <ArrowRight />
                </a>
              </Button>
              <Button asChild variant="glass" size="xl">
                <Link to="/assistant">
                  <Mic /> Talk to Saathi AI
                </Link>
              </Button>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-border pt-6">
              {[
                [String(DOCUMENTS.length), "documents"],
                ["100%", "official links"],
                [`${done.length}/${DOCUMENTS.length}`, "you've done"],
              ].map(([n, l]) => (
                <div key={l}>
                  <dt className="font-display text-3xl text-gold">{n}</dt>
                  <dd className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">{l}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/10 blur-3xl" aria-hidden />
            <div className="certificate-frame relative overflow-hidden rounded-[1.75rem] border border-gold-line shadow-glow">
              <img src={heroImg} alt="Passport, Aadhaar card and driving licence with a golden key" width={1600} height={1104} className="h-full w-full object-cover" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background via-background/70 to-transparent p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-primary">Certificate of adulthood</p>
                <p className="font-display text-2xl">The key to your next chapter</p>
              </div>
            </div>
            <div className="animate-float absolute -left-4 -top-4 hidden rounded-2xl border border-gold-line bg-card/90 p-4 shadow-card backdrop-blur sm:block">
              <p className="flex items-center gap-2 text-sm"><ShieldCheck className="size-4 text-success" /> Only .gov.in links</p>
            </div>
            <div className="animate-float absolute -bottom-5 right-6 hidden rounded-2xl border border-gold-line bg-card/90 p-4 shadow-card backdrop-blur [animation-delay:-3s] sm:block">
              <p className="flex items-center gap-2 text-sm"><Bot className="size-4 text-accent" /> Ask in Hindi or English</p>
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div className="relative border-y border-border bg-card/40 py-4">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
            {[...DOCUMENTS, ...DOCUMENTS].map((d, i) => (
              <span key={i} className="flex items-center gap-3 font-display text-xl text-muted-foreground">
                <span className="text-primary">✦</span> {d.name} <span className="text-sm text-primary/60">{d.hindi}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* DOCUMENTS */}
      <section id="documents" className="mx-auto max-w-7xl scroll-mt-20 px-4 pt-20 sm:px-6">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">The registry</p>
            <h2 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Choose your application</h2>
            <p className="mt-2 max-w-lg text-muted-foreground">Every button opens the official government website in a new tab.</p>
          </div>
          <label className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search documents…"
              className="h-12 w-full rounded-full border border-input bg-card/60 pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-all",
                filter === f
                  ? "border-primary bg-primary text-primary-foreground shadow-glow"
                  : "border-border text-muted-foreground hover:border-gold-line hover:text-foreground",
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((d, i) => (
            <DocumentCard key={d.slug} doc={d} index={i} />
          ))}
        </div>
        {list.length === 0 && <p className="py-16 text-center text-muted-foreground">No documents match “{q}”.</p>}
      </section>

      {/* FEATURE STRIP */}
      <section className="mx-auto mt-24 grid max-w-7xl gap-6 px-4 sm:px-6 md:grid-cols-3">
        {[
          { to: "/journey" as const, kicker: "Step by step", title: "Your 18+ journey", text: "The smartest order to get your documents, so each one unlocks the next." },
          { to: "/eligibility" as const, kicker: "Enter birthday", title: "Age check", text: "See what you can apply for today and a live countdown to your 18th." },
          { to: "/assistant" as const, kicker: "Voice + chat", title: "Saathi AI helper", text: "Ask anything about these documents — it answers out loud in Hindi or English." },
        ].map((f) => (
          <Link key={f.to} to={f.to} className="group card-shine rounded-2xl border border-border bg-card-gradient p-8 shadow-card transition hover:border-gold-line hover:shadow-glow">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">{f.kicker}</p>
            <h3 className="mt-3 font-display text-3xl">{f.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            <p className="mt-6 flex items-center gap-2 text-sm text-primary">
              Open <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </p>
          </Link>
        ))}
      </section>
    </>
  );
}
