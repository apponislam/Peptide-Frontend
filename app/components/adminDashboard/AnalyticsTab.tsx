"use client";

import { useState, useEffect } from "react";
import { useGetTopSellingProductsQuery, useGetReferralPerformanceQuery } from "@/app/redux/features/admin/adminApi";

export default function AnalyticsTab() {
    const [loading, setLoading] = useState(true);

    // Use your API hooks
    const { data: topProductsData, isLoading: productsLoading } = useGetTopSellingProductsQuery(3);
    const { data: referralData, isLoading: referralLoading } = useGetReferralPerformanceQuery({});

    useEffect(() => {
        // Set loading false when both queries are done
        if (!productsLoading && !referralLoading) {
            setLoading(false);
        }
    }, [productsLoading, referralLoading]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    // Extract data
    const topProducts = topProductsData?.data || [];

    // Handle both array and object formats for referralPerformance
    const referralDataRaw = referralData?.data || [];
    const referralPerformance = Array.isArray(referralDataRaw) ? referralDataRaw : [referralDataRaw];

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">Analytics</h2>
            <div className="grid md:grid-cols-2 gap-6">
                {/* Top Selling Products */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">Top Selling Products</h3>
                    <div className="space-y-3">
                        {topProducts.length > 0 ? (
                            topProducts.map((product: any, index: any) => (
                                <div key={product.id || index} className="flex justify-between items-center">
                                    <span className="text-gray-300">
                                        {index + 1}. {product.name}
                                    </span>
                                    <span className="text-cyan-400 font-bold">{product.sales || product.totalQuantity || 0} sales</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400 text-center py-4">No sales data available</div>
                        )}
                    </div>
                </div>

                {/* Referral Performance */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">Top Referrers</h3>
                    <div className="space-y-3">
                        {referralPerformance.length > 0 ? (
                            referralPerformance.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="text-gray-300">
                                        {index + 1}. {item.topReferrer || item.name || "Unknown"}
                                        <span className="text-yellow-400 ml-2">({item.referrals || item.referralCount || 0})</span>
                                    </div>
                                    <div className="text-green-400 font-bold">${(item.totalCommissions || 0).toFixed(2)}</div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400 text-center py-4">No referrals yet</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
