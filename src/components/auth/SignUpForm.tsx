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
import { Loader2, MailCheck } from "lucide-react";
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
            <div className="flex flex-col items-center text-center space-y-6 py-8">
                <div className="h-20 w-20 bg-green-100 rounded-full flex items-center justify-center">
                    <MailCheck className="h-10 w-10 text-green-600" />
                </div>
                <div>
                    <h3 className="text-2xl font-bold">
                        {t("signup_form.success_title")}
                    </h3>
                    <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
                        {t("signup_form.success_message", emailSentTo)}
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="w-full max-w-xs"
                    onClick={() => router.push("/login")}
                >
                    Back to Login
                </Button>
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* EMAIL */}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("signup_form.email_label")}</FormLabel>
                            <FormControl>
                                <Input placeholder="tech@example.com" {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* PASSWORD */}
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("signup_form.password_label")}</FormLabel>
                            <FormControl>
                                <Input placeholder="******" {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* CONFIRM PASSWORD */}
                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t("signup_form.confirm_password_label")}</FormLabel>
                            <FormControl>
                                <Input placeholder="******" {...field} type="password" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full h-12 text-lg" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isLoading
                        ? t("signup_form.submitting")
                        : t("signup_form.submit_button")}
                </Button>

                <div className="text-center pt-2">
                    <Button variant="link" type="button" onClick={() => router.push("/login")}>
                        {t("signup_form.already_have_account")}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
