// "use client";

// import { useGetProductsQuery } from "@/app/redux/features/products/productsApi";
// import Link from "next/link";
// import { useState, useEffect } from "react";

// interface Product {
//     id: string;
//     name: string;
//     desc: string;
//     price: number;
//     sizes: string[];
// }

// export default function ProductsTab() {
//     const { data: newProducts } = useGetProductsQuery({});
//     console.log(newProducts);
//     const [products, setProducts] = useState<Product[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadProducts();
//     }, []);

//     const loadProducts = async () => {
//         try {
//             setLoading(true);
//             // Mock API call
//             await new Promise((resolve) => setTimeout(resolve, 500));

//             const mockProducts: Product[] = [
//                 {
//                     id: "1",
//                     name: "Retatrutide",
//                     desc: "Advanced weight management peptide",
//                     price: 299.99,
//                     sizes: ["5mg", "10mg", "20mg"],
//                 },
//                 {
//                     id: "2",
//                     name: "BPC-157",
//                     desc: "Healing and recovery peptide",
//                     price: 199.99,
//                     sizes: ["5mg", "10mg"],
//                 },
//                 {
//                     id: "3",
//                     name: "NAD+",
//                     desc: "Anti-aging and cellular energy",
//                     price: 399.99,
//                     sizes: ["100mg", "200mg", "500mg"],
//                 },
//             ];

//             setProducts(mockProducts);
//         } catch (error) {
//             console.error("Failed to load products:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateProduct = async (productId: string, data: any) => {
//         try {
//             // Mock API call - replace with actual
//             await new Promise((resolve) => setTimeout(resolve, 300));

//             setProducts((prev) => prev.map((product) => (product.id === productId ? { ...product, ...data } : product)));
//         } catch (error) {
//             alert("Failed to update product: " + (error as Error).message);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <div className="flex items-center justify-between">
//                 <h2 className="text-3xl font-bold text-white mb-6">Products</h2>
//                 <Link href="/admin/product/add" className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow">
//                     Create New Product
//                 </Link>
//             </div>
//             <div className="space-y-4">
//                 {products.length > 0 ? (
//                     products.map((product) => (
//                         <div key={product.id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
//                             <div className="flex justify-between items-start mb-4">
//                                 <div>
//                                     <h3 className="text-xl font-bold text-white">{product.name}</h3>
//                                     <p className="text-sm text-gray-400">{product.desc}</p>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-2xl font-bold text-cyan-400">${product.price || "Multiple"}</p>
//                                     <p className="text-sm text-gray-400">ID: {product.id}</p>
//                                 </div>
//                             </div>

//                             <div className="mb-4">
//                                 <p className="text-gray-300 text-sm">
//                                     <strong>Sizes:</strong> {JSON.stringify(product.sizes || [])}
//                                 </p>
//                             </div>

//                             <div className="flex gap-2">
//                                 <button
//                                     onClick={() => {
//                                         const price = prompt("Update base price:", product.price?.toString() || "");
//                                         if (price) updateProduct(product.id, { price: parseFloat(price) });
//                                     }}
//                                     className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
//                                 >
//                                     Edit Price
//                                 </button>
//                                 <button
//                                     onClick={() => {
//                                         const stock = prompt("Update stock quantity:", "10");
//                                         if (stock) updateProduct(product.id, { stock: parseInt(stock) });
//                                     }}
//                                     className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
//                                 >
//                                     Edit Stock
//                                 </button>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <p className="text-gray-400">No products yet</p>
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";

import { useDeleteProductMutation, useGetProductsQuery } from "@/app/redux/features/products/productsApi";
import Link from "next/link";
import { useState } from "react";
import { useModal } from "@/app/providers/ModalContext";
import Pagination from "@/app/utils/Pagination";

interface Product {
    id: number;
    name: string;
    desc: string;
    sizes: Array<{ mg: number; price: number }>;
    references: Array<{ url: string; title: string }>;
    coa?: {
        batchNumber: string;
        purity: string;
        testingDate: string;
        method: string;
        notes: string;
    };
    createdAt: string;
    isDeleted: boolean;
    deletedAt: string | null;
}

export default function ProductsTab() {
    const { openModal } = useModal();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);

    const {
        data: productsData,
        isLoading,
        refetch,
    } = useGetProductsQuery({
        page,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const products = productsData?.data || [];
    const meta = productsData?.meta || { page: 1, limit: 12, total: 0, totalPages: 1 };
    const [deleteProduct] = useDeleteProductMutation();

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleDelete = (product: Product) => {
        openModal({
            type: "confirm",
            title: "Delete Product",
            message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
            confirmText: "Delete",
            cancelText: "Cancel",
            isDestructive: true,
            onConfirm: async () => {
                try {
                    // You'll need to implement deleteProduct mutation
                    await deleteProduct(product.id).unwrap();
                    openModal({
                        type: "success",
                        title: "Success",
                        message: `Product "${product.name}" has been deleted.`,
                        onConfirm: () => {
                            refetch();
                        },
                    });
                } catch (error: any) {
                    openModal({
                        type: "error",
                        title: "Error",
                        message: error?.data?.message || "Failed to delete product",
                    });
                }
            },
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-3xl font-bold text-white">Products</h2>
                </div>
                <Link href="/admin/product/create" className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow">
                    Create New Product
                </Link>
            </div>

            {/* Products List */}
            <div className="space-y-4">
                {products.length > 0 ? (
                    products.map((product: any) => (
                        <div key={product.id} className={`bg-slate-800 rounded-2xl p-6 border ${product.isDeleted ? "border-red-500/30 bg-red-900/10" : "border-slate-700"}`}>
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="text-xl font-bold text-white">{product.name}</h3>
                                        {product.isDeleted && <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Deleted</span>}
                                    </div>
                                    <p className="text-sm text-gray-400 mb-2">{product.desc}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>ID: {product.id}</span>
                                        <span>•</span>
                                        <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
                                        {product.isDeleted && product.deletedAt && (
                                            <>
                                                <span>•</span>
                                                <span className="text-red-400">Deleted: {new Date(product.deletedAt).toLocaleDateString()}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-cyan-400">${product.sizes[0]?.price || "0"}</p>
                                    <p className="text-sm text-gray-400">{product.sizes.length} size(s)</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Sizes & Prices</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size: any, index: any) => (
                                            <span key={index} className="px-2 py-1 bg-slate-900 text-white text-xs rounded">
                                                {size.mg}mg: ${size.price}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-400 mb-1">References</p>
                                    <p className="text-white">{product.references?.length || 0} reference(s)</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-400 mb-1">COA</p>
                                    <p className="text-white">{product.coa ? "Available" : "Not available"}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link href={`/admin/product/edit/${product.id}`} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors">
                                    Edit
                                </Link>

                                <button onClick={() => handleDelete(product)} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors">
                                    Delete
                                </button>
                                {/* {!product.isDeleted ? (
                                    <button onClick={() => handleDelete(product)} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors">
                                        Delete
                                    </button>
                                ) : (
                                    <button onClick={() => handleRestore(product)} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors">
                                        Restore
                                    </button>
                                )} */}

                                <Link href={`/product/${product.id}`} className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition-colors" target="_blank">
                                    View
                                </Link>

                                <button
                                    onClick={() => {
                                        openModal({
                                            type: "info",
                                            title: "Product Details",
                                            message: "",
                                            children: (
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="text-sm text-gray-400">Name</p>
                                                        <p className="text-white">{product.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-400">Description</p>
                                                        <p className="text-white">{product.desc}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-gray-400">Details</p>
                                                        <p className="text-white">{product.details}</p>
                                                    </div>
                                                    {product.coa && (
                                                        <div>
                                                            <p className="text-sm text-gray-400">COA Info</p>
                                                            <p className="text-white">
                                                                {product.coa.batchNumber} - {product.coa.purity}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ),
                                        });
                                    }}
                                    className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition-colors"
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-400 text-lg">No products found</p>
                        <p className="text-gray-500 text-sm mt-2">Create your first product to get started</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {meta.total > 0 && <Pagination meta={meta} onPageChange={handlePageChange} onLimitChange={handleLimitChange} showLimitSelector={true} />}
        </div>
    );
}
