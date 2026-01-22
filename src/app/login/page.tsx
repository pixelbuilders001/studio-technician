"use client";

import { Suspense } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { LoginForm } from "@/components/auth/LoginForm";
import { Skeleton } from "@/components/ui/skeleton";

function LoginContent() {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="bg-white rounded-t-[2rem] -mt-8 relative z-20 shadow-2xl min-h-[calc(100vh-28vh)]">
        <div className="w-full max-w-md mx-auto px-6 pt-6 pb-8">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="space-y-3 pb-4 px-0">
              <div className="flex justify-center">
                <Image
                  src="/logo-image.png"
                  alt="helloFixo"
                  width={80}
                  height={80}
                  className="object-contain"
                  priority
                />
              </div>
              <div className="text-center space-y-1">

                <CardDescription className="text-sm text-slate-600">
                  {t('login_page.subtitle')}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="px-0 pb-0">
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LoginSkeleton() {
  return (
    <div className="w-full">
      <div className="bg-white rounded-t-[2rem] -mt-8 relative z-20 shadow-2xl min-h-[calc(100vh-28vh)]">
        <div className="w-full max-w-md mx-auto px-6 pt-6 pb-8">
          <div className="space-y-4 text-center">
            <Skeleton className="h-20 w-20 rounded-full mx-auto" />
            <Skeleton className="h-6 w-40 mx-auto" />
            <Skeleton className="h-4 w-56 mx-auto" />
            <Skeleton className="h-11 w-full mt-6" />
            <Skeleton className="h-11 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="flex flex-col h-screen overflow-hidden bg-slate-50">
      {/* Hero Image Section */}
      <div className="relative h-[28vh] flex-shrink-0 overflow-hidden">
        <Image
          src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Jan%205%2C%202026%2C%2002_26_40%20PM.png"
          alt="Technician working"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-primary/40 to-primary/70"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-6 text-center z-10">
          <h2 className="text-white text-xl font-bold drop-shadow-lg leading-tight">
            Join Thousands of Technicians
          </h2>
        </div>
      </div>

      {/* Form Section */}
      <Suspense fallback={<LoginSkeleton />}>
        <LoginContent />
      </Suspense>
    </main>
  );
}
