# DetaVia — 1-op-1 kloon van detavia.nl

Dit is een exacte, statische kopie van de live homepage (HTML, CSS, JS, fonts, afbeeldingen)
zoals gedownload op 2026-06-16.

## Lokaal bekijken
Open een terminal in deze `site/`-map en draai:

    python3 -m http.server 8787

Open daarna in je browser: http://127.0.0.1:8787/

(Direct het `index.html`-bestand openen werkt niet goed — de paden zijn root-relatief,
dus er moet een lokale webserver draaien.)

## Wat werkt
- Volledige pagina, identiek aan het origineel: opbouw, kleuren, Plus Jakarta Sans, logo's, foto's, teksten, scroll-animaties.

## Bekende beperking
- Het contactformulier (Naam / E-mail) en "Inloggen" sturen op de echte site data naar de
  WordPress-backend (admin-ajax). In deze statische kopie zien ze er identiek uit, maar
  versturen doet niets — daarvoor is een backend nodig. Zie het hoofdgesprek.
