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

const formSchema = z.object({
  mobile: z.string().min(10, { message: "Enter a valid 10-digit mobile number." }).max(10),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log("Sending OTP to:", values.mobile);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      // In a real app, you'd handle OTP input here.
      // For this demo, we'll just go to jobs page after a delay.
      setTimeout(() => router.push("/jobs"), 1500);
    }, 1000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="mobile"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className={cn(
                    "flex items-center gap-0 rounded-lg border bg-white overflow-hidden transition-all",
                    form.formState.errors.mobile ? "border-destructive ring-2 ring-destructive/50" : "focus-within:ring-2 focus-within:ring-ring",
                    isSuccess && "border-green-500 ring-2 ring-green-500/50"
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
                    {isSuccess && <CheckCircle className="h-6 w-6 text-green-500 mx-3" />}
                </div>
              </FormControl>
               <FormMessage className="text-left" />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full text-lg py-6 h-12" disabled={isLoading || isSuccess}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? t('login_form.sending') : t('login_form.send_otp')}
        </Button>
      </form>
    </Form>
  );
}
