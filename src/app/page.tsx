"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export default function WelcomePage() {
  const { t } = useTranslation();
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <Image 
          src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Dec%2030%2C%202025%2C%2011_58_14%20AM.png"
          alt="FixFast Technician"
          width={600}
          height={600}
          className="w-full h-auto"
          priority
        />
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <h1 className="text-3xl font-bold font-headline">
            {t('welcome_page.title')}
            </h1>
            <p className="mt-2 text-muted-foreground max-w-xs mx-auto">
            {t('welcome_page.subtitle')}
            </p>
        </div>
      </div>
      <div className="space-y-3 p-8 pt-0">
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
