"use client";

import React, { createContext, ReactNode, useContext } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";

interface AuthContextType {
    currentUser: any;
    token: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider or NonAuthProvider");
    }
    return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);
    const isRehydrated = useSelector((state: any) => state._persist?.rehydrated);

    React.useEffect(() => {
        if (isRehydrated === false) return;
        if (!currentUser && !token) {
            router.push("/auth/login");
        }
    }, [currentUser, token, isRehydrated, router]);

    const value: AuthContextType = {
        currentUser,
        token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function NonAuthProvider({ children }: { children: ReactNode }) {
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const token = useSelector((state: RootState) => state.auth.token);

    const value: AuthContextType = {
        currentUser,
        token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
