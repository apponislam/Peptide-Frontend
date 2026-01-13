"use client";

import { getTier } from "@/app/lib/products";
import { useAppSelector } from "@/app/redux/hooks";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
import HowItWorks from "@/app/components/dashboard/HowItWorks";
import DashboardStats from "@/app/components/dashboard/DashboardStats";
import OrderHistory from "@/app/components/dashboard/DashOrders";
import InvitationCode from "@/app/components/dashboard/DashInviteCode";

export default function DashboardPage() {
    const { data } = useGetMeQuery();
    const mainUser = data?.data;

    const user = useAppSelector((state) => state.auth.user);
    // const [showEditModal, setShowEditModal] = useState(false);
    // const [newCode, setNewCode] = useState(user?.referralCode || "");
    const tier = getTier(mainUser?.referralCount || 0);

    if (!mainUser) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="container mx-auto px-4 py-8 text-center">
                    <p className="text-gray-400">Please log in to view your dashboard.</p>
                </div>
            </div>
        );
    }

    console.log(mainUser);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
            {/* Dashboard Content */}
            <div className="container mx-auto px-4 py-6 md:py-8">
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">Dashboard</h1>

                <DashboardStats user={mainUser || undefined}></DashboardStats>

                {/* Invitation Code Section */}
                <InvitationCode user={mainUser || undefined}></InvitationCode>

                {/* How It Works */}
                <HowItWorks stage={tier.name || undefined}></HowItWorks>

                {/* Order History */}
                <OrderHistory orders={mainUser?.orders || undefined}></OrderHistory>
            </div>
        </div>
    );
}
