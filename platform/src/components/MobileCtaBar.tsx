import Link from "next/link";

// Vaste actiebalk onderaan op mobiel: één route voor kandidaten, één voor opdrachtgevers.
export default function MobileCtaBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-neutral-200 bg-white/95 p-3 backdrop-blur md:hidden">
      <div className="mx-auto flex max-w-[1180px] gap-2.5 px-2">
        <Link href="/vacatures" className="flex-1 rounded-full bg-cobalt py-3 text-center font-bold text-white">Solliciteer</Link>
        <Link href="/voor-opdrachtgevers" className="flex-1 rounded-full border-2 border-cobalt py-2.5 text-center font-bold text-cobalt">Personeel nodig?</Link>
      </div>
    </div>
  );
}
