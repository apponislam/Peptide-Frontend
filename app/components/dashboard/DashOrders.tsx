// "use client";

// import Link from "next/link";
// import { Order } from "../../types";
// import { useGetOrdersQuery } from "@/app/redux/features/order/orderApi";
// import { useRouter } from "next/navigation";
// import { useGetMeQuery } from "@/app/redux/features/auth/authApi";

// interface OrderHistoryProps {
//     orders?: Order[];
// }

// export default function OrderHistory({ orders = [] }: OrderHistoryProps) {
//     const router = useRouter();

//     const { data: userData } = useGetMeQuery();
//     const user = userData?.data;

//     const { data } = useGetOrdersQuery({ page: 1, limit: 3 });
//     const displayedOrders = data?.data || orders.slice(0, 3);

//     const onRepeatOrder = (orderId: string) => {
//         router.push(`/checkout/repeat/${orderId}`);
//     };

//     const getStatusBadgeClass = (status: string) => {
//         const baseClass = "inline-block mt-1 px-2 py-1 text-xs rounded";

//         const statusClasses: Record<string, string> = {
//             PAID: "bg-green-500/20 text-green-400 border border-green-500/30",
//             SHIPPED: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
//             CANCELLED: "bg-red-500/20 text-red-400 border border-red-500/30",
//             PROCESSING: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
//             DELIVERED: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
//             REFUNDED: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
//             FAILED: "bg-red-500/20 text-red-400 border border-red-500/30",
//             RETURNED: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
//             PENDING: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
//         };

//         return `${baseClass} ${statusClasses[status] || statusClasses.PENDING}`;
//     };

//     if (displayedOrders.length === 0) {
//         return (
//             <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
//                 <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Order History</h2>
//                 <div className="text-center py-8 md:py-12 text-gray-400">
//                     <div className="text-4xl md:text-6xl mb-4">📦</div>
//                     <p className="mb-4">No orders yet</p>
//                     <Link href="/" className="inline-block px-6 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600">
//                         Start Shopping
//                     </Link>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
//             <div className="flex justify-between items-center mb-4 md:mb-6">
//                 <h2 className="text-xl md:text-2xl font-bold text-white">Order History</h2>
//             </div>

//             <div className="space-y-4">
//                 {displayedOrders.map((order: any) => {
//                     const orderItems = Array.isArray(order.items) ? order.items : typeof order.items === "object" && order.items !== null ? [order.items] : [];

//                     const orderDate = order.date || order.createdAt || new Date();
//                     const isRepeat = order.isRepeat;

//                     return (
//                         <div key={order.id} className="bg-slate-900 rounded-lg p-4 md:p-6">
//                             <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
//                                 <div>
//                                     <h3 className="font-bold text-white">Order #{order.id?.slice(-8) || "N/A"}</h3>
//                                     <p className="text-sm text-gray-400">
//                                         {new Date(orderDate).toLocaleDateString("en-US", {
//                                             year: "numeric",
//                                             month: "short",
//                                             day: "numeric",
//                                         })}
//                                     </p>
//                                     <span className={getStatusBadgeClass(order.status)}>{order.status || "PENDING"}</span>
//                                 </div>
//                                 <div className="text-right">
//                                     <div className="text-xl font-bold text-cyan-400">${order.total?.toFixed(2) || "0.00"}</div>
//                                     <div className="text-sm text-gray-400">{orderItems.length} items</div>
//                                 </div>
//                             </div>

//                             {orderItems.length > 0 && (
//                                 <div className="space-y-2 mb-4 text-sm text-gray-300">
//                                     {orderItems.map((item: any, index: any) => (
//                                         <div key={index} className="flex justify-between">
//                                             <span>
//                                                 • {item.product?.name || item.name || "Product"}
//                                                 {item.size && <span className="text-cyan-400 ml-1">({item.size}mg)</span>}
//                                                 {item.quantity > 1 && ` × ${item.quantity}`}
//                                             </span>
//                                             <span className="text-cyan-300">${(item.unitPrice * item.quantity)?.toFixed(2) || "0.00"}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}

//                             <div className="flex gap-2">
//                                 <button onClick={() => onRepeatOrder(order.id)} disabled={!isRepeat} className={`flex-1 py-2 rounded-lg font-semibold transition ${isRepeat ? "bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer" : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"}`}>
//                                     {isRepeat ? "🔄 Repeat Order" : "📦 Stock Out"}
//                                 </button>
//                                 <Link href={`/dashboard/orders/${order.id}`} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold text-center transition">
//                                     View Details
//                                 </Link>
//                             </div>
//                         </div>
//                     );
//                 })}
//             </div>

//             {/* Show All Orders Button */}
//             {data?.meta?.total && data.meta.total > 3 && (
//                 <div className="mt-6 text-center">
//                     <Link href="/dashboard/orders" className="inline-block px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition">
//                         View All Orders
//                     </Link>
//                 </div>
//             )}
//         </div>
//     );
// }

"use client";

import Link from "next/link";
import { Order } from "../../types";
import { useGetOrdersQuery } from "@/app/redux/features/order/orderApi";
import { useRouter } from "next/navigation";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
import { useCreateCheckoutSessionMutation } from "@/app/redux/features/payment/paymentApi";
import { useDispatch } from "react-redux";
import { getMemberPrice, getTier } from "@/app/utils/pricing";

interface OrderHistoryProps {
    orders?: Order[];
}

export default function OrderHistory({ orders = [] }: OrderHistoryProps) {
    const router = useRouter();
    const dispatch = useDispatch();

    const { data: userData } = useGetMeQuery();
    const user = userData?.data;

    const { data } = useGetOrdersQuery({ page: 1, limit: 3 });
    const [createCheckout, { isLoading: isCheckoutLoading }] = useCreateCheckoutSessionMutation();

    const displayedOrders = data?.data || orders.slice(0, 3);

    const handleDirectCheckout = async (order: any) => {
        try {
            if (!user) {
                router.push("/auth/login");
                return;
            }

            // Prepare items from the order
            const itemsForApi = order.items.map((item: any) => {
                const sizeInfo = item.product.sizes.find((s: any) => s.mg === item.size);
                const originalPrice = sizeInfo?.price || item.unitPrice;
                const currentPrice = parseFloat(getMemberPrice(originalPrice, user));

                return {
                    productId: item.product.id,
                    name: item.product.name,
                    description: `${item.size}mg ${item.product.name}`,
                    price: currentPrice,
                    quantity: item.quantity,
                    size: item.size.toString(),
                };
            });

            const subtotal = itemsForApi.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

            const SHIPPING_RATE = 6.95;
            let shippingAmount = SHIPPING_RATE;

            if (user?.tier === "Founder" || user?.tier === "VIP") {
                shippingAmount = 0;
            } else if (user?.tier === "Member" && subtotal >= 150) {
                shippingAmount = 0;
            }

            const total = subtotal + shippingAmount;

            const result = await createCheckout({
                userId: user.id,
                items: itemsForApi,
                shippingAmount,
                subtotal,
                storeCreditUsed: 0,
                total,
                metadata: {
                    userId: user.id,
                    originalSubtotal: subtotal,
                    storeCreditUsed: 0,
                    isRepeatOrder: "true",
                    originalOrderId: order.id,
                },
            }).unwrap();

            if (result.url) {
                window.location.href = result.url;
            }
        } catch (error: any) {
            console.error("Checkout failed:", error);
            alert(`Checkout failed: ${error?.data?.error || error.message}`);
        }
    };

    const getStatusBadgeClass = (status: string) => {
        const baseClass = "inline-block mt-1 px-2 py-1 text-xs rounded";

        const statusClasses: Record<string, string> = {
            PAID: "bg-green-500/20 text-green-400 border border-green-500/30",
            SHIPPED: "bg-blue-500/20 text-blue-400 border border-blue-500/30",
            CANCELLED: "bg-red-500/20 text-red-400 border border-red-500/30",
            PROCESSING: "bg-purple-500/20 text-purple-400 border border-purple-500/30",
            DELIVERED: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30",
            REFUNDED: "bg-orange-500/20 text-orange-400 border border-orange-500/30",
            FAILED: "bg-red-500/20 text-red-400 border border-red-500/30",
            RETURNED: "bg-gray-500/20 text-gray-400 border border-gray-500/30",
            PENDING: "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30",
        };

        return `${baseClass} ${statusClasses[status] || statusClasses.PENDING}`;
    };

    if (displayedOrders.length === 0) {
        return (
            <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Order History</h2>
                <div className="text-center py-8 md:py-12 text-gray-400">
                    <div className="text-4xl md:text-6xl mb-4">📦</div>
                    <p className="mb-4">No orders yet</p>
                    <Link href="/" className="inline-block px-6 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
            <div className="flex justify-between items-center mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-white">Order History</h2>
            </div>

            <div className="space-y-4">
                {displayedOrders.map((order: any) => {
                    const orderItems = Array.isArray(order.items) ? order.items : typeof order.items === "object" && order.items !== null ? [order.items] : [];

                    const orderDate = order.date || order.createdAt || new Date();
                    const isRepeat = order.isRepeat;

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
                                    <span className={getStatusBadgeClass(order.status)}>{order.status || "PENDING"}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-cyan-400">${order.total?.toFixed(2) || "0.00"}</div>
                                    <div className="text-sm text-gray-400">{orderItems.length} items</div>
                                </div>
                            </div>

                            {orderItems.length > 0 && (
                                <div className="space-y-2 mb-4 text-sm text-gray-300">
                                    {orderItems.map((item: any, index: any) => (
                                        <div key={index} className="flex justify-between">
                                            <span>
                                                • {item.product?.name || item.name || "Product"}
                                                {item.size && <span className="text-cyan-400 ml-1">({item.size}mg)</span>}
                                                {item.quantity > 1 && ` × ${item.quantity}`}
                                            </span>
                                            <span className="text-cyan-300">${(item.unitPrice * item.quantity)?.toFixed(2) || "0.00"}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button onClick={() => handleDirectCheckout(order)} disabled={!isRepeat || isCheckoutLoading} className={`flex-1 py-2 rounded-lg font-semibold transition ${isRepeat && !isCheckoutLoading ? "bg-cyan-500 hover:bg-cyan-600 text-white cursor-pointer" : "bg-gray-600 text-gray-400 cursor-not-allowed opacity-50"}`}>
                                    {isCheckoutLoading ? "Processing..." : isRepeat ? "🔄 Repeat Order" : "📦 Stock Out"}
                                </button>
                                <Link href={`/dashboard/orders/${order.id}`} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold text-center transition">
                                    View Details
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Show All Orders Button */}
            {data?.meta?.total && data.meta.total > 3 && (
                <div className="mt-6 text-center">
                    <Link href="/dashboard/orders" className="inline-block px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition">
                        View All Orders
                    </Link>
                </div>
            )}
        </div>
    );
}
