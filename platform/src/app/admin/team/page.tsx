import { requireRole } from "@/lib/admin-context";
import { createClient } from "@/lib/supabase/server";
import { inviteTeamMember } from "./actions";
import RoleSelect from "@/components/RoleSelect";
import { isDemo, DEMO_TEAM } from "@/lib/demo";

export const dynamic = "force-dynamic";

export default async function TeamPage() {
  await requireRole("super_admin");
  let leden: any[];
  if (isDemo()) {
    leden = DEMO_TEAM;
  } else {
    const supabase = await createClient();
    const { data } = await supabase.from("admin_users").select("user_id, naam, role, created_at").order("created_at");
    leden = data ?? [];
  }

  return (
    <div className="p-8">
      <h1 className="display text-3xl">Team</h1>
      <p className="mt-1 text-muted">Beheer wie toegang heeft tot het DetaVia-beheer.</p>

      <form action={inviteTeamMember} className="mt-8 flex max-w-2xl flex-wrap items-end gap-3 rounded-2xl border border-neutral-200 bg-white p-5">
        <label className="grid flex-1 gap-1.5"><span className="text-sm font-bold">Naam</span>
          <input name="naam" className="rounded-xl border-2 border-neutral-200 px-4 py-2.5" /></label>
        <label className="grid flex-1 gap-1.5"><span className="text-sm font-bold">E-mail</span>
          <input name="email" type="email" required className="rounded-xl border-2 border-neutral-200 px-4 py-2.5" /></label>
        <label className="grid gap-1.5"><span className="text-sm font-bold">Rol</span>
          <select name="role" className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-2.5">
            <option value="jr_recruiter">Jr. recruiter</option><option value="recruiter">Sr. recruiter</option><option value="admin">Admin</option><option value="super_admin">Super-admin</option>
          </select></label>
        <button className="rounded-full bg-cobalt px-5 py-2.5 font-bold text-white">Uitnodigen</button>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-muted">
            <tr><th className="px-5 py-3">Naam</th><th className="px-5 py-3">Rol</th></tr>
          </thead>
          <tbody>
            {leden.map((m) => (
              <tr key={m.user_id} className="border-b border-neutral-100 last:border-0">
                <td className="px-5 py-3 font-semibold">{m.naam || "—"}</td>
                <td className="px-5 py-3"><RoleSelect userId={m.user_id} role={m.role} /></td>
              </tr>
            ))}
            {leden.length === 0 && <tr><td colSpan={2} className="px-5 py-10 text-center text-muted">Nog geen teamleden.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
