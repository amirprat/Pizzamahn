## Pizzamahn.com Rebuild

Next.js App Router project that recreates pizzamahn.com with a MySQL backend, admin portal, and accessibility-first design.

---

## Prerequisites

- Node.js 20+
- npm 10+
- Local MySQL 8.x server (or hosted MySQL)
- Optional (for tests): Playwright browsers (`npx playwright install`)

---

## Environment Variables

Create `apps/web/.env.local` (see `.env.example` in repo root) with:

```
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="admin@pizzamahn.com"
ADMIN_PASSWORD="ChangeMe123!"
MAILCHIMP_API_KEY=""
MAILCHIMP_AUDIENCE_ID=""
```

> `ADMIN_PASSWORD` is used to seed the default admin account. Update both the env value and your login credentials if you change it later.

---

## Database Setup

```bash
# optionally adjust DATABASE_URL inline if not using .env.local yet
npm run migrate:dev --workspace @pizzamahn/db
npm run seed --workspace @pizzamahn/db
```

These commands will create the schema, run migrations, and add default area tags.

---

## Local Development

```bash
# install workspace dependencies
npm install

# start Next.js dev server
npm run dev
```

Visit http://localhost:3000 for the public site and http://localhost:3000/admin/login for the admin console.

### Admin Login

Use the credentials defined in `.env.local` (`ADMIN_EMAIL` / `ADMIN_PASSWORD`). The first login will provision the admin user automatically.

---

## Testing & Quality

```bash
# lint all files
npm run lint

# run accessibility smoke test (spins up dev server automatically)
npm run test
```

> Ensure browsers are installed for Playwright: `npx playwright install`

---

## Deployment Checklist

1. Provision a MySQL instance (e.g. PlanetScale, Railway, AWS RDS).
2. Set production environment variables (see `.env.example`).
3. Run migrations `npx prisma migrate deploy` (Vercel build step or manual).
4. Seed area tags if deploying to a new database (`npm run seed --workspace @pizzamahn/db` from a machine with DB access).
5. Deploy to Vercel or your preferred host: `vercel --prod` or configure GitHub → Vercel integration.

---

## Managing Reservations

- Admin Dashboard (`/admin`):
  - Search by guest name/email/notes.
  - Filter by status or area tag and sort by date or creation time.
  - Update status inline.
  - Export CSV (`/api/reservations/export`).
- Detailed editor (`/admin/reservations/:id`) to edit contact info, date/time, notes, and tag assignments.

All API routes require admin authentication except:

- `POST /api/reservations` (public booking form).
- `POST /api/mailing-list` (newsletter signup).

---

## Managing Area Tags

`/admin/area-tags` allows you to:

- Create new tags (auto slug generation).
- Rename or deactivate tags.
- Delete unused tags.

Tags drive SEO meta content, filtering, and are exposed on the public reservation form.

---

## Accessibility Maintenance

- Automated Axe scan: `npm run test`
- Manual checklist per WCAG 2.1 AA:
  - Maintain sufficient color contrast when updating branding.
  - Provide descriptive alt text for all imagery (`HeroSection`, `Admin` dashboards).
  - Verify keyboard navigation for new UI controls.
  - Ensure focus styles remain visible for interactive elements.

Add additional Axe scenarios in `apps/web/tests/accessibility.spec.ts` when new pages/components are introduced.

---

## Tech Stack

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS
- **Backend:** Prisma ORM, MySQL, NextAuth (Credentials provider)
- **Auth:** Password-based admin login with Prisma adapter sessions
- **Testing:** ESLint, Playwright + axe-core

---

## Useful Commands

```bash
# run Next.js build
npm run build

# launch Next.js in production mode
npm run start

# open Prisma Studio
npm run studio --workspace @pizzamahn/db

# run a specific Playwright test
npm run test -- --grep "homepage"
```

---

## Support

For deployment or operational questions, reach out to hello@pizzamahn.com. PRs and issues welcome!
