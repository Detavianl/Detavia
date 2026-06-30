import { requireAdmin } from "@/lib/admin-context";
import { MAIL_TEMPLATES } from "@/lib/mail-templates";
import CopyButton from "@/components/CopyButton";

export const dynamic = "force-dynamic";

export default async function MailerPreview() {
  await requireAdmin();

  return (
    <div className="p-8">
      <h1 className="display text-3xl">Mailer-preview</h1>
      <p className="mt-1 text-muted">Voorgemaakte mails in de DetaVia-huisstijl. De placeholders tussen <code className="rounded bg-neutral-100 px-1 text-sm">{"{{...}}"}</code> worden bij verzenden automatisch ingevuld.</p>

      <div className="mt-8 grid gap-8">
        {MAIL_TEMPLATES.map((t) => (
          <section key={t.key} className="grid gap-5 rounded-2xl border border-neutral-200 bg-white p-6 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <span className="rounded-full bg-cobalt/10 px-3 py-1 text-xs font-bold uppercase tracking-wide text-cobalt">{t.naam}</span>
              <dl className="mt-4 grid gap-3 text-sm">
                <div><dt className="font-bold">Wanneer</dt><dd className="text-muted">{t.wanneer}</dd></div>
                <div><dt className="font-bold">Onderwerp</dt><dd className="text-muted">{t.onderwerp}</dd></div>
                <div>
                  <dt className="font-bold">Placeholders</dt>
                  <dd className="mt-1 grid gap-1.5">
                    {t.placeholders.map((p) => (
                      <span key={p.code} className="text-muted">
                        <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-semibold text-ink">{p.code}</code> — {p.uitleg}
                      </span>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-muted">Voorbeeld</p>
                <CopyButton text={t.html} />
              </div>
              <iframe srcDoc={t.html} title={`Preview ${t.naam}`} className="h-[560px] w-full rounded-xl border border-neutral-200 bg-white" />
              <details className="mt-3">
                <summary className="cursor-pointer text-sm font-bold text-cobalt">HTML bekijken</summary>
                <pre className="mt-2 max-h-72 overflow-auto rounded-xl border border-neutral-200 bg-neutral-50 p-3 text-[11px] leading-snug whitespace-pre-wrap break-all">{t.html}</pre>
              </details>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
