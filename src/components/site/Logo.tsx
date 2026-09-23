import { Link } from "@tanstack/react-router";
import logo from "@/assets/agr-logo-transparent.png";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link to="/" className="inline-flex shrink-0 items-center" aria-label="AGR Agrotech home">
      <img
        src={logo}
        alt="AGR Agrotech — Where Nature Meets Technology"
        width={1376}
        height={768}
        className={compact ? "h-14 w-auto object-contain" : "h-14 w-auto object-contain md:h-16"}
      />
    </Link>
  );
}
