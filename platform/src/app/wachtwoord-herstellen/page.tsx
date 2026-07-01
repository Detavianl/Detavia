"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function WachtwoordHerstellen() {
  return (
    <Suspense fallback={<Kader><p className="text-muted">Even laden…</p></Kader>}>
      <Inner />
    </Suspense>
  );
}

function Inner() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState<"verifieren" | "klaar" | "fout">("verifieren");
  const [fout, setFout] = useState("");
  const [ww1, setWw1] = useState("");
  const [ww2, setWw2] = useState("");
  const [bezig, setBezig] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const token_hash = params.get("token_hash");
    if (token_hash) {
      supabase.auth.verifyOtp({ token_hash, type: "recovery" }).then(({ error }) => {
        if (error) { setStatus("fout"); setFout("Deze herstellink is verlopen of al gebruikt. Vraag een nieuwe aan."); }
        else setStatus("klaar");
      });
      return;
    }
    // Terugval: sommige e-mails leveren de sessie via de URL-hash aan.
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) { setStatus("klaar"); return; }
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        if (session) setStatus("klaar");
      });
      setTimeout(() => { setStatus((s) => (s === "verifieren" ? "fout" : s)); }, 4000);
      return () => sub.subscription.unsubscribe();
    });
  }, [params]);

  async function opslaan(e: React.FormEvent) {
    e.preventDefault();
    if (ww1.length < 8) { setFout("Kies een wachtwoord van minimaal 8 tekens."); return; }
    if (ww1 !== ww2) { setFout("De twee wachtwoorden komen niet overeen."); return; }
    setBezig(true); setFout("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: ww1 });
    if (error) { setFout("Opslaan mislukt: " + error.message); setBezig(false); return; }
    router.push("/admin");
    router.refresh();
  }

  return (
    <Kader>
      <h1 className="display text-2xl">Nieuw wachtwoord instellen</h1>
      {status === "verifieren" && <p className="mt-2 text-sm text-muted">We controleren je herstellink…</p>}

      {status === "fout" && (
        <>
          <p className="mt-3 text-sm font-semibold text-red-600">{fout || "Deze herstellink is ongeldig of verlopen."}</p>
          <a href="/wachtwoord-vergeten" className="mt-6 inline-block rounded-full bg-cobalt px-6 py-3 font-bold text-white">Nieuwe link aanvragen</a>
        </>
      )}

      {status === "klaar" && (
        <>
          <p className="mt-1.5 text-sm text-muted">Kies een nieuw wachtwoord voor je account.</p>
          <form onSubmit={opslaan} className="mt-6 grid gap-4">
            <label className="grid gap-1.5"><span className="text-sm font-bold">Nieuw wachtwoord</span>
              <input type="password" value={ww1} onChange={(e) => setWw1(e.target.value)} autoFocus placeholder="Minimaal 8 tekens" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>
            <label className="grid gap-1.5"><span className="text-sm font-bold">Herhaal wachtwoord</span>
              <input type="password" value={ww2} onChange={(e) => setWw2(e.target.value)} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>
            {fout && <p className="text-sm font-semibold text-red-600">{fout}</p>}
            <button disabled={bezig} className="rounded-full bg-cobalt px-6 py-3.5 font-bold text-white disabled:opacity-60">{bezig ? "Bezig…" : "Wachtwoord opslaan"}</button>
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
