"use client"
import { PartnerSignupForm } from "@/components/auth/PartnerSignupForm";
import { PageHeader } from "@/components/layout/PageHeader";

import { PincodeVerifier } from "@/components/auth/PincodeVerifier";
import { useState } from "react";

export default function PartnerSignupPage() {

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
    <div className="flex flex-col min-h-screen bg-slate-50/50">
      <PageHeader title="Become a Partner" />
      <div className="p-4 flex-1 flex flex-col">
        {!isPincodeVerified && <p className="text-muted-foreground mb-6 text-center">Fill out the form below to start the process of joining our network of skilled technicians.</p>}
        <PartnerSignupForm pincode={pincode} city={city} />
      </div>
    </div>
  )
}
