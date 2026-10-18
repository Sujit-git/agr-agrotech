import { Link } from "@tanstack/react-router";
import logo from "@/assets/fruitly-logo.png";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      className="inline-flex min-w-0 shrink-0 items-center gap-2.5"
      aria-label="Fruitly home"
    >
      <span className={compact ? "fruitly-wordmark-clip is-compact" : "fruitly-wordmark-clip"}>
        <img
          src={logo}
          alt="Fruitly"
          width={634}
          height={252}
          className="fruitly-wordmark-image"
        />
      </span>
      <span className="hidden border-l border-primary/20 pl-3 text-[9px] font-bold uppercase leading-[1.55] tracking-[0.18em] text-primary sm:block">
        Pure.
        <br />
        Fresh.
        <br />
        Natural.
      </span>
    </Link>
  );
}
