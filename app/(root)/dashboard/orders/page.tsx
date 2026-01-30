"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useGetOrdersQuery } from "@/app/redux/features/order/orderApi";
import Pagination from "@/app/utils/Pagination";
import { OrderStatus } from "@/app/redux/features/order/orderApi";

export default function OrdersPage() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [statusFilter, setStatusFilter] = useState<OrderStatus | "ALL">("ALL");
    const [dateSort, setDateSort] = useState<"desc" | "asc">("desc");

    const { data, isLoading, error } = useGetOrdersQuery({
        page: currentPage,
        limit: limit,
        status: statusFilter !== "ALL" ? statusFilter : undefined,
        sortBy: "createdAt",
        sortOrder: dateSort,
    });

    const orders = data?.data || [];
    const totalOrders = data?.meta?.total || 0;
    const totalPages = data?.meta?.totalPages || Math.ceil(totalOrders / limit);

    const paginationMeta = {
        page: currentPage,
        limit: limit,
        total: totalOrders,
        totalPages: totalPages,
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setCurrentPage(1);
    };

    const handleStatusFilter = (status: OrderStatus | "ALL") => {
        setStatusFilter(status);
        setCurrentPage(1);
    };

    const toggleDateSort = () => {
        setDateSort(dateSort === "desc" ? "asc" : "desc");
        setCurrentPage(1);
    };

    const onRepeatOrder = (orderId: string) => {
        router.push(`/checkout/repeat/${orderId}`);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                        <p className="mt-4 text-gray-400">Loading orders...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center py-20 text-red-400">
                        <div className="text-4xl mb-4">⚠️</div>
                        <p className="mb-4">Failed to load orders</p>
                        <Link href="/dashboard" className="inline-block px-6 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600">
                            Return to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
            <div className="container mx-auto max-w-7xl">
                {/* Clean Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Order History</h1>
                            <p className="text-gray-400">View and manage your orders</p>
                        </div>
                        <div>
                            <Link href="/dashboard" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition">
                                ← Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Clean Filters - Text-based, minimal */}
                <div className="mb-8">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-400 mb-4">
                        <span className="mr-2">Filter by:</span>
                        <button onClick={() => handleStatusFilter("ALL")} className={`px-3 py-1 rounded transition ${statusFilter === "ALL" ? "bg-cyan-500 text-white" : "hover:text-white"}`}>
                            All
                        </button>
                        <button onClick={() => handleStatusFilter(OrderStatus.PAID)} className={`px-3 py-1 rounded transition ${statusFilter === OrderStatus.PAID ? "bg-green-500/20 text-green-400" : "hover:text-white"}`}>
                            Paid
                        </button>
                        <button onClick={() => handleStatusFilter(OrderStatus.SHIPPED)} className={`px-3 py-1 rounded transition ${statusFilter === OrderStatus.SHIPPED ? "bg-blue-500/20 text-blue-400" : "hover:text-white"}`}>
                            Shipped
                        </button>
                        <button onClick={() => handleStatusFilter(OrderStatus.PENDING)} className={`px-3 py-1 rounded transition ${statusFilter === OrderStatus.PENDING ? "bg-yellow-500/20 text-yellow-400" : "hover:text-white"}`}>
                            Pending
                        </button>
                        <button onClick={() => handleStatusFilter(OrderStatus.CANCELLED)} className={`px-3 py-1 rounded transition ${statusFilter === OrderStatus.CANCELLED ? "bg-red-500/20 text-red-400" : "hover:text-white"}`}>
                            Cancelled
                        </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <button onClick={toggleDateSort} className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition">
                            <span>Sort by date:</span>
                            <span className="font-medium">{dateSort === "desc" ? "Newest first" : "Oldest first"}</span>
                            <span>{dateSort === "desc" ? "↓" : "↑"}</span>
                        </button>

                        {(statusFilter !== "ALL" || dateSort !== "desc") && (
                            <button
                                onClick={() => {
                                    setStatusFilter("ALL");
                                    setDateSort("desc");
                                    setCurrentPage(1);
                                }}
                                className="text-sm text-cyan-400 hover:text-cyan-300 transition"
                            >
                                Reset filters
                            </button>
                        )}
                    </div>
                </div>

                {/* Orders List - EXACT SAME as dashboard */}
                <div className="space-y-4">
                    {orders.length === 0 ? (
                        <div className="bg-slate-800 rounded-xl p-8 text-center border border-slate-700">
                            <div className="text-4xl md:text-6xl mb-4">📦</div>
                            <p className="text-xl mb-4">No orders found</p>
                            <p className="text-gray-400 mb-6">{statusFilter !== "ALL" ? `No ${statusFilter.toLowerCase()} orders found. Try changing your filters.` : "You haven't placed any orders yet"}</p>
                            <Link href="/" className="inline-block px-6 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        orders.map((order: any) => {
                            const orderItems = Array.isArray(order.items) ? order.items : typeof order.items === "object" && order.items !== null ? [order.items] : [];

                            const orderDate = order.date || order.createdAt || new Date();

                            return (
                                <div key={order.id} className="bg-slate-900 rounded-lg p-4 md:p-6">
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                        <div>
                                            <h3 className="font-bold text-white">Order #{order.id?.slice(-8) || "N/A"}</h3>
                                            <p className="text-sm text-gray-400">
                                                {new Date(orderDate).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                            <span className={`inline-block mt-1 px-2 py-1 text-xs rounded ${order.status === "PAID" ? "bg-green-500/20 text-green-400" : order.status === "SHIPPED" ? "bg-blue-500/20 text-blue-400" : order.status === "CANCELLED" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>{order.status || "PENDING"}</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xl font-bold text-cyan-400">${order.total?.toFixed(2) || "0.00"}</div>
                                            <div className="text-sm text-gray-400">{orderItems.length} items</div>
                                        </div>
                                    </div>

                                    {orderItems.length > 0 && (
                                        <div className="space-y-2 mb-4 text-sm text-gray-300">
                                            {orderItems.map((item: any, index: number) => (
                                                <div key={index} className="flex justify-between">
                                                    <span>
                                                        • {item.product?.name || item.name || "Product"}
                                                        {item.quantity > 1 && ` × ${item.quantity}`}
                                                    </span>
                                                    <span className="text-cyan-300">${(item.discountedPrice * item.quantity)?.toFixed(2) || "0.00"}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex gap-2">
                                        <button onClick={() => onRepeatOrder(order.id)} className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition flex items-center justify-center gap-2">
                                            <span>🔄</span>
                                            Repeat Order
                                        </button>
                                        <Link href={`/orders/${order.id}`} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold text-center transition">
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Pagination */}
                {totalOrders > limit && (
                    <div className="mt-8">
                        <Pagination meta={paginationMeta} onPageChange={handlePageChange} onLimitChange={handleLimitChange} showLimitSelector={true} />
                    </div>
                )}
            </div>
        </div>
    );
}
