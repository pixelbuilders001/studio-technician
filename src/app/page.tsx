"use client";

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

const WelcomeIllustration = () => (
    <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto max-w-sm mx-auto">
        <circle cx="100" cy="100" r="80" fill="hsl(var(--primary) / 0.1)" />
        <g transform="translate(100 110)">
            <path d="M0 -30 a 15 15 0 0 1 0 30 a 15 15 0 0 1 0 -30" fill="hsl(var(--primary))" />
            <rect x="-25" y="0" width="50" height="40" rx="10" fill="hsl(var(--primary) / 0.8)" />
            <g transform="translate(0, 10)">
                <path d="M-40 -20 L-60 -30 V-50 H-30 Z" fill="hsl(var(--primary))" />
                <path d="M40 -20 L60 -30 V-50 H30 Z" fill="hsl(var(--primary))" />
                <circle cx="-50" cy="-60" r="5" fill="white" />
                <circle cx="-35" cy="-60" r="5" fill="white" />
                 <circle cx="-20" cy="-60" r="5" fill="white" />
                <circle cx="50" cy="-60" r="5" fill="white" />
                <circle cx="35"cy="-60" r="5" fill="white" />
                 <circle cx="20" cy="-60" r="5" fill="white" />
            </g>
        </g>
    </svg>
)

export default function WelcomePage() {
  const { t } = useTranslation();
  return (
    <main className="flex flex-col min-h-screen bg-background p-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <WelcomeIllustration />
        <h1 className="text-3xl font-bold font-headline mt-8">
          {t('welcome_page.title')}
        </h1>
        <p className="mt-2 text-muted-foreground max-w-xs mx-auto">
          {t('welcome_page.subtitle')}
        </p>
      </div>
      <div className="space-y-3">
        <Link href="/partner-signup" passHref>
          <Button className="w-full text-lg h-12">
            {t('welcome_page.create_account')}
          </Button>
        </Link>
        <Link href="/login" passHref>
          <Button variant="outline" className="w-full text-lg h-12">
            {t('welcome_page.login')}
          </Button>
        </Link>
      </div>
    </main>
  );
}
