"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IndianRupee, Plus, History, Wallet } from "lucide-react";
import { TransactionHistorySheet, type Transaction } from "./TransactionHistory";
import { getWalletTransactionsAction } from "@/app/actions";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";


export function WalletCard({ balance = 0 }: { balance?: number }) {
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isAddMoneyOpen, setIsAddMoneyOpen] = useState(false);
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    useEffect(() => {
        const fetchTransactions = async () => {
            const data = await getWalletTransactionsAction();
            setTransactions(data.map(tx => ({
                id: tx.id,
                type: tx.type,
                amount: tx.amount,
                created_at: tx.created_at,
                note: tx.note,
                status: 'success' // Defaulting to success as per table layout
            })));
        };

        fetchTransactions();
    }, []);

    const handleAddMoney = () => {
        setIsAddMoneyOpen(true);
    };

    return (
        <>
            <Card className="border-none shadow-2xl shadow-primary/5 bg-white overflow-hidden rounded-[32px]">
                <CardContent className="p-0">
                    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8 text-white relative overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-400/10 rounded-full blur-2xl -ml-12 -mb-12" />

                        <div className="flex justify-between items-start relative z-10">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 opacity-60">
                                    <Wallet className="h-4 w-4" />
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">Current Balance</span>
                                </div>
                                <div className="flex items-center text-4xl font-black font-headline tracking-tight">
                                    <IndianRupee className="h-7 w-7 mr-1 stroke-[3]" />
                                    <span>{balance.toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                            <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/10">
                                <Wallet className="h-6 w-6 text-white" />
                            </div>
                        </div>

                        <div className="mt-8 flex gap-3 relative z-10">
                            <Button
                                onClick={handleAddMoney}
                                className="flex-1 h-12 bg-primary hover:bg-primary/90 text-white rounded-2xl font-bold shadow-lg shadow-primary/20 border-none transition-all active:scale-95"
                            >
                                <Plus className="h-5 w-5 mr-1" />
                                Add Money
                            </Button>
                            <Button
                                onClick={() => setIsHistoryOpen(true)}
                                variant="outline"
                                className="flex-1 h-12 bg-white/5 border-white/20 rounded-2xl font-bold backdrop-blur-sm transition-all active:scale-95"
                            >
                                <History className="h-5 w-5 mr-2" />
                                History
                            </Button>
                        </div>
                    </div>


                </CardContent>
            </Card>

            <TransactionHistorySheet
                isOpen={isHistoryOpen}
                onOpenChange={setIsHistoryOpen}
                transactions={transactions}
            />

            <Dialog open={isAddMoneyOpen} onOpenChange={setIsAddMoneyOpen}>
                <DialogContent className="sm:max-w-md border-none rounded-[32px] overflow-hidden p-0 bg-white">
                    <div className="bg-gradient-to-br from-primary/20 via-primary/5 to-transparent p-8 pt-12 text-center relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16" />

                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 rotate-12 transition-transform hover:rotate-0 duration-500">
                            <Wallet className="h-10 w-10 text-primary" />
                        </div>

                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-2xl font-black font-headline text-slate-900 tracking-tight">COMING SOON</DialogTitle>
                            <DialogDescription className="text-slate-500 font-medium">
                                We're working hard to bring you a seamless way to add money to your wallet. Stay tuned!
                            </DialogDescription>
                        </DialogHeader>

                        <Button
                            onClick={() => setIsAddMoneyOpen(false)}
                            className="w-full h-14 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95"
                        >
                            Got it! 🚀
                        </Button>

                        <p className="mt-6 text-[10px] font-black text-slate-300 uppercase tracking-widest leading-loose">
                            Digital Payments integration in progress
                        </p>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
