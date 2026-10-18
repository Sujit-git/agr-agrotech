import { createFileRoute } from "@tanstack/react-router";
import { Snowflake } from "lucide-react";

import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductBrowser } from "@/components/site/ProductBrowser";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Fruit Products | Fruitly" },
      {
        name: "description",
        content:
          "Explore Fruitly's dehydrated fruit collection in consistent 50 g pouches, with product details and availability.",
      },
      { property: "og:title", content: "Fruit Products | Fruitly" },
      {
        property: "og:description",
        content: "Fruitly's dehydrated fruit collection. Pure. Fresh. Natural.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <SiteLayout>
      <section className="fruitly-hero-surface border-b border-border/70">
        <div className="container-page py-14 md:py-20">
          <p className="eyebrow">Catalogue</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">All products</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Discover Fruitly&apos;s current dehydrated fruit range. Pack sizes and
            availability are kept up to date by our team.
          </p>
        </div>
      </section>

      <div className="container-page space-y-8 py-12 md:py-16">
        <section className="flex flex-col gap-4 rounded-3xl border border-dashed border-primary/25 bg-secondary/45 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7" aria-label="Freeze-dried fruits coming soon">
          <div className="flex items-start gap-4">
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-background text-primary">
              <Snowflake className="h-5 w-5" aria-hidden />
            </span>
            <div>
              <h2 className="font-display text-xl">Freeze-dried fruits</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
                Our freeze-dried fruit range is in development. Check back soon for updates.
              </p>
            </div>
          </div>
          <span className="inline-flex w-fit shrink-0 rounded-full bg-clay/15 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em]">
            Coming soon
          </span>
        </section>
        <ProductBrowser />
      </div>
    </SiteLayout>
  );
}
