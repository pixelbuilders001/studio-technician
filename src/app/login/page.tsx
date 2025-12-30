
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
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";
import { LoginForm, type Step as LoginFormStep } from "@/components/auth/LoginForm";


export default function LoginPage() {
  const { t } = useTranslation();
  const [formStep, setFormStep] = useState<LoginFormStep>('mobile');

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="relative flex-1 flex flex-col items-center justify-end p-8 text-white">
        <Image
          src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/Gemini_Generated_Image_901bfk901bfk901b.png"
          alt="Technician working"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent z-10"></div>
        <div className="relative z-20 w-full text-center">
        </div>
      </div>

      <div className="bg-background p-8 rounded-t-3xl -mt-6 relative z-20">
        <Card className="border-none shadow-none">
            {formStep === 'mobile' && (
              <CardHeader className="p-0 text-center">
                <CardTitle className="text-2xl font-bold font-headline">
                  {t('login_form.login_title')}
                </CardTitle>
                <CardDescription className="pt-1">
                  {t("login_page.registration_subtitle")}
                </CardDescription>
              </CardHeader>
            )}
             {formStep === 'otp' && (
                <CardHeader className="p-0 text-center">
                    <CardTitle className="text-2xl font-bold font-headline">
                        {t('login_form.verify_otp_title')}
                    </CardTitle>
                    <CardDescription className="pt-1">
                        {t('login_form.verify_otp_subtitle', "")}
                    </CardDescription>
                </CardHeader>
             )}
          <CardContent className="p-0 pt-6">
            <LoginForm onStepChange={setFormStep} />
          </CardContent>
          {formStep === 'mobile' && (
            <div className="pt-6">
              <div className="relative w-full flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <span className="relative bg-background px-2 text-xs uppercase text-muted-foreground">
                  OR
                </span>
              </div>
              <Link href="/partner-signup" className="w-full">
                <Button variant="outline" className="w-full text-base h-12 mt-4">
                  {t("login_page.become_partner")}
                </Button>
              </Link>
            </div>
          )}
        </Card>
      </div>
    </main>
  );
}
