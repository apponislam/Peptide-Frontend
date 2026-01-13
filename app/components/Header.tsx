// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { getTier } from "../lib/products";
// import { useCart } from "../contexts/CartContext";
// import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
// import { logOut } from "@/app/redux/features/auth/authSlice";
// import { useLogoutMutation } from "@/app/redux/features/auth/authApi";

// export default function Header() {
//     const { cartCount, setIsOpen } = useCart();
//     const [showMobileMenu, setShowMobileMenu] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");

//     // Redux hooks
//     const dispatch = useAppDispatch();
//     const user = useAppSelector((state) => state.auth.user);
//     console.log(user);
//     const [logoutApi] = useLogoutMutation();

//     const tier = getTier(user?.referralCount || 0);

//     const handleLogout = async () => {
//         try {
//             await logoutApi().unwrap();
//         } catch (error) {
//             // Logout even if API call fails
//             console.error("Logout API error:", error);
//         } finally {
//             // Clear Redux state
//             dispatch(logOut());
//         }
//     };

//     return (
//         <>
//             <nav className="bg-slate-900/90 border-b border-cyan-500/20 sticky top-0 z-40">
//                 <div className="container mx-auto px-4 py-3">
//                     <div className="flex items-center justify-between gap-4">
//                         {/* Logo */}
//                         <Link href="/" className="cursor-pointer shrink-0">
//                             <Image src="/peptide-logo.png" alt="PEPTIDE.CLUB" width={350} height={40} className="h-10 w-auto" />
//                         </Link>

//                         {/* Right Side Actions */}
//                         <div className="flex items-center gap-3">
//                             {/* Mobile Search Button */}
//                             <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden text-gray-300 hover:text-cyan-400">
//                                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                 </svg>
//                             </button>

//                             {/* Tier Badge */}
//                             {user && (
//                                 <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
//                                     <div>
//                                         <span className="px-2 py-1 bg-cyan-500/20 rounded-full text-cyan-400 text-xs font-semibold">{tier.name}</span>
//                                     </div>
//                                     <div className="text-right">
//                                         <div className="text-cyan-400 text-xs font-semibold">{tier.discount}% Discount</div>
//                                         {tier.freeShipping ? <div className="text-green-400 text-xs">✓ Free Shipping</div> : <div className="text-yellow-400 text-xs">Free shipping $150+</div>}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Dashboard Button (Desktop) */}
//                             {user && (
//                                 <Link href="/dashboard" className="hidden md:block text-gray-300 hover:text-cyan-400 text-sm font-semibold">
//                                     Dashboard
//                                 </Link>
//                             )}

//                             {/* Auth */}
//                             {user ? (
//                                 <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-sm">
//                                     Logout
//                                 </button>
//                             ) : (
//                                 <Link href="/auth/login" className="text-gray-300 hover:text-cyan-400 text-sm font-semibold">
//                                     Login
//                                 </Link>
//                             )}

//                             {/* Cart Button */}
//                             <button onClick={() => setIsOpen(true)} className="relative text-gray-300 hover:text-cyan-400">
//                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
//                                 </svg>
//                                 {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-xs flex items-center justify-center">{cartCount}</span>}
//                             </button>

//                             {/* Mobile Menu Button */}
//                             <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden text-gray-300 hover:text-cyan-400">
//                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                                 </svg>
//                             </button>
//                         </div>
//                     </div>

//                     {/* Mobile Search Bar */}
//                     {showMobileMenu && (
//                         <div className="md:hidden mt-3">
//                             <div className="relative">
//                                 <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                 </svg>
//                                 <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-10 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none" />
//                             </div>
//                         </div>
//                     )}
//                 </div>
//             </nav>
//         </>
//     );
// }

"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "../contexts/CartContext";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { currentUser, logOut } from "@/app/redux/features/auth/authSlice";
import { useGetMeQuery, useLogoutMutation } from "@/app/redux/features/auth/authApi";

const getTier = (count: number) => {
    if (count >= 10) return { name: "Founder", discount: 20, commission: 15, freeShipping: true };
    if (count >= 3) return { name: "VIP", discount: 20, commission: 10, freeShipping: true };
    return { name: "Member", discount: 10, commission: 0, freeShipping: false };
};

export default function Header() {
    const { cartCount, setIsOpen, cart } = useCart();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const { data, error } = useGetMeQuery();

    const userData = data?.data;

    const dispatch = useAppDispatch();
    const user = useAppSelector(currentUser);
    console.log(user);
    const [logoutApi] = useLogoutMutation();
    const hasUser = user && user.id;
    const referralCount = userData?.referralCount || 0;
    const tier = getTier(referralCount);

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (error) {
            console.error("Logout API error:", error);
        } finally {
            dispatch(logOut());
        }
    };

    // Calculate cart items count
    const itemsInCart = cartCount();
    console.log("Cart items count:", itemsInCart, "Cart:", cart);

    return (
        <>
            <nav className="bg-slate-900/90 border-b border-cyan-500/20 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link href="/" className="cursor-pointer shrink-0">
                            <Image src="/peptide-logo.png" alt="PEPTIDE.CLUB" width={350} height={40} className="h-10 w-auto" />
                        </Link>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-3">
                            {/* Mobile Search Button */}
                            {/* <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden text-gray-300 hover:text-cyan-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button> */}

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

                            {/* Auth */}
                            {hasUser ? (
                                <div className="hidden md:flex items-center gap-2">
                                    {/* <span className="text-gray-300 text-sm">{user.name?.split(" ")[0] || "User"}</span> */}
                                    <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-sm">
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <Link href="/auth/login" className="text-gray-300 hover:text-cyan-400 text-sm font-semibold">
                                    Login
                                </Link>
                            )}

                            {/* Cart Button */}
                            <button onClick={() => setIsOpen(true)} className="relative text-gray-300 hover:text-cyan-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {itemsInCart > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-xs flex items-center justify-center">{itemsInCart > 99 ? "99+" : itemsInCart}</span>}
                            </button>

                            {/* Mobile Menu Button */}
                            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden text-gray-300 hover:text-cyan-400">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Search Bar */}
                    {showMobileMenu && (
                        <div className="md:hidden mt-3">
                            {/* <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-10 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none" />
                            </div> */}

                            {/* Mobile Auth Menu */}
                            <div className="mt-3 flex flex-col gap-2">
                                {hasUser ? (
                                    <>
                                        {/* <div className="text-gray-300 text-sm py-2 border-t border-slate-700">
                                            Logged in as: <span className="text-cyan-400">{user.name}</span>
                                        </div> */}
                                        <Link href="/dashboard" className="text-gray-300 hover:text-cyan-400 text-sm font-semibold py-2" onClick={() => setShowMobileMenu(false)}>
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setShowMobileMenu(false);
                                            }}
                                            className="text-red-400 hover:text-red-300 text-sm text-left py-2"
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
