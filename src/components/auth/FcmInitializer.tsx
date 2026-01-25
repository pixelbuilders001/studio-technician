"use client";

import { useFcm } from "@/hooks/useFcm";
import { useProfile } from "@/hooks/useProfile";

export function FcmInitializer() {
    const { profile } = useProfile();
    // Initialize FCM when profile is available
    useFcm(profile?.id);

    return null; // This component doesn't render anything
}
