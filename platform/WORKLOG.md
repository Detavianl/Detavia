# Worklog & afspraken

## Afspraken
- **2026-07-02 — AI-kosten / regeneratie.** Flextender-vacatures worden door Claude Haiku herschreven (intro, taken, eisen, vakgebied). **ALTIJD eerst vragen** voordat alle opdrachten opnieuw door de AI worden gehaald (bulk-regeneratie via een hash-bump). Reden: kosten. Richtprijs ~€0,30 per volledige ronde (~55 opdrachten, Haiku ~$1/MTok in, ~$5/MTok uit). De dagelijkse cron verwerkt alleen nieuwe/gewijzigde opdrachten (incrementeel via bron_hash) en is verwaarloosbaar (~€1/maand). Dus: geen stille her-verwerking; alleen op expliciet verzoek.

## Log
- 2026-07-02 — Flextender-AI v3: herschrijven i.p.v. letterlijk kopiëren, taken/eisen worden altijd gevuld als de brontekst ze bevat, vakgebied door de AI bepaald. Detailpagina toont eigen DetaVia-kopjes (Over deze opdracht / Wat ga je doen? / Wat je meebrengt).
