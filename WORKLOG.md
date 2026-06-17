# Worklog

## 2026-06-17 - Bedrijfsdetail als overzichtskaart (contacten + vacatures + deals)
- **Wat is gebouwd/gewijzigd:**
  - Vacatures gekoppeld aan een opdrachtgever (bedrijf): kolom `company_id` op vacatures (migratie 0006); bedrijf-keuze toegevoegd aan het vacatureformulier (nieuw + bewerken laden de bedrijven).
  - Bedrijfsdetail herontworpen tot één overzichtskaart: kop met type/status/plaats/website + kerncijfers (contacten, open vacatures, pipeline-waarde), en secties Contactpersonen, Vacatures (gekoppeld, klikbaar) en Deals.
  - Demo-vacatures aan demo-bedrijven gekoppeld (en een paar extra zodat bedrijven meerdere vacatures hebben).
- **Waarom:**
  - Gebruiker wil bij Bedrijven een overzichtelijke kaart met alle gekoppelde data: contactpersonen én vacatures van dat bedrijf.
- **Geraakte bestanden:**
  - `platform/supabase/migrations/0006_vacature_company.sql` (nieuw), `src/app/admin/crm/bedrijven/[id]/page.tsx`, `src/components/VacatureForm.tsx`, `src/app/admin/vacatures/{nieuw,[id]}/page.tsx`, `src/app/admin/vacatures/actions.ts`, `src/lib/demo.ts`.

## 2026-06-17 - Nieuwe kandidaat komt terug in talentpool (demo-geheugen)
- **Wat is gebouwd/gewijzigd:**
  - In demo-modus sloeg /admin/kandidaten/nieuw niets op (no-op), waardoor een nieuwe kandidaat niet terugkwam. Nu een in-memory demo-store (`src/lib/demo-store.ts`): createCandidate bewaart alle velden + maakt een ATS-kaart in 'nieuw'. Talentpool, kandidaatdetail, ATS, dashboard en funnel lezen uit die store, dus een nieuwe kandidaat verschijnt overal mét alle ingevulde info.
  - Veldmapping geverifieerd: elk formulierveld (persoonlijk/professioneel/beschikbaarheid+tarief/expertise/status/notitie) komt terug op het detail en in de lijst.
- **Waarom:**
  - Gebruiker wilde dat alle ingevulde info bij het aanmaken terugkomt in de talentpool.
- **Geraakte bestanden:**
  - `platform/src/lib/demo-store.ts` (nieuw), `src/app/admin/kandidaten/actions.ts`, `src/app/admin/kandidaten/page.tsx` + `[id]/page.tsx`, `src/app/admin/ats/page.tsx`, `src/app/admin/page.tsx`, `src/app/admin/funnel/page.tsx`.

## 2026-06-17 - CRM-module (ZOHO-stijl) + professioneler kandidaatformulier
- **Wat is gebouwd/gewijzigd:**
  - Kandidaatformulier (/admin/kandidaten/nieuw) opnieuw ingedeeld in nette secties (Persoonlijk / Professioneel / Beschikbaarheid & tarief / Status & notitie) met sticky opslaan-balk en bredere velden.
  - Nieuwe CRM-module (commerciële kant): Bedrijven/Accounts, Contactpersonen, Deals-pijplijn (kanban met DragOverlay + KPI's: pipeline-/gewogen waarde), en bedrijfsdetail met contacten + deals. Menu opgedeeld in Werving / CRM / Content.
  - DB: `companies`, `contacts`, `deals` (stages lead..gewonnen/verloren), `crm_activities` + RLS (migratie 0005). Demo-data voor alle CRM-entiteiten; acties demo-veilig.
- **Waarom:**
  - Gebruiker wil het kandidaatformulier professioneler, en naast Talentpool + ATS ook een CRM zoals ZOHO.
- **Geraakte bestanden:**
  - `platform/supabase/migrations/0005_crm.sql`, `src/lib/crm.ts`, `src/components/DealBoard.tsx` (nieuw), `src/app/admin/crm/*` (deals, bedrijven, contacten + actions), `src/components/AdminNav.tsx`, `src/lib/demo.ts`, `src/app/admin/kandidaten/nieuw/page.tsx`.

## 2026-06-17 - Fix: hydration-mismatch in ATS-board (dnd-kit)
- **Wat is gebouwd/gewijzigd:**
  - Vaste `id="ats-board"` op de dnd-kit `DndContext` gezet. dnd-kit genereerde anders interne accessibility-id's (`aria-describedby`) met een teller die server- en client-side kon verschillen, wat een React hydration-error gaf.
- **Waarom:**
  - Gebruiker zag een hydration-console-error op /admin/ats (DndDescribedBy-0 vs -2).
- **Geraakte bestanden:**
  - `platform/src/components/AtsBoard.tsx`.

## 2026-06-17 - Fix: oneindig doorslepen in ATS-board
- **Wat is gebouwd/gewijzigd:**
  - ATS-board herschreven met een dnd-kit DragOverlay. De gesleepte kaart kreeg eerder een transform in de layout-flow, waardoor het board/de pagina meegroeide en je eindeloos naar rechts/onder kon slepen. Nu blijft de originele kaart staan (gedimd) en volgt een zwevende kopie de muis, los van de layout.
- **Waarom:**
  - Gebruiker meldde dat je in de ATS-pijplijn oneindig kon doorslepen.
- **Geraakte bestanden:**
  - `platform/src/components/AtsBoard.tsx`.

## 2026-06-17 - Eigenaarschap/opvolging, funnel-metrics en talentpool-filter
- **Wat is gebouwd/gewijzigd:**
  - (1) Eigenaar + volgende actie/reminder per kandidaat: opvolging-sectie in het detail (eigenaar uit team, actie + datum), opgeslagen op de kandidaat; `laatste_contact` bij activiteit.
  - (3) Funnel-metrics (`/admin/funnel`): KPI's (in funnel, geplaatst, conversie %, talentpool), funnel-per-fase met staafjes + stap-conversie + gemiddelde dagen in fase (uit `stage_changed_at`-trigger). In menu opgenomen.
  - (4) Talentpool-filter: kandidatenlijst omgebouwd naar filterbare client-tabel (zoeken op naam/functie/expertise + filters niveau/status/vakgebied). "Kandidaten" hernoemd naar "Talentpool".
- **Waarom:**
  - Vervolg op de funnel-audit; gebruiker koos 1, 3 en 4 (2 = geanonimiseerd profiel niet).
- **Geraakte bestanden:**
  - `platform/supabase/migrations/0004_ownership_metrics.sql` (nieuw), `src/app/admin/funnel/page.tsx` (nieuw), `src/components/FollowupForm.tsx` + `TalentpoolTable.tsx` (nieuw), `src/components/AdminNav.tsx`, `src/app/admin/kandidaten/*` (page, [id], actions), `src/lib/demo.ts`.

## 2026-06-17 - ATS-kandidaat uitgebreid (CRM-stijl) + funnel-audit
- **Wat is gebouwd/gewijzigd:**
  - Funnel-audit uitgevoerd; aanbevelingen verwerkt.
  - Rijk kandidaatprofiel (CRM, hoger segment): niveau, huidige functie/werkgever, beschikbaarheid (datum + uren), tarief-range, opleiding, regio, talen, rijbewijs, expertise-tags, rating, status (talentpool/actief/bemiddeld/niet beschikbaar), eigenaar, laatste contact, AVG-toestemming.
  - Activiteiten-tijdlijn (contactmomenten: notitie/telefoon/e-mail/gesprek/voorstel) met toevoeg-actie.
  - Verbeterde funnel-stages: Nieuw -> Kwalificatie -> Kennismaking -> Voorgesteld -> Aanbieding -> Geplaatst, plus Afgewezen en Talentpool; afwijs-reden op application.
  - Rijker aanmaakformulier, talentpool-lijst (niveau/status/tarief/rating), rijk detail met secties + tijdlijn. Demo-data verrijkt. Typecheck groen; demo-pagina's 200.
- **Waarom:**
  - Gebruiker richt zich op kandidaten in het hogere segment (senior/interim) en wil het kandidaatdeel uitbreiden (à la MySolution: ATS + CRM) en de funnel aanscherpen.
- **Geraakte bestanden:**
  - `platform/supabase/migrations/0003_candidate_crm.sql` (nieuw), `src/lib/ats.ts`, `src/lib/demo.ts`, `src/components/ActivityTimeline.tsx` (nieuw), `src/app/admin/kandidaten/*` (page, [id], nieuw, actions), `src/app/admin/page.tsx`.

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
