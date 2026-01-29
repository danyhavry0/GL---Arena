import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("sb-access-token")?.value;

  // Route pubbliche (non richiedono autenticazione)
  const publicRoutes = ["/"];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Se l'utente cerca di accedere a route protette senza token,
  // il componente ProtectedRoute gestirà il redirect
  // Questo middleware è semplificato - la protezione vera è nel componente

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (gestite separatamente)
     */
    "/((?!_next/static|_next/image|favicon.ico|api).*)",
  ],
};
