"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import type { Job } from "@/lib/types";
import { IndianRupee, HandCoins } from "lucide-react";

type EarningSheetProps = {
  job: Job;
  children: React.ReactNode;
};

export function EarningSheet({ job, children }: EarningSheetProps) {
  const finalCost = job.finalCost ?? 0;
  const platformFeePercentage = 20; // Assuming 20% platform fee
  const platformFee = (finalCost * platformFeePercentage) / 100;
  const technicianPayout = finalCost - platformFee;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <HandCoins className="h-6 w-6 text-primary" />
            Job Earning Breakdown
          </SheetTitle>
        </SheetHeader>
        <div className="py-8 space-y-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Final Amount Collected</span>
              <span className="font-medium">{formatCurrency(finalCost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Platform Fee ({platformFeePercentage}%)</span>
              <span className="font-medium text-red-600">
                - {formatCurrency(platformFee)}
              </span>
            </div>
          </div>
          <Separator />
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Your Payout</span>
            <span className="text-green-600">{formatCurrency(technicianPayout)}</span>
          </div>
          <div className="text-xs text-muted-foreground pt-4">
             This is an estimate. The final payout will be reflected in your weekly statement after any adjustments.
          </div>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button className="w-full">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
