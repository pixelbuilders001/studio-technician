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
import { Loader2 } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

const formSchema = z.object({
  mobile: z.string().min(10, { message: "Enter a valid 10-digit mobile number." }).max(10),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mobile: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    // Mock OTP sending and verification
    console.log("Sending OTP to:", values.mobile);
    setTimeout(() => {
      // In a real app, you'd navigate after OTP verification
      router.push("/jobs");
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
                <div className="flex gap-0 items-center">
                    <Select defaultValue="+91">
                        <SelectTrigger className="w-auto rounded-r-none focus:ring-0 focus:ring-offset-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="+91">+91</SelectItem>
                        </SelectContent>
                    </Select>
                    <div className="relative w-full">
                        <Input 
                            placeholder="991 98765 43210" 
                            {...field} 
                            type="tel"
                            className="rounded-l-none text-base h-12"
                            maxLength={10}
                        />
                         <FormMessage className="absolute -bottom-5 left-0 text-xs" />
                    </div>
                </div>
              </FormControl>
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
