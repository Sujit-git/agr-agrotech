import { Link } from "@tanstack/react-router";
import logo from "@/assets/fruitly-logo.png";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="inline-flex shrink-0 items-center" aria-label="FRUITLY home">
      <img
        src={logo}
        alt="FRUITLY — Goodness in Every Bite"
        width={1376}
        height={768}
        className={compact ? "h-14 w-auto object-contain" : "h-14 w-auto object-contain md:h-16"}
      />
    </Link>
  );
}
