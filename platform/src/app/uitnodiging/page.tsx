"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { grantToegangAlsAdmin } from "./actions";

export default function UitnodigingPage() {
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
    const token_hash = params.get("token_hash");
    const type = (params.get("type") || "invite") as "invite" | "recovery" | "email" | "signup";
    if (!token_hash) { setStatus("fout"); setFout("Deze link is ongeldig of onvolledig."); return; }
    const supabase = createClient();
    supabase.auth.verifyOtp({ token_hash, type }).then(({ error }) => {
      if (error) { setStatus("fout"); setFout("Deze uitnodigingslink is verlopen of al gebruikt. Vraag een nieuwe uitnodiging aan."); }
      else setStatus("klaar");
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
    await grantToegangAlsAdmin();
    router.push("/admin");
    router.refresh();
  }

  return (
    <Kader>
      <h1 className="display text-2xl">Welkom bij het DetaVia-beheer</h1>
      {status === "verifieren" && <p className="mt-2 text-sm text-muted">We controleren je uitnodiging…</p>}

      {status === "fout" && (
        <>
          <p className="mt-3 text-sm font-semibold text-red-600">{fout}</p>
          <a href="/login" className="mt-6 inline-block rounded-full bg-cobalt px-6 py-3 font-bold text-white">Naar inloggen</a>
        </>
      )}

      {status === "klaar" && (
        <>
          <p className="mt-1.5 text-sm text-muted">Kies een wachtwoord om je account te activeren.</p>
          <form onSubmit={opslaan} className="mt-6 grid gap-4">
            <label className="grid gap-1.5"><span className="text-sm font-bold">Wachtwoord</span>
              <input type="password" value={ww1} onChange={(e) => setWw1(e.target.value)} autoFocus placeholder="Minimaal 8 tekens" className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>
            <label className="grid gap-1.5"><span className="text-sm font-bold">Herhaal wachtwoord</span>
              <input type="password" value={ww2} onChange={(e) => setWw2(e.target.value)} className="w-full rounded-xl border-2 border-neutral-200 px-4 py-3" /></label>
            {fout && <p className="text-sm font-semibold text-red-600">{fout}</p>}
            <button disabled={bezig} className="rounded-full bg-cobalt px-6 py-3.5 font-bold text-white disabled:opacity-60">{bezig ? "Bezig…" : "Account activeren"}</button>
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
