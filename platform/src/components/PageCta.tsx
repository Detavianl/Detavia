import Link from "next/link";

type Props = {
  title: string;
  text: string;
  primary: { href: string; label: string };
  secondary?: { href: string; label: string };
};

// Afsluitende CTA-band in DetaVia-stijl (cobalt vlak, gele hoofdknop).
export default function PageCta({ title, text, primary, secondary }: Props) {
  return (
    <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
      <div className="rounded-[26px] bg-cobalt px-8 py-12 text-center text-white sm:px-12">
        <h2 className="display text-3xl sm:text-4xl">{title}</h2>
        <p className="mx-auto mt-3 max-w-[52ch] text-lg text-white/90">{text}</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          <Link href={primary.href} className="rounded-full bg-yellow px-6 py-3.5 font-bold text-black transition hover:-translate-y-0.5">{primary.label}</Link>
          {secondary && <Link href={secondary.href} className="font-bold text-white hover:underline">{secondary.label}</Link>}
        </div>
      </div>
    </section>
  );
}
