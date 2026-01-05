
"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { LoginForm, type Step as LoginFormStep } from "@/components/auth/LoginForm";
import Link from "next/link";


export default function WelcomePage() {
  const { t } = useTranslation();

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="relative flex-1">
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
          <Card className="border-none shadow-none">
              <CardHeader className="p-0 text-center">
                <CardTitle className="text-2xl font-bold font-headline">
                  {t('login_form.login_title')}
                </CardTitle>
                <CardDescription className="pt-1">
                  {t("login_page.registration_subtitle")}
                </CardDescription>
              </CardHeader>
          <CardContent className="p-0 pt-6">
            <LoginForm />
          </CardContent>
        </Card>
      </div>
       <div className="bg-background px-8 pb-4 text-center">
            <Link href="/partner-signup">
                <span className="text-sm text-muted-foreground hover:text-primary">{t('login_page.become_partner')}</span>
            </Link>
        </div>
    </main>
  );
}
