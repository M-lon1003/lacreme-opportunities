# La Crème Opportunities App

This repository contains the code for **La Crème Opportunities**, a progressive web application designed to help creative professionals discover, save and apply for grants, expressions of interest (EOIs), residencies and awards.  It implements a minimal but functional MVP built with Next.js 14, React 18, TailwindCSS and Prisma.

## Features

- 🔍 **Search & filter** a database of opportunities by category, discipline, location, dates and amount.
- 📊 **Fit scoring** based on your preferred disciplines, locations, amounts and deadlines.
- 💾 **Save** interesting opportunities and track your status (new, saved, applied).
- ✉️ **Handoff** selected opportunities to the La Crème Grant‑Writer AI assistant via an API endpoint.
- 🔔 **Digest emails** (daily or weekly) summarising new or soon‑closing opportunities.
- 🛠️ **Admin tools** for refreshing data from live sources and inspecting insertion/update counts.

This MVP is intentionally simple: it seeds the database with sample opportunities and includes stubs for adapters that can be extended later to scrape live data sources.  Authentication uses passwordless magic links or Google OAuth via NextAuth.

## Getting Started

### Prerequisites

* Node.js 18 or later
* PostgreSQL database (e.g. [Neon](https://neon.tech/) or [Supabase](https://supabase.com/))
* Yarn or npm package manager

### Environment Variables

Create a `.env` file at the project root and define the following variables:

```
DATABASE_URL=postgresql://user:password@host:port/database
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=some-random-secret
EMAIL_FROM="La Crème <no-reply@your-domain.com>"
RESEND_API_KEY=your-resend-api-key
APP_BASE_URL=http://localhost:3000
VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
VAPID_SUBJECT=mailto:you@example.com

# Optional
NOTION_TOKEN=
NOTION_DB_OPPORTUNITIES_ID=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Install & Run

1. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

2. Generate the Prisma client and run migrations:

   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

   The seed script inserts ~20 example opportunities into the database.

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser at `http://localhost:3000`.  You should see the landing page with a sign‑in button.  After signing in, you can complete onboarding preferences and browse opportunities.

### Building & Deploying

To create an optimised production build:

```bash
npm run build
npm run start
```

Deploying to Vercel is recommended.  The app is preconfigured for Vercel cron jobs (see `deployment` section in the project brief).  Set the same environment variables in your Vercel project settings.

### Adding the App to Your Website

The La Crème Opportunities app is a stand‑alone PWA.  If you want to link to it from your existing website, you have two easy options:

1. **Hyperlink** – Deploy the app at a subdomain or path (e.g. `opportunities.yoursite.com`) and add a link or button on your site pointing to it.

2. **Embed via iframe** – If you prefer to host the app at a different domain, you can embed it in an `<iframe>` on your website:

   ```html
   <iframe
     src="https://opportunities.yoursite.com"
     title="La Crème Opportunities"
     style="width:100%;height:100vh;border:0;">
   </iframe>
   ```

   The app is responsive and keyboard accessible, so it will adapt nicely inside an iframe.

### Contributing

The MVP leaves room for improvements such as real scraping adapters, stronger authentication, push notifications, a richer UI and more tests.  Feel free to fork the repository and extend it.  If you do, please respect the privacy and performance constraints described in the project brief.