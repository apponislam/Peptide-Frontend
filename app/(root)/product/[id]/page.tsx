"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { addToCart, removeFromCart } from "@/app/redux/features/cart/cartSlice";
import { selectCartItems } from "@/app/redux/features/cart/cartSlice";
import { getTier } from "@/app/utils/pricing";
import { useGetSingleProductQuery } from "@/app/redux/features/products/productsApi";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";

type TabType = "overview" | "research" | "coa";

// Define the product type based on API response
interface ProductSize {
    mg: number;
    price: number;
    quantity: number;
}

interface ProductReference {
    url: string;
    title: string;
}

interface ProductCOA {
    url: string;
    filename: string;
    mimetype: string;
    size: number;
}

interface Product {
    id: number;
    name: string;
    sizes: ProductSize[];
    desc: string;
    details: string;
    references: ProductReference[];
    image?: string | null;
    coa?: ProductCOA | null;
    createdAt: string;
    updatedAt: string;
}

export default function ProductPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const { data: userData } = useGetMeQuery();
    const user = userData?.data;

    // Get cart from Redux
    const cart = useSelector(selectCartItems);

    const [selectedTab, setSelectedTab] = useState<TabType>("overview");
    const [showCoaModal, setShowCoaModal] = useState(false);
    const productId = params.id ? parseInt(params.id as string) : null;

    // Fetch product from API
    const { data: productData, isLoading, isError } = useGetSingleProductQuery(productId!, { skip: !productId });

    const product = productData?.data;

    // Use user.tier instead of referralCount
    const tier = getTier(user?.tier || "Member");
    const isBacWater = product?.name?.includes("BAC Water") || false;

    // API URL for images
    const API_URL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5050/api/v1";

    // Simple getMemberPrice function
    const getMemberPrice = (price: number) => {
        if (!user) return price.toFixed(2);
        return (price * (1 - tier.discount / 100)).toFixed(2);
    };

    // Handle add to cart with stock limit
    const handleAddToCart = (product: Product, size: ProductSize) => {
        const cartItem = cart.find((item) => item.product.id === product.id && item.size.mg === size.mg);
        const currentQty = cartItem ? cartItem.quantity : 0;

        if (currentQty < size.quantity) {
            // Create a product that matches cartSlice's Product type
            const cartProduct = {
                id: product.id,
                name: product.name,
                desc: product.desc,
                details: product.details,
                sizes: product.sizes, // Now includes quantity
                references: product.references,
                coa: product.coa ? product.coa.url : null,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt,
                image: product.image,
            };

            dispatch(addToCart({ product: cartProduct, size }));
        }
    };

    // Handle remove from cart
    const handleRemoveFromCart = (productId: number, mg: number) => {
        dispatch(removeFromCart({ productId, mg }));
    };

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
                    <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 md:p-8 flex items-center justify-center aspect-square relative">
                        {product.image ? <Image src={`${API_URL}${product.image}`} alt={product.name} fill className="object-cover rounded-lg" sizes="(max-width: 768px) 100vw, 50vw" unoptimized /> : <div className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-600 text-center">{product.name.substring(0, 5)}</div>}
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
                                const maxReached = quantity >= size.quantity;

                                return (
                                    <div key={size.mg} className="flex items-center justify-between p-4 bg-slate-900 rounded-lg">
                                        <div>
                                            <div className="text-lg font-bold text-white">{size.mg}mg</div>
                                            <div className="text-sm text-gray-400">Lyophilized Powder</div>
                                            <div className="text-xs text-gray-500 mt-1">Stock: {size.quantity}</div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <div className="text-sm text-gray-500 line-through">${size.price}</div>
                                                <div className="text-xl md:text-2xl font-bold text-cyan-400">${getMemberPrice(size.price)}</div>
                                            </div>
                                            <div className="flex items-center gap-2 bg-slate-800 rounded-lg p-2">
                                                <button onClick={() => handleRemoveFromCart(product.id, size.mg)} className={`w-8 h-8 flex items-center justify-center rounded font-bold ${quantity === 0 ? "bg-slate-800 cursor-not-allowed opacity-50" : "bg-slate-700 hover:bg-slate-600"} text-white`} disabled={quantity === 0}>
                                                    -
                                                </button>
                                                <span className="w-8 text-center text-white font-bold">{quantity}</span>
                                                <button onClick={() => handleAddToCart(product, size)} className={`w-8 h-8 flex items-center justify-center rounded font-bold ${maxReached ? "bg-gray-600 cursor-not-allowed opacity-50" : "bg-cyan-500 hover:bg-cyan-600"} text-white`} disabled={maxReached}>
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Features */}
                        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
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

                                        {product.coa ? (
                                            <div>
                                                <div className="bg-slate-900 rounded-lg p-4 md:p-6 mb-4">
                                                    <div className="flex items-center justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-3xl">{product.coa.mimetype?.startsWith("image/") ? "🖼️" : "📄"}</span>
                                                            <div>
                                                                <p className="text-white font-semibold">{product.coa.filename}</p>
                                                                <p className="text-sm text-gray-400">{(product.coa.size / 1024).toFixed(2)} KB</p>
                                                            </div>
                                                        </div>
                                                        <button onClick={() => setShowCoaModal(true)} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold">
                                                            View COA
                                                        </button>
                                                    </div>
                                                    <p className="text-xs text-gray-400">Click "View COA" to open the certificate in full screen</p>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="bg-slate-900 rounded-lg p-8 text-center">
                                                <p className="text-gray-400">No COA available for this product</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                {/* <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
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

                                {product.coa ? (
                                    <div>
                                        <div className="bg-slate-900 rounded-lg p-4 md:p-6 mb-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl">{product.coa.mimetype?.startsWith("image/") ? "🖼️" : "📄"}</span>
                                                    <div>
                                                        <p className="text-white font-semibold">{product.coa.filename}</p>
                                                        <p className="text-sm text-gray-400">{(product.coa.size / 1024).toFixed(2)} KB</p>
                                                    </div>
                                                </div>
                                                <button onClick={() => setShowCoaModal(true)} className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold">
                                                    View COA
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-400">Click "View COA" to open the certificate in full screen</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-slate-900 rounded-lg p-8 text-center">
                                        <p className="text-gray-400">No COA available for this product</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div> */}
            </div>

            {/* COA Preview Modal */}
            {showCoaModal && product?.coa && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
                    <div className="relative w-full max-w-5xl h-[90vh] bg-slate-900 rounded-xl border border-slate-700 flex flex-col">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-4 border-b border-slate-700">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{product.coa.mimetype?.startsWith("image/") ? "🖼️" : "📄"}</span>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{product.coa.filename}</h3>
                                    <p className="text-sm text-gray-400">{(product.coa.size / 1024).toFixed(2)} KB</p>
                                </div>
                            </div>
                            <button onClick={() => setShowCoaModal(false)} className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="flex-1 overflow-auto p-4">
                            {product.coa.mimetype?.startsWith("image/") ? (
                                <div className="relative w-full h-full min-h-125">
                                    <Image src={`${API_URL}${product.coa.url}`} alt="COA" fill className="object-contain" unoptimized />
                                </div>
                            ) : (
                                <iframe src={`${API_URL}${product.coa.url}#toolbar=0`} className="w-full h-full rounded-lg" title="COA PDF" />
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-3 p-4 border-t border-slate-700">
                            <button onClick={() => setShowCoaModal(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
