import React from "react";

const HowItWorks = ({ stage = "Member" }: { stage?: string }) => {
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
