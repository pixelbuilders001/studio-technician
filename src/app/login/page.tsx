
"use client";

import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "next/link";

const BenefitItem = ({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) => (
  <li className="flex items-center gap-3">
    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
      <Icon className="h-5 w-5" />
    </div>
    <span className="font-medium text-foreground/80">{children}</span>
  </li>
);

export default function LoginPage() {
  const { t } = useTranslation();

  return (
    <main className="flex flex-col min-h-screen bg-secondary/30">
      <div className="relative flex-1 flex flex-col items-center justify-end p-8 text-white bg-gradient-to-b from-primary/80 to-primary">
        <Image
          src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/technician-WdKuaTBrj9p2f19GzTfdXfTqbInE9Z.png"
          alt="FixFast Technician"
          fill
          className="object-cover object-top"
          quality={100}
        />
        <div className="relative z-10 w-full text-center">
          <h1 className="text-4xl font-bold font-headline leading-tight">
            {t("login_page.title")}
          </h1>
          <p className="mt-2 text-lg text-primary-foreground/80 max-w-xs mx-auto">
            {t("login_page.subtitle")}
          </p>
        </div>
      </div>
      <div className="bg-background p-8 rounded-t-3xl -mt-6 relative z-20">
        <Card className="border-none shadow-none">
          <CardHeader className="p-0 text-center">
            <CardTitle className="text-2xl font-bold font-headline">
              {t("login_page.registration_title")}
            </CardTitle>
            <CardDescription className="pt-1">
              {t("login_page.registration_subtitle")}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 pt-6">
            <LoginForm />
          </CardContent>
          <CardFooter className="flex-col gap-4 p-0 pt-6">
            <div className="relative w-full flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <span className="relative bg-background px-2 text-xs uppercase text-muted-foreground">
                OR
              </span>
            </div>
            <Link href="/partner-signup" className="w-full">
              <Button variant="outline" className="w-full text-base h-12">
                {t("login_page.become_partner")}
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
