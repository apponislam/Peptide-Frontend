"use client";

import DashboardStats from "@/app/components/DashboardStats";
import TierSystem from "@/app/components/TierSystem";
import { useAuth } from "@/app/contexts/AuthContext";
import { getTier } from "@/app/lib/products";
import { useState } from "react";

export default function DashboardPage() {
    const { user } = useAuth();
    const [showEditModal, setShowEditModal] = useState(false);
    const [newCode, setNewCode] = useState(user?.referralCode || "");

    const tier = getTier(user?.referralCount || 0);

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <p className="text-gray-400">Please log in to view your dashboard.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-6 md:py-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">Dashboard</h1>

            <DashboardStats user={user} tier={tier} />

            {/* Invitation Code Section */}
            <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700 mb-6 md:mb-8">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Your Invitation Code</h2>
                        <p className="text-sm text-gray-400">Share your code and earn on every purchase</p>
                    </div>
                    <button onClick={() => setShowEditModal(true)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-cyan-400 rounded-lg text-sm font-semibold">
                        ✏️ Customize
                    </button>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 mb-4">
                    <div className="text-2xl md:text-3xl font-bold text-cyan-400 text-center tracking-wider">{user.referralCode}</div>
                </div>
                <button
                    onClick={() => {
                        navigator.clipboard.writeText(`https://peptide.club/?ref=${user.referralCode}`);
                        alert("Link copied!");
                    }}
                    className="w-full py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600"
                >
                    📋 Copy Invitation Link
                </button>
            </div>

            <TierSystem user={user} />

            {/* Edit Code Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
                    <div className="bg-slate-800 rounded-xl p-4 md:p-6 max-w-md w-full border border-slate-700" onClick={(e) => e.stopPropagation()}>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Customize Your Code</h3>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                // Handle code update
                                setShowEditModal(false);
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-gray-300 text-sm mb-2">New Invitation Code</label>
                                <input
                                    type="text"
                                    value={newCode}
                                    onChange={(e) =>
                                        setNewCode(
                                            e.target.value
                                                .toUpperCase()
                                                .replace(/[^A-Z0-9]/g, "")
                                                .substring(0, 20)
                                        )
                                    }
                                    minLength={4}
                                    maxLength={20}
                                    required
                                    className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-center text-lg md:text-xl font-bold tracking-wider"
                                />
                                <p className="text-xs text-gray-400 mt-2">4-20 characters • Letters and numbers only</p>
                            </div>
                            <div className="flex gap-3">
                                <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600">
                                    Cancel
                                </button>
                                <button type="submit" className="flex-1 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg">
                                    Save Code
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
