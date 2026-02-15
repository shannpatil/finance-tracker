import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/middleware'

const PROTECTED_PREFIXES = ['/dashboard', '/transactions', '/budgets', '/goals', '/settings']

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })
  const supabase = createClient(request, response)

  // Always use getUser() — validates token with the Supabase auth server
  // Never use getSession() in middleware (reads only from cookie, can be spoofed)
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname
  const isProtected = PROTECTED_PREFIXES.some(p => path.startsWith(p))

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (path === '/' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
