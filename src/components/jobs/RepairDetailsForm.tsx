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
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof repairDetailsSchema>>({
    resolver: zodResolver(repairDetailsSchema),
    defaultValues: {
      finalCost: undefined,
      spareParts: "",
      notes: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof repairDetailsSchema>) => {
    setIsLoading(true);
    try {
        await updateJobStatusAction({
            booking_id: job.id,
            status: 'completed',
            note: `Completed. Final Cost: ${values.finalCost}. Parts: ${values.spareParts}. Notes: ${values.notes}`,
            order_id: job.order_id,
            final_cost: values.finalCost,
            spare_parts_used: values.spareParts,
            technician_notes: values.notes,
        });

        toast({
            title: t('repair_details_form.toast_title'),
            description: `${t('repair_details_form.toast_description')} ₹${values.finalCost}.`,
        });

        setOpen(false);
        onFormSubmit();
    } catch (error: any) {
        toast({
            title: "Update Failed",
            description: error.message || "Could not complete the job.",
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
                {t('repair_details_form.confirm_button')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
