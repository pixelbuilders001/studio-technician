"use client";
import { LoginForm } from '@/components/auth/LoginForm';
import { Wrench } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 rounded-full bg-primary p-4 text-primary-foreground">
            <Wrench className="h-10 w-10" />
          </div>
          <h1 className="text-3xl font-bold text-foreground font-headline">
            {t('login_page.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('login_page.subtitle')}
          </p>
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
