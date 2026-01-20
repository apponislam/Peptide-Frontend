"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardTab from "../../../../components/adminDashboard/DashboardTab";
import OrdersTab from "../../../../components/adminDashboard/OrdersTab";
import UsersTab from "../../../../components/adminDashboard/UsersTab";
import ProductsTab from "../../../../components/adminDashboard/ProductsTab";
import AnalyticsTab from "../../../../components/adminDashboard/AnalyticsTab";
import Link from "next/link";
import Image from "next/image";

export default function AdminDashboard() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState<"dashboard" | "orders" | "users" | "products" | "analytics">("dashboard");
    const [loading, setLoading] = useState(false);
    const [adminUser, setAdminUser] = useState<any>(null);

    // Load initial data
    useEffect(() => {
        const user = localStorage.getItem("admin_user");
        if (user) {
            setAdminUser(JSON.parse(user));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        router.push("/admin/login");
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
            <nav className="bg-slate-900/80 border-b border-cyan-500/20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    {/* <Link href="/">

                        <div className="text-white text-2xl font-bold" style={{ fontFamily: "'GreaterTheory', sans-serif", letterSpacing: "-2px" }}>
                            PEPTIDE.CLUB
                        </div>
                    </Link> */}
                    <Link href="/" className="cursor-pointer shrink-0">
                        <Image src="/peptide-logo.png" alt="PEPTIDE.CLUB" width={350} height={40} className="h-10 w-auto" />
                    </Link>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-300 text-sm">{adminUser?.email}</span>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                            Log Out
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-12">
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8" style={{ flexWrap: "wrap" }}>
                    <button onClick={() => setSelectedTab("dashboard")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold ${selectedTab === "dashboard" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
                        Dashboard
                    </button>

                    <button onClick={() => setSelectedTab("orders")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold ${selectedTab === "orders" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
                        Orders
                    </button>

                    <button onClick={() => setSelectedTab("users")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold ${selectedTab === "users" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
                        Users
                    </button>

                    <button onClick={() => setSelectedTab("products")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold ${selectedTab === "products" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
                        Products
                    </button>

                    <button onClick={() => setSelectedTab("analytics")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold ${selectedTab === "analytics" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
                        Analytics
                    </button>
                </div>

                {/* Tab Content */}
                {selectedTab === "dashboard" && <DashboardTab />}
                {selectedTab === "orders" && <OrdersTab />}
                {selectedTab === "users" && <UsersTab />}
                {selectedTab === "products" && <ProductsTab />}
                {selectedTab === "analytics" && <AnalyticsTab />}
            </div>
        </div>
    );
}
