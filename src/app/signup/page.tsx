"use client";

import Image from "next/image";
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { SignUpForm } from "@/components/auth/SignUpForm";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function SignUpPage() {
    const { t } = useTranslation();

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
                        Become a Partner Technician
                    </h2>
                </div>
            </div>

            {/* Form Section */}
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
        </main>
    );
}
