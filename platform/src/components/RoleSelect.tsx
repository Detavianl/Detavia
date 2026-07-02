"use client";
import { updateMemberRole, removeMember } from "@/app/admin/team/actions";

export default function RoleSelect({ userId, role }: { userId: string; role: string }) {
  return (
    <div className="flex items-center gap-3">
      <select defaultValue={role} onChange={(e) => updateMemberRole(userId, e.target.value)}
        className="rounded-lg border-2 border-neutral-200 px-2 py-1 text-sm font-semibold">
        <option value="jr_recruiter">Jr. recruiter</option>
        <option value="recruiter">Sr. recruiter</option>
        <option value="admin">Admin</option>
        <option value="super_admin">Super-admin</option>
      </select>
      <button onClick={() => { if (confirm("Teamlid verwijderen?")) removeMember(userId); }}
        className="text-sm font-semibold text-red-600 hover:underline">Verwijderen</button>
    </div>
  );
}
