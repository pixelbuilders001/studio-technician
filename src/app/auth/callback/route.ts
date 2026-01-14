import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
        return NextResponse.redirect(
            new URL('/login?error=missing_code', origin)
        )
    }

    const supabase = await createClient()

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data?.user) {
        return NextResponse.redirect(
            new URL('/login?error=verification_failed', origin)
        )
    }

    const role = data.user.user_metadata?.intended_role

    /**
     * 🔀 ROLE BASED REDIRECT
     */
    if (role === 'technician') {
        return NextResponse.redirect(
            'https://studio-technician.vercel.app/jobs'
        )
    }

    if (role === 'customer') {
        return NextResponse.redirect(
            'https://fixit.com'
        )
    }

    if (role === 'admin') {
        return NextResponse.redirect(
            'https://fixit.com/admin'
        )
    }

    // fallback
    return NextResponse.redirect(
        new URL('/login?error=unknown_role', origin)
    )
}
