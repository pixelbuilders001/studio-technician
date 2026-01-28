"use client"
import { useState, useEffect } from 'react';
import { usePwa } from '@/hooks/usePwa';
import { Button } from '@/components/ui/button';
import { X, Smartphone, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function PwaInstallBanner() {
    const { isInstallable, isInstalled, installPwa } = usePwa();
    const [isVisible, setIsVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    useEffect(() => {
        // Show after 5 seconds if installable and not already installed/dismissed
        const timer = setTimeout(() => {
            if (isInstallable && !isInstalled && !dismissed) {
                setIsVisible(true);
            }
        }, 5000);

        return () => clearTimeout(timer);
    }, [isInstallable, isInstalled, dismissed]);

    const handleInstall = async () => {
        const result = await installPwa();
        if (result.success) {
            setIsVisible(false);
        } else if (result.isIOS) {
            alert("To install: Tap the share button below and select 'Add to Home Screen' 📲");
        }
    };

    if (!isVisible) return null;

    return (
        <div className={cn(
            "fixed bottom-24 left-4 right-4 z-[100] transition-all duration-500 transform translate-y-0",
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95 translate-y-10"
        )}>
            <div className="bg-white rounded-[24px] p-4 shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-slate-100 flex items-center justify-between gap-4 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-2 h-full bg-primary"></div>

                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center flex-shrink-0 border border-slate-50 shadow-sm overflow-hidden">
                        <Image
                            src="/logo-image.png"
                            alt="helloFixo"
                            width={48}
                            height={48}
                            className="object-contain"
                        />
                    </div>
                    <div>
                        <p className="text-sm font-black italic text-slate-900 uppercase leading-none">NATIVE APP</p>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-1">Faster & Better Experience</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        onClick={handleInstall}
                        className="bg-primary text-white hover:bg-primary/90 rounded-xl px-4 font-black uppercase text-[10px] h-9 shadow-lg shadow-primary/20"
                    >
                        Install
                    </Button>
                    <button
                        onClick={() => {
                            setIsVisible(false);
                            setDismissed(true);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
