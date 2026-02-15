import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Per-request server client — call fresh each time; never cache at module level
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Components cannot set cookies —
            // middleware handles session refresh automatically
          }
        },
      },
    }
  )
}
