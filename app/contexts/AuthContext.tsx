// "use client";

// import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
// import { User } from "../types";

// interface AuthContextType {
//     user: User | null;
//     login: (email: string, password: string) => Promise<void>;
//     logout: () => void;
//     loading: boolean;
//     register: (email: string, password: string, referralCode?: string) => Promise<void>;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: ReactNode }) {
//     const [user, setUser] = useState<User | null>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Check for existing session
//         const token = localStorage.getItem("peptide_token");
//         const userData = localStorage.getItem("peptide_user");

//         if (token && userData) {
//             try {
//                 setUser(JSON.parse(userData));
//             } catch (error) {
//                 console.error("Error parsing user data:", error);
//                 localStorage.removeItem("peptide_token");
//                 localStorage.removeItem("peptide_user");
//             }
//         }
//         setLoading(false);
//     }, []);

//     const login = async (email: string, password: string) => {
//         setLoading(true);
//         try {
//             const response = await fetch("/api/auth/login", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ email, password }),
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 localStorage.setItem("peptide_token", data.token);
//                 localStorage.setItem("peptide_user", JSON.stringify(data.user));
//                 setUser(data.user);
//             } else {
//                 throw new Error("Login failed");
//             }
//         } catch (error) {
//             console.error("Login error:", error);
//             throw error;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const register = async (email: string, password: string, referralCode?: string) => {
//         setLoading(true);
//         try {
//             const response = await fetch("/api/auth/register", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify({ email, password, referralCode }),
//             });

//             if (response.ok) {
//                 const data = await response.json();
//                 localStorage.setItem("peptide_token", data.token);
//                 localStorage.setItem("peptide_user", JSON.stringify(data.user));
//                 setUser(data.user);
//             } else {
//                 const error = await response.json();
//                 throw new Error(error.message || "Registration failed");
//             }
//         } catch (error) {
//             console.error("Registration error:", error);
//             throw error;
//         } finally {
//             setLoading(false);
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem("peptide_token");
//         localStorage.removeItem("peptide_user");
//         setUser(null);
//     };

//     return <AuthContext.Provider value={{ user, login, logout, loading, register }}>{children}</AuthContext.Provider>;
// }

"use client";

import React, { createContext, ReactNode } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";

const AuthContext = createContext<any>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const router = useRouter();
    const currentUser = useSelector((state: RootState) => state.auth.user);
    const demoUser = useSelector((state: RootState) => state.auth.demoUser);
    const token = useSelector((state: RootState) => state.auth.token);

    // Redirect to login if no user
    React.useEffect(() => {
        if (!currentUser && !demoUser) {
            router.push("/auth/login");
        }
    }, [currentUser, demoUser, router]);

    const value = {
        currentUser,
        demoUser,
        token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
