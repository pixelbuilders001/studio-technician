
"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { type Job } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { verifyPaymentAction } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";

type PaymentCollectionDialogProps = {
  job: Job;
  status: string;
  totalAmount: number;
  inspectionFee: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: () => void;
};

export function PaymentCollectionDialog({
  job,
  status,
  totalAmount,
  inspectionFee,
  open,
  onOpenChange,
  onPaymentSuccess,
}: PaymentCollectionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  console.log("status---", status);
  const handleCashPayment = async () => {
    setIsLoading(true);
    try {
      await verifyPaymentAction({
        booking_id: job.id,
        status: status,
        payment_method: 'cash',
        final_amount_paid: totalAmount,
        inspection_fee: inspectionFee,
      });

      await onPaymentSuccess();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Payment Verification Failed",
        description: error.message || "Could not verify cash payment.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const upiDeepLink = `upi://pay?pa=some-merchant@upi&am=${totalAmount}&tn=Job%20${job.order_id}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-center">Collect Payment</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <p className="text-muted-foreground">Total Amount Due</p>
          <p className="text-4xl font-bold">
            {new Intl.NumberFormat('en-IN', {
              style: 'currency',
              currency: 'INR',
              minimumFractionDigits: 0,
            }).format(totalAmount)}
          </p>
          <div className="p-4 bg-white rounded-lg border">
            <a href={upiDeepLink}>
              <Image
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiDeepLink)}`}
                alt="UPI QR Code"
                width={200}
                height={200}
                data-ai-hint="qr code"
              />
            </a>
          </div>
          <p className="text-sm text-muted-foreground">Scan QR to pay with any UPI app</p>
        </div>
        <DialogFooter className="pt-4">
          <div className="w-full space-y-2">
            <Button onClick={handleCashPayment} disabled={isLoading} className="w-full h-12" variant="outline">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Paid by Cash
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
