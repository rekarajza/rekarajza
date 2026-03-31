import { NextRequest, NextResponse } from 'next/server';

const MAINTENANCE = process.env.MAINTENANCE_MODE === 'true';
const BYPASS_SECRET = process.env.MAINTENANCE_BYPASS || 'reka2024';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow: admin, api, static files
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon') ||
    pathname === '/karbantartas'
  ) {
    return NextResponse.next();
  }

  // Allow bypass via cookie
  const bypassCookie = req.cookies.get('maintenance_bypass')?.value;
  if (bypassCookie === BYPASS_SECRET) {
    return NextResponse.next();
  }

  // Allow setting bypass cookie via ?bypass=secret
  const bypass = req.nextUrl.searchParams.get('bypass');
  if (bypass === BYPASS_SECRET) {
    const res = NextResponse.redirect(new URL(pathname, req.url));
    res.cookies.set('maintenance_bypass', BYPASS_SECRET, { path: '/', maxAge: 60 * 60 * 24 });
    return res;
  }

  if (MAINTENANCE) {
    return NextResponse.rewrite(new URL('/karbantartas', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
