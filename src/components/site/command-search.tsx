import { useNavigate } from "@tanstack/react-router";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { CATEGORIES, DOCUMENTS } from "@/data/documents";
import { DocIcon } from "./doc-icon";

const OPEN_EVENT = "adultpass-open-search";
export function openCommandSearch() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, onOpen);
    };
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search Aadhaar, passport, voter ID…" />
      <CommandList>
        <CommandEmpty>No document found.</CommandEmpty>
        {CATEGORIES.map((cat) => (
          <CommandGroup key={cat} heading={cat}>
            {DOCUMENTS.filter((d) => d.category === cat).map((d) => (
              <CommandItem
                key={d.slug}
                value={`${d.name} ${d.hindi} ${d.tagline}`}
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: "/documents/$slug", params: { slug: d.slug } });
                }}
              >
                <DocIcon slug={d.slug} className="text-primary" />
                <span>{d.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{d.hindi}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
        <CommandGroup heading="Official sites">
          {DOCUMENTS.filter((d) => d.essential).map((d) => (
            <CommandItem
              key={`${d.slug}-out`}
              value={`open official ${d.name}`}
              onSelect={() => {
                setOpen(false);
                window.open(d.officialUrl, "_blank", "noopener,noreferrer");
              }}
            >
              <ExternalLink className="text-accent" />
              <span>Open {d.name} official site</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
