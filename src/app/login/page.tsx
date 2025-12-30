
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
      <div className="relative flex-1 flex flex-col items-center justify-end p-8 text-white bg-gradient-to-b from-primary/80 to-primary">
        <div className="relative z-10 w-full text-center">
          <h1 className="text-4xl font-bold font-headline leading-tight">
            {t("login_page.title")}
          </h1>
          <p className="mt-2 text-lg text-primary-foreground/80 max-w-xs mx-auto">
            {t("login_page.subtitle")}
          </p>
        </div>
      </div>

      <div className="bg-background p-8 rounded-t-3xl -mt-6 relative z-20">
        <Card className="border-none shadow-none">
          {formStep === 'mobile' && (
            <CardHeader className="p-0 text-center">
              <CardTitle className="text-2xl font-bold font-headline">
                {t("login_page.login_title")}
              </CardTitle>
              <CardDescription className="pt-1">
                {t("login_page.registration_subtitle")}
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
