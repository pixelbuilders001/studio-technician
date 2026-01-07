
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { type Job } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { updateJobStatusAction, sendCompletionCodeAction } from "@/app/actions";
import { PaymentCollectionDialog } from "./PaymentCollectionDialog";
import { CompletionCodeDialog } from "./CompletionCodeDialog";

const repairDetailsSchema = z.object({
  finalCost: z.coerce.number().positive({ message: "Please enter a valid cost." }),
  spareParts: z.string().optional(),
  notes: z.string().optional(),
});

type RepairDetailsFormProps = {
    job: Job;
    children: React.ReactNode;
    onFormSubmit: () => void;
}

export function RepairDetailsForm({ job, children, onFormSubmit }: RepairDetailsFormProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [codeSent, setCodeSent] = useState(job.status === 'code_sent');
  const [codeOpen, setCodeOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof repairDetailsSchema>>({
    resolver: zodResolver(repairDetailsSchema),
    defaultValues: {
      finalCost: job.total_estimated_price,
      spareParts: "",
      notes: "",
    },
  });

  const handleSendCode = async () => {
    setIsLoading(true);
    try {
      // 1. Send the code to the customer
      await sendCompletionCodeAction(job.id);
      
      // 2. Update job status to 'code_sent'
      await updateJobStatusAction({
        booking_id: job.id,
        order_id: job.order_id,
        status: 'code_sent',
        note: 'Completion code sent to customer.'
      });

      toast({
        title: "Code Sent",
        description: "A 4-digit completion code has been sent to the customer.",
      });

      setCodeSent(true);
      onFormSubmit(); // Refresh the job list in the background
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Could not send completion code.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onCodeVerified = () => {
      setCodeOpen(false);
      setPaymentOpen(true);
  }

  const onPaymentSuccess = async () => {
    const values = form.getValues();
    try {
        await updateJobStatusAction({
            booking_id: job.id,
            status: 'repair_completed',
            note: `Payment of ₹${values.finalCost} collected. Notes: ${values.notes}`,
            order_id: job.order_id,
            final_cost: values.finalCost,
            spare_parts_used: values.spareParts,
        });

        toast({
            title: t('payment_collection_dialog.toast_title_success'),
            description: t('payment_collection_dialog.toast_description_success'),
        });
        
        setPaymentOpen(false);
        setDetailsOpen(false);
        onFormSubmit();

    } catch(error: any) {
         toast({
            title: "Update Failed",
            description: error.message || "Could not complete the job.",
            variant: "destructive",
        });
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      // Reset only if not in the middle of the flow
      setCodeSent(job.status === 'code_sent');
      form.reset({
          finalCost: job.total_estimated_price,
          spareParts: "",
          notes: "",
      });
    }
    setDetailsOpen(isOpen);
  }

  return (
    <>
        <Dialog open={detailsOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                <DialogTitle>{t('repair_details_form.title')}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(() => {})} className="space-y-4 py-4">
                    <FormField
                    control={form.control}
                    name="finalCost"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('repair_details_form.final_cost_label')}</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder={t('repair_details_form.final_cost_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="spareParts"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('repair_details_form.spare_parts_label')}</FormLabel>
                        <FormControl>
                            <Input placeholder={t('repair_details_form.spare_parts_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('repair_details_form.notes_label')}</FormLabel>
                        <FormControl>
                            <Textarea placeholder={t('repair_details_form.notes_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <DialogFooter className="pt-4">
                    <DialogClose asChild>
                        <Button type="button" variant="outline">{t('repair_details_form.cancel_button')}</Button>
                    </DialogClose>
                    {!codeSent ? (
                        <Button onClick={handleSendCode} disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('status_updater.send_code')}
                        </Button>
                    ) : (
                        <Button onClick={() => setCodeOpen(true)}>
                            {t('status_updater.enter_code')}
                        </Button>
                    )}
                    </DialogFooter>
                </form>
                </Form>
            </DialogContent>
        </Dialog>
        
        <CompletionCodeDialog
            bookingId={job.id}
            open={codeOpen}
            onOpenChange={setCodeOpen}
            onVerificationSuccess={onCodeVerified}
        />
        
        <PaymentCollectionDialog
            job={job}
            totalAmount={form.watch('finalCost')}
            open={paymentOpen}
            onOpenChange={setPaymentOpen}
            onPaymentSuccess={onPaymentSuccess}
        />
    </>
  );
}
