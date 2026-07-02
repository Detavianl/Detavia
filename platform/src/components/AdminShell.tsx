"use client";
import { useState } from "react";
import Link from "next/link";
import AdminNav from "@/components/AdminNav";
import LogoutButton from "@/components/LogoutButton";

// Backend-schil met een vaste zijbalk op desktop en een uitschuifbaar
// hamburgermenu (drawer) op mobiel.
export default function AdminShell({ naam, rol, children }: { naam: string; rol: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Mobiele topbar */}
      <header className="fixed inset-x-0 top-0 z-30 flex items-center justify-between border-b border-neutral-200 bg-white px-4 py-2.5 lg:hidden">
        <Link href="/admin" aria-label="DetaVia beheer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/logo_blue.svg" alt="DetaVia" className="h-6" />
        </Link>
        <button onClick={() => setOpen(true)} aria-label="Menu openen" className="rounded-lg p-2 hover:bg-neutral-100">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-6 w-6"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </header>

      {/* Backdrop (mobiel) */}
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setOpen(false)} aria-hidden />}

      {/* Zijbalk: sticky op desktop, drawer op mobiel */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-64 flex-col overflow-y-auto border-r border-neutral-200 bg-white p-4 transition-transform duration-200 lg:sticky lg:z-auto lg:w-60 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="mb-6 flex items-center justify-between">
          <Link href="/admin" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/img/logo_blue.svg" alt="DetaVia" className="h-7" />
          </Link>
          <button onClick={() => setOpen(false)} aria-label="Menu sluiten" className="rounded-lg p-1.5 hover:bg-neutral-100 lg:hidden">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-5 w-5"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </div>
        {/* Klik op een nav-link sluit de drawer op mobiel */}
        <div onClick={() => setOpen(false)}><AdminNav /></div>
        <div className="mt-auto border-t border-neutral-200 pt-4">
          <p className="px-3 text-sm font-bold">{naam}</p>
          <p className="px-3 text-xs text-muted">{rol}</p>
          <div className="mt-2"><LogoutButton /></div>
          <Link href="/" className="mt-1 block rounded-lg px-3 py-2 text-left text-sm font-semibold text-muted hover:bg-neutral-100">Naar de site</Link>
        </div>
      </aside>

      {/* Inhoud (ruimte voor de mobiele topbar) */}
      <div className="min-w-0 flex-1 overflow-x-hidden pt-[52px] lg:pt-0">{children}</div>
    </div>
  );
}
