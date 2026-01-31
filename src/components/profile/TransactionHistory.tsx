"use client";

import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IndianRupee, ArrowUpCircle, ArrowDownCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export type Transaction = {
    id: string;
    type: string;
    amount: number;
    created_at: string;
    note: string | null;
    status: string;
};

type TransactionHistorySheetProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    transactions: Transaction[];
};

export function TransactionHistorySheet({
    isOpen,
    onOpenChange,
    transactions,
}: TransactionHistorySheetProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onOpenChange}>
            <SheetContent side="bottom" className="h-[80vh] rounded-t-[32px] p-0 border-none outline-none">
                <div className="h-1.5 w-12 bg-slate-200 rounded-full mx-auto mt-3 mb-2" />
                <SheetHeader className="px-6 pb-4">
                    <SheetTitle className="text-xl font-bold font-headline">Transaction History</SheetTitle>
                    <SheetDescription>
                        Recent wallet activities including top-ups and commissions
                    </SheetDescription>
                </SheetHeader>

                <ScrollArea className="h-full px-6 pb-10">
                    <div className="space-y-4">
                        {transactions.length > 0 ? (
                            transactions.map((tx) => (
                                <div
                                    key={tx.id}
                                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 transition-all active:scale-[0.98]"
                                >
                                    <div className="flex items-center gap-4">
                                        <div
                                            className={cn(
                                                "p-2.5 rounded-xl",
                                                tx.type === "topup" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                                            )}
                                        >
                                            {tx.type === "topup" ? (
                                                <ArrowUpCircle className="h-5 w-5" />
                                            ) : (
                                                <ArrowDownCircle className="h-5 w-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{tx.note || (tx.type === 'topup' ? 'Wallet Top-up' : 'Platform Commission')}</p>
                                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                                                <Clock className="h-3 w-3" />
                                                {new Date(tx.created_at).toLocaleDateString("en-IN", {
                                                    day: "numeric",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div
                                            className={cn(
                                                "flex items-center text-sm font-black",
                                                tx.type === "topup" ? "text-emerald-600" : "text-rose-600"
                                            )}
                                        >
                                            <span>{tx.type === "topup" ? "+" : "-"}</span>
                                            <IndianRupee className="w-3.5 h-3.5 ml-0.5" />
                                            <span>{tx.amount}</span>
                                        </div>
                                        <p
                                            className={cn(
                                                "text-[9px] font-black uppercase tracking-widest",
                                                tx.status === "success"
                                                    ? "text-emerald-500/60"
                                                    : tx.status === "pending"
                                                        ? "text-amber-500/60"
                                                        : "text-rose-500/60"
                                            )}
                                        >
                                            {tx.status}
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                    <Clock className="h-8 w-8 text-slate-300" />
                                </div>
                                <p className="text-slate-500 font-medium">No transactions yet</p>
                            </div>
                        )}
                    </div>
                </ScrollArea>
            </SheetContent>
        </Sheet>
    );
}
