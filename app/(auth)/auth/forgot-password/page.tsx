"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForgotPasswordMutation } from "@/app/redux/features/auth/authApi";

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setError("");
        setSuccess("");

        try {
            const response = await forgotPassword(data).unwrap();
            setSuccess(response?.message || "Password reset link sent to your email");

            // After 2 seconds, redirect to verify-otp page with email
            setTimeout(() => {
                router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
            }, 2000);
        } catch (err: any) {
            setError(err?.data?.message || "Failed to send reset link");
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Image src="/peptide-logo.png" alt="PEPTIDE.CLUB" width={0} height={0} sizes="100vw" className="h-16 md:h-20 w-auto" priority />
                    </div>
                    <p className="text-gray-400 text-base">Reset your password</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                        <p className="text-green-300 text-sm">{success}</p>
                        <p className="text-green-300 text-sm mt-2">Redirecting to verification page...</p>
                    </div>
                )}

                {/* Forgot Password Form */}
                <div className="bg-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-700">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Forgot Password</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-2">
                            <input type="email" placeholder="Email Address" {...register("email")} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white mb-4" disabled={isLoading || success !== ""} />
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <button type="submit" disabled={isLoading || success !== ""} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50 cursor-pointer">
                            {isLoading ? "Sending..." : "Send Reset Link"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/auth/login" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                </div>

                {/* Additional Info */}
                <p className="text-center text-gray-500 text-sm mt-6">We'll send you an email with instructions to reset your password</p>
            </div>
        </div>
    );
}
