"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [wachtwoord, setWachtwoord] = useState("");
  const [fout, setFout] = useState("");
  const [bezig, setBezig] = useState(false);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setBezig(true); setFout("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password: wachtwoord });
    if (error) { setFout("Inloggen mislukt. Controleer je gegevens."); setBezig(false); return; }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-5">
      <div className="w-full max-w-sm rounded-[22px] bg-white p-8 shadow-xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo_blue.svg" alt="DetaVia" className="mb-6 h-8" />
        <h1 className="display text-2xl">Beheer</h1>
        <p className="mt-1 text-sm text-muted">Log in met je DetaVia-account.</p>
        <form onSubmit={login} className="mt-6 grid gap-4">
          <label className="grid gap-1.5">
            <span className="text-sm font-bold">E-mail</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                   className="rounded-xl border-2 border-neutral-200 px-4 py-3" />
          </label>
          <label className="grid gap-1.5">
            <span className="text-sm font-bold">Wachtwoord</span>
            <input type="password" required value={wachtwoord} onChange={(e) => setWachtwoord(e.target.value)}
                   className="rounded-xl border-2 border-neutral-200 px-4 py-3" />
          </label>
          {fout && <p className="text-sm font-semibold text-red-600">{fout}</p>}
          <button disabled={bezig} className="rounded-full bg-cobalt px-6 py-3 font-bold text-white disabled:opacity-60">
            {bezig ? "Bezig…" : "Inloggen"}
          </button>
        </form>
      </div>
    </div>
  );
}
