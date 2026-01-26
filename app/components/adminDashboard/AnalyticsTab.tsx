// "use client";

// import { useState, useEffect } from "react";

// interface Order {
//     id: string;
//     total: number;
// }

// export default function AnalyticsTab() {
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadOrders();
//     }, []);

//     const loadOrders = async () => {
//         try {
//             setLoading(true);
//             // Mock API call
//             await new Promise((resolve) => setTimeout(resolve, 500));

//             const mockOrders: Order[] = [
//                 { id: "1", total: 299.99 },
//                 { id: "2", total: 599.98 },
//                 { id: "3", total: 199.99 },
//             ];

//             setOrders(mockOrders);
//         } catch (error) {
//             console.error("Failed to load orders:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
//             </div>
//         );
//     }

//     const totalCommissions = orders.reduce((sum, order) => sum + order.total * 0.15, 0);

//     return (
//         <div>
//             <h2 className="text-3xl font-bold text-white mb-6">Analytics</h2>
//             <div className="grid md:grid-cols-2 gap-6">
//                 <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
//                     <h3 className="text-xl font-bold text-white mb-4">Top Selling Products</h3>
//                     <div className="space-y-3">
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-300">Retatrutide</span>
//                             <span className="text-cyan-400 font-bold">42 sales</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-300">BPC-157</span>
//                             <span className="text-cyan-400 font-bold">38 sales</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-300">NAD+</span>
//                             <span className="text-cyan-400 font-bold">31 sales</span>
//                         </div>
//                     </div>
//                 </div>
//                 <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
//                     <h3 className="text-xl font-bold text-white mb-4">Referral Performance</h3>
//                     <div className="space-y-3">
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-300">Top Referrer</span>
//                             <span className="text-cyan-400 font-bold">JAKE (15 referrals)</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-300">Total Commissions</span>
//                             <span className="text-green-400 font-bold">${totalCommissions.toFixed(2)}</span>
//                         </div>
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
    const referralPerformance = referralData?.data || {
        topReferrer: "No referrals yet",
        referrals: 0,
        totalCommissions: 0,
    };

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
                                <div key={product.id} className="flex justify-between items-center">
                                    <span className="text-gray-300">
                                        {index + 1}. {product.name}
                                    </span>
                                    <span className="text-cyan-400 font-bold">{product.sales} sales</span>
                                </div>
                            ))
                        ) : (
                            <div className="text-gray-400 text-center py-4">No sales data available</div>
                        )}
                    </div>
                </div>

                {/* Referral Performance */}
                {/* <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">Referral Performance</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Top Referrer</span>
                            <span className="text-cyan-400 font-bold">
                                {referralPerformance.topReferrer}
                                {referralPerformance.referrals > 0 && ` (${referralPerformance.referrals} referrals)`}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Total Commissions</span>
                            <span className="text-green-400 font-bold">${referralPerformance.totalCommissions.toFixed(2)}</span>
                        </div>
                    </div>
                </div> */}
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">Top Referrers</h3>
                    <div className="space-y-3">
                        {referralPerformance.map((item: any, index: any) => (
                            <div key={index} className="flex justify-between items-center">
                                <div className="text-gray-300">
                                    {index + 1}. {item.topReferrer}
                                    <span className="text-yellow-400 ml-2">({item.referrals})</span>
                                </div>
                                <div className="text-green-400 font-bold">${item.totalCommissions.toFixed(2)}</div>
                            </div>
                        ))}

                        {referralPerformance.length === 0 && <div className="text-gray-400 text-center py-4">No referrals yet</div>}
                    </div>
                </div>
            </div>
        </div>
    );
}
