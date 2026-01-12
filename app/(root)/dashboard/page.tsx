// "use client";

// import DashboardStats from "@/app/components/DashboardStats";
// import TierSystem from "@/app/components/TierSystem";
// import { useAuth } from "@/app/contexts/AuthContext";
// import { getTier } from "@/app/lib/products";
// import { useState } from "react";

// export default function DashboardPage() {
//     const { user } = useAuth();
//     const [showEditModal, setShowEditModal] = useState(false);
//     const [newCode, setNewCode] = useState(user?.referralCode || "");

//     const tier = getTier(user?.referralCount || 0);

//     if (!user) {
//         return (
//             <div className="container mx-auto px-4 py-8 text-center">
//                 <p className="text-gray-400">Please log in to view your dashboard.</p>
//             </div>
//         );
//     }

//     return (
//         <div className="container mx-auto px-4 py-6 md:py-8">
//             <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">Dashboard</h1>

//             <DashboardStats user={user} tier={tier} />

//             {/* Invitation Code Section */}
//             <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700 mb-6 md:mb-8">
//                 <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
//                     <div>
//                         <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Your Invitation Code</h2>
//                         <p className="text-sm text-gray-400">Share your code and earn on every purchase</p>
//                     </div>
//                     <button onClick={() => setShowEditModal(true)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-cyan-400 rounded-lg text-sm font-semibold">
//                         ✏️ Customize
//                     </button>
//                 </div>
//                 <div className="bg-slate-900 rounded-lg p-4 mb-4">
//                     <div className="text-2xl md:text-3xl font-bold text-cyan-400 text-center tracking-wider">{user.referralCode}</div>
//                 </div>
//                 <button
//                     onClick={() => {
//                         navigator.clipboard.writeText(`https://peptide.club/?ref=${user.referralCode}`);
//                         alert("Link copied!");
//                     }}
//                     className="w-full py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600"
//                 >
//                     📋 Copy Invitation Link
//                 </button>
//             </div>

//             <TierSystem user={user} />

//             {/* Edit Code Modal */}
//             {showEditModal && (
//                 <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowEditModal(false)}>
//                     <div className="bg-slate-800 rounded-xl p-4 md:p-6 max-w-md w-full border border-slate-700" onClick={(e) => e.stopPropagation()}>
//                         <h3 className="text-xl md:text-2xl font-bold text-white mb-4">Customize Your Code</h3>
//                         <form
//                             onSubmit={(e) => {
//                                 e.preventDefault();
//                                 // Handle code update
//                                 setShowEditModal(false);
//                             }}
//                         >
//                             <div className="mb-4">
//                                 <label className="block text-gray-300 text-sm mb-2">New Invitation Code</label>
//                                 <input
//                                     type="text"
//                                     value={newCode}
//                                     onChange={(e) =>
//                                         setNewCode(
//                                             e.target.value
//                                                 .toUpperCase()
//                                                 .replace(/[^A-Z0-9]/g, "")
//                                                 .substring(0, 20)
//                                         )
//                                     }
//                                     minLength={4}
//                                     maxLength={20}
//                                     required
//                                     className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white text-center text-lg md:text-xl font-bold tracking-wider"
//                                 />
//                                 <p className="text-xs text-gray-400 mt-2">4-20 characters • Letters and numbers only</p>
//                             </div>
//                             <div className="flex gap-3">
//                                 <button type="button" onClick={() => setShowEditModal(false)} className="flex-1 py-3 bg-slate-700 text-white rounded-lg font-semibold hover:bg-slate-600">
//                                     Cancel
//                                 </button>
//                                 <button type="submit" className="flex-1 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg">
//                                     Save Code
//                                 </button>
//                             </div>
//                         </form>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

"use client";

import DashboardStats from "@/app/components/DashboardStats";
import TierSystem from "@/app/components/TierSystem";
import { getTier } from "@/app/lib/products";
import { useState } from "react";
import { useAppSelector } from "@/app/redux/hooks";
import Link from "next/link";

export default function DashboardPage() {
    const user = useAppSelector((state) => state.auth.user);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newCode, setNewCode] = useState(user?.referralCode || "");

    const tier = getTier(user?.referralCount || 0);

    if (!user) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="container mx-auto px-4 py-8 text-center">
                    <p className="text-gray-400">Please log in to view your dashboard.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Dashboard Content */}
            <div className="container mx-auto px-4 py-6 md:py-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">Dashboard</h1>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                    <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
                        <h3 className="text-gray-400 text-sm mb-2">Your Tier</h3>
                        <div className="text-2xl md:text-3xl font-bold text-cyan-400">{tier.name}</div>
                        <p className="text-xs md:text-sm text-gray-400 mt-2">
                            {tier.discount}% discount • {tier.commission}% commission
                        </p>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
                        <h3 className="text-gray-400 text-sm mb-2">Invitations</h3>
                        <div className="text-2xl md:text-3xl font-bold text-white">{user.referralCount || 0}</div>
                        <p className="text-xs md:text-sm text-gray-400 mt-2">{user.referralCount >= 10 ? "Max tier reached!" : user.referralCount >= 3 ? `${10 - user.referralCount} more for Founder` : `${3 - (user.referralCount || 0)} more for VIP`}</p>
                    </div>

                    <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
                        <h3 className="text-gray-400 text-sm mb-2">Store Credit</h3>
                        <div className="text-2xl md:text-3xl font-bold text-green-400">${(user.storeCredit || 0).toFixed(2)}</div>
                        <p className="text-xs md:text-sm text-gray-400 mt-2">Available to use</p>
                    </div>
                </div>

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
                        <div className="text-2xl md:text-3xl font-bold text-cyan-400 text-center tracking-wider">{user.referralCode || "LOADING..."}</div>
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

                {/* How It Works */}
                <div className="bg-linear-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 md:p-6 border border-cyan-500/30 mb-6 md:mb-8">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4">💰 How It Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 md:mb-6">
                        <div className="bg-slate-900/50 rounded-lg p-4">
                            <div className="text-2xl mb-2">🔑</div>
                            <h3 className="text-cyan-400 font-bold mb-2">1. Invite</h3>
                            <p className="text-sm text-gray-300">Share your invitation code to give access to Peptide Club with 10% off for life!</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4">
                            <div className="text-2xl mb-2">📈</div>
                            <h3 className="text-cyan-400 font-bold mb-2">2. Earn</h3>
                            <p className="text-sm text-gray-300">Every time one of your members places an order, you earn more rewards—forever!</p>
                        </div>
                        <div className="bg-slate-900/50 rounded-lg p-4">
                            <div className="text-2xl mb-2">💳</div>
                            <h3 className="text-cyan-400 font-bold mb-2">3. Collect</h3>
                            <p className="text-sm text-gray-300">Get bigger discounts, increased store credit, and unlimited free shipping.</p>
                        </div>
                    </div>

                    {/* Tier Benefits */}
                    <div className="bg-slate-900/70 rounded-lg p-4 md:p-6">
                        <h3 className="text-white font-bold mb-3 md:mb-4">🎯 Tier Benefits</h3>
                        <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${tier.name === "Member" ? "bg-cyan-400" : "bg-gray-600"}`}></div>
                                    <span className="text-gray-300">Member</span>
                                </div>
                                <span className="text-gray-400 text-sm">10% discount • Free shipping $150+</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${tier.name === "VIP" ? "bg-cyan-400" : "bg-gray-600"}`}></div>
                                    <span className="text-gray-300">VIP (3+ invites)</span>
                                </div>
                                <span className="text-cyan-400 font-semibold text-sm">20% discount • 10% commission • Free shipping</span>
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${tier.name === "Founder" ? "bg-cyan-400" : "bg-gray-600"}`}></div>
                                    <span className="text-gray-300">Founder (10+ invites)</span>
                                </div>
                                <span className="text-green-400 font-bold text-sm">20% discount • 15% commission • Free shipping</span>
                            </div>
                        </div>
                    </div>
                </div>

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

                {/* Order History */}
                <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Order History</h2>

                    {/* Mock - no orders */}
                    <div className="text-center py-8 md:py-12 text-gray-400">
                        <div className="text-4xl md:text-6xl mb-4">📦</div>
                        <p className="mb-4">No orders yet</p>
                        <Link href="/store" className="inline-block px-6 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600">
                            Start Shopping
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
