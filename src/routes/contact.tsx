import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { toast } from "sonner";

import { SiteLayout } from "@/components/site/SiteLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery, fallbackSettings, phoneNumbers, telLink, whatsappLink } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AGR \u2014 Agrotech" },
      {
        name: "description",
        content:
          "Get in touch with AGR \u2014 Agrotech about products, pack sizes and bulk enquiries by phone, WhatsApp or the contact form.",
      },
      { property: "og:title", content: "Contact AGR \u2014 Agrotech" },
      {
        property: "og:description",
        content: "Phone, WhatsApp and enquiry form for AGR \u2014 Agrotech.",
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
    toast.success("Thanks! Your message has reached AGR.");
  };

  return (
    <SiteLayout>
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-12 md:py-16">
          <p className="eyebrow">Contact</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">We&apos;d love to hear from you</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Questions about a product, pack sizes, or a bulk requirement &mdash; send us a note and
            we&apos;ll get back to you.
          </p>
        </div>
      </section>

      <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.2fr_1fr] md:py-16">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          {sent ? (
            <div className="py-10 text-center">
              <h2 className="font-display text-2xl">Message sent</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                Thank you for reaching out. We&apos;ll reply as soon as we can.
              </p>
              <Button variant="outline" className="mt-6" onClick={() => setSent(false)}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => update("name", e.target.value)}
                  aria-invalid={Boolean(errors['name'])}
                  className="mt-2 h-11"
                />
                {errors['name'] && (
                  <p className="mt-1.5 text-sm text-destructive">{errors['name']}</p>
                )}
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    aria-invalid={Boolean(errors['email'])}
                    className="mt-2 h-11"
                  />
                  {errors['email'] && (
                    <p className="mt-1.5 text-sm text-destructive">{errors['email']}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="mt-2 h-11"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={6}
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  aria-invalid={Boolean(errors['message'])}
                  className="mt-2"
                />
                {errors['message'] && (
                  <p className="mt-1.5 text-sm text-destructive">{errors['message']}</p>
                )}
              </div>

              <Button type="submit" size="lg" disabled={sending}>
                {sending ? "Sending\u2026" : "Send message"}
              </Button>
            </form>
          )}
        </div>

        <aside className="space-y-4">
          {phoneNumbers(s.phone).map((number) => (
            <a
              key={number}
              href={telLink(number)}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-accent/40"
            >
              <Phone className="mt-1 h-5 w-5 text-primary" aria-hidden />
              <span>
                <span className="block font-medium">Call us</span>
                <span className="block text-sm text-muted-foreground">{number}</span>
              </span>
            </a>
          ))}
          {s.whatsapp && (
            <a
              href={whatsappLink(s.whatsapp, "Hi AGR, I'd like to know more about your products.")}
              target="_blank"
              rel="noreferrer"
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-accent/40"
            >
              <MessageCircle className="mt-1 h-5 w-5 text-primary" aria-hidden />
              <span>
                <span className="block font-medium">WhatsApp</span>
                <span className="block text-sm text-muted-foreground">Chat with our team</span>
              </span>
            </a>
          )}
          {s.email && (
            <a
              href={`mailto:${s.email}`}
              className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5 transition-colors hover:bg-accent/40"
            >
              <Mail className="mt-1 h-5 w-5 text-primary" aria-hidden />
              <span>
                <span className="block font-medium">Email</span>
                <span className="block text-sm break-all text-muted-foreground">{s.email}</span>
              </span>
            </a>
          )}
          {s.address && (
            <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-5">
              <MapPin className="mt-1 h-5 w-5 text-primary" aria-hidden />
              <span>
                <span className="block font-medium">Address</span>
                <span className="block whitespace-pre-line text-sm text-muted-foreground">{s.address}</span>
              </span>
            </div>
          )}
        </aside>
      </div>
    </SiteLayout>
  );
}
