
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
import { saveInspectionDetailsAction, updateJobStatusAction } from "@/app/actions";

const inspectionDetailsSchema = z.object({
  findings: z.string().min(10, { message: "Please describe your findings in detail." }),
  inspection_fee: z.coerce.number().min(0, { message: "Please enter a valid fee." }),
});

type InspectionDetailsFormProps = {
    job: Job;
    technicianId: string;
    children: React.ReactNode;
    onFormSubmit: () => void;
}

export function InspectionDetailsForm({ job, technicianId, children, onFormSubmit }: InspectionDetailsFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof inspectionDetailsSchema>>({
    resolver: zodResolver(inspectionDetailsSchema),
    defaultValues: {
      findings: "",
      inspection_fee: job.net_inspection_fee,
    },
  });

  const onSubmit = async (values: z.infer<typeof inspectionDetailsSchema>) => {
    setIsLoading(true);
    try {
        // Step 1: Save inspection details
        await saveInspectionDetailsAction({
            booking_id: job.id,
            technician_id: technicianId,
            findings: values.findings,
            inspection_fee: values.inspection_fee
        });

        // Step 2: Update job status
        await updateJobStatusAction({
            booking_id: job.id,
            order_id: job.order_id,
            status: 'inspection_completed',
            note: `Inspection completed. Findings: ${values.findings}`
        });

        toast({
            title: t('inspection_details_form.toast_title_success'),
            description: t('inspection_details_form.toast_description_success'),
        });

        setOpen(false);
        onFormSubmit(); // This will refresh the jobs list
    } catch (error: any) {
        toast({
            title: "Update Failed",
            description: error.message || "Could not save inspection details.",
            variant: "destructive",
        })
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('inspection_details_form.title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="findings"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inspection_details_form.findings_label')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('inspection_details_form.findings_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="inspection_fee"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('inspection_details_form.inspection_fee_label')}</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 300" {...field} />
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
                {t('inspection_details_form.submit_button')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    