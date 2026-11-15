import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border">
      <div className="perforation h-3 w-full -translate-y-1.5 opacity-60" aria-hidden />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">
            Adult<span className="text-gold">Pass</span>
          </p>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Every document an 18-year-old in India needs, with official government links, in one place.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <Link to="/" className="text-muted-foreground hover:text-primary">Documents</Link>
          <Link to="/journey" className="text-muted-foreground hover:text-primary">18+ Journey</Link>
          <Link to="/eligibility" className="text-muted-foreground hover:text-primary">Age Check</Link>
          <Link to="/tracker" className="text-muted-foreground hover:text-primary">My Tracker</Link>
          <Link to="/assistant" className="text-muted-foreground hover:text-primary">Saathi AI</Link>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          AdultPass is a student hackathon project and is not affiliated with the Government of India. Fees and
          timelines are approximate — always confirm on the official website before applying.
        </p>
      </div>
    </footer>
  );
}
