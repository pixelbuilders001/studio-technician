"use client";

import { useEffect, useState } from "react";
import { messaging } from "@/lib/firebase/config";
import { getToken, onMessage, deleteToken } from "firebase/messaging";
import { updateFcmTokenAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";

/**
 * Custom hook to initialize and manage FCM (Firebase Cloud Messaging) notifications.
 * It handles permission requests, token generation, and listening for foreground messages.
 */
export const useFcm = (userIdProp: string | undefined) => {
    const { toast } = useToast();
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const isBrowser = typeof window !== "undefined";
        if (!isBrowser || !messaging) return;

        const supabase = createClient();

        const setupFcm = async (currentUserId: string) => {
            // Add a small delay to ensure SW is actually ready and controlling
            await new Promise(resolve => setTimeout(resolve, 2000));

            console.log("FCM setup Triggered for user:", currentUserId);

            try {
                // 1. Request Permission
                const permission = await Notification.requestPermission();
                if (permission !== "granted") {
                    console.warn("Notification permission NOT granted.");
                    return;
                }

                // 2. Get registration with fallback
                let registration: ServiceWorkerRegistration | undefined;

                // Try to get existing registration
                const registrations = await navigator.serviceWorker.getRegistrations();
                registration = registrations.find(r => r.active);

                if (!registration) {
                    console.log("No active registration found, waiting for ready...");
                    registration = await navigator.serviceWorker.ready;
                }

                if (!registration) {
                    console.error("Failed to find or wait for service worker registration.");
                    return;
                }

                console.log("Using Service Worker registration:", registration.scope);

                // 3. Delete existing token first to force a new unique token for this user
                try {
                    const deleted = await deleteToken(messaging!);
                    console.log("Existing FCM token deleted:", deleted);
                } catch (deleteError) {
                    console.log("No existing token to delete or deletion failed:", deleteError);
                }

                // 4. Get NEW Token (will be unique for this user session)
                const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
                if (!vapidKey) {
                    console.error("FATAL: NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing from .env!");
                    return;
                }
                const fcmToken = await getToken(messaging!, {
                    vapidKey,
                    serviceWorkerRegistration: registration,
                });

                if (fcmToken) {
                    console.log("FCM Token earned successfully.");
                    setToken(fcmToken);
                    await updateFcmTokenAction(fcmToken);
                    console.log("Token storage process completed.");
                } else {
                    console.warn("Firebase getToken returned an empty string/null.");
                }

            } catch (error: any) {
                console.error("FCM integration error:", error);
            }
        };

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user?.id) {
                setupFcm(session.user.id);
            }
        });

        // Initial check
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user?.id) setupFcm(user.id);
        });

        // Listen for messages from SW
        const handleSwMessage = (event: MessageEvent) => {
            if (event.data && event.data.type === "REFRESH_DATA") {
                console.log("Received REFRESH_DATA from SW");
                window.dispatchEvent(new CustomEvent("fcm-refresh-data", { detail: event.data.payload }));
            } else if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
                console.log("Playing notification sound and refreshing data requested by SW");
                const audio = new Audio("/notification.mp3");
                audio.play().catch((err) => {
                    console.warn("Audio playback failed (browser restrictions):", err);
                });
                // Trigger data refresh on arrival
                window.dispatchEvent(new CustomEvent("fcm-refresh-data", { detail: event.data.payload?.data }));
            }
        };

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.addEventListener("message", handleSwMessage);
        }

        // Foreground handler
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log("Foreground message:", payload);
            try {
                const audio = new Audio("/notification.mp3");
                audio.play().catch(() => { });
            } catch (e) { }

            toast({
                title: payload.notification?.title || "Update",
                description: payload.notification?.body || "New job notification",
            });

            // Trigger data refresh if app is open
            console.log("Foreground message received, triggering refresh...");
            window.dispatchEvent(new CustomEvent("fcm-refresh-data", { detail: payload.data }));
        });

        return () => {
            subscription.unsubscribe();
            unsubscribe();
        };
    }, [toast]);

    return { token };
};
