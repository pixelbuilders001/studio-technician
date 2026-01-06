
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Loader2, PartyPopper } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";

const serviceCategories = [
    { id: "tv_repair", label: "TV Repair" },
    { id: "washing_machine_repair", label: "Washing Machine Repair" },
    { id: "refrigerator_repair", label: "Refrigerator Repair" },
    { id: "ac_repair", label: "AC Repair" },
    { id: "smartphone_repair", label: "Smartphone Repair" },
    { id: "plumber", label: "Plumber" },
    { id: "electrician", label: "Electrician" },
] as const;

const formSchema = z.object({
  full_name: z.string().min(2, { message: "Please enter your full name." }),
  mobile: z.string().min(10, { message: "Enter a valid 10-digit mobile number." }).max(10),
  aadhaar_number: z.string().length(12, { message: "Aadhaar number must be 12 digits."}),
  current_address: z.string().min(10, { message: "Please enter your full address." }),
  primary_skill: z.string().min(1, { message: "Please select your primary skill."}),
  total_experience: z.coerce.number().min(0, "Experience can't be negative.").max(50, "Experience seems too high."),
  aadhaar_front: z.any().refine(file => file instanceof File, "Aadhaar front photo is required."),
  aadhaar_back: z.any().refine(file => file instanceof File, "Aadhaar back photo is required."),
  selfie: z.any().refine(file => file instanceof File, "A selfie is required."),
});

type PartnerSignupFormProps = {
  pincode: string;
  city: string;
}

export function PartnerSignupForm({ pincode, city }: PartnerSignupFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      full_name: "",
      mobile: "",
      aadhaar_number: "",
      current_address: "",
      primary_skill: "",
      total_experience: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    formData.append('pincode', pincode);
    formData.append('city', city);


    const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-technician`;
    const apikey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !apikey) {
      toast({
        variant: "destructive",
        title: "Configuration Error",
        description: "API URL or key is missing.",
      });
      setIsLoading(false);
      return;
    }

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': apikey,
            },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
        }

      setIsSubmitted(true);
    } catch (error: any) {
        let title = "Submission Failed";
        let description = error.message || "An unexpected error occurred.";

        if (error.message.includes("technicians_mobile_key")) {
            description = "This mobile number is already registered.";
            form.setError("mobile", { type: "manual", message: description });
        } else if (error.message.includes("technicians_aadhaar_number_key")) {
            description = "This Aadhaar number is already registered.";
            form.setError("aadhaar_number", { type: "manual", message: description });
        }
        
        toast({
            variant: "destructive",
            title: title,
            description: description,
        });
    } finally {
        setIsLoading(false);
    }
  }

  if (isSubmitted) {
      return (
          <div className="flex flex-col items-center justify-center text-center space-y-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <PartyPopper className="h-12 w-12 text-green-600" />
              <h2 className="text-2xl font-bold font-headline text-green-900">{t('partner_signup_form.submitted_title')}</h2>
              <p className="text-green-800">{t('partner_signup_form.submitted_message')}</p>
              <Button onClick={() => router.push('/')} className="w-full">
                  {t('partner_signup_form.back_to_login')}
              </Button>
          </div>
      )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="full_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('partner_signup_form.full_name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('partner_signup_form.full_name_placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('login_form.mobile_number')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                    +91
                  </span>
                  <Input 
                    placeholder="98765 43210" 
                    {...field} 
                    type="tel"
                    className="pl-10"
                    maxLength={10}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="aadhaar_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('partner_signup_form.aadhar_number')}</FormLabel>
              <FormControl>
                <Input placeholder="1234 5678 9012" {...field} maxLength={12} type="number"/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="current_address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Address</FormLabel>
              <FormControl>
                <Textarea placeholder="Enter your full current address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="primary_skill"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Primary Skill</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select skill" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {serviceCategories.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="total_experience"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Experience (Yrs)</FormLabel>
                        <FormControl>
                            <Input type="number" placeholder="e.g., 5" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>

        <FormField
          control={form.control}
          name="aadhaar_front"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <FormItem>
              <FormLabel>{t('partner_signup_form.aadhar_front')}</FormLabel>
              <FormControl>
                <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files?.[0])}
                    onBlur={onBlur}
                    name={name}
                    ref={ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aadhaar_back"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <FormItem>
              <FormLabel>{t('partner_signup_form.aadhar_back')}</FormLabel>
              <FormControl>
                <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files?.[0])}
                    onBlur={onBlur}
                    name={name}
                    ref={ref}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="selfie"
          render={({ field: { onChange, onBlur, name, ref } }) => (
            <FormItem>
              <FormLabel>Selfie</FormLabel>
               <FormDescription>Please upload a clear photo of yourself.</FormDescription>
              <FormControl>
                <Input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => onChange(e.target.files?.[0])}
                    onBlur={onBlur}
                    name={name}
                    ref={ref}
                 />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full text-lg py-6" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? t('partner_signup_form.submitting') : t('partner_signup_form.submit_application')}
        </Button>
      </form>
    </Form>
  );
}

    

    
