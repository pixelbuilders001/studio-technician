import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    const supabase = await createClient()

    /**
     * 1️⃣ MAGIC LINK / EMAIL VERIFY FLOW
     */
    if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            return NextResponse.redirect(
                new URL('/login?error=verification_failed', origin)
            )
        }
    }

    /**
     * 2️⃣ CHECK SESSION (works for password login too)
     */
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return NextResponse.redirect(
            new URL('/login?error=unauthenticated', origin)
        )
    }

    /**
     * 3️⃣ FETCH PROFILE
     */
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, onboarding_status, is_verified')
        .eq('id', user.id)
        .single()

    if (!profile) {
        return NextResponse.redirect(
            new URL('/login?error=profile_missing', origin)
        )
    }

    /**
     * 4️⃣ ROLE + ONBOARDING BASED REDIRECT
     */
    if (profile.role === 'technician') {
        if (profile.onboarding_status == 'pending') {
            return NextResponse.redirect(
                new URL('/partner-signup', origin)
            )
        }

        if (profile.onboarding_status == 'submitted') {
            return NextResponse.redirect(
                new URL('/partner/waiting-approval', origin)
            )
        }

        if (profile.onboarding_status == 'rejected') {
            return NextResponse.redirect(
                new URL('/onboarding?resubmit=true', origin)
            )
        }

        return NextResponse.redirect(
            new URL('/jobs', origin)
        )
    }

    if (profile.role === 'customer') {
        return NextResponse.redirect(
            new URL('/', origin)
        )
    }

    if (profile.role === 'admin') {
        return NextResponse.redirect(
            new URL('/admin', origin)
        )
    }

    /**
     * 5️⃣ FALLBACK
     */
    return NextResponse.redirect(
        new URL('/login?error=unknown_role', origin)
    )
}
