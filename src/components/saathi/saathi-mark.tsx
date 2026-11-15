import { cn } from "@/lib/utils";

/** Saathi's identity: a gold wax-seal with the Devanagari letter "स". */
export function SaathiMark({ className, speaking }: { className?: string; speaking?: boolean }) {
  return (
    <span
      className={cn(
        "relative grid shrink-0 place-items-center rounded-full border border-gold-line bg-gold font-display font-bold text-primary-foreground shadow-glow",
        speaking && "animate-pulse-ring",
        className,
      )}
      aria-hidden
    >
      स
    </span>
  );
}
