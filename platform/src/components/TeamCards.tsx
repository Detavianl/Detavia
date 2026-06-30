"use client";
import { useState } from "react";

export type TeamMember = { naam: string; functie: string; foto: string; email: string; telefoon: string; plaats?: string };

// Placeholder-team (random foto's, namen, mail en nummer). Vervang door echte
// gegevens zodra die er zijn.
const DEFAULT: TeamMember[] = [
  { naam: "Sanne de Vries", functie: "Recruiter", foto: "/img/team-2.jpg", email: "sanne@detavia.nl", telefoon: "080xxxxxx", plaats: "Almere" },
  { naam: "Minhtri Nguyen", functie: "Recruiter", foto: "/img/team-minhtri.jpg", email: "minhtri@detavia.nl", telefoon: "+31 6 13225638", plaats: "Almere" },
  { naam: "Lisa Bakker", functie: "Consultant", foto: "/img/team-3.jpg", email: "lisa@detavia.nl", telefoon: "080xxxxxx", plaats: "Almere" },
  { naam: "Daan Visser", functie: "Recruiter", foto: "/img/team-4.jpg", email: "daan@detavia.nl", telefoon: "080xxxxxx", plaats: "Almere" },
];

const hidden = { backfaceVisibility: "hidden" as const, WebkitBackfaceVisibility: "hidden" as const };

export default function TeamCards({
  title = "Maak kennis met je contactpersonen",
  intro = "Korte lijnen en een vast gezicht. Dit zijn de mensen die met je meedenken.",
  members = DEFAULT,
}: { title?: string; intro?: string; members?: TeamMember[] }) {
  const [flipped, setFlipped] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
      <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Het team</p>
      <h2 className="display mt-2 text-3xl sm:text-4xl">{title}</h2>
      <p className="mt-3 max-w-[52ch] text-lg text-muted">{intro}</p>
      <p className="mt-1.5 text-sm font-semibold text-cobalt">Klik op een teamlid en de kaart draait om naar het visitekaartje.</p>

      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((m, i) => {
          const isFlipped = flipped === i;
          const toggle = () => setFlipped(isFlipped ? null : i);
          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              aria-label={`Visitekaartje van ${m.naam}`}
              onClick={toggle}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
              className="h-[430px] cursor-pointer select-none outline-none"
              style={{ perspective: "1400px" }}
            >
              <div
                className="relative h-full w-full transition-transform duration-500 ease-[cubic-bezier(.4,.2,.2,1)]"
                style={{ transformStyle: "preserve-3d", transform: isFlipped ? "rotateY(180deg)" : "none" }}
              >
                {/* VOORKANT */}
                <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[22px] border border-neutral-200 bg-white shadow-lg" style={hidden}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.foto} alt={m.naam} className="h-[64%] w-full object-cover object-top" />
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="text-lg font-bold leading-tight">{m.naam}</h3>
                    <div className="mt-0.5 text-sm font-bold text-cobalt">{m.functie}</div>
                    <span className="mt-auto inline-flex items-center gap-1.5 text-xs font-bold text-cobalt">
                      <Flip /> Bekijk kaartje
                    </span>
                  </div>
                </div>

                {/* ACHTERKANT (visitekaartje) */}
                <div className="absolute inset-0 flex flex-col overflow-hidden rounded-[22px] bg-cobalt p-6 text-white shadow-lg" style={{ ...hidden, transform: "rotateY(180deg)" }}>
                  <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-yellow/15 blur-2xl" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/img/logo_white.svg" alt="DetaVia" className="relative h-7 w-auto self-start" />
                  <div className="relative mt-auto text-xl font-extrabold">{m.naam}</div>
                  <div className="relative text-sm font-bold text-yellow">{m.functie}</div>
                  <div className="relative my-3 h-[2px] w-10 rounded bg-yellow" />
                  <div className="relative grid gap-2 text-sm">
                    <a href={`tel:${m.telefoon.replace(/\s/g, "")}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2.5 text-white/90 hover:text-white"><Phone /> {m.telefoon}</a>
                    <a href={`mailto:${m.email}`} onClick={(e) => e.stopPropagation()} className="flex items-center gap-2.5 text-white/90 hover:text-white"><Mail /> {m.email}</a>
                    {m.plaats && <span className="flex items-center gap-2.5 text-white/90"><Pin /> {m.plaats}</span>}
                  </div>
                  <span className="relative mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-yellow">← Terug</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function Flip() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5"><path d="M3 12a9 9 0 0 1 15-6.7L21 8" /><path d="M21 3v5h-5" /><path d="M21 12a9 9 0 0 1-15 6.7L3 16" /><path d="M3 21v-5h5" /></svg>;
}
function Phone() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-yellow"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
}
function Mail() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-yellow"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 6L2 7" /></svg>;
}
function Pin() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 shrink-0 text-yellow"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>;
}
