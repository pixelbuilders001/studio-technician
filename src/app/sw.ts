import { defaultCache } from "@serwist/next/worker";
import { type PrecacheEntry, Serwist, type SerwistGlobalConfig } from "serwist";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

// Service Worker Version - Increment this to force browser to update cached assets
const SW_VERSION = "1.0.3";
console.log(`Service Worker Version: ${SW_VERSION}`);

// Force update on install
self.addEventListener("install", () => {
    console.log("Service Worker installing...");
    (self as any).skipWaiting();
});

self.addEventListener("activate", (event: any) => {
    console.log("Service Worker activating...");
    event.waitUntil((self as any).clients.claim());
});

// This declares the service worker scope
declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
        addEventListener: (type: string, listener: (event: any) => void) => void;
        location: { origin: string };
        clients: {
            matchAll: (options?: any) => Promise<any[]>;
            openWindow: (url: string) => Promise<any>;
        };
    }
}

declare const self: WorkerGlobalScope;

// Initialize Firebase in SW
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

onBackgroundMessage(messaging, (payload) => {
    console.log("Background message received:", payload);

    // Message all open clients to play sound
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
        clients.forEach(client => {
            client.postMessage({
                type: 'PLAY_NOTIFICATION_SOUND',
                payload: payload
            });
        });
    });

    // CRITICAL: Avoid duplicates.
    // If the payload has a 'notification' property, FCM will display it automatically.
    // We MUST NOT call showNotification manually in this case.
    if (payload.notification) {
        console.log("FCM notification detected. Skipping manual display to prevent duplicates.");
        return;
    }

    // Only show manual notification for 'data' messages that don't have a 'notification' key
    if (payload.data && (payload.data.title || payload.data.body)) {
        console.log("Showing manual notification for data-only message.");
        const notificationTitle = payload.data.title || 'New Job Assigned';
        const notificationOptions = {
            body: payload.data.body || 'You have a new job assigned. check it now!',
            icon: '/logo-image.png',
            badge: '/icons/icon-192x192.png',
            data: payload.data,
            vibrate: [200, 100, 200, 100, 200, 100, 200],
            sound: '/notification.mp3',
        };
        (self as any).registration.showNotification(notificationTitle, notificationOptions);
    }
});

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: defaultCache,
});

serwist.addEventListeners();

// Handle notification click
self.addEventListener('notificationclick', (event: any) => {
    event.notification.close();

    const urlToOpen = new URL('/jobs?tab=new', self.location.origin).href;

    const promiseChain = self.clients.matchAll({
        type: 'window',
        includeUncontrolled: true
    }).then((windowClients: any[]) => {
        let matchingClient = null;

        for (let i = 0; i < windowClients.length; i++) {
            const client = windowClients[i];
            if (client.url === urlToOpen || client.url.includes('/jobs')) {
                matchingClient = client;
                break;
            }
        }

        if (matchingClient) {
            // Focus existing window and send refresh signal
            matchingClient.postMessage({
                type: 'REFRESH_DATA',
                payload: event.notification.data
            });
            return matchingClient.focus();
        } else {
            // Open new window
            return self.clients.openWindow(urlToOpen);
        }
    });

    event.waitUntil(promiseChain);
});
