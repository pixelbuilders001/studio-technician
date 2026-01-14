"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function LoginForm({ }) {
  const router = useRouter();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);
  const errorParam = searchParams.get('error');

  // Show error from query params if redirect back from auth
  if (errorParam === 'verification_failed') {
    // One time toast? or just let user see it.
    // Better to handle in useEffect but this is simple for now.
  }

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    const supabase = createClient();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,

      });

      if (error) {
        throw error;
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      router.push('/jobs');

    } catch (error: any) {
      console.error("Login error:", error);
      let message = t('login_form.login_error');

      if (error.message.includes("Email not confirmed")) {
        message = t('login_form.email_not_confirmed');
      } else if (error.message.includes("Invalid login credentials")) {
        message = t('login_form.invalid_credentials');
      }

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: message,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('login_form.email_label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('login_form.email_placeholder')} {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('login_form.password_label')}</FormLabel>
              <FormControl>
                <Input placeholder={t('login_form.password_placeholder')} {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? t('login_form.logging_in') : t('login_form.submit_button')}
        </Button>

        <div className="text-center pt-2">
          <Button variant="link" type="button" onClick={() => router.push('/signup')}>
            {t('login_form.dont_have_account')}
          </Button>
        </div>
      </form>
    </Form>
  );
}
