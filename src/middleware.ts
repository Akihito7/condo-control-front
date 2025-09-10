import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ROUTES_PROTECTED = ['finance', 'communication', 'structure', 'security', 'home'];

export function middleware(request: NextRequest) {

  const cookies = request.cookies.get('@smartCondo:token');

  const token = cookies?.value;

  if (token && request.nextUrl.pathname.startsWith("/signin") || request.url.startsWith('/signup')) {
    return NextResponse.redirect(new URL('/home', request.url))
  }

  const [, pathInital] = request.nextUrl.pathname.split('/')

  if (!token && ROUTES_PROTECTED.includes(pathInital)) {
    return NextResponse.redirect(new URL('signin', request.nextUrl.origin))
  }

}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}