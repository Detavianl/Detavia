"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function WachtwoordVergeten() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "verstuurd">("idle");
  const [bezig, setBezig] = useState(false);

  async function verstuur(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true);
    const supabase = createClient();
    // Fout bewust niet tonen (voorkomt dat je kunt zien of een adres bestaat).
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/wachtwoord-herstellen`,
    });
    setBezig(false);
    setStatus("verstuurd");
  }

  return (
    <Kader>
      <h1 className="display text-2xl">Wachtwoord vergeten</h1>
      {status === "verstuurd" ? (
        <>
          <p className="mt-2 text-sm text-muted">
            Als er een account bij <b>{email}</b> hoort, is er een e-mail met een herstellink verstuurd. Check ook je spam.
          </p>
          <a href="/login" className="mt-6 inline-block rounded-full bg-cobalt px-6 py-3 font-bold text-white">Terug naar inloggen</a>
        </>
      ) : (
        <>
          <p className="mt-1.5 text-sm text-muted">Vul je e-mailadres in, dan sturen we je een link om een nieuw wachtwoord in te stellen.</p>
          <form onSubmit={verstuur} className="mt-6 grid gap-4">
            <label className="grid gap-1.5"><span className="text-sm font-bold">E-mail</span>
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoFocus className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>
            <button disabled={bezig} className="rounded-full bg-cobalt px-6 py-3.5 font-bold text-white disabled:opacity-60">{bezig ? "Bezig…" : "Stuur herstellink"}</button>
            <a href="/login" className="text-center text-sm font-semibold text-muted hover:text-cobalt">Terug naar inloggen</a>
          </form>
        </>
      )}
    </Kader>
  );
}

function Kader({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cobalt px-5 py-10">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-yellow/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="relative w-full max-w-sm rounded-[26px] bg-white p-8 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo_blue.svg" alt="DetaVia" className="mb-6 h-9" />
        {children}
      </div>
    </div>
  );
}
