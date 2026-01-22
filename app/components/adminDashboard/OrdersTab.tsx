"use client";
import { useState, useEffect } from "react";

interface OrderItem {
    name: string;
    quantity: number;
}

interface Order {
    id: string;
    user: { email: string };
    total: number;
    createdAt: string;
    shippingName: string;
    shippingAddress: string;
    items: OrderItem[];
    status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
}

export default function OrdersTab() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        try {
            setLoading(true);
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            const mockOrders: Order[] = [
                {
                    id: "ORD001",
                    user: { email: "customer@example.com" },
                    total: 299.99,
                    createdAt: new Date().toISOString(),
                    shippingName: "John Doe",
                    shippingAddress: "123 Main St, City, State 12345",
                    items: [
                        { name: "Retatrutide", quantity: 1 },
                        { name: "BPC-157", quantity: 2 },
                    ],
                    status: "pending",
                },
                {
                    id: "ORD002",
                    user: { email: "vip@example.com" },
                    total: 599.98,
                    createdAt: new Date(Date.now() - 86400000).toISOString(),
                    shippingName: "Jane Smith",
                    shippingAddress: "456 Oak Ave, Town, State 67890",
                    items: [{ name: "NAD+", quantity: 3 }],
                    status: "shipped",
                },
            ];

            setOrders(mockOrders);
        } catch (error) {
            console.error("Failed to load orders:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateOrderStatus = async (orderId: string, status: string) => {
        try {
            // Mock API call - replace with actual
            await new Promise((resolve) => setTimeout(resolve, 300));

            setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: status as any } : order)));
        } catch (error) {
            alert("Failed to update order: " + (error as Error).message);
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
            <h2 className="text-3xl font-bold text-white mb-6">Orders</h2>
            <div className="space-y-4">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Order #{order.id}</h3>
                                    <p className="text-sm text-gray-400">{order.user.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-cyan-400">${order.total.toFixed(2)}</p>
                                    <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="mb-4 pb-4 border-b border-slate-700">
                                <p className="text-gray-300 text-sm mb-2">
                                    <strong>Shipping To:</strong> {order.shippingName || "N/A"}, {order.shippingAddress || "N/A"}
                                </p>
                                <p className="text-gray-300 text-sm">
                                    <strong>Items:</strong> {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-gray-400 text-sm">Status:</span>
                                <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm">
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-400">No orders yet</p>
                )}
            </div>
        </div>
    );
}
