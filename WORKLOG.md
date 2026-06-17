# Worklog

## 2026-06-17 - Demo-modus voor het beheer (inloggen zonder Supabase)
- **Wat is gebouwd/gewijzigd:**
  - Demo-modus: zolang Supabase niet gekoppeld is (anon key leeg/replace-me), draait het beheer op voorbeelddata. Login toont een knop "Inloggen op demo-account" die een httpOnly demo-cookie zet; `requireAdmin`/`requireRole` herkennen die cookie en geven een demo-super-admin.
  - Demo-data (`src/lib/demo.ts`): kandidaten, ATS-kaarten over alle stages, blogartikelen, vacatures, contactberichten, team. Alle admin-pagina's tonen die data in demo (dashboard, ats, kandidaten + detail, blog, vacatures, berichten, team).
  - Alle wijzig-acties zijn demo-veilig gemaakt (no-op): drag in ATS blijft in beeld, maar niets wordt opgeslagen. Logout wist de demo-cookie.
  - Geverifieerd: /login toont demo, /admin met cookie = 200 (dashboard + alle subpagina's), zonder cookie = redirect naar /login. Typecheck groen.
- **Waarom:**
  - Gebruiker wil het beheer eerst bekijken/uitproberen zonder Supabase te koppelen.
- **Geraakte bestanden:**
  - `platform/src/lib/demo.ts` (nieuw), `src/lib/admin-context.ts`, `src/app/login/page.tsx` + `login/actions.ts` (nieuw), `src/components/LogoutButton.tsx`, alle `src/app/admin/**/page.tsx` + `**/actions.ts`.

## 2026-06-17 - Backend afgebouwd: admin, ATS, blog, cv's, publieke formulieren
- **Wat is gebouwd/gewijzigd:**
  - Auth: login (`/login`), logout, `/geen-toegang`, admin-shell met zijbalk + rolcheck, dashboard met kerncijfers.
  - ATS: kandidatenlijst, handmatig kandidaat toevoegen (komt direct in pijplijn), kandidaatdetail met cv-download (signed URL) + notitie, kanban-board met drag-and-drop (dnd-kit) over de stages nieuw/screening/gesprek/voorgesteld/geplaatst/afgewezen.
  - Blog: TipTap-editor, lijst + nieuw/bewerken/verwijderen, HTML-sanitatie; publieke `/verhalen` + `/verhalen/[slug]` uit de database (met fallback).
  - Vacatures: CRUD-beheer; publieke `/vacatures` laadt uit DB (fallback naar demo-set).
  - Contactberichten (lijst + gelezen-toggle) en teambeheer (super-admin: uitnodigen + rollen).
  - Publieke formulieren via service-role server actions: sollicitatie + cv-upload -> kandidaat + ATS-kaart, en contactformulier -> berichten. `/solliciteren`, `/bedankt`.
  - Seed-script voor eerste super-admin (`scripts/seed-admin.mjs`). Typecheck groen (tsc, 0 fouten). Publieke routes draaien lokaal (200).
- **Waarom:**
  - Vervolg op gekozen aanpak (optie 3): alle admin/ATS/blog/cv-code afbouwen zodat alles klaarstaat zodra Supabase gekoppeld wordt.
- **Geraakte bestanden:**
  - `platform/src/app/login`, `geen-toegang`, `admin/*` (layout, dashboard, ats, kandidaten, blog, vacatures, berichten, team + actions), `(public)/solliciteren`, `bedankt`, `actions.ts`, bijgewerkte `verhalen`/`vacatures`/`contact`.
  - `platform/src/components/*` (AdminNav, AtsBoard, BlogEditor/Form, VacatureForm, CvButton, NoteForm, RoleSelect, toggles, Logout).
  - `platform/scripts/seed-admin.mjs`.

## 2026-06-17 - Start platform: Next.js + Supabase app (fundament + publieke site)
- **Wat is gebouwd/gewijzigd:**
  - Nieuwe app `platform/` opgezet: Next.js 16 + React 19 + Tailwind 4 + Supabase (zelfde stack als Workster2.0). Eén app voor publieke site + intern beheer. Geen jobboard.
  - Databaseschema + RLS geschreven (`supabase/migrations/`): admin_users (rollen super_admin/admin/recruiter), vacatures, candidates, cvs, applications (ATS-pijplijn met stages), blog_posts, contact_messages + storage-buckets (cvs privé, blog publiek).
  - Supabase-clients (browser/server/service-role), admin-context (requireAdmin/requireRole), sessie-middleware (hardened: rendert zonder Supabase).
  - Publieke site geport naar React/Tailwind in Detavia-huisstijl: home, vacatures (met filtersysteem als client-component), over-ons, verhalen, contact. DRAAIT LOKAAL op http://localhost:3000.
- **Waarom:**
  - Gebruiker wil een backend met ATS, blogbeheer, cv-opslag en adminrechten (à la Workster2.0). Keuzes: één Next.js+Supabase app, alleen intern team, formulier+cv-upload instroom, lokaal opzetten.
- **Status / nog te doen:**
  - Admin/ATS/blog/cv vereisen gekoppelde Supabase (Docker ontbreekt lokaal -> Docker installeren of gratis cloud-project). Daarna: auth/login, admin-shell, ATS-board, blogeditor, sollicitatieformulier+cv-upload, seed super-admin.
- **Geraakte bestanden:**
  - `platform/` (nieuw): package.json, configs, `src/app/(public)/*`, `src/components/*`, `src/lib/*`, `supabase/migrations/0001_init.sql` + `0002_storage.sql`, README.

## 2026-06-17 - Salarisrange i.p.v. schaal bij vacatures
- **Wat is gebouwd/gewijzigd:**
  - In de vacaturedata `schaal` vervangen door een `salaris`-bereik [min,max] en in de kaarten getoond als bv. "€ 3.300 - € 4.600 p/m" (nl-opmaak via helper fmtSalaris).
- **Waarom:**
  - Gebruiker wil een concreet salarisbereik in plaats van een schaalnummer; spreekt kandidaten meer aan.
- **Geraakte bestanden:**
  - `detavia-best-of/assets/js/vacatures.js` (data + render)

## 2026-06-16 - Filter-sidebar exact volgens joinuz-opbouw
- **Wat is gebouwd/gewijzigd:**
  - Filter-sidebar herzien naar exact de joinuz-structuur en -volgorde: Filter + "Verwijder filters" (prullenbak-icoon), Locatie (stad/postcode), Afstand (slider 0-50km), Vakgebied (dropdown "Sociaal Domein"), Branches (checkboxes met live aantallen), Uren per week (min/max velden), en een volledige Zoeken-knop.
  - JS aangepast: uren-filter via min/max in plaats van checkboxes; afstand-slider toont waarde (geo-filtering volgt bij koppeling echte locaties); branches met live aantallen behouden.
- **Waarom:**
  - Gebruiker leverde een screenshot van het joinuz-filtersysteem aan dat exact aangehouden moet worden, aangepast naar Detavia (alleen sociaal domein).
- **Geraakte bestanden:**
  - `detavia-best-of/vacatures.html` (filter-sidebar herzien)
  - `detavia-best-of/assets/js/vacatures.js` (min/max uren, afstand, reset)
  - `detavia-best-of/assets/css/style.css` (slider, min/max velden, zoekknop)

## 2026-06-16 - Vacaturepagina met zoek-/filtersysteem (joinuz-stijl)
- **Wat is gebouwd/gewijzigd:**
  - Vacaturepagina omgebouwd naar een echt zoek-/filtersysteem in de stijl van joinuz.nl/zoek, maar volledig sociaal domein en in Detavia-huisstijl.
  - Zoek-hero met zoekbalk; filter-sidebar met Plaats (tekst), Vakgebied (checkboxes met live aantallen) en Uren per week (checkboxes met live aantallen); resultaatteller; sorteren (nieuwste/meeste uren); lijst-/rasterweergave; "wis filters" en mobiel filterpaneel.
  - JS-gedreven met voorbeelddata (12 vacatures) die makkelijk te vervangen is of later aan het flexportaal/CMS te koppelen.
  - "Home" toegevoegd als eerste item in het hoofdmenu op alle pagina's, zodat men makkelijk terug naar de startpagina kan.
- **Waarom:**
  - Gebruiker wil de vacatures als de zoekpagina van joinuz, inclusief filtersysteem, en een duidelijke Home-link in het menu.
- **Geraakte bestanden:**
  - `detavia-best-of/vacatures.html` (herzien naar zoek/filter)
  - `detavia-best-of/assets/js/vacatures.js` (nieuw: data + filterlogica)
  - `detavia-best-of/assets/css/style.css` (zoek/filter-componenten toegevoegd)
  - alle `detavia-best-of/*.html` (Home-link in het menu)

## 2026-06-16 - Meerpaginasite van de best-of pagina
- **Wat is gebouwd/gewijzigd:**
  - De one-page best-of omgebouwd naar een meerpaginasite met gedeelde CSS/JS:
    `assets/css/style.css` en `assets/js/main.js` (nav-toggle, demoformulier, vacaturefilter).
  - Home (`index.html`): vakgebied-kaarten vervangen door "Uitgelichte vacatures" (3 highlights) met knop naar de vacaturepagina; teasers toegevoegd naar Verhalen/Academy/Contact.
  - Nieuwe pagina's: `vacatures.html` (overzicht met filterchips), `verhalen.html` (blogopzet), `academy.html` (aanbod + stappen), `contact.html` (formulier + directe gegevens + de FAQ/Veelgesteld), `over-ons.html` (nieuw).
  - Em-dashes vermeden, koppeltekens/komma's gebruikt.
- **Waarom:**
  - Gebruiker wil de site opdelen: vacatures, verhalen (blog), academy en contact als aparte pagina's, plus een nieuwe Over ons. Uitgelichte vacatures op de home in plaats van de demo-categorieen.
- **Geraakte bestanden:**
  - `detavia-best-of/index.html` (herzien)
  - `detavia-best-of/vacatures.html`, `verhalen.html`, `academy.html`, `contact.html`, `over-ons.html` (nieuw)
  - `detavia-best-of/assets/css/style.css`, `detavia-best-of/assets/js/main.js` (nieuw)

## 2026-06-16 — Concurrentieanalyse + "best-of" Detavia-pagina
- **Wat is gebouwd/gewijzigd:**
  - 3 concurrenten geanalyseerd (joinuz.nl, daan.eu, wyzer.nl/werken-in/sociaal-domein): positionering, diensten, doelgroep, boodschap en vormgeving + screenshots.
  - Nieuwe, schone en bewerkbare Detavia-pagina gebouwd in `detavia-best-of/` die de sterkste elementen van de concurrenten combineert met originele copy in Detavia-tone (geel/blauw/zwart, Plus Jakarta Sans, eigen logo's/foto's). Secties: hero, social-proof statsbalk, vakgebied-kaarten met vacaturetellers + vacaturemelding, Over DetaVia, ervaringsverhalen, DetaVia Academy, statement, FAQ, nieuwsbrief/CTA, footer.
  - Eerder deze beurt al: ontbrekende assets in de site-mirror hersteld (Ionicons/Font Awesome icoon-fonts → ↗-pijltje Inloggen; `logo_white_web.svg` → watermerk blauw blok).
- **Waarom:**
  - Detavia is specialist in het sociaal domein; doel is per concurrent het sterkste element overnemen (aanpak, niet content) en in het Detavia-jasje gieten om de site competitiever te maken (m.n. tegen Wyzer).
  - De mirror-fixes omdat het origineel die elementen wél toont en de kopie 1-op-1 moet zijn.
- **Geraakte bestanden:**
  - `detavia-best-of/index.html` (nieuw)
  - `detavia-best-of/assets/fonts/*`, `detavia-best-of/assets/img/*` (nieuw)
  - `bestof-preview.png` (nieuw, render-preview)
  - `site/` mirror: Ionicons/Font Awesome fonts + `media/2025/07/logo_white_web.svg` toegevoegd; `clone-fixed.png`
  - `WORKLOG.md` (nieuw)
