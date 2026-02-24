// import { useGetMyReferralsQuery } from "@/app/redux/features/auth/authApi";
// import React from "react";

// const HowItWorks = ({ stage = "Member" }: { stage?: string }) => {
//     const { data } = useGetMyReferralsQuery({});
//     console.log(data);

//     return (
//         <div className="bg-linear-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 md:p-6 border border-cyan-500/30 mb-6 md:mb-8">
//             <h2 className="text-xl md:text-2xl font-bold text-white mb-4">💰 How It Works</h2>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 md:mb-6">
//                 <div className="bg-slate-900/50 rounded-lg p-4">
//                     <div className="text-2xl mb-2">🔑</div>
//                     <h3 className="text-cyan-400 font-bold mb-2">1. Invite</h3>
//                     <p className="text-sm text-gray-300">Share your invitation code to give access to Peptide Club with 10% off for life!</p>
//                 </div>
//                 <div className="bg-slate-900/50 rounded-lg p-4">
//                     <div className="text-2xl mb-2">📈</div>
//                     <h3 className="text-cyan-400 font-bold mb-2">2. Earn</h3>
//                     <p className="text-sm text-gray-300">Every time one of your members places an order, you earn more rewards—forever!</p>
//                 </div>
//                 <div className="bg-slate-900/50 rounded-lg p-4">
//                     <div className="text-2xl mb-2">💳</div>
//                     <h3 className="text-cyan-400 font-bold mb-2">3. Collect</h3>
//                     <p className="text-sm text-gray-300">Get bigger discounts, increased store credit, and unlimited free shipping.</p>
//                 </div>
//             </div>

//             {/* Tier Benefits */}
//             <div className="bg-slate-900/70 rounded-lg p-4 md:p-6">
//                 <h3 className="text-white font-bold mb-3 md:mb-4">🎯 Tier Benefits</h3>
//                 <div className="space-y-3">
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                         <div className="flex items-center gap-3">
//                             <div className={`w-2 h-2 rounded-full ${stage === "Member" ? "bg-cyan-400" : "bg-gray-600"}`}></div>
//                             <span className="text-gray-300">Member</span>
//                         </div>
//                         <span className="text-gray-400 text-sm">10% discount • Free shipping $150+</span>
//                     </div>
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                         <div className="flex items-center gap-3">
//                             <div className={`w-2 h-2 rounded-full ${stage === "VIP" ? "bg-cyan-400" : "bg-gray-600"}`}></div>
//                             <span className="text-gray-300">VIP (3+ invites)</span>
//                         </div>
//                         <span className="text-cyan-400 font-semibold text-sm">20% discount • 10% commission • Free shipping</span>
//                     </div>
//                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//                         <div className="flex items-center gap-3">
//                             <div className={`w-2 h-2 rounded-full ${stage === "Founder" ? "bg-cyan-400" : "bg-gray-600"}`}></div>
//                             <span className="text-gray-300">Founder (10+ invites)</span>
//                         </div>
//                         <span className="text-green-400 font-bold text-sm">20% discount • 15% commission • Free shipping</span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default HowItWorks;

import { useGetMyReferralsQuery } from "@/app/redux/features/auth/authApi";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Users, Clock, CheckCircle, XCircle } from "lucide-react";

const HowItWorks = ({ stage = "Member" }: { stage?: string }) => {
    const [page, setPage] = useState(1);
    const limit = 3; // Show 3 per page

    const { data, isLoading } = useGetMyReferralsQuery({ page, limit });
    const referrals = data?.data || [];
    const meta = data?.meta;

    const totalReferrals = meta?.total || 0;
    const hasNextPage = page < (meta?.totalPages || 1);
    const hasPrevPage = page > 1;

    return (
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

            {/* Referrals Box - New */}
            <div className="bg-slate-900/70 rounded-lg p-4 md:p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-cyan-400" />
                        <h3 className="text-white font-bold">My Referrals ({totalReferrals})</h3>
                    </div>

                    {/* Pagination Controls */}
                    {totalReferrals > 0 && (
                        <div className="flex items-center gap-2">
                            <button onClick={() => setPage((p) => p - 1)} disabled={!hasPrevPage} className="p-1 rounded bg-slate-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <span className="text-sm text-gray-400">
                                {page} / {meta?.totalPages}
                            </span>
                            <button onClick={() => setPage((p) => p + 1)} disabled={!hasNextPage} className="p-1 rounded bg-slate-800 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400 mx-auto"></div>
                    </div>
                ) : referrals.length > 0 ? (
                    <div className="space-y-3">
                        {referrals.map((referral) => (
                            <div key={referral.id} className="bg-slate-800/50 rounded-lg p-3 flex items-center justify-between">
                                <div>
                                    <p className="text-white font-medium">{referral.name}</p>
                                    <p className="text-sm text-gray-400">{referral.email}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4 text-gray-500" />
                                        <span className="text-xs text-gray-500">{new Date(referral.joinedAt).toLocaleDateString()}</span>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full flex items-center gap-1 ${referral.status === "Confirmed" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                                        {referral.status === "Confirmed" ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                                        {referral.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No referrals yet</p>
                        <p className="text-sm text-gray-500 mt-1">Share your invitation code to start earning!</p>
                    </div>
                )}
            </div>

            {/* Tier Benefits */}
            <div className="bg-slate-900/70 rounded-lg p-4 md:p-6">
                <h3 className="text-white font-bold mb-3 md:mb-4">🎯 Tier Benefits</h3>
                <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${stage === "Member" ? "bg-cyan-400" : "bg-gray-600"}`}></div>
                            <span className="text-gray-300">Member</span>
                        </div>
                        <span className="text-gray-400 text-sm">10% discount • Free shipping $150+</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${stage === "VIP" ? "bg-cyan-400" : "bg-gray-600"}`}></div>
                            <span className="text-gray-300">VIP (3+ invites)</span>
                        </div>
                        <span className="text-cyan-400 font-semibold text-sm">20% discount • 10% commission • Free shipping</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-3">
                            <div className={`w-2 h-2 rounded-full ${stage === "Founder" ? "bg-cyan-400" : "bg-gray-600"}`}></div>
                            <span className="text-gray-300">Founder (10+ invites)</span>
                        </div>
                        <span className="text-green-400 font-bold text-sm">20% discount • 15% commission • Free shipping</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
