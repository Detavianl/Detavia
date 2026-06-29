# Worklog

## 2026-06-29 - Domein detavia.nl live gekoppeld aan Vercel
- **Wat is gedaan:**
  - Domein detavia.nl (registrar TransIP) gekoppeld aan Vercel. Nameservers teruggezet naar TransIP (ns0/ns1/ns2). DNS-records: @ A -> 76.76.21.21, www CNAME -> 03d43c388aefcab8.vercel-dns-017.com; AAAA en wildcards verwijderd; alle mailrecords (MX/SPF/DKIM/autoconfig/autodiscover/x-transip-mail-auth/_dmarc) ongemoeid.
  - Geverifieerd: detavia.nl 308 -> www.detavia.nl (Vercel), www.detavia.nl 200 met SSL, titel correct, MX intact. www is hoofdadres.
- **Nog te doen door klant:**
  - In Vercel NEXT_PUBLIC_SITE_URL = https://www.detavia.nl zetten + redeployen (voor sitemap/canonical/OG/mailer-logo). Eventueel detavia.nl als primair domein kiezen.
- **Geraakte bestanden:**
  - Geen code; DNS/domeinconfiguratie.


## 2026-06-29 - Account terug naar super_admin + rollen geverifieerd
- **Wat is gewijzigd:**
  - admin_users-account (Badr, user_id cb56c8db) teruggezet van recruiter naar super_admin en naam "Testrecruiter" -> "Badr".
  - 3 testplaatsingen gekoppeld aan deze recruiter zodat de rekenhulp (uren-kolom) zichtbaar werd tijdens de uitleg.
  - Rollensysteem geverifieerd (geen code-wijziging nodig): DB-constraint super_admin/admin/recruiter, getAdmin leest rol uit admin_users, requireRole dwingt hierarchie af, /admin/team (super_admin) beheert rollen. Live bevestigd: super_admin ziet alles + Marge-instellingen + Team.
- **Waarom:**
  - Klant wilde het account terug op super_admin en zeker weten dat de rollen echt werken.
- **Geraakte bestanden:**
  - Geen code; alleen data (admin_users.role/naam en placements.recruiter_id) op de live DB.


## 2026-06-29 - Rekenhulp uren op Verdiensten (per kandidaat)
- **Wat is gebouwd/gewijzigd:**
  - Verdiensten heeft nu een bewerkbare Uren-kolom (client-component VerdienstenTabel). Recruiter vult per eigen kandidaat de gemaakte uren in; live berekening per regel van "Recruiter totaal" (recruiter/u x uren) en "Te factureren" (verkoop/u x uren, excl. btw), met een totaalregel onderaan en KPI's (totaal uren, totale verdienste, totaal te factureren).
  - Ingevulde uren worden in de browser bewaard (localStorage). Geen facturatiesysteem, puur een rekenhulp.
- **Waarom:**
  - Klant wil dat recruiters per eigen kandidaat uren kunnen invullen en direct zien wat hun verdienste is en hoeveel er gefactureerd moet worden.
- **Geraakte bestanden:**
  - components/VerdienstenTabel.tsx (nieuw), app/admin/verdiensten/page.tsx.


## 2026-06-29 - Uren + Facturen + portalen verwijderd, recruiter-veld op plaatsing
- **Wat is gebouwd/gewijzigd:**
  - Volledige uren- en facturen-functionaliteit verwijderd (keuze klant: alles incl. portalen): admin /admin/uren en /admin/facturen, de professional- en opdrachtgever-portalen (/portaal, /opdrachtgever), invoice-libs, hours-componenten, factureerUren, inviteProfessional, inviteClient, won-deal-factuur, urenoverzicht op plaatsing-detail, notitie-entiteit "invoice". Nav, middleware en robots opgeschoond. Auth-routing simpel (login -> /admin).
  - Verdiensten ontkoppeld van de hours-tabel: toont nu de opbouw per uur (geen uren-totalen meer) en rekent af op recruiter_id.
  - Recruiter-veld op de plaatsing: nieuwe kolom placements.recruiter_id (migratie 0020, met backfill = eigenaar kandidaat). Plaatsingsformulier heeft nu een Recruiter-keuze die standaard de eigenaar van de gekozen kandidaat invult en per plaatsing aanpasbaar is, met waarschuwing als er geen recruiter gekoppeld is. Verdiensten en de privacy-scoping van de plaatsing-detail gebruiken recruiter_id (fallback eigenaar).
- **Waarom:**
  - Klant: uren/facturen worden niet gebruikt; en verdiensten moeten altijd bij de juiste recruiter terechtkomen, ongeacht wie het formulier invult.
- **Geraakte bestanden:**
  - Verwijderd: app/admin/uren/*, app/admin/facturen/*, app/portaal/*, app/opdrachtgever/*, lib/invoice*.ts, lib/professional-context.ts, lib/client-context.ts, components/{InvoiceActions,HoursReviewButtons,ClientHoursButtons,DeleteHoursButton,PlacementActions,InviteClientButton}.tsx.
  - Gewijzigd: middleware.ts, robots.ts, components/AdminNav.tsx, components/QuickNotes.tsx, components/PlacementForm.tsx, app/login/actions.ts, app/admin/activity-actions.ts, app/admin/crm/actions.ts, app/admin/crm/bedrijven/[id]/page.tsx, app/admin/plaatsingen/{actions.ts,nieuw/page.tsx,[id]/page.tsx}, app/admin/verdiensten/page.tsx, lib/demo.ts.
  - Migratie: supabase/migrations/0020_placement_recruiter.sql (uitgevoerd op live DB).


## 2026-06-27 - Nepdata (3 vacatures + 3 verhalen) + backend getest
- **Wat is gebouwd/gewijzigd:**
  - 3 nepvacatures (Leerplichtambtenaar/Almere, Klantmanager Werk en Inkomen/Utrecht, Consulent Participatie/Zwolle) en 3 nepverhalen in Supabase gezet via de service-role REST API (met omschrijving, taken, eisen resp. content_html, excerpt, gepubliceerd).
  - "Verhalen" toegevoegd aan het hoofdmenu (desktop + mobiel).
  - End-to-end getest op live: publieke lijst- en detailpagina's van vacatures en verhalen (mobiel 390px, geen overflow, content rendert) en de backend (/admin/vacatures en /admin/blog laden en tonen alle nepdata; admin mobiel geen overflow).
- **Waarom:**
  - Klant wilde testdata op de site en in de backend, en de backend laten testen.
- **Geraakte bestanden:**
  - components/SiteHeader.tsx (Verhalen-menu-item). Data staat in de database (vacatures + blog_posts), niet in code.


## 2026-06-26 - Mobielaudit: hamburgermenu + overflow-fix
- **Wat is gebouwd/gewijzigd:**
  - Mobiel hamburgermenu toegevoegd aan SiteHeader (de nav was hidden lg:flex zonder mobiele variant, dus < 1024px was er geen menu). Met uitklapbare secties Professionals/Opdrachtgevers + knoppen Personeel nodig? en Inloggen. Geverifieerd op live (390px): opent met alle items.
  - Mobielaudit (390px) over alle 14 publieke pagina's op horizontale overflow: 13 ok, /solliciteren had overflow (455px) door file-input + ontbrekende w-full/min-w-0. Gefixt met w-full op inputs/select, min-w-0 op grid-cellen en een nettere file-input. Opnieuw geverifieerd: 390/390, geen overflow meer.
- **Waarom:**
  - Klant zag geen menu op mobiel en vroeg om een mobielaudit van de publieke site.
- **Geraakte bestanden:**
  - components/SiteHeader.tsx, app/(public)/solliciteren/page.tsx.


## 2026-06-26 - Calendly: van inline-widget naar popup-op-klik
- **Wat is gebouwd/gewijzigd:**
  - Inline Calendly-widget vervangen door een popup: de kalender opent nu pas na klik op "Boek een kennismaking" / "Plan een kennismaking". Nieuw component CalendlyButton (laadt het Calendly-script en opent initPopupWidget). CalendlyWidget verwijderd.
  - Knoppen op contact (boekblok + cobalt-blok) en voor-opdrachtgevers gebruiken nu de popup-knop.
- **Waarom:**
  - Klant wil dat de widget pas opent na een klik, niet altijd zichtbaar ingebed.
- **Geraakte bestanden:**
  - components/CalendlyButton.tsx (nieuw), components/CalendlyWidget.tsx (verwijderd), app/(public)/contact/page.tsx, app/(public)/voor-opdrachtgevers/page.tsx.


## 2026-06-26 - Calendly inline-widget + Veilig zzp'en naar ZZP-pagina
- **Wat is gebouwd/gewijzigd:**
  - Inline Calendly-boekwidget toegevoegd op de contactpagina (sectie #kennismaking) via nieuw component CalendlyWidget. CALENDLY_URL gezet op https://calendly.com/detavianl/30min. "Boek een kennismaking"-knoppen verwijzen nu naar de widget (#kennismaking).
  - "Veilig zzp'en bij DetaVia"-sectie verplaatst van Academy naar de ZZP-pagina (/professionals/zzp), waar die logischer hoort.
- **Waarom:**
  - Klant leverde de Calendly-link en wilde een echte widget; en de ZZP-uitleg hoort onder de ZZP-pagina.
- **Geraakte bestanden:**
  - components/CalendlyWidget.tsx (nieuw), lib/site.ts, app/(public)/contact/page.tsx, app/(public)/professionals/academy/page.tsx, app/(public)/professionals/zzp/page.tsx.


## 2026-06-26 - Contact/Calendly, Over ons-bullet, Academy-cursussen + ZZP, algemene CTA's
- **Wat is gebouwd/gewijzigd:**
  - Contact + voor-opdrachtgevers: "Bel ons direct" vervangen door "Boek een kennismaking" met Calendly-link. Centrale CALENDLY_URL in site.ts (env NEXT_PUBLIC_CALENDLY_URL, fallback placeholder calendly.com/detavia/kennismaking, nog te vervangen).
  - Over ons: de bullet "Betrokken, ook na de start" naar boven gezet en aangescherpt (onderscheid: blijvend betrokken nadat de nieuwe collega is gestart).
  - Academy: sectie met 3 uitgelichte cursussen (Basiscursus Participatiewet, Het sociaal domein in vogelvlucht, De wet inburgering theorie en praktijk) + nieuwe sectie "Veilig zzp'en bij DetaVia" (concepttekst, Kevin vult aan).
  - CTA's gecontroleerd op gemeente-specifieke voorbeelden: placeholders algemener gemaakt; CTA's zelf waren al algemeen.
- **Waarom:**
  - Wijzigingen uit het overleg (Kevin-lijst). Calendly-URL en definitieve teksten/foto's + 3 vaste vacatures komen later van Kevin.
- **Geraakte bestanden:**
  - lib/site.ts, app/(public)/contact/page.tsx, app/(public)/voor-opdrachtgevers/page.tsx, app/(public)/over-ons/page.tsx, app/(public)/professionals/academy/page.tsx.


## 2026-06-26 - Vakgebieden hernoemd: Wmo->Leerplicht, Jeugd->Werk en inkomen
- **Wat is gebouwd/gewijzigd:**
  - Labels van vakgebieden hernoemd in alle 3 de VAKGEBIEDEN-maps (ats.ts, crm.ts, vacatures-demo.ts): wmo -> "Leerplicht", jeugd -> "Werk en inkomen". Interne sleutels (wmo/jeugd) en DB blijven ongemoeid, dus geen migratie nodig.
  - Alle losse teksten op de site bijgewerkt (home, voor-opdrachtgevers, vakgebieden, onze-diensten, over-ons, academy, contact-FAQ, menu), inclusief de vakgebied-kaarten met passende nieuwe beschrijvingen (leerplichtambtenaren/RMC; klantmanagers werk en inkomen).
  - SEO (layout keywords + knowsAbout), SITE_DESCRIPTION, ai-mailer system-prompt en e-mailfooter aangepast. Backend/admin-placeholders (mailer, deals, kandidaatformulier) ook bijgewerkt.
- **Waarom:**
  - Klant: leerplicht en werk en inkomen zijn de specialiteiten; overal op de site en in de backend doorvoeren.
- **Geraakte bestanden:**
  - lib/ats.ts, lib/crm.ts, lib/vacatures-demo.ts, lib/site.ts, lib/ai-mailer.ts, lib/email-template.ts, app/layout.tsx, app/(public)/{page, voor-opdrachtgevers/page, voor-opdrachtgevers/vakgebieden/page, voor-opdrachtgevers/onze-diensten/page, over-ons/page, professionals/academy/page, contact/page}.tsx, components/SiteHeader.tsx, components/CandidateForm.tsx, app/admin/mailer/page.tsx, app/admin/crm/deals/nieuw/page.tsx.


## 2026-06-26 - Resend-verzending ingebouwd (mailer)
- **Wat is gebouwd/gewijzigd:**
  - `resend`-pakket geinstalleerd; `src/lib/email.ts` met `sendMail` (from uit RESEND_FROM). Mailer-verzendactie (`sendEmailAction`) verstuurt de AI-HTML nu echt via Resend i.p.v. de stub.
  - Resend-key getest: send-only key, en detavia.nl is nog NIET geverifieerd, dus tot verificatie kan alleen naar backoffice@detavia.nl (account-eigenaar) gemaild worden. Default from = onboarding@resend.dev.
- **Waarom:**
  - Klant leverde de Resend API-key; mailer moet echt kunnen versturen.
- **Geraakte bestanden:**
  - `src/lib/email.ts` (nieuw), `src/app/admin/mailer/actions.ts`, package.json (resend). Keys lokaal in .env.local (gitignored); moeten nog in Vercel.


## 2026-06-24 - AI-mailer als Workster: tool-use bouwt volledige HTML
- **Wat is gebouwd/gewijzigd:**
  - AI-mailer omgebouwd naar de Workster-aanpak: Claude bouwt via een `build_email`-tool (forced tool_choice) het onderwerp + de volledige HTML-mail, in plaats van JSON-uit-tekst + sjabloon. Daardoor verwerkt hij de context concreet (namen, plaats, data, links).
  - Uitgebreide DetaVia-huisstijl systeem-prompt (licht thema, cobalt/geel, logo-img, CTA-knop, ondertekening Team DetaVia, footer, geen em-dashes, sociaal-domein tone). Model claude-sonnet-4-6.
  - Nette HTML-fallback zonder API-key (bron "sjabloon"). Mailerpagina toont/bewerkt nu de HTML direct (HTML-tab bewerkbaar, live voorbeeld in iframe).
- **Waarom:**
  - Klant wil de mailer exact zoals die van Workster (die volgt instructies/context wel op).
- **Geraakte bestanden:**
  - `src/lib/ai-mailer.ts`, `src/app/admin/mailer/page.tsx` (email-template.ts nu ongebruikt).


## 2026-06-24 - Marge-model: overhead + 33% nettowinst, recruiter = rest
- **Wat is gebouwd/gewijzigd:**
  - Recruiter-rekenregel vervangen door het echte model: bruto marge = verkoop - inkoop; overhead (10,6%: ziekteverzuim 4 + administratie 3,3 + juridisch 2 + verzekeringen 1,3) en nettowinst 33% van het verkooptarief; recruitervergoeding = wat overblijft (minimaal 0). Bij te lage marge: recruiter 0 + waarschuwing.
  - Bedrijfsbrede instellingen in tabel `marge_config` (migratie 0019, live, geseed met documentwaarden), alleen super-admin kan ze wijzigen (RLS + requireRole). Instellingenpagina /admin/instellingen/marge.
  - Verdiensten-pagina toont nu de volledige opbouw per plaatsing (verkoop/inkoop/marge/overhead/nettowinst/recruiter/uren/totaal); rol-gescoped (recruiter eigen, admin/super alles).
  - Plaatsing-formulier omgebouwd naar client met live marge-calculator (vul verkoop+inkoop, recruitervergoeding rolt eruit). Oude detavia_fee_pct-veld eruit.
  - Pure rekenlogica in `marge-calc.ts` (client+server), server-loader in `marge.ts`. Oude `verdiensten.ts` verwijderd.
- **Waarom:**
  - Klant leverde de echte tariefopbouw; percentages vast en alleen door super-admin te wijzigen.
- **Geraakte bestanden:**
  - `supabase/migrations/0019_marge_config.sql`, `src/lib/marge-calc.ts` + `marge.ts`, `src/app/admin/instellingen/marge/{page,actions}.tsx/ts` (nieuw), `src/app/admin/verdiensten/page.tsx`, `src/components/PlacementForm.tsx` (nieuw), `src/app/admin/plaatsingen/nieuw/page.tsx`, `src/app/admin/plaatsingen/actions.ts`.


## 2026-06-23 - AI-mailer standaard op Sonnet 4.6
- **Wat is gebouwd/gewijzigd:**
  - Standaardmodel van de AI-mailer van Haiku 4.5 naar `claude-sonnet-4-6` gezet (betere mails). ANTHROPIC-sleutel getest (werkt) en lokaal in .env.local gezet (gitignored). Voor live moet de sleutel nog in Vercel.
- **Waarom:**
  - Klant wil de mailer AI-slim maken met een eigen Anthropic-account/sleutel.
- **Geraakte bestanden:**
  - `src/lib/ai-mailer.ts` (+ lokale .env.local, niet in git).


## 2026-06-23 - Over ons-pagina professioneler gemaakt
- **Wat is gebouwd/gewijzigd:**
  - Over ons herzien: hero is nu twee koloms (tekst + beeld + CTA's) i.p.v. een kaal leeg cobalt-vlak; foto-uitsnedes gefixt (aspect-[4/3] i.p.v. liggende foto in staand kader); kernwaarden-blok (4 cards), een stats-blok en een afsluitende CTA toegevoegd zodat de pagina compleet oogt.
- **Waarom:**
  - De pagina oogde kaal/onaf bij het laden (leeg blauw vlak, rare foto-uitsnede, te dun).
- **Geraakte bestanden:**
  - `src/app/(public)/over-ons/page.tsx`.


## 2026-06-21 - Verdiensten privé: plaatsingen afgeschermd voor recruiters
- **Wat is gebouwd/gewijzigd:**
  - Talentpool blijft gedeeld; de tarief-kolom heet nu "Tarief (indicatie)" (het echte tarief zit per plaatsing).
  - Plaatsingen-lijst en -detail tonen tarief/kostprijs/marge nu alleen aan super-admin/admin en aan de recruiter die eigenaar is van de kandidaat. Een recruiter die een plaatsing van een ander opent, wordt naar /geen-toegang gestuurd. Zo blijven verdiensten privé.
  - Verdiensten-pagina was al rol-gescoped en rekent met het echte plaatsingstarief (niet de talentpool-indicatie).
- **Waarom:**
  - Talentpool is gedeeld en het tarief daar is indicatief, maar verdiensten/marges moeten privé blijven per recruiter.
- **Geraakte bestanden:**
  - `src/app/admin/plaatsingen/page.tsx`, `src/app/admin/plaatsingen/[id]/page.tsx`, `src/components/TalentpoolTable.tsx`.


## 2026-06-21 - Recruiter-verdiensten per kandidaat (deals) + rol-zicht
- **Wat is gebouwd/gewijzigd:**
  - Nieuwe pagina /admin/verdiensten: per kandidaat/plaatsing toont het waarvoor weggezet, kandidaat-uurloon (kostprijs), tarief, marge, DetaVia-fee en het recruiter-deel per uur, plus goedgekeurde uren en recruiter-totaal. KPI's bovenaan.
  - Rekenregel: marge = uurtarief - kostprijs; DetaVia houdt een fee (% van marge, default 31%, per plaatsing instelbaar via nieuw kolom `detavia_fee_pct`, migratie 0018 live); recruiter krijgt de rest.
  - Rol-zicht: een recruiter ziet alleen plaatsingen van zijn eigen kandidaten (candidate.eigenaar = ingelogde recruiter); admin/super-admin zien iedereen, met recruiter-filter.
  - Fee-veld toegevoegd aan het plaatsing-formulier; nav-item "Verdiensten".
- **Waarom:**
  - Recruiters verdienen per uur mee; ze willen per kandidaat zien wat het oplevert, super-admin ziet iedereen.
- **Geraakte bestanden:**
  - `supabase/migrations/0018_recruiter_fee.sql`, `src/lib/verdiensten.ts`, `src/app/admin/verdiensten/page.tsx` (nieuw), `src/components/AdminNav.tsx`, `src/app/admin/plaatsingen/actions.ts`, `src/app/admin/plaatsingen/nieuw/page.tsx`.


## 2026-06-21 - Vacatures dupliceren (clone)
- **Wat is gebouwd/gewijzigd:**
  - Actie `cloneVacature`: maakt een kopie van een vacature als concept (status gesloten, titel "(kopie)", nieuwe slug, bron/extern_id leeg, top uit) en opent de bewerkpagina. "Dupliceer"-knop op de vacaturelijst (per rij) en op de bewerkpagina.
- **Waarom:**
  - Klant wil vacatures kunnen clonen.
- **Geraakte bestanden:**
  - `src/app/admin/vacatures/actions.ts`, `src/app/admin/vacatures/page.tsx`, `src/components/VacatureForm.tsx`.


## 2026-06-21 - Kandidaten: bewerken en verwijderen
- **Wat is gebouwd/gewijzigd:**
  - Kandidaten konden niet bewerkt/verwijderd worden. Nu wel: herbruikbaar `CandidateForm` (nieuw + bewerken), bewerk-pagina `/admin/kandidaten/[id]/bewerken`, acties `updateCandidate` en `deleteCandidate` (verwijdert ook gekoppelde activiteiten/applications/cvs).
  - "Bewerken" + "Verwijderen" (met bevestiging) op de kandidaat-detailpagina, en per rij in de talentpool (Bewerk-link + Verwijder).
- **Waarom:**
  - In de talentpool ontbrak bewerken/verwijderen van een kandidaat.
- **Geraakte bestanden:**
  - `src/components/CandidateForm.tsx` + `DeleteCandidateButton.tsx` (nieuw), `src/app/admin/kandidaten/nieuw/page.tsx`, `src/app/admin/kandidaten/[id]/bewerken/page.tsx` (nieuw), `src/app/admin/kandidaten/actions.ts`, `src/app/admin/kandidaten/[id]/page.tsx`, `src/components/TalentpoolTable.tsx`.


## 2026-06-21 - Notities: bewerken/verwijderen (alleen auteur) + nieuw-form opgeschoond
- **Wat is gebouwd/gewijzigd:**
  - Bij elke notitie staan nu een "Bewerk"- en "Verwijder"-knop, maar alleen bij je eigen notities (auteur). Bewerken gaat inline (tekstvlak), afgedwongen op auteur via de query (author-kolom = ingelogde gebruiker). Werkt voor kandidaat, bedrijf en de generieke entiteiten.
  - Note-loaders geven nu note-id + `mine` (ben ik de auteur) mee; nieuwe acties `editNote` / `deleteNote`.
  - "Nieuwe kandidaat"-pagina: het oude losse notitie-veld (candidates.notitie) is vervangen; een ingevulde "Eerste notitie" wordt nu als echte notitie in het nieuwe notities-systeem (candidate_activities) opgeslagen en verschijnt in de feed.
- **Waarom:**
  - Klant wil notities kunnen bewerken/verwijderen (alleen eigen), en het oude losse notitie-veld op de nieuw-pagina moest weg.
- **Geraakte bestanden:**
  - `src/app/admin/activity-actions.ts`, `src/lib/notes.ts`, `src/components/QuickNotes.tsx`, `src/app/admin/kandidaten/[id]/page.tsx`, `src/app/admin/crm/bedrijven/[id]/page.tsx`, `src/app/admin/kandidaten/actions.ts`, `src/app/admin/kandidaten/nieuw/page.tsx`.


## 2026-06-21 - Notities overal mogelijk (audit + generieke notes)
- **Wat is gebouwd/gewijzigd:**
  - Audit: notities waren alleen mogelijk bij kandidaten en bedrijven. Nu ook bij plaatsingen, facturen en vacatures.
  - Generieke `notes`-tabel (migratie 0017, live) met RLS (alleen admin). Generieke loader `src/lib/notes.ts` en uitgebreide `addNote`-actie (candidate/company houden hun activiteiten-tabellen; placement/invoice/vacature gebruiken de notes-tabel). QuickNotes-entitytype verbreed.
  - Notities-sectie toegevoegd aan plaatsing-, factuur- en vacature(bewerk)-detailpagina's.
- **Waarom:**
  - Klant wil overal waar het zinvol is een notitie kunnen maken.
- **Geraakte bestanden:**
  - `supabase/migrations/0017_notes.sql`, `src/lib/notes.ts`, `src/app/admin/activity-actions.ts`, `src/components/QuickNotes.tsx`, `src/app/admin/plaatsingen/[id]/page.tsx`, `src/app/admin/facturen/[id]/page.tsx`, `src/app/admin/vacatures/[id]/page.tsx`.


## 2026-06-21 - Notities exact zoals Workster 2.0 + tarief-filter fix
- **Wat is gebouwd/gewijzigd:**
  - Workster 2.0 (~/Desktop/Workster2.0, alleen gelezen) gebruikt `ApplicationNotes`: lijst bovenaan met per notitie auteur + datum/tijd + tekst (whitespace-pre-line), daaronder een tekstvlak met "Notitie toevoegen" + tekenteller (max 4000). DetaVia's `QuickNotes` (kandidaat + bedrijf) net zo gemaakt: was een enkele invoerregel, nu een tekstvlak met dezelfde opbouw (lijst boven, auteur + datum/tijd, teller, Cmd/Ctrl+Enter, optimistic toevoegen). Data blijft `candidate_activities` (type=notitie).
  - Talentpool-filter: tarief/uren-velden liepen uit de smalle zijbalk; opgelost met w-full/min-w-0.
- **Waarom:**
  - Klant wil notities net als in Workster 2.0 (tekstvlak + feed met auteur/tijd i.p.v. enkele regel). Tarief-veld stak uit.
- **Geraakte bestanden:**
  - `src/components/QuickNotes.tsx`, `src/components/TalentpoolTable.tsx`. (Workster2.0 alleen gelezen, niet gewijzigd.)


## 2026-06-21 - Talentpool: filteren op meerdere vlakken
- **Wat is gebouwd/gewijzigd:**
  - Talentpool (kandidaten) heeft nu een filter-zijbalk op meerdere vlakken: zoektekst (naam/functie/expertise/opleiding/plaats), vakgebied (multi), niveau (multi), status, regio/plaats, beschikbaar uiterlijk (datum), min. uren/week, max. tarief, en rijbewijs. Met telling per facet en "Wis filters". Tabel toont nu ook Regio en Uren.
  - Kandidaten-query uitgebreid met regio, woonplaats, uren_beschikbaar, rijbewijs, opleidingsniveau.
- **Waarom:**
  - Klant wil in de talentpool (cv-/kandidatendatabase) op meerdere vlakken kunnen filteren.
- **Geraakte bestanden:**
  - `src/components/TalentpoolTable.tsx`, `src/app/admin/kandidaten/page.tsx`.


## 2026-06-21 - Inactief/actief als toggle, pas opslaan bij Opslaan
- **Wat is gebouwd/gewijzigd:**
  - De "Op inactief zetten"-knop sloeg direct op (ging meteen live). Nu is het een toggle die alleen de status (en de preview) lokaal aanpast; de wijziging gaat pas naar de site bij Opslaan.
  - Knop wisselt van label: "Op inactief zetten" (bij open) <-> "Op actief zetten" (bij gesloten). Status-select is hieraan gekoppeld. Preview-tekst verduidelijkt: "Verschijnt pas op de site nadat je op Opslaan klikt."
- **Waarom:**
  - Klant wil dat wijzigingen pas na Opslaan op de site komen, en dat de inactief-knop omschakelt naar actief.
- **Geraakte bestanden:**
  - `src/components/VacatureForm.tsx`.

## 2026-06-21 - Live preview bij vacature bewerken/aanmaken
- **Wat is gebouwd/gewijzigd:**
  - Rechts in het vacatureformulier een live preview die 1:1 toont hoe de vacature op de site komt (cobalt hero met titel/kerngegevens/knoppen, "Over deze opdracht", "Wat ga je doen", "Wat je meebrengt", zijbalk met vacaturegegevens), in een nep-browserframe. Werkt mee terwijl je typt.
  - Nieuwe component `VacaturePreview`; `VacatureForm` omgebouwd naar client-component dat de preview live bijwerkt (FormData on input). Inactief-status toont een INACTIEF-label in de preview.
- **Waarom:**
  - Klant wil tijdens het invullen direct zien hoe de vacature eruit komt te zien.
- **Geraakte bestanden:**
  - `src/components/VacaturePreview.tsx` (nieuw), `src/components/VacatureForm.tsx`.

## 2026-06-21 - Vacature bewerken: salaris-periode, auto-inactief, inactief-knop
- **Wat is gebouwd/gewijzigd:**
  - Migratie 0016 (live): salaris_min/max naar numeric (centen mogelijk, bv. uurtarief 62,50), nieuwe kolommen `salaris_periode` ('uur'/'week'/'4weken'/'maand') en `inactief_op` (date).
  - Beheerformulier: keuze "Salaris per" (uur/week/4 weken/maand), datumveld "Automatisch inactief op", en een knop "Op inactief zetten" (nieuwe actie `deactivateVacature`). Salarisvelden accepteren centen.
  - Weergave: nieuwe helper `salarisLabel(s, periode)` toont "€ x - € y per uur/week/4 weken/maand" (of "Tarief in overleg"), en `urenLabel` toont "28 uur" i.p.v. "28-28 uur". Toegepast op detailpagina, overzicht en homepage. JobPosting-structured-data krijgt de juiste eenheid (HOUR/WEEK/MONTH).
  - Loader verbergt automatisch vacatures waarvan `inactief_op` is verstreken (geen cron nodig).
- **Waarom:**
  - Klant wil per uur/week/4 weken/maand kunnen kiezen, een vacature kunnen inplannen om automatisch inactief te worden, en een directe inactief-knop.
- **Geraakte bestanden:**
  - `supabase/migrations/0016_vacature_salaris_periode.sql`, `src/lib/vacatures-demo.ts`, `src/lib/vacatures.ts`, `src/components/VacatureForm.tsx`, `src/app/admin/vacatures/actions.ts`, `src/app/(public)/vacatures/[id]/page.tsx`, `src/components/VacatureZoeker.tsx`, `src/app/(public)/page.tsx`.

## 2026-06-21 - Flextender-sync verfijnd: opmaak, eisen, snelheid
- **Wat is gebouwd/gewijzigd:**
  - Taakomschrijving uit Flextender behoudt nu alinea-opmaak (block-tags -> alinea's, als `<p>`-HTML), en de stray "Opdracht"-kop is weg.
  - Bredere herkenning van de eisen-kop ("Vereisten" en "Minimumeisen / knock-outcriteria"), waardoor 22/28 vacatures een nette eisen-lijst krijgen; bij de rest toont de pagina alleen de omschrijving (geen lege sectie).
  - Sync-snelheid/robuustheid: per-request timeouts (AbortSignal) + meer parallelisme. Runtime van ~54s (soms 504-timeout) naar ~14s.
- **Waarom:**
  - Visuele QA op een gesynchroniseerde vacature toonde platte tekst, een ontbrekende eisen-lijst en een function-timeout.
- **Geraakte bestanden:**
  - `src/lib/flextender.ts`.

## 2026-06-21 - Salarisweergave "Tarief in overleg" bij ontbrekend salaris
- **Wat is gebouwd/gewijzigd:**
  - Nieuwe helper `salarisLabel`: toont "Tarief in overleg" als er geen maandsalaris is (bv. Flextender-uurtarief-opdrachten), in plaats van "€ 0 - € 0 p/m". Toegepast op de vacaturekaarten en de detailpagina (hero + zijbalk).
- **Waarom:**
  - De gesynchroniseerde Flextender-vacatures hebben geen maandsalaris en toonden lelijk "€ 0 - € 0".
- **Geraakte bestanden:**
  - `src/lib/vacatures-demo.ts`, `src/components/VacatureZoeker.tsx`, `src/app/(public)/vacatures/[id]/page.tsx`.

## 2026-06-21 - Flextender auto-sync (scraper) + vriendelijke 404
- **Wat is gebouwd/gewijzigd:**
  - Uitgezocht en bevestigd dat Flextender geen publieke feed heeft, maar dat de opdrachten serverside (zonder browser) op te halen zijn: lijst via hun WordPress-AJAX (`action=kbs_flx_searchjobs`, token uit de pagina), details per `/opdracht?aanvraagnr=`.
  - `src/lib/flextender.ts`: haalt lijst + details op, filtert op sociaal domein (vakgebied-detectie), parseert titel/uren/start/duur/regio/omschrijving/eisen.
  - `/api/sync-flextender` (POST/GET, beveiligd met service-role bearer): synchroniseert sociaal-domein opdrachten naar de DB (bron=flextender, extern_id=aanvraagnr), werkt bestaande bij en verwijdert opdrachten die niet meer op Flextender staan. Handmatige vacatures (bron leeg) blijven ongemoeid.
  - Migratie 0015 (live gedraaid): kolommen `bron` + `extern_id`.
  - Vriendelijke 404-pagina in DetaVia-stijl (cobalt, geel logo-watermerk, knoppen naar home/vacatures/contact).
  - Supabase pg_cron + pg_net ingesteld: job 'flextender-sync' draait '0 */4 * * *' (elke 4 uur) en POST naar /api/sync-flextender met de service-role bearer. End-to-end getest: 28 sociaal-domein opdrachten gesynct, pg_net kreeg status 200.
  - Auth-fix: Vercel had de service-role key met een trailing newline opgeslagen; sync-auth en admin-client trimmen nu (robuust).
- **Waarom:**
  - Klant wil automatisch elke 4 uur Flextender-vacatures (sociaal domein) plaatsen en verdwenen opdrachten verwijderen; plus een mooiere 404.
- **Geraakte bestanden:**
  - nieuw: `src/lib/flextender.ts`, `src/app/api/sync-flextender/route.ts`, `src/app/not-found.tsx`, `supabase/migrations/0015_vacature_bron.sql`.

## 2026-06-21 - XML-importer verbeterd (sociaal-domein filter, opmaak, eisen)
- **Wat is gebouwd/gewijzigd:**
  - Geconstateerd dat de Workster-feed (https://workster.nl/feed/joof, 593 technische vacatures) wholesale binnenkwam en meeste als "wmo" werden gelabeld (brand-mismatch). 593 verkeerde imports opgeruimd in de DB; alleen 1Stroom blijft.
  - Importer-parser herschreven: herkent sociaal domein (vakgebied-detectie), zet `isSociaal`; behoudt de HTML-opmaak van de beschrijving; haalt eisen uit de bullet-lijst (na een eisen-kop).
  - Import-actie: nieuwe optie "Alleen sociaal domein importeren" (default aan) die niet-passende vacatures overslaat; beschrijving wordt server-side gesanitized (sanitize-html) opgeslagen; eisen meegenomen; melding toont gevonden/toegevoegd/overgeslagen.
  - Detailpagina rendert `taken` nu als opgemaakte HTML (lijsten/alinea's) en toont de generieke "Wat je meebrengt" alleen als er geen eisen en geen rijke HTML is.
- **Waarom:**
  - Klant testte de importer met de Workster-feed en vroeg wat beter kan; belangrijkste was het sociaal-domein-filter + opmaak/eisen behouden.
- **Geraakte bestanden:**
  - `src/lib/xml-import.ts`, `src/app/admin/vacatures/actions.ts`, `src/app/admin/vacatures/import/page.tsx`, `src/app/(public)/vacatures/[id]/page.tsx`.

## 2026-06-21 - 1Stroom echt, demo weg, SEO, XML-feed export + importer, logo-watermerk
- **Wat is gebouwd/gewijzigd:**
  - 1Stroom-vacature (Medewerker Sociaal loket) als echte rij in de live DB gezet; demo-vacatures verwijderd van de live site (gedeelde loader `src/lib/vacatures.ts` toont in productie alleen DB-vacatures, demo enkel in demo-modus). Homepage "uitgelichte vacatures" laadt nu echte vacatures.
  - Schone slug-URL's voor vacatures (/vacatures/<slug>), detailpagina matcht op slug of id.
  - SEO: JobPosting structured data (Google Jobs) op vacature-detail, canonicals op vacatures/home, sitemap uitgebreid met de nieuwe pagina's + alle open vacatures.
  - Indeed-compatibele XML-feed export: `/feeds/vacatures.xml` (route handler, alle open vacatures).
  - XML-feed importer in beheer: `/admin/vacatures/import` (feed-URL of geplakte XML), parser `src/lib/xml-import.ts` (Indeed-stijl velden, vakgebied-gok, uren/salaris parsing), upsert op slug (dubbele overslaan). Knop "Importeren (XML)" op de vacaturelijst.
  - Homepage STATEMENT-watermerk: "DetaVia"-tekst vervangen door het witte logo (subtieler, mooier).
- **Waarom:**
  - Klant wil 1Stroom echt + demo weg, een SEO-audit met fixes, een Indeed-stijl feed-export en een feed-importer, plus het logo als achtergrond i.p.v. de tekst.
- **Geraakte bestanden:**
  - nieuw: `src/lib/vacatures.ts`, `src/lib/xml-import.ts`, `src/app/feeds/vacatures.xml/route.ts`, `src/app/admin/vacatures/import/page.tsx`; gewijzigd: `src/app/(public)/page.tsx`, `vacatures/page.tsx`, `vacatures/[id]/page.tsx`, `sitemap.ts`, `src/components/VacatureZoeker.tsx`, `src/app/admin/vacatures/{actions.ts,page.tsx}`, `src/lib/vacatures-demo.ts`.

## 2026-06-21 - Beheer: rijke vacaturevelden invulbaar
- **Wat is gebouwd/gewijzigd:**
  - Migratie 0014 (gedraaid op live Supabase): kolommen taken (text), eisen (text[]), opdrachtgever, startdatum, duur op de vacatures-tabel.
  - Beheerformulier (VacatureForm) uitgebreid met: Korte omschrijving, Wat ga je doen (taken), Wat je meebrengt (eisen, een per regel), Opdrachtgever (weergavenaam), Startdatum, Duur. Bewerk-pagina laadt ze automatisch (select *).
  - saveVacature-actie slaat de velden op; eisen-textarea wordt per regel naar een array gesplitst.
  - Publieke detailpagina-loader mapt de nieuwe DB-kolommen, zodat zelf geplaatste vacatures dezelfde rijke detailpagina krijgen (met fallback naar generieke tekst als velden leeg zijn).
- **Waarom:**
  - Klant wil dit soort vacature-info (zoals de 1Stroom-vacature) zelf via het beheer kunnen invullen.
- **Geraakte bestanden:**
  - `platform/supabase/migrations/0014_vacature_details.sql` (nieuw), `platform/src/components/VacatureForm.tsx`, `platform/src/app/admin/vacatures/actions.ts`, `platform/src/app/(public)/vacatures/[id]/page.tsx`.

## 2026-06-21 - Echte vacature toegevoegd (Medewerker Sociaal loket, 1Stroom)
- **Wat is gebouwd/gewijzigd:**
  - Vacature-model uitgebreid met optionele rijke velden: taken (wat ga je doen), eisen (string[]), opdrachtgever, startdatum, duur.
  - Echte vacature toegevoegd op basis van flextender-opdracht 30626: "Medewerker Sociaal loket" bij Gemeenschappelijke regeling 1Stroom (Duiven/Gelderland), 28-36 uur, start 21 juli 2026, met opdrachtomschrijving en knock-out eisen. Vertaald naar DetaVia-stijl/tekst (geen flextender-jargon).
  - Detailpagina toont nu "Wat ga je doen?" (taken) en de echte eisen bij "Wat je meebrengt"; zijbalk toont opdrachtgever, startdatum en duur. Vacatures zonder die velden vallen terug op de generieke tekst.
- **Waarom:**
  - Klant wilde een concrete vacature (flextender 30626) in de nieuwe DetaVia-stijl tonen.
- **Geraakte bestanden:**
  - `platform/src/lib/vacatures-demo.ts`, `platform/src/app/(public)/vacatures/[id]/page.tsx`.

## 2026-06-21 - Vacature-detailpagina (unique.nl-opzet, DetaVia-stijl)
- **Wat is gebouwd/gewijzigd:**
  - Nieuwe route `/vacatures/[id]`: detailpagina in de opzet van unique.nl maar in DetaVia-huisstijl. Cobalt hero met breadcrumb, titel, kerngegevens (plaats/uren/salaris/type) en knoppen (Solliciteer direct/Stel een vraag). Hoofdkolom met "Over deze opdracht", "Wat je meebrengt", "Wat DetaVia jou biedt" + tussen-CTA. Sticky zijbalk met vacaturegegevens, solliciteerknop en contactpersoon-spot (teamfoto-placeholder). Onderaan "Vergelijkbare vacatures" (zelfde vakgebied).
  - Data via Supabase (status=open) met DEMO_VACATURES-fallback; notFound() als id onbekend.
  - VacatureZoeker-kaarten linken nu naar de detailpagina (titel + "Bekijk vacature"), plus "Direct solliciteren".
- **Waarom:**
  - Klant wil dat een vacature een echte detailpagina opent, naar voorbeeld van unique.nl, in DetaVia-stijl.
- **Geraakte bestanden:**
  - `platform/src/app/(public)/vacatures/[id]/page.tsx` (nieuw), `platform/src/components/VacatureZoeker.tsx`.

## 2026-06-18 - Pagina's verrijkt: teamfoto-spots + inline formulieren
- **Wat is gebouwd/gewijzigd:**
  - Naar voorbeeld van joinuz.nl/zelfstandige-en-joinuz: meer CTA's, inline formulieren en teamfoto-spots toegevoegd aan de nieuwe pagina's.
  - Nieuwe herbruikbare componenten: `TeamSpots` (nette placeholder-plekken voor teamfoto's, met [Naam]/[Functie]) en `InlineContactForm` (formulier dat via submitContact als bericht binnenkomt; soort professional/opdrachtgever, optioneel organisatie-veld).
  - Toegepast op: ZZP (team + formulier), Werken bij DetaVia (team + formulier), Academy (formulier), Onze diensten (accountteam + aanvraagformulier), Werving & selectie / Vakgebieden / Certificering & CAO (aanvraagformulier).
- **Waarom:**
  - Klant wil pagina's met genoeg CTA's, een formulier ter plekke en plekken voor teamfoto's, joinuz als voorbeeld.
- **Geraakte bestanden:**
  - `platform/src/components/TeamSpots.tsx` + `InlineContactForm.tsx` (nieuw); de 7 nieuwe pagina's onder `(public)/professionals/*` en `(public)/voor-opdrachtgevers/*`.

## 2026-06-18 - Menu-items worden eigen pagina's (7 nieuwe pagina's)
- **Wat is gebouwd/gewijzigd:**
  - De uitklap-items van Professionals en Opdrachtgevers wijzen nu naar echte aparte pagina's i.p.v. anchors. Geinspireerd op joinuz.nl (droombaan/jij-en-joinuz/academy/onze-diensten/certificering-cao), maar in DetaVia-stijl/kleuren en alleen sociaal domein.
  - Nieuwe pagina's: `/professionals/werken-bij-detavia`, `/professionals/academy`, `/professionals/zzp`; `/voor-opdrachtgevers/onze-diensten`, `/vakgebieden`, `/werving-selectie`, `/certificering-cao`.
  - Herbruikbare componenten `PageHero` (cobalt hero) en `PageCta` (cobalt CTA-band, gele knop) voor consistentie.
  - SiteHeader-menu's bijgewerkt naar de nieuwe routes (Professionals: Vacatures/Werken bij DetaVia/Academy/ZZP/Open sollicitatie; Opdrachtgevers: Onze diensten/Vakgebieden/Werving & selectie/Certificering & CAO/Contact).
- **Waarom:**
  - Klant wil dat de menu-items losse pagina's met eigen content worden, joinuz.nl als voorbeeld, DetaVia-kleuren behouden.
- **Geraakte bestanden:**
  - 7x nieuwe `page.tsx` onder `(public)/professionals/*` en `(public)/voor-opdrachtgevers/*`; `platform/src/components/PageHero.tsx` + `PageCta.tsx` (nieuw); `platform/src/components/SiteHeader.tsx`.

## 2026-06-18 - CTA voor opdrachtgevers onder de logobalk
- **Wat is gebouwd/gewijzigd:**
  - Onder de opdrachtgever-logobalk een CTA toegevoegd ("Sluit je aan bij deze organisaties") met hoofdknop "Vraag een professional aan" (/voor-opdrachtgevers) en zachte link "Of neem contact op" (/contact). Benut de social proof van de logo's.
  - CTA in een zacht licht cobalt-getint bandje (border-cobalt/10, bg-cobalt/[0.05], afgerond), logo's blijven clean op wit. Gekozen na advies: logo-wall hoort op wit, alleen de CTA krijgt subtiel accent (de norm).
- **Waarom:**
  - Gebruiker wilde een slimme opdrachtgever-CTA op die plek; aanbeveling was de strakke regel direct onder de logo's.
- **Geraakte bestanden:**
  - `platform/src/components/OpdrachtgeverMarquee.tsx`.

## 2026-06-18 - Cijfers vervangen door bewegende opdrachtgever-logobalk
- **Wat is gebouwd/gewijzigd:**
  - De statistiek-sectie (100% / 100+ / 50+ / 9,5) op de homepage vervangen door een bewegende logobalk (marquee) van echte opdrachtgevers.
  - 10 logo's gedownload van detavia.nl/over-ons naar `public/img/opdrachtgevers/` (gemeenten Alphen aan den Rijn, Dronten, Rijswijk, Soest, Wijk bij Duurstede, Zeist; Provinciehuis Flevoland; Ferm Werk; Werkbedrijf De Binnenbaan; Uitvoeringsorganisatie BBS).
  - Nieuwe component `OpdrachtgeverMarquee.tsx`: pure-CSS oneindige marquee, logo's in volle kleur (op verzoek), pauzeert bij hover, respecteert prefers-reduced-motion. Keyframes in globals.css (60s). Kop "Vertrouwd door, gemeenten en organisaties in het sociaal domein".
  - Geen-gaten-fix: set dubbel per groep zodat elke groep breder is dan het scherm; en het witte (dus op witte achtergrond onzichtbare) logo Gemeente Wijk bij Duurstede omgekleurd naar donker (#1A1A1A). Alle 10 logo's geverifieerd zichtbaar.
- **Waarom:**
  - Klant wil de cijfers vervangen door de echte opdrachtgevers, bewegend en in DetaVia-stijl.
- **Geraakte bestanden:**
  - `platform/src/components/OpdrachtgeverMarquee.tsx` (nieuw), `platform/src/app/(public)/page.tsx`, `platform/src/app/globals.css`, `platform/public/img/opdrachtgevers/*.svg` (10 logo's).

## 2026-06-18 - Logo naar 48px (betere balans)
- **Wat is gebouwd/gewijzigd:**
  - Header-logo van h-14 (56px) naar h-12 (48px), ~55% van de 88px header. Na meting/screenshot oordeelde dat 56px net te dominant was.
- **Waarom:**
  - Gebruiker vroeg eerlijke mening; 56px oogde te groot, 48px is in betere balans met het menu.
- **Geraakte bestanden:**
  - `platform/src/components/SiteHeader.tsx`.

## 2026-06-18 - Echte oorzaak klein logo gevonden en opgelost (flex-shrink)
- **Wat is gebouwd/gewijzigd:**
  - Met Chrome DevTools (CDP) gemeten dat de logo-box in de header werd afgekapt tot ~47px breed: de flex-header liep over (mega-menu + 3 CTA-knoppen), waardoor het logo-flexitem kromp en Tailwind's `max-width:100%` het logo verkleinde. Niet de SVG of h-14 (die was correct 56px).
  - Fix: logo-`Link` `shrink-0`, img `w-auto max-w-none` (krimpt/kapt niet meer). Plus de dubbele "Vacatures"-knop uit de header verwijderd (stond al in het menu) om de balk minder vol te maken.
  - Onderweg de logo-SVG's al een vaste maat 108x30 gegeven (i.p.v. 100%).
- **Waarom:**
  - Logo bleef klein ondanks h-14; echte oorzaak was flex-overloop, niet de logogrootte.
- **Geraakte bestanden:**
  - `platform/src/components/SiteHeader.tsx`, `platform/public/img/logo_blue.svg`, `logo_black.svg`, `logo_white.svg`.

## 2026-06-18 - Header-logo vergroot + SVG intrinsieke maat gefixt
- **Wat is gebouwd/gewijzigd:**
  - Header-logo vergroot van h-[30px] naar h-14 (56px), header-hoogte 78px -> 88px.
  - Oorzaak "logo blijft klein" onderzocht: live HTML was al h-14 (dus deels browsercache), maar de logo-SVG's hadden `width="100%" height="100%"` i.p.v. een vaste maat, waardoor de intrinsieke grootte/verhouding onbetrouwbaar is. Opgelost door alle drie de varianten (logo_blue/black/white) een vaste `width="108" height="30"` te geven.
- **Waarom:**
  - Gebruiker vond het logo te klein en het bleef klein ogen; vaste SVG-maat maakt schaling met h-14 betrouwbaar.
- **Geraakte bestanden:**
  - `platform/src/components/SiteHeader.tsx`, `platform/public/img/logo_blue.svg`, `logo_black.svg`, `logo_white.svg`.

## 2026-06-18 - Aanscherping "uitsluitend sociaal domein" + CTA-fix
- **Wat is gebouwd/gewijzigd:**
  - Over-ons: zin verwijderd die DetaVia breder maakte ("specialisten uit andere branches") en herschreven naar volledige focus op uitsluitend het sociaal domein.
  - SEO-omschrijving (`src/lib/site.ts`) aangescherpt: "uitsluitend gespecialiseerd in het sociaal domein".
  - Vacaturefilter-label "Branches" hernoemd naar "Vakgebied" (klopt beter, geen suggestie van andere sectoren).
  - "Personeel nodig?"-CTA (header + mobiele balk) op een regel gezet met whitespace-nowrap; brak eerder over twee regels.
- **Waarom:**
  - Klant benadrukt dat DetaVia uitsluitend het sociaal domein doet; site mocht nergens breder ogen. CTA brak lelijk over twee regels.
- **Geraakte bestanden:**
  - `platform/src/app/(public)/over-ons/page.tsx`, `platform/src/lib/site.ts`, `platform/src/components/VacatureZoeker.tsx`, `platform/src/components/SiteHeader.tsx`, `platform/src/components/MobileCtaBar.tsx`.

## 2026-06-18 - Commit-auteur omgezet naar Detavianl (Vercel-deploy gefixt)
- **Wat is gebouwd/gewijzigd:**
  - Alle commits in de historie herschreven van `Badr <badr@workster.nl>` naar `Detavianl <294629694+Detavianl@users.noreply.github.com>` via git filter-branch, en git config (lokaal) op die identiteit gezet voor toekomstige commits. Daarna force-push naar Detavianl/Detavia.
- **Waarom:**
  - Vercel (Hobby) blokkeerde de deploy omdat de commit-auteur (badr@workster.nl, gekoppeld aan het Workster/badr-png-account) geen lid is van het Detavia-Vercel-project. Met de Detavianl-identiteit is de deploy geautoriseerd.
- **Geraakte bestanden:**
  - Geen code; alleen git-historie (auteur/committer) en lokale git-config.

## 2026-06-18 - Mega-menu (Professionals + Opdrachtgevers) in DetaVia-stijl
- **Wat is gebouwd/gewijzigd:**
  - SiteHeader omgebouwd naar client-component met twee uitklapbare mega-menu's (hover/klik), geinspireerd op JoinUz maar in DetaVia-stijl: linker cobalt feature-blok met gele CTA + rechter lijst met omschrijvingen.
  - "Professionals": Vacatures, Open sollicitatie, Verhalen & kennis, Over DetaVia.
  - "Opdrachtgevers": Wat we doen, Vakgebieden, Onze diensten, Certificering & CAO, Contact (anchors naar /voor-opdrachtgevers + /contact).
  - `/voor-opdrachtgevers` uitgebreid met secties + anchors: #wat-we-doen, #vakgebieden (6 vakgebieden), #diensten (detachering/werving/interim), #cao (certificering & cao met checklist). `scroll-mt-24` tegen de sticky header.
- **Waarom:**
  - Klant wil een uitklapmenu zoals JoinUz, met dezelfde soort secties maar op de DetaVia-manier, voor zowel professionals als opdrachtgevers.
- **Geraakte bestanden:**
  - `platform/src/components/SiteHeader.tsx` (herschreven), `platform/src/app/(public)/voor-opdrachtgevers/page.tsx` (nieuwe secties + anchors).

## 2026-06-18 - Live gezet op eigen Supabase + Vercel, stats-kleur aangepast
- **Wat is gebouwd/gewijzigd:**
  - Supabase-project "Detavianl's Project" (EU) ingericht via de Management API: 13 migraties gedraaid (16 tabellen + storage-buckets blog/cvs), keys opgehaald, super-admin geseed (badr@workster.nl, super_admin).
  - Auth Site URL + redirect-allowlist gezet op https://detavia.vercel.app.
  - Site is live op https://detavia.vercel.app (eigen Detavia-Vercel, via GitHub auto-deploy). Geverifieerd: home/voor-opdrachtgevers/vacatures = 200, login toont echt formulier (demo uit).
  - Home: alle vier de statistiek-cijfers nu lichtblauw (arctic) i.p.v. afwisselend geel/blauw.
- **Waarom:**
  - Klant gaat live met eigen infra; gebruiker wilde de cijfers in één kleur (lichtblauw).
- **Geraakte bestanden:**
  - `platform/src/app/(public)/page.tsx` (stats-kleur). Infra-config (Supabase migraties/auth, Vercel env) buiten de repo; `platform/.env.local` lokaal gevuld (gitignored).

## 2026-06-17 - Demo dichtgetimmerd voor go-live
- **Wat is gebouwd/gewijzigd:**
  - Loginpagina (`src/app/login/page.tsx`): de drie demo-login-knoppen (beheerder/professional/opdrachtgever) verwijderd; toont nu altijd het echte e-mail/wachtwoord-formulier.
  - `isDemo()` (`src/lib/demo.ts`): de `DETAVIA_DEMO=1`-noodschakelaar weggehaald, zodat demo puur key-gestuurd is en nooit in productie kan aanstaan.
  - `src/app/login/actions.ts`: `loginDemo*` weigeren nu (redirect /login) als Supabase gekoppeld is.
  - Aanpak "veilig dichttimmeren": demo-data/fallback blijft als vangnet in de code, maar verdwijnt automatisch zodra de Supabase-keys staan; geen 45-bestanden refactor.
- **Waarom:**
  - Gebruiker gaat live en wil dat alle demo-data en demo-login weg zijn. Demo-data zit alleen in code (niet in database) en hangt aan `isDemo()`; met echte keys is alles automatisch weg.
- **Geraakte bestanden:**
  - `platform/src/app/login/page.tsx`, `platform/src/lib/demo.ts`, `platform/src/app/login/actions.ts`.

## 2026-06-17 - Code naar GitHub gepusht (Detavianl/Detavia)
- **Wat is gebouwd/gewijzigd:**
  - Git-remote `origin` gekoppeld aan https://github.com/Detavianl/Detavia (privé) en alle commits gepusht naar `main` (411 bestanden online).
  - `Detavia Brandbook.pdf` (103 MB, boven GitHub's 100MB-limiet) uit de volledige historie verwijderd via `git filter-branch`, daarna `reflog expire` + `gc`. Bestand toegevoegd aan root `.gitignore` (`*.pdf`). Losse brandbook-PNG-pagina's blijven bewaard.
  - Remote-URL schoon ingesteld (zonder token in git-config).
- **Waarom:**
  - Gebruiker heeft Vercel en Supabase aangemaakt; beide koppelen aan een GitHub-repo, dus de code moest eerst op GitHub. Push werd geweigerd door het te grote PDF, vandaar de historie-opschoning.
- **Geraakte bestanden:**
  - `.gitignore` (root; `*.pdf` + Brandbook genegeerd). Git-historie herschreven (PDF verwijderd). Geen app-code gewijzigd.

## 2026-06-17 - CTA's verbreed: meer routes voor opdrachtgevers en kandidaten
- **Wat is gebouwd/gewijzigd:**
  - Nieuwe pagina `/voor-opdrachtgevers`: hero, waarom DetaVia, "zo werkt het" (4 stappen) en een aanvraagformulier "Vraag een professional aan" dat als bericht (soort=opdrachtgever) binnenkomt bij beheer.
  - Header: nav-item + CTA "Personeel nodig?" naar de opdrachtgeverspagina, plus "Vacatures"-knop.
  - Home: hero-CTA "Vraag een professional aan", doelgroep-keuzeblok (werk zoeken / personeel zoeken) en een CTA-band onderaan.
  - Vacatures: band met "Open sollicitatie" en een opdrachtgever-route.
  - Contact: split-keuzeblok (kandidaat/opdrachtgever), klikbaar telefoon/e-mail, "Bel mij terug"-optie.
  - Footer: twee duidelijke kolommen (Voor kandidaten / Voor opdrachtgevers).
  - Nieuwe mobiele sticky CTA-balk (Solliciteer / Personeel nodig?).
  - `submitContact`/`submitSollicitatie`: demo-guard (redirect naar /bedankt) zodat de online demo-formulieren werken; organisatie en terugbel-voorkeur worden in het bericht meegestuurd.
  - `platform/HANDOVER.md` toegevoegd: go-live stappen voor eigen GitHub, Supabase (migraties 0001-0013 + seed super-admin) en Vercel (Root Directory = platform, 3 env-vars).
- **Waarom:**
  - Klant wil de site toegankelijker maken voor opdrachtgevers (meer "contact opnemen") en kandidaten (meer "solliciteren"); daarnaast gaat de gebruiker eigen GitHub/Vercel/Supabase opzetten, dus een duidelijke overdrachtshandleiding.
- **Geraakte bestanden:**
  - `platform/src/app/(public)/voor-opdrachtgevers/page.tsx` (nieuw), `platform/src/components/MobileCtaBar.tsx` (nieuw), `platform/HANDOVER.md` (nieuw), `platform/src/app/(public)/{page,layout,contact/page,vacatures/page,actions}.tsx/ts`, `platform/src/components/{SiteHeader,SiteFooter}.tsx`.

## 2026-06-17 - Demo online gezet op Vercel
- **Wat is gebouwd/gewijzigd:**
  - Productie-build geverifieerd en de app gedeployed naar Vercel (account badr-png). Draait in demo-modus (geen Supabase-env), dus volledig publiek deelbaar. Live op https://platform-steel-delta.vercel.app (+ deployment-URL). `.vercel/` toegevoegd aan .gitignore.
- **Waarom:**
  - Gebruiker wil de demo online hebben om te delen.
- **Geraakte bestanden:**
  - `platform/.gitignore` (.vercel genegeerd). Geen code-wijzigingen; deploy via Vercel CLI.

## 2026-06-17 - Opdrachtgever-portaal: klant keurt uren van eigen professional goed
- **Wat is gebouwd/gewijzigd:**
  - Derde rol/portaal: de opdrachtgever (contactpersoon van een bedrijf) logt in op `/opdrachtgever`, ziet de professionals die via DetaVia bij hen geplaatst zijn en keurt hun ingediende uren goed/af. DB (migratie 0013): `contacts.portaal_user_id` + RLS-helpers (client_company, is_client_of_placement) zodat een opdrachtgever alleen plaatsingen en uren van het eigen bedrijf ziet en mag goedkeuren.
  - Opdrachtgever uitnodigen: knop bij de contactpersonen op het bedrijfsdetail (`inviteClient`) die een Supabase-login aanmaakt en koppelt aan het contact. Geen tarieven/marge zichtbaar voor de opdrachtgever.
  - Login: derde demo-knop "Inloggen als opdrachtgever"; middleware beschermt nu ook /opdrachtgever; logout wist alle drie de demo-cookies.
- **Waarom:**
  - Gebruiker wil dat de gekoppelde opdrachtgever de uren van hun ingehuurde professional goedkeurt (het is hun opdracht).
- **Geraakte bestanden:**
  - `platform/supabase/migrations/0013_opdrachtgever_portaal.sql` (nieuw), `src/lib/client-context.ts` (nieuw), `src/app/opdrachtgever/*` (layout, page, actions), `src/components/{ClientHoursButtons,InviteClientButton}.tsx` (nieuw), `src/app/admin/crm/actions.ts`, `src/app/admin/crm/bedrijven/[id]/page.tsx`, `src/app/login/{page.tsx,actions.ts}`, `src/middleware.ts`.

## 2026-06-17 - Facturatie uit uren + professional uitnodigen + weekoverzicht/export
- **Wat is gebouwd/gewijzigd:**
  - (1) Facturatie uit goedgekeurde uren: op het plaatsing-detail een knop die een conceptfactuur opbouwt uit goedgekeurde, nog niet-gefactureerde uren (aantal x uurtarief), die uren markeert als gefactureerd (hours.invoice_id) en doorlinkt naar de factuur. Migratie 0012 (hours.invoice_id, invoices.placement_id + aantal_uren).
  - (2) Professional uitnodigen: vanuit het plaatsing-detail een Supabase-invite die een login aanmaakt en koppelt aan de kandidaat (candidates.professional_user_id), zodat de professional kan inloggen op het portaal.
  - (3) Weekoverzicht + export: plaatsing-detail groepeert uren per week met totalen; CSV-export van uren (`/admin/uren/export`, optioneel per plaatsing) met BOM voor Excel; export-knoppen op urenpagina en plaatsing-detail. KPI's tarief/kostprijs/marge/te-factureren.
- **Waarom:**
  - Gebruiker vroeg om alle drie de vervolgstappen: facturatie uit uren, echte professional-login via uitnodiging, en weekoverzicht/export.
- **Geraakte bestanden:**
  - `platform/supabase/migrations/0012_uren_facturatie.sql` (nieuw), `src/lib/invoice-create.ts`, `src/app/admin/plaatsingen/{actions.ts,page.tsx,[id]/page.tsx}`, `src/components/PlacementActions.tsx` (nieuw), `src/app/admin/uren/{page.tsx,export/route.ts}`.

## 2026-06-17 - Uren-portaal: professional-login + dag-urenregistratie + plaatsingen
- **Wat is gebouwd/gewijzigd:**
  - Tweezijdig urenportaal voor detachering per uur. DB (migratie 0011): `placements` (kandidaat+bedrijf, uurtarief, kostprijs -> marge, periode), `hours` (dag-urenregistratie met status ingediend/goedgekeurd/afgekeurd), `candidates.professional_user_id` + RLS zodat professionals alleen hun eigen gegevens zien/bewerken.
  - Professional-portaal `/portaal`: eigen (demo-)login, dashboard met plaatsing(en) + KPI's + dag-urenregistratie + indienen/verwijderen, en `/portaal/profiel` om eigen gegevens en cv/documenten bij te werken (gekoppeld aan de talentpool). Professional ziet geen tarieven/marge.
  - Admin: `/admin/plaatsingen` (lijst met marge + nieuw) en `/admin/uren` (ingediende uren goedkeuren/afkeuren). Menu-items onder Werving. Tweede demo-login-knop (professional). Middleware beschermt nu ook /portaal.
- **Waarom:**
  - Gebruiker wil dat professionals hun uren zelf registreren (eigen login + dashboard + cv), gekoppeld aan tarief x uren + marge voor facturatie, met goedkeuring vooraf.
- **Geraakte bestanden:**
  - `platform/supabase/migrations/0011_uren_portaal.sql` (nieuw), `src/lib/professional-context.ts` (nieuw), `src/app/portaal/*` (layout, page, profiel, actions), `src/app/admin/{plaatsingen,uren}/*`, `src/components/{DeleteHoursButton,HoursReviewButtons}.tsx`, `src/app/login/{page.tsx,actions.ts}`, `src/components/AdminNav.tsx`, `src/middleware.ts`, `src/lib/demo.ts`.

## 2026-06-17 - AI-mailer: branded HTML-mail + live voorbeeld
- **Wat is gebouwd/gewijzigd:**
  - AI-mailer levert nu een echte, mooi vormgegeven HTML-mail in Detavia-huisstijl (cobalt header met DetaVia-wordmark + tagline, witte tekstkaart, optionele gele CTA-knop, footer) i.p.v. platte tekst. E-mailclient-proof (table-based + inline styles) via `src/lib/email-template.ts`.
  - Mailerpagina: links bewerken (onderwerp/bericht/knoptekst+link), rechts een live voorbeeld (iframe) + HTML-tab om de broncode te zien/kopiëren. AI geeft nu ook een optionele call-to-action terug. Verzend-stub stuurt de HTML (klaar voor Resend).
- **Waarom:**
  - Gebruiker wil dezelfde feeling als Workster: een echte, mooie HTML-mail met preview, geen platte tekst.
- **Geraakte bestanden:**
  - `platform/src/lib/email-template.ts` (nieuw), `src/lib/ai-mailer.ts`, `src/app/admin/mailer/{page.tsx,actions.ts}`.

## 2026-06-17 - AI-mailer in Detavia-stijl
- **Wat is gebouwd/gewijzigd:**
  - AI-mailer (`/admin/mailer`): stelt e-mails op in de DetaVia tone-of-voice via de Anthropic SDK (default Haiku 4.5, instelbaar via DETAVIA_AI_MODEL). Kies type ontvanger + doel (uitnodiging/voorstellen/follow-up/afwijzing/welkom/vrij) + context, genereer een concept, pas aan, en verstuur. Zonder ANTHROPIC_API_KEY valt het terug op nette Detavia-sjablonen.
  - Verzenden is een stub die klaarstaat voor Resend (zelfde patroon als facturen). Menu-item onder Content & overig; env.example uitgebreid (ANTHROPIC_API_KEY, RESEND_API_KEY, DETAVIA_AI_MODEL).
- **Waarom:**
  - Gebruiker wil een AI-mailer zoals Workster, maar in Detavia-huisstijl.
- **Geraakte bestanden:**
  - `platform/src/lib/ai-mailer.ts` (nieuw), `src/app/admin/mailer/{page.tsx,actions.ts}` (nieuw), `src/components/AdminNav.tsx`, `.env.example`, `package.json` (@anthropic-ai/sdk).

## 2026-06-17 - Echt Detavia-logo in de factuur-PDF
- **Wat is gebouwd/gewijzigd:**
  - Het echte Detavia-logo (transparante PNG uit het merkpakket) ingesloten in de kop van de factuur-PDF i.p.v. de tekst "DetaVia". Logo ingelezen van `public/img/logo.png` en via pdf-lib `embedPng` geplaatst; terugval op tekst als het bestand ontbreekt.
- **Waarom:**
  - Gebruiker wil het echte logo op de facturen.
- **Geraakte bestanden:**
  - `platform/src/lib/invoice-pdf.ts`, `platform/public/img/logo.png` (nieuw).

## 2026-06-17 - Facturatiemodule: PDF-factuur bij gewonnen deal + verzendomgeving
- **Wat is gebouwd/gewijzigd:**
  - Bij een deal die op "Gewonnen" wordt gezet, wordt automatisch een conceptfactuur aangemaakt (idempotent) met factuurnummer (DETA-jaar-volgnr), bedrag uit de deal, btw 21%, vervaldatum.
  - Echte PDF-factuur in Detavia-huisstijl via `pdf-lib` (afzender/geadresseerde, regel, subtotaal/btw/totaal, betaalblok). Download/bekijk-route `/admin/facturen/[id]/pdf`.
  - Factuuromgeving `/admin/facturen`: lijst (openstaand totaal, status) + detail met PDF-knop en acties "Versturen" / "Markeer als betaald". De verzend-actie is een stub die klaarstaat om aan Resend te koppelen (PDF als bijlage mailen) zodra RESEND_API_KEY er is.
  - Migratie 0010 (invoices + RLS). Demo-facturen + demo-veilige acties. Menu-item onder CRM. Afzendergegevens (KvK/IBAN/BTW) als placeholders in `src/lib/invoice.ts`.
- **Waarom:**
  - Gebruiker wil dat facturatie vanuit het systeem gebeurt: PDF bij gewonnen deal + verzendomgeving voor latere Resend-koppeling.
- **Geraakte bestanden:**
  - `platform/supabase/migrations/0010_invoices.sql` (nieuw), `src/lib/{invoice.ts,invoice-pdf.ts,invoice-create.ts}` (nieuw), `src/app/admin/facturen/*` (page, [id], [id]/pdf/route, actions), `src/components/InvoiceActions.tsx` (nieuw), `src/app/admin/crm/actions.ts` (moveDeal), `src/components/AdminNav.tsx`, `src/lib/demo.ts`, `package.json` (pdf-lib).

## 2026-06-17 - Opvolging bij bedrijven + documenten openbaar
- **Wat is gebouwd/gewijzigd:**
  - "Eigenaar & opvolging"-kaart ook op het bedrijfsdetail (zoals bij kandidaten): eigenaar + volgende actie + datum. FollowupForm gegeneraliseerd (entity candidate/company); `updateCompanyFollowup`-actie + audit; migratie 0009 (volgende_actie/datum op companies).
  - Documenten zijn nu te openen: in live via signed URL (al aanwezig); in demo wordt het geuploade bestand als data-URL bewaard en als klikbare link getoond, zodat je het ook in de demo kunt openen.
- **Waarom:**
  - Gebruiker wil opvolging ook bij bedrijven, en documenten daadwerkelijk kunnen openen.
- **Geraakte bestanden:**
  - `platform/supabase/migrations/0009_company_followup.sql` (nieuw), `src/components/FollowupForm.tsx`, `src/app/admin/crm/{actions.ts,bedrijven/[id]/page.tsx}`, `src/lib/demo-store.ts`, `src/app/admin/kandidaten/{actions.ts,[id]/page.tsx}`.

## 2026-06-17 - Sterren-rating verwijderd uit de UI
- **Wat is gebouwd/gewijzigd:**
  - De ★-rating weggehaald uit het kandidaatdetail (kop + Stars-helper) en uit de Talentpool-lijst (kolom + cel, colspan bijgewerkt). DB-kolom blijft bestaan maar wordt nergens meer getoond.
- **Waarom:**
  - Gebruiker vond de sterren niet wenselijk en wilde ze weg.
- **Geraakte bestanden:**
  - `platform/src/app/admin/kandidaten/[id]/page.tsx`, `src/components/TalentpoolTable.tsx`.

## 2026-06-17 - Documenten-uploadveld past nu binnen de kaart
- **Wat is gebouwd/gewijzigd:**
  - De native file-input in de Documenten-sectie stak nog net buiten de kaart (eigen minimale breedte). Formulier op een kolom gezet, input `w-full min-w-0` + nette `file:`-knopstyling. Geverifieerd op 1900px: 0 elementen buiten beeld.
- **Waarom:**
  - Gebruiker wees op het "Bestand kiezen"-veld dat nog overliep.
- **Geraakte bestanden:**
  - `platform/src/app/admin/kandidaten/[id]/page.tsx`.

## 2026-06-17 - Echte fix overlopende rechterkolom (grid -> flex-col)
- **Wat is gebouwd/gewijzigd:**
  - Via Chrome DevTools (ingelogd, 1900px) de exacte oorzaak gemeten: de kolom-stapels van het kandidaatdetail stonden als `grid gap-6` zonder kolomdefinitie, waardoor de impliciete auto-kolom zo breed werd als de inhoud (419px) i.p.v. de container (320px); de sectie liep daardoor buiten beeld (weggeknipt door overflow-x-hidden).
  - Twee-kolomslayout en beide kolom-stapels omgezet naar `flex flex-row` / `flex flex-col` (rechts `lg:w-80 lg:shrink-0`, links `min-w-0 flex-1`). Geverifieerd op 1900px: rechterkolom (Eigenaar & opvolging / Documenten / In de funnel) past nu volledig.
- **Waarom:**
  - De vorige fix (min-w-0 + minmax) pakte de echte oorzaak niet; op brede schermen liep de rechterkolom nog buiten beeld.
- **Geraakte bestanden:**
  - `platform/src/app/admin/kandidaten/[id]/page.tsx`.

## 2026-06-17 - Layout-fix admin: rechterkolom past nu binnen het scherm
- **Wat is gebouwd/gewijzigd:**
  - Echte oorzaak van de overlopende rechterkolom verholpen: `min-w-0` toegevoegd aan de content-kolom (`flex-1`) van de admin-layout, zodat die kan krimpen en het binnenliggende raster niet naar rechts buiten beeld duwt. Aangevuld met `break-words`/`break-all` op profielwaarden (lange e-mail/LinkedIn-URL) en `minmax(0,1fr)` op het kandidaatdetail-raster.
  - Geverifieerd met een ingelogde (demo-cookie via Chrome DevTools) screenshot op 1440px: rechterkolom (Eigenaar & opvolging / Documenten) valt nu volledig binnen beeld.
- **Waarom:**
  - Gebruiker meldde dat de rechterkolom nog steeds te ver naar rechts liep, en vroeg om het op te lossen en visueel te controleren.
- **Geraakte bestanden:**
  - `platform/src/app/admin/layout.tsx`, `src/app/admin/kandidaten/[id]/page.tsx`.

## 2026-06-17 - Contactmomenten: laatste 3 zichtbaar, rest scrollt
- **Wat is gebouwd/gewijzigd:**
  - De contactmomenten-lijst krijgt een vaste maximale hoogte (max-h-56) met verticale scroll. Nieuwste staan bovenaan, dus de laatste ~3 zijn zichtbaar en oudere scrollen; de sectie duwt de rest van de pagina niet meer weg.
- **Waarom:**
  - Gebruiker wil dat bij veel contactmomenten alleen de laatste paar zichtbaar zijn en de rest scrollt.
- **Geraakte bestanden:**
  - `platform/src/components/ContactMoments.tsx`.

## 2026-06-17 - Taken/opvolging op dashboard, documenten-upload, layout-fix
- **Wat is gebouwd/gewijzigd:**
  - Documenten-sectie bij kandidaat: "CV's" -> "Documenten (cv's en meer)" met soort-keuze + uploadknop (server-action uploadDocument; demo onthoudt in geheugen). Migratie 0008 (soort op cvs).
  - Dashboard "Taken & opvolging": lijst van kandidaten met een volgende actie, gesorteerd op datum, met "te laat" (rood) en "vandaag" (geel) markering en link naar de kandidaat. Maakt van Eigenaar & opvolging een echte to-do.
  - Layout-fix: kandidaatdetail-raster van `1fr 340px` naar `minmax(0,1fr) 320px` + min-w-0, zodat de rechterkolom (Eigenaar & opvolging / Documenten) niet meer buiten het scherm valt.
- **Waarom:**
  - Gebruiker vroeg om documenten te kunnen toevoegen, of opvolging een to-do op het dashboard is, en of alles op het scherm past.
- **Geraakte bestanden:**
  - `platform/supabase/migrations/0008_documents.sql` (nieuw), `src/lib/demo-store.ts`, `src/app/admin/kandidaten/{actions.ts,[id]/page.tsx}`, `src/app/admin/page.tsx`, `src/lib/demo.ts`.

## 2026-06-17 - Splitsing: Activiteiten (wijzigingslog) / Contactmomenten / Notities
- **Wat is gebouwd/gewijzigd:**
  - Bij zowel kandidaten als bedrijven de tracking opgesplitst in drie losse onderdelen:
    1. **Activiteiten** = wijzigingslog met automatisch herkende gebeurtenissen. Kandidaat: Gesolliciteerd / Voorgesteld aan opdrachtgever / Aanbod gedaan / Geplaatst (via ATS-fasewissel; CAND_EVENT-labels). Bedrijf: deal-gebeurtenissen (Aanbod gedaan / Gewonnen / Verloren) worden automatisch op het bedrijf gelogd (DEAL_EVENT).
    2. **Contactmomenten** = los, aanklikbaar, met type + (bij bedrijven) met wie + tekst + gebruiker.
    3. **Notities** = losse balkjes per notitie, met datum + gebruiker.
  - Centrale acties `addContactMoment` / `addNote` (kandidaat + bedrijf). Nieuwe componenten ContactMoments + QuickNotes; oude ActivityTimeline verwijderd. Publiek sollicitatieformulier logt "Gesolliciteerd".
- **Waarom:**
  - Gebruiker wil activiteiten = wijzigingslog, en contactmomenten + notities als losse dingen (met wie/datum), consistent bij bedrijven én kandidaten.
- **Geraakte bestanden:**
  - `platform/src/lib/{ats.ts,crm.ts,demo.ts}`, `src/app/admin/activity-actions.ts` (nieuw), `src/components/{ContactMoments,QuickNotes}.tsx` (nieuw), `src/app/admin/{ats/actions.ts,kandidaten/{actions.ts,[id]/page.tsx},crm/{actions.ts,bedrijven/[id]/page.tsx}}`, `src/app/(public)/actions.ts`.

## 2026-06-17 - Activiteiten-tijdlijn bij bedrijven + wijzigingslog (wie/wanneer)
- **Wat is gebouwd/gewijzigd:**
  - Activiteiten/contactmomenten/notities-tijdlijn nu ook op het bedrijfsdetail (zoals bij kandidaten), met de gebruiker erbij. Tijdlijn-component generiek gemaakt (kandidaat + bedrijf) en toont datum + wie het deed.
  - Wijzigingslog (audit): nieuwe tabel `audit_log` (entity, actie, details, user_id, user_naam, created_at) + helper `logAudit`. Vastgelegd bij o.a. kandidaat aanmaken/notitie/opvolging, ATS-fasewissel, en bedrijf/contact/deal aanmaken en deal-fasewissel. "Wijzigingslog"-sectie op kandidaat- én bedrijfsdetail (wat, wanneer, door wie).
  - Demo-data: gebruiker bij activiteiten, bedrijfsactiviteiten en voorbeeld-wijzigingslogs.
- **Waarom:**
  - Gebruiker wil dezelfde tijdlijn bij bedrijven, notities als losse logregels met datum/tijd + gebruiker, en overal een wijzigingslog (wat/wanneer/wie).
- **Geraakte bestanden:**
  - `platform/supabase/migrations/0007_audit.sql` (nieuw), `src/lib/audit.ts` + `src/components/AuditLog.tsx` (nieuw), `src/components/ActivityTimeline.tsx`, `src/app/admin/crm/actions.ts` + `bedrijven/[id]/page.tsx`, `src/app/admin/kandidaten/{actions.ts,[id]/page.tsx}`, `src/app/admin/ats/actions.ts`, `src/lib/demo.ts`.

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
