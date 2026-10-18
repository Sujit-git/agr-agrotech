import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { SiteLayout } from "@/components/site/SiteLayout";
import { ProductBrowser } from "@/components/site/ProductBrowser";
import { categoriesQuery } from "@/lib/catalog";

export const Route = createFileRoute("/products/$category")({
  head: ({ params }) => {
    const label = params.category
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    return {
      meta: [
        { title: `${label} | Fruitly` },
        {
          name: "description",
          content: `Explore Fruitly ${label.toLowerCase()}, with pack sizes and current availability.`,
        },
        { property: "og:title", content: `${label} | Fruitly` },
        {
          property: "og:description",
          content: `Explore Fruitly ${label.toLowerCase()} fruit. Pure. Fresh. Natural.`,
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { category: slug } = useParams({ from: "/products/$category" });
  const { data: categories = [], isLoading } = useQuery(categoriesQuery);
  const category = categories.find((c) => c.slug === slug);

  if (!isLoading && !category) {
    return (
      <SiteLayout>
        <div className="container-page py-24 text-center">
          <h1 className="font-display text-3xl">Category not found</h1>
          <p className="mt-3 text-muted-foreground">
            This product range may have been renamed or removed.
          </p>
          <Link
            to="/products"
            className="mt-6 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Browse all products
          </Link>
        </div>
      </SiteLayout>
    );
  }

  return (
    <SiteLayout>
      <section className="fruitly-hero-surface border-b border-border/70">
        <div className="container-page py-14 md:py-20">
          <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
            <Link to="/products" className="hover:text-foreground">
              Products
            </Link>
            <span aria-hidden> / </span>
            <span className="text-foreground">{category?.name ?? slug}</span>
          </nav>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl">{category?.name ?? slug}</h1>
          {category?.description && (
            <p className="mt-4 max-w-xl text-muted-foreground">{category.description}</p>
          )}
        </div>
      </section>

      <div className="container-page py-12 md:py-16">
        <ProductBrowser categorySlug={slug} />
      </div>
    </SiteLayout>
  );
}
