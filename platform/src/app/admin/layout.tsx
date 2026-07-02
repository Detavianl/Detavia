import { requireAdmin, ROLE_LABELS } from "@/lib/admin-context";
import AdminShell from "@/components/AdminShell";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <AdminShell naam={admin.naam || admin.email} rol={ROLE_LABELS[admin.role] ?? admin.role}>
      {children}
    </AdminShell>
  );
}
