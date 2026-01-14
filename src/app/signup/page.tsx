"use client";

import Image from "next/image";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { SignUpForm } from "@/components/auth/SignUpForm";

export default function SignUpPage() {
    const { t } = useTranslation();

    return (
        <main className="flex flex-col min-h-screen bg-background">
            <div className="relative flex-1">
                {/* Reusing the same image as login for consistency */}
                <Image
                    src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/ChatGPT%20Image%20Jan%205%2C%202026%2C%2002_26_40%20PM.png"
                    alt="Technician working"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent z-10"></div>
            </div>

            <div className="bg-background p-8 rounded-t-3xl -mt-6 relative z-20">
                <Card className="border-none shadow-none">
                    <CardHeader className="p-0 text-center">
                        <CardTitle className="text-2xl font-bold font-headline">
                            {t('signup_page.title')}
                        </CardTitle>
                        <CardDescription className="pt-1">
                            {t('signup_page.subtitle')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 pt-6">
                        <SignUpForm />
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
