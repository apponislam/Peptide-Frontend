"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { currentUser, logOut } from "@/app/redux/features/auth/authSlice";
import { useGetMeQuery, useLogoutMutation } from "@/app/redux/features/auth/authApi";
import { baseApi } from "../redux/api/baseApi";
import { getTier } from "../utils/pricing";
import { selectCartCount, openCart } from "../redux/features/cart/cartSlice";

export default function Header() {
    const dispatch = useAppDispatch();
    const cartCount = useAppSelector(selectCartCount);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { data } = useGetMeQuery();

    const userData = data?.data;
    const user = useAppSelector(currentUser);
    const [logoutApi] = useLogoutMutation();
    const hasUser = user && user.id;
    const userTier = userData?.tier;
    const tier = getTier(userTier || "Member");

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            dispatch(logOut());
            // dispatch(demoLogOut());
            dispatch(baseApi.util.resetApiState());
        }
    };
    const itemsInCart = cartCount;

    return (
        <>
            <nav className="bg-slate-900/90 border-b border-cyan-500/20 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link href="/" className="cursor-pointer shrink-0">
                            <Image src="/peptide-logo.png" alt="PEPTIDE.CLUB" width={0} height={0} sizes="100vw" className="h-10 w-auto" priority />
                        </Link>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-3">
                            {/* Tier Badge - Only show if user exists */}
                            {hasUser && (
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
                                    <div>
                                        <span className="px-2 py-1 bg-cyan-500/20 rounded-full text-cyan-400 text-xs font-semibold">{userData?.tier || "Member"}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-cyan-400 text-xs font-semibold">
                                            {tier.discount}% Discount {tier.commission > 0 && `& ${tier.commission}% Commission`}
                                        </div>
                                        {tier.freeShipping ? <div className="text-green-400 text-xs">Free Shipping</div> : <div className="text-yellow-400 text-xs">Free shipping $150+</div>}
                                    </div>
                                </div>
                            )}

                            {/* Dashboard Button (Desktop) */}
                            {hasUser && (
                                <Link href="/dashboard" className="hidden md:block text-gray-300 hover:text-cyan-400 text-sm font-semibold">
                                    Dashboard
                                </Link>
                            )}
                            {hasUser && (
                                <Link href="/" className="hidden md:block text-gray-300 hover:text-cyan-400 text-sm font-semibold">
                                    Store
                                </Link>
                            )}

                            {/* Auth */}
                            {hasUser ? (
                                <div className="hidden md:flex items-center gap-2">
                                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-sm cursor-pointer">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link href="/auth/login" className="text-gray-300 hover:text-cyan-400 text-sm font-semibold">
                                    Login
                                </Link>
                            )}

                            {/* Cart Button - Use openCart action from Redux */}
                            <button onClick={() => dispatch(openCart())} className="relative text-gray-300 hover:text-cyan-400 cursor-pointer">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {itemsInCart > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-xs flex items-center justify-center">{itemsInCart > 99 ? "99+" : itemsInCart}</span>}
                            </button>

                            {/* Mobile Menu Button */}
                            <button type="button" onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden text-gray-300 hover:text-cyan-400 cursor-pointer" aria-label="Toggle menu">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    {showMobileMenu && (
                        <div className="md:hidden mt-3">
                            {/* Mobile Auth Menu */}
                            <div className="mt-3 flex flex-col gap-2">
                                {hasUser ? (
                                    <>
                                        <Link href="/dashboard" className="text-gray-300 hover:text-cyan-400 text-sm font-semibold py-2" onClick={() => setShowMobileMenu(false)}>
                                            Dashboard
                                        </Link>
                                        <Link href="/" className="text-gray-300 hover:text-cyan-400 text-sm font-semibold py-2" onClick={() => setShowMobileMenu(false)}>
                                            Store
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setShowMobileMenu(false);
                                            }}
                                            className="text-red-400 hover:text-red-300 text-sm text-left py-2 cursor-pointer"
                                        >
                                            Logout
                                        </button>
                                    </>
                                ) : (
                                    <Link href="/auth/login" className="text-gray-300 hover:text-cyan-400 text-sm font-semibold py-2" onClick={() => setShowMobileMenu(false)}>
                                        Login / Register
                                    </Link>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}
