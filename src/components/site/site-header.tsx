import { Link } from "@tanstack/react-router";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { openCommandSearch } from "./command-search";

const NAV = [
  { to: "/", label: "Documents" },
  { to: "/journey", label: "Journey" },
  { to: "/eligibility", label: "Age Check" },
  { to: "/tracker", label: "My Tracker" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-full border border-gold-line bg-card font-display text-lg font-bold text-primary shadow-glow transition-transform group-hover:rotate-12">
            18
          </span>
          <span className="leading-none">
            <span className="block font-display text-xl font-semibold tracking-wide">
              Adult<span className="text-gold">Pass</span>
            </span>
            <span className="block font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
              One page · every document
            </span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: true }}
              className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary"
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="glass" size="sm" className="hidden rounded-full sm:inline-flex" onClick={openCommandSearch}>
            <Search /> Search
            <kbd className="ml-2 rounded border border-border px-1.5 font-mono text-[10px] text-muted-foreground">Ctrl K</kbd>
          </Button>
          <Button asChild variant="gold" size="sm" className="rounded-full">
            <Link to="/assistant">Ask Saathi AI</Link>
          </Button>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="rounded-lg px-3 py-2 text-sm hover:bg-muted">
              {n.label}
            </Link>
          ))}
          <button onClick={() => { setOpen(false); openCommandSearch(); }} className="rounded-lg px-3 py-2 text-left text-sm hover:bg-muted">
            Search documents
          </button>
        </nav>
      )}
    </header>
  );
}
