"use client";

import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Suspense } from "react";
import { Loader2, TrendingUp } from "lucide-react";

export default function SignUpPage() {
    const { t } = useTranslation();

    return (
        <main className="flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            {/* Hero Image Section */}
            <div className="relative h-[45vh] flex-shrink-0 overflow-hidden">
                <Image
                    src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Jan%205%2C%202026%2C%2002_26_40%20PM.png"
                    alt="Technician working"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-primary/40 to-primary/70"></div>

                {/* Hero Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-6 text-center z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-5 w-5 text-green-300" />
                        <span className="text-white/90 text-sm font-medium">Start Earning Today</span>
                    </div>
                    <h2 className="text-white text-2xl md:text-3xl font-bold drop-shadow-lg leading-tight">
                        Become a helloFixo<br />Partner Technician
                    </h2>
                </div>
            </div>

            {/* Form Section */}
            <div className="flex-1">
                <div className="w-full">
                    <div className="bg-white/95 backdrop-blur-sm rounded-t-[2rem] -mt-8 relative z-20 shadow-2xl min-h-[60vh]">
                        <div className="w-full max-w-md mx-auto px-6 py-8">
                            <Card className="border-none shadow-none bg-transparent">
                                <CardHeader className="space-y-4 pb-6 px-0">
                                    <div className="flex justify-center">
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl animate-pulse"></div>
                                            <div className="relative bg-white rounded-2xl p-3 shadow-lg">
                                                <Image
                                                    src="/logo-image.png"
                                                    alt="helloFixo"
                                                    width={90}
                                                    height={90}
                                                    className="object-contain"
                                                    priority
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h1 className="text-2xl font-bold font-headline text-slate-900">
                                            Create Account
                                        </h1>
                                        <CardDescription className="text-sm text-slate-600">
                                            {t('signup_page.subtitle')}
                                        </CardDescription>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-0 pb-0">
                                    <Suspense fallback={<div className="h-64 flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}>
                                        <SignUpForm />
                                    </Suspense>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
