
"use client";

import { useState, useEffect } from "react";
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
import { shareQuoteAction, updateJobStatusAction } from "@/app/actions";

const shareQuoteSchema = z.object({
  labor_cost: z.coerce.number().min(0, "Labor cost must be positive."),
  parts_cost: z.coerce.number().min(0, "Parts cost must be positive."),
  total_amount: z.coerce.number(),
  notes: z.string().optional(),
});

type ShareQuoteFormProps = {
    job: Job;
    children: React.ReactNode;
    onFormSubmit: () => void;
}

export function ShareQuoteForm({ job, children, onFormSubmit }: ShareQuoteFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof shareQuoteSchema>>({
    resolver: zodResolver(shareQuoteSchema),
    defaultValues: {
      labor_cost: 0,
      parts_cost: 0,
      total_amount: 0,
      notes: "",
    },
  });

  const watchLaborCost = form.watch("labor_cost");
  const watchPartsCost = form.watch("parts_cost");

  useEffect(() => {
    const total = (Number(watchLaborCost) || 0) + (Number(watchPartsCost) || 0);
    form.setValue("total_amount", total);
  }, [watchLaborCost, watchPartsCost, form]);


  const onSubmit = async (values: z.infer<typeof shareQuoteSchema>) => {
    setIsLoading(true);
    try {
        await shareQuoteAction({
            booking_id: job.id,
            labor_cost: values.labor_cost,
            parts_cost: values.parts_cost,
            total_amount: values.total_amount,
            notes: values.notes,
        });

        await updateJobStatusAction({
            booking_id: job.id,
            order_id: job.order_id,
            status: 'quotation_shared',
            note: `Quote of INR ${values.total_amount} shared with customer.`
        });

        toast({
            title: t('share_quote_form.toast_title_success'),
            description: `${t('share_quote_form.toast_description_success')} ${values.total_amount}.`,
        });

        setOpen(false);
        onFormSubmit();
    } catch (error: any) {
        toast({
            title: "Quote Submission Failed",
            description: error.message || "Could not share the quote.",
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
          <DialogTitle>{t('share_quote_form.title')}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="labor_cost"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('share_quote_form.labor_cost_label')}</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 500" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="parts_cost"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{t('share_quote_form.parts_cost_label')}</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 1200" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <FormField
              control={form.control}
              name="total_amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('share_quote_form.total_amount_label')}</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} readOnly className="bg-muted font-bold"/>
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
                  <FormLabel>{t('share_quote_form.notes_label')}</FormLabel>
                  <FormControl>
                    <Textarea placeholder={t('share_quote_form.notes_placeholder')} {...field} />
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
                {t('share_quote_form.submit_button')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

    