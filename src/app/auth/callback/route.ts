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

    // 1️⃣ Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (error || !data?.user) {
        return NextResponse.redirect(
            new URL('/login?error=auth_failed', origin)
        )
    }

    const userId = data.user.id

    // 2️⃣ Fetch profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, onboarding_status, is_verified')
        .eq('id', userId)
        .single()

    if (profileError || !profile) {
        return NextResponse.redirect(
            new URL('/login?error=profile_missing', origin)
        )
    }

    // 3️⃣ ROLE + STATUS BASED ACCESS
    switch (profile.role) {
        case 'technician':
            // 🚧 NOT onboarded
            if (profile.onboarding_status === 'pending') {
                return NextResponse.redirect(
                    'https://studio-technician.vercel.app/partner-signup'
                )
            }

            // ⏳ Waiting approval
            if (profile.onboarding_status === 'submitted') {
                return NextResponse.redirect(
                    'https://studio-technician.vercel.app/partner/waiting-approval'
                )
            }

            // ❌ Rejected
            if (profile.onboarding_status === 'rejected') {
                return NextResponse.redirect(
                    'https://studio-technician.vercel.app/partner/onboarding?resubmit=true'
                )
            }

            // ✅ Fully approved
            if (
                profile.onboarding_status === 'approved' &&
                profile.is_verified
            ) {
                return NextResponse.redirect(
                    'https://fixit.technician.com/jobs'
                )
            }

            break

        case 'customer':
            return NextResponse.redirect('https://fixit.com')

        case 'admin':
            return NextResponse.redirect('https://fixit.com/admin')
    }

    // fallback
    return NextResponse.redirect(
        new URL('/login?error=access_denied', origin)
    )
}
