"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
    const router = useRouter();
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            // Mock authentication
            setTimeout(() => {
                if (loginEmail === "master@peptide.club" && loginPassword === "master123") {
                    // Master login
                    localStorage.setItem("admin_token", "mock_admin_token");
                    localStorage.setItem(
                        "admin_user",
                        JSON.stringify({
                            email: "master@peptide.club",
                            role: "Admin",
                        })
                    );
                    router.push("/admin");
                } else {
                    setError("Invalid credentials");
                }
                setLoading(false);
            }, 500);
        } catch (err) {
            setError("Login failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                        <p className="text-red-300 text-sm">{error}</p>
                    </div>
                )}

                {/* Login Form */}
                <div className="bg-slate-800 rounded-xl md:rounded-2xl p-6 md:p-8 border border-slate-700">
                    <h2 className="text-2xl md:mb-6 md:text-3xl font-black text-white mb-8">Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <input type="email" placeholder="admin@peptide.club" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white mb-4" />
                        <input type="password" placeholder="Password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white mb-4" />
                        <button type="submit" disabled={loading} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow disabled:opacity-50">
                            {loading ? "Signing In..." : "Sign In"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
