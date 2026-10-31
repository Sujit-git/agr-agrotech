# AGR — Agrotech

A production-ready, read-only product catalog website for AGR — Agrotech, with a single-admin
dashboard for managing products, categories and business details.

There is no customer login, no cart and no payments — enquiries go through WhatsApp and the
contact form.

## Tech choices (and why)

| Piece | Choice | Why |
| --- | --- | --- |
| Framework | TanStack Start (React 19 + Vite) | Server rendering for SEO, file-based routing, one deployable app |
| Styling | Tailwind CSS v4 + shadcn/ui | Small CSS output, consistent design tokens, no heavy UI runtime |
| Data + auth + files | Lovable Cloud (managed Postgres, auth, storage) | Fully managed, free tier to start, no servers, no cron, no maintenance |
| Data fetching | TanStack Query | Caching and refetching with minimal code |

No background jobs, no Redis, no containers, no separate API service. Costs start at zero and
scale with traffic; the only paid items later are a custom domain and, at high volume, database
and storage usage.

## Local development

```bash
npm install
npm run dev
```

The app runs at http://localhost:8080. Backend credentials are injected automatically in Lovable.
Outside Lovable, copy `.env.example` to `.env` and fill in the values.

## Admin

- Sign in at `/admin/login` with the AGR admin email and password.
- The dashboard is at `/admin/dashboard`; visiting it signed out redirects to the login page.
- Only the account holding the `admin` role can write data — this is enforced by database
  policies on the server, not just in the browser.

### Creating or changing the admin user

Open Cloud → Users in Lovable to add a user or reset a password, then add a row to `user_roles`
with that user's id and role `admin`. Public sign-up is disabled, so no one else can register.

### Everyday tasks

- **Add / edit / delete a product:** Admin → Products → *Add product* or *Edit*. Name and
  category are required; price must be a number. Changes appear on the public site immediately.
- **Change a price:** edit the product, update the Price field, save.
- **Product images:** upload a JPG/PNG/WebP at exactly 1024 × 1536 px (portrait, 2:3; max 5 MB) in the product form. Files are stored in
  the private `product-images` bucket and served through a long-lived link.
- **Availability:** Available / Out of Stock / Coming Soon. Out-of-stock products stay visible
  with a clear badge and no purchase option.
- **Featured products:** tick "Show on the homepage as featured"; use Display order to control
  the sequence.
- **Categories:** Admin → Categories. Deleting a category leaves its products uncategorised.
- **Contact details:** Admin → Settings. Brand name, description, enquiry email, phone, WhatsApp,
  address, Instagram, Facebook and website address are stored once and used across the site. The enquiry email controls the displayed email address, mail links and contact-form recipient.

### Contact-form email delivery (Gmail SMTP; no domain DNS verification)

The contact form sends enquiries directly from the website through the Gmail SMTP account configured on Netlify. The recipient is read from Admin → Settings → **Enquiry email** (initially `agragrotech@gmail.com`). Visitors do not need to open an email app or WhatsApp.

1. In the Google account for `agragrotech@gmail.com`, enable 2-Step Verification and create a Google **App Password** for the website. Use that app password, not the normal Gmail password.
2. In Netlify → Site configuration → Environment variables, add `GMAIL_SMTP_USER=agragrotech@gmail.com` and `GMAIL_SMTP_APP_PASSWORD` with the generated app password.
3. Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` (these can match `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`) so the function can read the current recipient from `site_settings`. Set `CONTACT_EMAIL=agragrotech@gmail.com` as a fallback.
4. Deploy the site, then set the destination address in Admin → Settings → **Enquiry email**.

No Resend account or extra DNS records are required. The email is sent from the authenticated Gmail account; the visitor's entered email is included in the message and used as **Reply-To**. The site cannot safely impersonate an arbitrary visitor address as the authenticated From address. Keep the app password only in Netlify environment variables and never commit it to GitHub.


## Backup / export

Admin → Dashboard → *Export products* downloads a JSON file with all categories and products.
Keep a copy before bulk edits. The database itself is backed up by the managed platform.

## Deployment

Publish from Lovable, or build and deploy anywhere that serves a Node/edge app:

```bash
npm run build
```

The output works on Vercel, Netlify and Cloudflare. Set the environment variables from
`.env.example` in the host's dashboard. No localhost URLs are hardcoded.

### Custom domain

Add the domain (e.g. `www.agr-agrotech.com`) in Lovable → Settings → Domains and point the DNS
records it shows at your registrar. Then set `PUBLIC_SITE_URL` and the Settings → Website address
field to the new domain so canonical links and the sitemap use it.

## SEO

Per-page titles, descriptions and Open Graph tags, semantic headings, alt text, slugged URLs
(`/products/vermicompost`, `/product/freeze-dried-strawberry`), `robots.txt` and a generated
`/sitemap.xml`.

## Content notes

The About page and contact details reflect AGR's supplied company information. Sample products,
prices, images and the legal pages still contain placeholders; replace those with verified AGR
content before launch. The first supplied contact number is currently used for WhatsApp; confirm
which number accepts WhatsApp enquiries.

## Future e-commerce

Products, categories and settings live in a relational database with clean separation between
data access (`src/lib`) and UI. Cart, accounts, orders and payments can be added later as new
tables and routes without rebuilding the catalog.


## Product merchandising (admin)

Admin → Products supports product images at exactly 1024 × 1536 px, selling price, optional original price, spotlight inclusion and reusable product tags. Validated uploads are re-encoded to high-quality WebP for smaller page transfers while preserving the portrait master dimensions. Original price is shown with a strike-through and discount percentage only when it is greater than the selling price. Equal prices display as a normal price with no discount badge.

The product tag presets are: New Arrival, Best Seller, Highly Ordered, Customer Favourite, Trending and Limited Edition. Admins can also create, rename and delete custom tags, then assign multiple tags to a product. Empty tag assignments do not render a badge.

Admin → Categories also supports a homepage spotlight toggle. The homepage spotlight includes products explicitly featured on the product record or belonging to a featured category. A product can be explicitly hidden to exclude it even when its category is featured. Turning off both product and category spotlight flags removes the spotlight section when no eligible products remain.

Product WhatsApp enquiries include a direct URL to the current product page. Set Admin → Settings → Website address to the canonical site origin (for example, `https://fruitly.co.in`) so messages use the production domain.

### Our Story image selection (no schema migration)

Admin → Settings provides three product selectors for the Our Story collage. Each selector references an existing product slug and renders that product's current main image, so changing the image in Admin → Products automatically updates the Our Story page. The selection list and recommended 1024 × 1536 px (2:3 portrait) artwork guidance are shown in the Admin UI.

To avoid altering the Supabase schema, the three slugs are stored as a versioned HTML-comment metadata marker appended to the existing `site_settings.business_description` text. The application strips this marker in `settingsQuery`, so visitors and the business-description editor continue to see only the normal description. No SQL or database migration is needed for this feature.

### Required database migration

Before testing the new admin fields, apply `drizzle/migrations/0005_product_management_enhancements.sql` in the Supabase SQL Editor (or through your normal migration process). It adds category spotlight, original prices, product tag assignments and the preset/custom `product_tags` table with admin-only write policies. The migration is additive and does not delete existing catalogue content.

After applying the migration, reload the Admin → Products and Admin → Categories pages so the schema-backed controls can load.
