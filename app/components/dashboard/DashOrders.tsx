// "use client";

// import Link from "next/link";
// import { Order } from "../../types";
// import { useGetOrdersQuery } from "@/app/redux/features/order/orderApi";

// interface OrderHistoryProps {
//     orders?: Order[];
//     onRepeatOrder?: (orderId: string) => void;
// }

// export default function OrderHistory({ orders = [], onRepeatOrder }: OrderHistoryProps) {
//     const { data } = useGetOrdersQuery({});
//     console.log(data);

//     if (orders.length === 0) {
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
//             <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Order History</h2>

//             <div className="space-y-4">
//                 {orders.map((order) => {
//                     // Handle the items JSON structure
//                     const orderItems = Array.isArray(order.items) ? order.items : typeof order.items === "object" && order.items !== null ? [order.items] : [];
//                     const orderDate = order.date || order.createdAt || new Date();

//                     return (
//                         <div key={order.id} className="bg-slate-900 rounded-lg p-4 md:p-6">
//                             <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
//                                 <div>
//                                     <h3 className="font-bold text-white">Order #{order.id}</h3>
//                                     <p className="text-sm text-gray-400">{new Date(orderDate).toLocaleDateString()}</p>
//                                     {/* <p className="text-sm text-gray-400">{new Date(order?.createdAt).toLocaleDateString()}</p> */}
//                                 </div>
//                                 <div className="text-right">
//                                     <div className="text-xl font-bold text-cyan-400">${order.total?.toFixed(2) || "0.00"}</div>
//                                     <div className="text-sm text-gray-400">{orderItems.length} items</div>
//                                 </div>
//                             </div>

//                             {orderItems.length > 0 && (
//                                 <div className="space-y-2 mb-4 text-sm text-gray-300">
//                                     {orderItems.map((item, index) => (
//                                         <div key={index}>
//                                             • {item.name || "Item"} ({item.mg || "N/A"}mg) — {item.quantity || 1}
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}

//                             <button onClick={() => onRepeatOrder && onRepeatOrder(order.id.toString())} className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold">
//                                 🔄 Repeat This Order
//                             </button>
//                         </div>
//                     );
//                 })}
//             </div>
//         </div>
//     );
// }

"use client";

import Link from "next/link";
import { Order } from "../../types";
import { useGetOrdersQuery } from "@/app/redux/features/order/orderApi";
import { useRouter } from "next/navigation";

interface OrderHistoryProps {
    orders?: Order[];
}

export default function OrderHistory({ orders = [] }: OrderHistoryProps) {
    const router = useRouter();
    const { data } = useGetOrdersQuery({ page: 1, limit: 3 });
    const displayedOrders = data?.data || orders.slice(0, 3);

    const onRepeatOrder = (orderId: string) => {
        router.push(`/checkout/repeat/${orderId}`);
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
                                    {orderItems.map((item: any, index: any) => (
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
                                <button onClick={() => onRepeatOrder && onRepeatOrder(order.id)} className="flex-1 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition">
                                    🔄 Repeat Order
                                </button>
                                <Link href={`/orders/${order.id}`} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold text-center transition">
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
