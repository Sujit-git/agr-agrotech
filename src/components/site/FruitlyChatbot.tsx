import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Mail, MessageCircle, Phone, X } from "lucide-react";

import { fallbackSettings, phoneNumbers, settingsQuery, whatsappLink } from "@/lib/site";

type ChatView = "welcome" | "contact" | "products" | "faqs";

export function FruitlyChatbot() {
  const { data } = useQuery(settingsQuery);
  const settings = data ?? fallbackSettings;
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [view, setView] = useState<ChatView>("welcome");

  const mobileNumbers = phoneNumbers(settings.phone);
  const whatsappUrl = whatsappLink(
    settings.whatsapp,
    "Hi Fruitly team! I'd like to know more about your products.",
  );

  const openChat = () => {
    setOpen(true);
    setUnread(false);
  };

  const startWhatsApp = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="fruitly-chatbot fixed bottom-4 right-4 z-[70] sm:bottom-6 sm:right-6">
      {open && (
        <section
          aria-label="Fruitly chat assistant"
          className="mb-3 flex w-[min( calc(100vw-2rem), 22rem)] max-h-[min(70vh, 34rem)] flex-col overflow-hidden rounded-3xl border border-border/80 bg-card shadow-[0_20px_70px_rgba(18,48,29,0.22)]"
        >
          <header className="flex items-center justify-between gap-3 bg-primary px-4 py-3.5 text-primary-foreground">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                <MessageCircle className="h-5 w-5" aria-hidden />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">Fruitly Team</p>
                <p className="text-xs text-white/75">Here to help you</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close Fruitly chat"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15 focus-visible:outline-white"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            <div className="max-w-[95%] rounded-2xl rounded-tl-sm bg-secondary/80 px-3.5 py-3 text-sm leading-6 text-foreground">
              Hi from the Fruitly team! 👋 Would you like to chat with the Fruitly team?
            </div>

            {view === "welcome" && (
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={startWhatsApp}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Yes, chat on WhatsApp <ArrowUpRight className="h-4 w-4" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-full border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  No, thanks
                </button>
                <p className="pt-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Or choose a quick option
                </p>
                <QuickReply onClick={() => setView("contact")}>Connect to Fruitly</QuickReply>
                <QuickReply onClick={() => setView("products")}>Explore Products</QuickReply>
                <QuickReply onClick={() => setView("faqs")}>Frequently asked questions</QuickReply>
              </div>
            )}

            {view === "contact" && (
              <div className="space-y-3 rounded-2xl border border-border bg-background p-3.5">
                <p className="text-sm font-semibold text-foreground">Connect to Fruitly</p>
                <a
                  href="mailto:contact@fruitly.co.in"
                  className="flex items-center gap-2 break-all text-sm text-primary hover:underline"
                >
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
                  contact@fruitly.co.in
                </a>
                {mobileNumbers.length > 0 ? (
                  mobileNumbers.map((number) => (
                    <a
                      key={number}
                      href={`tel:${number.replace(/[^\d+]/g, "")}`}
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Phone className="h-4 w-4 shrink-0" aria-hidden />
                      {number}
                    </a>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Please reach us by email.</p>
                )}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:bg-primary/90"
                >
                  Chat on WhatsApp <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            )}

            {view === "products" && (
              <div className="space-y-3 rounded-2xl border border-border bg-background p-3.5">
                <p className="text-sm leading-6 text-foreground">
                  Here is the list of our products.
                </p>
                <a
                  href="https://www.fruitly.co.in/products"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-primary underline-offset-4 hover:underline"
                >
                  Explore Fruitly products <ArrowUpRight className="h-4 w-4" aria-hidden />
                </a>
              </div>
            )}

            {view === "faqs" && (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-foreground">How can we help?</p>
                <div className="rounded-2xl bg-secondary/80 p-3 text-sm leading-6">
                  <p className="font-semibold">Where can I see the Fruitly range?</p>
                  <p className="mt-1 text-muted-foreground">
                    Browse our product catalogue to see the current range and pack details.
                  </p>
                  <a href="https://www.fruitly.co.in/products" className="mt-2 inline-flex items-center gap-1 font-bold text-primary hover:underline">
                    View products <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
                <div className="rounded-2xl bg-secondary/80 p-3 text-sm leading-6">
                  <p className="font-semibold">How do I ask about availability or ordering?</p>
                  <p className="mt-1 text-muted-foreground">
                    Message our team on WhatsApp and we’ll help with the latest information.
                  </p>
                  <a href={whatsappUrl} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 font-bold text-primary hover:underline">
                    Ask Fruitly <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </a>
                </div>
                <div className="rounded-2xl bg-secondary/80 p-3 text-sm leading-6">
                  <p className="font-semibold">How can I contact the team?</p>
                  <p className="mt-1 text-muted-foreground">
                    Choose “Connect to Fruitly” for our email address and phone details.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="border-t border-border bg-background p-3">
            <button
              type="button"
              onClick={() => setView("welcome")}
              className="w-full rounded-full border border-border px-4 py-2 text-xs font-bold text-primary transition-colors hover:bg-secondary"
            >
              Back to Main Menu
            </button>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={open ? () => setOpen(false) : openChat}
        aria-label={open ? "Close Fruitly chat" : "Open Fruitly chat"}
        aria-expanded={open}
        className="relative ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(20,77,43,0.28)] transition-transform hover:scale-105 focus-visible:outline-offset-4 sm:h-14 sm:w-14"
      >
        {open ? <X className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden /> : <MessageCircle className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden />}
        {unread && !open && (
          <span className="absolute right-0 top-0 h-3 w-3 rounded-full border-2 border-background bg-red-500" aria-label="New chat message" />
        )}
      </button>
    </div>
  );
}

function QuickReply({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-xl border border-border bg-background px-3.5 py-2.5 text-left text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:bg-secondary"
    >
      {children}
      <ArrowUpRight className="h-4 w-4 shrink-0 text-primary" aria-hidden />
    </button>
  );
}
