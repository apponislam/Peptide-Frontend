"use client";

import { getTier } from "@/app/lib/products";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
import HowItWorks from "@/app/components/dashboard/HowItWorks";
import DashboardStats from "@/app/components/dashboard/DashboardStats";
import OrderHistory from "@/app/components/dashboard/DashOrders";
import InvitationCode from "@/app/components/dashboard/DashInviteCode";
import Link from "next/link";
import { useState } from "react";
import { KeyRound, Settings } from "lucide-react";
import UpdateProfileModal from "@/app/components/dashboard/UpdateProfile";
import ChangePasswordModal from "@/app/components/dashboard/ChangePassword";

export default function DashboardPage() {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const { data, isLoading, isError } = useGetMeQuery();
    const mainUser = data?.data;
    const tier = getTier(mainUser?.referralCount || 0);

    // Show loading state while data is being fetched
    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-[#010c20] via-[#143665] to-[#010c20]">
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
            <div className="min-h-screen bg-linear-to-br from-[#010c20] via-[#143665] to-[#010c20]">
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
            <div className="min-h-screen bg-linear-to-br from-[#010c20] via-[#143665] to-[#010c20]">
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
        <div className="min-h-screen bg-linear-to-br from-[#010c20] via-[#143665] to-[#010c20]">
            {/* Dashboard Content */}
            <div className="container mx-auto px-4 py-6 md:py-8">
                <div className="flex items-center md:justify-between flex-wrap mb-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">Hi {mainUser?.name || "there"}</h1>
                    {/* {["ADMIN", "SUPER_ADMIN"].includes(mainUser?.role) && (
                        <Link href="/admin" className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow">
                            ADMIN DASHBOARD
                        </Link>
                    )} */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Edit Profile Button */}
                        <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">
                            <Settings className="w-4 h-4" />
                            <span className="text-sm">Edit Profile</span>
                        </button>

                        {/* Change Password Button */}
                        <button onClick={() => setIsPasswordModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors border border-slate-700">
                            <KeyRound className="w-4 h-4" />
                            <span className="text-sm">Change Password</span>
                        </button>

                        {/* Admin Dashboard Button */}
                        {["ADMIN", "SUPER_ADMIN"].includes(mainUser?.role) && (
                            <Link href="/admin" className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow">
                                ADMIN
                            </Link>
                        )}
                    </div>
                </div>

                <DashboardStats user={mainUser}></DashboardStats>

                {/* Invitation Code Section */}
                <InvitationCode user={mainUser}></InvitationCode>

                {/* How It Works */}
                <HowItWorks stage={tier.name || undefined}></HowItWorks>

                {/* Order History */}
                <OrderHistory orders={mainUser?.orders || []}></OrderHistory>

                {/* Modals */}
                <UpdateProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} user={mainUser} />

                <ChangePasswordModal isOpen={isPasswordModalOpen} onClose={() => setIsPasswordModalOpen(false)} />
            </div>
        </div>
    );
}
