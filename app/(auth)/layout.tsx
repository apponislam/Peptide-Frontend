"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/app/redux/hooks";
import { currentUser } from "@/app/redux/features/auth/authSlice";
import { NonAuthProvider } from "@/app/contexts/AuthContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const user = useAppSelector(currentUser);

    useEffect(() => {
        if (user) {
            router.push("/");
        }
    }, [user, router]);

    return <NonAuthProvider>{children}</NonAuthProvider>;
}
