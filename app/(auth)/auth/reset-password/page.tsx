"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useResetPasswordMutation } from "@/app/redux/features/auth/authApi";

const resetPasswordSchema = z
    .object({
        newPassword: z
            .string()
            .min(8, "Password must be at least 8 characters")
            .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
            .regex(/[a-z]/, "Password must contain at least one lowercase letter")
            .regex(/[0-9]/, "Password must contain at least one number")
            .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const [resetPassword, { isLoading }] = useResetPasswordMutation();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
    });

    const newPassword = watch("newPassword", "");

    // Redirect if no token
    useEffect(() => {
        if (!token) {
            router.push("/auth/forgot-password");
        }
    }, [token, router]);

    const getPasswordStrength = () => {
        let strength = 0;
        if (newPassword.length >= 8) strength++;
        if (/[A-Z]/.test(newPassword)) strength++;
        if (/[a-z]/.test(newPassword)) strength++;
        if (/[0-9]/.test(newPassword)) strength++;
        if (/[^A-Za-z0-9]/.test(newPassword)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength();
    const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"];
    const strengthColor = ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (!token) {
            setError("Invalid reset token");
            return;
        }

        setError("");
        setSuccess("");

        try {
            await resetPassword({
                token: token,
                newPassword: data.newPassword,
            }).unwrap();

            setSuccess("Password reset successfully!");

            // Redirect to login after 2 seconds
            setTimeout(() => {
                router.push("/auth/login");
            }, 2000);
        } catch (err: any) {
            setError(err?.data?.message || "Failed to reset password");
        }
    };

    if (!token) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
                    <p className="text-red-400 mb-4">No reset token provided</p>
                    <Link href="/auth/forgot-password" className="text-cyan-400 hover:text-cyan-300">
                        Go back to forgot password
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Image src="/peptide-logo.png" alt="PEPTIDE.CLUB" width={0} height={0} sizes="100vw" className="h-16 md:h-20 w-auto" priority />
                    </div>
                    <p className="text-gray-400 text-base">Create new password</p>
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
                    </div>
                )}

                {/* Reset Password Form */}
                <div className="bg-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-700">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-6">Reset Password</h2>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* New Password */}
                        <div className="mb-4">
                            <div className="relative">
                                <input type={showNewPassword ? "text" : "password"} placeholder="New Password" {...register("newPassword")} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white pr-12" disabled={isLoading || success !== ""} />
                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">
                                    {showNewPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.newPassword && <p className="text-red-400 text-sm mt-1">{errors.newPassword.message}</p>}

                            {/* Password Strength Meter */}
                            {newPassword && newPassword.length > 0 && (
                                <div className="mt-3">
                                    <div className="flex gap-1 h-1.5">
                                        {[0, 1, 2, 3, 4].map((index) => (
                                            <div key={index} className={`flex-1 rounded-full transition-colors ${index < passwordStrength ? strengthColor[passwordStrength - 1] : "bg-slate-700"}`} />
                                        ))}
                                    </div>
                                    <p className={`text-xs mt-1 ${passwordStrength <= 2 ? "text-red-400" : passwordStrength === 3 ? "text-yellow-400" : "text-green-400"}`}>{strengthText[passwordStrength - 1] || "Very Weak"} Password</p>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password */}
                        <div className="mb-6">
                            <div className="relative">
                                <input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm New Password" {...register("confirmPassword")} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white pr-12" disabled={isLoading || success !== ""} />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300">
                                    {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        <button type="submit" disabled={isLoading || success !== ""} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50 cursor-pointer">
                            {isLoading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link href="/auth/login" className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors">
                            ← Back to Login
                        </Link>
                    </div>
                </div>

                {/* Password Requirements */}
                <div className="mt-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                    <p className="text-sm text-gray-400 mb-2">Password must contain:</p>
                    <ul className="text-xs text-gray-500 space-y-1">
                        <li className={`${newPassword.length >= 8 ? "text-green-400" : ""}`}>✓ At least 8 characters</li>
                        <li className={`${/[A-Z]/.test(newPassword) ? "text-green-400" : ""}`}>✓ One uppercase letter</li>
                        <li className={`${/[a-z]/.test(newPassword) ? "text-green-400" : ""}`}>✓ One lowercase letter</li>
                        <li className={`${/[0-9]/.test(newPassword) ? "text-green-400" : ""}`}>✓ One number</li>
                        <li className={`${/[^A-Za-z0-9]/.test(newPassword) ? "text-green-400" : ""}`}>✓ One special character</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
