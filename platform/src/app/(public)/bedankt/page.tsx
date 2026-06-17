import Link from "next/link";

export const metadata = { title: "Bedankt | DetaVia" };

export default function Bedankt() {
  return (
    <section className="mx-auto flex max-w-[760px] flex-col items-center px-5 py-28 text-center sm:px-10">
      <h1 className="display text-4xl sm:text-5xl">Bedankt!</h1>
      <p className="mt-4 max-w-[44ch] text-lg text-muted">We hebben je bericht ontvangen en nemen zo snel mogelijk persoonlijk contact met je op.</p>
      <Link href="/" className="mt-8 rounded-full bg-cobalt px-6 py-3 font-bold text-white">Terug naar de site</Link>
    </section>
  );
}
