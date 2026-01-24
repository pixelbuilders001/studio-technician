import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    const supabase = await createClient()

    // 1️⃣ Exchange magic link code for session
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            return NextResponse.redirect(
                new URL('/login?error=verification_failed', origin)
            )
        }
    }

    // 2️⃣ ALWAYS redirect to post-login (important)
    return NextResponse.redirect(new URL('/post-login', origin))
}
