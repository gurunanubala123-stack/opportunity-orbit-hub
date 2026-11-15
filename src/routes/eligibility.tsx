import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarHeart, Lock, PartyPopper } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { DocIcon } from "@/components/site/doc-icon";
import { ageOn, daysUntilEighteen, eighteenthBirthday, splitByEligibility } from "@/lib/eligibility";

export const Route = createFileRoute("/eligibility")({
  head: () => ({
    meta: [
      { title: "Age check — what can you apply for? | AdultPass" },
      { name: "description", content: "Enter your date of birth to see which documents you can apply for today and count down to your 18th birthday." },
      { property: "og:title", content: "Age check — what can you apply for? | AdultPass" },
      { property: "og:description", content: "A live countdown to 18 and a personalised list of documents you're eligible for." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: EligibilityPage,
});

const DOB_KEY = "adultpass.dob";

function EligibilityPage() {
  const [dob, setDob] = useState("");
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setDob(window.localStorage.getItem(DOB_KEY) ?? "");
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const parsed = useMemo(() => {
    if (!dob) return null;
    const [y = NaN, m = NaN, d = NaN] = dob.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return Number.isNaN(date.getTime()) ? null : date;
  }, [dob]);

  const age = parsed && now ? ageOn(parsed, now) : null;
  const days = parsed && now ? daysUntilEighteen(parsed, now) : null;
  const groups = age !== null ? splitByEligibility(age) : null;
  const msLeft = parsed && now ? Math.max(0, eighteenthBirthday(parsed).getTime() - now.getTime()) : 0;
  const hh = Math.floor((msLeft / 3_600_000) % 24), mm = Math.floor((msLeft / 60_000) % 60), ss = Math.floor((msLeft / 1000) % 60);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="font-mono text-xs uppercase tracking-[0.3em] text-accent">Personal check</p>
      <h1 className="mt-3 font-display text-5xl font-semibold sm:text-6xl">What can I <em className="text-gold">apply for?</em></h1>

      <div className="certificate-frame guilloche mt-10 rounded-3xl border border-gold-line bg-card-gradient p-8 shadow-glow">
        <label className="block">
          <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <CalendarHeart className="size-4 text-primary" /> Your date of birth
          </span>
          <input
            type="date"
            value={dob}
            max={now ? now.toISOString().slice(0, 10) : undefined}
            onChange={(e) => {
              setDob(e.target.value);
              window.localStorage.setItem(DOB_KEY, e.target.value);
            }}
            className="mt-3 h-14 w-full max-w-sm rounded-2xl border border-input bg-background/60 px-5 font-display text-2xl outline-none [color-scheme:dark] focus:border-primary"
          />
        </label>

        {age !== null && days !== null && (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">You are</p>
              <p className="font-display text-7xl text-gold">{age}</p>
              <p className="text-muted-foreground">years old</p>
            </div>
            {days > 0 ? (
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.25em] text-muted-foreground">Countdown to 18</p>
                <p className="font-display text-5xl tabular-nums">
                  {days}<span className="text-xl text-muted-foreground"> days </span>
                  {String(hh).padStart(2, "0")}:{String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">Then Voter ID, a full driving licence and more unlock.</p>
              </div>
            ) : (
              <div className="flex items-center gap-4 rounded-2xl border border-success/40 bg-success/10 p-5">
                <PartyPopper className="size-10 text-success" />
                <p>You're an adult! Every document on AdultPass is open to you.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {groups && (
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <section>
            <h2 className="font-display text-3xl">Apply today <span className="text-primary">({groups.eligible.length})</span></h2>
            <ul className="mt-4 space-y-3">
              {groups.eligible.map((d) => (
                <li key={d.slug}>
                  <Link to="/documents/$slug" params={{ slug: d.slug }} className="card-shine flex items-center gap-4 rounded-2xl border border-border bg-card-gradient p-4 transition hover:border-gold-line">
                    <DocIcon slug={d.slug} className="size-5 text-primary" />
                    <span className="flex-1">{d.name}</span>
                    <ArrowUpRight className="size-4 text-primary" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h2 className="font-display text-3xl">Unlocks later <span className="text-muted-foreground">({groups.upcoming.length})</span></h2>
            <ul className="mt-4 space-y-3">
              {groups.upcoming.map((d) => (
                <li key={d.slug} className="flex items-center gap-4 rounded-2xl border border-dashed border-border p-4 text-muted-foreground">
                  <Lock className="size-5" />
                  <span className="flex-1">{d.name}</span>
                  <span className="text-xs">at {d.minAge}</span>
                </li>
              ))}
              {groups.upcoming.length === 0 && <li className="text-muted-foreground">Nothing locked — you're all set.</li>}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}
