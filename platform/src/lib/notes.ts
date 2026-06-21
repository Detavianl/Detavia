import { createClient } from "@/lib/supabase/server";
import { isDemo } from "@/lib/demo";

export type NoteItem = { tekst: string; created_at: string; gebruiker?: string | null };

// Notities van een willekeurige entiteit (plaatsing, factuur, vacature, ...).
export async function loadNotes(entityType: string, entityId: string): Promise<NoteItem[]> {
  if (isDemo()) return [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("notes")
      .select("body, created_at, author_naam")
      .eq("entity_type", entityType)
      .eq("entity_id", entityId)
      .order("created_at", { ascending: false });
    return (data ?? []).map((n: { body: string; created_at: string; author_naam: string | null }) => ({
      tekst: n.body,
      created_at: n.created_at,
      gebruiker: n.author_naam || null,
    }));
  } catch {
    return [];
  }
}
