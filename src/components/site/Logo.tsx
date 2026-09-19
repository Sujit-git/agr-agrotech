import { Link } from "@tanstack/react-router";

/** Text logo treatment. Swap the inner markup for an <img> when a real logo exists. */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="group flex items-center gap-3" aria-label="AGR Agrotech home">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-display text-lg leading-none tracking-tight">
        A
      </span>
      <span className="leading-tight">
        <span className="block font-display text-xl font-semibold tracking-tight">AGR</span>
        {!compact && (
          <span className="block text-[0.65rem] uppercase tracking-[0.22em] text-muted-foreground">
            Agrotech
          </span>
        )}
      </span>
    </Link>
  );
}
