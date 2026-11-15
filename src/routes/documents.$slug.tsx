import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight, Bot, Check, Clock, FileText, IndianRupee, Lightbulb, Printer, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocIcon } from "@/components/site/doc-icon";
import { DOCUMENTS, getDocument } from "@/data/documents";
import { useProgress } from "@/hooks/use-progress";

export const Route = createFileRoute("/documents/$slug")({
  loader: ({ params }) => {
    const doc = getDocument(params.slug);
    if (!doc) throw notFound();
    return { doc };
  },
  head: ({ loaderData }) => {
    const doc = loaderData?.doc;
    if (!doc) return { meta: [{ title: "Document not found — AdultPass" }, { name: "robots", content: "noindex" }] };
    const title = `${doc.name} — how to apply | AdultPass`;
    return {
      meta: [
        { title },
        { name: "description", content: `${doc.tagline} Fee: ${doc.fee}. Time: ${doc.time}. Official link and step-by-step guide.` },
        { property: "og:title", content: title },
        { property: "og:description", content: doc.tagline },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary" },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-xl px-4 py-32 text-center">
      <h1 className="font-display text-5xl">Document not found</h1>
      <Button asChild variant="gold" className="mt-8 rounded-full"><Link to="/">Back to all documents</Link></Button>
    </div>
  ),
  component: DocumentPage,
});

function DocumentPage() {
  const { doc } = Route.useLoaderData();
  const { isDone, toggle } = useProgress();
  const done = isDone(doc.slug);
  const related = DOCUMENTS.filter((d) => d.category === doc.category && d.slug !== doc.slug).slice(0, 3);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
        <ArrowLeft className="size-4" /> All documents
      </Link>

      <section className="certificate-frame guilloche relative mt-6 overflow-hidden rounded-3xl border border-gold-line bg-card-gradient p-8 shadow-glow sm:p-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-6">
            <div className="grid size-20 shrink-0 place-items-center rounded-full border border-gold-line bg-background/60 text-primary">
              <DocIcon slug={doc.slug} className="size-9" />
            </div>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">
                {doc.category} · No. {doc.serial}
              </p>
              <h1 className="mt-2 font-display text-5xl font-semibold sm:text-6xl">{doc.name}</h1>
              <p className="mt-1 text-lg text-primary/80">{doc.hindi}</p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row md:flex-col">
            <Button asChild variant="gold" size="xl">
              <a href={doc.officialUrl} target="_blank" rel="noopener noreferrer">
                {doc.actionLabel} <ArrowUpRight />
              </a>
            </Button>
            <Button variant={done ? "teal" : "glass"} size="xl" onClick={() => toggle(doc.slug)} aria-pressed={done}>
              <Check /> {done ? "Completed" : "Mark as done"}
            </Button>
          </div>
        </div>
        <p className="mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground">{doc.description}</p>
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            [UserRound, "Who can apply", doc.ageNote],
            [IndianRupee, "Fee", doc.fee],
            [Clock, "Time taken", doc.time],
          ].map(([Icon, label, value]) => {
            const I = Icon as typeof Clock;
            return (
              <div key={label as string} className="rounded-2xl border border-border bg-background/40 p-5">
                <dt className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  <I className="size-3.5 text-primary" /> {label as string}
                </dt>
                <dd className="mt-2 font-display text-xl">{value as string}</dd>
              </div>
            );
          })}
        </dl>
      </section>

      <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-3xl border border-border bg-card-gradient p-8 shadow-card">
          <h2 className="font-display text-3xl">How to apply</h2>
          <ol className="mt-6 space-y-5">
            {doc.steps.map((s, i) => (
              <li key={i} className="flex gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-gold font-display text-lg font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <p className="pt-1.5">{s}</p>
              </li>
            ))}
          </ol>
          <div className="mt-8 flex gap-3 rounded-2xl border border-accent/30 bg-accent/10 p-5">
            <Lightbulb className="size-5 shrink-0 text-accent" />
            <p className="text-sm"><strong className="text-accent">Pro tip: </strong>{doc.tip}</p>
          </div>
        </section>

        <div className="flex flex-col gap-6">
          <section className="rounded-3xl border border-border bg-card-gradient p-8 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-3xl">Papers to keep ready</h2>
              <Button variant="ghost" size="icon" onClick={() => window.print()} aria-label="Print checklist">
                <Printer />
              </Button>
            </div>
            <ul className="mt-5 space-y-3">
              {doc.requiredDocs.map((r) => (
                <li key={r} className="flex gap-3 text-sm">
                  <FileText className="mt-0.5 size-4 shrink-0 text-primary" /> {r}
                </li>
              ))}
            </ul>
          </section>
          <section className="rounded-3xl border border-border bg-card-gradient p-8 shadow-card">
            <h2 className="font-display text-3xl">Official links</h2>
            <ul className="mt-5 space-y-2">
              {doc.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-3 rounded-xl border border-border px-4 py-3 text-sm transition hover:border-primary hover:bg-primary/5">
                    {l.label}
                    <ArrowUpRight className="size-4 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <Link to="/assistant" className="flex items-center gap-4 rounded-3xl border border-gold-line bg-primary/10 p-6 transition hover:shadow-glow">
            <Bot className="size-8 text-primary" />
            <div>
              <p className="font-display text-xl">Still confused?</p>
              <p className="text-sm text-muted-foreground">Ask Saathi AI about {doc.name} — by voice or text.</p>
            </div>
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="font-display text-3xl">More in {doc.category}</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {related.map((r) => (
              <Link key={r.slug} to="/documents/$slug" params={{ slug: r.slug }} className="card-shine flex items-center gap-4 rounded-2xl border border-border bg-card-gradient p-5 transition hover:border-gold-line">
                <DocIcon slug={r.slug} className="size-6 text-primary" />
                <div>
                  <p className="font-display text-xl">{r.name}</p>
                  <p className="text-xs text-muted-foreground">{r.tagline}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
