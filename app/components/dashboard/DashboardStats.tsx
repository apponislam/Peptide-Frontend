"use client";

import { getTier } from "../../lib/products";
import { Tier, User } from "../../types";

interface DashboardStatsProps {
    user?: User | null;
}

export default function DashboardStats({ user }: DashboardStatsProps) {
    const tier = getTier(user?.referralCount || 0);
    const currentTier = tier || {
        name: "Member",
        discount: 10,
        commission: 0,
        freeShipping: false,
    };

    const currentUser = user || {
        referralCount: 0,
        storeCredit: 0,
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {/* Tier Card */}
            <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
                <h3 className="text-gray-400 text-sm mb-2">Your Tier</h3>
                <div className="text-2xl md:text-3xl font-bold text-cyan-400">{currentTier.name}</div>
                <p className="text-xs md:text-sm text-gray-400 mt-2">
                    {currentTier.discount}% discount • {currentTier.commission}% commission
                </p>
            </div>

            {/* Invitations Card */}
            <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
                <h3 className="text-gray-400 text-sm mb-2">Invitations</h3>
                <div className="text-2xl md:text-3xl font-bold text-white">{currentUser.referralCount || 0}</div>
                <p className="text-xs md:text-sm text-gray-400 mt-2">{currentUser.referralCount >= 10 ? "Max tier reached!" : currentUser.referralCount >= 3 ? `${10 - currentUser.referralCount} more for Founder` : `${3 - (currentUser.referralCount || 0)} more for VIP`}</p>
            </div>

            {/* Store Credit Card */}
            <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
                <h3 className="text-gray-400 text-sm mb-2">Store Credit</h3>
                <div className="text-2xl md:text-3xl font-bold text-green-400">${(currentUser.storeCredit || 0).toFixed(2)}</div>
                <p className="text-xs md:text-sm text-gray-400 mt-2">Available to use</p>
            </div>
        </div>
    );
}
