// "use client";

// import { useState, FormEvent } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";

// export default function LoginPage() {
//     const router = useRouter();
//     const [loginEmail, setLoginEmail] = useState("");
//     const [loginPassword, setLoginPassword] = useState("");
//     const [referralCode, setReferralCode] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const handleLogin = async (e: FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");

//         try {
//             // Mock authentication - in real app, you'd call your API
//             setTimeout(() => {
//                 if (loginEmail === "master@peptide.club" && loginPassword === "master123") {
//                     // Master login
//                     localStorage.setItem(
//                         "peptide_user",
//                         JSON.stringify({
//                             email: "master@peptide.club",
//                             referralCode: "JAKE",
//                             referralCount: 0,
//                             storeCredit: 0,
//                             tier: "Founder",
//                         })
//                     );
//                     router.push("/");
//                 } else if (loginEmail && loginPassword) {
//                     // Regular user login
//                     const referralCode = "REF" + Math.random().toString(36).substring(2, 8).toUpperCase();
//                     localStorage.setItem(
//                         "peptide_user",
//                         JSON.stringify({
//                             email: loginEmail,
//                             referralCode,
//                             referralCount: 0,
//                             storeCredit: 0,
//                             tier: "Member",
//                         })
//                     );
//                     router.push("/");
//                 } else {
//                     setError("Please enter valid credentials");
//                 }
//                 setLoading(false);
//             }, 500);
//         } catch (err) {
//             setError("Login failed. Please try again.");
//             setLoading(false);
//         }
//     };

//     const handleNewMember = (e: FormEvent) => {
//         e.preventDefault();
//         if (referralCode.trim().toUpperCase() !== "JAKE") {
//             setError("Invalid invitation code.");
//             return;
//         }

//         const userId = "user_" + Math.random().toString(36).substring(7);
//         const userReferralCode = "REF" + Math.random().toString(36).substring(2, 8).toUpperCase();

//         localStorage.setItem(
//             "peptide_user",
//             JSON.stringify({
//                 id: userId,
//                 email: "new@member.com",
//                 referralCode: userReferralCode,
//                 referralCount: 0,
//                 storeCredit: 0,
//                 tier: "Member",
//                 referredBy: referralCode.toUpperCase(),
//             })
//         );

//         router.push("/");
//     };

//     return (
//         <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
//             <div className="max-w-4xl w-full">
//                 {/* Logo */}
//                 <div className="text-center mb-8 md:mb-12">
//                     <div className="flex justify-center mb-4">
//                         <Link href="/">
//                             <Image src="/peptide-logo.png" alt="PEPTIDE.CLUB" width={350} height={80} className="h-16 md:h-20 w-auto" />
//                         </Link>
//                     </div>
//                     <p className="text-gray-400 text-base md:text-lg">By invitation only</p>
//                 </div>

//                 {/* Error Message */}
//                 {error && (
//                     <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
//                         <p className="text-red-300 text-sm">{error}</p>
//                     </div>
//                 )}

//                 {/* Login Grid */}
//                 <div className="grid md:grid-cols-2 gap-6 md:gap-8">
//                     {/* New Member Section */}
//                     <div className="bg-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-700">
//                         <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">New Member</h2>
//                         <form onSubmit={handleNewMember}>
//                             <input type="text" placeholder="Invitation Code" value={referralCode} onChange={(e) => setReferralCode(e.target.value.toUpperCase())} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white mb-4 uppercase" />
//                             <button type="submit" className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow">
//                                 Unlock Access
//                             </button>
//                         </form>
//                     </div>

//                     {/* Member Access Section */}
//                     <div className="bg-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-700">
//                         <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Member Access</h2>
//                         <form onSubmit={handleLogin}>
//                             <input type="email" placeholder="Email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white mb-4" />
//                             <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white mb-4" />
//                             <button type="submit" disabled={loading} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50">
//                                 {loading ? "Signing In..." : "Sign In"}
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "@/app/redux/hooks";
import { useLoginMutation } from "@/app/redux/features/auth/authApi";
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

    // Login form
    const {
        register: registerLogin,
        handleSubmit: handleLoginSubmit,
        formState: { errors: loginErrors, isSubmitting: loginSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    // Referral form
    const {
        register: registerReferral,
        handleSubmit: handleReferralSubmit,
        formState: { errors: referralErrors, isSubmitting: referralSubmitting },
    } = useForm<ReferralFormData>({
        resolver: zodResolver(referralSchema),
    });

    const onLoginSubmit = async (data: LoginFormData) => {
        setError("");
        try {
            const response = await login(data).unwrap();

            // Dispatch user to Redux store
            dispatch(
                setUser({
                    user: response.data.user,
                    token: response.data.accessToken,
                })
            );

            router.push("/");
        } catch (err: any) {
            setError(err?.data?.message || "Login failed");
        }
    };

    const onReferralSubmit = async (data: ReferralFormData) => {
        setError("");
        if (data.referralCode.trim().toUpperCase() !== "JAKE") {
            setError("Invalid invitation code.");
            return;
        }

        // Redirect to registration page with referral code
        router.push(`/register?referral=${data.referralCode}`);
    };

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
                    <div className="bg-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-700">
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">New Member</h2>
                        <form onSubmit={handleReferralSubmit(onReferralSubmit)}>
                            <input type="text" placeholder="Invitation Code" {...registerReferral("referralCode")} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white mb-4 uppercase" />
                            {referralErrors.referralCode && <p className="text-red-400 text-sm mb-2">{referralErrors.referralCode.message}</p>}
                            <button type="submit" disabled={referralSubmitting} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50">
                                {referralSubmitting ? "Processing..." : "Unlock Access"}
                            </button>
                        </form>
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
