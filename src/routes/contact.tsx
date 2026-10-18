import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  MessageSquareText,
  Navigation,
  Phone,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery, fallbackSettings, phoneNumbers, telLink, whatsappLink } from "@/lib/site";

const fruitlyAddress =
  "Gat No. 89, Jadhavnagar, Phaltan-Upalve Road, Tahasil Phaltan, District Satara, Maharashtra, India. Pin code – 415523";
const mapEmbedUrl =
  "https://maps.google.com/maps?q=Gat%20No.%2089%2C%20Jadhavnagar%2C%20Phaltan-Upalve%20Road%2C%20Tahasil%20Phaltan%2C%20District%20Satara%2C%20Maharashtra%2C%20India%20415523&output=embed";
const mapDirectionsUrl =
  "https://www.google.com/maps/dir/?api=1&destination=Gat%20No.%2089%2C%20Jadhavnagar%2C%20Phaltan-Upalve%20Road%2C%20Tahasil%20Phaltan%2C%20District%20Satara%2C%20Maharashtra%2C%20India%20415523";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Fruitly | Pure. Fresh. Natural." },
      {
        name: "description",
        content:
          "Contact Fruitly for product questions, pack details and business enquiries. Find our Phaltan, Satara address and location map.",
      },
      { property: "og:title", content: "Contact Fruitly | Pure. Fresh. Natural." },
      {
        property: "og:description",
        content: "Phone, WhatsApp, map and enquiry form for Fruitly.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

function Contact() {
  const { data } = useQuery(settingsQuery);
  const s = data ?? fallbackSettings;

  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const update = (key: keyof typeof form, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Keep existing validation, Supabase submission and success/error flows intact.
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next["name"] = "Please tell us your name.";
    if (!form.message.trim()) next["message"] = "Please add a short message.";
    if (!form.email.trim() && !form.phone.trim())
      next["email"] = "Add an email or a phone number so we can reply.";
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      next["email"] = "That email address doesn't look right.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    const { error } = await supabase.from("contact_messages").insert({
      name: form.name.trim(),
      email: form.email.trim() || null,
      phone: form.phone.trim() || null,
      message: form.message.trim(),
    });
    setSending(false);

    if (error) {
      toast.error("We couldn't send your message. Please try again or call us directly.");
      return;
    }
    setSent(true);
    setForm({ name: "", email: "", phone: "", message: "" });
    toast.success("Thanks! Your message has reached Fruitly.");
  };

  return (
    <SiteLayout>
      <section className="fruitly-hero-surface relative overflow-hidden border-b border-border/70">
        <div className="container-page grid items-center gap-8 py-12 sm:py-16 md:grid-cols-[0.9fr_1.1fr] md:gap-12 md:py-20">
          <div className="rise-in">
            <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-primary/15 bg-background/80 px-3.5 py-2">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Let's talk fruit
            </p>
            <h1 className="mt-5 max-w-xl text-4xl leading-[1.06] tracking-[-0.045em] sm:text-5xl md:text-6xl">
              Your next
              <br />
              fruit moment
              <br />
              starts here.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Product questions, pack details or a business enquiry—we'd love to hear what you're looking for.
            </p>
            <div className="mt-7 flex flex-wrap gap-2 text-[0.68rem] font-semibold uppercase tracking-[0.13em] text-primary">
              <span className="rounded-full border border-primary/15 bg-background/75 px-3 py-2">Product enquiries</span>
              <span className="rounded-full border border-primary/15 bg-background/75 px-3 py-2">Retail & bulk</span>
              <span className="rounded-full border border-primary/15 bg-background/75 px-3 py-2">Customer support</span>
            </div>
            <div className="mt-8 flex items-start gap-3 border-t border-primary/10 pt-5 text-sm text-muted-foreground">
              <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
              <p>Leave us a message and our team will get back to you as soon as possible.</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[2rem] bg-primary/5" aria-hidden />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-border/80 bg-card shadow-lift">
              <div className="bg-primary px-6 py-5 text-primary-foreground sm:px-8">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white/70">Fruitly customer care</p>
                <h2 className="mt-2 text-2xl text-white sm:text-3xl">Send us a note.</h2>
                <p className="mt-2 text-sm leading-6 text-white/75">Tell us how we can help. Fields marked with * are required.</p>
              </div>

              <div className="p-5 sm:p-8">
                {sent ? (
                  <div className="py-10 text-center">
                    <span className="mx-auto inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/60 text-primary">
                      <MessageSquareText className="h-6 w-6" aria-hidden />
                    </span>
                    <h3 className="mt-5 text-2xl">Message received.</h3>
                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-muted-foreground">
                      Thank you for reaching out to Fruitly. We'll reply as soon as we can.
                    </p>
                    <Button variant="outline" className="mt-6 rounded-full" onClick={() => setSent(false)}>
                      Send another message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={submit} noValidate className="space-y-5">
                    <div>
                      <Label htmlFor="name">Your name <span className="text-clay">*</span></Label>
                      <Input
                        id="name"
                        autoComplete="name"
                        placeholder="What should we call you?"
                        value={form.name}
                        onChange={(e) => update("name", e.target.value)}
                        aria-invalid={Boolean(errors["name"])}
                        className="mt-2 h-12 rounded-xl bg-background/70 px-4"
                      />
                      {errors["name"] && <p className="mt-1.5 text-sm text-destructive">{errors["name"]}</p>}
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <Label htmlFor="email">Email address</Label>
                        <Input
                          id="email"
                          type="email"
                          autoComplete="email"
                          placeholder="you@example.com"
                          value={form.email}
                          onChange={(e) => update("email", e.target.value)}
                          aria-invalid={Boolean(errors["email"])}
                          className="mt-2 h-12 rounded-xl bg-background/70 px-4"
                        />
                        {errors["email"] && <p className="mt-1.5 text-sm text-destructive">{errors["email"]}</p>}
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="Your contact number"
                          value={form.phone}
                          onChange={(e) => update("phone", e.target.value)}
                          className="mt-2 h-12 rounded-xl bg-background/70 px-4"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="message">How can we help? <span className="text-clay">*</span></Label>
                      <Textarea
                        id="message"
                        rows={5}
                        placeholder="Tell us what you're interested in..."
                        value={form.message}
                        onChange={(e) => update("message", e.target.value)}
                        aria-invalid={Boolean(errors["message"])}
                        className="mt-2 min-h-32 resize-y rounded-xl bg-background/70 px-4 py-3"
                      />
                      {errors["message"] && <p className="mt-1.5 text-sm text-destructive">{errors["message"]}</p>}
                    </div>

                    <Button type="submit" size="lg" disabled={sending} className="w-full rounded-full shadow-soft sm:w-auto sm:min-w-48">
                      {sending ? "Sending…" : "Send your enquiry"}
                      {!sending && <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden />}
                    </Button>
                    <p className="text-xs leading-5 text-muted-foreground">
                      Please don't include payment card details or sensitive personal information in your message.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-12 sm:py-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-10 lg:py-20">
        <div className="space-y-4">
          <div>
            <p className="eyebrow">Find us</p>
            <h2 className="mt-3 text-3xl leading-tight sm:text-4xl">A little closer to you.</h2>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              Fruitly is a consumer fruit brand by AGR Agrotech Pvt. Ltd., based in Phaltan, Satara, Maharashtra.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-soft sm:p-6">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent/60 text-primary">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold">Our address</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{fruitlyAddress}</p>
                <a
                  href={mapDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-foreground"
                >
                  Get directions <Navigation className="h-4 w-4" aria-hidden />
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            {phoneNumbers(s.phone).map((number) => (
              <a
                key={number}
                href={telLink(number)}
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/80 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-accent/70 hover:shadow-soft"
              >
                <Phone className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground">Call Fruitly</span>
                  <span className="block break-words text-sm font-semibold">{number}</span>
                </span>
              </a>
            ))}
            {s.whatsapp && (
              <a
                href={whatsappLink(s.whatsapp, "Hi Fruitly, I'd like to know more about your fruits.")}
                target="_blank"
                rel="noreferrer"
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/80 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-accent/70 hover:shadow-soft"
              >
                <MessageCircle className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground">WhatsApp</span>
                  <span className="block text-sm font-semibold">Chat with our team</span>
                </span>
              </a>
            )}
            {s.email && (
              <a
                href={`mailto:${s.email}`}
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/80 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-accent/70 hover:shadow-soft"
              >
                <Mail className="h-5 w-5 shrink-0 text-primary" aria-hidden />
                <span className="min-w-0">
                  <span className="block text-xs text-muted-foreground">Email</span>
                  <span className="block break-all text-sm font-semibold">{s.email}</span>
                </span>
              </a>
            )}
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] border border-border/80 bg-muted shadow-lift sm:min-h-[460px]">
          <iframe
            title="Fruitly location map — Gat No. 89, Jadhavnagar, Phaltan"
            src={mapEmbedUrl}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
          <div className="pointer-events-none absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-2xl border border-white/80 bg-background/95 px-4 py-3 shadow-soft sm:left-6 sm:top-6">
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-primary">Fruitly · Phaltan</p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">Satara district, Maharashtra</p>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}
