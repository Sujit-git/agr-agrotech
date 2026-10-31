import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Tags as TagsIcon, Trash2, Upload } from "lucide-react";
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
  type ProductTag,
  productTagsQuery,
} from "@/lib/catalog";
import { PRODUCT_IMAGE_SIZE_LABEL, slugify, uploadProductImage } from "@/lib/uploads";

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
  original_price: string;
  tags: string[];
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
  original_price: "",
  tags: [],
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
  const { data: productTags = [] } = useQuery(productTagsQuery);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [tagName, setTagName] = useState("");
  const [editingTag, setEditingTag] = useState<ProductTag | null>(null);
  const [tagBusy, setTagBusy] = useState(false);

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
      original_price: product.original_price == null ? "" : String(product.original_price),
      tags: product.tags ?? [],
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
    if (form.price.trim() && (Number.isNaN(Number(form.price)) || Number(form.price) < 0))
      next["price"] = "Enter a valid selling price.";
    if (form.original_price.trim() && (Number.isNaN(Number(form.original_price)) || Number(form.original_price) < 0))
      next["original_price"] = "Enter a valid original price.";
    if (form.original_price.trim() && form.price.trim() && Number(form.original_price) < Number(form.price))
      next["original_price"] = "Original price cannot be lower than the selling price.";
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
      original_price: form.original_price.trim() ? Number(form.original_price) : null,
      tags: form.tags,
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

  const toggleProductTag = (slug: string, checked: boolean) => {
    set("tags", checked ? [...new Set([...form.tags, slug])] : form.tags.filter((item) => item !== slug));
  };

  const saveTag = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = tagName.trim();
    if (!name) {
      toast.error("Enter a tag name.");
      return;
    }
    setTagBusy(true);
    const result = editingTag
      ? await supabase.from("product_tags").update({ name }).eq("id", editingTag.id).eq("is_preset", false)
      : await supabase.from("product_tags").insert({
          name,
          slug: slugify(name),
          is_preset: false,
          is_active: true,
          sort_order: 100,
        });
    setTagBusy(false);
    if (result.error) {
      toast.error(result.error.code === "23505" ? "A tag with this name already exists." : "The tag could not be saved.");
      return;
    }
    toast.success(editingTag ? "Tag renamed." : "Custom tag created.");
    setTagName("");
    setEditingTag(null);
    void qc.invalidateQueries({ queryKey: ["product-tags"] });
  };

  const removeTag = async (tag: ProductTag) => {
    if (tag.is_preset) return;
    if (!window.confirm(`Delete the “${tag.name}” tag? It will be removed from any products using it.`)) return;
    const { error } = await supabase.from("product_tags").delete().eq("id", tag.id).eq("is_preset", false);
    if (error) {
      toast.error("The tag could not be deleted.");
      return;
    }
    toast.success("Custom tag deleted.");
    void qc.invalidateQueries({ queryKey: ["product-tags"] });
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
      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={startNew}>
          <Plus className="mr-2 h-4 w-4" aria-hidden />
          Add product
        </Button>
        <Button variant="outline" onClick={() => { setTagsOpen(true); setEditingTag(null); setTagName(""); }}>
          <TagsIcon className="mr-2 h-4 w-4" aria-hidden />
          Manage tags
        </Button>
      </div>

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
              <div className="aspect-[2/3] w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
                {image && (
                  <img
                    src={image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width={1024}
                    height={1536}
                    className="h-full w-full object-contain"
                  />
                )}
              </div>
              <div className="min-w-[10rem] flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {category?.name ?? "No category"} &middot;{" "}
                  {formatPrice(product.price, product.currency)}
                  {product.original_price != null && product.price != null && product.original_price > product.price
                    ? ` (was ${formatPrice(product.original_price, product.currency)})`
                    : ""}
                  {product.unit ? ` / ${product.unit}` : ""} &middot;{" "}
                  {availabilityLabels[product.availability as keyof typeof availabilityLabels] ??
                    product.availability}
                  {product.featured ? " \u00b7 Featured" : ""}
                </p>
                {!!product.tags?.length && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {productTags.filter((tag) => product.tags.includes(tag.slug)).map((tag) => (
                      <span key={tag.id} className="rounded-full border border-primary/15 bg-secondary/60 px-2 py-0.5 text-[10px] font-semibold text-primary">{tag.name}</span>
                    ))}
                  </div>
                )}
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
                <Label htmlFor="p-price">Selling price</Label>
                <Input
                  id="p-price"
                  inputMode="decimal"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value)}
                  className="mt-2"
                  placeholder="3590"
                />
                {errors["price"] && <p className="mt-1.5 text-xs text-destructive">{errors["price"]}</p>}
              </div>
              <div>
                <Label htmlFor="p-original-price">Original price (optional)</Label>
                <Input
                  id="p-original-price"
                  inputMode="decimal"
                  value={form.original_price}
                  onChange={(e) => set("original_price", e.target.value)}
                  className="mt-2"
                  placeholder="8999"
                />
                {errors["original_price"] && <p className="mt-1.5 text-xs text-destructive">{errors["original_price"]}</p>}
                <p className="mt-1 text-xs text-muted-foreground">Shown with a strike-through only when it is greater than the selling price.</p>
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

            <section className="rounded-2xl border border-border p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Label>Product tags</Label>
                  <p className="mt-1 text-xs text-muted-foreground">Choose one or more labels to display on product cards and detail pages.</p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => { setTagsOpen(true); setEditingTag(null); setTagName(""); }}>
                  <TagsIcon className="mr-2 h-3.5 w-3.5" aria-hidden />
                  Manage tags
                </Button>
              </div>
              {productTags.length ? (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {productTags.map((tag) => (
                    <label key={tag.id} className="flex cursor-pointer items-center gap-2 rounded-xl bg-secondary/45 px-3 py-2 text-sm">
                      <Checkbox checked={form.tags.includes(tag.slug)} onCheckedChange={(checked) => toggleProductTag(tag.slug, checked === true)} />
                      <span>{tag.name}</span>
                      {tag.is_preset && <span className="ml-auto text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">Preset</span>}
                    </label>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">No active tags yet. Use Manage tags to add a custom tag.</p>
              )}
            </section>

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
              <div className="flex items-start gap-3 rounded-2xl border border-primary/15 bg-secondary/55 p-4">
                <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-background text-primary">
                  <Upload className="h-4 w-4" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-semibold">Standard image format required</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">
                    Use exactly {PRODUCT_IMAGE_SIZE_LABEL}, JPG/PNG/WebP, under 5 MB. Keep the fruit or pack centered with a clean background. The same portrait format is used in product cards, product details and the homepage spotlight.
                  </p>
                </div>
              </div>
              <Label htmlFor="p-image">Product image (1024 × 1536 px)</Label>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <Input
                  id="p-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
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
              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Uploads are checked for the exact 2:3 portrait dimensions before they are saved. Featured fruit products can also appear in the rotating homepage spotlight; change the image here to update it without editing code.
              </p>
              {form.image_url && (
                <img
                  src={form.image_url}
                  alt=""
                  className="mt-3 aspect-[2/3] w-24 rounded-xl object-contain"
                />
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="p-featured"
                checked={form.featured}
                onCheckedChange={(v) => set("featured", v === true)}
              />
              <Label htmlFor="p-featured">Show in homepage spotlight</Label>
            </div>

            <DialogFooter>
              <Button type="submit" disabled={busy || uploading}>
                {busy ? "Saving\u2026" : "Save product"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={tagsOpen} onOpenChange={setTagsOpen}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Manage product tags</DialogTitle>
          </DialogHeader>
          <form onSubmit={saveTag} className="space-y-3">
            <div>
              <Label htmlFor="tag-name">{editingTag ? "Rename custom tag" : "Create custom tag"}</Label>
              <div className="mt-2 flex gap-2">
                <Input id="tag-name" value={tagName} onChange={(e) => setTagName(e.target.value)} maxLength={48} placeholder="e.g. Summer Special" />
                <Button type="submit" disabled={tagBusy}>{tagBusy ? "Saving…" : editingTag ? "Save" : "Create"}</Button>
              </div>
            </div>
            {editingTag && <Button type="button" variant="ghost" size="sm" onClick={() => { setEditingTag(null); setTagName(""); }}>Cancel rename</Button>}
          </form>
          <div className="space-y-3 pt-2">
            <div>
              <p className="text-sm font-semibold">Preset tags</p>
              <p className="mt-1 text-xs text-muted-foreground">These standard tags are always available and cannot be removed.</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {productTags.filter((tag) => tag.is_preset).map((tag) => (
                  <span key={tag.id} className="rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold">{tag.name}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold">Custom tags</p>
              <div className="mt-2 space-y-2">
                {productTags.filter((tag) => !tag.is_preset).map((tag) => (
                  <div key={tag.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2">
                    <span className="text-sm font-medium">{tag.name}</span>
                    <div className="flex gap-1">
                      <Button type="button" size="sm" variant="ghost" onClick={() => { setEditingTag(tag); setTagName(tag.name); }}>
                        <Pencil className="h-3.5 w-3.5" aria-hidden />
                        <span className="sr-only">Rename {tag.name}</span>
                      </Button>
                      <Button type="button" size="sm" variant="ghost" onClick={() => void removeTag(tag)}>
                        <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        <span className="sr-only">Delete {tag.name}</span>
                      </Button>
                    </div>
                  </div>
                ))}
                {!productTags.some((tag) => !tag.is_preset) && <p className="text-sm text-muted-foreground">No custom tags created yet.</p>}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
