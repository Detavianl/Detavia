export const metadata = { title: "Over DetaVia | Specialist in het sociaal domein" };

export default function OverOns() {
  return (
    <>
      <section className="relative overflow-hidden bg-cobalt text-white">
        <div className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
          <p className="text-sm font-semibold opacity-80">Home / Over ons</p>
          <h1 className="display mt-3 max-w-[18ch] text-4xl sm:text-6xl">Wij versterken het sociaal domein</h1>
          <p className="mt-4 max-w-[54ch] text-lg opacity-95">DetaVia combineert ervaring met frisse perspectieven, zodat we samen talent inzetten voor échte maatschappelijke impact.</p>
        </div>
      </section>
      <section className="mx-auto max-w-[1180px] px-5 py-20 sm:px-10">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.16em] opacity-60">Wie we zijn</p>
            <h2 className="display mt-2 text-3xl sm:text-4xl">Jouw betrouwbare carrièrepartner</h2>
            <p className="mt-6 text-lg text-muted">Bij DetaVia geloven we dat goed werk in het sociaal domein begint bij de juiste mensen op de juiste plek. Daarom richten we ons uitsluitend op het sociaal domein, niets anders. Die volledige focus zorgt voor diepe vakkennis, een sterk netwerk en matches die echt kloppen.</p>
            <p className="mt-3.5 text-lg text-muted">We zijn laagdrempelig, betrouwbaar en betrokken. Niet de grootste, wel de partner die je écht kent.</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/office-worker-960x640.jpg" alt="Werken in het sociaal domein" className="aspect-[4/5] w-full rounded-[22px] object-cover" />
        </div>
      </section>
    </>
  );
}
