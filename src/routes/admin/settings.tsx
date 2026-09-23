import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { settingsQuery, fallbackSettings, type SiteSettings } from "@/lib/site";

export const Route = createFileRoute("/admin/settings")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Business Settings | AGR \u2014 Agrotech" },
      { name: "description", content: "Update AGR contact details and business information." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Business Settings | AGR \u2014 Agrotech" },
      { property: "og:description", content: "Update AGR contact and business information." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SettingsAdmin,
});

const fields: { key: keyof SiteSettings; label: string; hint?: string; textarea?: boolean }[] = [
  { key: "brand_name", label: "Brand name" },
  { key: "business_description", label: "Business description", textarea: true },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone numbers", hint: "Separate multiple numbers with /" },
  {
    key: "whatsapp",
    label: "WhatsApp number",
    hint: "Include the country code, e.g. 917758055691",
  },
  { key: "address", label: "Address", textarea: true },
  { key: "instagram", label: "Instagram link" },
  { key: "facebook", label: "Facebook link" },
  { key: "site_url", label: "Website address", hint: "e.g. https://www.agr-agrotech.com" },
];

function SettingsAdmin() {
  const qc = useQueryClient();
  const { data } = useQuery(settingsQuery);
  const [form, setForm] = useState<SiteSettings>(fallbackSettings);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase
      .from("site_settings")
      .update({ ...form })
      .eq("id", true);
    setBusy(false);
    if (error) {
      toast.error("Your changes could not be saved. Please try again.");
      return;
    }
    toast.success("Business information updated.");
    void qc.invalidateQueries({ queryKey: ["site-settings"] });
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
                value={form[field.key] ?? ""}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="mt-2 h-11"
              />
            )}
            {field.hint && <p className="mt-1.5 text-xs text-muted-foreground">{field.hint}</p>}
          </div>
        ))}
        <Button type="submit" disabled={busy}>
          {busy ? "Saving\u2026" : "Save changes"}
        </Button>
      </form>
    </AdminShell>
  );
}
