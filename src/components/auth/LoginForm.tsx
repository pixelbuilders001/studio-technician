
"use client";

import { useState } from "react";
import Image from "next/image";
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
  FormMessage,
} from "@/components/ui/form";
import { Loader2, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { cn } from "@/lib/utils";
import { OtpInput, type OtpInputProps } from "./OtpInput";

const mobileSchema = z.object({
  mobile: z.string().min(10, { message: "Enter a valid 10-digit mobile number." }).max(10),
});

const otpSchema = z.object({
    otp: z.string().min(6, { message: "OTP must be 6 digits."}),
});

type Step = 'mobile' | 'otp';

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [step, setStep] = useState<Step>('mobile');
  const [mobileNumber, setMobileNumber] = useState("");
  const { t } = useTranslation();

  const mobileForm = useForm<z.infer<typeof mobileSchema>>({
    resolver: zodResolver(mobileSchema),
    defaultValues: {
      mobile: "",
    },
  });

  const otpForm = useForm<z.infer<typeof otpSchema>>({
      resolver: zodResolver(otpSchema),
      defaultValues: {
          otp: "",
      }
  })

  function onMobileSubmit(values: z.infer<typeof mobileSchema>) {
    setIsLoading(true);
    console.log("Sending OTP to:", values.mobile);
    setTimeout(() => {
      setIsLoading(false);
      setMobileNumber(values.mobile);
      setStep('otp');
    }, 1000);
  }

  function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    setIsLoading(true);
    console.log("Verifying OTP:", values.otp);
    setTimeout(() => {
        setIsLoading(false);
        // Dummy OTP validation
        if (values.otp === "123456") {
            setIsSuccess(true);
            setTimeout(() => router.push('/jobs'), 1500);
        } else {
            otpForm.setError("otp", { type: "manual", message: "Invalid OTP. Please try again."})
        }
    }, 1000)
  }

  if (step === 'otp') {
      return (
          <div className="flex flex-col items-center text-center">
            <Image 
                src="https://dv09dhgcrv5ld6ct.public.blob.vercel-storage.com/Gemini_Generated_Image_lo7g9dlo7g9dlo7g.png"
                alt="OTP Verification"
                width={200}
                height={200}
                className="w-48 h-48 mx-auto"
            />
            <h2 className="text-xl font-bold mt-4">{t('login_form.verify_otp_title')}</h2>
            <p className="text-muted-foreground mt-2">{t('login_form.verify_otp_subtitle', `+91 ${mobileNumber}`)}</p>
            <Form {...otpForm}>
                <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-6 mt-8 w-full">
                    <FormField
                        control={otpForm.control}
                        name="otp"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                   <OtpInput {...field} length={6} onChange={field.onChange} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full text-lg py-6 h-12" disabled={isLoading || isSuccess}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isSuccess ? <CheckCircle className="mr-2 h-5 w-5" /> : null }
                        {isLoading ? t('login_form.verifying') : t('login_form.verify_otp_button')}
                    </Button>
                </form>
            </Form>
            <Button variant="link" onClick={() => setStep('mobile')} className="mt-4">{t('login_form.wrong_number')}</Button>
          </div>
      )
  }

  return (
    <Form {...mobileForm}>
      <form onSubmit={mobileForm.handleSubmit(onMobileSubmit)} className="space-y-4">
        <FormField
          control={mobileForm.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className={cn(
                    "flex items-center gap-0 rounded-lg border bg-white overflow-hidden transition-all",
                    mobileForm.formState.errors.mobile ? "border-destructive ring-2 ring-destructive/50" : "focus-within:ring-2 focus-within:ring-ring"
                    )}>
                    <Select defaultValue="+91">
                        <SelectTrigger className="w-auto h-12 border-0 focus:ring-0 focus:ring-offset-0 text-base">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="+91">+91</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="relative w-full">
                        <Input 
                            placeholder="000 000 0000" 
                            {...field} 
                            type="tel"
                            className="border-0 text-base h-12 focus-visible:ring-0 focus-visible:ring-offset-0"
                            maxLength={10}
                        />
                    </div>
                </div>
              </FormControl>
               <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg py-6 h-12" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? t('login_form.sending') : t('login_form.send_otp')}
        </Button>
      </form>
    </Form>
  );
}
