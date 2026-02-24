"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useVerifyOTPMutation, useForgotPasswordMutation } from "@/app/redux/features/auth/authApi";

const verifyOTPSchema = z.object({
    otp: z.string().length(6, "OTP must be 6 digits"),
});

type VerifyOTPFormData = z.infer<typeof verifyOTPSchema>;

export default function VerifyOTPPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email") || "";

    const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
    const [resendOTP, { isLoading: isResending }] = useForgotPasswordMutation();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const {
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<VerifyOTPFormData>({
        resolver: zodResolver(verifyOTPSchema),
    });

    // Handle OTP digit input
    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.charAt(0);
        }

        if (value && !/^\d+$/.test(value)) return;

        const newOtpDigits = [...otpDigits];
        newOtpDigits[index] = value;
        setOtpDigits(newOtpDigits);

        // Update form value
        const fullOtp = newOtpDigits.join("");
        setValue("otp", fullOtp, { shouldValidate: true });

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste for full OTP
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text");
        const pastedOtp = pastedData.replace(/\D/g, "").slice(0, 6);

        if (pastedOtp.length > 0) {
            const newOtpDigits = [...otpDigits];
            for (let i = 0; i < pastedOtp.length; i++) {
                if (i < 6) newOtpDigits[i] = pastedOtp[i];
            }
            setOtpDigits(newOtpDigits);
            setValue("otp", newOtpDigits.join(""), { shouldValidate: true });

            // Focus next empty field or last field
            const nextIndex = Math.min(pastedOtp.length, 5);
            inputRefs.current[nextIndex]?.focus();
        }
    };

    // Auto-submit when 6 digits are entered
    useEffect(() => {
        const fullOtp = otpDigits.join("");
        if (fullOtp.length === 6) {
            handleSubmit(onSubmit)();
        }
    }, [otpDigits]);

    const onSubmit = async (data: VerifyOTPFormData) => {
        if (!email) {
            setError("Email not found. Please start over.");
            return;
        }

        setError("");
        setSuccess("");

        try {
            const response = await verifyOTP({ email, otp: data.otp }).unwrap();
            setSuccess("OTP verified successfully!");

            // Redirect to reset password page with token from response
            setTimeout(() => {
                router.push(`/auth/reset-password?token=${response.data?.token}`);
            }, 1500);
        } catch (err: any) {
            setError(err?.data?.message || "Invalid OTP");

            // Clear OTP on error
            setOtpDigits(["", "", "", "", "", ""]);
            setValue("otp", "");
            inputRefs.current[0]?.focus();
        }
    };

    const handleResendOTP = async () => {
        if (!email) {
            setError("Email not found. Please start over.");
            return;
        }

        setError("");
        setSuccess("");

        try {
            await resendOTP({ email }).unwrap();
            setSuccess("New OTP sent to your email!");

            // Clear OTP fields
            setOtpDigits(["", "", "", "", "", ""]);
            setValue("otp", "");
            inputRefs.current[0]?.focus();
        } catch (err: any) {
            setError(err?.data?.message || "Failed to resend OTP");
        }
    };

    if (!email) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
                <div className="bg-slate-800 rounded-xl p-8 border border-slate-700 text-center">
                    <p className="text-red-400 mb-4">No email provided</p>
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
                    <p className="text-gray-400 text-base">Enter verification code</p>
                    <p className="text-gray-500 text-sm mt-2">{email}</p>
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

                {/* Verify OTP Form */}
                <div className="bg-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-700">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Verify Code</h2>
                    <p className="text-gray-400 text-sm mb-6">We've sent a 6-digit code to your email</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-6">
                            <div className="flex justify-between gap-2">
                                {[0, 1, 2, 3, 4, 5].map((index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        ref={(el) => {
                                            inputRefs.current[index] = el;
                                        }}
                                        value={otpDigits[index]}
                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                        onPaste={handlePaste}
                                        className="w-12 h-12 text-center text-xl font-bold bg-slate-900 border border-slate-700 rounded-lg text-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none"
                                        disabled={isLoading || success !== ""}
                                    />
                                ))}
                            </div>
                            {errors.otp && <p className="text-red-400 text-sm mt-2 text-center">{errors.otp.message}</p>}
                        </div>

                        <button type="submit" disabled={isLoading || otpDigits.join("").length !== 6 || success !== ""} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50 cursor-pointer">
                            {isLoading ? "Verifying..." : "Verify Code"}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button onClick={handleResendOTP} disabled={isResending || success !== ""} className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors disabled:opacity-50">
                            {isResending ? "Sending..." : "Resend Code"}
                        </button>
                    </div>

                    <div className="mt-4 text-center">
                        <Link href="/auth/forgot-password" className="text-sm text-gray-400 hover:text-gray-300 transition-colors">
                            ← Back
                        </Link>
                    </div>
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">The code will expire in 10 minutes</p>
            </div>
        </div>
    );
}
