import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | AGR \u2014 Agrotech" },
      {
        name: "description",
        content: "Terms and conditions for using the AGR \u2014 Agrotech website and product catalogue.",
      },
      { property: "og:title", content: "Terms & Conditions | AGR \u2014 Agrotech" },
      {
        property: "og:description",
        content: "Terms and conditions for the AGR \u2014 Agrotech website.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Terms,
});

const sections = [
  { title: "Use of this website", body: "[Add website usage terms here]" },
  { title: "Product information", body: "[Add product information disclaimer here]" },
  { title: "Pricing", body: "[Add pricing terms here]" },
  { title: "Enquiries and orders", body: "[Add enquiry and order terms here]" },
  { title: "Intellectual property", body: "[Add intellectual property terms here]" },
  { title: "Governing law", body: "[Add governing law here]" },
];

function Terms() {
  return (
    <SiteLayout>
      <div className="container-page max-w-3xl py-14 md:py-20">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 font-display text-4xl">Terms &amp; Conditions</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This page is a placeholder structure. The final terms will be added by AGR.
        </p>
        <div className="mt-10 space-y-8">
          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="font-display text-xl">{section.title}</h2>
              <p className="mt-2 leading-relaxed text-muted-foreground">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </SiteLayout>
  );
}
