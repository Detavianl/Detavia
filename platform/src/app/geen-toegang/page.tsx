import Link from "next/link";

export default function GeenToegang() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5 text-center">
      <h1 className="display text-3xl">Geen toegang</h1>
      <p className="max-w-[40ch] text-muted">Je bent ingelogd, maar je account heeft geen beheerrechten voor DetaVia. Vraag een super-admin om je toe te voegen.</p>
      <Link href="/" className="rounded-full bg-cobalt px-6 py-3 font-bold text-white">Naar de site</Link>
    </div>
  );
}
