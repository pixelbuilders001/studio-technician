"use client";

import Image from "next/image";
import { useTranslation } from "@/hooks/useTranslation";

export function FullPageLoader() {
    const { t } = useTranslation();

    return (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative flex flex-col items-center gap-6 p-8">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 animate-bounce [animation-duration:2000ms]">
                    <Image
                        src="/loader.png"
                        alt="Loading..."
                        fill
                        className="object-contain"
                        priority
                    />
                </div>

                <div className="flex flex-col items-center gap-2">
                    <h2 className="text-2xl font-bold text-primary animate-pulse">
                        {t?.('login_form.verifying') || 'Verifying Your Details...'}
                    </h2>
                    <p className="text-muted-foreground text-center">
                        {t?.('login_form.please_wait') || 'Hang tight! once verified you will be redirected.'}
                    </p>
                </div>

                {/* Optional: Add a subtle progress indicator or spinner */}
                <div className="mt-4 flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce"></div>
                </div>
            </div>
        </div>
    );
}
