import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, FolderTree, Package, PackageX, Plus } from "lucide-react";

import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { categoriesQuery, productsQuery, availabilityLabel, formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/admin/dashboard")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Admin Dashboard | AGR \u2014 Agrotech" },
      { name: "description", content: "Manage AGR products, categories and business details." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Admin Dashboard | AGR \u2014 Agrotech" },
      { property: "og:description", content: "Manage AGR products and categories." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { data: products = [] } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);

  const stats = [
    { label: "Total products", value: products.length, icon: Package },
    {
      label: "Available",
      value: products.filter((p) => p.availability === "available").length,
      icon: Package,
    },
    {
      label: "Out of stock",
      value: products.filter((p) => p.availability === "out_of_stock").length,
      icon: PackageX,
    },
    { label: "Categories", value: categories.length, icon: FolderTree },
  ];

  const recent = [...products]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 5);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ categories, products }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `agr-products-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminShell title="Dashboard">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
            <stat.icon className="h-4 w-4 text-muted-foreground" aria-hidden />
            <p className="mt-3 font-display text-3xl">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/admin/products">
            <Plus className="mr-2 h-4 w-4" aria-hidden />
            Add product
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/products">Manage products</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/categories">Manage categories</Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/admin/settings">Settings</Link>
        </Button>
        <Button variant="outline" onClick={exportJson}>
          <Download className="mr-2 h-4 w-4" aria-hidden />
          Export products
        </Button>
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg">Recently updated</h2>
        {recent.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No products yet.</p>
        ) : (
          <ul className="mt-4 divide-y divide-border">
            {recent.map((p) => (
              <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span className="font-medium">{p.name}</span>
                <span className="text-sm text-muted-foreground">
                  {formatPrice(p.price, p.currency)} &middot; {availabilityLabel(p.availability)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminShell>
  );
}
