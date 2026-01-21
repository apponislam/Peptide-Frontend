"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams, usePathname } from "next/navigation";
import DashboardTab from "@/app/components/adminDashboard/DashboardTab";
import OrdersTab from "@/app/components/adminDashboard/OrdersTab";
import UsersTab from "@/app/components/adminDashboard/UsersTab";
import ProductsTab from "@/app/components/adminDashboard/ProductsTab";
import AnalyticsTab from "@/app/components/adminDashboard/AnalyticsTab";
import AdminDashHeader from "@/app/components/adminDashboard/AdminDashHeader";

type TabType = "dashboard" | "orders" | "users" | "products" | "analytics";

export default function AdminDashboard() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    // Get tab from URL params, default to "dashboard"
    const tabParam = searchParams.get("tab") as TabType;
    const validTabs: TabType[] = ["dashboard", "orders", "users", "products", "analytics"];
    const initialTab = validTabs.includes(tabParam) ? tabParam : "dashboard";

    const [selectedTab, setSelectedTab] = useState<TabType>(initialTab);

    // Update URL when tab changes
    const handleTabChange = (tab: TabType) => {
        setSelectedTab(tab);
        const params = new URLSearchParams(searchParams.toString());
        params.set("tab", tab);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
    };

    // Sync with URL params on back/forward navigation
    useEffect(() => {
        if (tabParam && validTabs.includes(tabParam as TabType) && tabParam !== selectedTab) {
            setSelectedTab(tabParam as TabType);
        }
    }, [tabParam, selectedTab]);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
            <AdminDashHeader></AdminDashHeader>

            <div className="container mx-auto px-6 py-12">
                {/* Tab Navigation - Fixed responsive design */}
                <div className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-6 px-6 md:overflow-visible md:mx-0 md:px-0 md:flex-wrap scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                    <button onClick={() => handleTabChange("dashboard")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold whitespace-nowrap shrink-0 ${selectedTab === "dashboard" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
                        Dashboard
                    </button>

                    <button onClick={() => handleTabChange("orders")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold whitespace-nowrap shrink-0 ${selectedTab === "orders" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
                        Orders
                    </button>

                    <button onClick={() => handleTabChange("users")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold whitespace-nowrap shrink-0 ${selectedTab === "users" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
                        Users
                    </button>

                    <button onClick={() => handleTabChange("products")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold whitespace-nowrap shrink-0 ${selectedTab === "products" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
                        Products
                    </button>

                    <button onClick={() => handleTabChange("analytics")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold whitespace-nowrap shrink-0 ${selectedTab === "analytics" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
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
