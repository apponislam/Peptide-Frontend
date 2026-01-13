// "use client";

// import Link from "next/link";
// import { Order } from "../../types";

// interface OrderHistoryProps {
//     orders?: Order[];
//     onRepeatOrder?: (orderId: string) => void;
// }

// export default function OrderHistory({ orders = [], onRepeatOrder }: OrderHistoryProps) {
//     console.log(orders);

//     if (orders.length === 0) {
//         return (
//             <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
//                 <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Order History</h2>

//                 <div className="text-center py-8 md:py-12 text-gray-400">
//                     <div className="text-4xl md:text-6xl mb-4">📦</div>
//                     <p className="mb-4">No orders yet</p>
//                     <Link href="/store" className="inline-block px-6 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600">
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
//                 {orders.map((order) => (
//                     <div key={order.id} className="bg-slate-900 rounded-lg p-4 md:p-6">
//                         <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
//                             <div>
//                                 <h3 className="font-bold text-white">Order #{order.id}</h3>
//                                 <p className="text-sm text-gray-400">{new Date(order.date).toLocaleDateString()}</p>
//                             </div>
//                             <div className="text-right">
//                                 <div className="text-xl font-bold text-cyan-400">${order.total.toFixed(2)}</div>
//                                 <div className="text-sm text-gray-400">{order.items.length} items</div>
//                             </div>
//                         </div>

//                         <div className="space-y-2 mb-4 text-sm text-gray-300">
//                             {order.items.map((item, index) => (
//                                 <div key={index}>
//                                     • {item.name} ({item.mg}mg) — {item.quantity}
//                                 </div>
//                             ))}
//                         </div>

//                         <button onClick={() => onRepeatOrder && onRepeatOrder(order.id)} className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold">
//                             🔄 Repeat This Order
//                         </button>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

"use client";

import Link from "next/link";
import { Order } from "../../types";

interface OrderHistoryProps {
    orders?: Order[];
    onRepeatOrder?: (orderId: string) => void;
}

export default function OrderHistory({ orders = [], onRepeatOrder }: OrderHistoryProps) {
    if (orders.length === 0) {
        return (
            <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Order History</h2>

                <div className="text-center py-8 md:py-12 text-gray-400">
                    <div className="text-4xl md:text-6xl mb-4">📦</div>
                    <p className="mb-4">No orders yet</p>
                    <Link href="/store" className="inline-block px-6 py-2 bg-cyan-500 text-white rounded-lg font-semibold hover:bg-cyan-600">
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-800 rounded-xl p-4 md:p-6 border border-slate-700">
            <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6">Order History</h2>

            <div className="space-y-4">
                {orders.map((order) => {
                    // Handle the items JSON structure
                    const orderItems = Array.isArray(order.items) ? order.items : typeof order.items === "object" && order.items !== null ? [order.items] : [];
                    const orderDate = order.date || order.createdAt || new Date();

                    return (
                        <div key={order.id} className="bg-slate-900 rounded-lg p-4 md:p-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                <div>
                                    <h3 className="font-bold text-white">Order #{order.id}</h3>
                                    <p className="text-sm text-gray-400">{new Date(orderDate).toLocaleDateString()}</p>
                                    {/* <p className="text-sm text-gray-400">{new Date(order?.createdAt).toLocaleDateString()}</p> */}
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-bold text-cyan-400">${order.total?.toFixed(2) || "0.00"}</div>
                                    <div className="text-sm text-gray-400">{orderItems.length} items</div>
                                </div>
                            </div>

                            {orderItems.length > 0 && (
                                <div className="space-y-2 mb-4 text-sm text-gray-300">
                                    {orderItems.map((item, index) => (
                                        <div key={index}>
                                            • {item.name || "Item"} ({item.mg || "N/A"}mg) — {item.quantity || 1}
                                        </div>
                                    ))}
                                </div>
                            )}

                            <button onClick={() => onRepeatOrder && onRepeatOrder(order.id.toString())} className="w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold">
                                🔄 Repeat This Order
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
