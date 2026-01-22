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
import { Loader2, MailCheck, Mail, Lock, CheckCircle } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { createClient } from "@/lib/supabase/client";
import { toast } from "@/hooks/use-toast";

const signUpSchema = z
    .object({
        email: z.string().email({ message: "Invalid email address" }),
        password: z.string().min(6, { message: "Password must be at least 6 characters" }),
        confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    });

export function SignUpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { t } = useTranslation();
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [emailSentTo, setEmailSentTo] = useState("");

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof signUpSchema>) {
        setIsLoading(true);
        const supabase = createClient();

        try {
            // 🔁 Where technician should land after auth
            const redirectPath =
                searchParams.get("redirect") || "/jobs";

            const { data, error } = await supabase.auth.signUp({
                email: values.email,
                password: values.password,
                options: {
                    emailRedirectTo: `${window.location.origin}/auth/callback`,
                    data: {
                        intended_role: "technician",
                    },
                },
            });

            if (error) throw error;

            if (data.user && data.user.identities?.length === 0) {
                toast({
                    variant: "destructive",
                    title: "Sign Up Failed",
                    description: "This email is already registered. Please login.",
                });
                return;
            }

            setEmailSentTo(values.email);
            setIsSuccess(true);

            toast({
                title: "Account Created",
                description: "Please check your email for the confirmation link.",
            });
        } catch (error: any) {
            console.log("error", error);
            toast({
                variant: "destructive",
                title: "Sign Up Failed",
                description: error.message || "An unexpected error occurred.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center text-center space-y-4 py-3">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-100 rounded-full blur-xl animate-pulse"></div>
                    <div className="relative h-14 w-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                        <MailCheck className="h-7 w-7 text-white" />
                    </div>
                </div>
                <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                        Check Your Email!
                    </h3>
                    <p className="text-xs text-slate-600 max-w-sm px-2">
                        Confirmation link sent to <span className="font-semibold text-primary">{emailSentTo}</span>
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="w-full h-9 rounded-xl border-2 hover:bg-slate-50 text-sm"
                    onClick={() => router.push("/login")}
                >
                    Back to Login
                </Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                {/* EMAIL */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-medium text-slate-700">
                                {t("signup_form.email_label")}
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                    <Input
                                        placeholder="tech@example.com"
                                        {...field}
                                        type="email"
                                        className="pl-9 h-10 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-primary rounded-xl transition-all text-sm"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                {/* PASSWORD */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-medium text-slate-700">
                                {t("signup_form.password_label")}
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                    <Input
                                        placeholder="Min. 6 characters"
                                        {...field}
                                        type="password"
                                        className="pl-9 h-10 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-primary rounded-xl transition-all text-sm"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                {/* CONFIRM PASSWORD */}
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-xs font-medium text-slate-700">
                                {t("signup_form.confirm_password_label")}
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                                    <Input
                                        placeholder="Re-enter password"
                                        {...field}
                                        type="password"
                                        className="pl-9 h-10 bg-slate-50/50 border-slate-200 focus:bg-white focus:border-primary rounded-xl transition-all text-sm"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <Button
                    type="submit"
                    className="w-full h-10 text-sm font-semibold bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 rounded-xl shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30 active:scale-[0.98]"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
                            {t("signup_form.submitting")}
                        </>
                    ) : (
                        t("signup_form.submit_button")
                    )}
                </Button>

                <div className="text-center pt-1.5">
                    <p className="text-xs text-slate-600">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => router.push("/login")}
                            className="font-semibold text-primary hover:text-primary/80 transition-colors underline-offset-4 hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </form>
        </Form>
    );
}
