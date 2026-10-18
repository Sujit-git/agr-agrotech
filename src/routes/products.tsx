import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductBrowser } from "@/components/site/ProductBrowser";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Fruit Products | FRUITLY" },
      {
        name: "description",
        content:
          "Explore FRUITLY natural dehydrated fruits and freeze-dried fruits, with pack sizes and availability.",
      },
      { property: "og:title", content: "Fruit Products | FRUITLY" },
      {
        property: "og:description",
        content: "Natural dehydrated fruits and freeze-dried fruits from FRUITLY. Goodness in Every Bite.",
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
            Discover FRUITLY&apos;s natural dehydrated and freeze-dried fruits. Pack sizes and
            availability are kept up to date by our team.
          </p>
        </div>
      </section>

      <div className="container-page py-10 md:py-14">
        <ProductBrowser />
      </div>
    </SiteLayout>
  );
}
