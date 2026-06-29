import { verifyToegang } from "./actions";

export const metadata = {
  title: "Toegang | DetaVia",
  robots: { index: false, follow: false },
};

export default async function Toegang({ searchParams }: { searchParams: Promise<{ fout?: string; next?: string }> }) {
  const sp = await searchParams;
  const fout = sp.fout === "1";
  const next = sp.next && sp.next.startsWith("/") ? sp.next : "/";

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cobalt px-5 py-10">
      {/* subtiel huisstijl-accent */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-yellow/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

      <div className="relative w-full max-w-sm rounded-[26px] bg-white p-8 shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/img/logo_blue.svg" alt="DetaVia" className="mb-6 h-9" />
        <h1 className="display text-2xl">Even toegang bevestigen</h1>
        <p className="mt-1.5 text-sm text-muted">Deze site is nog besloten. Voer de toegangscode in om verder te gaan.</p>

        <form action={verifyToegang} className="mt-6 grid gap-4">
          <input type="hidden" name="next" value={next} />
          <input
            name="code"
            type="password"
            inputMode="numeric"
            autoComplete="off"
            autoFocus
            placeholder="• • • •"
            className="rounded-xl border-2 border-neutral-200 px-4 py-3 text-center text-xl tracking-[0.4em] focus:border-cobalt focus:outline-none"
          />
          {fout && <p className="text-sm font-semibold text-red-600">Onjuiste code, probeer het opnieuw.</p>}
          <button className="rounded-full bg-cobalt px-6 py-3.5 font-bold text-white transition hover:brightness-110">Toegang</button>
        </form>
      </div>
    </div>
  );
}
