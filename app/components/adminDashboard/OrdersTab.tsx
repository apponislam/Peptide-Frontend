"use client";
import { useState, useEffect } from "react";
import { useGetAllOrdersQuery, useUpdateOrderStatusMutation } from "@/app/redux/features/admin/adminApi";
import Link from "next/link";
import { useCreateShipStationLabelMutation, useCreateShipStationOrderMutation, useMarkAsShippedMutation } from "@/app/redux/features/shipment/shipmentApi";
import Pagination from "@/app/utils/Pagination";
import { useModal } from "@/app/providers/ModalContext";

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
    // status: "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";
    status: "PENDING" | "FAILED" | "CANCELLED" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "RETURNED" | "REFUNDED";
    shipstationOrderId?: number;
    trackingNumber?: string;
    labelUrl?: string;
}

export default function OrdersTab() {
    const { openModal } = useModal();
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [carrier, setCarrier] = useState("fedex");
    const [service, setService] = useState("fedex_ground");
    const [trackingInput, setTrackingInput] = useState("");

    // Pagination state
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [dateFilter, setDateFilter] = useState<string>("");

    // Fetch orders with pagination
    const {
        data: ordersData,
        refetch,
        isLoading,
    } = useGetAllOrdersQuery({
        page,
        limit,
        search,
        status: statusFilter,
        sortBy: "createdAt",
        sortOrder: "desc",
        ...(dateFilter && {
            startDate: new Date(new Date().setDate(new Date().getDate() - parseInt(dateFilter))).toISOString().split("T")[0],
        }),
    });

    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [createShipStationOrder] = useCreateShipStationOrderMutation();
    const [createShippingLabel] = useCreateShipStationLabelMutation();
    const [markAsShipped] = useMarkAsShippedMutation();

    const orders: Order[] = ordersData?.data || [];
    const meta = ordersData?.meta || {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 1,
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        setPage(1);
    }, [search, statusFilter, dateFilter, limit]);

    const handleUpdateStatus = async (orderId: string, status: string) => {
        try {
            await updateOrderStatus({ id: orderId, status }).unwrap();

            openModal({
                type: "success",
                title: "Status Updated",
                message: `✅ Order status updated to ${status}`,
                onConfirm: () => {
                    refetch();
                },
            });
        } catch (error: any) {
            openModal({
                type: "error",
                title: "Update Failed",
                message: `❌ Failed to update order: ${error.data?.message || error.message}`,
            });
        }
    };

    const handleCreateShipStation = async (orderId: string) => {
        openModal({
            type: "confirm",
            title: "Create ShipStation Order",
            message: "Create ShipStation order for this order?",
            confirmText: "Create",
            cancelText: "Cancel",
            onConfirm: async () => {
                try {
                    await createShipStationOrder(orderId).unwrap();

                    openModal({
                        type: "success",
                        title: "Order Created",
                        message: "✅ ShipStation order created successfully!",
                        onConfirm: () => {
                            refetch();
                        },
                    });
                } catch (error: any) {
                    openModal({
                        type: "error",
                        title: "Creation Failed",
                        message: `❌ Failed to create ShipStation order: ${error.data?.error || error.message}`,
                    });
                }
            },
        });
    };

    const handleCreateLabel = async (order: Order) => {
        if (!order.shipstationOrderId) {
            openModal({
                type: "error",
                title: "ShipStation Order Required",
                message: "Please create ShipStation order first",
            });
            return;
        }

        openModal({
            type: "confirm",
            title: "Create Shipping Label",
            message: "Create shipping label for this order?",
            confirmText: "Create",
            cancelText: "Cancel",
            onConfirm: async () => {
                try {
                    await createShippingLabel(order.id).unwrap();

                    openModal({
                        type: "success",
                        title: "Label Created",
                        message: "✅ Shipping label created successfully!",
                        onConfirm: () => {
                            refetch();
                        },
                    });
                } catch (error: any) {
                    console.log(error);
                    openModal({
                        type: "error",
                        title: "Creation Failed",
                        message: `❌ Failed to create shipping label: ${error.data?.error || error.message}`,
                    });
                }
            },
        });
    };

    const handleAddTracking = async (orderId: string) => {
        if (!trackingInput.trim()) {
            openModal({
                type: "error",
                title: "Tracking Required",
                message: "Please enter tracking number",
            });
            return;
        }

        openModal({
            type: "confirm",
            title: "Add Tracking Number",
            message: `Add tracking number "${trackingInput}" and mark order as shipped?`,
            confirmText: "Add Tracking",
            cancelText: "Cancel",
            onConfirm: async () => {
                try {
                    await markAsShipped(orderId).unwrap();

                    openModal({
                        type: "success",
                        title: "Tracking Added",
                        message: "✅ Tracking added and marked as shipped successfully!",
                        onConfirm: () => {
                            setTrackingInput("");
                            setSelectedOrder(null);
                            refetch();
                        },
                    });
                } catch (error: any) {
                    openModal({
                        type: "error",
                        title: "Failed to Add Tracking",
                        message: `❌ Failed to add tracking: ${error.data?.error || error.message}`,
                    });
                }
            },
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "PENDING":
                return "bg-yellow-900/30 text-yellow-400";
            case "FAILED":
                return "bg-red-900/30 text-red-400";
            case "CANCELLED":
                return "bg-red-900/30 text-red-400";
            case "PAID":
                return "bg-green-900/30 text-green-400";
            case "PROCESSING":
                return "bg-purple-900/30 text-purple-400";
            case "SHIPPED":
                return "bg-blue-900/30 text-blue-400";
            case "DELIVERED":
                return "bg-indigo-900/30 text-indigo-400";
            case "RETURNED":
                return "bg-gray-900/30 text-gray-400";
            case "REFUNDED":
                return "bg-orange-900/30 text-orange-400";
            default:
                return "bg-slate-900/30 text-slate-400";
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
            {/* Header and Filters */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-bold text-white">Orders</h2>
                    <button onClick={() => refetch()} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg">
                        Refresh
                    </button>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div>
                        <input type="text" placeholder="Search orders..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none text-white" />
                    </div>

                    {/* Status Filter */}
                    <div>
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none text-white">
                            <option value="">All Status</option>
                            <option value="PENDING">Pending</option>
                            <option value="FAILED">Failed</option>
                            <option value="CANCELLED">Cancelled</option>
                            <option value="PAID">Paid</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="RETURNED">Returned</option>
                            <option value="REFUNDED">Refunded</option>
                        </select>
                    </div>

                    {/* Date Filter */}
                    <div>
                        <select value={dateFilter} onChange={(e) => setDateFilter(e.target.value)} className="w-full p-3 bg-slate-800 border border-slate-700 rounded-lg focus:border-cyan-500 focus:outline-none text-white">
                            <option value="">All Time</option>
                            <option value="7">Last 7 Days</option>
                            <option value="30">Last 30 Days</option>
                            <option value="90">Last 90 Days</option>
                        </select>
                    </div>
                </div>
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
                                    <h3 className="text-xl font-bold text-white">Order #{order.orderNumber || order.id}</h3>
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
                                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(order.status)}`}>{order.status}</span>
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
                                    <option value="FAILED">Failed</option>
                                    <option value="CANCELLED">Cancelled</option>
                                    <option value="PAID">Paid</option>
                                    <option value="PROCESSING">Processing</option>
                                    <option value="SHIPPED">Shipped</option>
                                    <option value="DELIVERED">Delivered</option>
                                    <option value="RETURNED">Returned</option>
                                    <option value="REFUNDED">Refunded</option>
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
                        <p className="text-gray-400 text-lg">No orders found</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {meta.total > 0 && <Pagination meta={meta} onPageChange={setPage} onLimitChange={setLimit} showLimitSelector={true} />}
        </div>
    );
}
