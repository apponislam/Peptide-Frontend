"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, UserPlus, Key, Mail, CheckCircle } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        invitationCode: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const validateInvitationCode = (code: string): boolean => {
        const validCodes = ["JAKE", "WELCOME", "ACCESS2024", "PEPTIDE123"];
        return validCodes.includes(code.toUpperCase());
    };

    const handleInvitationSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!validateInvitationCode(formData.invitationCode)) {
            setError("Invalid invitation code. Please check and try again.");
            return;
        }

        setStep(2);
    };

    const handleRegistrationSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Check if email already exists
            const existingUser = localStorage.getItem(`user_${formData.email}`);
            if (existingUser) {
                setError("An account with this email already exists. Please sign in instead.");
                setLoading(false);
                return;
            }

            // Generate referral code
            const referralCode = "REF" + Math.random().toString(36).substring(2, 8).toUpperCase();

            // Create user object
            const userData = {
                id: `user_${Date.now()}`,
                email: formData.email,
                referralCode,
                referralCount: 0,
                storeCredit: 0,
                tier: "Member",
                referredBy: formData.invitationCode.toUpperCase(),
                createdAt: new Date().toISOString(),
            };

            // Save to localStorage
            localStorage.setItem(
                `user_${formData.email}`,
                JSON.stringify({
                    ...userData,
                    password: formData.password, // In real app, hash this!
                })
            );

            // Auto login
            localStorage.setItem("peptide_user", JSON.stringify(userData));

            setSuccess("Account created successfully! Redirecting...");
            setLoading(false);

            // Redirect after success
            setTimeout(() => {
                router.push("/");
            }, 1500);
        } catch (err) {
            setError("Registration failed. Please try again.");
            setLoading(false);
        }
    };

    const updateFormData = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <Link href="/" className="inline-block">
                            <Image src="/peptide-logo.png" alt="PEPTIDE.CLUB" width={350} height={80} className="h-16 md:h-20 w-auto" priority />
                        </Link>
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">Join PEPTIDE.CLUB</h1>
                    <p className="text-gray-400">By invitation only • Research-grade peptides</p>
                </div>

                {/* Back Button */}
                <div className="mb-6">
                    <Link href="/auth/login" className="inline-flex items-center text-cyan-400 hover:text-cyan-300 text-sm">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Login
                    </Link>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-cyan-500" : "bg-slate-700"}`}>
                            <Key className={`w-4 h-4 ${step >= 1 ? "text-white" : "text-gray-400"}`} />
                        </div>
                        <span className={`text-xs mt-2 ${step >= 1 ? "text-cyan-400" : "text-gray-500"}`}>Invitation Code</span>
                    </div>
                    <div className={`flex-1 h-0.5 ${step >= 2 ? "bg-cyan-500" : "bg-slate-700"}`} />
                    <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-cyan-500" : "bg-slate-700"}`}>
                            <UserPlus className={`w-4 h-4 ${step >= 2 ? "text-white" : "text-gray-400"}`} />
                        </div>
                        <span className={`text-xs mt-2 ${step >= 2 ? "text-cyan-400" : "text-gray-500"}`}>Create Account</span>
                    </div>
                </div>

                {/* Error/Success Messages */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg">
                        <p className="text-green-300 text-sm">{success}</p>
                    </div>
                )}

                {/* Step 1: Invitation Code */}
                {step === 1 && (
                    <div className="bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-2">Enter Invitation Code</h2>
                        <p className="text-gray-400 text-sm mb-6">Access requires a valid invitation code. If you don't have one, please contact an existing member.</p>

                        <form onSubmit={handleInvitationSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-300 text-sm mb-2">Invitation Code</label>
                                <input type="text" value={formData.invitationCode} onChange={(e) => updateFormData("invitationCode", e.target.value.toUpperCase())} placeholder="Enter your code" required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-center text-lg tracking-wider uppercase" />
                                <p className="text-xs text-gray-400 mt-2">Example valid codes: JAKE, WELCOME, ACCESS2024</p>
                            </div>

                            <button type="submit" className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow">
                                Verify Code & Continue
                            </button>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-700">
                            <p className="text-sm text-gray-400">
                                Already have an account?{" "}
                                <Link href="/auth/login" className="text-cyan-400 hover:text-cyan-300">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 2: Registration Form */}
                {step === 2 && (
                    <div className="bg-slate-800 rounded-xl p-6 md:p-8 border border-slate-700">
                        <h2 className="text-xl font-bold text-white mb-2">Create Your Account</h2>
                        <p className="text-gray-400 text-sm mb-6">Code verified! Please create your account.</p>

                        <form onSubmit={handleRegistrationSubmit}>
                            <div className="space-y-4">
                                {/* Email */}
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">
                                        <Mail className="inline w-4 h-4 mr-2" />
                                        Email Address
                                    </label>
                                    <input type="email" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} placeholder="you@example.com" required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                                </div>

                                {/* Password */}
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">
                                        <Key className="inline w-4 h-4 mr-2" />
                                        Password
                                    </label>
                                    <input type="password" value={formData.password} onChange={(e) => updateFormData("password", e.target.value)} placeholder="At least 6 characters" required minLength={6} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                                </div>

                                {/* Confirm Password */}
                                <div>
                                    <label className="block text-gray-300 text-sm mb-2">
                                        <CheckCircle className="inline w-4 h-4 mr-2" />
                                        Confirm Password
                                    </label>
                                    <input type="password" value={formData.confirmPassword} onChange={(e) => updateFormData("confirmPassword", e.target.value)} placeholder="Re-enter your password" required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                                </div>

                                {/* Terms */}
                                <div className="flex items-start mt-4">
                                    <input type="checkbox" id="terms" required className="mt-1 mr-3" />
                                    <label htmlFor="terms" className="text-sm text-gray-300">
                                        I agree to the{" "}
                                        <Link href="/terms" className="text-cyan-400 hover:underline">
                                            Terms of Service
                                        </Link>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button type="submit" disabled={loading} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed mt-6">
                                    {loading ? "Creating Account..." : "Create Account"}
                                </button>
                            </div>
                        </form>

                        <div className="mt-6 pt-6 border-t border-slate-700">
                            <p className="text-sm text-gray-400">By registering, you'll get:</p>
                            <ul className="text-sm text-gray-400 mt-2 space-y-1">
                                <li>• 10% member discount on all products</li>
                                <li>• Your own referral code to earn commissions</li>
                                <li>• Access to research materials and COAs</li>
                                <li>• Free shipping on orders over $150</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
