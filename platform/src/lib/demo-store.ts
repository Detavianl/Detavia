// In-memory demo-opslag: laat in demo-modus nieuw aangemaakte kandidaten
// terugkomen in de talentpool, het detail én de ATS-funnel (zolang de
// dev-server draait). Geen database; puur om de demo realistisch te maken.
import { DEMO_CANDIDATES, DEMO_APPLICATIONS } from "./demo";
import type { AtsCard } from "./ats";

const extraCandidates: any[] = [];
const extraApplications: AtsCard[] = [];

// Documenten per kandidaat (demo). url = data-URL zodat het bestand te openen is.
type DemoDoc = { id: string; filename: string; soort: string; uploaded_at: string; url?: string };
const documents: Record<string, DemoDoc[]> = {};

export function addDemoDocument(candidateId: string, doc: DemoDoc) {
  (documents[candidateId] ??= []).unshift(doc);
}
export function demoDocuments(candidateId: string) {
  return documents[candidateId] ?? [];
}

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
