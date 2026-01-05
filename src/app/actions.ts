
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

type LoginPayload = {
  mobile: string;
  code: string;
};

type Technician = {
  id: string;
  name: string;
  mobile: string;
};

type LoginResponse = {
  success: boolean;
  token?: string;
  technician?: Technician;
  error?: string;
};


export async function technicianLoginAction(payload: LoginPayload): Promise<LoginResponse> {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/technician-login`;
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !apikey) {
    console.error("Supabase URL or anon key is not defined in environment variables.");
    return { success: false, error: "Server configuration error." };
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey,
      },
      body: JSON.stringify({
        mobile: payload.mobile,
        code: payload.code,
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }

    const data: LoginResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error('Login API error:', error);
    return { success: false, error: error.message || "An unexpected error occurred." };
  }
}
