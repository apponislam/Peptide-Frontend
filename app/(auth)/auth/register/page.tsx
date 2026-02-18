"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Key, Mail, User } from "lucide-react";
import { useAppDispatch } from "@/app/redux/hooks";
import { useRegisterMutation } from "@/app/redux/features/auth/authApi";
import { setUser } from "@/app/redux/features/auth/authSlice";

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const [register, { isLoading }] = useRegisterMutation();

    const referralFromUrl = searchParams.get("ref") ? searchParams.get("ref")!.toUpperCase() : "";

    // Redirect to login if no referral code is present
    useEffect(() => {
        if (!referralFromUrl) {
            router.push("/auth/login");
        }
    }, [referralFromUrl, router]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleRegistrationSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Basic validation
        if (!formData.name.trim()) {
            setError("Name is required");
            return;
        }

        if (!formData.email) {
            setError("Email is required");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        try {
            // Prepare registration data with referral code from URL
            const registerData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                referralCode: referralFromUrl,
            };
            console.log(registerData);

            // Call the register API
            const response = await register(registerData).unwrap();
            console.log(response);

            if (response.success) {
                // Dispatch user to Redux store
                dispatch(
                    setUser({
                        user: response.data.user,
                        token: response.data.accessToken,
                    }),
                );

                // Also store in localStorage for persistence
                localStorage.setItem("accessToken", response.data.accessToken);
                localStorage.setItem("user", JSON.stringify(response.data.user));

                setSuccess("Account created successfully!");

                // Redirect after success
                setTimeout(() => {
                    router.push("/");
                }, 1200);
            } else {
                setError(response.message || "Registration failed");
            }
        } catch (err: any) {
            console.error("Registration error:", err);

            // Handle different error formats
            if (err.data?.message) {
                setError(err.data.message);
            } else if (err.message) {
                setError(err.message);
            } else if (err.status === 409) {
                setError("An account with this email already exists.");
            } else {
                setError("Registration failed. Please try again.");
            }
        }
    };

    const updateFormData = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    // If no referral code, don't render the component (will redirect)
    if (!referralFromUrl) {
        return null; // or a loading spinner
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                {/* Left Side - Logo & Brand */}
                <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start">
                    <div className="mb-6">
                        <Link href="/">
                            <Image src="/peptide-logo.png" alt="PEPTIDE.CLUB" width={0} height={0} sizes="100vw" className="h-16 md:h-20 w-auto" priority />
                        </Link>
                    </div>

                    <div className="text-center lg:text-left">
                        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Welcome to PEPTIDE.CLUB</h1>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full lg:w-1/2">
                    <div className="mb-4">
                        <Link href="/auth/login" className="inline-flex items-center text-cyan-400 hover:text-cyan-300">
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Back to Login
                        </Link>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                            <p className="text-red-300 text-sm">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                            <p className="text-green-300 text-sm">{success}</p>
                        </div>
                    )}

                    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50">
                        <h2 className="text-xl font-bold text-white mb-6">Create Your Account</h2>

                        <form onSubmit={handleRegistrationSubmit}>
                            <div className="space-y-4">
                                {/* Name */}
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        <User className="inline w-4 h-4 mr-2 mb-1" />
                                        Name
                                    </label>
                                    <input type="text" value={formData.name} onChange={(e) => updateFormData("name", e.target.value)} placeholder="Enter your Name" required className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors" />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        <Mail className="inline w-4 h-4 mr-2 mb-1" />
                                        Email Address
                                    </label>
                                    <input type="email" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} placeholder="Enter your email" required className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors" />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-gray-300 mb-2">
                                        <Key className="inline w-4 h-4 mr-2 mb-1" />
                                        Password
                                    </label>
                                    <input
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => updateFormData("password", e.target.value)}
                                        placeholder="Create a password (min. 6 characters)"
                                        required
                                        minLength={6}
                                        className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                                    />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-gray-300 mb-2">Confirm Password</label>
                                    <input
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                                        placeholder="Confirm your password"
                                        required
                                        className="w-full px-4 py-3 bg-slate-900/70 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-colors"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button type="submit" disabled={isLoading} className="w-full py-3 bg-linear-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-lg transition-all duration-300 hover:shadow-xl hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                                    {isLoading ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating Account...
                                        </span>
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
