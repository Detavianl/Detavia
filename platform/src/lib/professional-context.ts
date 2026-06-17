import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isDemo, DEMO_CANDIDATES, DEMO_PROFESSIONAL_ID } from "@/lib/demo";

export const PROF_COOKIE = "detavia_demo_prof";

export type Professional = { id: string; naam: string; email: string | null };

export async function getProfessional(): Promise<Professional | null> {
  if (isDemo()) {
    const jar = await cookies();
    if (jar.get(PROF_COOKIE)?.value !== "1") return null;
    const c = DEMO_CANDIDATES.find((x) => x.id === DEMO_PROFESSIONAL_ID);
    return c ? { id: c.id, naam: c.naam, email: c.email } : null;
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("candidates")
    .select("id, naam, email")
    .eq("professional_user_id", user.id)
    .single();
  return data ?? null;
}

export async function requireProfessional(): Promise<Professional> {
  const p = await getProfessional();
  if (!p) redirect("/login");
  return p!;
}
