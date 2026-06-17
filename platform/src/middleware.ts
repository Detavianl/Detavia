import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Refresht de Supabase-sessie op elke request en beschermt /admin/*.
export async function middleware(request: NextRequest) {
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

  // /admin en /portaal vereisen een ingelogde gebruiker (rolcheck gebeurt server-side)
  const path = request.nextUrl.pathname;
  const beschermd = path.startsWith("/admin") || path.startsWith("/portaal") || path.startsWith("/opdrachtgever");
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
