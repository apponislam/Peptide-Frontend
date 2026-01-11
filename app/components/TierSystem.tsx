"use client";

import { getTier } from "../lib/products";
import { User } from "../types";

// import { User } from "@/types";
// import { getTier } from "@/lib/products";

interface TierSystemProps {
    user: User;
}

export default function TierSystem({ user }: TierSystemProps) {
    const tiers = [
        {
            name: "Member",
            referrals: 0,
            discount: 10,
            commission: 0,
            freeShipping: false,
            description: "10% discount • Free shipping $150+",
        },
        {
            name: "VIP",
            referrals: 3,
            discount: 20,
            commission: 10,
            freeShipping: true,
            description: "20% discount • 10% commission • Free shipping",
        },
        {
            name: "Founder",
            referrals: 10,
            discount: 20,
            commission: 15,
            freeShipping: true,
            description: "20% discount • 15% commission • Free shipping",
        },
    ];

    const currentTier = getTier(user.referralCount || 0);

    return (
        <div className="bg-linear-to-br from-cyan-500/10 to-blue-500/10 rounded-xl p-4 md:p-6 border border-cyan-500/30 mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4">💰 How It Works</h2>

            {/* Tier Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 md:mb-6">
                {tiers.map((tier, index) => {
                    const isCurrent = tier.name === currentTier.name;
                    const isUnlocked = user.referralCount >= tier.referrals;
                    const isNext = index > tiers.findIndex((t) => t.name === currentTier.name);

                    return (
                        <div key={tier.name} className={`bg-slate-900/50 rounded-lg p-4 border ${isCurrent ? "border-cyan-500" : isUnlocked ? "border-green-500/50" : "border-slate-700"}`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full ${isCurrent ? "bg-cyan-400 animate-pulse" : isUnlocked ? "bg-green-400" : "bg-gray-600"}`} />
                                    <h3 className={`font-bold ${isCurrent ? "text-cyan-400" : "text-gray-300"}`}>{tier.name}</h3>
                                </div>
                                {isCurrent && <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded">Current</span>}
                            </div>

                            <div className="mb-3">
                                <p className="text-sm text-gray-300 mb-1">{tier.description}</p>
                                <p className="text-xs text-gray-400">{tier.referrals === 0 ? "Starting tier" : `Requires ${tier.referrals} referrals`}</p>
                            </div>

                            <div className="text-xs">
                                {!isUnlocked ? (
                                    <div className="text-amber-400">
                                        Need {tier.referrals - user.referralCount} more referral{tier.referrals - user.referralCount !== 1 ? "s" : ""}
                                    </div>
                                ) : (
                                    <div className="text-green-400 flex items-center gap-1">
                                        <span>✓</span>
                                        <span>{isCurrent ? "Active" : "Unlocked"}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* How It Works Steps */}
            <div className="bg-slate-900/70 rounded-lg p-4 md:p-6">
                <h3 className="text-white font-bold mb-3 md:mb-4">🎯 How to Level Up</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-sm font-bold">1</div>
                            <span className="text-cyan-400 font-semibold">Invite</span>
                        </div>
                        <p className="text-sm text-gray-300">Share your invitation code with researchers and colleagues</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-sm font-bold">2</div>
                            <span className="text-cyan-400 font-semibold">Earn</span>
                        </div>
                        <p className="text-sm text-gray-300">Get commissions on every purchase your referrals make—forever!</p>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center text-sm font-bold">3</div>
                            <span className="text-cyan-400 font-semibold">Level Up</span>
                        </div>
                        <p className="text-sm text-gray-300">Reach VIP at 3 referrals, Founder at 10. Get bigger rewards!</p>
                    </div>
                </div>
            </div>

            {/* Referral Progress */}
            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-300">Progress to {currentTier.name === "Founder" ? "max tier" : "next tier"}</span>
                    <span className="text-cyan-400 font-bold">
                        {user.referralCount}/{currentTier.name === "Founder" ? "10+" : currentTier.name === "VIP" ? "10" : "3"}
                    </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div
                        className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2.5 rounded-full transition-all duration-500"
                        style={{
                            width: `${currentTier.name === "Founder" ? 100 : currentTier.name === "VIP" ? (user.referralCount / 10) * 100 : (user.referralCount / 3) * 100}%`,
                        }}
                    />
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>Member (0)</span>
                    <span>VIP (3)</span>
                    <span>Founder (10)</span>
                </div>
            </div>
        </div>
    );
}
