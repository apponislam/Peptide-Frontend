// interface DashboardTabProps {
//     stats: {
//         totalOrders: number;
//         totalRevenue: number;
//         totalCustomers: number;
//         totalProducts: number;
//     };
//     loading: boolean;
// }

// export default function DashboardTab({ stats, loading }: DashboardTabProps) {
//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
//             </div>
//         );
//     }

//     const statCards = [
//         { label: "Total Orders", value: stats.totalOrders, color: "text-cyan-400" },
//         { label: "Total Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, color: "text-green-400" },
//         { label: "Total Customers", value: stats.totalCustomers, color: "text-blue-400" },
//         { label: "Total Products", value: stats.totalProducts, color: "text-purple-400" },
//     ];

//     return (
//         <div>
//             <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {statCards.map((stat, index) => (
//                     <div key={index} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-cyan-500/50 transition-colors">
//                         <p className="text-gray-400 text-sm mb-2">{stat.label}</p>
//                         <p className={`text-4xl font-bold ${stat.color}`}>{stat.value}</p>
//                     </div>
//                 ))}
//             </div>

//             {/* Recent Activity Section */}
//             <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
//                 <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
//                     <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
//                     <div className="space-y-4">
//                         {[1, 2, 3].map((i) => (
//                             <div key={i} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
//                                 <div>
//                                     <p className="text-white">New order #ORD00{i}</p>
//                                     <p className="text-sm text-gray-400">Just now</p>
//                                 </div>
//                                 <span className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">${(299.99 * i).toFixed(2)}</span>
//                             </div>
//                         ))}
//                     </div>
//                 </div>

//                 <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
//                     <h3 className="text-xl font-bold text-white mb-4">Quick Stats</h3>
//                     <div className="space-y-3">
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-300">Avg. Order Value</span>
//                             <span className="text-green-400 font-bold">$287.45</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-300">Conversion Rate</span>
//                             <span className="text-blue-400 font-bold">3.2%</span>
//                         </div>
//                         <div className="flex justify-between items-center">
//                             <span className="text-gray-300">Returning Customers</span>
//                             <span className="text-purple-400 font-bold">42%</span>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// components/admin/tabs/DashboardTab.tsx
"use client";

import { useState, useEffect } from "react";

interface Stats {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
}

export default function DashboardTab() {
    const [stats, setStats] = useState<Stats>({
        totalOrders: 0,
        totalRevenue: 0,
        totalCustomers: 0,
        totalProducts: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            setLoading(true);
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            setStats({
                totalOrders: 157,
                totalRevenue: 45280.5,
                totalCustomers: 89,
                totalProducts: 12,
            });
        } catch (error) {
            console.error("Failed to load stats:", error);
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

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>
            <div className="grid md:grid-cols-4 gap-6">
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <p className="text-gray-400 text-sm mb-2">Total Orders</p>
                    <p className="text-4xl font-bold text-cyan-400">{stats.totalOrders}</p>
                </div>
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
                    <p className="text-4xl font-bold text-green-400">${stats.totalRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <p className="text-gray-400 text-sm mb-2">Total Customers</p>
                    <p className="text-4xl font-bold text-blue-400">{stats.totalCustomers}</p>
                </div>
                <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                    <p className="text-gray-400 text-sm mb-2">Total Products</p>
                    <p className="text-4xl font-bold text-purple-400">{stats.totalProducts}</p>
                </div>
            </div>
        </div>
    );
}
