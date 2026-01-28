"use client";

import { CheckCircle2, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function WaitingApprovalPage() {
    const router = useRouter();


    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
            <div className="max-w-md w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col items-center space-y-4">
                    <div className="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center relative">
                        <Clock className="h-12 w-12 text-primary animate-pulse" />
                        <div className="absolute -top-1 -right-1">
                            <CheckCircle2 className="h-8 w-8 text-green-500 bg-background rounded-full p-1" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold font-headline tracking-tight">
                        Application Submitted!
                    </h1>

                    <p className="text-muted-foreground text-lg">
                        Your partner registration has been successfully received.
                        Our team is currently reviewing your details.
                    </p>
                </div>

                <div className="bg-card border rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-start space-x-4 text-left">
                        <div className="mt-1 bg-primary/10 p-2 rounded-lg">
                            <Mail className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-semibold">Next Steps</h4>
                            <p className="text-sm text-muted-foreground">
                                You will receive an email notification once your account is verified.
                                This usually takes 24-48 hours.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 pt-4">
                    <p className="text-sm text-muted-foreground">
                        Have questions? Contact our support team.
                    </p>
                    <Button
                        onClick={() => router.push('/')}
                        variant="outline"
                        className="w-full h-12 text-base"
                    >
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}
