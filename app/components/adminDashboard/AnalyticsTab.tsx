// "use client";

// import { useState, useEffect } from "react";
// import { useGetTopSellingProductsQuery, useGetReferralPerformanceQuery } from "@/app/redux/features/admin/adminApi";

// export default function AnalyticsTab() {
//     const [loading, setLoading] = useState(true);

//     // Use your API hooks
//     const { data: topProductsData, isLoading: productsLoading } = useGetTopSellingProductsQuery(3);
//     const { data: referralData, isLoading: referralLoading } = useGetReferralPerformanceQuery({});

//     useEffect(() => {
//         // Set loading false when both queries are done
//         if (!productsLoading && !referralLoading) {
//             setLoading(false);
//         }
//     }, [productsLoading, referralLoading]);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
//             </div>
//         );
//     }

//     // Extract data
//     const topProducts = topProductsData?.data || [];

//     // Handle both array and object formats for referralPerformance
//     const referralDataRaw = referralData?.data || [];
//     const referralPerformance = Array.isArray(referralDataRaw) ? referralDataRaw : [referralDataRaw];

//     return (
//         <div>
//             <h2 className="text-3xl font-bold text-white mb-6">Analytics</h2>
//             <div className="grid md:grid-cols-2 gap-6">
//                 {/* Top Selling Products */}
//                 <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
//                     <h3 className="text-xl font-bold text-white mb-4">Top Selling Products</h3>
//                     <div className="space-y-3">
//                         {topProducts.length > 0 ? (
//                             topProducts.map((product: any, index: any) => (
//                                 <div key={product.id || index} className="flex justify-between items-center">
//                                     <span className="text-gray-300">
//                                         {index + 1}. {product.name}
//                                     </span>
//                                     <span className="text-cyan-400 font-bold">{product.sales || product.totalQuantity || 0} sales</span>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="text-gray-400 text-center py-4">No sales data available</div>
//                         )}
//                     </div>
//                 </div>

//                 {/* Referral Performance */}
//                 <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
//                     <h3 className="text-xl font-bold text-white mb-4">Top Referrers</h3>
//                     <div className="space-y-3">
//                         {referralPerformance.length > 0 ? (
//                             referralPerformance.map((item: any, index: number) => (
//                                 <div key={index} className="flex justify-between items-center">
//                                     <div className="text-gray-300">
//                                         {index + 1}. {item.topReferrer || item.name || "Unknown"}
//                                         <span className="text-yellow-400 ml-2">({item.referrals || item.referralCount || 0})</span>
//                                     </div>
//                                     <div className="text-green-400 font-bold">${(item.totalCommissions || 0).toFixed(2)}</div>
//                                 </div>
//                             ))
//                         ) : (
//                             <div className="text-gray-400 text-center py-4">No referrals yet</div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import { useState, useEffect } from "react";
import { useGetTopSellingProductsQuery, useGetReferralPerformanceQuery } from "@/app/redux/features/admin/adminApi";

export default function AnalyticsTab() {
    const [loading, setLoading] = useState(true);

    // Filter states
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-indexed

    const [selectedYear, setSelectedYear] = useState<number | undefined>(currentYear);
    const [selectedMonth, setSelectedMonth] = useState<number | undefined>(undefined);
    const [selectedTier, setSelectedTier] = useState<string | undefined>(undefined);

    // Generate years from current -5 to current +5
    const generateYears = () => {
        const years = [];
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
            years.push(i);
        }
        return years;
    };

    const availableYears = generateYears();

    const months = [
        { value: 1, label: "January" },
        { value: 2, label: "February" },
        { value: 3, label: "March" },
        { value: 4, label: "April" },
        { value: 5, label: "May" },
        { value: 6, label: "June" },
        { value: 7, label: "July" },
        { value: 8, label: "August" },
        { value: 9, label: "September" },
        { value: 10, label: "October" },
        { value: 11, label: "November" },
        { value: 12, label: "December" },
    ];

    const tiers = [
        { value: "Member", label: "Member" },
        { value: "Founder", label: "Founder" },
        { value: "VIP", label: "VIP" },
    ];

    // Use your API hooks with filters
    const {
        data: topProductsData,
        isLoading: productsLoading,
        refetch: refetchProducts,
    } = useGetTopSellingProductsQuery({
        limit: 5,
        year: selectedYear,
        month: selectedMonth,
    });

    const {
        data: referralData,
        isLoading: referralLoading,
        refetch: refetchReferral,
    } = useGetReferralPerformanceQuery({
        tier: selectedTier,
    });

    useEffect(() => {
        // Set loading false when both queries are done
        if (!productsLoading && !referralLoading) {
            setLoading(false);
        }
    }, [productsLoading, referralLoading]);

    // Handle filter changes
    const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value ? parseInt(e.target.value) : undefined;
        setSelectedYear(value);
    };

    const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value ? parseInt(e.target.value) : undefined;
        setSelectedMonth(value);
    };

    const handleTierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value || undefined;
        setSelectedTier(value);
    };

    const handleReset = () => {
        setSelectedYear(currentYear);
        setSelectedMonth(undefined);
        setSelectedTier(undefined);
    };

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
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-white">Analytics</h2>

                {/* Filter Controls */}
                <div className="flex gap-3 items-center">
                    {/* Year Filter */}
                    <select value={selectedYear || ""} onChange={handleYearChange} className="bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm">
                        <option value="">All Years</option>
                        {availableYears.map((year) => (
                            <option key={year} value={year}>
                                {year}
                            </option>
                        ))}
                    </select>

                    {/* Month Filter */}
                    <select value={selectedMonth || ""} onChange={handleMonthChange} className="bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm">
                        <option value="">All Months</option>
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.label}
                            </option>
                        ))}
                    </select>

                    {/* Tier Filter */}
                    <select value={selectedTier || ""} onChange={handleTierChange} className="bg-slate-700 text-white border border-slate-600 rounded-lg px-3 py-2 text-sm">
                        <option value="">All Tiers</option>
                        {tiers.map((tier) => (
                            <option key={tier.value} value={tier.value}>
                                {tier.label}
                            </option>
                        ))}
                    </select>

                    {/* Reset Button */}
                    <button onClick={handleReset} className="bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg text-sm transition-colors">
                        Reset
                    </button>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Top Selling Products */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">Top Selling Products</h3>
                        {(selectedYear || selectedMonth) && <span className="text-xs text-gray-400">{selectedYear && selectedMonth ? `${months.find((m) => m.value === selectedMonth)?.label} ${selectedYear}` : selectedYear ? `Year ${selectedYear}` : selectedMonth ? `${months.find((m) => m.value === selectedMonth)?.label}` : ""}</span>}
                    </div>
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
                            <div className="text-gray-400 text-center py-4">No sales data available for selected period</div>
                        )}
                    </div>
                </div>

                {/* Referral Performance */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-white">Top Referrers</h3>
                        {selectedTier && <span className="text-xs text-gray-400">{selectedTier} Tier</span>}
                    </div>
                    <div className="space-y-3">
                        {referralPerformance.length > 0 ? (
                            referralPerformance.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between items-center">
                                    <div className="text-gray-300">
                                        {index + 1}. {item.topReferrer || item.name || "Unknown"}
                                        <span className="text-yellow-400 ml-2">({item.referrals || item.referralCount || 0})</span>
                                        {item.tier && <span className="text-xs bg-slate-700 ml-2 px-2 py-0.5 rounded">{item.tier}</span>}
                                    </div>
                                    <div className="text-green-400 font-bold">${(item.totalCommissions || 0).toFixed(2)}</div>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400 text-center py-4">{selectedTier ? `No ${selectedTier} referrals yet` : "No referrals yet"}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
