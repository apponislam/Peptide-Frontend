"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetOrderById2Query, useUpdateOrderStatusMutation } from "@/app/redux/features/admin/adminApi";
import {
    useCreateShipStationOrderMutation,
    useMarkAsDeliveredMutation, // NEW
    useCancelOrderMutation,
    useMarkAsShippedMutation, // NEW
} from "@/app/redux/features/shipment/shipmentApi";
import { useCreateRefundMutation } from "@/app/redux/features/payment/paymentApi";
import Link from "next/link";
import { ArrowLeft, Package, Truck, User, CreditCard, MapPin, Phone, Tag, ExternalLink, Calendar, DollarSign, RotateCcw, CheckCircle, XCircle } from "lucide-react";
import { useModal } from "@/app/providers/ModalContext";

interface OrderItem {
    id: string;
    productId?: number;
    product?: {
        id: number;
        name: string;
        sizes?: any[];
    };
    quantity: number;
    unitPrice: number;
    discountedPrice: number;
    size?: number;
}

interface Order {
    id: string;
    paymentIntentId: string;
    userId?: string;
    user?: {
        id: string;
        email: string;
        name: string;
        tier: string;
        storeCredit: number;
    };
    total: number;
    subtotal: number;
    shipping: number;
    creditApplied: number;
    originalPrice: number;
    discountPercentage: number;
    discountAmount: number;
    createdAt: string;
    updatedAt: string;
    name: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    items?: OrderItem[];
    status: "PENDING" | "FAILED" | "CANCELLED" | "PAID" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "RETURNED" | "REFUNDED";
    shipstationOrderId?: number;
    trackingNumber?: string;
    labelUrl?: string;
    commissionAmount?: number;
    commissionPaid?: boolean;
}

export default function OrderDetailsPage() {
    const { showModal } = useModal();
    const { id } = useParams();
    const router = useRouter();
    const [refundAmount, setRefundAmount] = useState<string>("");

    const {
        data: orderData,
        isLoading,
        error,
        refetch,
    } = useGetOrderById2Query(id as string, {
        skip: !id,
    });

    console.log(orderData);

    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [createShipStationOrder] = useCreateShipStationOrderMutation();
    const [createRefund] = useCreateRefundMutation();
    const [markAsDelivered] = useMarkAsDeliveredMutation();
    const [cancelOrder] = useCancelOrderMutation();
    const [markAsShipped] = useMarkAsShippedMutation();

    const order: Order | undefined = orderData?.data;
    // const hasShipStationOrder = !!order?.shipstationOrderId;

    // Mark order as shipped
    const handleMarkAsShipped = (orderId: string) => async () => {
        const confirmed = await showModal({
            type: "confirm",
            title: "Mark as Shipped",
            message: "Mark this order as shipped? (Shipping confirmation email will be sent to customer)",
            confirmText: "Mark Shipped",
            cancelText: "Cancel",
        });

        if (!confirmed) return;

        try {
            await markAsShipped(orderId).unwrap();

            await showModal({
                type: "success",
                title: "Order Shipped",
                message: "✅ Order marked as shipped! Shipping confirmation email sent to customer.",
                confirmText: "OK",
            });

            refetch();
        } catch (error: any) {
            await showModal({
                type: "error",
                title: "Failed",
                message: `❌ Failed to mark as shipped: ${error.data?.error || error.message}`,
                confirmText: "OK",
            });
        }
    };

    const handleUpdateStatus = async (status: string) => {
        try {
            await updateOrderStatus({ id: id as string, status }).unwrap();

            await showModal({
                type: "success",
                title: "Status Updated",
                message: `✅ Order status updated successfully!`,
                confirmText: "OK",
            });

            refetch();
        } catch (error: any) {
            await showModal({
                type: "error",
                title: "Update Failed",
                message: `❌ Failed to update status: ${error.data?.message || error.message}`,
                confirmText: "OK",
            });
        }
    };

    const handleCreateShipStationOrder = async () => {
        const confirmed = await showModal({
            type: "confirm",
            title: "Create ShipStation Order",
            message: "Create a new ShipStation order for this order?",
            confirmText: "Create",
            cancelText: "Cancel",
        });

        if (!confirmed) return;

        try {
            await createShipStationOrder(id as string).unwrap();

            await showModal({
                type: "success",
                title: "Order Created",
                message: "✅ ShipStation order created successfully!",
                confirmText: "OK",
            });

            refetch();
        } catch (error: any) {
            await showModal({
                type: "error",
                title: "Creation Failed",
                message: `❌ Failed to create ShipStation order: ${error.data?.error || error.message}`,
                confirmText: "OK",
            });
        }
    };

    const handleOpenLabel = async () => {
        if (order?.labelUrl) {
            window.open(order.labelUrl, "_blank");
        } else {
            await showModal({
                type: "error",
                title: "No Label Available",
                message: "Shipping label has not been created yet.",
                confirmText: "OK",
            });
        }
    };

    const handleRefundOrder = async () => {
        if (!order) return;

        const amount = refundAmount ? parseFloat(refundAmount) : undefined;

        if (amount && (amount <= 0 || amount > order.total)) {
            await showModal({
                type: "error",
                title: "Invalid Amount",
                message: `Invalid refund amount. Must be between $0.01 and $${order.total.toFixed(2)}`,
                confirmText: "OK",
            });
            return;
        }

        const confirmMessage = amount ? `Refund $${amount.toFixed(2)} from order ${order.id}?` : `Full refund of $${order.total.toFixed(2)} from order ${order.id}?`;

        const confirmed = await showModal({
            type: "confirm",
            title: "Confirm Refund",
            message: confirmMessage + "\n\nThis will cancel the order and restore store credit.",
            confirmText: "Refund",
            cancelText: "Cancel",
        });

        if (!confirmed) return;

        try {
            await createRefund({ orderId: order.id, amount }).unwrap();

            await showModal({
                type: "success",
                title: "Refund Successful",
                message: "✅ Refund processed successfully!",
                confirmText: "OK",
            });

            setRefundAmount("");
            refetch();
        } catch (error: any) {
            await showModal({
                type: "error",
                title: "Refund Failed",
                message: `❌ Refund failed: ${error.data?.error || error.message}`,
                confirmText: "OK",
            });
        }
    };

    // NEW: Handle mark as delivered
    const handleMarkAsDelivered = async () => {
        if (!order) return;

        const confirmed = await showModal({
            type: "confirm",
            title: "Mark as Delivered",
            message: `Mark order ${order.id} as delivered? (Email will be sent to customer)`,
            confirmText: "Mark Delivered",
            cancelText: "Cancel",
        });

        if (!confirmed) return;

        try {
            await markAsDelivered(order.id).unwrap();

            await showModal({
                type: "success",
                title: "Order Delivered",
                message: "✅ Order marked as delivered! Email sent to customer.",
                confirmText: "OK",
            });

            refetch();
        } catch (error: any) {
            await showModal({
                type: "error",
                title: "Failed",
                message: `❌ Failed to mark as delivered: ${error.data?.error || error.message}`,
                confirmText: "OK",
            });
        }
    };

    // NEW: Handle cancel order
    const handleCancelOrder = async () => {
        if (!order) return;

        const confirmed = await showModal({
            type: "confirm",
            title: "Cancel Order",
            message: `Cancel order ${order.id}? (Email will be sent to customer)\n\nOnly orders in PENDING or PROCESSING status can be cancelled.`,
            confirmText: "Cancel Order",
            cancelText: "Cancel",
        });

        if (!confirmed) return;

        try {
            await cancelOrder(order.id).unwrap();

            await showModal({
                type: "success",
                title: "Order Cancelled",
                message: "✅ Order cancelled! Email sent to customer.",
                confirmText: "OK",
            });

            refetch();
        } catch (error: any) {
            console.log(error);
            await showModal({
                type: "error",
                title: "Failed",
                message: `❌ Failed to cancel order: ${error.data?.error || error.message}`,
                confirmText: "OK",
            });
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString() + " " + date.toLocaleTimeString();
        } catch {
            return "Invalid Date";
        }
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
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!order || error) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center py-12">
                        <h1 className="text-2xl font-bold text-white mb-4">{error ? "Error Loading Order" : "Order Not Found"}</h1>
                        <p className="text-gray-400 mb-6">{error ? "Failed to load order details" : "The order you're looking for doesn't exist."}</p>
                        <Link href="/admin?tab=orders" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium">
                            Back to Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const userName = order.user?.name || order.name || "N/A";
    const userEmail = order.user?.email || order.email || "N/A";
    const userTier = order.user?.tier || "Member";
    const items = order.items || [];
    const commissionAmount = order.commissionAmount || 0;

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 p-4 md:p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-4 mb-6">
                        <Link href="/admin?tab=orders" className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Order Details</h1>
                            <p className="text-gray-400">Order ID: {order.id}</p>
                            <p className="text-sm text-gray-500">Payment Intent: {order.paymentIntentId || "N/A"}</p>
                        </div>
                    </div>

                    {/* Status Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-slate-800/50 rounded-xl mb-6">
                        <div className="flex items-center gap-3">
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>{order.status}</div>
                            <div className="text-white">
                                <Calendar className="w-4 h-4 inline mr-1" />
                                {formatDate(order.createdAt)}
                            </div>
                            {order.trackingNumber && <div className="text-cyan-400">📦 Tracking: {order.trackingNumber}</div>}
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="text-gray-400">Change Status:</span>
                            <select value={order.status} onChange={(e) => handleUpdateStatus(e.target.value)} className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500">
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
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Order Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Customer & Shipping Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Customer Info */}
                            <div className="bg-slate-800/50 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <User className="w-5 h-5 text-cyan-400" />
                                    <h3 className="text-lg font-bold text-white">Customer Information</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-sm text-gray-400">Name</p>
                                        <p className="text-white">{userName}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Email</p>
                                        <p className="text-white break-all">{userEmail}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">Phone</p>
                                        <p className="text-white flex items-center gap-2">
                                            <Phone className="w-4 h-4" />
                                            {order.phone || "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-400">User Tier</p>
                                        <p className="text-white">{userTier}</p>
                                    </div>
                                    {order.user?.storeCredit !== undefined && (
                                        <div>
                                            <p className="text-sm text-gray-400">Store Credit</p>
                                            <p className="text-white">${order.user.storeCredit.toFixed(2)}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="bg-slate-800/50 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <MapPin className="w-5 h-5 text-cyan-400" />
                                    <h3 className="text-lg font-bold text-white">Shipping Address</h3>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-white">{order.name}</p>
                                    <p className="text-white">{order.address}</p>
                                    <p className="text-white">
                                        {order.city}, {order.state} {order.zip}
                                    </p>
                                    <p className="text-white">{order.country}</p>
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-slate-800/50 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Package className="w-5 h-5 text-cyan-400" />
                                <h3 className="text-lg font-bold text-white">Order Items</h3>
                                <span className="px-2 py-1 bg-slate-700 rounded text-sm">{items.length} item(s)</span>
                            </div>
                            {items.length > 0 ? (
                                <div className="space-y-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center">
                                                    <Tag className="w-6 h-6 text-gray-400" />
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-white">{item.product?.name || `Product ${item.productId || "Unknown"}`}</h4>
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <span className="text-gray-400">ID: {item.productId || item.product?.id || "N/A"}</span>
                                                        {item.size && (
                                                            <>
                                                                <span className="text-gray-600">|</span>
                                                                <span className="text-cyan-400">{item.size}mg</span>
                                                            </>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white">${item.unitPrice.toFixed(2)} each</p>
                                                {item.discountedPrice && item.discountedPrice !== item.unitPrice && <p className="text-xs text-gray-500 line-through">${item.discountedPrice.toFixed(2)}</p>}
                                                <p className="text-lg font-bold text-cyan-400">${(item.unitPrice * item.quantity).toFixed(2)}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-400">No items found for this order</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column - Actions & Summary */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-slate-800/50 rounded-xl p-6">
                            <h3 className="text-lg font-bold text-white mb-6">Order Summary</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between text-gray-300">
                                    <span>Original Price</span>
                                    <span>${order.originalPrice?.toFixed(2) || order.subtotal.toFixed(2)}</span>
                                </div>
                                {order.discountAmount > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Discount ({order.discountPercentage}%)</span>
                                        <span>-${order.discountAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-300">
                                    <span>Subtotal</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Shipping</span>
                                    <span>${order.shipping.toFixed(2)}</span>
                                </div>
                                {order.creditApplied > 0 && (
                                    <div className="flex justify-between text-green-400">
                                        <span>Store Credit Used</span>
                                        <span>-${order.creditApplied.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t border-slate-700 pt-3 mt-3">
                                    <div className="flex justify-between text-xl font-bold text-white">
                                        <span>Total</span>
                                        <span>${order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Info */}
                            <div className="mt-6 pt-6 border-t border-slate-700">
                                <div className="flex items-center gap-3 mb-3">
                                    <CreditCard className="w-5 h-5 text-cyan-400" />
                                    <h4 className="font-medium text-white">Payment Information</h4>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <p className="text-gray-400">
                                        <span className="text-gray-500">Payment Intent:</span> {order.paymentIntentId || "N/A"}
                                    </p>
                                    <p className="text-gray-400">
                                        <span className="text-gray-500">Commission:</span> ${commissionAmount.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-slate-800/50 rounded-xl p-6 border border-cyan-900/30">
                            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                <CheckCircle className="w-5 h-5 text-cyan-400" />
                                Quick Actions
                            </h3>

                            <div className="space-y-4">
                                {/* Create ShipStation Button - Show only for PAID/PROCESSING orders without ShipStation ID */}
                                {(order.status === "PAID" || order.status === "PROCESSING") && (
                                    <button onClick={handleCreateShipStationOrder} className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                        <Package className="w-5 h-5" />
                                        Create ShipStation
                                    </button>
                                )}

                                {/* Mark as Shipped Button - Show for PROCESSING orders OR for orders with ShipStation ID */}
                                {(order.status === "PROCESSING" || (order.status === "PAID" && order.shipstationOrderId)) && (
                                    <button onClick={handleMarkAsShipped(order.id)} className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                        <Truck className="w-5 h-5" />
                                        Mark as Shipped
                                    </button>
                                )}

                                {/* Mark as Delivered Button - Show only for SHIPPED orders */}
                                {order.status === "SHIPPED" && (
                                    <button onClick={handleMarkAsDelivered} className="w-full px-4 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                        <CheckCircle className="w-5 h-5" />
                                        Mark as Delivered
                                    </button>
                                )}

                                {/* Cancel Order Button - Show only for PENDING or PROCESSING orders */}
                                {(order.status === "PENDING" || order.status === "PROCESSING") && (
                                    <button onClick={handleCancelOrder} className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                        <XCircle className="w-5 h-5" />
                                        Cancel Order
                                    </button>
                                )}

                                {/* View Shipping Label Button - Show only if label exists */}
                                {order.labelUrl && (
                                    <button onClick={handleOpenLabel} className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                        <ExternalLink className="w-5 h-5" />
                                        View Shipping Label
                                    </button>
                                )}
                            </div>
                        </div>

                        {(order.status === "PAID" || order.status === "PROCESSING" || order.status === "SHIPPED" || order.status === "DELIVERED") && (
                            <div className="bg-slate-800/50 rounded-xl p-6 border border-red-900/30">
                                <div className="flex items-center gap-3 mb-6">
                                    <RotateCcw className="w-5 h-5 text-red-400" />
                                    <h3 className="text-lg font-bold text-white">Refund Order</h3>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-300 mb-2">Refund Amount (Optional)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                                        <input type="number" value={refundAmount} onChange={(e) => setRefundAmount(e.target.value)} placeholder={`Full refund: $${order.total.toFixed(2)}`} className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-red-500 focus:outline-none" min="0.01" max={order.total} step="0.01" />
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1">Leave empty for full refund (${order.total.toFixed(2)})</p>
                                </div>

                                <button onClick={handleRefundOrder} className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                    <RotateCcw className="w-5 h-5" />
                                    Process Refund
                                </button>
                            </div>
                        )}

                        {/* Show message for already refunded/cancelled orders */}
                        {(order.status === "REFUNDED" || order.status === "CANCELLED") && (
                            <div className="bg-slate-800/50 rounded-xl p-6 border border-gray-700">
                                <div className="flex items-center gap-3 mb-4">
                                    <RotateCcw className="w-5 h-5 text-gray-400" />
                                    <h3 className="text-lg font-bold text-gray-300">Refund Status</h3>
                                </div>
                                <div className="text-center py-4">
                                    <p className="text-gray-400 mb-2">{order.status === "REFUNDED" ? "This order has been refunded" : "This order has been cancelled"}</p>
                                    <p className="text-sm text-gray-500">{order.status === "REFUNDED" ? `Store credit was restored to the customer.` : `Order was cancelled before payment was processed.`}</p>
                                </div>
                            </div>
                        )}

                        {/* Shipping Actions */}
                        <div className="bg-slate-800/50 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Truck className="w-5 h-5 text-cyan-400" />
                                <h3 className="text-lg font-bold text-white">Shipping Actions</h3>
                            </div>

                            {/* ShipStation Order Info */}
                            <div className="mb-6">
                                {order.shipstationOrderId ? (
                                    <div className="p-4 bg-green-900/20 border border-green-800/30 rounded-lg">
                                        <p className="text-green-400 mb-2">✅ ShipStation Order Created</p>
                                        <p className="text-sm text-gray-300">ShipStation ID: {order.shipstationOrderId}</p>
                                        {order.trackingNumber && <p className="text-sm text-cyan-400 mt-2">Tracking: {order.trackingNumber}</p>}
                                        {order.labelUrl && (
                                            <button onClick={handleOpenLabel} className="w-full mt-3 px-3 py-2 bg-green-600 hover:bg-green-700 rounded text-sm flex items-center justify-center gap-2">
                                                <ExternalLink className="w-4 h-4" />
                                                View Shipping Label
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="p-4 bg-yellow-900/20 border border-yellow-800/30 rounded-lg">
                                        <p className="text-yellow-400 mb-3">⚠️ No ShipStation Order Created</p>

                                        {/* Show Create ShipStation button only for PAID/PROCESSING orders */}
                                        {(order.status === "PAID" || order.status === "PROCESSING") && (
                                            <button onClick={handleCreateShipStationOrder} className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                                <Package className="w-5 h-5" />
                                                Create ShipStation Order
                                            </button>
                                        )}

                                        {/* Show message for non-eligible orders */}
                                        {!(order.status === "PAID" || order.status === "PROCESSING") && <p className="text-sm text-gray-400 text-center py-2">Order must be in PAID or PROCESSING status to create ShipStation order.</p>}
                                    </div>
                                )}
                            </div>

                            {/* Tracking Info */}
                            {order.trackingNumber && !order.labelUrl && (
                                <div className="p-4 bg-blue-900/20 border border-blue-800/30 rounded-lg">
                                    <p className="text-blue-400 mb-2">📦 Tracking Number</p>
                                    <p className="text-sm text-gray-300">{order.trackingNumber}</p>
                                    <p className="text-xs text-gray-500 mt-2">No shipping label generated yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="text-sm text-gray-400">
                        <p>Order ID: {order.id}</p>
                        <p>Last updated: {formatDate(order.updatedAt)}</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => router.back()} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg font-medium transition-colors">
                            Back
                        </button>
                        <Link href="/admin?tab=orders" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium transition-colors">
                            Back to Orders List
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
