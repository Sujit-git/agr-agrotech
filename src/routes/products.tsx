import { createFileRoute } from "@tanstack/react-router";

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
            Discover Fruitly&apos;s dehydrated fruit range. Pack sizes and
            availability are kept up to date by our team.
          </p>
        </div>
      </section>

      <div className="container-page py-12 md:py-16">
        <ProductBrowser />
      </div>
    </SiteLayout>
  );
}
