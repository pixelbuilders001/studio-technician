
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
    status: 'accepted' | 'rejected' | 'on_the_way' | 'in-progress' | 'code_sent' | 'completed' | 'cancelled' | 'inspection_started' | 'inspection_completed' | 'quotation_shared' | 'quotation_approved' | 'quotation_rejected' | 'repair_started' | 'repair_completed' | 'closed_no_repair' | 'payment_pending';
    note: string;
    order_id: string;
    final_cost?: number;
    spare_parts_used?: string;
    technician_notes?: string;
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
        'Authorization': `Bearer ${apikey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }
    
    revalidatePath('/jobs');
  console.log("revalidated /jobs path");
    const data = await response.json();
    return data;

  } catch (error: any) {
    console.error('Update job status API error:', error);
    throw new Error(error.message || "An unexpected error occurred while updating status.");
  }
}

export async function saveInspectionDetailsAction(formData: FormData) {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/inspection-submit`;
    const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !apikey) {
        throw new Error("Server configuration error.");
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': apikey,
            },
            body: formData
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            try {
                const errorJson = JSON.parse(errorText);
                throw new Error(errorJson.error || `Failed to save inspection details: ${errorText}`);
            } catch {
                throw new Error(`Failed to save inspection details: ${errorText}`);
            }
        }
        
        revalidatePath('/jobs');
        return await response.json();

    } catch (e: any) {
        console.error("saveInspectionDetailsAction error:", e);
        throw new Error(e.message);
    }
}

type QuotePayload = {
  booking_id: string;
  labor_cost: number;
  parts_cost: number;
  total_amount: number;
  notes?: string;
}

export async function shareQuoteAction(payload: QuotePayload) {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/repair_quotes`;
    const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !apikey) {
        throw new Error("Server configuration error.");
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': apikey,
                'Authorization': `Bearer ${apikey}`,
                'Prefer': 'return=minimal',
            },
            body: JSON.stringify(payload)
        });

        if (response.status !== 201) {
             const errorText = await response.text();
            throw new Error(`Failed to save quote: ${errorText}`);
        }
        
        revalidatePath('/jobs');
        return { success: true };

    } catch(e: any) {
        console.error("shareQuoteAction error:", e);
        throw new Error(e.message);
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
  selfie_url?: string;
  primary_skill?: string;
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
        'Authorization': `Bearer ${apikey}`,
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
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/booking?technician_id=eq.${technicianId}&select=final_amount_to_be_paid%2Cfinal_amount_paid%2Cnet_inspection_fee%2Cuser_name%2Cid%2Corder_id%2Cstatus%2Ccreated_at%2Cfull_address%2Cpreferred_time_slot%2Cpincode%2Ctotal_estimated_price%2Cmedia_url%2Cmobile_number%2Cmap_url%2Ccategories(id%2Cname)%2Cissues(id%2Ctitle)&order=created_at.desc`;
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

export async function getJobByIdAction(jobId: string, technicianId: string) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/booking?id=eq.${jobId}&technician_id=eq.${technicianId}&select=final_amount_to_be_paid%2Cfinal_amount_paid%2Cnet_inspection_fee%2Cuser_name%2Cid%2Corder_id%2Cstatus%2Ccreated_at%2Cfull_address%2Cpreferred_time_slot%2Cpincode%2Ctotal_estimated_price%2Cmedia_url%2Cmobile_number%2Cmap_url%2Ccategories(id%2Cname)%2Cissues(id%2Ctitle)&limit=1`;
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
    return data.length > 0 ? data[0] : undefined;
  } catch (error: any) {
    console.error('Get job by ID API error:', error);
    throw new Error(error.message || "An unexpected error occurred while fetching the job.");
  }
}


export async function verifyPincodeAction(pincode: string): Promise<{ serviceable: boolean; city?: string; error?: string }> {
    if (!pincode || pincode.length !== 6) {
        return { serviceable: false, error: "Invalid pincode." };
    }

    try {
        // 1. Fetch district from pincode
        const pincodeRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        if (!pincodeRes.ok) {
            throw new Error("Could not verify pincode. Please try again.");
        }
        const pincodeData = await pincodeRes.json();
        
        if (pincodeData[0].Status !== "Success") {
            throw new Error("Invalid pincode.");
        }
        
        const district = pincodeData[0].PostOffice[0].District;
        
        if (!district) {
            throw new Error("Could not determine city from pincode.");
        }

        // 2. Check if district is in serviceable_cities
        const supabaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/serviceable_cities?city_name=eq.${encodeURIComponent(district)}&select=city_name`;
        const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

        if (!supabaseUrl || !apikey) {
            throw new Error("Server configuration error.");
        }

        const serviceableRes = await fetch(supabaseUrl, {
            headers: { 'apikey': apikey, 'Authorization': `Bearer ${apikey}` },
        });

        if (!serviceableRes.ok) {
            throw new Error("Failed to check serviceability.");
        }

        const serviceableData = await serviceableRes.json();

        if (serviceableData.length > 0) {
            return { serviceable: true, city: district };
        } else {
            return { serviceable: false, error: `Sorry, we are not currently serving in ${district}.` };
        }

    } catch (error: any) {
        return { serviceable: false, error: error.message || "An unexpected error occurred." };
    }
}

export async function getTechnicianStatsAction(technicianId: string) {
  if (!technicianId) {
    throw new Error("Technician ID is required.");
  }
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/technician_stats?technician_id=eq.${technicianId}&select=*`;
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
    console.log("the job",data)

    if (data && data.length > 0) {
      return data[0]; // Return the first object in the array
    }
    
    return null; // Return null if no stats found
  } catch (error: any) {
    console.error('Get technician stats API error:', error);
    throw new Error(error.message || "An unexpected error occurred while fetching technician stats.");
  }
}

export type TechnicianStats = {
  id: string;
  technician_id: string;
  total_jobs_completed: number;
  total_jobs_assigned: number;
  total_jobs_cancelled: number;
  today_earnings: number;
  lifetime_earnings: number;
  average_rating: number;
  total_ratings: number;
  service_area?: string;
  created_at?: string;
  updated_at?: string;
  other_skills?: string[];
};

export async function getTechnicianStats(technicianId: string): Promise<TechnicianStats | null> {
  if (!technicianId) {
    throw new Error("Technician ID is required.");
  }
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/technician_stats?technician_id=eq.${technicianId}`;
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
   
    if (data && data.length > 0) {
      return data[0];
    }
    return null;
  } catch (error: any) {
    console.error('Get technician stats API error:', error);
    return null;
  }
}

export async function getIssuesForCategoryAction(categoryId: string) {
    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/issues?category_id=eq.${categoryId}&is_active=eq.true&select=id,title,estimated_price`;
    const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !apikey) {
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
        console.error('Get issues API error:', error);
        throw new Error(error.message || "An unexpected error occurred while fetching issues.");
    }
}
    
export async function sendCompletionCodeAction(bookingId: string) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-completion-code`;
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !apikey) {
    throw new Error("Server configuration error.");
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey,
        'Authorization': `Bearer ${apikey}`,
      },
      body: JSON.stringify({ booking_id: bookingId }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `API Error: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error: any) {
    console.error("sendCompletionCodeAction error:", error);
    throw new Error(error.message);
  }
}

type VerifyCodePayload = {
  booking_id: string;
  code: string;
  technician_id: string;
  earning_amount: number;
}

export async function verifyCompletionCodeAction(payload: VerifyCodePayload) {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/verify-completion-code`;
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
   if (!url || !apikey) {
    throw new Error("Server configuration error.");
  }

  try {
     const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey,
        'Authorization': `Bearer ${apikey}`,
      },
      body: JSON.stringify({
        booking_id: payload.booking_id,
        secret_code: payload.code,
        technician_id: payload.technician_id,
        earning_amount: payload.earning_amount,
      }),
    });
     if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Invalid verification code.");
    }

    const data = await response.json();
    if(data.success) {
      return { success: true };
    }
    throw new Error(data.error || "Verification failed.");

  } catch(e: any) {
    console.error("verifyCompletionCodeAction error", e);
    throw new Error(e.message);
  }
}


type VerifyPaymentPayload = {
  booking_id: string;
  payment_method: 'cash' | 'upi';
  final_amount_paid: number;
}

export async function verifyPaymentAction(payload: VerifyPaymentPayload) {
  const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (!supabaseUrl || !apikey) {
    throw new Error("Server configuration error.");
  }

  try {
    // Step 1: Verify the payment
    const verifyPaymentUrl = `${supabaseUrl}/functions/v1/verify-payment`;
    const verifyResponse = await fetch(verifyPaymentUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey,
        'Authorization': `Bearer ${apikey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!verifyResponse.ok) {
      const errorData = await verifyResponse.json();
      throw new Error(errorData.error || "Could not verify payment.");
    }
    
    const verifyData = await verifyResponse.json();
    if (!verifyData.success) {
      throw new Error(verifyData.error || "Payment verification failed.");
    }

    // Step 2: Complete the booking
    const completeBookingUrl = `${supabaseUrl}/functions/v1/complete-booking`;
    const completeResponse = await fetch(completeBookingUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apikey,
        'Authorization': `Bearer ${apikey}`,
      },
      body: JSON.stringify({ booking_id: payload.booking_id }),
    });

    if (!completeResponse.ok) {
      const errorData = await completeResponse.json();
      // Even if this fails, the payment was verified. We might want to log this differently.
      console.error("Failed to complete booking after payment verification:", errorData.error);
      // We can still return success as payment was the primary goal here.
    }
    
    return { success: true };

  } catch (e: any) {
    console.error("verifyPaymentAction error", e);
    throw new Error(e.message);
  }
}
    

    

