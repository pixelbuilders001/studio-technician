"use client";
import { LoginForm } from '@/components/auth/LoginForm';
import { useTranslation } from '@/hooks/useTranslation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { CheckCircle } from 'lucide-react';

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <Image
            src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Dec%2029%2C%202025%2C%2008_11_39%20PM.png"
            alt="FixFast Technician"
            width={200}
            height={200}
            className="mb-4 h-40 w-40 rounded-full object-cover shadow-lg"
            priority
          />
          <h1 className="text-3xl font-bold text-foreground font-headline">
            {t('login_page.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('login_page.subtitle')}
          </p>
        </div>
        <LoginForm />

        <div className="mt-8 text-center border-t pt-6">
            <h2 className='text-xl font-bold font-headline'>{t('login_page.promo_title')}</h2>
            <p className='text-muted-foreground mb-4'>{t('login_page.promo_subtitle')}</p>
            <ul className='space-y-2 text-left mb-4 inline-block'>
                <li className='flex items-center gap-2'>
                    <CheckCircle className='h-5 w-5 text-green-500' />
                    <span>{t('login_page.promo_earn')}</span>
                </li>
                <li className='flex items-center gap-2'>
                    <CheckCircle className='h-5 w-5 text-green-500' />
                    <span>{t('login_page.promo_flexible')}</span>
                </li>
            </ul>
             <Link href="/partner-signup" passHref className='block'>
                <Button variant="outline" className="w-full">{t('login_page.become_partner')}</Button>
            </Link>
        </div>

      </div>
    </main>
  );
}
