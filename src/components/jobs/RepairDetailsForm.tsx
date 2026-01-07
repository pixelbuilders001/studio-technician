
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
import { updateJobStatusAction } from "@/app/actions";
import { PaymentCollectionDialog } from "./PaymentCollectionDialog";

const repairDetailsSchema = z.object({
  finalCost: z.coerce.number().positive({ message: "Please enter a valid cost." }),
  spareParts: z.string().optional(),
  notes: z.string().optional(),
});

type RepairDetailsFormProps = {
    job: Job;
    children: React.ReactNode;
    onFormSubmit: () => void;
    totalAmount: number;
}

export function RepairDetailsForm({ job, children, onFormSubmit, totalAmount }: RepairDetailsFormProps) {
  const [open, setOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [finalAmount, setFinalAmount] = useState(totalAmount);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof repairDetailsSchema>>({
    resolver: zodResolver(repairDetailsSchema),
    defaultValues: {
      finalCost: totalAmount,
      spareParts: "",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof repairDetailsSchema>) => {
    setIsLoading(true);
    try {
        // Here, we don't update the status. We just prepare for payment.
        setFinalAmount(values.finalCost);
        setOpen(false); // Close this dialog
        setIsPaymentOpen(true); // Open the payment dialog

    } catch (error: any) {
        toast({
            title: "Error",
            description: error.message || "Could not save details.",
            variant: "destructive",
        })
    } finally {
        setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setIsPaymentOpen(false);
    onFormSubmit();
  }

  return (
    <>
        <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>{t('repair_details_form.title')}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
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
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t('repair_details_form.proceed_to_payment')}
                </Button>
                </DialogFooter>
            </form>
            </Form>
        </DialogContent>
        </Dialog>
        <PaymentCollectionDialog
            job={job}
            totalAmount={finalAmount}
            open={isPaymentOpen}
            onOpenChange={setIsPaymentOpen}
            onPaymentSuccess={handlePaymentSuccess}
        />
    </>
  );
}

