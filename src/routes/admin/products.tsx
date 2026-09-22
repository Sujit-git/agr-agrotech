import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import {
  availabilityLabels,
  categoriesQuery,
  formatPrice,
  productImage,
  productsQuery,
  type Product,
} from "@/lib/catalog";
import { slugify, uploadProductImage } from "@/lib/uploads";

export const Route = createFileRoute("/admin/products")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Manage Products | AGR \u2014 Agrotech" },
      { name: "description", content: "Add, edit and remove AGR catalog products." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Manage Products | AGR \u2014 Agrotech" },
      { property: "og:description", content: "Add, edit and remove AGR catalog products." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProductsAdmin,
});

type FormState = {
  name: string;
  slug: string;
  category_id: string;
  short_description: string;
  description: string;
  price: string;
  unit: string;
  image_url: string;
  availability: string;
  featured: boolean;
  sort_order: string;
  key_features: string;
  storage_information: string;
  usage_information: string;
};

const emptyForm: FormState = {
  name: "",
  slug: "",
  category_id: "",
  short_description: "",
  description: "",
  price: "",
  unit: "",
  image_url: "",
  availability: "available",
  featured: false,
  sort_order: "0",
  key_features: "",
  storage_information: "",
  usage_information: "",
};

function ProductsAdmin() {
  const qc = useQueryClient();
  const { data: products = [], isLoading, isError } = useQuery(productsQuery);
  const { data: categories = [] } = useQuery(categoriesQuery);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const startNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setOpen(true);
  };

  const startEdit = (product: Product) => {
    setEditing(product);
    setErrors({});
    setForm({
      name: product.name,
      slug: product.slug,
      category_id: product.category_id ?? "",
      short_description: product.short_description ?? "",
      description: product.description ?? "",
      price: product.price == null ? "" : String(product.price),
      unit: product.unit ?? "",
      image_url: product.image_url ?? "",
      availability: product.availability,
      featured: product.featured,
      sort_order: String(product.sort_order),
      key_features: product.key_features.join("\n"),
      storage_information: product.storage_information ?? "",
      usage_information: product.usage_information ?? "",
    });
    setOpen(true);
  };

  const pickImage = async (file: File | undefined) => {
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      set("image_url", url);
      toast.success("Image uploaded.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "The image could not be uploaded.");
    } finally {
      setUploading(false);
    }
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next["name"] = "A product name is required.";
    if (!form.category_id) next["category_id"] = "Please choose a category.";
    if (form.price.trim() && Number.isNaN(Number(form.price)))
      next["price"] = "Price must be a number.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    const payload = {
      name: form.name.trim(),
      slug: slugify(form.slug || form.name),
      category_id: form.category_id,
      short_description: form.short_description.trim() || null,
      description: form.description.trim() || null,
      price: form.price.trim() ? Number(form.price) : null,
      unit: form.unit.trim() || null,
      image_url: form.image_url.trim() || null,
      availability: form.availability,
      featured: form.featured,
      sort_order: Number(form.sort_order) || 0,
      key_features: form.key_features
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean),
      storage_information: form.storage_information.trim() || null,
      usage_information: form.usage_information.trim() || null,
    };

    const { error } = editing
      ? await supabase.from("products").update(payload).eq("id", editing.id)
      : await supabase.from("products").insert(payload);
    setBusy(false);

    if (error) {
      toast.error(
        error.code === "23505"
          ? "Another product already uses that web address."
          : "The product could not be saved. Please try again.",
      );
      return;
    }
    toast.success(editing ? "Product updated." : "Product added.");
    setOpen(false);
    void qc.invalidateQueries({ queryKey: ["products"] });
  };

  const remove = async (product: Product) => {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    const { error } = await supabase.from("products").delete().eq("id", product.id);
    if (error) {
      toast.error("The product could not be deleted.");
      return;
    }
    toast.success("Product deleted.");
    void qc.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <AdminShell title="Products">
      <Button onClick={startNew}>
        <Plus className="mr-2 h-4 w-4" aria-hidden />
        Add product
      </Button>

      {isLoading && <p className="mt-6 text-sm text-muted-foreground">Loading products…</p>}
      {isError && (
        <p className="mt-6 text-sm text-destructive">
          We couldn't load your products. Please check your connection and refresh.
        </p>
      )}

      <div className="mt-6 space-y-3">
        {products.map((product) => {
          const image = productImage(product);
          const category = categories.find((c) => c.id === product.category_id);
          return (
            <div
              key={product.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                {image && (
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-[10rem] flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {category?.name ?? "No category"} &middot;{" "}
                  {formatPrice(product.price, product.currency)}
                  {product.unit ? ` / ${product.unit}` : ""} &middot;{" "}
                  {availabilityLabels[product.availability as keyof typeof availabilityLabels] ??
                    product.availability}
                  {product.featured ? " \u00b7 Featured" : ""}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => startEdit(product)}>
                  <Pencil className="mr-2 h-3.5 w-3.5" aria-hidden />
                  Edit
                </Button>
                <Button variant="ghost" size="sm" onClick={() => void remove(product)}>
                  <Trash2 className="mr-2 h-3.5 w-3.5" aria-hidden />
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
        {!isLoading && products.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No products yet. Add your first product to fill the catalog.
          </p>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit product" : "Add product"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={save} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="p-name">Name</Label>
                <Input
                  id="p-name"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className="mt-2"
                />
                {errors["name"] && (
                  <p className="mt-1.5 text-xs text-destructive">{errors["name"]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="p-category">Category</Label>
                <select
                  id="p-category"
                  value={form.category_id}
                  onChange={(e) => set("category_id", e.target.value)}
                  className="mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors["category_id"] && (
                  <p className="mt-1.5 text-xs text-destructive">{errors["category_id"]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="p-price">Price</Label>
                <Input
                  id="p-price"
                  inputMode="decimal"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className="mt-2"
                />
                {errors["price"] && (
                  <p className="mt-1.5 text-xs text-destructive">{errors["price"]}</p>
                )}
              </div>
              <div>
                <Label htmlFor="p-unit">Pack size / unit</Label>
                <Input
                  id="p-unit"
                  value={form.unit}
                  onChange={(e) => set("unit", e.target.value)}
                  placeholder="5 kg"
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="p-availability">Availability</Label>
                <select
                  id="p-availability"
                  value={form.availability}
                  onChange={(e) => set("availability", e.target.value)}
                  className="mt-2 h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                >
                  {Object.entries(availabilityLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="p-order">Display order</Label>
                <Input
                  id="p-order"
                  type="number"
                  value={form.sort_order}
                  onChange={(e) => set("sort_order", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="p-short">Short description</Label>
              <Textarea
                id="p-short"
                rows={2}
                value={form.short_description}
                onChange={(e) => set("short_description", e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="p-desc">Full description</Label>
              <Textarea
                id="p-desc"
                rows={4}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="p-features">Key features (one per line)</Label>
              <Textarea
                id="p-features"
                rows={3}
                value={form.key_features}
                onChange={(e) => set("key_features", e.target.value)}
                className="mt-2"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="p-storage">Storage information</Label>
                <Textarea
                  id="p-storage"
                  rows={3}
                  value={form.storage_information}
                  onChange={(e) => set("storage_information", e.target.value)}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="p-usage">Usage information</Label>
                <Textarea
                  id="p-usage"
                  rows={3}
                  value={form.usage_information}
                  onChange={(e) => set("usage_information", e.target.value)}
                  className="mt-2"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="p-image">Product image</Label>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Input
                  id="p-image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => void pickImage(e.target.files?.[0])}
                  className="max-w-xs"
                />
                {uploading && (
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    Uploading
                  </span>
                )}
                {form.image_url && !uploading && (
                  <span className="flex items-center text-sm text-muted-foreground">
                    <Upload className="mr-2 h-4 w-4" aria-hidden />
                    Image attached
                  </span>
                )}
              </div>
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt=""
                  className="mt-3 h-24 w-24 rounded-xl object-cover"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="p-featured"
                checked={form.featured}
                onCheckedChange={(v) => set("featured", v === true)}
              />
              <Label htmlFor="p-featured">Show on the homepage as featured</Label>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={busy || uploading}>
                {busy ? "Saving\u2026" : "Save product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
