// "use client";
// import { useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useAuth } from "../contexts/AuthContext";
// import { getTier } from "../lib/products";
// import { useCart } from "../contexts/CartContext";

// export default function Header() {
//     const { cartCount, setIsOpen } = useCart();
//     const { user, logout } = useAuth();
//     const [showMobileMenu, setShowMobileMenu] = useState(false);
//     const [searchQuery, setSearchQuery] = useState("");

//     const tier = getTier(user?.referralCount || 0);

//     return (
//         <>
//             <nav className="bg-slate-900/90 border-b border-cyan-500/20 sticky top-0 z-40">
//                 <div className="container mx-auto px-4 py-3">
//                     <div className="flex items-center justify-between gap-4">
//                         {/* Logo */}
//                         <Link href="/" className="cursor-pointer shrink-0">
//                             <Image src="/peptide-logo.png" alt="PEPTIDE.CLUB" width={120} height={40} className="h-10 w-auto" />
//                         </Link>

//                         {/* Search Bar (Desktop) */}
//                         <div className="hidden md:block flex-1 max-w-lg mx-4">
//                             <div className="relative">
//                                 <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                                 </svg>
//                                 <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-10 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none" />
//                             </div>
//                         </div>

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
//                                 <button onClick={logout} className="text-gray-400 hover:text-red-400 text-sm">
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
import { getTier } from "../lib/products";
import { useCart } from "../contexts/CartContext";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { logOut } from "@/app/redux/features/auth/authSlice";
import { useLogoutMutation } from "@/app/redux/features/auth/authApi";

export default function Header() {
    const { cartCount, setIsOpen } = useCart();
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    // Redux hooks
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.auth.user);
    const [logoutApi] = useLogoutMutation();

    const tier = getTier(user?.referralCount || 0);

    const handleLogout = async () => {
        try {
            await logoutApi().unwrap();
        } catch (error) {
            // Logout even if API call fails
            console.error("Logout API error:", error);
        } finally {
            // Clear Redux state
            dispatch(logOut());
        }
    };

    return (
        <>
            <nav className="bg-slate-900/90 border-b border-cyan-500/20 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-3">
                    <div className="flex items-center justify-between gap-4">
                        {/* Logo */}
                        <Link href="/" className="cursor-pointer shrink-0">
                            <Image src="/peptide-logo.png" alt="PEPTIDE.CLUB" width={350} height={40} className="h-10 w-auto" />
                        </Link>

                        {/* Search Bar (Desktop) */}
                        <div className="hidden md:block flex-1 max-w-lg mx-4">
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-10 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none" />
                            </div>
                        </div>

                        {/* Right Side Actions */}
                        <div className="flex items-center gap-3">
                            {/* Mobile Search Button */}
                            <button onClick={() => setShowMobileMenu(!showMobileMenu)} className="md:hidden text-gray-300 hover:text-cyan-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>

                            {/* Tier Badge */}
                            {user && (
                                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-800 rounded-lg">
                                    <div>
                                        <span className="px-2 py-1 bg-cyan-500/20 rounded-full text-cyan-400 text-xs font-semibold">{tier.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-cyan-400 text-xs font-semibold">{tier.discount}% Discount</div>
                                        {tier.freeShipping ? <div className="text-green-400 text-xs">✓ Free Shipping</div> : <div className="text-yellow-400 text-xs">Free shipping $150+</div>}
                                    </div>
                                </div>
                            )}

                            {/* Dashboard Button (Desktop) */}
                            {user && (
                                <Link href="/dashboard" className="hidden md:block text-gray-300 hover:text-cyan-400 text-sm font-semibold">
                                    Dashboard
                                </Link>
                            )}

                            {/* Auth */}
                            {user ? (
                                <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 text-sm">
                                    Logout
                                </button>
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
                                {cartCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-500 rounded-full text-xs flex items-center justify-center">{cartCount}</span>}
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
                            <div className="relative">
                                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-10 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none" />
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </>
    );
}
