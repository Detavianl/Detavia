import { createClient } from "@/lib/supabase/server";
import { isDemo } from "@/lib/demo";
import { getAdmin } from "@/lib/admin-context";

export type NoteItem = { id?: string; tekst: string; created_at: string; gebruiker?: string | null; mine?: boolean };

// Notities van een willekeurige entiteit (plaatsing, factuur, vacature, ...).
export async function loadNotes(entityType: string, entityId: string): Promise<NoteItem[]> {
  if (isDemo()) return [];
  try {
    const admin = await getAdmin();
    const supabase = await createClient();
    const { data } = await supabase
      .from("notes")
      .select("id, body, created_at, author_naam, author_id")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false });
    return (data ?? []).map((n: { id: string; body: string; created_at: string; author_naam: string | null; author_id: string | null }) => ({
      id: n.id,
      tekst: n.body,
      created_at: n.created_at,
      gebruiker: n.author_naam || null,
      mine: !!admin && n.author_id === admin.user_id,
    }));
  } catch {
    return [];
  }
}
