# Fruitly — AGR Agrotech

Fruitly is the consumer-facing fruit-snack brand from **AGR Agrotech Pvt. Ltd.** This repository contains the Fruitly company website and product catalogue, together with a password-protected admin area for maintaining catalogue content and business settings.

The public website is a **catalogue and enquiry site**, not an online store: it has no customer checkout, shopping cart, or payment flow. Visitors can explore products and contact the Fruitly team through the enquiry form or WhatsApp.

## Website capabilities

### Public website
- Responsive Fruitly homepage, product catalogue, category pages, product detail pages, Our Story, and Contact pages.
- Product availability labels: Available, Out of Stock, and Coming Soon.
- Product detail pages with a primary image and an optional second product image.
- Product pricing, optional compare-at/original price, discount display, key features, storage and usage information.
- Homepage product spotlight, with eligibility controlled by product and category settings.
- Product tags such as New Arrival, Best Seller, Highly Ordered, Customer Favourite, Trending, and Limited Edition.
- Product-specific WhatsApp enquiry links.
- Contact form with server-side email delivery.
- Search-engine metadata, Open Graph metadata, robots.txt, and sitemap support.

### Admin area
- Admin sign-in at `/admin/login`; the dashboard is at `/admin/dashboard`.
- Manage products, categories, product images, pricing, availability, spotlight visibility, and product tags.
- Manage business details and website contact information through Admin → Settings.
- Export catalogue data from the admin dashboard.

Admin access is intended for authorized users only. Access to protected data and write operations is enforced through the configured Supabase authentication and database policies. Do not enable public sign-up or grant admin access to an untrusted account.

## Technology

| Area | Technology |
| --- | --- |
| Application | React 19, TanStack Start, TanStack Router |
| Build tooling | Vite 8, TypeScript |
| Styling and UI | Tailwind CSS v4, shadcn/ui, Radix UI |
| Server data and authentication | Supabase |
| Database | PostgreSQL |
| Client-side data fetching | TanStack Query |
| Database schema and migrations | Drizzle ORM / Drizzle Kit |
| Hosting and server functions | Netlify |

The Vite configuration uses `@lovable.dev/vite-tanstack-config` for the project's TanStack Start integration. Keep that configuration in place unless a replacement is deliberately tested; the package supplies several plugins and aliases used by the application.

## Getting started

### Requirements
- Node.js compatible with the versions used by the project and its Netlify build environment.
- npm.
- Access to the project's Supabase environment for features that read or write live catalogue data.

### Install and run locally

```bash
npm install
cp .env.example .env
# Add the appropriate local/development values to .env
npm run dev
```

The development server URL is printed by Vite in the terminal.

### Useful commands

```bash
npm run dev       # Start the local development server
npm run build     # Create a production build
npm run preview   # Preview the production build locally
npm run lint      # Run ESLint
```

Do not run `npm run format` as a routine validation command: it applies Prettier formatting across the repository and can modify files.

## Environment variables

Use `.env.example` as the reference for the variables used by the application. Create a local `.env` for development and configure production values in Netlify's environment-variable settings.

| Variable | Purpose |
| --- | --- |
| `VITE_SUPABASE_URL` | Supabase project URL used by the browser application. |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Public/publishable Supabase key used by the browser application. |
| `SUPABASE_URL` | Supabase project URL used by server-side functions. |
| `SUPABASE_ANON_KEY` | Supabase public/anonymous key used by server-side functions where required. |
| `DATABASE_URL` | Server-side PostgreSQL connection string, where required by the runtime. |
| `AUTH_SECRET` | Server-side authentication secret. |
| `ADMIN_EMAIL` | Configured admin email reference. |
| `STORAGE_BUCKET` | Supabase Storage bucket for product images; the example uses `product-images`. |
| `WHATSAPP_NUMBER` | WhatsApp destination number, including country code and without spaces or a leading plus sign. |
| `GMAIL_SMTP_USER` | Gmail account used to send contact-form messages. |
| `GMAIL_SMTP_APP_PASSWORD` | Google App Password for that Gmail account. |
| `CONTACT_EMAIL` | Fallback contact-form recipient. |
| `PUBLIC_SITE_URL` | Canonical public website URL used for links and sitemap generation. |
| `LOVABLE_DB_MIGRATION_URL` | PostgreSQL connection string used by Drizzle Kit when generating or applying migrations through the configured workflow. |

**Security**
- Never commit `.env`, service-role keys, database passwords, SMTP app passwords, or other private credentials.
- Values prefixed with `VITE_` are exposed to the browser bundle. Only use public/publishable values for these variables.
- Keep server-only credentials in local environment files or the hosting provider's protected environment-variable settings.
- Do not paste production secrets into issues, pull requests, screenshots, or chat messages.

## Supabase and database migrations

The application uses Supabase for its database, authentication, and product-image storage. SQL migration files are maintained in `drizzle/migrations/`; the Drizzle schema is in `drizzle/schema.ts`.

Database migrations are separate from the frontend build and deployment. **Deploying the website does not automatically apply SQL migrations.** Review and apply the required migration to the intended Supabase project using the team's approved migration process before relying on features that require its schema changes.

### Product-management enhancement migration

The product spotlight, original/compare-at pricing, and reusable product-tag controls require:

`drizzle/migrations/0005_product_management_enhancements.sql`

This migration adds category spotlight configuration, product original-price and tag fields, product spotlight exclusion, the `product_tags` table, and its associated policies and triggers.

Before applying it:
1. Confirm the target Supabase project is the intended environment.
2. Review the SQL and confirm the migration has not already been applied.
3. Take or verify an appropriate database backup.
4. Apply the migration through the approved database workflow.
5. Verify the new columns and `product_tags` table, then test the relevant admin controls.

Do not repeatedly run migrations or make manual schema edits to troubleshoot a website deployment. Diagnose frontend build/deploy issues separately from database issues.

## Product content and images

- Products and categories are maintained through the admin area and stored in Supabase.
- Product records support a primary image and an optional additional image. The primary image is used by default; the second image is available on the product detail view when present.
- The product form is designed for portrait product artwork. Follow the dimensions and file-size validation shown in the current admin upload interface.
- The application can use bundled Fruitly product artwork as a fallback when a product does not have an uploaded image.
- Approved Our Story imagery is maintained in source control under `public/our-story`, rather than selected through Admin → Settings.
- Keep product names, ingredients, nutrition information, claims, prices, and regulatory details aligned with approved product and packaging information. Do not publish unverified health claims or certifications.

## Contact form email delivery

The contact form uses the Netlify server-side function and Gmail SMTP configuration documented in `.env.example`.

For production:
1. Use a dedicated/approved Gmail account for website enquiries.
2. Enable Google 2-Step Verification and generate a Google **App Password** for the account.
3. Set `GMAIL_SMTP_USER` and `GMAIL_SMTP_APP_PASSWORD` in Netlify environment variables.
4. Set `SUPABASE_URL` and `SUPABASE_ANON_KEY` so the server function can read the configured recipient from `site_settings`.
5. Set `CONTACT_EMAIL` as a fallback recipient.
6. Deploy and submit a test enquiry. Confirm that the message reaches the address configured in Admin → Settings → **Enquiry email**.

Use the Google App Password, not the normal Gmail account password. Keep it out of source control. The visitor's email is included in the message and used as Reply-To; the website should not impersonate a visitor as the authenticated sender.

## Netlify deployment

The repository includes `netlify.toml` with the production publish directory and server-function directory.

| Setting | Value |
| --- | --- |
| Base directory | Repository root |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` |
| Production branch | `main` |

Typical deployment flow:
1. Connect the GitHub repository `Sujit-git/agr-agrotech` to the Netlify site.
2. Use `main` as the production branch.
3. Confirm the build settings above and configure required environment variables.
4. Trigger a deploy or merge a reviewed change into `main`.
5. Check the deploy log and confirm the new deploy is **Published** before treating the change as live.

The publish directory is also defined in `netlify.toml`. Keep repository configuration and Netlify UI settings aligned. A skipped deploy is not the same as a failed build; inspect the deploy's skip reason and the status of the newer deploy before changing application code.

## Project structure

```text
.
├── drizzle/
│   ├── migrations/       # SQL database migrations
│   └── schema.ts         # Drizzle database schema
├── netlify/
│   └── functions/        # Netlify server-side functions
├── public/               # Static assets, product artwork, robots/sitemap assets
│   ├── fruitly-products/
│   └── our-story/
├── src/
│   ├── components/       # Shared UI and site components
│   ├── integrations/     # Supabase client and generated integration types
│   ├── lib/              # Catalogue queries and application utilities
│   ├── routes/           # TanStack file-based routes
│   └── server.ts         # TanStack Start server entry wrapper
├── .env.example          # Environment-variable reference
├── netlify.toml          # Netlify build and function configuration
├── package.json
└── vite.config.ts
```

## Working safely

- Create feature branches and open pull requests into `main`; avoid direct commits to the production branch.
- Keep pull requests focused and review the changed-file list before merging.
- Do not include secrets, generated build output, or unrelated formatting changes.
- For database-related changes, include the migration and explain its impact in the pull request. Never assume a frontend code change has updated the live Supabase schema.
- After merging, verify the GitHub commit, Netlify deploy status, public website, and any affected admin workflow.
