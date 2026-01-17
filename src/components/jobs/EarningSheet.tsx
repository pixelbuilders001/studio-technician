"use client";

import { useEffect, useState } from "react";
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
import { HandCoins, IndianRupee, Loader2 } from "lucide-react";
import { getPlatformEarningsAction, type PlatformEarnings } from "@/app/actions";

type EarningSheetProps = {
  job: Job;
  children: React.ReactNode;
};

export function EarningSheet({ job, children }: EarningSheetProps) {
  const [earnings, setEarnings] = useState<PlatformEarnings | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && job.id) {
      setLoading(true);
      getPlatformEarningsAction(job.id)
        .then((data) => setEarnings(data))
        .catch((err) => console.error("Failed to fetch earnings:", err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, job.id]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <HandCoins className="h-6 w-6 text-primary" />
            Job Earning Breakdown
          </SheetTitle>
        </SheetHeader>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Loading earnings details...</p>
          </div>
        ) : earnings ? (
          <div className="py-8 space-y-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Final Amount Collected</span>
                <div className="flex items-center text-lg font-semibold text-slate-800">
                  <IndianRupee className="w-4 h-4" />
                  <span>{earnings.gross_amount}</span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform Fee ({earnings.commission_percentage}%)</span>
                <div className="flex items-center text-lg font-semibold text-slate-800">
                  <IndianRupee className="w-4 h-4" />
                  <span>{earnings.commission_amount}</span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Your Payout</span>
              <div className="flex items-center text-lg font-semibold text-slate-800">
                <IndianRupee className="w-4 h-4" />
                <span>{earnings.technician_amount}</span>
              </div>
            </div>
            <div className="text-xs text-muted-foreground pt-4">
              This is the final breakdown for this job.
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            {/* Fallback to estimated calculation if no record found, or show empty state */}
            <div className="space-y-4">
              <p>No earnings record found for this job yet.</p>
              <div className="space-y-2 text-sm text-left opacity-70">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Estimated Breakdown</p>
                <div className="flex justify-between">
                  <span>Estimated Amount</span>
                  <span>{formatCurrency(job.finalCost ?? job.total_estimated_price ?? 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Platform Fee (20%)</span>
                  <span>- {formatCurrency((job.finalCost ?? job.total_estimated_price ?? 0) * 0.20)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-bold">
                  <span>Est. Payout</span>
                  <span>{formatCurrency((job.finalCost ?? job.total_estimated_price ?? 0) * 0.80)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <SheetFooter>
          <SheetClose asChild>
            <Button className="w-full">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
