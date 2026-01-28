"use client";

import { Suspense } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LoginForm } from "@/components/auth/LoginForm";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, Zap, Star } from "lucide-react";

function LoginContent() {


  return (
    <div className="w-full flex-1 flex flex-col">
      <div className="bg-white rounded-t-[2.5rem] -mt-10 relative z-20 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] flex-1">
        <div className="w-full max-w-md mx-auto px-6 pt-4 pb-12">
          <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="space-y-4 pb-4 px-0 text-center">
              <div className="flex justify-center transition-transform hover:scale-105 duration-300">
                <Image
                  src="/logo-image.png"
                  alt="helloFixo"
                  width={120}
                  height={37}
                  className="object-contain"
                  priority
                />
              </div>

            </CardHeader>
            <CardContent className="px-0 pb-0">
              <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-sm mb-8">
                <LoginForm />
              </div>

              {/* Benefits Section */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                <div className="flex flex-col items-center text-center space-y-1">
                  <div className="p-2 bg-primary/10 rounded-xl">
                    <ShieldCheck className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Verified</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-1">
                  <div className="p-2 bg-amber-50 rounded-xl">
                    <Zap className="w-4 h-4 text-amber-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Fast Payouts</span>
                </div>
                <div className="flex flex-col items-center text-center space-y-1">
                  <div className="p-2 bg-emerald-50 rounded-xl">
                    <Star className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Best Rating</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function LoginSkeleton() {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-white rounded-t-[2.5rem] -mt-10 relative z-20 shadow-2xl flex-1">
        <div className="w-full max-w-md mx-auto px-6 pt-10 pb-8">
          <div className="space-y-6 text-center">
            <Skeleton className="h-24 w-24 rounded-2xl mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl space-y-4">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <main className="flex flex-col min-h-screen bg-slate-50 font-inter">
      {/* Hero Image Section with Enhanced Visuals */}
      <div className="relative h-[42vh] flex-shrink-0 overflow-hidden">
        <Image
          src="/hero-bg.jpg"
          alt="Technician working"
          fill
          className="object-cover scale-110"
          priority
        />
        {/* Modern multi-layer gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent"></div>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>

        {/* Floating Decorative Elements */}
        <div className="absolute top-6 left-6 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary-foreground/10 rounded-full blur-3xl"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 text-center z-10">
          {/* <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest mb-3">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            Premium Partner Network
          </div> */}
          <h2 className="text-white text-2xl font-extrabold drop-shadow-md leading-tight tracking-tight">
            Join Thousands of<br />Expert Technicians
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
