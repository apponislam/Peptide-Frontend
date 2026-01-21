"use client";

import { useGetDashboardStatsQuery } from "@/app/redux/features/admin/adminApi";

interface Stats {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalProducts: number;
}

export default function DashboardTab() {
    const { data: apiData, isLoading } = useGetDashboardStatsQuery({});

    // Extract stats from API response or use defaults
    const stats: Stats = apiData?.data
        ? {
              totalOrders: apiData.data.totalOrders || 0,
              totalRevenue: apiData.data.totalRevenue || 0,
              totalCustomers: apiData.data.totalCustomers || 0,
              totalProducts: apiData.data.totalProducts || 0,
          }
        : {
              totalOrders: 0,
              totalRevenue: 0,
              totalCustomers: 0,
              totalProducts: 0,
          };

    if (isLoading) {
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
