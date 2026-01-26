// "use client";
// import { useState, useEffect } from "react";

// interface OrderItem {
//     name: string;
//     quantity: number;
// }

// interface Order {
//     id: string;
//     user: { email: string };
//     total: number;
//     createdAt: string;
//     shippingName: string;
//     shippingAddress: string;
//     items: OrderItem[];
//     status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
// }

// export default function OrdersTab() {
//     const [orders, setOrders] = useState<Order[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadOrders();
//     }, []);

//     const loadOrders = async () => {
//         try {
//             setLoading(true);
//             // Mock API call
//             await new Promise((resolve) => setTimeout(resolve, 500));

//             const mockOrders: Order[] = [
//                 {
//                     id: "ORD001",
//                     user: { email: "customer@example.com" },
//                     total: 299.99,
//                     createdAt: new Date().toISOString(),
//                     shippingName: "John Doe",
//                     shippingAddress: "123 Main St, City, State 12345",
//                     items: [
//                         { name: "Retatrutide", quantity: 1 },
//                         { name: "BPC-157", quantity: 2 },
//                     ],
//                     status: "pending",
//                 },
//                 {
//                     id: "ORD002",
//                     user: { email: "vip@example.com" },
//                     total: 599.98,
//                     createdAt: new Date(Date.now() - 86400000).toISOString(),
//                     shippingName: "Jane Smith",
//                     shippingAddress: "456 Oak Ave, Town, State 67890",
//                     items: [{ name: "NAD+", quantity: 3 }],
//                     status: "shipped",
//                 },
//             ];

//             setOrders(mockOrders);
//         } catch (error) {
//             console.error("Failed to load orders:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateOrderStatus = async (orderId: string, status: string) => {
//         try {
//             // Mock API call - replace with actual
//             await new Promise((resolve) => setTimeout(resolve, 300));

//             setOrders((prev) => prev.map((order) => (order.id === orderId ? { ...order, status: status as any } : order)));
//         } catch (error) {
//             alert("Failed to update order: " + (error as Error).message);
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
//             <h2 className="text-3xl font-bold text-white mb-6">Orders</h2>
//             <div className="space-y-4">
//                 {orders.length > 0 ? (
//                     orders.map((order) => (
//                         <div key={order.id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
//                             <div className="flex justify-between items-start mb-4">
//                                 <div>
//                                     <h3 className="text-xl font-bold text-white">Order #{order.id}</h3>
//                                     <p className="text-sm text-gray-400">{order.user.email}</p>
//                                 </div>
//                                 <div className="text-right">
//                                     <p className="text-2xl font-bold text-cyan-400">${order.total.toFixed(2)}</p>
//                                     <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
//                                 </div>
//                             </div>

//                             <div className="mb-4 pb-4 border-b border-slate-700">
//                                 <p className="text-gray-300 text-sm mb-2">
//                                     <strong>Shipping To:</strong> {order.shippingName || "N/A"}, {order.shippingAddress || "N/A"}
//                                 </p>
//                                 <p className="text-gray-300 text-sm">
//                                     <strong>Items:</strong> {order.items.length} item{order.items.length !== 1 ? "s" : ""}
//                                 </p>
//                             </div>

//                             <div className="flex items-center gap-2">
//                                 <span className="text-gray-400 text-sm">Status:</span>
//                                 <select value={order.status} onChange={(e) => updateOrderStatus(order.id, e.target.value)} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm">
//                                     <option value="pending">Pending</option>
//                                     <option value="processing">Processing</option>
//                                     <option value="shipped">Shipped</option>
//                                     <option value="delivered">Delivered</option>
//                                     <option value="cancelled">Cancelled</option>
//                                 </select>
//                             </div>
//                         </div>
//                     ))
//                 ) : (
//                     <p className="text-gray-400">No orders yet</p>
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";
import { useState, useEffect } from "react";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/app/redux/features/admin/adminApi";
import Link from "next/link";
import { useCreateShipStationLabelMutation, useCreateShipStationOrderMutation, useGetCarriersQuery, useGetWarehousesQuery, useMarkAsShippedMutation } from "@/app/redux/features/shipment/shipmentApi";

interface OrderItem {
    id: string;
    product: { name: string };
    quantity: number;
    unitPrice: number;
}

interface Order {
    id: string;
    orderNumber: string;
    user: { email: string; name: string };
    total: number;
    subtotal: number;
    shipping: number;
    createdAt: string;
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    items: OrderItem[];
    status: "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";
    shipstationOrderId?: number;
    trackingNumber?: string;
    labelUrl?: string;
}

export default function OrdersTab() {
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [carrier, setCarrier] = useState("fedex");
    const [service, setService] = useState("fedex_ground");
    const [trackingInput, setTrackingInput] = useState("");

    // Fetch real orders
    const { data: ordersData, refetch, isLoading } = useGetAllOrdersQuery({});
    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [createShipStationOrder] = useCreateShipStationOrderMutation();
    const [createShippingLabel] = useCreateShipStationLabelMutation();
    const [markAsShipped] = useMarkAsShippedMutation();
    // const { data: carriersData } = useGetCarriersQuery({});
    // console.log(carriersData);
    const { data: wareHousesData } = useGetWarehousesQuery({});
    console.log(wareHousesData);

    const orders: Order[] = ordersData?.data || [];

    const handleUpdateStatus = async (orderId: string, status: string) => {
        try {
            await updateOrderStatus({ id: orderId, status }).unwrap();
            refetch();
        } catch (error: any) {
            alert("Failed to update order: " + error.data?.message || error.message);
        }
    };

    const handleCreateShipStation = async (orderId: string) => {
        if (!confirm("Create ShipStation order for this order?")) return;

        try {
            await createShipStationOrder(orderId).unwrap();
            alert("✅ ShipStation order created!");
            refetch();
        } catch (error: any) {
            alert("❌ Failed: " + error.data?.error || error.message);
        }
    };

    const handleCreateLabel = async (order: Order) => {
        if (!order.shipstationOrderId) {
            alert("Please create ShipStation order first");
            return;
        }

        try {
            await createShippingLabel(order.id).unwrap();
            alert("✅ Shipping label created!");
            refetch();
        } catch (error: any) {
            console.log(error);
            alert("❌ Failed: " + error.data?.error || error.message);
        }
    };

    const handleAddTracking = async (orderId: string) => {
        if (!trackingInput) {
            alert("Please enter tracking number");
            return;
        }

        try {
            await markAsShipped(orderId).unwrap();
            alert("✅ Tracking added and marked as shipped!");
            setTrackingInput("");
            setSelectedOrder(null);
            refetch();
        } catch (error: any) {
            alert("❌ Failed: " + error.data?.error || error.message);
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
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-white">Orders ({orders.length})</h2>
                <button onClick={() => refetch()} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
                    Refresh
                </button>
            </div>

            {/* Selected Order Modal */}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Order #{selectedOrder.orderNumber || selectedOrder.id}</h3>
                            <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white">
                                ✕
                            </button>
                        </div>

                        {/* Tracking Input */}
                        <div className="mb-6">
                            <h4 className="font-bold mb-2">Add Tracking Manually</h4>
                            <div className="flex gap-2">
                                <input type="text" value={trackingInput} onChange={(e) => setTrackingInput(e.target.value)} placeholder="Enter tracking number" className="flex-1 p-2 bg-slate-700 rounded" />
                                <button onClick={() => handleAddTracking(selectedOrder.id)} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">
                                    Add Tracking
                                </button>
                            </div>
                        </div>

                        {/* Shipping Options */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div>
                                <label className="block text-sm mb-1">Carrier</label>
                                <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className="w-full p-2 bg-slate-700 rounded">
                                    <option value="fedex">FedEx</option>
                                    <option value="usps">USPS</option>
                                    <option value="ups">UPS</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Service</label>
                                <select value={service} onChange={(e) => setService(e.target.value)} className="w-full p-2 bg-slate-700 rounded">
                                    <option value="fedex_ground">FedEx Ground</option>
                                    <option value="fedex_2day">FedEx 2Day</option>
                                    <option value="usps_priority">USPS Priority</option>
                                    <option value="usps_first_class">USPS First Class</option>
                                    <option value="ups_ground">UPS Ground</option>
                                </select>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            {!selectedOrder.shipstationOrderId ? (
                                <button onClick={() => handleCreateShipStation(selectedOrder.id)} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded flex-1">
                                    Create ShipStation Order
                                </button>
                            ) : (
                                <button onClick={() => handleCreateLabel(selectedOrder)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex-1">
                                    Create Shipping Label
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Orders List */}
            <div className="space-y-4">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.id} className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
                            {/* Order Header */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-white">Order #{order.orderNumber || order.id.slice(0, 8)}</h3>
                                    <p className="text-sm text-gray-400">
                                        {order.user?.email || order.email} • {order.user?.name || order.name}
                                    </p>
                                    <p className="text-sm text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-bold text-cyan-400">${order.total.toFixed(2)}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`px-2 py-1 rounded text-xs ${order.status === "PAID" ? "bg-green-900/30 text-green-400" : order.status === "SHIPPED" ? "bg-blue-900/30 text-blue-400" : order.status === "PENDING" ? "bg-yellow-900/30 text-yellow-400" : "bg-red-900/30 text-red-400"}`}>{order.status}</span>
                                        {order.trackingNumber && <span className="px-2 py-1 bg-slate-700 rounded text-xs">📦 Tracking</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Order Details */}
                            <div className="mb-4 pb-4 border-b border-slate-700">
                                <p className="text-gray-300 text-sm mb-2">
                                    <strong>Shipping:</strong> {order.name}, {order.address}, {order.city}, {order.state} {order.zip}
                                </p>
                                <p className="text-gray-300 text-sm mb-2">
                                    <strong>Phone:</strong> {order.phone || "N/A"}
                                </p>
                                <p className="text-gray-300 text-sm">
                                    <strong>Items:</strong> {order.items?.length || 0} item(s) • Subtotal: ${order.subtotal?.toFixed(2)} • Shipping: ${order.shipping?.toFixed(2)}
                                </p>
                                {order.trackingNumber && (
                                    <p className="text-cyan-400 text-sm mt-2">
                                        <strong>Tracking:</strong> {order.trackingNumber}
                                        {order.labelUrl && (
                                            <a href={order.labelUrl} target="_blank" className="ml-2 underline">
                                                View Label
                                            </a>
                                        )}
                                    </p>
                                )}
                                {order.shipstationOrderId && (
                                    <p className="text-yellow-400 text-sm mt-1">
                                        <strong>ShipStation ID:</strong> {order.shipstationOrderId}
                                    </p>
                                )}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                {/* Status Dropdown */}
                                <select value={order.status} onChange={(e) => handleUpdateStatus(order.id, e.target.value)} className="px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm">
                                    <option value="PENDING">Pending</option>
                                    <option value="PAID">Paid</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="CANCELLED">Cancelled</option>
                                </select>

                                {/* ShipStation Actions */}
                                <button onClick={() => setSelectedOrder(order)} className="px-3 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-sm">
                                    ShipStation Actions
                                </button>

                                {/* View Details */}
                                <Link href={`/admin/orders/${order.id}`} className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm">
                                    View Details
                                </Link>

                                {/* Quick Actions */}
                                {order.status === "PAID" && !order.trackingNumber && (
                                    <button onClick={() => handleCreateShipStation(order.id)} className="px-3 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm">
                                        Create ShipStation
                                    </button>
                                )}
                                {order.shipstationOrderId && !order.trackingNumber && (
                                    <button onClick={() => handleCreateLabel(order)} className="px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm">
                                        Create Label
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 bg-slate-800/50 rounded-2xl">
                        <p className="text-gray-400 text-lg">No orders yet</p>
                    </div>
                )}
            </div>
        </div>
    );
}
