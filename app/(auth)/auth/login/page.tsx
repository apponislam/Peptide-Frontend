"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "@/app/redux/hooks";
import { useLoginMutation, useCheckReferralCodeQuery } from "@/app/redux/features/auth/authApi";
import { setUser } from "@/app/redux/features/auth/authSlice";

// Validation schemas
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

const referralSchema = z.object({
    referralCode: z.string().min(1, "Invitation code is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ReferralFormData = z.infer<typeof referralSchema>;

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [login] = useLoginMutation();
    const [error, setError] = useState("");
    const [referralCodeValue, setReferralCodeValue] = useState("");

    // Check referral code query
    const { data: referralCheck, isFetching: isCheckingReferral } = useCheckReferralCodeQuery(referralCodeValue, {
        skip: referralCodeValue.length < 1 || !referralCodeValue.trim(),
    });

    // Login form
    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors, isSubmitting: loginSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "master@peptide.club",
            password: "master123",
        },
    });

    // Referral form
    const {
        register: registerReferral,
        handleSubmit: handleReferralSubmit,
        formState: { errors: referralErrors, isSubmitting: referralSubmitting },
        setValue,
        watch,
    } = useForm<ReferralFormData>({
        resolver: zodResolver(referralSchema),
    });

    const watchedReferralCode = watch("referralCode");

    // Update referral code value for API call
    useEffect(() => {
        if (watchedReferralCode?.trim()) {
            setReferralCodeValue(watchedReferralCode.trim().toUpperCase());
        } else {
            setReferralCodeValue("");
        }
    }, [watchedReferralCode]);

    const onLoginSubmit = async (data: LoginFormData) => {
        setError("");
        try {
            const response = await login(data).unwrap();

            // Dispatch user to Redux store
            dispatch(
                setUser({
                    user: response.data.user,
                    token: response.data.accessToken,
                }),
            );

            router.push("/");
        } catch (err: any) {
            setError(err?.data?.message || "Login failed");
        }
    };

    const onReferralSubmit = async (data: ReferralFormData) => {
        setError("");
        const code = data.referralCode.trim().toUpperCase();

        // Check if referral code is valid (exists in database)
        // available: false = code exists and is valid
        if (referralCheck?.data?.available === false) {
            // ALL VALID REFERRAL CODES - auto-login as demo user
            const userId = "user_" + Math.random().toString(36).substring(7);
            const userReferralCode = "REF" + Math.random().toString(36).substring(2, 8).toUpperCase();

            const mockUser = {
                id: userId,
                name: "New Member",
                email: "new@member.com",
                role: "USER" as const,
                referralCode: userReferralCode,
                tier: "Member",
                storeCredit: 0,
                referralCount: 0,
                createdAt: new Date().toISOString(),
            };

            // Create mock access token
            const mockToken = "mock_token_" + Math.random().toString(36).substring(2);

            // Dispatch to Redux
            dispatch(
                setUser({
                    user: mockUser,
                    token: mockToken,
                }),
            );

            // Store in localStorage for persistence
            localStorage.setItem("accessToken", mockToken);
            localStorage.setItem("user", JSON.stringify(mockUser));

            // Redirect to homepage as demo user
            router.push("/");
        } else {
            // Invalid code - show error
            setError("Invalid invitation code. Please check and try again.");
        }
    };

    // Check if referral code is valid
    // false = valid (exists in database)
    // true = invalid (doesn't exist in database)
    const isReferralValid = referralCheck?.data?.available === false;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-4xl w-full">
                {/* Logo */}
                <div className="text-center mb-8 md:mb-12">
                    <div className="flex justify-center mb-4">
                        <Link href="/">
                            <Image src="/peptide-logo.png" alt="PEPTIDE.CLUB" width={350} height={80} className="h-16 md:h-20 w-auto" />
                        </Link>
                    </div>
                    <p className="text-gray-400 text-base md:text-lg">By invitation only</p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {/* Login Grid */}
                <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                    {/* New Member Section */}
                    <div className="bg-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-700 flex justify-between flex-col gap-4">
                        <h2 className="text-xl md:text-2xl font-bold text-white">New Member</h2>

                        <form onSubmit={handleReferralSubmit(onReferralSubmit)}>
                            <div className="mb-2">
                                <input
                                    type="text"
                                    placeholder="Invitation Code"
                                    {...registerReferral("referralCode")}
                                    onInput={(e) => {
                                        const target = e.target as HTMLInputElement;
                                        const upperValue = target.value.toUpperCase();
                                        target.value = upperValue;
                                        setValue("referralCode", upperValue, { shouldValidate: true });
                                    }}
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white"
                                />
                                {referralErrors.referralCode && <p className="text-red-400 text-sm mt-1">{referralErrors.referralCode.message}</p>}

                                {/* Validation status - only show for codes with at least 4 characters */}
                                {referralCodeValue && referralCodeValue.length >= 4 && (
                                    <div className={`text-sm mt-1 ${isCheckingReferral ? "text-cyan-400" : isReferralValid ? "text-green-400" : "text-red-400"}`}>
                                        {isCheckingReferral ? (
                                            <span className="flex items-center gap-1">
                                                <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-current"></div>
                                                Checking...
                                            </span>
                                        ) : isReferralValid ? (
                                            <span className="flex items-center gap-1">✓ Valid invitation code</span>
                                        ) : (
                                            <span className="flex items-center gap-1">✗ Invalid invitation code</span>
                                        )}
                                    </div>
                                )}
                                {referralCodeValue && referralCodeValue.length > 0 && referralCodeValue.length < 4 && (
                                    <div className="text-sm mt-1 text-red-400">
                                        <span className="flex items-center gap-1">✗ Code must be at least 4 characters</span>
                                    </div>
                                )}
                            </div>

                            <button type="submit" disabled={referralSubmitting} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50">
                                {referralSubmitting ? "Processing..." : "Unlock Access"}
                            </button>
                        </form>

                        <Link href="/auth/register" className="text-right font-medium text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition">
                            Create an account
                        </Link>
                    </div>

                    {/* Member Access Section */}
                    <div className="bg-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-700">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Member Access</h2>
                        <form onSubmit={handleLoginSubmit(onLoginSubmit)}>
                            <input type="email" placeholder="Email" {...registerLogin("email")} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white mb-4" />
                            {loginErrors.email && <p className="text-red-400 text-sm mb-2">{loginErrors.email.message}</p>}
                            <input type="password" placeholder="Password" {...registerLogin("password")} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white mb-4" />
                            {loginErrors.password && <p className="text-red-400 text-sm mb-2">{loginErrors.password.message}</p>}
                            <button type="submit" disabled={loginSubmitting} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50">
                                {loginSubmitting ? "Signing In..." : "Sign In"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
