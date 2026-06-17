# Go-live handleiding: GitHub + Supabase + Vercel

Deze app draait nu in **demo-modus** (geen Supabase nodig). Zodra je echte Supabase-keys
toevoegt, schakelt hij automatisch over naar de echte database en verdwijnt alle demo-data
(die zit alleen in de code, niet in je database). Volg deze 3 stappen in volgorde.

> Belangrijk: de Next.js-app staat in de submap `platform/`. In Vercel zet je
> **Root Directory = platform**.

---

## 1. GitHub

De code zit al in een git-repo (root: `Detavia/`, met daarin `platform/`).

```bash
cd /Users/chmorra/Downloads/Detavia
# maak op github.com een lege repo aan, bv. detavia-platform (zonder readme)
git remote add origin https://github.com/<jouw-account>/detavia-platform.git
git push -u origin main
```

---

## 2. Supabase

1. Maak een project op https://supabase.com (regio: EU, bv. Frankfurt).
2. Ga naar **Project Settings > API** en noteer 3 waarden:
   - `Project URL`            -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key        -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key       -> `SUPABASE_SERVICE_ROLE_KEY`  (geheim, alleen server)
3. **Migraties draaien.** Open in Supabase de **SQL Editor** en plak/run de bestanden
   uit `platform/supabase/migrations/` op volgorde: `0001` t/m `0013`.
   (De storage-buckets `cvs` en `blog` worden in `0002` automatisch aangemaakt.)

   Of via de Supabase CLI:
   ```bash
   cd platform
   supabase link --project-ref <jouw-ref>
   supabase db push
   ```

4. **Eerste super-admin aanmaken.** Vul lokaal `platform/.env.local` met de URL +
   service_role key en draai:
   ```bash
   cd platform
   node scripts/seed-admin.mjs "badr@detavia.nl" "een-sterk-wachtwoord" "Badr"
   ```
   Hiermee log je later in op `/admin`.

---

## 3. Vercel

1. https://vercel.com -> **Add New > Project** -> importeer je GitHub-repo.
2. **Root Directory: `platform`** (belangrijk, anders vindt Vercel de app niet).
3. Voeg onder **Environment Variables** toe (Production + Preview):

   | Naam | Waarde |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | je Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |
   | `SUPABASE_SERVICE_ROLE_KEY` | service_role key |
   | `ANTHROPIC_API_KEY` | (optioneel) voor de AI-mailer |
   | `RESEND_API_KEY` | (optioneel) voor e-mail versturen |

4. **Deploy.** Klaar. De site draait nu op je echte database.

### Supabase Auth instellen
Zet in Supabase onder **Authentication > URL Configuration** de **Site URL** op je
Vercel-domein (bv. `https://detavia.vercel.app`), zodat inloglinks goed werken.

---

## Controle na go-live
- `/` en `/voor-opdrachtgevers` laden -> publieke site werkt.
- Contact- of aanvraagformulier verzenden -> bericht verschijnt bij **/admin** (berichten).
- Inloggen op `/admin` met de super-admin -> beheer werkt.
- Demo-data is weg (alleen echte database-records zijn zichtbaar).
