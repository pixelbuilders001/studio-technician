"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, ShieldX, MapPin, ArrowRight } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { verifyPincodeAction } from "@/app/actions";
import { PageHeader } from "../layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <PageHeader title="Become a Partner" />
      <div className="flex-1 flex flex-col items-center justify-center p-4 -mt-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          <Card className="border-none shadow-xl bg-white/60 backdrop-blur-md">
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <CardTitle className="text-xl">Check Availability</CardTitle>
              <CardDescription>Enter your area pincode to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="relative group">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground transition-colors group-focus-within:text-primary" />
                <Input
                  type="tel"
                  placeholder="e.g. 560001"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                  className="pl-10 text-lg h-14 bg-white/80 transition-all border-muted-foreground/20 focus-visible:ring-primary/20 focus-visible:border-primary"
                />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Alert variant="destructive" className="bg-destructive/5 border-destructive/10 text-destructive">
                      <ShieldX className="h-4 w-4" />
                      <AlertTitle>Not Serviceable</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                onClick={handleVerify}
                disabled={pincode.length !== 6 || isPending}
                className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Check Availability <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
