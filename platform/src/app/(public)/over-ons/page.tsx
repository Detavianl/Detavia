import PageCta from "@/components/PageCta";

export const metadata = {
  title: "Over DetaVia",
  description: "DetaVia is uitsluitend gespecialiseerd in het sociaal domein. Persoonlijk, betrouwbaar en met diepe vakkennis verbinden we professionals en opdrachtgevers.",
  alternates: { canonical: "/over-ons" },
};

const waarden = [
  { t: "Betrokken, ook na de start", d: "We blijven betrokken nadat de nieuwe collega is gestart. Juist die blijvende betrokkenheid na de plaatsing maakt voor ons het verschil, voor de professional en voor de opdracht." },
  { t: "Alleen sociaal domein", d: "Leerplicht, Werk, Inkomen, Participatie en Schuldhulpverlening. Geen versnippering, wel diepe vakkennis en een sterk netwerk." },
  { t: "Persoonlijk", d: "Een vast aanspreekpunt dat je echt kent. We luisteren eerst, daarna matchen we, geen hagel maar maatwerk." },
  { t: "Betrouwbaar", d: "Heldere afspraken, eerlijke voorwaarden en alles netjes geregeld. We doen wat we beloven." },
];

export default function OverOns() {
  return (
    <>
      {/* HERO */}
      <section className="bg-cobalt text-white">
        <div className="mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-10 px-5 py-16 sm:px-10 md:grid-cols-[1.1fr_.9fr]">
          <div>
            <p className="text-sm font-semibold opacity-80">Home / Over ons</p>
            <h1 className="display mt-3 text-4xl sm:text-6xl">Wij versterken het sociaal domein</h1>
            <p className="mt-5 max-w-[46ch] text-lg font-medium text-white/90">DetaVia combineert ervaring met frisse perspectieven, zodat we samen talent inzetten voor échte maatschappelijke impact.</p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <a href="/vacatures" className="rounded-full bg-yellow px-6 py-3.5 font-bold text-black">Bekijk vacatures</a>
              <a href="/voor-opdrachtgevers" className="rounded-full border-2 border-white px-6 py-3.5 font-bold text-white">Voor opdrachtgevers</a>
            </div>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/team-meeting-600x448.jpg" alt="Het team van DetaVia in overleg" className="order-first aspect-[4/3] w-full rounded-[22px] object-cover shadow-2xl md:order-none" />
        </div>
      </section>

      {/* WIE WE ZIJN */}
      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Wie we zijn</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">Jouw betrouwbare carrièrepartner</h2>
            <p className="mt-6 text-lg text-muted">Bij DetaVia geloven we dat goed werk in het sociaal domein begint bij de juiste mensen op de juiste plek. Daarom richten we ons uitsluitend op het sociaal domein, niets anders. Die volledige focus zorgt voor diepe vakkennis, een sterk netwerk en matches die echt kloppen.</p>
            <p className="mt-3.5 text-lg text-muted">We zijn laagdrempelig, betrouwbaar en betrokken. Niet de grootste, wel de partner die je écht kent.</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/office-worker-960x640.jpg" alt="Samenwerken in het sociaal domein" className="aspect-[4/3] w-full rounded-[22px] object-cover" />
        </div>
      </section>

      {/* WAAR WE VOOR STAAN */}
      <section className="bg-neutral-50">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
          <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Waar we voor staan</p>
          <h2 className="display mt-2 text-3xl sm:text-4xl">Onze kernwaarden</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {waarden.map((w) => (
              <div key={w.t} className="rounded-[22px] bg-white p-7 shadow-sm">
                <h3 className="text-xl font-bold">{w.t}</h3>
                <p className="mt-2 text-muted">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="mx-auto max-w-[1180px] px-5 pt-20 sm:px-10">
        <div className="grid grid-cols-2 gap-6 rounded-[26px] bg-cobalt px-8 py-12 text-center text-white sm:grid-cols-3">
          {[["100%", "Focus op het sociaal domein"], ["Persoonlijk", "Vast aanspreekpunt"], ["Betrouwbaar", "Alles netjes geregeld"]].map(([n, l]) => (
            <div key={l}>
              <div className="text-2xl font-extrabold text-yellow sm:text-3xl">{n}</div>
              <div className="mt-2 text-sm text-white/85">{l}</div>
            </div>
          ))}
        </div>
      </section>

      <PageCta
        title="Samen het verschil maken?"
        text="Of je nu werk zoekt of een professional nodig hebt in het sociaal domein, we helpen je graag persoonlijk verder."
        primary={{ href: "/vacatures", label: "Bekijk vacatures" }}
        secondary={{ href: "/contact", label: "Neem contact op" }}
      />
    </>
  );
}
