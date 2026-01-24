"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useProfile } from "@/hooks/useProfile"
import { ProfileCompletionModal } from "./ProfileCompletionModal"
import { getProfileAction } from "@/app/actions"

const EXCLUDED_ROUTES = [
    "/login",
    "/signup",
    "/partner-signup",
    "/auth/callback",
    "/post-login",
    "/onboarding",
    "/partner/waiting-approval"
]

export function ProfileCheck() {
    const pathname = usePathname()
    const { profile, loading } = useProfile()
    const [showModal, setShowModal] = useState(false)
    const [isChecking, setIsChecking] = useState(false)

    useEffect(() => {
        // Don't show modal on excluded routes
        if (EXCLUDED_ROUTES.includes(pathname)) {
            return
        }

        const checkStatus = async () => {
            if (loading || !profile) return

            setIsChecking(true)
            try {
                // Fetch fresh profile data to check onboarding_status
                const freshProfile = await getProfileAction()

                // Logic to show modal:
                // 1. If onboarding_status is 'pending'
                // 2. OR if essential fields are missing (though they should be filled during onboarding)
                const isIncomplete =
                    freshProfile.onboarding_status === 'pending' ||
                    !freshProfile.primary_skill ||
                    !freshProfile.full_name

                if (isIncomplete) {
                    // Only show if not already dismissed in this session
                    const isDismissed = sessionStorage.getItem('profile-modal-dismissed')
                    if (!isDismissed) {
                        setShowModal(true)
                    }
                }
            } catch (error) {
                console.error("Profile check failed:", error)
            } finally {
                setIsChecking(false)
            }
        }

        checkStatus()
    }, [pathname, profile, loading])

    const handleClose = () => {
        setShowModal(false)
        sessionStorage.setItem('profile-modal-dismissed', 'true')
    }

    if (EXCLUDED_ROUTES.includes(pathname)) {
        return null
    }

    return (
        <ProfileCompletionModal
            isOpen={showModal}
            onClose={handleClose}
        />
    )
}
