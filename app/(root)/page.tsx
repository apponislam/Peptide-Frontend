"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/app/components/ProductCard";
import { useGetProductsQuery } from "../redux/features/products/productsApi";
import Pagination from "../utils/Pagination";

export default function StorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery);
            setPage(1);
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch products with API
    const { data, isLoading, isError } = useGetProductsQuery({
        search: debouncedSearch,
        page,
        limit,
        sortBy: "name",
        sortOrder: "asc",
    });

    // Extract data from API response
    const products = data?.data || [];
    const meta = data?.meta;

    // Handle page change with scroll
    const handlePageChange = (newPage: number) => {
        setPage(newPage);
        if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    // Handle limit change
    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    return (
        <div className="container mx-auto px-4 py-6 md:py-8">
            {/* Header with Search BELOW the title */}
            <div className="flex flex-col gap-6 mb-6">
                {/* Title Section */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Research Peptides & Compounds</h1>

                {/* Search Bar */}
                <div className="w-full">
                    <div className="relative max-w-md">
                        <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full px-10 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-all" />
                        {searchQuery && (
                            <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                                ✕
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Search Results Info */}
            {searchQuery && (
                <div className="mb-4 text-sm text-gray-400">
                    Searching for: <span className="text-cyan-400 font-medium">"{searchQuery}"</span>
                    {meta?.total && (
                        <span className="ml-2">
                            ({meta.total} result{meta.total !== 1 ? "s" : ""} found)
                        </span>
                    )}
                </div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
                    <p className="mt-2 text-gray-400">Loading products...</p>
                </div>
            )}

            {/* Error State */}
            {isError && !isLoading && <div className="text-center py-12 text-red-400">Failed to load products. Please try again.</div>}

            {!isLoading && !isError && (
                <>
                    <div className="product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">{products.length === 0 ? <div className="col-span-full text-center text-gray-400 py-12">No products found {searchQuery && `for "${searchQuery}"`}</div> : products.map((product: any) => <ProductCard key={product.id} product={product} />)}</div>

                    {meta && meta.totalPages > 1 && <Pagination meta={meta} onPageChange={handlePageChange} onLimitChange={handleLimitChange} showLimitSelector={true} />}
                </>
            )}
        </div>
    );
}
