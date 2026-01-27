"use client";

import { Suspense } from "react";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Loader2, Star, UserPlus, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
    const { t } = useTranslation();

    return (
        <main className="flex flex-col min-h-screen bg-slate-50 font-inter">
            {/* Hero Image Section with Enhanced Visuals */}
            <div className="relative h-[32vh] flex-shrink-0 overflow-hidden">
                <Image
                    src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Jan%205%2C%202026%2C%2002_26_40%20PM.png"
                    alt="Technician working"
                    fill
                    className="object-cover scale-110"
                    priority
                />
                {/* Modern multi-layer gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent"></div>
                <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"></div>

                <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 px-6 text-center z-10">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/30 text-white text-[10px] font-bold uppercase tracking-widest mb-3">
                        <UserPlus className="w-3 h-3" />
                        New Partner Registration
                    </div>
                    <h2 className="text-white text-2xl font-extrabold drop-shadow-md leading-tight tracking-tight">
                        Become a Partner<br />Technician
                    </h2>
                </div>
            </div>

            {/* Form Section */}
            <div className="w-full flex-1 flex flex-col">
                <div className="bg-white rounded-t-[2.5rem] -mt-10 relative z-20 shadow-[0_-8px_30px_rgb(0,0,0,0.04)] flex-1">
                    <div className="w-full max-w-md mx-auto px-6 pt-10 pb-12">
                        <Card className="border-none shadow-none bg-transparent">
                            <CardHeader className="space-y-4 pb-8 px-0 text-center">
                                <div className="flex flex-col items-center -space-y-1 transition-transform hover:scale-105 duration-300">
                                    <Image
                                        src="/logo-image.png"
                                        alt="helloFixo"
                                        width={90}
                                        height={90}
                                        className="object-contain"
                                        priority
                                    />
                                    <span className="text-[11px] font-black tracking-[0.2em] text-primary uppercase pl-1">EXPERT</span>
                                </div>
                                <div className="space-y-1">
                                    <CardTitle className="text-2xl font-extrabold tracking-tight text-slate-900">
                                        Create Account
                                    </CardTitle>
                                    <CardDescription className="text-sm font-medium text-slate-500">
                                        Start your professional journey with us
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="px-0 pb-0">
                                <div className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100 shadow-sm mb-6">
                                    <Suspense fallback={
                                        <div className="h-64 flex flex-col items-center justify-center space-y-4">
                                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                            <p className="text-sm text-slate-400 font-medium">Setting up your profile...</p>
                                        </div>
                                    }>
                                        <SignUpForm />
                                    </Suspense>
                                </div>

                                <div className="flex items-center justify-center gap-4 text-slate-400">
                                    <div className="flex items-center gap-1.5">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Secure</span>
                                    </div>
                                    <div className="w-1 h-1 bg-slate-300 rounded-full"></div>
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4" />
                                        <span className="text-[10px] font-bold uppercase tracking-wider">Top Rated</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </main>
    );
}
