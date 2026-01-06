"use client"
import { PartnerSignupForm } from "@/components/auth/PartnerSignupForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { useTranslation } from "@/hooks/useTranslation";

export default function PartnerSignupPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
        <PageHeader title={t('partner_signup_page.title')} />
        <div className="p-4">
            <p className="text-muted-foreground mb-6">{t('partner_signup_page.subtitle')}</p>
            <PartnerSignupForm />
        </div>
    </div>
  )
}
