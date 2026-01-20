// "use client";

// import React from "react";

// interface PaginationMeta {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
// }

// interface PaginationProps {
//     meta: PaginationMeta;
//     onPageChange: (page: number) => void;
//     onLimitChange?: (limit: number) => void;
//     showLimitSelector?: boolean;
// }

// const Pagination = ({ meta, onPageChange, onLimitChange, showLimitSelector = true }: PaginationProps) => {
//     // Get page numbers to display
//     const getPageNumbers = () => {
//         if (meta.totalPages <= 1) return [1];

//         const pages: (number | string)[] = [];
//         const totalPages = meta.totalPages;
//         const currentPage = meta.page;

//         // Always show first page
//         pages.push(1);

//         // Show middle pages
//         if (totalPages <= 5) {
//             // Show all pages
//             for (let i = 2; i <= totalPages; i++) {
//                 if (i < totalPages) pages.push(i);
//             }
//         } else {
//             // Show ellipsis and selected pages
//             if (currentPage > 3) {
//                 pages.push("...");
//             }

//             // Show pages around current page
//             const start = Math.max(2, currentPage - 1);
//             const end = Math.min(totalPages - 1, currentPage + 1);

//             for (let i = start; i <= end; i++) {
//                 pages.push(i);
//             }

//             // Add ellipsis before last page if needed
//             if (currentPage < totalPages - 2) {
//                 if (!pages.includes("...") || pages[pages.length - 1] !== "...") {
//                     pages.push("...");
//                 }
//             }
//         }

//         // Always show last page if there is more than 1 page
//         if (totalPages > 1) {
//             if (pages[pages.length - 1] !== totalPages) {
//                 pages.push(totalPages);
//             }
//         }

//         return pages;
//     };

//     const handlePageClick = (pageNumber: number) => {
//         onPageChange(pageNumber);
//     };

//     const handlePrevPage = () => {
//         if (meta.page > 1) {
//             onPageChange(meta.page - 1);
//         }
//     };

//     const handleNextPage = () => {
//         if (meta.page < meta.totalPages) {
//             onPageChange(meta.page + 1);
//         }
//     };

//     const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         const target = e.target as HTMLSelectElement;
//         const newLimit = parseInt(target.value);
//         if (onLimitChange) {
//             onLimitChange(newLimit);
//             onPageChange(1);
//         }
//     };

//     const hasNextPage = meta.page < meta.totalPages;
//     const hasPrevPage = meta.page > 1;
//     const startItem = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
//     const endItem = Math.min(meta.page * meta.limit, meta.total);

//     return (
//         <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
//             {/* Page Info */}
//             <div className="text-sm text-gray-400">
//                 Showing <span className="text-white font-medium">{startItem}</span> - <span className="text-white font-medium">{endItem}</span> of <span className="text-white font-medium">{meta.total}</span> items
//             </div>

//             {/* Pagination Controls */}
//             <div className="flex items-center gap-2">
//                 {/* Previous Button */}
//                 <button onClick={handlePrevPage} disabled={!hasPrevPage} className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${!hasPrevPage ? "bg-slate-800 text-gray-500 cursor-not-allowed" : "bg-slate-700 text-white hover:bg-slate-600 hover:text-cyan-300"}`}>
//                     ← Prev
//                 </button>

//                 {/* Page Numbers */}
//                 <div className="flex items-center gap-1">
//                     {getPageNumbers().map((pageNum, index) =>
//                         pageNum === "..." ? (
//                             <span key={`ellipsis-${index}`} className="px-2 text-gray-500">
//                                 ...
//                             </span>
//                         ) : (
//                             <button key={pageNum} onClick={() => handlePageClick(pageNum as number)} className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${meta.page === pageNum ? "bg-cyan-600 text-white" : "bg-slate-700 text-white hover:bg-slate-600"}`}>
//                                 {pageNum}
//                             </button>
//                         ),
//                     )}
//                 </div>

//                 {/* Next Button */}
//                 <button onClick={handleNextPage} disabled={!hasNextPage} className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${!hasNextPage ? "bg-slate-800 text-gray-500 cursor-not-allowed" : "bg-slate-700 text-white hover:bg-slate-600 hover:text-cyan-300"}`}>
//                     Next →
//                 </button>
//             </div>

//             {/* Items Per Page Selector */}
//             {showLimitSelector && onLimitChange && (
//                 <div className="flex items-center gap-2">
//                     <span className="text-sm text-gray-400">Show:</span>
//                     <select value={meta.limit} onChange={handleLimitChange} className="bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-sm focus:border-cyan-500 focus:outline-none">
//                         <option value="12">12</option>
//                         <option value="24">24</option>
//                         <option value="48">48</option>
//                         <option value="96">96</option>
//                     </select>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default Pagination;

"use client";

import React from "react";

interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

interface PaginationProps {
    meta: PaginationMeta;
    onPageChange: (page: number) => void;
    onLimitChange?: (limit: number) => void;
    showLimitSelector?: boolean;
}

const Pagination = ({ meta, onPageChange, onLimitChange, showLimitSelector = true }: PaginationProps) => {
    // Get page numbers to display
    const getPageNumbers = () => {
        if (meta.totalPages <= 1) return [1];

        const pages: (number | string)[] = [];
        const totalPages = meta.totalPages;
        // const totalPages = 100;
        const currentPage = meta.page;

        // Always show first page
        pages.push(1);

        // Show middle pages
        if (totalPages <= 5) {
            // Show all pages
            for (let i = 2; i <= totalPages; i++) {
                if (i < totalPages) pages.push(i);
            }
        } else {
            // Show ellipsis and selected pages
            if (currentPage > 3) {
                pages.push("...");
            }

            // Show pages around current page
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            // Add ellipsis before last page if needed
            if (currentPage < totalPages - 2) {
                if (!pages.includes("...") || pages[pages.length - 1] !== "...") {
                    pages.push("...");
                }
            }
        }

        // Always show last page if there is more than 1 page
        if (totalPages > 1) {
            if (pages[pages.length - 1] !== totalPages) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const handlePageClick = (pageNumber: number) => {
        onPageChange(pageNumber);
    };

    const handlePrevPage = () => {
        if (meta.page > 1) {
            onPageChange(meta.page - 1);
        }
    };

    const handleNextPage = () => {
        if (meta.page < meta.totalPages) {
            onPageChange(meta.page + 1);
        }
    };

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const target = e.target as HTMLSelectElement;
        const newLimit = parseInt(target.value);
        if (onLimitChange) {
            onLimitChange(newLimit);
            onPageChange(1);
        }
    };

    const hasNextPage = meta.page < meta.totalPages;
    const hasPrevPage = meta.page > 1;
    const startItem = meta.total === 0 ? 0 : (meta.page - 1) * meta.limit + 1;
    const endItem = Math.min(meta.page * meta.limit, meta.total);

    return (
        <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            {/* Page Info */}
            <div className="text-sm text-gray-400">
                Showing <span className="text-white font-medium">{startItem}</span> - <span className="text-white font-medium">{endItem}</span> of <span className="text-white font-medium">{meta.total}</span> items
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2 flex-wrap">
                {/* Previous Button */}
                <button onClick={handlePrevPage} disabled={!hasPrevPage} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!hasPrevPage ? "bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700" : "bg-slate-700 text-white hover:bg-slate-600 hover:text-cyan-300 border border-slate-600"}`}>
                    ← Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1 flex-wrap">
                    {getPageNumbers().map((pageNum, index) =>
                        pageNum === "..." ? (
                            <span key={`ellipsis-${index}`} className="px-3 text-gray-500">
                                ...
                            </span>
                        ) : (
                            <button key={pageNum} onClick={() => handlePageClick(pageNum as number)} className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${meta.page === pageNum ? "bg-cyan-600 text-white" : "bg-slate-700 text-white hover:bg-slate-600 border border-slate-600"}`}>
                                {pageNum}
                            </button>
                        ),
                    )}
                </div>

                {/* Next Button */}
                <button onClick={handleNextPage} disabled={!hasNextPage} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!hasNextPage ? "bg-slate-800 text-gray-500 cursor-not-allowed border border-slate-700" : "bg-slate-700 text-white hover:bg-slate-600 hover:text-cyan-300 border border-slate-600"}`}>
                    Next →
                </button>
            </div>

            {/* Items Per Page Selector */}
            {showLimitSelector && onLimitChange && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-400">Show:</span>
                    <select value={meta.limit} onChange={handleLimitChange} className="bg-slate-800 border border-slate-700 text-white rounded-lg px-3 py-2 text-sm focus:border-cyan-500 focus:outline-none">
                        <option value="12">12</option>
                        <option value="24">24</option>
                        <option value="48">48</option>
                        <option value="96">96</option>
                    </select>
                </div>
            )}
        </div>
    );
};

export default Pagination;
