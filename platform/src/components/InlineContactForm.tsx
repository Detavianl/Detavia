import { submitContact } from "@/app/(public)/actions";

type Props = {
  soort: "professional" | "opdrachtgever";
  title: string;
  text: string;
  button: string;
  organisatie?: boolean;
};

// Inline formulier dat via submitContact als bericht binnenkomt bij beheer.
export default function InlineContactForm({ soort, title, text, button, organisatie }: Props) {
  return (
    <section className="bg-neutral-50">
      <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-20 sm:px-10 md:grid-cols-2">
        <div>
          <h2 className="display text-3xl sm:text-4xl">{title}</h2>
          <p className="mt-3 max-w-[44ch] text-lg text-muted">{text}</p>
          <dl className="mt-8 grid gap-3 text-sm">
            <div><dt className="font-bold">Telefoon</dt><dd><a href="tel:080xxxxxx" className="text-cobalt hover:underline">080xxxxxx</a></dd></div>
            <div><dt className="font-bold">E-mail</dt><dd><a href="mailto:info@detavia.nl" className="text-cobalt hover:underline">info@detavia.nl</a></dd></div>
          </dl>
        </div>
        <form action={submitContact} className="rounded-[22px] bg-white p-8 shadow-sm">
          <input type="hidden" name="soort" value={soort} />
          <div className="grid gap-4">
            <Field label="Naam" name="naam" />
            {organisatie && <Field label="Organisatie" name="organisatie" />}
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="E-mail" name="email" type="email" />
              <Field label="Telefoon" name="telefoon" type="tel" />
            </div>
            <label className="grid gap-1.5">
              <span className="text-sm font-bold">Je bericht</span>
              <textarea name="bericht" rows={4} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3" />
            </label>
            <button className="justify-self-start rounded-full bg-cobalt px-6 py-3 font-bold text-white transition hover:-translate-y-0.5">{button}</button>
            <p className="text-xs text-muted">Vrijblijvend. We reageren snel en persoonlijk.</p>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-sm font-bold">{label}</span>
      <input name={name} type={type} className="rounded-xl border-2 border-neutral-200 bg-white px-4 py-3" />
    </label>
  );
}
