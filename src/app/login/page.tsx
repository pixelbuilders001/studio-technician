"use client";

import { LoginForm } from "@/components/auth/LoginForm";
import { useTranslation } from "@/hooks/useTranslation";

const RegistrationIllustration = () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-xs mx-auto">
        <circle cx="100" cy="100" r="80" fill="hsl(var(--primary) / 0.1)" />
        <rect x="50" y="70" width="100" height="60" rx="10" fill="hsl(var(--primary) / 0.7)" />
        <rect x="60" y="80" width="80" height="40" rx="5" fill="white" />
        <rect x="65" y="105" width="40" height="8" rx="4" fill="hsl(var(--primary) / 0.5)" />
        <rect x="115" y="105" width="20" height="8" rx="4" fill="hsl(var(--primary))" />
        <path d="M 50 80 L 40 70 L 60 70 Z" fill="hsl(var(--primary) / 0.7)" />
        <g transform="translate(140 70)">
            <path d="M0,0 H20 V-10 H-5 Z" fill="hsl(var(--primary))" />
            <circle cx="2" cy="-3" r="1.5" fill="white" />
            <circle cx="7" cy="-3" r="1.5" fill="white" />
            <circle cx="12" cy="-3" r="1.5" fill="white" />
        </g>
    </svg>
)

export default function LoginPage() {
    const { t } = useTranslation();

    return (
        <main className="flex flex-col min-h-screen bg-background p-8">
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <RegistrationIllustration />
                <h1 className="text-3xl font-bold font-headline mt-8">
                    {t('login_page.registration_title')}
                </h1>
                <p className="mt-2 text-muted-foreground max-w-xs mx-auto">
                    {t('login_page.registration_subtitle')}
                </p>
            </div>
            <div className="mt-8">
                <LoginForm />
            </div>
        </main>
    )
}
