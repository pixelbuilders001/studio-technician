"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export default function WelcomePage() {
  const { t } = useTranslation();
  return (
    <main className="flex flex-col min-h-screen bg-background p-8">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <Image 
          src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Dec%2030%2C%202025%2C%2011_58_14%20AM.png"
          alt="FixFast Technician"
          width={300}
          height={300}
          className="max-w-xs h-auto"
          priority
        />
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
