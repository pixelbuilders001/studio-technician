import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')

    if (!code) {
        return NextResponse.redirect(new URL('/login?error=missing_code', origin))
    }

    const supabase = await createClient()

    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error || !data?.user) {
        return NextResponse.redirect(new URL('/login?error=verification_failed', origin))
    }

    const userId = data.user.id

    // ✅ Fetch user profile to get role and onboarding_status
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, onboarding_status, is_verified')
        .eq('id', userId)
        .maybeSingle()

    if (profileError || !profile) {
        return NextResponse.redirect(new URL('/login?error=profile_missing', origin))
    }

    // 🔀 ROLE BASED & STATUS BASED REDIRECT
    if (profile.role === 'technician') {
        if (profile.onboarding_status === 'pending') {
            // First-time signup → fill partner form
            return NextResponse.redirect('https://studio-technician.vercel.app/partner-signup')
        }

        if (profile.onboarding_status === 'submitted') {
            // Waiting for admin approval
            return NextResponse.redirect('https://studio-technician.vercel.app/partner/waiting-approval')
        }

        if (profile.onboarding_status === 'approved' && profile.is_verified) {
            // Full access
            return NextResponse.redirect('https://studio-technician.vercel.app/jobs')
        }

        if (profile.onboarding_status === 'rejected') {
            // Allow resubmission
            return NextResponse.redirect('https://studio-technician.vercel.app/partner/onboarding?resubmit=true')
        }
    }

    if (profile.role === 'customer') {
        return NextResponse.redirect('https://fixit.com')
    }

    if (profile.role === 'admin') {
        return NextResponse.redirect('https://fixit.com/admin')
    }

    // Fallback
    return NextResponse.redirect(new URL('/login?error=unknown_role', origin))
}
