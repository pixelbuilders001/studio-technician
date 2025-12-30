"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { estimateTimeAction } from "@/app/actions";
import type { EstimateCompletionTimeInput } from "@/ai/flows/estimate-completion-time";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Clock, Bot } from "lucide-react";

type Props = {
  jobDetails: EstimateCompletionTimeInput;
};

export function EstimateTime({ jobDetails }: Props) {
  const [isPending, startTransition] = useTransition();
  const [estimation, setEstimation] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEstimate = () => {
    startTransition(async () => {
      setError(null);
      setEstimation(null);
      try {
        const result = await estimateTimeAction(jobDetails);
        setEstimation(result.estimatedTime);
      } catch (e) {
        setError("Failed to get estimation. Please try again.");
      }
    });
  };

  if (estimation) {
    return (
      <Alert className="bg-accent/50 border-accent">
        <Clock className="h-4 w-4" />
        <AlertTitle className="font-semibold">AI Estimated Time</AlertTitle>
        <AlertDescription>
            The estimated completion time is <strong>{estimation}</strong>.
        </AlertDescription>
      </Alert>
    );
  }

  if (error) {
     return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  return (
    <Button onClick={handleEstimate} disabled={isPending} variant="outline" className="w-full justify-start p-2 h-auto text-left">
        <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary"/>
            <div>
                <p className="font-semibold">Get AI Time Estimate</p>
                <p className="text-xs text-muted-foreground font-normal">Estimate job completion time</p>
            </div>
            {isPending && <Loader2 className="ml-auto h-4 w-4 animate-spin" />}
        </div>
    </Button>
  );
}
