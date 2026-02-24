"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X, Lock, Eye, EyeOff, KeyRound } from "lucide-react";
import { useChangePasswordMutation } from "@/app/redux/features/auth/authApi";

const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password is required"),
        newPassword: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangePasswordModal({ isOpen, onClose }: ChangePasswordModalProps) {
    const [changePassword, { isLoading }] = useChangePasswordMutation();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ChangePasswordFormData>({
        resolver: zodResolver(changePasswordSchema),
    });

    const newPassword = watch("newPassword", "");

    // Reset states when modal opens
    useEffect(() => {
        if (isOpen) {
            setError("");
            setSuccess("");
            reset();
        }
    }, [isOpen, reset]);

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

    const onSubmit = async (data: ChangePasswordFormData) => {
        setError("");
        setSuccess("");

        try {
            await changePassword({
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            }).unwrap();

            setSuccess("Password changed successfully!");

            setTimeout(() => {
                onClose();
            }, 300);
        } catch (err: any) {
            setError(err?.data?.message || "Failed to change password");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
            <div className="bg-slate-800 rounded-xl w-full max-w-md border border-slate-700 my-4">
                {/* Header - Sticky */}
                <div className="sticky top-0 bg-slate-800 flex items-center justify-between p-4 sm:p-6 border-b border-slate-700 rounded-t-xl">
                    <h2 className="text-lg sm:text-xl font-bold text-white">Change Password</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="p-4 sm:p-6 max-h-[calc(100vh-120px)] overflow-y-auto">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        {/* Error Message */}
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
                                <p className="text-red-300 text-sm">{error}</p>
                            </div>
                        )}

                        {/* Success Message */}
                        {success && (
                            <div className="p-3 bg-green-500/10 border border-green-500/50 rounded-lg">
                                <p className="text-green-300 text-sm">{success}</p>
                            </div>
                        )}

                        {/* Current Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input type={showCurrentPassword ? "text" : "password"} {...register("currentPassword")} className="w-full pl-10 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm" placeholder="Enter current password" disabled={isLoading || success !== ""} />
                                <button type="button" onClick={() => setShowCurrentPassword(!showCurrentPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400">
                                    {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.currentPassword && <p className="text-red-400 text-sm mt-1">{errors.currentPassword.message}</p>}
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input type={showNewPassword ? "text" : "password"} {...register("newPassword")} className="w-full pl-10 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm" placeholder="Enter new password" disabled={isLoading || success !== ""} />
                                <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400">
                                    {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
                            <div className="relative">
                                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <input type={showConfirmPassword ? "text" : "password"} {...register("confirmPassword")} className="w-full pl-10 pr-12 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none text-sm" placeholder="Confirm new password" disabled={isLoading || success !== ""} />
                                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-400">
                                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                            {errors.confirmPassword && <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>}
                        </div>

                        {/* Password Requirements */}
                        <div className="p-3 bg-slate-900/50 rounded-lg">
                            <p className="text-xs text-gray-400 mb-2">Password strength indicators:</p>
                            <ul className="text-xs text-gray-500 space-y-1">
                                <li className={newPassword.length >= 8 ? "text-green-400" : ""}>• {newPassword.length >= 8 ? "✓" : "○"} At least 8 characters (stronger)</li>
                                <li className={/[A-Z]/.test(newPassword) ? "text-green-400" : ""}>• {/[A-Z]/.test(newPassword) ? "✓" : "○"} Uppercase letter</li>
                                <li className={/[a-z]/.test(newPassword) ? "text-green-400" : ""}>• {/[a-z]/.test(newPassword) ? "✓" : "○"} Lowercase letter</li>
                                <li className={/[0-9]/.test(newPassword) ? "text-green-400" : ""}>• {/[0-9]/.test(newPassword) ? "✓" : "○"} Number</li>
                                <li className={/[^A-Za-z0-9]/.test(newPassword) ? "text-green-400" : ""}>• {/[^A-Za-z0-9]/.test(newPassword) ? "✓" : "○"} Special character</li>
                            </ul>
                            <p className="text-xs text-gray-500 mt-2">Minimum 6 characters required.</p>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-2">
                            <button type="button" onClick={onClose} className="flex-1 py-3 bg-slate-700 text-white rounded-lg font-bold hover:bg-slate-600 transition-colors text-sm" disabled={isLoading}>
                                Cancel
                            </button>
                            <button type="submit" disabled={isLoading || success !== ""} className="flex-1 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50 cursor-pointer text-sm">
                                {isLoading ? "Changing..." : "Change Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
