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
- **Product images:** upload a JPG/PNG/WebP (max 5 MB) in the product form. Files are stored in
  the private `product-images` bucket and served through a long-lived link.
- **Availability:** Available / Out of Stock / Coming Soon. Out-of-stock products stay visible
  with a clear badge and no purchase option.
- **Featured products:** tick "Show on the homepage as featured"; use Display order to control
  the sequence.
- **Categories:** Admin → Categories. Deleting a category leaves its products uncategorised.
- **Contact details:** Admin → Settings. Brand name, description, email, phone, WhatsApp,
  address, Instagram, Facebook and website address are stored once and used across the site.

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
