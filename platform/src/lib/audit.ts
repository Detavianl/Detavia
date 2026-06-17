import { createClient } from "@/lib/supabase/server";
import type { AdminUser } from "@/lib/admin-context";

// Legt een wijziging vast in de audit-log: wat, wanneer, door wie.
// Faalt nooit hard (logging mag de actie niet blokkeren).
export async function logAudit(
  admin: AdminUser,
  entity: string,
  entity_id: string | null,
  actie: string,
  details = "",
) {
  try {
    const supabase = await createClient();
    await supabase.from("audit_log").insert({
      entity, entity_id, actie, details,
      user_id: admin.user_id,
      user_naam: admin.naam || admin.email,
    });
  } catch {
    /* logging mag niet breken */
  }
}
