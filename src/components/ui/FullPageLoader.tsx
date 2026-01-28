"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";
import { Loader2 } from "lucide-react";

export interface FullPageLoaderProps {
    text?: string;
    subtext?: string;
}

export function FullPageLoader({ text, subtext }: FullPageLoaderProps) {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-md animate-in fade-in duration-500">
            {/* Background decorative elements */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse [animation-delay:1s]"></div>

            <div className="relative flex flex-col items-center gap-8 p-8 max-w-sm w-full">
                <div className="relative">
                    {/* Pulsing ring around the logo */}
                    <div className="absolute inset-[-12px] rounded-full border border-primary/20 animate-[ping_3s_ease-in-out_infinite]"></div>
                    <div className="absolute inset-[-24px] rounded-full border border-primary/10 animate-[ping_3s_ease-in-out_infinite_500ms]"></div>

                    <div className="relative w-24 h-24 sm:w-28 sm:h-28 transition-transform hover:scale-110 duration-500">
                        <Image
                            src="/logo-image.png"
                            alt="Loading..."
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                <div className="flex flex-col items-center gap-3">
                    <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary/80 to-primary font-inter tracking-tight text-center">
                        {text || t?.('login_form.verifying') || 'Verifying Your Details...'}
                    </h2>
                    <p className="text-slate-500 font-medium text-center text-sm max-w-[250px] leading-relaxed">
                        {subtext || t?.('login_form.please_wait') || 'Hang tight! once verified you will be redirected.'}
                    </p>
                </div>

                {/* Progress bar style indicator */}
                <div className="w-full max-w-[200px] h-1.5 bg-slate-100 rounded-full overflow-hidden mt-4 shadow-inner">
                    <div className="h-full bg-primary animate-[loading_2s_ease-in-out_infinite] rounded-full"></div>
                </div>

                <style jsx>{`
                    @keyframes loading {
                        0% { width: 0%; transform: translateX(-100%); }
                        50% { width: 70%; transform: translateX(20%); }
                        100% { width: 0%; transform: translateX(100%); }
                    }
                `}</style>
            </div>
        </div>
    );
}
