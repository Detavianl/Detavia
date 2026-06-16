import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type AdminRole = "super_admin" | "admin" | "recruiter";
export type AdminUser = { user_id: string; naam: string; role: AdminRole; email: string };

/** Haalt de ingelogde admin op, of null. */
export async function getAdmin(): Promise<AdminUser | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("admin_users")
    .select("user_id, naam, role")
    .eq("user_id", user.id)
    .single();
  if (!data) return null;
  return { ...data, email: user.email ?? "" } as AdminUser;
}

/** Vereist een ingelogde admin; redirect naar /login of /geen-toegang. */
export async function requireAdmin(): Promise<AdminUser> {
  const admin = await getAdmin();
  if (!admin) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    redirect(user ? "/geen-toegang" : "/login");
  }
  return admin!;
}

/** Vereist een specifieke rol (super_admin > admin > recruiter). */
export async function requireRole(min: AdminRole): Promise<AdminUser> {
  const admin = await requireAdmin();
  const rank: Record<AdminRole, number> = { recruiter: 1, admin: 2, super_admin: 3 };
  if (rank[admin.role] < rank[min]) redirect("/geen-toegang");
  return admin;
}
