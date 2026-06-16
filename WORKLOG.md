# Worklog

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
