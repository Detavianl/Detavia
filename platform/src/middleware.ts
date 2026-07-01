import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { TOEGANG_COOKIE, TOEGANG_TOKEN } from "@/lib/toegang";

// Refresht de Supabase-sessie op elke request, beschermt /admin/* en zet een
// toegangscode-poort voor de hele site (pre-launch).
export async function middleware(request: NextRequest) {
  const pad = request.nextUrl.pathname;

  // Toegangspoort: zonder geldige cookie eerst naar /toegang.
  // /uitnodiging is uitgezonderd zodat uitgenodigde beheerders hun account kunnen activeren.
  const heeftToegang = request.cookies.get(TOEGANG_COOKIE)?.value === TOEGANG_TOKEN;
  if (!heeftToegang && pad !== "/toegang" && !pad.startsWith("/uitnodiging")) {
    const naar = request.nextUrl.clone();
    naar.pathname = "/toegang";
    naar.search = "";
    naar.searchParams.set("next", pad + request.nextUrl.search);
    return NextResponse.redirect(naar);
  }

  let response = NextResponse.next({ request });

  // Zonder geconfigureerde Supabase (lokaal nog niet gekoppeld): niets doen,
  // zodat de publieke site gewoon rendert.
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key || key === "replace-me") return response;

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data: { user } } = await supabase.auth.getUser();

  // /admin vereist een ingelogde gebruiker (rolcheck gebeurt server-side)
  const path = request.nextUrl.pathname;
  const beschermd = path.startsWith("/admin");
  if (beschermd && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|fonts/|.*\\.(?:svg|png|jpg|jpeg|webp|woff2)$).*)"],
};
