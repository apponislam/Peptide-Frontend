"use client";
import { baseApi } from "@/app/redux/api/baseApi";
import { useLogoutMutation } from "@/app/redux/features/auth/authApi";
import { logOut } from "@/app/redux/features/auth/authSlice";
import { useAppDispatch } from "@/app/redux/hooks";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const AdminDashHeader = () => {
    const router = useRouter();
    const [logoutApi] = useLogoutMutation();
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            dispatch(logOut());
            // dispatch(demoLogOut());
            router.push("/admin/login");
            dispatch(baseApi.util.resetApiState());
        }
    };

    return (
        <nav className="bg-slate-900/80 border-b border-cyan-500/20">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/admin" className="cursor-pointer shrink-0">
                    <Image src="/peptide-logo.png" alt="PEPTIDE.CLUB" width={0} height={0} sizes="100vw" className="h-10 w-auto" priority />
                </Link>
                <div className="flex items-center gap-4">
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                        Log Out
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AdminDashHeader;
