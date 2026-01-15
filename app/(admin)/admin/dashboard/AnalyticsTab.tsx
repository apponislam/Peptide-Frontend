// interface AnalyticsTabProps {
//     orders: any[];
//     loading: boolean;
// }

// export default function AnalyticsTab({ orders, loading }: AnalyticsTabProps) {
//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
//             </div>
//         );
//     }

//     const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
//     const totalCommissions = totalRevenue * 0.15;

//     return (
//         <div>
//             <h2 className="text-3xl font-bold text-white mb-6">Analytics</h2>

//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//                 <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
//                     <h3 className="text-xl font-bold text-white mb-6">Top Selling Products</h3>
//                     <div className="space-y-4">
//                         {[
//                             { name: "Retatrutide", sales: 42, revenue: 12579.58 },
//                             { name: "BPC-157", sales: 38, revenue: 11398.62 },
//                             { name: "NAD+", sales: 31, revenue: 9299.69 },
//                             { name: "CJC-1295", sales: 27, revenue: 8099.73 },
//                             { name: "Ipamorelin", sales: 23, revenue: 6899.77 },
//                         ].map((product, index) => (
//                             <div key={index} className="flex items-center justify-between p-3 hover:bg-slate-900/50 rounded-lg transition-colors">
//                                 <div className="flex items-center gap-3">
//                                     <div className={`h-10 w-10 rounded-full flex items-center justify-center ${index === 0 ? "bg-amber-500/20 text-amber-400" : index === 1 ? "bg-cyan-500/20 text-cyan-400" : index === 2 ? "bg-purple-500/20 text-purple-400" : "bg-slate-700 text-gray-400"}`}>
//                                         <span className="font-bold">#{index + 1}</span>
//                                     </div>
//                                     <div>
//                                         <p className="text-white font-medium">{product.name}</p>
//                                         <p className="text-sm text-gray-400">{product.sales} sales</p>
//                                     </div>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-green-400 font-bold">${product.revenue.toFixed(2)}</p>
//                                     <p className="text-sm text-gray-400">${(product.revenue / product.sales).toFixed(2)} avg</p>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
//                     <h3 className="text-xl font-bold text-white mb-6">Referral Performance</h3>
//                     <div className="space-y-6">
//                         <div className="p-4 bg-slate-900/50 rounded-lg">
//                             <div className="flex justify-between items-center mb-2">
//                                 <span className="text-gray-300">Top Referrer</span>
//                                 <span className="text-cyan-400 font-bold">JAKE</span>
//                             </div>
//                             <div className="flex justify-between items-center text-sm text-gray-400">
//                                 <span>15 referrals</span>
//                                 <span>$450 in commissions</span>
//                             </div>
//                         </div>

//                         <div className="p-4 bg-slate-900/50 rounded-lg">
//                             <div className="flex justify-between items-center mb-2">
//                                 <span className="text-gray-300">Total Commissions</span>
//                                 <span className="text-green-400 font-bold">${totalCommissions.toFixed(2)}</span>
//                             </div>
//                             <div className="flex justify-between items-center text-sm text-gray-400">
//                                 <span>Paid out to referrers</span>
//                                 <span>15% of total revenue</span>
//                             </div>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4">
//                             <div className="p-4 bg-slate-900/50 rounded-lg">
//                                 <p className="text-gray-400 text-sm mb-1">Referral Signups</p>
//                                 <p className="text-2xl font-bold text-white">89</p>
//                             </div>
//                             <div className="p-4 bg-slate-900/50 rounded-lg">
//                                 <p className="text-gray-400 text-sm mb-1">Conversion Rate</p>
//                                 <p className="text-2xl font-bold text-green-400">12.5%</p>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
//                     <h3 className="text-xl font-bold text-white mb-4">Revenue Trends</h3>
//                     <div className="space-y-3">
//                         {["This Week", "This Month", "This Quarter"].map((period, index) => (
//                             <div key={index} className="flex justify-between items-center p-3 hover:bg-slate-900/50 rounded-lg">
//                                 <span className="text-gray-300">{period}</span>
//                                 <span className="text-green-400 font-bold">${(totalRevenue * (0.3 + index * 0.2)).toFixed(2)}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
//                     <h3 className="text-xl font-bold text-white mb-4">Customer Insights</h3>
//                     <div className="space-y-3">
//                         <div className="flex justify-between items-center p-3 hover:bg-slate-900/50 rounded-lg">
//                             <span className="text-gray-300">Avg. Order Value</span>
//                             <span className="text-cyan-400 font-bold">$287.45</span>
//                         </div>
//                         <div className="flex justify-between items-center p-3 hover:bg-slate-900/50 rounded-lg">
//                             <span className="text-gray-300">Repeat Purchase Rate</span>
//                             <span className="text-purple-400 font-bold">42%</span>
//                         </div>
//                         <div className="flex justify-between items-center p-3 hover:bg-slate-900/50 rounded-lg">
//                             <span className="text-gray-300">Customer Lifetime Value</span>
//                             <span className="text-green-400 font-bold">$1,249.80</span>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
//                     <h3 className="text-xl font-bold text-white mb-4">Platform Health</h3>
//                     <div className="space-y-3">
//                         <div className="flex justify-between items-center p-3 hover:bg-slate-900/50 rounded-lg">
//                             <span className="text-gray-300">Active Users</span>
//                             <span className="text-green-400 font-bold">89</span>
//                         </div>
//                         <div className="flex justify-between items-center p-3 hover:bg-slate-900/50 rounded-lg">
//                             <span className="text-gray-300">Cart Abandonment</span>
//                             <span className="text-yellow-400 font-bold">18%</span>
//                         </div>
//                         <div className="flex justify-between items-center p-3 hover:bg-slate-900/50 rounded-lg">
//                             <span className="text-gray-300">Support Tickets</span>
//                             <span className="text-blue-400 font-bold">7</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// components/admin/tabs/AnalyticsTab.tsx
"use client";

import { useState, useEffect } from "react";

interface Order {
    id: string;
    total: number;
}

export default function AnalyticsTab() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            const mockOrders: Order[] = [
                { id: "1", total: 299.99 },
                { id: "2", total: 599.98 },
                { id: "3", total: 199.99 },
            ];

            setOrders(mockOrders);
        } catch (error) {
            console.error("Failed to load orders:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    const totalCommissions = orders.reduce((sum, order) => sum + order.total * 0.15, 0);

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">Analytics</h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">Top Selling Products</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Retatrutide</span>
                            <span className="text-cyan-400 font-bold">42 sales</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">BPC-157</span>
                            <span className="text-cyan-400 font-bold">38 sales</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">NAD+</span>
                            <span className="text-cyan-400 font-bold">31 sales</span>
                        </div>
                    </div>
                </div>
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-xl font-bold text-white mb-4">Referral Performance</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Top Referrer</span>
                            <span className="text-cyan-400 font-bold">JAKE (15 referrals)</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-300">Total Commissions</span>
                            <span className="text-green-400 font-bold">${totalCommissions.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
