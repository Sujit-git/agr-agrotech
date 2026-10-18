import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Facebook, Mail, Phone, MapPin, ArrowUpRight } from "lucide-react";

import { settingsQuery, fallbackSettings, phoneNumbers, telLink } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  const { data } = useQuery(settingsQuery);
  const s = data ?? fallbackSettings;

  return (
    <footer className="mt-24 border-t border-border bg-secondary/55">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4 md:py-16">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
            A thoughtful world of dehydrated fruit, presented in a considered range for everyday fruit moments.
          </p>
          <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Pure. Fresh. Natural.
          </p>
          <p className="mt-5 text-xs text-muted-foreground">A consumer fruit brand by AGR Agrotech Pvt. Ltd.</p>
          {(s.instagram || s.facebook) && (
            <div className="mt-5 flex gap-3">
              {s.instagram && (
                <a
                  href={s.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-accent"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {s.facebook && (
                <a
                  href={s.facebook}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background transition-colors hover:bg-accent"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold">Explore</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li><Link to="/products" className="transition-colors hover:text-primary">All products</Link></li>
            <li><Link to="/about" className="transition-colors hover:text-primary">Our story</Link></li>
            <li><Link to="/contact" className="transition-colors hover:text-primary">Contact</Link></li>
            <li><Link to="/privacy-policy" className="transition-colors hover:text-primary">Privacy Policy</Link></li>
            <li><Link to="/terms" className="transition-colors hover:text-primary">Terms &amp; Conditions</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {phoneNumbers(s.phone).map((number) => (
              <li key={number} className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <a href={telLink(number)} className="transition-colors hover:text-primary">
                  {number}
                </a>
              </li>
            ))}
            {s.email && (
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <a href={`mailto:${s.email}`} className="break-all transition-colors hover:text-primary">
                  {s.email}
                </a>
              </li>
            )}
            {s.address && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                <span className="whitespace-pre-line">{s.address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border/80">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; Fruitly. All rights reserved.</p>
          <a href="#top" className="inline-flex items-center gap-1.5 font-semibold text-primary transition-colors hover:text-foreground">
            Back to top <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </footer>
  );
}
