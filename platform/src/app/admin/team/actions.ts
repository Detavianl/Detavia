"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/admin-context";

export async function inviteTeamMember(formData: FormData) {
  await requireRole("super_admin");
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const naam = String(formData.get("naam") ?? "").trim();
  const role = String(formData.get("role") ?? "recruiter");
  if (!email) throw new Error("E-mail is verplicht");

  const admin = createAdminClient();
  // nodigt uit (maakt user als die nog niet bestaat) en geeft de rol
  const { data, error } = await admin.auth.admin.inviteUserByEmail(email);
  let userId = data?.user?.id;
  if (error || !userId) {
    // bestaat mogelijk al: zoek de user op
    const { data: list } = await admin.auth.admin.listUsers();
    userId = list?.users.find((u) => u.email?.toLowerCase() === email)?.id;
    if (!userId) throw new Error("Kon de gebruiker niet uitnodigen of vinden.");
  }
  const { error: e2 } = await admin.from("admin_users").upsert({ user_id: userId, naam, role });
  if (e2) throw new Error(e2.message);
  revalidatePath("/admin/team");
}

export async function updateMemberRole(user_id: string, role: string) {
  await requireRole("super_admin");
  const supabase = await createClient();
  await supabase.from("admin_users").update({ role }).eq("user_id", user_id);
  revalidatePath("/admin/team");
}

export async function removeMember(user_id: string) {
  await requireRole("super_admin");
  const supabase = await createClient();
  await supabase.from("admin_users").delete().eq("user_id", user_id);
  revalidatePath("/admin/team");
}
