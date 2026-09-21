import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { categoriesQuery, productsQuery, type Category } from "@/lib/catalog";
import { slugify } from "@/lib/uploads";

export const Route = createFileRoute("/admin/categories")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Manage Categories | AGR \u2014 Agrotech" },
      { name: "description", content: "Add, edit and remove AGR product categories." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Manage Categories | AGR \u2014 Agrotech" },
      { property: "og:description", content: "Add, edit and remove AGR product categories." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CategoriesAdmin,
});

const emptyForm = { name: "", slug: "", description: "", sort_order: "0" };

function CategoriesAdmin() {
  const qc = useQueryClient();
  const { data: categories = [] } = useQuery(categoriesQuery);
  const { data: products = [] } = useQuery(productsQuery);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  const startNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setOpen(true);
  };

  const startEdit = (category: Category) => {
    setEditing(category);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description ?? "",
      sort_order: String(category.sort_order),
    });
    setOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.error("A category name is required.");
      return;
    }
    setBusy(true);
    const payload = {
      name: form.name.trim(),
      slug: slugify(form.slug || form.name),
      description: form.description.trim() || null,
      sort_order: Number(form.sort_order) || 0,
    };

    const { error } = editing
      ? await supabase.from("categories").update(payload).eq("id", editing.id)
      : await supabase.from("categories").insert(payload);
    setBusy(false);

    if (error) {
      toast.error(
        error.code === "23505"
          ? "Another category already uses that web address."
          : "The category could not be saved. Please try again.",
      );
      return;
    }
    toast.success(editing ? "Category updated." : "Category added.");
    setOpen(false);
    void qc.invalidateQueries({ queryKey: ["categories"] });
  };

  const remove = async (category: Category) => {
    const count = products.filter((p) => p.category_id === category.id).length;
    const message = count
      ? `Delete "${category.name}"? ${count} product(s) will be left without a category.`
      : `Delete "${category.name}"?`;
    if (!window.confirm(message)) return;

    const { error } = await supabase.from("categories").delete().eq("id", category.id);
    if (error) {
      toast.error("The category could not be deleted.");
      return;
    }
    toast.success("Category deleted.");
    void qc.invalidateQueries({ queryKey: ["categories"] });
    void qc.invalidateQueries({ queryKey: ["products"] });
  };

  return (
    <AdminShell title="Categories">
      <Button onClick={startNew}>
        <Plus className="mr-2 h-4 w-4" aria-hidden />
        Add category
      </Button>

      <div className="mt-6 space-y-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-card p-5"
          >
            <div>
              <p className="font-medium">{category.name}</p>
              <p className="text-sm text-muted-foreground">
                /products/{category.slug} &middot;{" "}
                {products.filter((p) => p.category_id === category.id).length} products
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => startEdit(category)}>
                <Pencil className="mr-2 h-3.5 w-3.5" aria-hidden />
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => void remove(category)}>
                <Trash2 className="mr-2 h-3.5 w-3.5" aria-hidden />
                Delete
              </Button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            No categories yet. Add your first one to start organising products.
          </p>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4">
            <div>
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2"
                required
              />
            </div>
            <div>
              <Label htmlFor="cat-slug">Web address (optional)</Label>
              <Input
                id="cat-slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="auto-generated from the name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="cat-order">Display order</Label>
              <Input
                id="cat-order"
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
                className="mt-2"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={busy}>
                {busy ? "Saving\u2026" : "Save category"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminShell>
  );
}
