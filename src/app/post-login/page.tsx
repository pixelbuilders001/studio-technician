import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function PostLoginPage() {
    const supabase = await createClient()

    // 1️⃣ Get user
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login?error=unauthenticated')
    }

    // 2️⃣ Fetch profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, onboarding_status, is_verified')
        .eq('id', user.id)
        .single()

    if (!profile) {
        redirect('/login?error=profile_missing')
    }

    // 3️⃣ Technician routing
    if (profile.role === 'technician') {
        if (profile.onboarding_status === 'pending') {
            redirect('/partner-signup')
        }

        if (profile.onboarding_status === 'submitted') {
            redirect('/partner/waiting-approval')
        }

        if (profile.onboarding_status === 'rejected') {
            redirect('/onboarding?resubmit=true')
        }

        redirect('/jobs')
    }

    // 4️⃣ Block all other roles
    await supabase.auth.signOut()
    redirect('/login?error=access_denied')
}
