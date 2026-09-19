import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductBrowser } from "@/components/site/ProductBrowser";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products | AGR \u2014 Agrotech" },
      {
        name: "description",
        content:
          "Browse the full AGR \u2014 Agrotech catalogue: vermicompost, dehydrated fruits and freeze-dried fruits with prices, pack sizes and availability.",
      },
      { property: "og:title", content: "Products | AGR \u2014 Agrotech" },
      {
        property: "og:description",
        content: "Vermicompost, dehydrated fruits and freeze-dried fruits from AGR \u2014 Agrotech.",
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
      <section className="border-b border-border bg-secondary/40">
        <div className="container-page py-12 md:py-16">
          <p className="eyebrow">Catalogue</p>
          <h1 className="mt-3 font-display text-4xl sm:text-5xl">All products</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            Natural agricultural and food products from AGR. Prices and availability are kept up to
            date by our team.
          </p>
        </div>
      </section>

      <div className="container-page py-10 md:py-14">
        <ProductBrowser />
      </div>
    </SiteLayout>
  );
}
