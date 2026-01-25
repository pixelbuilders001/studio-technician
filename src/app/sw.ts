import { defaultCache } from "@serwist/next/worker";
import { type PrecacheEntry, Serwist, type SerwistGlobalConfig } from "serwist";
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

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
    const notificationTitle = payload.notification?.title || 'New Job Assigned';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new job assigned. check it now!',
        icon: '/logo-image.png',
        badge: '/icons/icon-192x192.png',
        data: payload.data,
    };

    (self as any).registration.showNotification(notificationTitle, notificationOptions);
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
