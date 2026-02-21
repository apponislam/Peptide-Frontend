// "use client";

// import { useDeleteProductMutation, useGetAdminProductsQuery, useToggleProductStockMutation } from "@/app/redux/features/products/productsApi";
// import Link from "next/link";
// import { useState } from "react";
// import { useModal } from "@/app/providers/ModalContext";
// import Pagination from "@/app/utils/Pagination";

// interface Product {
//     id: number;
//     name: string;
//     desc: string;
//     details: string;
//     sizes: Array<{ mg: number; price: number; quantity: number }>;
//     references: Array<{ url: string; title: string }>;
//     coa?: {
//         batchNumber: string;
//         purity: string;
//         testingDate: string;
//         method: string;
//         notes: string;
//     } | null;
//     image?: string | null;
//     inStock: boolean;
//     createdAt: string;
//     isDeleted: boolean;
//     deletedAt: string | null;
// }

// export default function ProductsTab() {
//     const { showModal } = useModal();
//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(12);

//     const {
//         data: productsData,
//         isLoading,
//         refetch,
//     } = useGetAdminProductsQuery({
//         page,
//         limit,
//         sortBy: "createdAt",
//         sortOrder: "desc",
//     });

//     const products = productsData?.data || [];
//     const meta = productsData?.meta || { page: 1, limit: 12, total: 0, totalPages: 1 };

//     const [deleteProduct] = useDeleteProductMutation();
//     const [toggleStock, { isLoading: isToggling }] = useToggleProductStockMutation();

//     const handlePageChange = (newPage: number) => {
//         setPage(newPage);
//     };

//     const handleLimitChange = (newLimit: number) => {
//         setLimit(newLimit);
//         setPage(1);
//     };

//     const handleDelete = async (product: Product) => {
//         const confirmed = await showModal({
//             type: "confirm",
//             title: "Delete Product",
//             message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
//             confirmText: "Delete",
//             cancelText: "Cancel",
//             isDestructive: true,
//         });

//         if (!confirmed) return;

//         try {
//             await deleteProduct(product.id).unwrap();

//             await showModal({
//                 type: "success",
//                 title: "Success",
//                 message: `Product "${product.name}" has been deleted.`,
//                 confirmText: "OK",
//             });

//             refetch();
//         } catch (error: any) {
//             await showModal({
//                 type: "error",
//                 title: "Error",
//                 message: error?.data?.message || "Failed to delete product",
//                 confirmText: "OK",
//             });
//         }
//     };

//     const handleToggleStock = async (product: Product) => {
//         try {
//             await toggleStock(product.id).unwrap();

//             // Show a small toast or just refetch
//             refetch();
//         } catch (error: any) {
//             await showModal({
//                 type: "error",
//                 title: "Error",
//                 message: error?.data?.message || "Failed to toggle stock status",
//                 confirmText: "OK",
//             });
//         }
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <div className="flex items-center justify-between mb-6">
//                 <div>
//                     <h2 className="text-3xl font-bold text-white">Products</h2>
//                 </div>
//                 <Link href="/admin/product/create" className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow">
//                     Create New Product
//                 </Link>
//             </div>

//             {/* Products List */}
//             <div className="space-y-4">
//                 {products.length > 0 ? (
//                     products.map((product: Product) => (
//                         <div key={product.id} className={`bg-slate-800 rounded-2xl p-6 border ${product.isDeleted ? "border-red-500/30 bg-red-900/10" : "border-slate-700"}`}>
//                             <div className="flex justify-between items-start mb-4">
//                                 <div className="flex-1">
//                                     <div className="flex items-center gap-2 mb-2">
//                                         <h3 className="text-xl font-bold text-white">{product.name}</h3>
//                                         {product.isDeleted && <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Deleted</span>}
//                                     </div>
//                                     <p className="text-sm text-gray-400 mb-2">{product.desc}</p>
//                                     <div className="flex items-center gap-4 text-xs text-gray-500">
//                                         <span>ID: {product.id}</span>
//                                         <span>•</span>
//                                         <span>Created: {new Date(product.createdAt).toLocaleDateString()}</span>
//                                         {product.isDeleted && product.deletedAt && (
//                                             <>
//                                                 <span>•</span>
//                                                 <span className="text-red-400">Deleted: {new Date(product.deletedAt).toLocaleDateString()}</span>
//                                             </>
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-2xl font-bold text-cyan-400">${product.sizes[0]?.price || "0"}</p>
//                                     <p className="text-sm text-gray-400">{product.sizes.length} size(s)</p>
//                                 </div>
//                             </div>

//                             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//                                 <div>
//                                     <p className="text-sm text-gray-400 mb-1">Sizes & Prices</p>
//                                     <div className="flex flex-wrap gap-2">
//                                         {product.sizes.map((size: any, index: any) => (
//                                             <span key={index} className="px-2 py-1 bg-slate-900 text-white text-xs rounded">
//                                                 {size.mg}mg: ${size.price} ({size.quantity} in stock)
//                                             </span>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 <div>
//                                     <p className="text-sm text-gray-400 mb-1">References</p>
//                                     <p className="text-white">{product.references?.length || 0} reference(s)</p>
//                                 </div>

//                                 <div>
//                                     <p className="text-sm text-gray-400 mb-1">COA</p>
//                                     <p className="text-white">{product.coa ? "Available" : "Not available"}</p>
//                                 </div>

//                                 <div>
//                                     <p className="text-sm text-gray-400 mb-1">Stock Status</p>
//                                     <div className="flex items-center gap-2">
//                                         <button onClick={() => handleToggleStock(product)} disabled={isToggling} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${product.inStock ? "bg-green-500" : "bg-gray-600"}`}>
//                                             <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.inStock ? "translate-x-6" : "translate-x-1"}`} />
//                                         </button>
//                                         <span className={`text-sm ${product.inStock ? "text-green-400" : "text-gray-400"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</span>
//                                         {isToggling && <div className="animate-spin h-4 w-4 border-2 border-cyan-500 border-t-transparent rounded-full ml-2"></div>}
//                                     </div>
//                                 </div>
//                             </div>

//                             <div className="flex gap-2 flex-wrap">
//                                 <Link href={`/admin/product/edit/${product.id}`} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors">
//                                     Edit
//                                 </Link>

//                                 <button onClick={() => handleDelete(product)} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors">
//                                     Delete
//                                 </button>

//                                 <Link href={`/product/${product.id}`} className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition-colors" target="_blank">
//                                     View
//                                 </Link>

//                                 {/* <button
//                                     onClick={() => {
//                                         showModal({
//                                             type: "info",
//                                             title: "Product Details",
//                                             message: "",
//                                             children: (
//                                                 <div className="space-y-3">
//                                                     <div>
//                                                         <p className="text-sm text-gray-400">Name</p>
//                                                         <p className="text-white">{product.name}</p>
//                                                     </div>
//                                                     <div>
//                                                         <p className="text-sm text-gray-400">Description</p>
//                                                         <p className="text-white">{product.desc}</p>
//                                                     </div>
//                                                     <div>
//                                                         <p className="text-sm text-gray-400">Details</p>
//                                                         <p className="text-white">{product.details}</p>
//                                                     </div>
//                                                     <div>
//                                                         <p className="text-sm text-gray-400">Stock Status</p>
//                                                         <p className={`${product.inStock ? "text-green-400" : "text-red-400"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</p>
//                                                     </div>
//                                                     {product.coa && (
//                                                         <div>
//                                                             <p className="text-sm text-gray-400">COA Info</p>
//                                                             <p className="text-white">
//                                                                 {product.coa.batchNumber} - {product.coa.purity}
//                                                             </p>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             ),
//                                             confirmText: "Close",
//                                         });
//                                     }}
//                                     className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition-colors"
//                                 >
//                                     Details
//                                 </button> */}
//                                 <Link href={`/admin/product/${product.id}`} className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition-colors">
//                                     Details
//                                 </Link>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <div className="text-center py-12">
//                         <p className="text-gray-400 text-lg">No products found</p>
//                         <p className="text-gray-500 text-sm mt-2">Create your first product to get started</p>
//                     </div>
//                 )}
//             </div>

//             {/* Pagination */}
//             {meta.total > 0 && <Pagination meta={meta} onPageChange={handlePageChange} onLimitChange={handleLimitChange} showLimitSelector={true} />}
//         </div>
//     );
// }

"use client";

import { useDeleteProductMutation, useGetAdminProductsQuery, useToggleProductStockMutation, useUpdateProductMutation } from "@/app/redux/features/products/productsApi";
import Link from "next/link";
import { useState } from "react";
import { useModal } from "@/app/providers/ModalContext";
import Pagination from "@/app/utils/Pagination";

interface Product {
    id: number;
    name: string;
    desc: string;
    details: string;
    sizes: Array<{ mg: number; price: number; quantity: number }>;
    references: Array<{ url: string; title: string }>;
    coa?: {
        batchNumber: string;
        purity: string;
        testingDate: string;
        method: string;
        notes: string;
    } | null;
    image?: string | null;
    inStock: boolean;
    createdAt: string;
    isDeleted: boolean;
    deletedAt: string | null;
}

export default function ProductsTab() {
    const { showModal } = useModal();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [quantities, setQuantities] = useState<{ [key: string]: number }>({});
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

    const {
        data: productsData,
        isLoading,
        refetch,
    } = useGetAdminProductsQuery({
        page,
        limit,
        sortBy: "createdAt",
        sortOrder: "desc",
    });

    const products = productsData?.data || [];
    const meta = productsData?.meta || { page: 1, limit: 12, total: 0, totalPages: 1 };

    const [deleteProduct] = useDeleteProductMutation();
    const [toggleStock, { isLoading: isToggling }] = useToggleProductStockMutation();

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleIncrement = (productId: number, sizeIndex: number, currentQty: number) => {
        const key = `${productId}-${sizeIndex}`;
        setQuantities((prev) => ({
            ...prev,
            [key]: (prev[key] || currentQty) + 1,
        }));
    };

    const handleDecrement = (productId: number, sizeIndex: number, currentQty: number) => {
        const key = `${productId}-${sizeIndex}`;
        const newQty = (quantities[key] || currentQty) - 1;
        if (newQty >= 0) {
            setQuantities((prev) => ({
                ...prev,
                [key]: newQty,
            }));
        }
    };

    const getQuantity = (productId: number, sizeIndex: number, originalQty: number) => {
        const key = `${productId}-${sizeIndex}`;
        return quantities[key] ?? originalQty;
    };

    // const handleSaveQuantity = async (product: Product, sizeIndex: number, originalQty: number, mg: number) => {
    //     const key = `${product.id}-${sizeIndex}`;
    //     const newQty = quantities[key];

    //     if (newQty === undefined || newQty === originalQty) return;

    //     const confirmed = await showModal({
    //         type: "confirm",
    //         title: "Update Stock",
    //         message: `Change ${mg}mg stock from ${originalQty} to ${newQty}?`,
    //         confirmText: "Update",
    //         cancelText: "Cancel",
    //     });

    //     if (!confirmed) {
    //         setQuantities((prev) => {
    //             const newState = { ...prev };
    //             delete newState[key];
    //             return newState;
    //         });
    //         return;
    //     }

    //     try {
    //         const updatedSizes = [...product.sizes];
    //         updatedSizes[sizeIndex] = {
    //             ...updatedSizes[sizeIndex],
    //             quantity: newQty,
    //         };

    //         const formData = new FormData();
    //         formData.append("sizes", JSON.stringify(updatedSizes));

    //         await updateProduct({ id: product.id, data: formData }).unwrap();

    //         await showModal({
    //             type: "success",
    //             title: "Success",
    //             message: `Stock updated to ${newQty}`,
    //             confirmText: "OK",
    //         });

    //         setQuantities((prev) => {
    //             const newState = { ...prev };
    //             delete newState[key];
    //             return newState;
    //         });

    //         refetch();
    //     } catch (error: any) {
    //         await showModal({
    //             type: "error",
    //             title: "Error",
    //             message: error?.data?.message || "Failed to update stock",
    //             confirmText: "OK",
    //         });

    //         setQuantities((prev) => {
    //             const newState = { ...prev };
    //             delete newState[key];
    //             return newState;
    //         });
    //     }
    // };

    const handleSaveQuantity = async (product: Product, sizeIndex: number, originalQty: number, mg: number) => {
        const key = `${product.id}-${sizeIndex}`;
        const newQty = quantities[key];

        if (newQty === undefined || newQty === originalQty) return;

        try {
            const updatedSizes = [...product.sizes];
            updatedSizes[sizeIndex] = {
                ...updatedSizes[sizeIndex],
                quantity: newQty,
            };

            const formData = new FormData();
            formData.append("sizes", JSON.stringify(updatedSizes));

            await updateProduct({ id: product.id, data: formData }).unwrap();

            setQuantities((prev) => {
                const newState = { ...prev };
                delete newState[key];
                return newState;
            });

            refetch();
        } catch (error: any) {
            console.error("Failed to update stock:", error);
            setQuantities((prev) => {
                const newState = { ...prev };
                delete newState[key];
                return newState;
            });
        }
    };

    const handleDelete = async (product: Product) => {
        const confirmed = await showModal({
            type: "confirm",
            title: "Delete Product",
            message: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
            confirmText: "Delete",
            cancelText: "Cancel",
            isDestructive: true,
        });

        if (!confirmed) return;

        try {
            await deleteProduct(product.id).unwrap();

            await showModal({
                type: "success",
                title: "Success",
                message: `Product "${product.name}" has been deleted.`,
                confirmText: "OK",
            });

            refetch();
        } catch (error: any) {
            await showModal({
                type: "error",
                title: "Error",
                message: error?.data?.message || "Failed to delete product",
                confirmText: "OK",
            });
        }
    };

    const handleToggleStock = async (product: Product) => {
        try {
            await toggleStock(product.id).unwrap();
            refetch();
        } catch (error: any) {
            await showModal({
                type: "error",
                title: "Error",
                message: error?.data?.message || "Failed to toggle stock status",
                confirmText: "OK",
            });
        }
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
                    products.map((product: Product) => (
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

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Sizes & Prices</p>
                                    <div className="flex flex-wrap gap-2">
                                        {product.sizes.map((size: any, index: number) => {
                                            const currentQty = getQuantity(product.id, index, size.quantity);
                                            const isEdited = currentQty !== size.quantity;
                                            const isSaving = isUpdating && quantities[`${product.id}-${index}`] !== undefined;

                                            return (
                                                <div key={index} className="flex items-center gap-1 bg-slate-900 rounded-lg p-1">
                                                    <span className="px-2 text-white text-xs">
                                                        {size.mg}mg: ${size.price}
                                                    </span>
                                                    <div className="flex items-center gap-1 border-l border-slate-700 pl-1">
                                                        <button onClick={() => handleDecrement(product.id, index, size.quantity)} className="w-6 h-6 bg-slate-800 hover:bg-slate-700 rounded text-white font-bold text-sm" disabled={currentQty <= 0 || isSaving}>
                                                            -
                                                        </button>
                                                        <span className={`text-white font-bold text-xs w-8 text-center ${isEdited ? "text-yellow-400" : ""}`}>
                                                            {isSaving ? (
                                                                <div className="flex justify-center">
                                                                    <div className="animate-spin h-3 w-3 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
                                                                </div>
                                                            ) : (
                                                                currentQty
                                                            )}
                                                        </span>
                                                        <button onClick={() => handleIncrement(product.id, index, size.quantity)} className="w-6 h-6 bg-slate-800 hover:bg-slate-700 rounded text-white font-bold text-sm" disabled={isSaving}>
                                                            +
                                                        </button>
                                                        {isEdited && (
                                                            <button onClick={() => handleSaveQuantity(product, index, size.quantity, size.mg)} className="ml-1 px-2 py-1 bg-green-600 hover:bg-green-700 rounded text-white text-xs font-semibold" disabled={isSaving}>
                                                                {isSaving ? "..." : "Save"}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
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

                                <div>
                                    <p className="text-sm text-gray-400 mb-1">Stock Status</p>
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => handleToggleStock(product)} disabled={isToggling} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${product.inStock ? "bg-green-500" : "bg-gray-600"}`}>
                                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${product.inStock ? "translate-x-6" : "translate-x-1"}`} />
                                        </button>
                                        <span className={`text-sm ${product.inStock ? "text-green-400" : "text-gray-400"}`}>{product.inStock ? "In Stock" : "Out of Stock"}</span>
                                        {isToggling && <div className="animate-spin h-4 w-4 border-2 border-cyan-500 border-t-transparent rounded-full ml-2"></div>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 flex-wrap">
                                <Link href={`/admin/product/edit/${product.id}`} className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors">
                                    Edit
                                </Link>

                                <button onClick={() => handleDelete(product)} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors">
                                    Delete
                                </button>

                                <Link href={`/product/${product.id}`} className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition-colors" target="_blank">
                                    View
                                </Link>

                                <Link href={`/admin/product/${product.id}`} className="px-4 py-2 bg-slate-700 text-white rounded-lg text-sm hover:bg-slate-600 transition-colors">
                                    Details
                                </Link>
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
