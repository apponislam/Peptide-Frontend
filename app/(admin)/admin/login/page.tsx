// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";

// export default function AdminLoginPage() {
//     const router = useRouter();
//     const [loginEmail, setLoginEmail] = useState("");
//     const [loginPassword, setLoginPassword] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");

//     const handleLogin = async (e: React.FormEvent) => {
//         e.preventDefault();
//         setLoading(true);
//         setError("");

//         try {
//             setTimeout(() => {
//                 if (loginEmail === "master@peptide.club" && loginPassword === "master123") {
//                     localStorage.setItem("admin_token", "mock_admin_token");
//                     localStorage.setItem(
//                         "admin_user",
//                         JSON.stringify({
//                             email: "master@peptide.club",
//                             role: "Admin",
//                         }),
//                     );
//                     router.push("/admin");
//                 } else {
//                     setError("Invalid credentials");
//                 }
//                 setLoading(false);
//             }, 500);
//         } catch (err) {
//             setError("Login failed. Please try again.");
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
//             <div className="max-w-md w-full">
//                 {error && (
//                     <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
//                         <p className="text-red-300 text-sm">{error}</p>
//                     </div>
//                 )}

//                 {/* Login Form */}
//                 <div className="bg-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-700">
//                     <h2 className="text-2xl md:mb-6 md:text-3xl font-black text-white mb-8">Admin Login</h2>
//                     <form onSubmit={handleLogin}>
//                         <input type="email" placeholder="admin@peptide.club" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white mb-4" />
//                         <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white mb-4" />
//                         <button type="submit" disabled={loading} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50">
//                             {loading ? "Signing In..." : "Sign In"}
//                         </button>
//                     </form>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAppDispatch } from "@/app/redux/hooks";
import { setUser } from "@/app/redux/features/auth/authSlice";
import { useAdminLoginMutation } from "@/app/redux/features/auth/authApi";

// Validation schema for admin login
const adminLoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export default function AdminLoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [adminLogin, { error: mutationError, isLoading }] = useAdminLoginMutation();
    const [error, setError] = useState("");

    useEffect(() => {
        if (mutationError) {
            console.log("Mutation error detected:", mutationError);

            // Extract error message from mutationError
            const errorData = mutationError as any;
            const errorMessage = errorData?.data?.message || errorData?.message || "Admin login failed";

            console.log("Setting error from mutationError:", errorMessage);
            setError(errorMessage);
        }
    }, [mutationError]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<AdminLoginFormData>({
        resolver: zodResolver(adminLoginSchema),
        defaultValues: {
            email: "master@peptide.club",
            password: "master123",
        },
    });

    const handleAdminLogin = async (data: AdminLoginFormData) => {
        setError("");
        try {
            const response = await adminLogin(data).unwrap();

            console.log(response);

            dispatch(
                setUser({
                    user: response.data.user,
                    token: response.data.accessToken,
                }),
            );

            // Check if user is actually admin (role check)
            if (response.data.user.role !== "ADMIN") {
                setError("Access denied. Admin only.");
                return;
            }

            router.push("/admin");
        } catch (err: any) {
            // console.log(err);
            // const errorMessage = err?.data?.data?.message || err?.data?.message || err?.message || "Admin login failed";
            // setError(errorMessage);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">PEPTIDE.CLUB</h1>
                    <p className="text-gray-400 text-base">Admin Portal</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {/* Admin Login Form */}
                <div className="bg-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-700">
                    <h2 className="text-2xl md:mb-6 md:text-3xl font-black text-white mb-8">Admin Login</h2>
                    <form onSubmit={handleSubmit(handleAdminLogin)}>
                        <div className="mb-4">
                            <input type="email" placeholder="admin@peptide.club" {...register("email")} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                            {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
                        </div>

                        <div className="mb-6">
                            <input type="password" placeholder="Password" {...register("password")} className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white" />
                            {errors.password && <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>}
                        </div>

                        <button type="submit" disabled={isSubmitting} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50">
                            {isSubmitting ? "Signing In..." : "Sign In as Admin"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
