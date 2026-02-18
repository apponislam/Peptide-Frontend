"use client";

import { getTier } from "@/app/lib/products";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
import HowItWorks from "@/app/components/dashboard/HowItWorks";
import DashboardStats from "@/app/components/dashboard/DashboardStats";
import OrderHistory from "@/app/components/dashboard/DashOrders";
import InvitationCode from "@/app/components/dashboard/DashInviteCode";
import Link from "next/link";

export default function DashboardPage() {
    const { data, isLoading, isError } = useGetMeQuery();
    console.log("Query result:", data);

    const mainUser = data?.data;
    const tier = getTier(mainUser?.referralCount || 0);

    // Show loading state while data is being fetched
    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="container mx-auto px-4 py-6 md:py-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">Dashboard</h1>
                    <div className="text-white">Loading...</div>
                </div>
            </div>
        );
    }

    // Show error state if query failed
    if (isError || !data?.success) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="container mx-auto px-4 py-6 md:py-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Dashboard</h1>
                    <DashboardStats></DashboardStats>
                    <InvitationCode></InvitationCode>
                    <HowItWorks></HowItWorks>
                    <OrderHistory></OrderHistory>
                </div>
            </div>
        );
    }

    // If we have data but no user (edge case)
    if (!mainUser) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="container mx-auto px-4 py-6 md:py-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Dashboard</h1>
                    <DashboardStats></DashboardStats>
                    <InvitationCode></InvitationCode>
                    <HowItWorks></HowItWorks>
                    <OrderHistory></OrderHistory>
                </div>
            </div>
        );
    }

    // Main content with user data
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Dashboard Content */}
            <div className="container mx-auto px-4 py-6 md:py-8">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Hi {mainUser?.name || "there"}</h1>
                    {["ADMIN", "SUPER_ADMIN"].includes(mainUser?.role) && (
                        <Link href="/admin" className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow">
                            ADMIN DASHBOARD
                        </Link>
                    )}
                </div>

                <DashboardStats user={mainUser}></DashboardStats>

                {/* Invitation Code Section */}
                <InvitationCode user={mainUser}></InvitationCode>

                {/* How It Works */}
                <HowItWorks stage={tier.name || undefined}></HowItWorks>

                {/* Order History */}
                <OrderHistory orders={mainUser?.orders || []}></OrderHistory>
            </div>
        </div>
    );
}
