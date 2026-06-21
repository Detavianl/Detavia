"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/admin-context";
import { isDemo } from "@/lib/demo";

type Entity = "candidate" | "company" | "placement" | "invoice" | "vacature";

// Pad dat ververst moet worden per generieke entiteit.
const PAD: Record<string, (id: string) => string> = {
  placement: (id) => `/admin/plaatsingen/${id}`,
  invoice: (id) => `/admin/facturen/${id}`,
  vacature: (id) => `/admin/vacatures/${id}`,
};

// Contactmoment: type (telefoon/email/gesprek/afspraak) + tekst, en bij bedrijven optioneel
// met welke contactpersoon. Apart van de wijzigingslog en van notities.
export async function addContactMoment(entity: Entity, id: string, contactId: string | null, type: string, tekst: string) {
  const admin = await requireAdmin();
  if (!tekst.trim()) return;
  if (isDemo()) return;
  const supabase = await createClient();
  if (entity === "candidate") {
    await supabase.from("candidate_activities").insert({ candidate_id: id, type, inhoud: tekst, created_by: admin.user_id });
    await supabase.from("candidates").update({ laatste_contact: new Date().toISOString().slice(0, 10) }).eq("id", id);
    revalidatePath(`/admin/kandidaten/${id}`);
  } else {
    await supabase.from("crm_activities").insert({ company_id: id, contact_id: contactId, type, onderwerp: tekst, created_by: admin.user_id });
    revalidatePath(`/admin/crm/bedrijven/${id}`);
  }
}

// Notitie: korte losse aantekening (meeting verplaatst, no-show, ...). Eigen balkje + wie.
export async function addNote(entity: Entity, id: string, tekst: string) {
  const admin = await requireAdmin();
  if (!tekst.trim()) return;
  if (isDemo()) return;
  const supabase = await createClient();
  if (entity === "candidate") {
    await supabase.from("candidate_activities").insert({ candidate_id: id, type: "notitie", inhoud: tekst, created_by: admin.user_id });
    revalidatePath(`/admin/kandidaten/${id}`);
  } else if (entity === "company") {
    await supabase.from("crm_activities").insert({ company_id: id, type: "notitie", onderwerp: tekst, created_by: admin.user_id });
    revalidatePath(`/admin/crm/bedrijven/${id}`);
  } else {
    // generieke entiteiten (plaatsing, factuur, vacature) -> notes-tabel
    await supabase.from("notes").insert({ entity_type: entity, entity_id: id, body: tekst, author_id: admin.user_id, author_naam: admin.naam ?? "" });
    revalidatePath(PAD[entity]?.(id) ?? "/admin");
  }
}
