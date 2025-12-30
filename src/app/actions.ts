"use server";

import {
  estimateCompletionTime,
  type EstimateCompletionTimeInput,
} from "@/ai/flows/estimate-completion-time";
import { revalidatePath } from "next/cache";

export async function estimateTimeAction(input: EstimateCompletionTimeInput) {
  try {
    const result = await estimateCompletionTime(input);
    return result;
  } catch (error) {
    console.error("Error estimating completion time:", error);
    throw new Error("An error occurred while estimating the time.");
  }
}

export async function updateJobStatusAction(jobId: string, path: string) {
  // In a real app, you would update the database here.
  // For this demo, we just revalidate the path to trigger a re-render.
  console.log(`Updating status for job ${jobId}. Revalidating ${path}`);
  revalidatePath(path);
}
