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

import { Loader2, Mail, Lock } from "lucide-react";

import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { FullPageLoader } from "@/components/ui/FullPageLoader";
// import { useFcm } from "@/hooks/useFcm";

const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();


  const [isLoading, setIsLoading] = useState(false);

  const errorParam = searchParams.get("error");

  useEffect(() => {
    if (errorParam === "access_denied") {
      toast({
        variant: "destructive",
        title: "Access Denied",
        description:
          "Invalid email or password" ||
          "You are not allowed to access this account",
      });

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

  // const { requestPermission } = useFcm(undefined);

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);



    const supabase = createClient();

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });

      if (error) throw error;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not found");
      }

      const { data: profile, error: roleError } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (roleError || !profile) {
        throw new Error("Unable to fetch user role");
      }

      if (profile.role !== "technician") {
        await supabase.auth.signOut();

        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "You are not allowed to login here",
        });

        return;
      }

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      const next = searchParams.get("next");
      if (next) {
        router.push(next);
      } else {
        router.push("/auth/callback");
      }
    } catch (error: any) {
      console.error("Login error:", error);

      let message = "Login failed";

      if (error.message?.includes("Email not confirmed")) {
        message = "Email not confirmed. Please check your inbox.";
      } else if (error.message?.includes("Invalid login credentials")) {
        message = "Invalid email or password";
      }

      toast({
        variant: "destructive",
        title: "Login Failed",
        description: message,
      });
      setIsLoading(false);
    } finally {
      // We don't set isLoading to false here on success because we want the loader 
      // to persist until the next page (auth/callback or jobs) loads.
      // If there was an error, it will be caught and we can reset there.
    }
  }

  return (
    <>
      {isLoading && (
        <FullPageLoader
          text="Verifying Your Details..."
          subtext="Please wait while we secure your session"
        />
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">
                  Email Address
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="email"
                      placeholder="tech@example.com"
                      className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-primary rounded-lg"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-slate-700">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      type="password"
                      placeholder="******"
                      className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-primary rounded-lg"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90 rounded-xl"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>

          <div className="text-center pt-2">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="font-semibold text-primary hover:underline"
              >
                Sign up now
              </button>
            </p>
          </div>
        </form>
      </Form>
    </>
  );
}
