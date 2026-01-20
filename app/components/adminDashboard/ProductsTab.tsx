"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface Product {
    id: string;
    name: string;
    desc: string;
    price: number;
    sizes: string[];
}

export default function ProductsTab() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            const mockProducts: Product[] = [
                {
                    id: "1",
                    name: "Retatrutide",
                    desc: "Advanced weight management peptide",
                    price: 299.99,
                    sizes: ["5mg", "10mg", "20mg"],
                },
                {
                    id: "2",
                    name: "BPC-157",
                    desc: "Healing and recovery peptide",
                    price: 199.99,
                    sizes: ["5mg", "10mg"],
                },
                {
                    id: "3",
                    name: "NAD+",
                    desc: "Anti-aging and cellular energy",
                    price: 399.99,
                    sizes: ["100mg", "200mg", "500mg"],
                },
            ];

            setProducts(mockProducts);
        } catch (error) {
            console.error("Failed to load products:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateProduct = async (productId: string, data: any) => {
        try {
            // Mock API call - replace with actual
            await new Promise((resolve) => setTimeout(resolve, 300));

            setProducts((prev) => prev.map((product) => (product.id === productId ? { ...product, ...data } : product)));
        } catch (error) {
            alert("Failed to update product: " + (error as Error).message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-white mb-6">Products</h2>
                <Link href="/admin/product/add" className="px-4 py-2 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition-shadow">
                    Create New Product
                </Link>
            </div>
            <div className="space-y-4">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">{product.name}</h3>
                                    <p className="text-sm text-gray-400">{product.desc}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-cyan-400">${product.price || "Multiple"}</p>
                                    <p className="text-sm text-gray-400">ID: {product.id}</p>
                                </div>
                            </div>

                            <div className="mb-4">
                                <p className="text-gray-300 text-sm">
                                    <strong>Sizes:</strong> {JSON.stringify(product.sizes || [])}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        const price = prompt("Update base price:", product.price?.toString() || "");
                                        if (price) updateProduct(product.id, { price: parseFloat(price) });
                                    }}
                                    className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors"
                                >
                                    Edit Price
                                </button>
                                <button
                                    onClick={() => {
                                        const stock = prompt("Update stock quantity:", "10");
                                        if (stock) updateProduct(product.id, { stock: parseInt(stock) });
                                    }}
                                    className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                                >
                                    Edit Stock
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No products yet</p>
                )}
            </div>
        </div>
    );
}
