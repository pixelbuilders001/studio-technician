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

    const requestPermission = async () => {
        if (typeof window === "undefined" || !("Notification" in window)) {
            console.warn("Notifications not supported in this browser.");
            return false;
        }

        try {
            const permission = await Notification.requestPermission();
            console.log("Notification permission status:", permission);
            return permission === "granted";
        } catch (error) {
            console.error("Error requesting notification permission:", error);
            return false;
        }
    };

    useEffect(() => {
        const isBrowser = typeof window !== "undefined";
        if (!isBrowser || !messaging) return;

        const supabase = createClient();

        const setupFcm = async (currentUserId: string) => {
            console.log("FCM setup Triggered for user:", currentUserId);

            try {
                // 1. Check/Request Permission (non-blocking for background logic)
                // note: on iOS this MUST be called from a user gesture. 
                // We keep it here as a fallback/check, but the main trigger should be manual.
                const permission = Notification.permission;
                if (permission === "default") {
                    console.log("Permission is default, waiting for user gesture trigger...");
                    // Don't auto-request here with a delay as it fails on iOS
                } else if (permission !== "granted") {
                    console.warn("Notification permission NOT granted.");
                    return;
                }

                // 2. Get registration - much more robust waiting
                if (!("serviceWorker" in navigator)) {
                    console.error("Service workers are not supported.");
                    return;
                }

                let registration = await navigator.serviceWorker.ready;

                if (!registration) {
                    console.error("Failed to find or wait for service worker registration.");
                    return;
                }

                console.log("Using Service Worker registration:", registration.scope);

                // 3. Delete existing token first to force a new unique token for this user
                try {
                    await deleteToken(messaging!);
                } catch (deleteError) {
                    // Ignore deletion errors
                }

                // 4. Get NEW Token
                const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
                if (!vapidKey) {
                    console.error("FATAL: NEXT_PUBLIC_FIREBASE_VAPID_KEY is missing!");
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
                window.dispatchEvent(new CustomEvent("fcm-refresh-data", { detail: event.data.payload }));
            } else if (event.data && event.data.type === "PLAY_NOTIFICATION_SOUND") {
                const audio = new Audio("/notification.mp3");
                audio.play().catch((err) => {
                    console.warn("Audio playback failed:", err);
                });
                window.dispatchEvent(new CustomEvent("fcm-refresh-data", { detail: event.data.payload?.data }));
            }
        };

        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.addEventListener("message", handleSwMessage);
        }

        // Foreground handler
        const unsubscribeOnMessage = onMessage(messaging, (payload) => {
            console.log("Foreground message:", payload);
            try {
                const audio = new Audio("/notification.mp3");
                audio.play().catch(() => { });
            } catch (e) { }

            toast({
                title: payload.notification?.title || "Update",
                description: payload.notification?.body || "New job notification",
            });

            window.dispatchEvent(new CustomEvent("fcm-refresh-data", { detail: payload.data }));
        });

        return () => {
            subscription.unsubscribe();
            unsubscribeOnMessage();
            if ("serviceWorker" in navigator) {
                navigator.serviceWorker.removeEventListener("message", handleSwMessage);
            }
        };
    }, [toast]);

    return { token, requestPermission };
};
