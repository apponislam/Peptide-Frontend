"use client";

import React, { createContext, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";

const AuthContext = createContext<any>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);

    // Redirect to login if no user
    React.useEffect(() => {
        if (!currentUser) {
            router.push("/auth/login");
        }
    }, [currentUser, router]);

    const value = {
        currentUser,
        token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
