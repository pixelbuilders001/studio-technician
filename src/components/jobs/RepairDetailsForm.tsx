
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
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "@/hooks/useTranslation";
import { type Job } from "@/lib/types";
import { Loader2 } from "lucide-react";
import { updateJobStatusAction, sendCompletionCodeAction } from "@/app/actions";
import { Alert, AlertDescription } from "../ui/alert";

const repairDetailsSchema = z.object({
  finalCost: z.coerce.number().positive({ message: "Please enter a valid cost." }),
});

export type RepairDetails = z.infer<typeof repairDetailsSchema>;

type RepairDetailsFormProps = {
    job: Job;
    children: React.ReactNode;
    onCodeSent: (details: RepairDetails) => void;
}

export function RepairDetailsForm({ job, children, onCodeSent }: RepairDetailsFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const finalAmount = job.final_amount_to_be_paid ?? job.total_estimated_price;

  const form = useForm<RepairDetails>({
    resolver: zodResolver(repairDetailsSchema),
    defaultValues: {
      finalCost: finalAmount,
    },
  });
  
  const handleFormSubmit = async (values: RepairDetails) => {
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

      setOpen(false);
      onCodeSent(values);

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

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      form.reset({
          finalCost: finalAmount,
      });
    }
    setOpen(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
            <DialogTitle>{t('repair_details_form.title')}</DialogTitle>
            </DialogHeader>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
                <FormField
                control={form.control}
                name="finalCost"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('repair_details_form.final_cost_label')}</FormLabel>
                    <FormControl>
                        <div className="relative">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                ₹
                            </span>
                            <Input type="number" {...field} disabled className="font-bold text-base pl-8" />
                        </div>
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <Alert>
                  <AlertDescription>
                    After code verification, please collect ₹{finalAmount} from the customer.
                  </AlertDescription>
                </Alert>

                <DialogFooter className="pt-4">
                  <DialogClose asChild>
                      <Button type="button" variant="outline">{t('repair_details_form.cancel_button')}</Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {t('status_updater.send_code')}
                  </Button>
                </DialogFooter>
            </form>
            </Form>
        </DialogContent>
    </Dialog>
  );
}
