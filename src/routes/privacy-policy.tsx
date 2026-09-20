import { createFileRoute } from "@tanstack/react-router";

import { SiteLayout } from "@/components/site/SiteLayout";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | AGR \u2014 Agrotech" },
      {
        name: "description",
        content: "How AGR \u2014 Agrotech handles information shared through this website.",
      },
      { property: "og:title", content: "Privacy Policy | AGR \u2014 Agrotech" },
      {
        property: "og:description",
        content: "How AGR \u2014 Agrotech handles information shared through this website.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Privacy,
});

const sections = [
  { title: "Information we collect", body: "[Add the information AGR collects here]" },
  { title: "How we use information", body: "[Add how AGR uses the information here]" },
  { title: "Sharing information", body: "[Add information-sharing details here]" },
  { title: "Data retention", body: "[Add retention period here]" },
  { title: "Your choices", body: "[Add how visitors can request changes or deletion here]" },
  { title: "Contact", body: "[Add the contact point for privacy questions here]" },
];

function Privacy() {
  return (
    <SiteLayout>
      <div className="container-page max-w-3xl py-14 md:py-20">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 font-display text-4xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          This page is a placeholder structure. The final policy text will be added by AGR.
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
