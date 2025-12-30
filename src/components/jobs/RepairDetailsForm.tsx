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

const repairDetailsSchema = z.object({
  finalCost: z.coerce.number().positive({ message: "Please enter a valid cost." }),
  spareParts: z.string().optional(),
  notes: z.string().optional(),
});

export function RepairDetailsForm() {
  const [open, setOpen] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof repairDetailsSchema>>({
    resolver: zodResolver(repairDetailsSchema),
    defaultValues: {
      finalCost: undefined,
      spareParts: "",
      notes: "",
    },
  });

  const onSubmit = (values: z.infer<typeof repairDetailsSchema>) => {
    console.log("Repair Details Submitted:", values);
    // Here you would typically call a server action to save the data.
    toast({
      title: "Repair Details Saved",
      description: `Final cost recorded as ₹${values.finalCost}.`,
    });
    setOpen(false);
    // In a real app, this would trigger a re-render with the completion screen.
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">Add Repair Details</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Job</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="finalCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Final Repair Cost</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="e.g., 1500" {...field} />
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
                  <FormLabel>Spare Parts Used (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 1x Capacitor, 1x Fuse" {...field} />
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
                  <FormLabel>Notes (Optional)</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Any additional notes about the repair..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Confirm Completion</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
