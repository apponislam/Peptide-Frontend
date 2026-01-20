"use client";
import { useRouter } from "next/navigation";
// import "../../../globals.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    // useEffect(() => {
    //     // Check if user is on admin route
    //     const path = window.location.pathname;
    //     if (path === "/admin" || path.startsWith("/admin/")) {
    //         const token = localStorage.getItem("admin_token");
    //         const user = localStorage.getItem("admin_user");

    //         // Redirect to login if not authenticated (except login page)
    //         if (!token || !user) {
    //             if (path !== "/admin/login") {
    //                 router.push("/admin/login");
    //             }
    //         } else {
    //             // Redirect to dashboard if authenticated and on login page
    //             if (path === "/admin/login") {
    //                 router.push("/admin");
    //             }
    //         }
    //     }
    // }, [router]);

    return <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">{children}</div>;
}
