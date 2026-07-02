import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isDemo, DEMO_ADMIN } from "@/lib/demo";

export type AdminRole = "super_admin" | "admin" | "recruiter" | "jr_recruiter";
export type AdminUser = { user_id: string; naam: string; role: AdminRole; email: string };

export const DEMO_COOKIE = "detavia_demo";

// Vaste recruitervergoeding voor een jr. recruiter, per gewerkt uur.
export const JR_RECRUITER_FEE = 3.75;

// Rol-labels. "recruiter" = senior (voor de gebruiker verandert er niks).
export const ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: "Super-admin",
  admin: "Admin",
  recruiter: "Sr. recruiter",
  jr_recruiter: "Jr. recruiter",
};

// Rollen die als recruiter meetellen (verdiensten + plaatsingen).
export const RECRUITER_ROLES = ["jr_recruiter", "recruiter", "admin", "super_admin"];

/** Haalt de ingelogde admin op, of null. */
export async function getAdmin(): Promise<AdminUser | null> {
  if (isDemo()) {
    const jar = await cookies();
    return jar.get(DEMO_COOKIE)?.value === "1" ? DEMO_ADMIN : null;
  }
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
  if (admin) return admin;
  if (isDemo()) redirect("/login");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  redirect(user ? "/geen-toegang" : "/login");
}

/** Vereist een specifieke rol (super_admin > admin > recruiter). */
export async function requireRole(min: AdminRole): Promise<AdminUser> {
  const admin = await requireAdmin();
  const rank: Record<AdminRole, number> = { jr_recruiter: 1, recruiter: 2, admin: 3, super_admin: 4 };
  if (rank[admin.role] < rank[min]) redirect("/geen-toegang");
  return admin;
}
