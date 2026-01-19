// interface Order {
//     id: string;
//     user: { email: string };
//     total: number;
//     createdAt: string;
//     shippingName: string;
//     shippingAddress: string;
//     items: Array<{ name: string; quantity: number }>;
//     status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
// }

// interface OrdersTabProps {
//     orders: Order[];
//     loading: boolean;
// }

// export default function OrdersTab({ orders, loading }: OrdersTabProps) {
//     const updateOrderStatus = async (orderId: string, status: string) => {
//         // TODO: Implement API call to update order status
//         console.log(`Updating order ${orderId} to ${status}`);
//         // Mock update - replace with actual API call
//         alert(`Order ${orderId} status updated to ${status}`);
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
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-3xl font-bold text-white">Orders</h2>
//                 <div className="flex gap-2">
//                     <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
//                         <option value="all">All Orders</option>
//                         <option value="pending">Pending</option>
//                         <option value="processing">Processing</option>
//                         <option value="shipped">Shipped</option>
//                         <option value="delivered">Delivered</option>
//                     </select>
//                     <input type="date" className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white" />
//                 </div>
//             </div>

//             <div className="space-y-4">
//                 {orders.length > 0 ? (
//                     orders.map((order) => (
//                         <div key={order.id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700 hover:border-cyan-500/30 transition-colors">
//                             <div className="flex flex-col md:flex-row justify-between items-start mb-4 gap-4">
//                                 <div>
//                                     <h3 className="text-xl font-bold text-white">Order #{order.id}</h3>
//                                     <p className="text-sm text-gray-400">{order.user.email}</p>
//                                     <div className="flex items-center gap-2 mt-2">
//                                         <span className={`px-2 py-1 rounded text-xs ${order.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : order.status === "processing" ? "bg-blue-500/20 text-blue-400" : order.status === "shipped" ? "bg-purple-500/20 text-purple-400" : order.status === "delivered" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
//                                             {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
//                                         </span>
//                                         <span className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</span>
//                                     </div>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-2xl font-bold text-cyan-400">${order.total.toFixed(2)}</p>
//                                     <p className="text-sm text-gray-400">{order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p>
//                                 </div>
//                             </div>

//                             <div className="mb-4 pb-4 border-b border-slate-700">
//                                 <p className="text-gray-300 text-sm mb-2">
//                                     <strong className="text-gray-400">Shipping To:</strong> {order.shippingName}, {order.shippingAddress}
//                                 </p>
//                                 <div className="flex flex-wrap gap-2">
//                                     {order.items.map((item, index) => (
//                                         <span key={index} className="px-3 py-1 bg-slate-900 rounded-lg text-sm text-gray-300">
//                                             {item.quantity}x {item.name}
//                                         </span>
//                                     ))}
//                                 </div>
//                             </div>

//                             <div className="flex flex-wrap items-center justify-between gap-4">
//                                 <div className="flex items-center gap-2">
//                                     <span className="text-gray-400 text-sm">Update Status:</span>
//                                     <select defaultValue={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm">
//                                         <option value="pending">Pending</option>
//                                         <option value="processing">Processing</option>
//                                         <option value="shipped">Shipped</option>
//                                         <option value="delivered">Delivered</option>
//                                         <option value="cancelled">Cancelled</option>
//                                     </select>
//                                 </div>
//                                 <div className="flex gap-2">
//                                     <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg text-sm hover:bg-cyan-500/30 transition-colors">View Details</button>
//                                     <button className="px-4 py-2 bg-slate-700 text-gray-300 rounded-lg text-sm hover:bg-slate-600 transition-colors">Print Invoice</button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <div className="bg-slate-800 rounded-2xl p-12 border border-slate-700 text-center">
//                         <p className="text-gray-400 text-lg">No orders found</p>
//                         <p className="text-gray-500 text-sm mt-2">Orders will appear here once customers make purchases</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// components/admin/tabs/OrdersTab.tsx
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
