// "use client";
// import { useGetOrderQuery } from "@/app/redux/features/order/orderApi";
// import { useParams } from "next/navigation";
// import React from "react";

// const page = () => {
//     const params = useParams();
//     console.log(params.id);

//     const { data } = useGetOrderQuery(params?.id);
//     console.log(data);

//     return <div></div>;
// };

// export default page;

"use client";

import { useGetOrderQuery } from "@/app/redux/features/order/orderApi";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import React from "react";

export default function OrderDetailsPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params?.id as string;

    const { data, isLoading, error } = useGetOrderQuery(orderId);
    const order = data?.data;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto"></div>
                        <p className="mt-4 text-gray-400">Loading order details...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
                <div className="container mx-auto max-w-7xl">
                    <div className="text-center py-20 text-red-400">
                        <div className="text-4xl mb-4">⚠️</div>
                        <p className="text-xl mb-4">Order not found</p>
                        <p className="text-gray-400 mb-6">The order you're looking for doesn't exist or you don't have permission to view it.</p>
                        <Link href="/dashboard/orders" className="inline-block px-6 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600">
                            View All Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status?.toUpperCase()) {
            case "PAID":
                return "bg-green-500/20 text-green-400";
            case "SHIPPED":
                return "bg-blue-500/20 text-blue-400";
            case "PENDING":
                return "bg-yellow-500/20 text-yellow-400";
            case "CANCELLED":
                return "bg-red-500/20 text-red-400";
            default:
                return "bg-gray-500/20 text-gray-400";
        }
    };

    const onRepeatOrder = () => {
        router.push(`/checkout/repeat/${order.id}`);
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">Order Details</h1>
                            <p className="text-gray-400">Order #{order.id?.slice(-8)}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2">
                            <button onClick={onRepeatOrder} className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition">
                                <span>🔄</span>
                                Repeat Order
                            </button>
                            <Link href="/dashboard/orders" className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition">
                                ← All Orders
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status & Info */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <h2 className="text-xl font-bold">Order #{order.id?.slice(-8)}</h2>
                                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                                    </div>
                                    <p className="text-gray-400">Placed on {formatDate(order.createdAt)}</p>
                                </div>
                                {order.shipstationOrderId && (
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400">ShipStation ID</p>
                                        <p className="text-lg font-bold text-cyan-400">{order.shipstationOrderId}</p>
                                    </div>
                                )}
                            </div>

                            {/* Tracking Info */}
                            {order.trackingNumber && (
                                <div className="mb-6 p-4 bg-slate-900/50 rounded-lg">
                                    <h3 className="font-bold text-white mb-2">Tracking Information</h3>
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Tracking Number</p>
                                            <p className="text-lg font-bold text-cyan-400">{order.trackingNumber}</p>
                                        </div>
                                        {order.labelUrl && (
                                            <a href={order.labelUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition">
                                                View Shipping Label
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Order Items */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h2 className="text-xl font-bold mb-6">Order Items</h2>
                            <div className="space-y-4">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item: any) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                                            <div>
                                                <h3 className="font-bold text-white">{item.product?.name || "Product"}</h3>
                                                <p className="text-sm text-gray-400">Quantity: {item.quantity}</p>
                                                <p className="text-sm text-gray-400">
                                                    Unit Price: ${item.unitPrice?.toFixed(2)}
                                                    {item.discountedPrice !== item.unitPrice && <span className="ml-2 text-cyan-400">(Discounted: ${item.discountedPrice?.toFixed(2)})</span>}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-cyan-400">${(item.discountedPrice * item.quantity)?.toFixed(2)}</p>
                                                {item.unitPrice !== item.discountedPrice && <p className="text-sm text-gray-400 line-through">${(item.unitPrice * item.quantity)?.toFixed(2)}</p>}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-400 text-center py-8">No items found in this order</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Details & Shipping */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span>${order.subtotal?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Shipping</span>
                                    <span className={order.shipping === 0 ? "text-green-400" : ""}>{order.shipping === 0 ? "FREE" : `$${order.shipping?.toFixed(2)}`}</span>
                                </div>
                                {order.creditApplied > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Store Credit Applied</span>
                                        <span className="text-green-400">-${order.creditApplied?.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t border-slate-700 pt-3 mt-3">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Total</span>
                                        <span className="text-cyan-400">${order.total?.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Information */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-gray-400">Name</p>
                                    <p className="font-medium">{order.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Email</p>
                                    <p className="font-medium">{order.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Phone</p>
                                    <p className="font-medium">{order.phone}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Address</p>
                                    <p className="font-medium">{order.address}</p>
                                    <p className="text-gray-400">
                                        {order.city}, {order.state} {order.zip}
                                    </p>
                                    <p className="text-gray-400">{order.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Information */}
                        <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <h2 className="text-xl font-bold mb-6">Payment Information</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Payment Status</span>
                                    <span className={`px-2 py-1 rounded text-xs ${order.status === "PAID" ? "bg-green-500/20 text-green-400" : "bg-yellow-500/20 text-yellow-400"}`}>{order.status === "PAID" ? "Paid" : "Pending"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Order Date</span>
                                    <span>{formatDate(order.createdAt)}</span>
                                </div>
                                {order.checkoutSessions && order.checkoutSessions.length > 0 && (
                                    <div>
                                        <p className="text-sm text-gray-400 mb-1">Stripe Session</p>
                                        <p className="text-sm font-mono text-gray-300 truncate">{order.checkoutSessions[0].stripeSessionId}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
