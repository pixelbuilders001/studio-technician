
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

type UpdateStatusPayload = {
    booking_id: string;
    status: 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';
    note: string;
    order_id: string;
};

export async function updateJobStatusAction(payload: UpdateStatusPayload) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/update-job-status`;
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !apikey) {
    console.error("Supabase URL or anon key is not defined in environment variables.");
    throw new Error("Server configuration error.");
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }
    
    revalidatePath('/jobs');

    const data = await response.json();
    return data;

  } catch (error: any) {
    console.error('Update job status API error:', error);
    throw new Error(error.message || "An unexpected error occurred while updating status.");
  }
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

export async function getJobsAction(technicianId: string) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/booking?technician_id=eq.${technicianId}&select=net_inspection_fee%2Cuser_name%2Cid%2Corder_id%2Cstatus%2Ccreated_at%2Cfull_address%2Cpreferred_time_slot%2Cpincode%2Ctotal_estimated_price%2Cmedia_url%2Cmobile_number%2Cmap_url%2Ccategories(id%2Cname)%2Cissues(id%2Ctitle)&order=created_at.desc`;
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !apikey) {
    console.error("Supabase URL or anon key is not defined in environment variables.");
    throw new Error("Server configuration error.");
  }

  try {
    const response = await fetch(url, {
      headers: {
        'apikey': apikey,
        'Authorization': `Bearer ${apikey}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error('Get jobs API error:', error);
    throw new Error(error.message || "An unexpected error occurred while fetching jobs.");
  }
}

export async function partnerSignupAction(formData: FormData) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-technician`;
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const authToken = process.env.SUPABASE_SERVICE_ROLE_KEY; 

  if (!url || !apikey || !authToken) {
    console.error("Supabase URL, anon key, or auth token is not defined.");
    throw new Error("Server configuration error.");
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'apikey': apikey,
        'Authorization': `Bearer ${authToken}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error Data:", errorData);
      throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };

  } catch (error: any) {
    console.error('Partner signup API error:', error);
    throw new Error(error.message || "An unexpected error occurred during signup.");
  }
}
