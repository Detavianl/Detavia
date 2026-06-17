// In-memory demo-opslag: laat in demo-modus nieuw aangemaakte kandidaten
// terugkomen in de talentpool, het detail én de ATS-funnel (zolang de
// dev-server draait). Geen database; puur om de demo realistisch te maken.
import { DEMO_CANDIDATES, DEMO_APPLICATIONS } from "./demo";
import type { AtsCard } from "./ats";

const extraCandidates: any[] = [];
const extraApplications: AtsCard[] = [];

export function addDemoCandidate(c: any) {
  extraCandidates.unshift(c);
  extraApplications.unshift({
    id: "app-" + c.id,
    stage: "nieuw",
    positie: 0,
    notitie: "",
    candidate: { id: c.id, naam: c.naam, vakgebied: c.vakgebied ?? null, woonplaats: c.woonplaats ?? null },
    vacature: null,
  });
}

export function demoCandidates(): any[] {
  return [...extraCandidates, ...DEMO_CANDIDATES];
}
export function demoCandidate(id: string): any | null {
  return demoCandidates().find((x) => x.id === id) ?? null;
}
export function demoApplications(): AtsCard[] {
  return [...extraApplications, ...DEMO_APPLICATIONS];
}
