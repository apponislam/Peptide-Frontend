// "use client";

// import { useParams, useRouter } from "next/navigation";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useCart } from "@/app/contexts/CartContext";
// import { useAuth } from "@/app/contexts/AuthContext";
// import { getMemberPrice, getTier, PRODUCTS } from "@/app/lib/products";

// type TabType = "overview" | "research" | "coa";

// export default function ProductPage() {
//     const params = useParams();
//     const router = useRouter();
//     const { cart, addToCart, removeFromCart } = useCart();
//     const { user } = useAuth();

//     const [selectedTab, setSelectedTab] = useState<TabType>("overview");
//     const [product, setProduct] = useState<any>(null);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         if (params.id) {
//             const productId = parseInt(params.id as string);
//             const foundProduct = PRODUCTS.find((p) => p.id === productId);

//             if (foundProduct) {
//                 setProduct(foundProduct);
//             } else {
//                 // Redirect to store if product not found
//                 router.push("/");
//             }
//             setLoading(false);
//         }
//     }, [params.id, router]);

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
//             </div>
//         );
//     }

//     if (!product) {
//         return (
//             <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
//                 <div className="text-center">
//                     <p className="text-gray-400 mb-4">Product not found</p>
//                     <Link href="/" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold">
//                         Back to Store
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     const tier = getTier(user?.referralCount || 0);
//     const isBacWater = product.name.includes("BAC Water");

//     return (
//         <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
//             <div className="container mx-auto px-4 py-6 md:py-8">
//                 {/* Back Button */}
//                 <button onClick={() => router.back()} className="mb-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold flex items-center gap-2">
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//                     </svg>
//                     Back to Store
//                 </button>

//                 {/* Product Details */}
//                 <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
//                     {/* Product Image */}
//                     <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 md:p-8 flex items-center justify-center aspect-square">
//                         <div className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-600 text-center">{product.name.substring(0, 5)}</div>
//                     </div>

//                     {/* Product Info */}
//                     <div>
//                         <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">{product.name}</h1>
//                         <p className="text-gray-300 mb-6">{product.desc}</p>

//                         {/* Sizes */}
//                         <div className="space-y-3 mb-6">
//                             {product.sizes.map((size: any) => {
//                                 const cartItem = cart.find((item) => item.product.id === product.id && item.size.mg === size.mg);
//                                 const quantity = cartItem ? cartItem.quantity : 0;

//                                 return (
//                                     <div key={size.mg} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
//                                         <div>
//                                             <div className="text-lg font-bold text-white">{size.mg}mg</div>
//                                             <div className="text-sm text-gray-400">Lyophilized Powder</div>
//                                         </div>
//                                         <div className="flex items-center gap-4">
//                                             <div className="text-right">
//                                                 <div className="text-sm text-gray-500 line-through">${size.price}</div>
//                                                 <div className="text-xl md:text-2xl font-bold text-cyan-400">${getMemberPrice(size.price, user)}</div>
//                                             </div>
//                                             <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-2">
//                                                 <button onClick={() => removeFromCart(product.id, size.mg)} className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded font-bold">
//                                                     -
//                                                 </button>
//                                                 <span className="w-8 text-center text-white font-bold">{quantity}</span>
//                                                 <button onClick={() => addToCart(product, size)} className="w-8 h-8 flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-white rounded font-bold">
//                                                     +
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                         </div>

//                         {/* Features */}
//                         <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
//                             <div className="text-sm text-gray-400 space-y-2">
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-green-400">✓</span>
//                                     <span>99% Purity • Third-party tested</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-green-400">✓</span>
//                                     <span>HPLC verified</span>
//                                 </div>
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-green-400">✓</span>
//                                     <span>COA available</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>

//                 {/* Tabs */}
//                 <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
//                     <div className="flex border-b border-slate-700">
//                         <button onClick={() => setSelectedTab("overview")} className={`flex-1 px-4 md:px-6 py-3 md:py-4 text-sm font-semibold ${selectedTab === "overview" ? "text-cyan-400 bg-slate-900 border-b-2 border-cyan-400" : "text-gray-400 hover:text-white"}`}>
//                             Overview
//                         </button>
//                         {!isBacWater && (
//                             <button onClick={() => setSelectedTab("research")} className={`flex-1 px-4 md:px-6 py-3 md:py-4 text-sm font-semibold ${selectedTab === "research" ? "text-cyan-400 bg-slate-900 border-b-2 border-cyan-400" : "text-gray-400 hover:text-white"}`}>
//                                 Research
//                             </button>
//                         )}
//                         {!isBacWater && (
//                             <button onClick={() => setSelectedTab("coa")} className={`flex-1 px-4 md:px-6 py-3 md:py-4 text-sm font-semibold ${selectedTab === "coa" ? "text-cyan-400 bg-slate-900 border-b-2 border-cyan-400" : "text-gray-400 hover:text-white"}`}>
//                                 COA
//                             </button>
//                         )}
//                     </div>

//                     <div className="p-4 md:p-6 lg:p-8">
//                         {selectedTab === "overview" && (
//                             <div className="space-y-6">
//                                 <div>
//                                     <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Description</h3>
//                                     <p className="text-gray-300 leading-relaxed">{product.details}</p>
//                                 </div>
//                                 <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 md:p-6">
//                                     <p className="text-red-300 text-sm font-semibold mb-2">⚠️ IMPORTANT DISCLAIMER</p>
//                                     <p className="text-red-200 text-sm">This product is intended for research purposes only. Not for human consumption, medical use, or veterinary applications.</p>
//                                 </div>
//                             </div>
//                         )}

//                         {selectedTab === "research" && !isBacWater && (
//                             <div>
//                                 <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Research References</h3>
//                                 <p className="text-gray-400 mb-4 md:mb-6">Peer-reviewed research and academic literature:</p>
//                                 <div className="space-y-3">
//                                     {product.references.map((ref: any, idx: number) => (
//                                         <a key={idx} href={ref.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition">
//                                             <span className="text-cyan-400 mt-1">📄</span>
//                                             <div>
//                                                 <p className="text-white font-semibold">{ref.title}</p>
//                                                 <p className="text-sm text-gray-400">Access peer-reviewed research</p>
//                                             </div>
//                                         </a>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}

//                         {selectedTab === "coa" && !isBacWater && (
//                             <div>
//                                 <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Certificate of Analysis</h3>
//                                 <div className="bg-slate-900 rounded-lg p-4 md:p-6 lg:p-8 mt-4">
//                                     <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
//                                         <div>
//                                             <h4 className="text-gray-400 text-sm mb-1">Batch Number</h4>
//                                             <p className="text-white text-lg md:text-xl font-bold">PC-{product.name.substring(0, 3).toUpperCase()}-240124</p>
//                                         </div>
//                                         <div>
//                                             <h4 className="text-gray-400 text-sm mb-1">Purity</h4>
//                                             <p className="text-green-400 text-lg md:text-xl font-bold">99%</p>
//                                         </div>
//                                         <div>
//                                             <h4 className="text-gray-400 text-sm mb-1">Testing Date</h4>
//                                             <p className="text-white text-lg md:text-xl font-bold">October 2024</p>
//                                         </div>
//                                         <div>
//                                             <h4 className="text-gray-400 text-sm mb-1">Method</h4>
//                                             <p className="text-white text-lg md:text-xl font-bold">HPLC</p>
//                                         </div>
//                                     </div>
//                                     <p className="text-xs text-gray-400 text-center">Every batch tested for purity and identity • Third-party lab verified</p>
//                                 </div>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/app/contexts/CartContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { getMemberPrice, getTier } from "@/app/lib/products";
import { useGetSingleProductQuery } from "@/app/redux/features/products/productsApi";

type TabType = "overview" | "research" | "coa";

// Define the product type based on API response
interface ProductSize {
    mg: number;
    price: number;
}

interface ProductReference {
    url: string;
    title: string;
}

interface Product {
    id: number;
    name: string;
    sizes: ProductSize[];
    desc: string;
    details: string;
    references: ProductReference[];
    createdAt: string;
    updatedAt: string;
}

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const { cart, addToCart, removeFromCart } = useCart();
    const { user } = useAuth();

    const [selectedTab, setSelectedTab] = useState<TabType>("overview");
    const productId = params.id ? parseInt(params.id as string) : null;

    // Fetch product from API
    const { data: productData, isLoading, isError } = useGetSingleProductQuery(productId!, { skip: !productId });

    const product = productData?.data;

    const tier = getTier(user?.referralCount || 0);
    const isBacWater = product?.name?.includes("BAC Water") || false;

    // Handle loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    // Handle error state
    if (isError || !product) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 mb-4">Product not found</p>
                    <Link href="/" className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold">
                        Back to Store
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
            <div className="container mx-auto px-4 py-6 md:py-8">
                {/* Back Button */}
                <button onClick={() => router.back()} className="mb-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to Store
                </button>

                {/* Product Details */}
                <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8">
                    {/* Product Image */}
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 md:p-8 flex items-center justify-center aspect-square">
                        <div className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-600 text-center">{product.name.substring(0, 5)}</div>
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">{product.name}</h1>
                        <p className="text-gray-300 mb-6">{product.desc}</p>

                        {/* Sizes */}
                        <div className="space-y-3 mb-6">
                            {product.sizes.map((size: ProductSize) => {
                                const cartItem = cart.find((item) => item.product.id === product.id && item.size.mg === size.mg);
                                const quantity = cartItem ? cartItem.quantity : 0;

                                return (
                                    <div key={size.mg} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                                        <div>
                                            <div className="text-lg font-bold text-white">{size.mg}mg</div>
                                            <div className="text-sm text-gray-400">Lyophilized Powder</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500 line-through">${size.price}</div>
                                                <div className="text-xl md:text-2xl font-bold text-cyan-400">${getMemberPrice(size.price, user)}</div>
                                            </div>
                                            <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-2">
                                                <button onClick={() => removeFromCart(product.id, size.mg)} className="w-8 h-8 flex items-center justify-center bg-slate-700 hover:bg-slate-600 text-white rounded font-bold">
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-white font-bold">{quantity}</span>
                                                <button onClick={() => addToCart(product, size)} className="w-8 h-8 flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-white rounded font-bold">
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Features */}
                        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                            <div className="text-sm text-gray-400 space-y-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span>
                                    <span>99% Purity • Third-party tested</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span>
                                    <span>HPLC verified</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-green-400">✓</span>
                                    <span>COA available</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                    <div className="flex border-b border-slate-700">
                        <button onClick={() => setSelectedTab("overview")} className={`flex-1 px-4 md:px-6 py-3 md:py-4 text-sm font-semibold ${selectedTab === "overview" ? "text-cyan-400 bg-slate-900 border-b-2 border-cyan-400" : "text-gray-400 hover:text-white"}`}>
                            Overview
                        </button>
                        {!isBacWater && (
                            <button onClick={() => setSelectedTab("research")} className={`flex-1 px-4 md:px-6 py-3 md:py-4 text-sm font-semibold ${selectedTab === "research" ? "text-cyan-400 bg-slate-900 border-b-2 border-cyan-400" : "text-gray-400 hover:text-white"}`}>
                                Research
                            </button>
                        )}
                        {!isBacWater && (
                            <button onClick={() => setSelectedTab("coa")} className={`flex-1 px-4 md:px-6 py-3 md:py-4 text-sm font-semibold ${selectedTab === "coa" ? "text-cyan-400 bg-slate-900 border-b-2 border-cyan-400" : "text-gray-400 hover:text-white"}`}>
                                COA
                            </button>
                        )}
                    </div>

                    <div className="p-4 md:p-6 lg:p-8">
                        {selectedTab === "overview" && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Description</h3>
                                    <p className="text-gray-300 leading-relaxed">{product.details}</p>
                                </div>
                                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 md:p-6">
                                    <p className="text-red-300 text-sm font-semibold mb-2">⚠️ IMPORTANT DISCLAIMER</p>
                                    <p className="text-red-200 text-sm">This product is intended for research purposes only. Not for human consumption, medical use, or veterinary applications.</p>
                                </div>
                            </div>
                        )}

                        {selectedTab === "research" && !isBacWater && (
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Research References</h3>
                                <p className="text-gray-400 mb-4 md:mb-6">Peer-reviewed research and academic literature:</p>
                                <div className="space-y-3">
                                    {product.references.map((ref: ProductReference, idx: number) => (
                                        <a key={idx} href={ref.url} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition">
                                            <span className="text-cyan-400 mt-1">📄</span>
                                            <div>
                                                <p className="text-white font-semibold">{ref.title}</p>
                                                <p className="text-sm text-gray-400">Access peer-reviewed research</p>
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}

                        {selectedTab === "coa" && !isBacWater && (
                            <div>
                                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 md:mb-4">Certificate of Analysis</h3>
                                <div className="bg-slate-900 rounded-lg p-4 md:p-6 lg:p-8 mt-4">
                                    <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-4 md:mb-6">
                                        <div>
                                            <h4 className="text-gray-400 text-sm mb-1">Batch Number</h4>
                                            <p className="text-white text-lg md:text-xl font-bold">PC-{product.name.substring(0, 3).toUpperCase()}-240124</p>
                                        </div>
                                        <div>
                                            <h4 className="text-gray-400 text-sm mb-1">Purity</h4>
                                            <p className="text-green-400 text-lg md:text-xl font-bold">99%</p>
                                        </div>
                                        <div>
                                            <h4 className="text-gray-400 text-sm mb-1">Testing Date</h4>
                                            <p className="text-white text-lg md:text-xl font-bold">October 2024</p>
                                        </div>
                                        <div>
                                            <h4 className="text-gray-400 text-sm mb-1">Method</h4>
                                            <p className="text-white text-lg md:text-xl font-bold">HPLC</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-400 text-center">Every batch tested for purity and identity • Third-party lab verified</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
