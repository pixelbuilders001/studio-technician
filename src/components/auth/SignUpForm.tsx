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
            <div className="flex flex-col items-center text-center space-y-5 py-4">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <MailCheck className="h-8 w-8 text-green-600" />
                </div>
                <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-900">
                        Check Your Email!
                    </h3>
                    <p className="text-sm text-slate-600 max-w-sm">
                        We've sent a confirmation link to <span className="font-semibold text-primary">{emailSentTo}</span>
                    </p>
                </div>
                <Button
                    variant="outline"
                    className="w-full h-11 rounded-xl border-2"
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
                                        placeholder="tech@example.com"
                                        {...field}
                                        type="email"
                                        className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-primary rounded-lg"
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
                                        placeholder="Min. 6 characters"
                                        {...field}
                                        type="password"
                                        className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-primary rounded-lg"
                                    />
                                </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">
                                Confirm Password
                            </FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Re-enter password"
                                        {...field}
                                        type="password"
                                        className="pl-10 h-11 bg-slate-50 border-slate-200 focus:bg-white focus:border-primary rounded-lg"
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
                            Creating Account...
                        </>
                    ) : (
                        "Create Account"
                    )}
                </Button>

                <div className="text-center pt-2">
                    <p className="text-sm text-slate-600">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={() => router.push("/login")}
                            className="font-semibold text-primary hover:underline"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </form>
        </Form>
    );
}
