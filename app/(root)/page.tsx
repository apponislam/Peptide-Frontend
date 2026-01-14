// "use client";

// import ProductCard from "@/app/components/ProductCard";
// import { PRODUCTS } from "@/app/lib/products";
// import { useState } from "react";
// import { useGetProductsQuery } from "../redux/features/products/productsApi";

// export default function StorePage() {
//     const { data } = useGetProductsQuery({});
//     console.log(data);

//     const [searchQuery, setSearchQuery] = useState("");

//     const filteredProducts = PRODUCTS.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.desc.toLowerCase().includes(searchQuery.toLowerCase()));

//     return (
//         <div className="container mx-auto px-4 py-6 md:py-8">
//             <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">Research Peptides & Compounds</h1>

//             {/* Products Grid */}
//             <div className="product-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">{filteredProducts.length === 0 ? <div className="col-span-full text-center text-gray-400 py-12">No products found</div> : filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
//         </div>
//     );
// }

"use client";

import { useState, useEffect } from "react";
import ProductCard from "@/app/components/ProductCard";
import { useGetProductsQuery } from "../redux/features/products/productsApi";

export default function StorePage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12); // Products per page

    // Debounce search input
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

    console.log(data);
    // Extract data from API response
    const products = data?.data || [];
    const meta = data?.meta;

    // Calculate hasNextPage based on current page and total pages
    const hasNextPage = meta ? page < meta.totalPages : false;

    // Handle pagination
    const handleNextPage = () => {
        if (hasNextPage) {
            setPage(page + 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePrevPage = () => {
        if (page > 1) {
            setPage(page - 1);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handlePageClick = (pageNumber: number) => {
        setPage(pageNumber);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const getPageNumbers = () => {
        if (!meta?.totalPages) return [];

        const pages = [];
        const totalPages = meta.totalPages;
        const maxVisiblePages = 5;

        // Always show first page
        pages.push(1);

        // Add ellipsis after first page if current page is far from start
        if (page > 3) {
            pages.push("...");
        }

        // Calculate which pages to show in the middle
        let startPage = Math.max(2, page - 1);
        let endPage = Math.min(totalPages - 1, page + 1);

        // Adjust for small number of total pages
        if (totalPages <= maxVisiblePages) {
            // Show all pages if total pages is 5 or less
            for (let i = 2; i <= totalPages - 1; i++) {
                pages.push(i);
            }
        } else {
            // For more than 5 total pages
            if (page <= 3) {
                // When near the beginning, show 2, 3, 4
                for (let i = 2; i <= Math.min(4, totalPages - 1); i++) {
                    if (!pages.includes(i)) {
                        pages.push(i);
                    }
                }
            } else if (page >= totalPages - 2) {
                // When near the end, show pages near the end
                for (let i = Math.max(2, totalPages - 3); i <= totalPages - 1; i++) {
                    if (!pages.includes(i)) {
                        pages.push(i);
                    }
                }
            } else {
                // Show current page -1, current, current +1
                for (let i = page - 1; i <= page + 1; i++) {
                    if (i > 1 && i < totalPages && !pages.includes(i)) {
                        pages.push(i);
                    }
                }
            }

            // Add ellipsis before last page if needed
            if (page < totalPages - 2) {
                pages.push("...");
            }
        }

        // Always show last page if there is more than 1 page
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="container mx-auto px-4 py-6 md:py-8">
            {/* Header with Search BELOW the title */}
            <div className="flex flex-col gap-6 mb-6">
                {/* Title Section */}
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">Research Peptides & Compounds</h1>

                {/* Search Bar - Now placed below the h1 */}
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

            {/* Products Grid */}
            {!isLoading && !isError && (
                <>
                    <div className="product-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">{products.length === 0 ? <div className="col-span-full text-center text-gray-400 py-12">No products found {searchQuery && `for "${searchQuery}"`}</div> : products.map((product: any) => <ProductCard key={product.id} product={product} />)}</div>

                    {/* Pagination - Only show if there are multiple pages */}
                    {meta && meta.totalPages > 1 && (
                        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                            {/* Page Info */}
                            <div className="text-sm text-gray-400">
                                Showing <span className="text-white font-medium">{(page - 1) * limit + 1}</span> - <span className="text-white font-medium">{Math.min(page * limit, meta.total)}</span> of <span className="text-white font-medium">{meta.total}</span> products
                            </div>

                            {/* Pagination Controls */}
                            <div className="flex items-center gap-2">
                                {/* Previous Button */}
                                <button onClick={handlePrevPage} disabled={page === 1} className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${page === 1 ? "bg-slate-800 text-gray-500 cursor-not-allowed" : "bg-slate-700 text-white hover:bg-slate-600 hover:text-cyan-300"}`}>
                                    ← Prev
                                </button>

                                {/* Page Numbers */}
                                <div className="flex items-center gap-1">
                                    {getPageNumbers().map((pageNum, index) =>
                                        pageNum === "..." ? (
                                            <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
                                                ...
                                            </span>
                                        ) : (
                                            <button key={pageNum} onClick={() => handlePageClick(pageNum as number)} className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${page === pageNum ? "bg-cyan-600 text-white" : "bg-slate-700 text-white hover:bg-slate-600"}`}>
                                                {pageNum}
                                            </button>
                                        )
                                    )}
                                </div>

                                {/* Next Button */}
                                <button onClick={handleNextPage} disabled={!hasNextPage} className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${!hasNextPage ? "bg-slate-800 text-gray-500 cursor-not-allowed" : "bg-slate-700 text-white hover:bg-slate-600 hover:text-cyan-300"}`}>
                                    Next →
                                </button>
                            </div>

                            {/* Items Per Page Selector */}
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-400">Show:</span>
                                <select
                                    value={limit}
                                    onChange={(e) => {
                                        setLimit(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-sm focus:border-cyan-500 focus:outline-none"
                                >
                                    <option value="12">12</option>
                                    <option value="24">24</option>
                                    <option value="48">48</option>
                                    <option value="96">96</option>
                                </select>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
