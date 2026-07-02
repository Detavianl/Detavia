import Link from "next/link";
import { requireAdmin, ROLE_LABELS } from "@/lib/admin-context";
import AdminNav from "@/components/AdminNav";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col self-start overflow-y-auto border-r border-neutral-200 bg-white p-4">
        <Link href="/admin" className="mb-6 block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo_blue.svg" alt="DetaVia" className="h-7" />
        </Link>
        <AdminNav />
        <div className="mt-auto border-t border-neutral-200 pt-4">
          <p className="px-3 text-sm font-bold">{admin.naam || admin.email}</p>
          <p className="px-3 text-xs text-muted">{ROLE_LABELS[admin.role] ?? admin.role}</p>
          <div className="mt-2"><LogoutButton /></div>
          <Link href="/" className="mt-1 block rounded-lg px-3 py-2 text-left text-sm font-semibold text-muted hover:bg-neutral-100">Naar de site</Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1 overflow-x-hidden">{children}</div>
    </div>
  );
}
