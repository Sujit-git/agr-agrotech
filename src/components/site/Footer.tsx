import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Facebook, Mail, Phone, MapPin } from "lucide-react";

import { settingsQuery, fallbackSettings, phoneNumbers, telLink } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  const { data } = useQuery(settingsQuery);
  const s = data ?? fallbackSettings;

  return (
    <footer className="mt-24 border-t border-border bg-secondary/50">
      <div className="container-page grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {s.business_description}
          </p>
          {(s.instagram || s.facebook) && (
            <div className="mt-5 flex gap-3">
              {s.instagram && (
                <a
                  href={s.instagram}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent"
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
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border transition-colors hover:bg-accent"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold">Quick Links</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/products" className="hover:text-foreground">
                Products
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-foreground">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-foreground">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="hover:text-foreground">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-foreground">
                Terms &amp; Conditions
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-semibold">Get in touch</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {phoneNumbers(s.phone).map((number) => (
              <li key={number} className="flex items-start gap-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <a href={telLink(number)} className="hover:text-foreground">
                  {number}
                </a>
              </li>
            ))}
            {s.email && (
              <li className="flex items-start gap-2">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <a href={`mailto:${s.email}`} className="hover:text-foreground">
                  {s.email}
                </a>
              </li>
            )}
            {s.address && (
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <span className="whitespace-pre-line">{s.address}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-2 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; AGR &mdash; Agrotech. All rights reserved.</p>
          <Link to="/admin/login" className="hover:text-foreground">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
