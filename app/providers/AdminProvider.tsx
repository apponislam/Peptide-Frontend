// import React, { ReactNode, useEffect, useState } from "react";
// import { useAppSelector } from "../redux/hooks";

// interface AdminProviderProps {
//     children: ReactNode;
// }

// const AdminProvider: React.FC<AdminProviderProps> = ({ children }) => {
//     const user = useAppSelector((state) => state.auth.user);
//     const [isAdmin, setIsAdmin] = useState<boolean>(false);
//     const [isLoading, setIsLoading] = useState<boolean>(true);

//     useEffect(() => {
//         // Check if user exists and has admin privileges
//         const checkAdminStatus = () => {
//             if (!user) {
//                 setIsAdmin(false);
//                 setIsLoading(false);
//                 return;
//             }

//             const userIsAdmin = user.role === "admin" || user.isAdmin === true || (user.roles && user.roles.includes("admin"));

//             setIsAdmin(!!userIsAdmin);
//             setIsLoading(false);
//         };

//         checkAdminStatus();
//     }, [user]);

//     // Optional: Log for debugging
//     useEffect(() => {
//         console.log("User:", user);
//         console.log("Is Admin:", isAdmin);
//         console.log("Is Loading:", isLoading);
//     }, [user, isAdmin, isLoading]);

//     // Show loading state while checking authentication
//     if (isLoading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
//                     <p className="mt-4 text-gray-600">Checking authentication...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (!isAdmin) {
//         return (
//             <div className="flex items-center justify-center min-h-screen">
//                 <div className="text-center">
//                     <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
//                     <p className="text-gray-600">You don't have permission to access this page.</p>
//                     <p className="text-gray-500 mt-2">Admin privileges required.</p>
//                 </div>
//             </div>
//         );
//     }

//     return <>{children}</>;
// };

// export default AdminProvider;

"use client";
import React, { ReactNode, useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { useRouter } from "next/navigation";

interface AdminProviderProps {
    children: ReactNode;
    allowNonAdmin?: boolean;
}

const AdminProvider: React.FC<AdminProviderProps> = ({ children, allowNonAdmin = false }) => {
    const user = useAppSelector((state) => state.auth.user);
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAdminStatus = () => {
            if (!user) {
                setIsAdmin(false);
                setIsLoading(false);
                if (!location.pathname.includes("/admin/login")) {
                    router.push("/admin/login");
                }
                return;
            }
            const userIsAdmin = user.role === "ADMIN";
            setIsAdmin(userIsAdmin);
            setIsLoading(false);
        };

        checkAdminStatus();
    }, [user]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    if (allowNonAdmin) {
        return <>{children}</>;
    }

    if (!isAdmin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 p-4">
                <div className="w-full max-w-md text-center p-4 sm:p-6 md:p-8 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 shadow-2xl">
                    <div className="mb-4 sm:mb-6">
                        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-red-500/20 rounded-full mb-3 sm:mb-4">
                            <svg className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">Access Denied</h1>
                        <p className="text-sm sm:text-base text-gray-300">You don't have permission to access this page.</p>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">Admin privileges required.</p>
                    </div>

                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-black/20 rounded-lg">
                        {user ? (
                            <>
                                <p className="text-sm sm:text-base text-gray-300">
                                    Your role: <span className="font-semibold text-blue-300">{user.role}</span>
                                </p>
                                <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2 truncate">Logged in as: {user.email}</p>
                            </>
                        ) : (
                            <p className="text-sm sm:text-base text-gray-300">Please log in first</p>
                        )}
                    </div>

                    <button onClick={() => (window.location.href = "/")} className="mt-6 sm:mt-8 px-4 sm:px-6 py-2 sm:py-3 w-full text-sm sm:text-base bg-white/20 hover:bg-white/30 text-white font-medium rounded-lg transition-all hover:scale-105 active:scale-95">
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};

export default AdminProvider;
