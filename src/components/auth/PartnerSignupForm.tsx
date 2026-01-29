"use client";

import { useState, useEffect } from "react";
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
import { Loader2, PartyPopper, X, ChevronRight, ChevronLeft, Upload, CheckCircle2, User, Briefcase, FileText } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase/client";
import { FullPageLoader } from "@/components/ui/FullPageLoader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
// import { useFcm } from "@/hooks/useFcm";



const formSchema = z.object({
  full_name: z.string().min(2, { message: "Please enter your full name." }),
  mobile: z.string().min(10, { message: "Enter a valid 10-digit mobile number." }).max(10),
  aadhaar_number: z.string().length(12, { message: "Aadhaar number must be 12 digits." }),
  current_address: z.string().min(10, { message: "Please enter your full address." }),
  primary_skill: z.string().min(1, { message: "Please select your primary skill." }),
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
  const [categories, setCategories] = useState<any[]>([]);


  useEffect(() => {
    async function fetchCategories() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("categories")
        .select("*, issues(*)")
        .order("sort_order", { ascending: true })
        .eq("issues.is_active", true);

      if (error) {
        console.error("Error fetching categories:", error);
        return;
      }

      setCategories(data || []);
    }

    fetchCategories();
  }, []);

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

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
    mode: "onChange",
  });

  const watchPrimarySkill = form.watch("primary_skill");
  const watchOtherSkills = form.watch("other_skills") || [];

  // Watch file inputs for custom UI feedback
  const watchAadhaarFront = form.watch("aadhaar_front");
  const watchAadhaarBack = form.watch("aadhaar_back");
  const watchSelfie = form.watch("selfie");

  // const { requestPermission } = useFcm(undefined);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // Request notification permission immediately on user gesture
    // if (typeof window !== "undefined") {
    //   requestPermission().catch(console.error);
    // }

    const formData = new FormData();
    Object.entries(values).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        if (key === 'primary_skill') {
          // values.primary_skill is ID, but we want to send the Name in this key
          const category = categories.find(c => c.id === value);
          formData.append(key, category ? category.name : String(value));
        } else if (key === 'other_skills' && Array.isArray(value)) {
          // values.other_skills are IDs, but we want to send an array of Names in this key
          const names = value.map(id => {
            const cat = categories.find(c => c.id === id);
            return cat ? cat.name : String(id);
          });
          formData.append(key, JSON.stringify(names));
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    // Construct category_ids array
    const categoryIds = [];

    // Add primary skill
    const primaryCategory = categories.find(cat => cat.id === values.primary_skill);
    if (primaryCategory) {
      categoryIds.push({
        category_id: primaryCategory.id,
        name: primaryCategory.name,
        slug: primaryCategory.slug,
        is_primary: true,
        experience_years: values.total_experience
      });
    }

    // Add other skills
    if (values.other_skills && Array.isArray(values.other_skills)) {
      values.other_skills.forEach(skillId => {
        const cat = categories.find(c => c.id === skillId);
        if (cat) {
          categoryIds.push({
            category_id: cat.id,
            name: cat.name,
            slug: cat.slug,
            is_primary: false,
            experience_years: values.total_experience
          });
        }
      });
    }

    formData.append('category_ids', JSON.stringify(categoryIds));
    formData.append('pincode', pincode);
    formData.append('service_area', city);

    // --- PAYLOAD INSPECTION ---
    console.log("=== FINAL PAYLOAD LOG ===");
    const payloadObject: Record<string, any> = {};
    formData.forEach((value, key) => {
      if (value instanceof File) {
        payloadObject[key] = `File: ${value.name}`;
      } else {
        try {
          payloadObject[key] = JSON.parse(value as string);
        } catch {
          payloadObject[key] = value;
        }
      }
    });
    // console.table(payloadObject);
    // console.log("Category IDs Structure:", JSON.parse(formData.get('category_ids') as string));
    // --------------------------


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
      const supabase = createClient();
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error("You must be logged in to submit this form.");
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'apikey': apikey,
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`);
      }

      setIsSubmitted(true);
      router.push('/partner/waiting-approval');
    } catch (error: any) {
      let title = "Submission Failed";
      let description = error.message || "An unexpected error occurred.";

      if (error.message.includes("technicians_mobile_key")) {
        description = "This mobile number is already registered.";
        form.setError("mobile", { type: "manual", message: description });
        // Jump back to step 1 if error is there
        setCurrentStep(1);
      } else if (error.message.includes("technicians_aadhaar_number_key")) {
        description = "This Aadhaar number is already registered.";
        form.setError("aadhaar_number", { type: "manual", message: description });
        setCurrentStep(1);
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

  const nextStep = async () => {
    let fieldsToValidate: (keyof z.infer<typeof formSchema>)[] = [];
    if (currentStep === 1) {
      fieldsToValidate = ["full_name", "mobile", "aadhaar_number"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["primary_skill", "total_experience", "current_address"];
    }

    const isValid = await form.trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const steps = [
    { id: 1, label: "Identity", icon: User },
    { id: 2, label: "Profile", icon: Briefcase },
    { id: 3, label: "Documents", icon: FileText },
  ];

  return (
    <div className="w-full max-w-lg mx-auto">
      {isLoading && currentStep === totalSteps && (
        <FullPageLoader
          text="Submitting Application..."
          subtext="Please wait while we process your details"
        />
      )}
      {/* Progress Stepper */}
      <div className="mb-8 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 rounded-full -z-10" />
        <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full -z-10 transition-all duration-300"
          style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }} />

        <div className="flex justify-between items-center w-full">
          {steps.map((step) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex flex-col items-center gap-2 bg-background p-2 rounded-xl">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                  (isActive || isCompleted) ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20" : "border-muted-foreground/30 bg-background text-muted-foreground"
                )}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </div>
                <span className={cn(
                  "text-xs font-semibold transition-colors duration-300",
                  (isActive || isCompleted) ? "text-primary" : "text-muted-foreground"
                )}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
                <CardContent className="pt-6 space-y-5">

                  {/* Step 1: Personal Identity */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="full_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input className="bg-white/80 h-12" placeholder="e.g., Ramesh Kumar" {...field} />
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
                            <FormLabel>Mobile Number</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                                  +91
                                </span>
                                <Input
                                  placeholder="98765 43210"
                                  {...field}
                                  type="tel"
                                  className="pl-10 bg-white/80 h-12"
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
                            <FormLabel>Aadhar Number</FormLabel>
                            <FormControl>
                              <Input className="bg-white/80 h-12" placeholder="1234 5678 9012" {...field} maxLength={12} type="number" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 2: Professional Details */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="primary_skill"
                          render={({ field }) => (
                            <FormItem className="col-span-2">
                              <FormLabel>Primary Skill</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/80 h-12">
                                    <SelectValue placeholder="Select service" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {categories.map(cat => (
                                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
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
                            <FormItem className="col-span-2">
                              <FormLabel>Experience (Years)</FormLabel>
                              <FormControl>
                                <Input type="number" className="bg-white/80 h-12" placeholder="e.g., 5" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="other_skills"
                        render={() => (
                          <FormItem>
                            <FormLabel>Other Skills (Optional)</FormLabel>
                            <Select onValueChange={handleOtherSkillSelect} value="">
                              <FormControl>
                                <SelectTrigger className="bg-white/80 h-12">
                                  <SelectValue placeholder="Select up to 2" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories
                                  .filter(cat => cat.id !== watchPrimarySkill && !watchOtherSkills.includes(cat.id))
                                  .map(cat => (
                                    <SelectItem key={cat.id} value={cat.id} disabled={watchOtherSkills.length >= 2}>
                                      {cat.name}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>

                            {watchOtherSkills.length > 0 && (
                              <div className="flex flex-wrap gap-2 pt-2">
                                {watchOtherSkills.map(skillId => {
                                  const skill = categories.find(s => s.id === skillId);
                                  return (
                                    <Badge key={skillId} variant="secondary" className="flex items-center gap-1 pl-2 pr-1 py-1 text-sm font-normal bg-primary/10 text-primary border-primary/20">
                                      {skill?.name}
                                      <button type="button" onClick={() => handleRemoveOtherSkill(skillId)} className="rounded-full p-0.5 hover:bg-primary/20 transition-colors">
                                        <X className="h-3 w-3" />
                                      </button>
                                    </Badge>
                                  );
                                })}
                              </div>
                            )}
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
                              <Textarea className="bg-white/80 min-h-[100px] resize-none" placeholder="Enter full address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {/* Step 3: Documents */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="aadhaar_front"
                          render={({ field: { onChange, onBlur, name } }) => (
                            <FormItem className="col-span-1">
                              <FormLabel className="text-xs">Aadhaar Front</FormLabel>
                              <FormControl>
                                <div className={cn(
                                  "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 aspect-square",
                                  watchAadhaarFront ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                                )}
                                  onClick={() => document.getElementById('aadhaar_front_input')?.click()}
                                >
                                  {watchAadhaarFront ? (
                                    <>
                                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                                      <span className="text-xs font-medium truncate max-w-full px-2 text-green-700">Added</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-8 h-8 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">Upload</span>
                                    </>
                                  )}
                                  <Input
                                    id="aadhaar_front_input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => onChange(e.target.files?.[0])}
                                    onBlur={onBlur}
                                    name={name}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="aadhaar_back"
                          render={({ field: { onChange, onBlur, name } }) => (
                            <FormItem className="col-span-1">
                              <FormLabel className="text-xs">Aadhaar Back</FormLabel>
                              <FormControl>
                                <div className={cn(
                                  "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-2 aspect-square",
                                  watchAadhaarBack ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                                )}
                                  onClick={() => document.getElementById('aadhaar_back_input')?.click()}
                                >
                                  {watchAadhaarBack ? (
                                    <>
                                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                                      <span className="text-xs font-medium truncate max-w-full px-2 text-green-700">Added</span>
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="w-8 h-8 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">Upload</span>
                                    </>
                                  )}
                                  <Input
                                    id="aadhaar_back_input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => onChange(e.target.files?.[0])}
                                    onBlur={onBlur}
                                    name={name}
                                  />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="selfie"
                        render={({ field: { onChange, onBlur, name } }) => (
                          <FormItem>
                            <FormLabel>Your Selfie</FormLabel>
                            <FormControl>
                              <div className={cn(
                                "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors flex flex-col items-center justify-center gap-3",
                                watchSelfie ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                              )}
                                onClick={() => document.getElementById('selfie_input')?.click()}
                              >
                                {watchSelfie ? (
                                  <>
                                    <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                      <CheckCircle2 className="w-8 h-8 text-green-600" />
                                    </div>
                                    <span className="font-medium text-green-700">Selfie Uploaded!</span>
                                  </>
                                ) : (
                                  <>
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                      <User className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <div className="space-y-1">
                                      <span className="font-medium text-primary">Click to upload selfie</span>
                                      <p className="text-xs text-muted-foreground">Clear lighting, face valid</p>
                                    </div>
                                  </>
                                )}
                                <Input
                                  id="selfie_input"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => onChange(e.target.files?.[0])}
                                  onBlur={onBlur}
                                  name={name}
                                />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-4 pt-4">
            {currentStep > 1 && (
              <Button type="button" variant="outline" onClick={prevStep} className="flex-1 h-12 text-base" disabled={isLoading}>
                <ChevronLeft className="mr-1 h-4 w-4" /> Back
              </Button>
            )}

            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep} className="flex-1 h-12 text-base font-semibold shadow-xl shadow-primary/20">
                Next Step <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" className="flex-1 h-12 text-base font-bold shadow-xl shadow-primary/20" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Submitting..." : "Submit Application"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
