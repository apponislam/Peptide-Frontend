"use client";

import { Tier, User } from "../types";

// import { User, Tier } from "@/types";
// import { getTier } from "@/lib/products";

interface DashboardStatsProps {
    user: User;
    tier: Tier;
}

export default function DashboardStats({ user, tier }: DashboardStatsProps) {
    const progressToNextTier = () => {
        if (tier.name === "Founder") return 100;
        if (tier.name === "VIP") {
            const progress = (user.referralCount / 10) * 100;
            return Math.min(progress, 100);
        }
        if (tier.name === "Member") {
            const progress = (user.referralCount / 3) * 100;
            return Math.min(progress, 100);
        }
        return 0;
    };

    const nextTier = () => {
        if (tier.name === "Member") return { name: "VIP", required: 3, current: user.referralCount };
        if (tier.name === "VIP") return { name: "Founder", required: 10, current: user.referralCount };
        return null;
    };

    const nextTierInfo = nextTier();

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Tier Card */}
            <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
                <h3 className="text-gray-400 text-sm mb-2">Your Tier</h3>
                <div className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2">{tier.name}</div>
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">✓</span>
                        <span className="text-gray-300">{tier.discount}% discount</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">✓</span>
                        <span className="text-gray-300">{tier.commission > 0 ? `${tier.commission}% commission` : "No commission"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-green-400">✓</span>
                        <span className="text-gray-300">{tier.freeShipping ? "Free shipping" : "Free shipping $150+"}</span>
                    </div>
                </div>
            </div>

            {/* Invitations Card */}
            <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
                <h3 className="text-gray-400 text-sm mb-2">Invitations</h3>
                <div className="text-2xl md:text-3xl font-bold text-white mb-2">{user.referralCount}</div>
                {nextTierInfo ? (
                    <div className="space-y-2">
                        <div className="text-xs text-gray-400">
                            {nextTierInfo.required - nextTierInfo.current} more for {nextTierInfo.name}
                        </div>
                        <div className="w-full bg-slate-700 rounded-full h-2">
                            <div className="bg-cyan-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressToNextTier()}%` }} />
                        </div>
                    </div>
                ) : (
                    <div className="text-green-400 text-sm">Max tier reached! 🎉</div>
                )}
            </div>

            {/* Store Credit Card */}
            <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
                <h3 className="text-gray-400 text-sm mb-2">Store Credit</h3>
                <div className="text-2xl md:text-3xl font-bold text-green-400 mb-2">${(user.storeCredit || 0).toFixed(2)}</div>
                <div className="space-y-2">
                    <p className="text-xs text-gray-400">Available to use on any purchase</p>
                    {user.storeCredit > 0 ? <div className="text-sm text-green-300">Will be automatically applied at checkout</div> : <div className="text-sm text-cyan-400">Earn credits by inviting members</div>}
                </div>
            </div>

            {/* Additional Stats Row (if needed) */}
            {user?.referredBy && (
                <div className="sm:col-span-3 bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-gray-400 text-sm mb-2">Referred By</h3>
                            <div className="text-xl font-bold text-cyan-400">{user.referredBy}</div>
                            <p className="text-xs text-gray-400 mt-1">You joined using this invitation code</p>
                        </div>
                        <div>
                            <h3 className="text-gray-400 text-sm mb-2">Your Code</h3>
                            <div className="text-xl font-bold text-white bg-slate-900 px-3 py-2 rounded-lg inline-block">{user.referralCode}</div>
                            <p className="text-xs text-gray-400 mt-1">Share to earn rewards</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
