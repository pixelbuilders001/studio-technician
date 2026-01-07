
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
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { type Job } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { updateJobStatusAction } from "@/app/actions";

type PaymentCollectionDialogProps = {
  job: Job;
  totalAmount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentSuccess: () => void;
};

export function PaymentCollectionDialog({
  job,
  totalAmount,
  open,
  onOpenChange,
  onPaymentSuccess,
}: PaymentCollectionDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const handleCashPayment = async () => {
    setIsLoading(true);
    try {
      await updateJobStatusAction({
        booking_id: job.id,
        status: 'repair_completed',
        note: `Payment of ₹${totalAmount} collected in cash.`,
        order_id: job.order_id,
        final_cost: totalAmount,
      });

      toast({
        title: t('payment_collection_dialog.toast_title_success'),
        description: t('payment_collection_dialog.toast_description_success'),
      });

      onPaymentSuccess();
      onOpenChange(false);
    } catch (error: any) {
      toast({
        title: t('payment_collection_dialog.toast_title_error'),
        description: error.message || t('payment_collection_dialog.toast_description_error'),
        variant: "destructive",
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
          <DialogTitle className="text-center">{t('payment_collection_dialog.title')}</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <p className="text-muted-foreground">{t('payment_collection_dialog.total_due')}</p>
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
          <p className="text-sm text-muted-foreground">{t('payment_collection_dialog.scan_to_pay')}</p>
        </div>
        <DialogFooter className="pt-4">
          <div className="w-full space-y-2">
            <Button onClick={handleCashPayment} disabled={isLoading} className="w-full h-12" variant="outline">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('payment_collection_dialog.paid_by_cash')}
            </Button>
            <DialogClose asChild>
                <Button type="button" variant="ghost" className="w-full">{t('repair_details_form.cancel_button')}</Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
