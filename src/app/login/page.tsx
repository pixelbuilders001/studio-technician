
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
import { LoginForm } from "@/components/auth/LoginForm";
import { useSearchParams } from "next/navigation";


export default function LoginPage() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const mobile = searchParams.get('mobile');

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <div className="relative flex-1">
         <Image
          src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/Gemini_Generated_Image_901bfk901bfk901b.png"
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
                    {t('login_form.verify_otp_title')}
                </CardTitle>
                <CardDescription className="pt-1">
                    {t('login_form.verify_otp_subtitle', mobile || "")}
                </CardDescription>
            </CardHeader>
          <CardContent className="p-0 pt-6">
            <LoginForm initialStep="otp" mobileNumber={mobile || ""} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
