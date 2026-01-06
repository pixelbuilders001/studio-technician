"use client"
import { PartnerSignupForm } from "@/components/auth/PartnerSignupForm";
import { PageHeader } from "@/components/layout/PageHeader";
import { useTranslation } from "@/hooks/useTranslation";
import { PincodeVerifier } from "@/components/auth/PincodeVerifier";
import { useState } from "react";

export default function PartnerSignupPage() {
  const { t } = useTranslation();
  const [isPincodeVerified, setIsPincodeVerified] = useState(false);
  const [pincode, setPincode] = useState("");
  const [city, setCity] = useState("");

  const handlePincodeSuccess = (verifiedPincode: string, verifiedCity: string) => {
    setPincode(verifiedPincode);
    setCity(verifiedCity);
    setIsPincodeVerified(true);
  }

  if (!isPincodeVerified) {
    return <PincodeVerifier onSuccess={handlePincodeSuccess} />;
  }

  return (
    <div className="flex flex-col">
        <PageHeader title={t('partner_signup_page.title')} />
        <div className="p-4">
            <p className="text-muted-foreground mb-6">{t('partner_signup_page.subtitle')}</p>
            <PartnerSignupForm pincode={pincode} city={city} />
        </div>
    </div>
  )
}
