
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { OtpInput } from "@/components/auth/OtpInput";
import { useToast } from "@/hooks/use-toast";
import { verifyCompletionCodeAction } from "@/app/actions";

type CompletionCodeDialogProps = {
  bookingId: string;
  technicianId: string;
  earningAmount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerificationSuccess: () => void;
};

export function CompletionCodeDialog({
  bookingId,
  technicianId,
  earningAmount,
  open,
  onOpenChange,
  onVerificationSuccess,
}: CompletionCodeDialogProps) {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleVerify = async () => {
    if (code.length !== 4) {
      setError("Please enter the 4-digit code.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      await verifyCompletionCodeAction({
        booking_id: bookingId,
        code,
        technician_id: technicianId,
        earning_amount: earningAmount,
      });
      onVerificationSuccess();
    } catch (e: any) {
      setError("Invalid code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset state on close
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setCode("");
      setIsLoading(false);
      setError(null);
    }
    onOpenChange(isOpen);
  }


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Enter Completion Code</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-2 py-4">
          <p className="text-center text-sm text-muted-foreground pb-2">
            Ask the customer for the 4-digit code sent to their mobile number.
          </p>
          <OtpInput length={4} value={code} onChange={setCode} />

          {error && (
            <p className="text-sm text-destructive pt-1">{error}</p>
          )}

        </div>
        <DialogFooter>
          <div className="w-full space-y-2">
            <Button
              onClick={handleVerify}
              disabled={isLoading || code.length !== 4}
              className="w-full h-12"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Verify & Complete
            </Button>
             <DialogClose asChild>
                <Button type="button" variant="ghost" className="w-full">Cancel</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    