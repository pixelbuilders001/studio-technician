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
    <div className="w-full flex-1 flex items-center">
      <div className="bg-white/95 backdrop-blur-sm rounded-t-[2rem] -mt-8 relative z-20 shadow-2xl w-full">
        <div className="w-full max-w-md mx-auto px-6 py-5">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="space-y-2 pb-3 px-0">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse"></div>
                  <div className="relative bg-white rounded-2xl p-2 shadow-lg">
                    <Image
                      src="/logo-image.png"
                      alt="helloFixo"
                      width={70}
                      height={70}
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </div>
              <div className="text-center space-y-0.5">
                <h1 className="text-lg font-bold font-headline text-slate-900">
                  Welcome Back
                </h1>
                <CardDescription className="text-xs text-slate-600">
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
    <div className="w-full flex-1 flex items-center">
      <div className="bg-white/95 backdrop-blur-sm rounded-t-[2rem] -mt-8 relative z-20 shadow-2xl w-full">
        <div className="w-full max-w-md mx-auto px-6 py-5">
          <div className="space-y-3 text-center">
            <Skeleton className="h-14 w-14 rounded-2xl mx-auto" />
            <Skeleton className="h-5 w-36 mx-auto" />
            <Skeleton className="h-3 w-48 mx-auto" />
            <Skeleton className="h-10 w-full mt-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="flex flex-col h-screen overflow-hidden bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Hero Image Section - Much smaller */}
      <div className="relative h-[28vh] flex-shrink-0 overflow-hidden">
        <Image
          src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Jan%205%2C%202026%2C%2002_26_40%20PM.png"
          alt="Technician working"
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-primary/40 to-primary/70"></div>

        {/* Hero Content - Minimal */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 px-6 text-center z-10">
          <h2 className="text-white text-lg md:text-xl font-bold drop-shadow-lg leading-tight">
            Join Thousands of Technicians
          </h2>
        </div>
      </div>

      {/* Form Section - No scroll, fits on screen */}
      <Suspense fallback={<LoginSkeleton />}>
        <LoginContent />
      </Suspense>
    </main>
  );
}
