import Link from "next/link";
import { requireProfessional } from "@/lib/professional-context";
import LogoutButton from "@/components/LogoutButton";

export default async function PortaalLayout({ children }: { children: React.ReactNode }) {
  const prof = await requireProfessional();
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-[1000px] items-center justify-between px-5">
          <Link href="/portaal" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo_blue.svg" alt="DetaVia" className="h-7" />
            <span className="hidden text-sm font-semibold text-muted sm:inline">Urenportaal</span>
          </Link>
          <nav className="flex items-center gap-5 text-sm font-semibold">
            <Link href="/portaal" className="hover:text-cobalt">Uren</Link>
            <Link href="/portaal/profiel" className="hover:text-cobalt">Mijn profiel</Link>
            <span className="hidden text-muted sm:inline">{prof.naam}</span>
            <div className="w-24"><LogoutButton /></div>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-[1000px] px-5 py-8">{children}</main>
    </div>
  );
}
