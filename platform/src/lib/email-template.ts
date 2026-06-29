// Branded DetaVia HTML-email (table-based + inline styles = e-mailclient-proof).
// Pure functie: bruikbaar in client (preview) én server (verzenden).

function esc(s: string) {
  return (s ?? "")
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function paragrafen(body: string) {
  return esc(body)
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 16px;font-size:15px;line-height:1.65;color:#1a1a1e;">${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
}

export type EmailInput = {
  onderwerp: string;
  body: string;
  ctaLabel?: string;
  ctaUrl?: string;
};

const COBALT = "#0047FF";
const YELLOW = "#FFEA4B";

export function renderDetaviaEmail({ onderwerp, body, ctaLabel, ctaUrl }: EmailInput): string {
  const cta = ctaLabel
    ? `<tr><td style="padding:8px 0 4px;">
         <a href="${esc(ctaUrl || "#")}" style="display:inline-block;background:${YELLOW};color:#000;text-decoration:none;font-weight:700;font-size:15px;padding:12px 22px;border-radius:999px;">${esc(ctaLabel)}</a>
       </td></tr>`
    : "";

  return `<!doctype html>
<html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(onderwerp)}</title></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:24px 12px;">
<tr><td align="center">
  <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 6px 24px rgba(0,0,0,.06);">
    <!-- header -->
    <tr><td style="background:${COBALT};padding:22px 32px;">
      <span style="color:#fff;font-size:24px;font-weight:800;letter-spacing:-.5px;">Deta<span style="font-style:italic;">Via</span></span>
      <div style="color:#cdd9ff;font-size:12px;margin-top:2px;">jouw betrouwbare carrièrepartner</div>
    </td></tr>
    <!-- body -->
    <tr><td style="padding:32px;">
      ${paragrafen(body)}
      ${cta ? `<table role="presentation" cellpadding="0" cellspacing="0">${cta}</table>` : ""}
    </td></tr>
    <!-- footer -->
    <tr><td style="padding:20px 32px;background:#fafafa;border-top:1px solid #eee;color:#9a9aa2;font-size:12px;line-height:1.6;">
      DetaVia &middot; Argonweg 72, 1362 AD Almere<br>
      Specialist in het sociaal domein &middot; Leerplicht &middot; Werk &middot; Inkomen &middot; Participatie &middot; Schuldhulpverlening
    </td></tr>
  </table>
  <div style="color:#b5b5bd;font-size:11px;margin-top:14px;">Deze e-mail is verstuurd door DetaVia.</div>
</td></tr>
</table>
</body></html>`;
}
