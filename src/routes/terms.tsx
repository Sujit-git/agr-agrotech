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
  {
    title: "About these terms",
    body: "This website is operated by AGR Agrotech Pvt. Ltd. (GSTN: 27ABECA3291P1Z6), Gat No. 89, Jadhav Nagar, Phaltan–Uplave Road, Tahasil Phaltan, District Satara, Maharashtra, India – 412355. By accessing or using this website, you agree to these Terms & Conditions. If you do not agree, please do not use the website.",
  },
  {
    title: "Use of this website",
    body: "This website is a product catalogue that presents AGR Agrotech's products and business. You may browse it for personal or business information purposes. You agree not to misuse the website, attempt unauthorised access to any part of it, interfere with its operation, or submit false, unlawful or harmful information through our forms.",
  },
  {
    title: "Product information",
    body: "We make reasonable efforts to keep product descriptions, images, pack sizes and availability accurate and up to date. Product images are for illustration and the actual product or packaging may vary slightly. Information on this website is general in nature and should not be treated as professional, medical or agronomic advice.",
  },
  {
    title: "Pricing",
    body: "Prices shown are indicative, in Indian Rupees (INR), and may change without prior notice. Applicable taxes, packaging, transport and delivery charges, and bulk or trade pricing are confirmed separately at the time of enquiry.",
  },
  {
    title: "Enquiries and orders",
    body: "This website does not process online payments or orders. Submitting an enquiry via the contact form, WhatsApp, phone or email does not create a binding contract. Any order is confirmed only when AGR Agrotech accepts it in writing, including agreed price, quantity, payment and delivery terms.",
  },
  {
    title: "Intellectual property",
    body: "All content on this website, including the AGR Agrotech name, logo, text, images and design, belongs to AGR Agrotech Pvt. Ltd. or its licensors. You may not copy, reproduce, modify or use it for commercial purposes without our prior written permission.",
  },
  {
    title: "Third-party links",
    body: "This website may link to third-party services such as WhatsApp, Instagram or Facebook. We are not responsible for the content, policies or practices of those services, and your use of them is governed by their own terms.",
  },
  {
    title: "Limitation of liability",
    body: "The website is provided on an \"as is\" and \"as available\" basis. To the extent permitted by law, AGR Agrotech is not liable for any indirect or consequential loss arising from the use of, or inability to use, this website or reliance on its content.",
  },
  {
    title: "Changes to these terms",
    body: "We may update these Terms & Conditions from time to time. The updated version will be posted on this page and applies from the date it is published.",
  },
  {
    title: "Governing law and jurisdiction",
    body: "These terms are governed by the laws of India. Any dispute arising from them is subject to the exclusive jurisdiction of the courts in Satara, Maharashtra.",
  },
  {
    title: "Contact",
    body: "For questions about these terms, contact us at agragrotech@gmail.com or call 7758055691 / 9423861690.",
  },
];

function Terms() {
  return (
    <SiteLayout>
      <div className="container-page max-w-3xl py-14 md:py-20">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 font-display text-4xl">Terms &amp; Conditions</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Please read these terms carefully before using the AGR Agrotech website.
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
