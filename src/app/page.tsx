"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useTranslation } from '@/hooks/useTranslation';

export default function WelcomePage() {
  const { t } = useTranslation();
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="relative flex-1 flex flex-col items-center justify-end p-8 text-white">
        <Image
          src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Dec%2030%2C%202025%2C%2011_58_14%20AM.png"
          alt="Technician working"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent z-10"></div>
      </div>

      <div className="bg-background p-8 rounded-t-3xl -mt-6 relative z-20">
        <div className="text-center">
            <h1 className="text-3xl font-bold font-headline">
            {t('welcome_page.title')}
            </h1>
            <p className="mt-2 text-muted-foreground max-w-xs mx-auto">
            {t('welcome_page.subtitle')}
            </p>
        </div>
         <div className="space-y-3 pt-8">
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
      </div>
    </main>
  );
}
