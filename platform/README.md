# DetaVia platform

Next.js 16 + Supabase + Tailwind. Eén app met de publieke Detavia-site én het
interne beheer (ATS, blog, cv's). Geen jobboard.

## Stack
- Next.js 16 (App Router) · React 19 · Tailwind 4
- Supabase (Postgres + RLS + Auth + Storage)

## Lokaal draaien (publieke kant)
```bash
npm install
npm run dev        # http://localhost:3000
```
De publieke site (home, vacatures, over-ons, verhalen, contact) draait zonder
Supabase. Admin/ATS/blog/cv's vereisen een gekoppelde Supabase (zie hieronder).

## Supabase koppelen (voor admin/ATS/blog/cv's)
Twee opties:
1. **Cloud (snelst):** maak een gratis project op supabase.com, draai de SQL uit
   `supabase/migrations/` in de SQL-editor, en vul `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
2. **Lokaal:** installeer Docker + Supabase CLI, dan `supabase start` en
   `supabase db reset` (draait de migraties).

Eerste super-admin aanmaken: zie `scripts/` (volgt) of voeg na registratie een
rij toe in `admin_users` met role `super_admin`.

## Structuur
- `src/app/(public)/` — publieke site
- `src/app/admin/` — intern beheer (volgt)
- `src/lib/` — Supabase-clients, admin-context, helpers
- `supabase/migrations/` — databaseschema + RLS + storage
