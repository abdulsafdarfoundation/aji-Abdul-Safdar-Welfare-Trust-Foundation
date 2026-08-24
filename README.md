# Hope Foundation — nonprofit platform

A donation platform for a nonprofit: a public site where people find campaigns
and give, and a staff dashboard where that money is tracked.

Built with **Next.js 16** (App Router, Server Components, Server Actions),
**React 19**, **Tailwind CSS v4**, **shadcn/ui**, and **Supabase** (Postgres +
Auth + Row Level Security).

---

## Running it

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

**It works before you configure anything.** With no Supabase keys the app runs
in *demo mode*: pages are served from the fixtures in `src/lib/data/demo.ts`, the
dashboard skips sign-in, and an amber banner says so. That banner disappearing is
how you know Supabase is live.

| Route | What it is |
| --- | --- |
| `/` | Home — hero, featured campaigns, org promises |
| `/campaigns` | All open and completed campaigns |
| `/campaigns/[slug]` | One campaign: story, progress, supporters |
| `/donate` | Donation form (amount, frequency, designation, donor details) |
| `/donate/thank-you` | Confirmation with the donation reference |
| `/about` | Mission, spending breakdown, team |
| `/login` | Staff sign-in |
| `/admin` | Dashboard: money in, chart, campaign progress, latest gifts |
| `/admin/campaigns` | Campaign list, create, edit, delete |
| `/admin/donations` | Filterable donation ledger + manual settlement |
| `/admin/settings` | What's wired up, your account, org constants |

---

## Connecting Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Copy `.env.example` to `.env.local` and fill in the three keys from
   **Project Settings → Data API** and **API Keys**.
3. In **SQL Editor**, run `supabase/migrations/0001_init.sql`, then
   `supabase/seed.sql` for sample content.
4. Restart `npm run dev`. The demo banner should be gone.

### Creating the first admin

Sign-up is not exposed on the public site — staff accounts are created
deliberately.

1. **Authentication → Users → Add user**, with a password. A `profiles` row is
   created automatically by trigger, with the role `viewer`.
2. Promote it in the SQL Editor:

   ```sql
   update public.profiles set role = 'admin' where email = 'you@example.org';
   ```

3. Sign in at `/login`.

Roles: `admin` (everything, including donation status changes), `editor`
(campaigns, read donations), `viewer` (no dashboard access).

---

## Architecture

```
src/
├─ app/
│  ├─ (site)/            Public pages — shared header/footer layout
│  ├─ (admin)/admin/     Dashboard — gated by requireStaff() in its layout
│  ├─ actions/           Server Actions (donate, campaigns, donations, auth)
│  ├─ login/             Staff sign-in, outside both shells
│  └─ error.tsx · not-found.tsx
├─ components/
│  ├─ site/ admin/ campaigns/ donate/ auth/
│  └─ ui/                shadcn/ui primitives — yours to edit
├─ lib/
│  ├─ data/              The only place that reads data. Falls back to fixtures.
│  ├─ supabase/          server / client / admin (service-role) clients
│  ├─ auth.ts            getProfile, requireStaff, requireAdmin
│  ├─ payments.ts        Gateway seam — currently stubbed
│  ├─ validations.ts     Zod schemas shared by forms and actions
│  └─ constants.ts       Org name, currency, presets, categories
├─ types/database.ts     Schema types (regenerate with `npm run db:types`)
└─ proxy.ts              Next 16's middleware — refreshes the Supabase session
```

Things worth knowing:

- **Every page is a Server Component** unless it needs state. `"use client"`
  appears only on the mobile menu, the forms, and the filter bar.
- **Data access is centralised** in `src/lib/data/*`. Each function checks
  `isSupabaseConfigured` and falls back to fixtures — that is what makes demo
  mode work without a parallel code path in every page.
- **Authorization is decided server-side.** `proxy.ts` only refreshes the session
  cookie and bounces signed-out visitors early; the real check is
  `requireStaff()` in the admin layout, which verifies the JWT with Supabase
  (`getUser()`, never `getSession()`) and reads the role from the database.
- **Campaign totals are denormalized** onto `campaigns` and maintained by a
  trigger. A view would have reported zero to anonymous visitors, who cannot read
  the `donations` table under RLS.

---

## Payments

Deliberately stubbed. `src/lib/payments.ts` records every donation as `pending`
with a reference like `HF-7K2QM4` — the same state a real gateway leaves it in
between checkout and settlement. An admin confirms it from `/admin/donations`,
which rolls it into the campaign totals.

To go live:

1. Replace `createPayment()` with the gateway call; return its checkout URL as
   `redirectUrl`.
2. Add a webhook route that flips the matching donation to `completed` using
   `createAdminClient()` (service role — it must bypass the "inserts must be
   pending" RLS policy).
3. Set `PAYMENTS_ARE_LIVE = true` so the settings page and donate form stop
   saying payment is not connected.

Nothing else needs to change — the schema, RLS policies, and admin flow already
assume asynchronous settlement.

---

## Security notes

- RLS is on for all three tables. Anonymous visitors can read active/completed
  campaigns and insert a `pending` donation; nothing else.
- A donation cannot be created as `completed` through the public API — the
  `with check (status = 'pending')` policy blocks it.
- Role escalation is blocked by a trigger, not a policy: reading `profiles` from
  inside a `profiles` policy would recurse.
- `SUPABASE_SERVICE_ROLE_KEY` is server-only and has no `NEXT_PUBLIC_` prefix.
  `src/lib/supabase/admin.ts` is marked `server-only` so importing it into a
  Client Component fails the build rather than leaking the key.

---

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # serve the build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
npm run db:types   # regenerate src/types/database.ts (needs supabase CLI + linked project)
```

---

## Changing the org

Most of what identifies the charity lives in `src/lib/constants.ts`: name,
tagline, contact details, **currency**, donation presets, and campaign
categories. Change `SITE.currency` and every amount on both the site and the
dashboard re-formats.

Brand colours are CSS custom properties at the top of `src/app/globals.css` —
`--primary` (evergreen) carries the organisation, `--brand` (clay) is reserved
for donate CTAs so giving never visually competes with navigation. Dark mode has
its own hand-picked steps rather than an automatic inversion.

## Not built yet

Scoped out of this first pass, in rough order of usefulness:

- Blog / news / events, and a volunteer signup — the admin shell and data-layer
  pattern extend to them directly.
- A public contact form (contact details are in the footer for now).
- Image uploads to Supabase Storage; cover images are URLs today.
- Emailed donation receipts.
- CSV export of the donation ledger.
