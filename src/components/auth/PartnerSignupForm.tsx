"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Alert, AlertTitle, AlertDescription } from "../ui/alert";

const serviceCategories = [
    { id: "tv", labelKey: "devices.television" },
    { id: "washing_machine", labelKey: "devices.washing_machine" },
    { id: "refrigerator", labelKey: "devices.refrigerator" },
    { id: "air_conditioner", labelKey: "devices.air_conditioner" },
    { id: "smartphone", labelKey: "devices.smartphone" },
] as const;

const formSchema = z.object({
  fullName: z.string().min(2, { message: "Please enter your full name." }),
  mobile: z.string().min(10, { message: "Enter a valid 10-digit mobile number." }).max(10),
  serviceArea: z.string().min(3, { message: "Please enter your service area." }),
  serviceCategories: z.array(z.string()).refine(value => value.some(item => item), {
      message: "You have to select at least one service category.",
  })
});

export function PartnerSignupForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      mobile: "",
      serviceArea: "",
      serviceCategories: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("Partner Signup Details:", values);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
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
          name="fullName"
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
          name="serviceArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('partner_signup_form.service_area')}</FormLabel>
              <FormControl>
                <Input placeholder={t('partner_signup_form.service_area_placeholder')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
            control={form.control}
            name="serviceCategories"
            render={() => (
                <FormItem>
                    <div className="mb-4">
                        <FormLabel>{t('profile_page.service_categories')}</FormLabel>
                        <FormDescription>
                           {t('partner_signup_form.service_categories_description')}
                        </FormDescription>
                    </div>
                    {serviceCategories.map((item) => (
                        <FormField
                            key={item.id}
                            control={form.control}
                            name="serviceCategories"
                            render={({ field }) => {
                                return (
                                <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                    <FormControl>
                                    <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                        return checked
                                            ? field.onChange([...field.value, item.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                (value) => value !== item.id
                                                )
                                            )
                                        }}
                                    />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                        {t(item.labelKey)}
                                    </FormLabel>
                                </FormItem>
                                )
                            }}
                        />
                    ))}
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
