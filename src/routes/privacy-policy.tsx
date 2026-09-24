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
  {
    title: "Who we are",
    body: "This website is operated by AGR Agrotech Pvt. Ltd., Gat No. 89, Jadhav Nagar, Phaltan–Uplave Road, Tahasil Phaltan, District Satara, Maharashtra, India – 412355. This policy explains how we handle information you share with us through this website.",
  },
  {
    title: "Information we collect",
    body: "We do not require you to create an account to use this website. We only collect the details you choose to send us through the contact form — your name, email address, phone number and message. If you contact us via WhatsApp, phone or email, we receive the details you share through those channels.",
  },
  {
    title: "How we use information",
    body: "We use your information only to respond to your enquiry, share product details and quotations, and communicate with you about your request. We do not use it for unrelated purposes and we do not sell it.",
  },
  {
    title: "Sharing information",
    body: "We do not sell, rent or trade your personal information. It is accessible only to authorised AGR Agrotech staff and to trusted service providers who host and operate this website on our behalf, or where disclosure is required by law.",
  },
  {
    title: "Cookies and analytics",
    body: "This website does not use advertising or tracking cookies. Only essential browser storage needed for the website to function may be used.",
  },
  {
    title: "Data security and retention",
    body: "We use reasonable technical and organisational measures to protect your information. Enquiry details are kept only as long as needed to respond to you and for legitimate business or legal record-keeping, after which they are deleted.",
  },
  {
    title: "Your choices",
    body: "You may ask us to access, correct or delete the personal information you have shared with us at any time by contacting us using the details below.",
  },
  {
    title: "Changes to this policy",
    body: "We may update this Privacy Policy from time to time. Any changes will be posted on this page.",
  },
  {
    title: "Contact",
    body: "For privacy questions or requests, email agragrotech@gmail.com or call 7758055691 / 9423861690.",
  },
];

function Privacy() {
  return (
    <SiteLayout>
      <div className="container-page max-w-3xl py-14 md:py-20">
        <p className="eyebrow">Legal</p>
        <h1 className="mt-3 font-display text-4xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Your privacy matters to us. This policy describes how AGR Agrotech handles your information.
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
