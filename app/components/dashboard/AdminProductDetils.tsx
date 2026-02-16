"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useGetAdminSingleProductQuery } from "@/app/redux/features/products/productsApi";
import { ArrowLeft, Edit, FileText, Image as ImageIcon, Calendar, Package, Tag, ExternalLink, Download } from "lucide-react";

export default function AdminProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const productId = parseInt(params.id as string);

    const [showImageModal, setShowImageModal] = useState(false);
    const [showCoaModal, setShowCoaModal] = useState(false);

    const { data: productData, isLoading, error } = useGetAdminSingleProductQuery(productId);
    const product = productData?.data;

    const API_URL = process.env.NEXT_PUBLIC_BASE_API || "http://localhost:5050";

    const getFullUrl = (path: string) => {
        if (!path) return "";
        if (path.startsWith("http")) return path;
        return `${API_URL}${path}`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-white mb-4">Product Not Found</h1>
                        <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
                        <Link href="/admin?tab=products" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium">
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-4">
                        <button onClick={() => router.back()} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Product Details</h1>
                            <p className="text-gray-400">
                                ID: {product.id} • {product.name}
                            </p>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                        <Link href={`/admin/product/edit/${product.id}`} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium flex items-center gap-2 transition-colors">
                            <Edit className="w-4 h-4" />
                            Edit Product
                        </Link>
                        <Link href={`/product/${product.id}`} target="_blank" className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium flex items-center gap-2 transition-colors">
                            <ExternalLink className="w-4 h-4" />
                            View Public Page
                        </Link>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Image and Basic Info */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Product Image Card */}
                        <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                            <div className="p-4 border-b border-slate-700 bg-slate-900/50">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-cyan-400" />
                                    Product Image
                                </h2>
                            </div>
                            <div className="p-4">
                                {product.image ? (
                                    <div className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 cursor-pointer hover:opacity-90 transition" onClick={() => setShowImageModal(true)}>
                                        <Image src={getFullUrl(product.image)} alt={product.name} fill className="object-cover" unoptimized />
                                    </div>
                                ) : (
                                    <div className="aspect-square bg-slate-900 rounded-lg flex items-center justify-center border border-slate-700">
                                        <div className="text-4xl font-black text-slate-700 text-center px-2">{product.name.substring(0, 3)}</div>
                                    </div>
                                )}
                                {product.image && <p className="text-xs text-gray-500 mt-2 text-center">Click image to view full size</p>}
                            </div>
                        </div>

                        {/* Status Card */}
                        <div className="bg-slate-800 rounded-xl border border-slate-700 p-4">
                            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-cyan-400" />
                                Status
                            </h2>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">In Stock</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.inStock ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>{product.inStock ? "Yes" : "No"}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-400">Deleted</span>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${product.isDeleted ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-green-500/20 text-green-400 border border-green-500/30"}`}>{product.isDeleted ? "Yes" : "No"}</span>
                                </div>
                                <div className="pt-2 border-t border-slate-700">
                                    <p className="text-sm text-gray-400 flex items-center gap-2">
                                        <Calendar className="w-4 h-4" />
                                        Created: {formatDate(product.createdAt)}
                                    </p>
                                    {product.updatedAt && (
                                        <p className="text-sm text-gray-400 flex items-center gap-2 mt-1">
                                            <Calendar className="w-4 h-4" />
                                            Updated: {formatDate(product.updatedAt)}
                                        </p>
                                    )}
                                    {product.deletedAt && (
                                        <p className="text-sm text-red-400 flex items-center gap-2 mt-1">
                                            <Calendar className="w-4 h-4" />
                                            Deleted: {formatDate(product.deletedAt)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Middle Column - Product Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Basic Info Card */}
                        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Tag className="w-5 h-5 text-cyan-400" />
                                Basic Information
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Product Name</label>
                                    <p className="text-white text-lg font-semibold">{product.name}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Short Description</label>
                                    <p className="text-gray-300">{product.desc}</p>
                                </div>
                                <div>
                                    <label className="text-sm text-gray-400 block mb-1">Detailed Description</label>
                                    <p className="text-gray-300 whitespace-pre-wrap">{product.details}</p>
                                </div>
                            </div>
                        </div>

                        {/* Sizes Card */}
                        <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5 text-cyan-400" />
                                Sizes & Pricing
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {product.sizes.map((size: any, index: number) => (
                                    <div key={index} className="bg-slate-900 rounded-lg p-4 border border-slate-700">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-lg font-bold text-cyan-400">{size.mg}mg</span>
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${size.quantity > 0 ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>Stock: {size.quantity}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-white">
                                                <span className="text-gray-400">Price:</span> ${size.price.toFixed(2)}
                                            </p>
                                            <p className="text-sm text-gray-400">Total Value: ${(size.price * size.quantity).toFixed(2)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 text-sm text-gray-400">Total SKUs: {product.sizes.length}</div>
                        </div>

                        {/* References Card */}
                        {product.references && product.references.length > 0 && (
                            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-cyan-400" />
                                    Research References
                                </h2>
                                <div className="space-y-3">
                                    {product.references.map((ref: any, index: number) => (
                                        <a key={index} href={ref.url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-slate-900 rounded-lg hover:bg-slate-800 transition border border-slate-700">
                                            <p className="text-white font-medium mb-1">{ref.title}</p>
                                            <p className="text-sm text-cyan-400 break-all">{ref.url}</p>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* COA Section - Full Width at Bottom */}
                {product.coa && (
                    <div className="mt-6 bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-slate-700 bg-slate-900/50">
                            <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                <FileText className="w-5 h-5 text-cyan-400" />
                                Certificate of Analysis (COA)
                            </h2>
                        </div>
                        <div className="p-4">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{product.coa.mimetype?.startsWith("image/") ? "🖼️" : "📄"}</span>
                                    <div>
                                        <p className="text-white font-medium">{product.coa.filename}</p>
                                        <p className="text-sm text-gray-400">
                                            {product.coa.mimetype} • {(product.coa.size / 1024).toFixed(2)} KB
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => setShowCoaModal(true)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium flex items-center gap-2 transition-colors">
                                        <ExternalLink className="w-4 h-4" />
                                        Preview
                                    </button>
                                </div>
                            </div>
                            {product.coa.mimetype?.startsWith("image/") ? (
                                <div className="mt-4 relative w-full max-w-md aspect-square rounded-lg overflow-hidden border border-slate-700 cursor-pointer hover:opacity-90 transition" onClick={() => setShowCoaModal(true)}>
                                    <Image src={getFullUrl(product.coa.url)} alt="COA" fill className="object-contain" unoptimized />
                                </div>
                            ) : (
                                <div className="mt-4">
                                    <iframe src={`${getFullUrl(product.coa.url)}#toolbar=0&view=FitH`} className="w-full h-96 rounded-lg border border-slate-700 bg-slate-900" title="COA PDF Preview" />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Image Modal */}
            {showImageModal && product.image && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setShowImageModal(false)}>
                    <div className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 rounded-xl border border-slate-700 overflow-hidden">
                        <div className="absolute top-4 right-4 z-10">
                            <button onClick={() => setShowImageModal(false)} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-400 hover:text-white transition-colors">
                                ✕
                            </button>
                        </div>
                        <div className="relative w-full h-[80vh]">
                            <Image src={getFullUrl(product.image)} alt={product.name} fill className="object-contain" unoptimized />
                        </div>
                    </div>
                </div>
            )}

            {/* COA Modal */}
            {showCoaModal && product?.coa && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setShowCoaModal(false)}>
                    <div className="relative w-full max-w-5xl h-[90vh] bg-slate-900 rounded-xl border border-slate-700 flex flex-col">
                        <div className="flex justify-between items-center p-4 border-b border-slate-700">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{product.coa.mimetype?.startsWith("image/") ? "🖼️" : "📄"}</span>
                                <div>
                                    <h3 className="text-lg font-bold text-white">{product.coa.filename}</h3>
                                    <p className="text-sm text-gray-400">{(product.coa.size / 1024).toFixed(2)} KB</p>
                                </div>
                            </div>
                            <button onClick={() => setShowCoaModal(false)} className="p-2 hover:bg-slate-800 rounded-lg text-gray-400 hover:text-white">
                                ✕
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-4">
                            {product.coa.mimetype?.startsWith("image/") ? (
                                <div className="relative w-full h-full min-h-125">
                                    <Image src={getFullUrl(product.coa.url)} alt="COA" fill className="object-contain" unoptimized />
                                </div>
                            ) : (
                                <iframe src={`${getFullUrl(product.coa.url)}#toolbar=0`} className="w-full h-full rounded-lg" title="COA PDF" />
                            )}
                        </div>
                        <div className="flex justify-end gap-3 p-4 border-t border-slate-700">
                            <button onClick={() => setShowCoaModal(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg font-medium">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
