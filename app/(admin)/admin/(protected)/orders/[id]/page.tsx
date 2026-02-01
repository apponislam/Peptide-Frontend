"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetOrderById2Query, useUpdateOrderStatusMutation } from "@/app/redux/features/admin/adminApi";
import { useCreateShipStationLabelMutation, useCreateShipStationOrderMutation, useMarkAsShippedMutation } from "@/app/redux/features/shipment/shipmentApi";
import { useCreateRefundMutation } from "@/app/redux/features/payment/paymentApi";
import Link from "next/link";
import { ArrowLeft, Package, Truck, User, CreditCard, MapPin, Phone, Tag, ExternalLink, Calendar, DollarSign, RotateCcw } from "lucide-react";

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
    status: "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";
    shipstationOrderId?: number;
    trackingNumber?: string;
    labelUrl?: string;
    commissionAmount?: number;
    commissionPaid?: boolean;
}

export default function OrderDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const [trackingInput, setTrackingInput] = useState("");
    const [carrier, setCarrier] = useState("fedex");
    const [service, setService] = useState("fedex_ground");
    const [refundAmount, setRefundAmount] = useState<string>(""); // ADD THIS

    const {
        data: orderData,
        isLoading,
        error,
        refetch,
    } = useGetOrderById2Query(id as string, {
        skip: !id,
    });

    const [updateOrderStatus] = useUpdateOrderStatusMutation();
    const [createShipStationOrder] = useCreateShipStationOrderMutation();
    const [createShippingLabel] = useCreateShipStationLabelMutation();
    const [markAsShipped] = useMarkAsShippedMutation();
    const [createRefund] = useCreateRefundMutation(); // ADD THIS

    const order: Order | undefined = orderData?.data;
    const isPaid = order?.status === "PAID";
    const isShipped = order?.status === "SHIPPED";
    const hasShipStationOrder = !!order?.shipstationOrderId;

    // Debug log to see what data you're getting
    useEffect(() => {
        if (orderData) {
            console.log("Order Data:", orderData);
            console.log("Order Items:", order?.items);
            console.log("User Data:", order?.user);
        }
        if (error) {
            console.error("Error loading order:", error);
        }
    }, [orderData, error, order]);

    const handleUpdateStatus = async (status: string) => {
        try {
            await updateOrderStatus({ id: id as string, status }).unwrap();
            alert("✅ Order status updated!");
            refetch();
        } catch (error: any) {
            alert("❌ Failed to update: " + (error.data?.message || error.message));
        }
    };

    const handleCreateShipStationOrder = async () => {
        if (!confirm("Create ShipStation order?")) return;
        try {
            await createShipStationOrder(id as string).unwrap();
            alert("✅ ShipStation order created!");
            refetch();
        } catch (error: any) {
            alert("❌ Failed: " + (error.data?.error || error.message));
        }
    };

    const handleCreateLabel = async () => {
        if (!hasShipStationOrder) {
            alert("Please create ShipStation order first");
            return;
        }
        try {
            await createShippingLabel(id as string).unwrap();
            alert("✅ Shipping label created!");
            refetch();
        } catch (error: any) {
            alert("❌ Failed: " + (error.data?.error || error.message));
        }
    };

    const handleAddTracking = async () => {
        if (!trackingInput.trim()) {
            alert("Please enter tracking number");
            return;
        }
        try {
            await markAsShipped(id as string).unwrap();
            alert("✅ Tracking added!");
            setTrackingInput("");
            refetch();
        } catch (error: any) {
            alert("❌ Failed: " + (error.data?.error || error.message));
        }
    };

    const handleOpenLabel = () => {
        if (order?.labelUrl) {
            window.open(order.labelUrl, "_blank");
        }
    };

    // ADD REFUND HANDLER
    const handleRefundOrder = async () => {
        if (!order) return;

        const amount = refundAmount ? parseFloat(refundAmount) : undefined;

        if (amount && (amount <= 0 || amount > order.total)) {
            alert("Invalid refund amount. Must be between $0.01 and $" + order.total.toFixed(2));
            return;
        }

        const confirmMessage = amount ? `Refund $${amount.toFixed(2)} from order ${order.id}?` : `Full refund of $${order.total.toFixed(2)} from order ${order.id}?`;

        if (!confirm(confirmMessage + "\n\nThis will cancel the order and restore store credit.")) {
            return;
        }

        try {
            const result = await createRefund({
                orderId: order.id,
                amount,
            }).unwrap();

            alert("✅ Refund processed successfully!");
            setRefundAmount("");
            refetch();
        } catch (error: any) {
            alert("❌ Refund failed: " + (error.data?.error || error.message));
        }
    };

    // Format date safely
    const formatDate = (dateString?: string) => {
        if (!dateString) return "N/A";
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString() + " " + date.toLocaleTimeString();
        } catch {
            return "Invalid Date";
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

    // Safely handle optional data
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
                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === "PAID" ? "bg-green-900/30 text-green-400" : order.status === "SHIPPED" ? "bg-blue-900/30 text-blue-400" : order.status === "PENDING" ? "bg-yellow-900/30 text-yellow-400" : "bg-red-900/30 text-red-400"}`}>{order.status}</div>
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
                                <option value="PAID">Paid</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="CANCELLED">Cancelled</option>
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
                                                    <p className="text-sm text-gray-400">Product ID: {item.productId || item.product?.id || "N/A"}</p>
                                                    <p className="text-sm text-gray-400">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white">${item.unitPrice.toFixed(2)} each</p>
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
                                    <p className="text-gray-400">
                                        <span className="text-gray-500">Commission Paid:</span> {order.commissionPaid ? "Yes" : "No"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Refund Section - ADD THIS */}
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

                            <button onClick={handleRefundOrder} disabled={order.status === "CANCELLED"} className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${order.status === "CANCELLED" ? "bg-gray-700 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}>
                                <RotateCcw className="w-5 h-5" />
                                {order.status === "CANCELLED" ? "Already Refunded" : "Process Refund"}
                            </button>
                        </div>

                        {/* Shipping Actions */}
                        <div className="bg-slate-800/50 rounded-xl p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <Truck className="w-5 h-5 text-cyan-400" />
                                <h3 className="text-lg font-bold text-white">Shipping Actions</h3>
                            </div>

                            {/* Manual Tracking */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-300 mb-2">Add Tracking Number</label>
                                <div className="flex gap-2">
                                    <input type="text" value={trackingInput} onChange={(e) => setTrackingInput(e.target.value)} placeholder="Enter tracking number" className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:border-cyan-500 focus:outline-none" />
                                    <button onClick={handleAddTracking} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors">
                                        Add
                                    </button>
                                </div>
                            </div>

                            {/* Shipping Options */}
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Carrier</label>
                                    <select value={carrier} onChange={(e) => setCarrier(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500">
                                        <option value="fedex">FedEx</option>
                                        <option value="usps">USPS</option>
                                        <option value="ups">UPS</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-300 mb-1">Service</label>
                                    <select value={service} onChange={(e) => setService(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white text-sm focus:outline-none focus:border-cyan-500">
                                        <option value="fedex_ground">FedEx Ground</option>
                                        <option value="fedex_2day">FedEx 2Day</option>
                                        <option value="usps_priority">USPS Priority</option>
                                        <option value="usps_first_class">USPS First Class</option>
                                        <option value="ups_ground">UPS Ground</option>
                                    </select>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                {!hasShipStationOrder ? (
                                    <button onClick={handleCreateShipStationOrder} className="w-full px-4 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                        <Package className="w-5 h-5" />
                                        Create ShipStation Order
                                    </button>
                                ) : (
                                    <button onClick={handleCreateLabel} className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                        <Truck className="w-5 h-5" />
                                        Create Shipping Label
                                    </button>
                                )}

                                {order.labelUrl && (
                                    <button onClick={handleOpenLabel} className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                                        <ExternalLink className="w-5 h-5" />
                                        View Shipping Label
                                    </button>
                                )}

                                {order.shipstationOrderId && <p className="text-center text-sm text-yellow-400">ShipStation ID: {order.shipstationOrderId}</p>}
                            </div>
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
