
"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldX, MapPin } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { verifyPincodeAction } from "@/app/actions";
import { PageHeader } from "../layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";

type PincodeVerifierProps = {
  onSuccess: (pincode: string, city: string) => void;
};

export function PincodeVerifier({ onSuccess }: PincodeVerifierProps) {
  const [pincode, setPincode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleVerify = () => {
    setError(null);
    startTransition(async () => {
      const result = await verifyPincodeAction(pincode);
      if (result.serviceable && result.city) {
        onSuccess(pincode, result.city);
      } else {
        setError(result.error || "An unexpected error occurred.");
      }
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <PageHeader title="Become a Partner" />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle>Verify Service Area</CardTitle>
                <CardDescription>Enter your 6-digit pincode to check if we're serving in your area.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        type="tel"
                        placeholder="Enter Pincode"
                        maxLength={6}
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                        className="pl-10 text-lg h-12"
                    />
                </div>
                
                {error && (
                    <Alert variant="destructive">
                        <ShieldX className="h-4 w-4" />
                        <AlertTitle>Not Serviceable</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button
                    onClick={handleVerify}
                    disabled={pincode.length !== 6 || isPending}
                    className="w-full h-12 text-lg"
                >
                    {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isPending ? "Verifying..." : "Check Availability"}
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
