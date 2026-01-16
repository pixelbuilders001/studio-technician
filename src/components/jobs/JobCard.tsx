"use client";

import { useRouter } from "next/navigation";
import type { Job, JobStatus } from "@/lib/types";
import Image from "next/image";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MapPin, Check, X, Wrench, Tv, Refrigerator, Smartphone, AirVent, WashingMachine, Info, IndianRupee, Phone, Navigation, CheckCircle, ArrowRight, HandCoins, FileText, Share2, Wallet, Download, Clock, User, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React, { useState, useTransition } from "react";
import { useTranslation } from "@/hooks/useTranslation";
import { format } from 'date-fns';
import { Separator } from "../ui/separator";
import { updateJobStatusAction } from "@/app/actions";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RepairDetailsForm, type RepairDetails } from "./RepairDetailsForm";
import { EarningSheet } from "./EarningSheet";
import { InspectionDetailsForm } from "./InspectionDetailsForm";
import { ShareQuoteForm } from "./ShareQuoteForm";
import { CompletionCodeDialog } from "./CompletionCodeDialog";
import { PaymentCollectionDialog } from "./PaymentCollectionDialog";

const iconMap: { [key: string]: React.ElementType } = {
    LAPTOPS: Wrench,
    TV: Tv,
    Refrigerator,
    Smartphone,
    "Air Conditioner": AirVent,
    "Washing Machine": WashingMachine,
};

type StatusConfig = {
    [key in JobStatus]?: {
        nextStatus: JobStatus;
        buttonTextKey: string;
        buttonIcon: React.ElementType;
    }
}

const statusFlow: StatusConfig = {
    'accepted': {
        nextStatus: 'on_the_way',
        buttonTextKey: 'start_travel',
        buttonIcon: Navigation,
    },
    'on_the_way': {
        nextStatus: 'inspection_started',
        buttonTextKey: 'start_inspection',
        buttonIcon: Wrench,
    },
    'quotation_approved': {
        nextStatus: 'repair_started',
        buttonTextKey: 'start_repair',
        buttonIcon: Wrench,
    },
}

export function JobCard({ job, technicianId, onJobsUpdate }: { job: Job, technicianId: string | null, onJobsUpdate: (newTab?: 'new' | 'ongoing' | 'completed') => void }) {
    const router = useRouter();
    const { toast } = useToast();
    const { t } = useTranslation();
    const [isPending, startTransition] = useTransition();

    const [codeOpen, setCodeOpen] = useState(false);
    const [paymentOpen, setPaymentOpen] = useState(false);
    const [repairDetails, setRepairDetails] = useState<RepairDetails | null>(null);

    const finalCost = job.final_amount_to_be_paid || job.total_estimated_price;
    const platformFeePercentage = 18;
    const technicianPayout = finalCost - ((finalCost * platformFeePercentage) / 100);

    const handleStatusUpdate = (status: JobStatus) => {
        if (!technicianId) {
            toast({ title: "Error", description: "Technician profile not found.", variant: "destructive" });
            return;
        }

        startTransition(async () => {
            try {
                await updateJobStatusAction({
                    booking_id: job.id,
                    status: status,
                    note: `Technician has updated the job to ${status}.`,
                    order_id: job.order_id,
                });
                toast({
                    title: t('status_updater.toast_title'),
                    description: `${t('status_updater.toast_description')} ${t(`job_api_status.${status}`)}`,
                });
                onJobsUpdate(status === 'accepted' ? 'ongoing' : undefined);

            } catch (error: any) {
                toast({
                    title: "Update Failed",
                    description: error.message || "Could not update job status.",
                    variant: "destructive",
                });
            }
        });
    };

    const handleCodeSent = (details: RepairDetails) => {
        setRepairDetails(details);
        onJobsUpdate();
        setCodeOpen(true);
    };

    const onCodeVerified = async () => {
        if (!technicianId) return;

        try {
            await updateJobStatusAction({
                booking_id: job.id,
                status: 'payment_pending',
                note: 'Completion code verified. Awaiting payment.',
                order_id: job.order_id,
            });

            toast({
                title: "Code Verified!",
                description: "Please proceed to collect payment.",
            });

            setCodeOpen(false);
            onJobsUpdate();

        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message || "Could not update job status.",
                variant: "destructive",
            });
        }
    }

    const onPaymentSuccess = async () => {
        if (!technicianId) {
            toast({ title: "Error", description: "Repair details are missing.", variant: "destructive" });
            return;
        }
        try {
            await updateJobStatusAction({
                booking_id: job.id,
                status: 'repair_completed',
                note: `Payment of ₹${finalCost} collected.`,
                order_id: job.order_id,
                final_cost: finalCost
            });

            toast({
                title: t('payment_collection_dialog.toast_title_success'),
                description: t('payment_collection_dialog.toast_description_success'),
            });

            setPaymentOpen(false);
            onJobsUpdate();

        } catch (error: any) {
            toast({
                title: "Update Failed",
                description: error.message || "Could not complete the job.",
                variant: "destructive",
            });
        }
    };

    const DeviceIcon = iconMap[job?.categories?.name] || Wrench;

    const statusBadge = () => {
        let className = "";
        const statusKey = job.status as JobStatus;

        switch (statusKey) {
            case 'assigned':
                className = "bg-orange-100 text-orange-700 border-orange-200";
                break;
            case 'accepted':
                className = "bg-indigo-100 text-indigo-700 border-indigo-200";
                break;
            case 'on_the_way':
                className = "bg-cyan-100 text-cyan-700 border-cyan-200";
                break;
            case 'in-progress':
            case 'repair_started':
                className = "bg-purple-100 text-purple-700 border-purple-200";
                break;
            case 'inspection_started':
            case 'inspection_completed':
            case 'quotation_shared':
                className = "bg-amber-100 text-amber-700 border-amber-200";
                break;
            case 'code_sent':
            case 'payment_pending':
                className = "bg-blue-100 text-blue-700 border-blue-200";
                break;
            case 'quotation_approved':
                className = "bg-teal-100 text-teal-700 border-teal-200";
                break;
            case 'completed':
            case 'repair_completed':
            case 'closed_no_repair':
                className = "bg-emerald-100 text-emerald-700 border-emerald-200";
                break;
            case 'cancelled':
            case 'job_rejected':
            case 'quotation_rejected':
                className = "bg-rose-100 text-rose-700 border-rose-200";
                break;
            default:
                className = "bg-slate-100 text-slate-700 border-slate-200";
        }

        if (job.status) {
            return (
                <Badge variant="outline" className={cn("capitalize px-2 py-0.5 rounded-md text-[10px] font-bold tracking-tight shadow-sm", className)}>
                    {statusKey.replace(/_/g, ' ')}
                </Badge>
            )
        }
        return null
    }

    const formatPhoneNumber = (phone: string) => {
        if (!phone || phone.length < 10) return phone;
        const number = phone.slice(-10);
        return `+91 XXXXXX${number.slice(-4)}`;
    }

    const nextAction = statusFlow[job.status];
    const NextActionIcon = nextAction?.buttonIcon;

    const allowCommunication = ['assigned', 'pending', 'on_the_way', 'accepted'].includes(job.status);

    const communicationButtons = (
        <div className="flex gap-2 mb-3">
            <Button variant="outline" className="flex-1 h-11 rounded-xl border-slate-200 bg-white" asChild>
                <a href={`tel:${job.mobile_number}`}><Phone className="mr-2 h-4 w-4 text-primary" /> Call</a>
            </Button>
            {job.map_url ? (
                <Button variant="outline" className="flex-1 h-11 rounded-xl border-slate-200 bg-white" asChild>
                    <a href={job.map_url} target="_blank" rel="noopener noreferrer">
                        <Navigation className="mr-2 h-4 w-4 text-primary" /> Map
                    </a>
                </Button>
            ) : (
                <Button variant="outline" className="flex-1 h-11 rounded-xl border-slate-200 bg-white opacity-50 cursor-not-allowed">
                    <Navigation className="mr-2 h-4 w-4" /> Map
                </Button>
            )}
        </div>
    );


    const renderFooter = () => {
        if (!technicianId) {
            return (
                <div className="w-full text-center text-slate-400 text-sm py-2">
                    <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                </div>
            );
        }

        if (job.status === 'assigned') {
            return (
                <div className="flex flex-col w-full p-4 bg-slate-50 border-t border-slate-100">
                    {allowCommunication && communicationButtons}
                    <div className="flex gap-3">
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="outline" className="flex-1 h-12 rounded-xl text-rose-500 border-rose-100 hover:bg-rose-50 font-bold" disabled={isPending}>
                                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <X className="mr-2 h-4 w-4" />}
                                    {t('job_card.reject')}
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-3xl max-w-[90vw]">
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Reject this job?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This job will be removed from your list and assigned to another technician.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleStatusUpdate('job_rejected')} className="bg-rose-500 hover:bg-rose-600 rounded-xl">
                                        Confirm Reject
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <Button className="flex-1 h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20" onClick={() => handleStatusUpdate('accepted')} disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
                            {t('job_card.accept')}
                        </Button>
                    </div>
                </div>
            )
        }

        if (['completed', 'repair_completed', 'closed_no_repair'].includes(job.status)) {
            const isPaid = (job.final_amount_paid ?? 0) > 0;
            return (
                <div className="flex gap-3 w-full p-4 bg-slate-50 border-t border-slate-100">
                    {isPaid ? (
                        <Button variant="outline" className="flex-1 h-11 rounded-xl border-slate-200 font-bold text-slate-700">
                            <Download className="mr-2 h-4 w-4" />
                            Invoice
                        </Button>
                    ) : (
                        <Button variant="outline" className="flex-1 h-11 rounded-xl bg-amber-50 border-amber-100 text-amber-700 hover:bg-amber-100 font-bold" onClick={() => setPaymentOpen(true)}>
                            <Wallet className="mr-2 h-4 w-4" />
                            Collect
                        </Button>
                    )}
                    <EarningSheet job={job}>
                        <Button className="flex-1 h-11 rounded-xl bg-emerald-500 hover:bg-emerald-600 font-bold text-white shadow-lg shadow-emerald-500/20">
                            <HandCoins className="mr-2 h-4 w-4" />
                            Earnings
                        </Button>
                    </EarningSheet>
                </div>
            )
        }

        let mainActionButton = null;

        if (nextAction && NextActionIcon) {
            mainActionButton = (
                <Button className="h-11 flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20" onClick={() => handleStatusUpdate(nextAction.nextStatus)} disabled={isPending}>
                    {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <NextActionIcon className="mr-2 h-4 w-4" />}
                    {t(`status_updater.${nextAction.buttonTextKey}`)}
                </Button>
            );
        } else if (job.status === 'inspection_started') {
            mainActionButton = (
                <InspectionDetailsForm
                    job={job}
                    technicianId={technicianId}
                    onFormSubmit={() => onJobsUpdate()}
                >
                    <Button className="h-11 flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                        {t('status_updater.inspection_done')}
                    </Button>
                </InspectionDetailsForm>
            );
        } else if (job.status === 'inspection_completed') {
            mainActionButton = (
                <div className="flex gap-2 flex-1">
                    <ShareQuoteForm
                        job={job}
                        onFormSubmit={() => onJobsUpdate()}
                    >
                        <Button className="h-11 flex-1 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20" disabled={isPending}>
                            {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Share2 className="mr-2 h-4 w-4" />}
                            {t('status_updater.share_quote')}
                        </Button>
                    </ShareQuoteForm>
                    <Button className="h-11 flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/20" onClick={() => setPaymentOpen(true)}>
                        <Wallet className="mr-2 h-4 w-4" />
                        Collect
                    </Button>
                </div>
            );
        } else if (job.status === 'quotation_shared') {
            mainActionButton = (
                <Button className="h-11 flex-1 rounded-xl bg-slate-100 text-slate-500 font-bold cursor-not-allowed" disabled>
                    <Check className="mr-2 h-4 w-4" />
                    {t('status_updater.quote_sent')}
                </Button>
            );
        } else if (job.status === 'repair_started') {
            mainActionButton = (
                <RepairDetailsForm
                    job={job}
                    onCodeSent={handleCodeSent}
                >
                    <Button className="h-11 flex-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold shadow-lg shadow-emerald-500/20" disabled={isPending}>
                        {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        {t('status_updater.complete_job')}
                    </Button>
                </RepairDetailsForm>
            );
        } else if (job.status === 'code_sent') {
            mainActionButton = (
                <Button className="h-11 flex-1 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-500/20" onClick={() => setCodeOpen(true)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {t('status_updater.enter_code')}
                </Button>
            )
        } else if (job.status === 'payment_pending') {
            mainActionButton = (
                <Button className="h-11 flex-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold shadow-lg shadow-amber-500/20" onClick={() => setPaymentOpen(true)}>
                    <Wallet className="mr-2 h-4 w-4" />
                    Payment
                </Button>
            );
        }

        return (
            <div className="flex flex-col gap-3 w-full p-4 bg-slate-50 border-t border-slate-100">
                {allowCommunication && communicationButtons}
                {mainActionButton}
            </div>
        )
    }

    const isCompleted = ['completed', 'repair_completed', 'closed_no_repair'].includes(job.status);

    return (
        <>
            <Card className={cn(
                "overflow-hidden transition-all duration-300 border-none shadow-xl shadow-slate-200/50 bg-white group rounded-2xl relative",
                isCompleted && "opacity-90 grayscale-[0.2]"
            )}>
                {isCompleted && (
                    <div className="absolute top-4 right-4 pointer-events-none z-10">
                        <div className="flex items-center gap-1 bg-emerald-500 text-white px-2 py-1 rounded-lg text-[10px] font-bold shadow-lg shadow-emerald-500/20 ring-2 ring-white">
                            <CheckCircle size={12} />
                            COMPLETED
                        </div>
                    </div>
                )}

                <CardHeader className="p-4 bg-gradient-to-br from-slate-50 to-white">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-md border border-slate-100 flex-shrink-0 transition-transform group-hover:scale-110 duration-500">
                                <DeviceIcon className="h-8 w-8 text-primary" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <CardTitle className="text-lg font-bold font-headline text-slate-900 truncate">
                                    {job.categories.name}
                                </CardTitle>
                                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1">
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                        <Clock size={12} />
                                        {format(new Date(job.created_at), 'h:mm a')}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                                        {format(new Date(job.created_at), 'MMM dd')}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                            <div className="text-xl font-extrabold text-slate-900 tracking-tight">₹{finalCost}</div>
                            <div className="mt-1 flex justify-end">
                                {statusBadge()}
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="p-4 space-y-4 pt-2">
                    <div className="p-3 bg-slate-50 rounded-xl space-y-3">
                        <div className="flex gap-3 items-start">
                            <div className="mt-1">
                                <div className="p-1.5 bg-indigo-50 rounded-lg">
                                    <Info className="h-3.5 w-3.5 text-indigo-500" />
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Problem Reported</p>
                                <p className="text-sm font-semibold text-slate-800 leading-tight mt-0.5">{job.issues.title}</p>
                            </div>
                        </div>

                        <Separator className="bg-slate-200/50" />

                        <div className="flex gap-3 items-start">
                            <div className="mt-1">
                                <div className="p-1.5 bg-rose-50 rounded-lg">
                                    <MapPin className="h-3.5 w-3.5 text-rose-500" />
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Service Location</p>
                                <p className="text-sm font-semibold text-slate-800 leading-tight mt-0.5 line-clamp-2">{job.full_address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-3 border border-slate-100 rounded-xl bg-white shadow-sm">
                        <div className="flex items-center gap-3">
                            <div className="relative h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/5">
                                <User className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-900">{job.user_name}</p>
                                <p className="text-xs text-slate-400 font-medium">{formatPhoneNumber(job.mobile_number)}</p>
                            </div>
                        </div>
                        {job.media_url && (
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="relative h-10 w-10 rounded-lg overflow-hidden cursor-pointer border-2 border-white shadow-md ring-1 ring-slate-100 ring-offset-2">
                                        <Image src={job.media_url} alt="Job photo" fill className="object-cover" />
                                    </div>
                                </DialogTrigger>
                                <DialogContent className="p-0 border-0 max-w-screen-md bg-transparent shadow-none">
                                    <Image
                                        src={job.media_url}
                                        alt="Job photo"
                                        width={800}
                                        height={600}
                                        className="w-full h-auto object-contain rounded-2xl shadow-2xl"
                                    />
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </CardContent>

                <CardFooter className="p-0">
                    {renderFooter()}
                </CardFooter>
            </Card>

            {technicianId && (
                <>
                    <CompletionCodeDialog
                        bookingId={job.id}
                        technicianId={technicianId}
                        earningAmount={technicianPayout}
                        open={codeOpen}
                        onOpenChange={setCodeOpen}
                        onVerificationSuccess={onCodeVerified}
                    />

                    <PaymentCollectionDialog
                        job={job}
                        totalAmount={finalCost}
                        open={paymentOpen}
                        onOpenChange={setPaymentOpen}
                        onPaymentSuccess={onPaymentSuccess}
                    />
                </>
            )}
        </>
    );
}
