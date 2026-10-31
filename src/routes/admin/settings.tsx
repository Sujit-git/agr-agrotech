import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { productsQuery, productImage } from "@/lib/catalog";
import {
  settingsQuery,
  fallbackSettings,
  encodeOurStoryProductSelections,
  type CustomerReview,
  type SiteSettings,
} from "@/lib/site";

export const Route = createFileRoute("/admin/settings")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Business Settings | AGR \u2014 Agrotech" },
      { name: "description", content: "Update Fruitly website settings and customer feedback." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Business Settings | AGR \u2014 Agrotech" },
      { property: "og:description", content: "Update Fruitly settings and approved customer feedback." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsAdmin,
});

type EditableSiteSettingsKey = Exclude<keyof SiteSettings, "our_story_product_slugs">;

const fields: { key: EditableSiteSettingsKey; label: string; hint?: string; textarea?: boolean }[] = [
  { key: "brand_name", label: "Brand name" },
  { key: "business_description", label: "Business description", textarea: true },
  { key: "email", label: "Enquiry email", hint: "Email address that receives website contact-form enquiries. You can change it here anytime." },
  { key: "phone", label: "Phone numbers", hint: "Separate multiple numbers with /" },
  {
    key: "whatsapp",
    label: "WhatsApp number",
    hint: "Include the country code, e.g. 917758055691",
  },
  { key: "address", label: "Address", textarea: true },
  { key: "instagram", label: "Instagram link" },
  { key: "facebook", label: "Facebook link" },
  { key: "site_url", label: "Website address", hint: "e.g. https://fruitly.co.in" },
];

type ReviewDraft = Pick<CustomerReview, "id" | "name" | "quote" | "product" | "rating" | "is_published" | "verified_buyer">;

function SettingsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const { data: products = [] } = useQuery(productsQuery);
  const [form, setForm] = useState<SiteSettings>(fallbackSettings);
  const [busy, setBusy] = useState(false);
  const {
    data: reviews = [],
    isLoading: reviewsLoading,
    isError: reviewsError,
  } = useQuery({
    queryKey: ["customer-reviews-admin"],
    queryFn: async (): Promise<CustomerReview[]> => {
      const { data, error } = await supabase
        .from("customer_reviews")
        .select("id,name,quote,product,rating,sort_order,is_published,verified_buyer,created_at,updated_at")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as CustomerReview[];
    },
  });
  const [reviewDrafts, setReviewDrafts] = useState<ReviewDraft[]>([]);
  const [reviewBusy, setReviewBusy] = useState<string | null>(null);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  useEffect(() => {
    setReviewDrafts(reviews.map((review) => ({
      id: review.id,
      name: review.name,
      quote: review.quote,
      product: review.product,
      rating: review.rating,
      is_published: review.is_published,
    })));
  }, [reviews]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = form.email?.trim() ?? "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Enter a valid enquiry email address.");
      return;
    }
    const nextForm = { ...form, email };
    setForm(nextForm);
    const { our_story_product_slugs, ...databaseFields } = nextForm;
    const payload = {
      ...databaseFields,
      business_description: encodeOurStoryProductSelections(
        databaseFields.business_description,
        our_story_product_slugs,
      ),
    };
    setBusy(true);
    const { error } = await supabase
      .from("site_settings")
      .update(payload)
      .eq("id", true);
    setBusy(false);
    if (error) {
      toast.error("Your changes could not be saved. Please try again.");
      return;
    }
    toast.success("Business information updated.");
    void qc.invalidateQueries({ queryKey: ["site-settings"] });
  };

  function updateReviewDraft<K extends keyof ReviewDraft>(
    id: string,
    key: K,
    value: ReviewDraft[K],
  ) {
    setReviewDrafts((current) =>
      current.map((review) => (review.id === id ? { ...review, [key]: value } : review)),
    );
  }

  const saveReview = async (review: ReviewDraft) => {
    const quote = review.quote.trim();
    if (review.is_published && (quote.length < 8 || review.rating < 1 || review.rating > 5)) {
      toast.error("To publish a review, add the customer's approved words and actual 1-5 star rating.");
      return;
    }
    setReviewBusy(review.id);
    const { error } = await supabase
      .from("customer_reviews")
      .update({
        quote,
        product: review.product?.trim() || null,
        rating: review.rating,
        is_published: review.is_published,
        verified_buyer: review.verified_buyer,
      })
      .eq("id", review.id);
    setReviewBusy(null);
    if (error) {
      toast.error("The customer feedback could not be saved. Please try again.");
      return;
    }
    toast.success(review.is_published ? "Customer feedback published." : "Customer feedback saved as a draft.");
    void qc.invalidateQueries({ queryKey: ["customer-reviews-admin"] });
    void qc.invalidateQueries({ queryKey: ["customer-reviews"] });
  };

  return (
    <AdminShell title="Business settings">
      <form onSubmit={save} className="max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-6">
        {fields.map((field) => (
          <div key={field.key}>
            <Label htmlFor={field.key}>{field.label}</Label>
            {field.textarea ? (
              <Textarea
                id={field.key}
                rows={3}
                value={form[field.key] ?? ""}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="mt-2"
              />
            ) : (
              <Input
                id={field.key}
                type={field.key === "email" ? "email" : "text"}
                autoComplete={field.key === "email" ? "email" : undefined}
                value={form[field.key] ?? ""}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="mt-2 h-11"
              />
            )}
            {field.hint && <p className="mt-1.5 text-xs text-muted-foreground">{field.hint}</p>}
          </div>
        ))}

        <section className="space-y-4 rounded-2xl border border-border bg-background p-4 sm:p-5" aria-labelledby="our-story-images-heading">
          <div>
            <h2 id="our-story-images-heading" className="font-display text-xl">Our Story images</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Choose an existing product's main image for each position. The Our Story page will use that product's current main image, so replacing it under Products updates this section automatically.
            </p>
            <p className="mt-2 text-xs font-medium text-muted-foreground">
              Recommended artwork: 1024 × 1536 px, portrait 2:3, JPG/PNG/WebP, under 5 MB. Product uploads are validated and optimized to WebP.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: "Large hero image", description: "Main image on Our Story" },
              { label: "Top side image", description: "Upper supporting image" },
              { label: "Bottom side image", description: "Lower supporting image" },
            ].map((slot, index) => {
              const selectedSlug = form.our_story_product_slugs[index] ?? "";
              const selectedProduct = products.find((product) => product.slug === selectedSlug);
              const selectedImage = selectedProduct ? productImage(selectedProduct) : null;

              return (
                <div key={slot.label} className="min-w-0 space-y-2 rounded-xl border border-border p-3">
                  <div>
                    <Label htmlFor={`our-story-image-${index}`}>{slot.label}</Label>
                    <p className="mt-1 text-xs text-muted-foreground">{slot.description}</p>
                  </div>
                  <select
                    id={`our-story-image-${index}`}
                    value={selectedSlug}
                    onChange={(e) =>
                      setForm((current) => ({
                        ...current,
                        our_story_product_slugs: current.our_story_product_slugs.map((slug, slotIndex) =>
                          slotIndex === index ? e.target.value : slug,
                        ),
                      }))
                    }
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {products.filter((product) => productImage(product)).map((product) => (
                      <option key={product.id} value={product.slug}>{product.name}</option>
                    ))}
                  </select>
                  {selectedImage ? (
                    <img
                      src={selectedImage}
                      alt={selectedProduct?.name ?? "Selected Fruitly product"}
                      width={1024}
                      height={1536}
                      loading="lazy"
                      decoding="async"
                      className="mx-auto aspect-[2/3] max-h-40 w-full rounded-lg bg-[#f8f4e9] object-contain p-2"
                    />
                  ) : (
                    <div className="flex aspect-[2/3] max-h-40 items-center justify-center rounded-lg bg-muted text-xs text-muted-foreground">
                      No product image selected
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <Button type="submit" disabled={busy}>
          {busy ? "Saving\u2026" : "Save changes"}
        </Button>
      </form>

      <section className="mt-8 max-w-4xl space-y-4" aria-labelledby="customer-feedback-heading">
        <div>
          <h2 id="customer-feedback-heading" className="font-display text-2xl">Customer feedback</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Edit a review, choose its rating, and select which reviews appear on the homepage. The Verified badge is a simple admin-controlled label.
          </p>
        </div>

        {reviewsError ? (
          <p className="rounded-2xl border border-dashed border-border bg-card p-5 text-sm leading-6 text-muted-foreground">
            The feedback manager is waiting for the customer_reviews database migration to be applied. Your business settings above remain available.
          </p>
        ) : reviewsLoading ? (
          <p className="rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground">Loading customer feedback…</p>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {reviewDrafts.map((review) => (
              <article key={review.id} className="space-y-4 rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{review.name}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">Homepage review draft</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-1 text-[0.68rem] font-semibold ${review.is_published ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                    {review.is_published ? "Published" : "Draft"}
                  </span>
                </div>

                <div>
                  <Label htmlFor={`review-quote-${review.id}`}>Approved customer feedback</Label>
                  <Textarea
                    id={`review-quote-${review.id}`}
                    rows={3}
                    maxLength={1000}
                    value={review.quote}
                    onChange={(e) => updateReviewDraft(review.id, "quote", e.target.value)}
                    placeholder="Paste the customer's real feedback here…"
                    className="mt-2"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">{review.quote.length}/1000 characters</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <Label htmlFor={`review-product-${review.id}`}>Product (optional)</Label>
                    <Input
                      id={`review-product-${review.id}`}
                      value={review.product ?? ""}
                      onChange={(e) => updateReviewDraft(review.id, "product", e.target.value)}
                      placeholder="e.g. Jamun Cubes"
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`review-rating-${review.id}`}>Customer's rating</Label>
                    <select
                      id={`review-rating-${review.id}`}
                      value={String(review.rating)}
                      onChange={(e) => updateReviewDraft(review.id, "rating", Number(e.target.value))}
                      className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    >
                      <option value="0">Choose actual rating</option>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>{rating} {rating === 1 ? "star" : "stars"}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-start gap-2 rounded-xl bg-secondary/45 p-3">
                  <Checkbox
                    id={`review-verified-${review.id}`}
                    checked={review.verified_buyer}
                    onCheckedChange={(checked) => updateReviewDraft(review.id, "verified_buyer", checked === true)}
                  />
                  <div>
                    <Label htmlFor={`review-verified-${review.id}`}>Verified badge</Label>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">Show the Verified badge on this review.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id={`review-publish-${review.id}`}
                      checked={review.is_published}
                      onCheckedChange={(checked) => updateReviewDraft(review.id, "is_published", checked === true)}
                    />
                    <Label htmlFor={`review-publish-${review.id}`}>Publish on homepage</Label>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    disabled={reviewBusy === review.id}
                    onClick={() => void saveReview(review)}
                  >
                    {reviewBusy === review.id ? "Saving…" : "Save feedback"}
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <ChangePasswordCard />
    </AdminShell>
  );
}

function ChangePasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next.length < 8) {
      toast.error("Your new password must be at least 8 characters long.");
      return;
    }
    if (next !== confirm) {
      toast.error("The new passwords do not match. Please re-enter them.");
      return;
    }
    setBusy(true);
    const { error } = await supabase.auth.updateUser({
      password: next,
      current_password: current,
    });
    setBusy(false);
    if (error) {
      toast.error(
        "Your password could not be changed. Please check your current password and try again.",
      );
      return;
    }
    toast.success("Your admin password has been changed.");
    setCurrent("");
    setNext("");
    setConfirm("");
  };

  return (
    <form
      onSubmit={changePassword}
      className="mt-8 max-w-2xl space-y-5 rounded-2xl border border-border bg-card p-6"
    >
      <div>
        <h2 className="text-lg font-semibold">Change admin password</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose a strong password you do not use anywhere else.
        </p>
      </div>
      <div>
        <Label htmlFor="current-password">Current password</Label>
        <Input
          id="current-password"
          type="password"
          autoComplete="current-password"
          required
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="mt-2 h-11"
        />
      </div>
      <div>
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={next}
          onChange={(e) => setNext(e.target.value)}
          className="mt-2 h-11"
        />
      </div>
      <div>
        <Label htmlFor="confirm-password">Confirm new password</Label>
        <Input
          id="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-2 h-11"
        />
      </div>
      <Button type="submit" disabled={busy}>
        {busy ? "Updating…" : "Change password"}
      </Button>
    </form>
  );
}
