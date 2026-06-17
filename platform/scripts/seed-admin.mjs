// Maakt de eerste super-admin aan.
// Gebruik:  node scripts/seed-admin.mjs "naam@detavia.nl" "wachtwoord" "Volledige Naam"
// Vereist NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY in .env.local
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";

// simpele .env.local loader
try {
  for (const line of readFileSync(new URL("../.env.local", import.meta.url), "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
} catch {}

const [email, password, naam = ""] = process.argv.slice(2);
if (!email || !password) {
  console.error('Gebruik: node scripts/seed-admin.mjs "email" "wachtwoord" "Naam"');
  process.exit(1);
}
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key || key === "replace-me") {
  console.error("Vul eerst NEXT_PUBLIC_SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false } });

const { data: created, error } = await sb.auth.admin.createUser({ email, password, email_confirm: true });
let userId = created?.user?.id;
if (error) {
  const { data: list } = await sb.auth.admin.listUsers();
  userId = list?.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
  if (!userId) { console.error("Fout:", error.message); process.exit(1); }
}
const { error: e2 } = await sb.from("admin_users").upsert({ user_id: userId, naam, role: "super_admin" });
if (e2) { console.error("Fout bij admin_users:", e2.message); process.exit(1); }
console.log(`✓ Super-admin klaar: ${email}`);
