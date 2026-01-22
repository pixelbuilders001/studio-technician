"use client";

import { useState, useEffect } from "react";
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
import { FullPageLoader } from "@/components/ui/FullPageLoader";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState(false);

  const errorParam = searchParams.get("error");

  /**
   * ✅ Handle access_denied ONLY ONCE when page loads
   * No refs, no loops, no stale state
   */
  useEffect(() => {
    if (errorParam === "access_denied") {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description:
          t("login_form.invalid_credentials") ||
          "You are not allowed to access this account",
      });

      // Clean URL safely (App Router way)
      router.replace("/login", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      /** 1️⃣ Sign in */
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      /** 2️⃣ Get logged-in user */
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not found");
      }

      /** 3️⃣ Fetch role */
      const { data: profile, error: roleError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (roleError || !profile) {
        throw new Error("Unable to fetch user role");
      }

      /** 4️⃣ Role-based access */
      if (profile.role !== "technician") {
        await supabase.auth.signOut();

        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You are not allowed to login here",
        });

        return;
      }

      /** 5️⃣ Success */
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      router.push("/auth/callback");
    } catch (error: any) {
      console.error("Login error:", error);

      let message = t("login_form.login_error");

      if (error.message?.includes("Email not confirmed")) {
        message = t("login_form.email_not_confirmed");
      } else if (error.message?.includes("Invalid login credentials")) {
        message = t("login_form.invalid_credentials");
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
    <>
      {isLoading && <FullPageLoader />}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("login_form.email_label")}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("login_form.email_placeholder")}
                    {...field}
                  />
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
                <FormLabel>{t("login_form.password_label")}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("login_form.password_placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 text-lg"
            disabled={isLoading}
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading
              ? t("login_form.logging_in")
              : t("login_form.submit_button")}
          </Button>

          <div className="text-center pt-2">
            <Button
              variant="link"
              type="button"
              onClick={() => router.push("/signup")}
            >
              {t("login_form.dont_have_account")}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
