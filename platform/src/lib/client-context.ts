import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isDemo, DEMO_CONTACTS, DEMO_COMPANIES } from "@/lib/demo";

export const CLIENT_COOKIE = "detavia_demo_client";
// Demo-opdrachtgever: Karin Bos (ct1) bij Gemeente Almere (co1).
const DEMO_CLIENT_CONTACT_ID = "ct1";

export type ClientUser = { contactNaam: string; companyId: string; companyNaam: string };

export async function getClient(): Promise<ClientUser | null> {
  if (isDemo()) {
    const jar = await cookies();
    if (jar.get(CLIENT_COOKIE)?.value !== "1") return null;
    const ct = DEMO_CONTACTS.find((c) => c.id === DEMO_CLIENT_CONTACT_ID);
    if (!ct) return null;
    const co = DEMO_COMPANIES.find((c) => c.id === ct.company_id);
    return { contactNaam: ct.naam, companyId: ct.company_id, companyNaam: co?.naam ?? "" };
  }
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("contacts")
    .select("naam, company_id, company:companies(naam)")
    .eq("portaal_user_id", user.id)
    .single();
  if (!data?.company_id) return null;
  return { contactNaam: data.naam, companyId: data.company_id, companyNaam: (data as any).company?.naam ?? "" };
}

export async function requireClient(): Promise<ClientUser> {
  const c = await getClient();
  if (!c) redirect("/login");
  return c!;
}
