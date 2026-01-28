"use client";

import { useGetUserByIdQuery } from "@/app/redux/features/admin/adminApi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState("overview");
    const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
    const [isResolving, setIsResolving] = useState(true);

    useEffect(() => {
        params
            .then((resolved) => {
                setResolvedParams(resolved);
                setIsResolving(false);
            })
            .catch(() => {
                setIsResolving(false);
            });
    }, [params]);
    const { data: userData, isLoading, isError, refetch } = useGetUserByIdQuery(resolvedParams?.id || "", { skip: !resolvedParams?.id });

    if (isResolving || isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="p-4 md:p-6 container mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!resolvedParams?.id) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="p-4 md:p-6 container mx-auto">
                    <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors mb-6">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">Invalid User ID</h2>
                        <p className="text-gray-400">Unable to parse user ID from URL.</p>
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !userData?.data) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="p-4 md:p-6 container mx-auto">
                    <button onClick={() => router.push("/admin?tab=users")} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors mb-6">
                        <ArrowLeft size={20} /> Back to Users
                    </button>
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
                        <h2 className="text-2xl font-bold text-white mb-2">User Not Found</h2>
                        <p className="text-gray-400">The user you're looking for doesn't exist or you don't have permission to view it.</p>
                    </div>
                </div>
            </div>
        );
    }
    const userId = resolvedParams.id;
    const { user, stats } = userData.data;
    const { name, email, role, tier, referralCode, storeCredit, referralCount, isReferralValid, createdAt, updatedAt, orders = [], referrals = [], commissionsEarned = [], referrer, shippingCredit } = user;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
            <div className="p-4 md:p-6 container mx-auto ">
                {/* Back Button and Header */}
                <div className="mb-6 flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors cursor-pointer">
                        <ArrowLeft size={20} /> Go Back
                    </button>
                    <button onClick={() => refetch()} className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm cursor-pointer">
                        Refresh
                    </button>
                </div>

                {/* User Profile Header */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-linear-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-xl font-bold text-white">{name?.charAt(0).toUpperCase() || email?.charAt(0).toUpperCase()}</div>
                        <div className="flex-1">
                            <h1 className="text-2xl font-bold text-white">{name || "No Name"}</h1>
                            <div className="flex items-center gap-3 mt-1">
                                <p className="text-gray-400">{email}</p>
                                <span className={`px-2 py-1 text-xs rounded ${role === "ADMIN" ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400"}`}>{role}</span>
                                <span className={`px-2 py-1 text-xs rounded ${tier === "Founder" ? "bg-purple-500/20 text-purple-400" : tier === "VIP" ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>{tier}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold text-green-400">${storeCredit.toFixed(2)}</p>
                            <p className="text-gray-400 text-sm">Store Credit</p>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-gray-400 text-sm">Total Spent</p>
                        <p className="text-2xl font-bold text-white">${stats.totalSpent.toFixed(2)}</p>
                        <p className="text-gray-400 text-xs mt-1">{stats.totalOrders} orders</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-gray-400 text-sm">Referrals</p>
                        <p className="text-2xl font-bold text-white">{stats.totalReferrals}</p>
                        <p className="text-gray-400 text-xs mt-1">{stats.validReferrals} valid</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-gray-400 text-sm">Commissions</p>
                        <p className="text-2xl font-bold text-white">${stats.totalCommissionsEarned.toFixed(2)}</p>
                        <p className="text-gray-400 text-xs mt-1">{commissionsEarned.length} transactions</p>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="text-gray-400 text-sm">Recent Orders</p>
                        <p className="text-2xl font-bold text-white">{stats.recentOrdersLast30Days}</p>
                        <p className="text-gray-400 text-xs mt-1">Last 30 days</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="mb-6">
                    <div className="flex border-b border-gray-700">
                        {["overview", "orders", "referrals", "commissions"].map((tab) => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-6 py-3 font-medium capitalize ${activeTab === tab ? "text-cyan-400 border-b-2 border-cyan-400" : "text-gray-400 hover:text-white"}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                    {activeTab === "overview" && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-3">User Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-400 text-sm">User ID</p>
                                        <p className="text-white font-mono text-sm">{userId}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Referral Code</p>
                                        <p className="text-white font-mono">{referralCode}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Member Since</p>
                                        <p className="text-white">{new Date(createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-400 text-sm">Referral Count</p>
                                        <p className="text-white">{referralCount}</p>
                                    </div>
                                    {/* Show shipping credit for Members only */}
                                    {tier === "Member" && (
                                        <div>
                                            <p className="text-gray-400 text-sm">Free Shipping Credit</p>
                                            <p className="text-white">${shippingCredit?.toFixed(2) || "0.00"}</p>
                                            <p className="text-gray-400 text-xs">{shippingCredit > 0 ? `${(shippingCredit / 6.75).toFixed(0)} free shipments left` : "Credit used up"}</p>
                                        </div>
                                    )}

                                    {/* For Founder/VIP - show free shipping status */}
                                    {(tier === "Founder" || tier === "VIP") && (
                                        <div>
                                            <p className="text-gray-400 text-sm">Shipping Status</p>
                                            <span className="px-2 py-1 text-xs rounded bg-green-500/20 text-green-400">Free Shipping</span>
                                        </div>
                                    )}
                                    {/* <div>
                                        <p className="text-gray-400 text-sm">Referral Status</p>
                                        <span className={`px-2 py-1 text-xs rounded ${isReferralValid ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>{isReferralValid ? "Valid" : "Pending"}</span>
                                    </div> */}
                                    {referrer && (
                                        <div>
                                            <p className="text-gray-400 text-sm">Referred By</p>
                                            <p className="text-white">{referrer.name || "Unknown"}</p>
                                            <p className="text-gray-400 text-xs">{referrer.email}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "orders" && (
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Recent Orders ({orders.length})</h3>
                            {orders.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="text-left py-3 text-gray-400 text-sm">Order ID</th>
                                                <th className="text-left py-3 text-gray-400 text-sm">Date</th>
                                                <th className="text-left py-3 text-gray-400 text-sm">Total</th>
                                                <th className="text-left py-3 text-gray-400 text-sm">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map((order: any) => (
                                                <tr key={order.id} className="border-b border-gray-800 hover:bg-white/5">
                                                    <td className="py-3">
                                                        <p className="text-white font-mono text-sm">{order.id}</p>
                                                    </td>
                                                    <td className="py-3 text-gray-400 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                                                    <td className="py-3 text-white text-sm">${order.total.toFixed(2)}</td>
                                                    <td className="py-3">
                                                        <span className={`px-2 py-1 text-xs rounded ${order.status === "PAID" ? "bg-green-500/20 text-green-400" : order.status === "PENDING" ? "bg-yellow-500/20 text-yellow-400" : "bg-gray-500/20 text-gray-400"}`}>{order.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400">No orders found</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "referrals" && (
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Referrals ({referrals.length})</h3>
                            {referrals.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {referrals.map((referral: any) => (
                                        <div key={referral.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                                            <div className="flex items-start justify-between">
                                                <div>
                                                    <p className="text-white font-medium">{referral.name || "No Name"}</p>
                                                    <p className="text-gray-400 text-sm">{referral.email}</p>
                                                    <p className="text-gray-500 text-xs mt-1">Joined: {new Date(referral.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <span className={`px-2 py-1 text-xs rounded ${referral.isReferralValid ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>{referral.isReferralValid ? "Valid" : "Pending"}</span>
                                            </div>
                                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                                                <div>
                                                    <p className="text-gray-400 text-xs">Tier</p>
                                                    <p className="text-white text-sm">{referral.tier}</p>
                                                </div>
                                                <div>
                                                    <p className="text-gray-400 text-xs">Credit</p>
                                                    <p className="text-green-400 text-sm">${referral.storeCredit.toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400">No referrals yet</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "commissions" && (
                        <div>
                            <h3 className="text-lg font-semibold text-white mb-4">Commissions Earned ({commissionsEarned.length})</h3>
                            {commissionsEarned.length > 0 ? (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b border-gray-700">
                                                <th className="text-left py-3 text-gray-400 text-sm">Date</th>
                                                <th className="text-left py-3 text-gray-400 text-sm">Buyer</th>
                                                <th className="text-left py-3 text-gray-400 text-sm">Amount</th>
                                                <th className="text-left py-3 text-gray-400 text-sm">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {commissionsEarned.map((commission: any) => (
                                                <tr key={commission.id} className="border-b border-gray-800 hover:bg-white/5">
                                                    <td className="py-3 text-gray-400 text-sm">{new Date(commission.createdAt).toLocaleDateString()}</td>
                                                    <td className="py-3">
                                                        <p className="text-white text-sm">{commission.buyer?.name || "Unknown"}</p>
                                                        <p className="text-gray-400 text-xs">{commission.buyer?.email || ""}</p>
                                                    </td>
                                                    <td className="py-3 text-green-400 text-sm">${commission.amount.toFixed(2)}</td>
                                                    <td className="py-3">
                                                        <span className={`px-2 py-1 text-xs rounded ${commission.status === "PAID" ? "bg-green-500/20 text-green-400" : commission.status === "PENDING" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>{commission.status}</span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400">No commissions earned yet</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
