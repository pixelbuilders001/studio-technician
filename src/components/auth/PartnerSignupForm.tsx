
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
} from "@/components/ui/form";
import { Loader2, PartyPopper, X } from "lucide-react";
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
import { Badge } from "../ui/badge";

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
  other_skills: z.array(z.string()).max(2, "You can select up to 2 other skills.").optional(),
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
      other_skills: [],
      total_experience: 0,
    },
  });

  const watchPrimarySkill = form.watch("primary_skill");
  const watchOtherSkills = form.watch("other_skills") || [];

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    
    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'other_skills' && Array.isArray(value)) {
            formData.append(key, JSON.stringify(value));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    formData.append('pincode', pincode);
    formData.append('service_area', city);


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

  const handleOtherSkillSelect = (skillId: string) => {
    const currentSkills = form.getValues("other_skills") || [];
    if (currentSkills.length < 2 && !currentSkills.includes(skillId) && skillId !== watchPrimarySkill) {
      form.setValue("other_skills", [...currentSkills, skillId]);
    }
  };

  const handleRemoveOtherSkill = (skillId: string) => {
    const currentSkills = form.getValues("other_skills") || [];
    form.setValue("other_skills", currentSkills.filter(s => s !== skillId));
  };


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
         <FormField
          control={form.control}
          name="primary_skill"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Skill</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select your main service category" />
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
            name="other_skills"
            render={() => (
                <FormItem>
                    <FormLabel>Other Skills (up to 2)</FormLabel>
                    <Select onValueChange={handleOtherSkillSelect} value="">
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select other skills" />
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {serviceCategories
                                .filter(cat => cat.id !== watchPrimarySkill && !watchOtherSkills.includes(cat.id))
                                .map(cat => (
                                    <SelectItem key={cat.id} value={cat.id} disabled={watchOtherSkills.length >= 2}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                        </SelectContent>
                    </Select>
                    <div className="flex flex-wrap gap-2 pt-2">
                        {watchOtherSkills.map(skillId => {
                            const skill = serviceCategories.find(s => s.id === skillId);
                            return (
                                <Badge key={skillId} variant="secondary" className="flex items-center gap-1">
                                    {skill?.label}
                                    <button type="button" onClick={() => handleRemoveOtherSkill(skillId)} className="rounded-full hover:bg-muted-foreground/20">
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            );
                        })}
                    </div>
                    <FormMessage />
                </FormItem>
            )}
        />
         <FormField
          control={form.control}
          name="total_experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total Experience (in years)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="e.g., 5" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="aadhaar_front"
            render={({ field: { onChange, onBlur, name } }) => (
                <FormItem>
                    <FormLabel>Aadhaar Card (Front)</FormLabel>
                    <FormControl>
                        <Input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files?.[0])}
                            onBlur={onBlur}
                            name={name}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="aadhaar_back"
            render={({ field: { onChange, onBlur, name } }) => (
                <FormItem>
                    <FormLabel>Aadhaar Card (Back)</FormLabel>
                    <FormControl>
                        <Input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files?.[0])}
                            onBlur={onBlur}
                            name={name}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
        <FormField
            control={form.control}
            name="selfie"
            render={({ field: { onChange, onBlur, name } }) => (
                <FormItem>
                    <FormLabel>Your Selfie</FormLabel>
                    <FormControl>
                        <Input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => onChange(e.target.files?.[0])}
                            onBlur={onBlur}
                            name={name}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />

        <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? t('partner_signup_form.submitting') : t('partner_signup_form.submit_application')}
        </Button>
      </form>
    </Form>
  );
}

    