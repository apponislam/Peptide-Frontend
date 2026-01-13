// "use client";

// // import { Product } from "@/types";
// // import { useCart } from "@/hooks/useCart";
// // import { useAuth } from "@/hooks/useAuth";
// // import { getMemberPrice } from "@/lib/products";
// import Link from "next/link";
// import { Product } from "../types";
// import { useCart } from "../hooks/useCart";
// import { useAuth } from "../contexts/AuthContext";
// import { getMemberPrice } from "../lib/products";

// interface ProductCardProps {
//     product: Product;
// }

// export default function ProductCard({ product }: ProductCardProps) {
//     const { cart, addToCart, removeFromCart } = useCart();
//     const { user } = useAuth();

//     return (
//         <Link href={`/product/${product.id}`} className="product-card bg-slate-800 rounded-xl border border-slate-700 overflow-hidden cursor-pointer hover:border-cyan-500 transition flex flex-col">
//             <div className="aspect-square bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center flex-1">
//                 <div className="product-abbr text-3xl md:text-4xl font-black text-slate-600 text-center px-2">{product.name.substring(0, 5)}</div>
//             </div>
//             <div className="p-4 md:p-6">
//                 <h3 className="text-sm md:text-lg font-bold text-white mb-2">{product.name}</h3>
//                 <p className="text-xs text-gray-400 mb-3 md:mb-4 line-clamp-2">{product.desc}</p>
//                 <div className="space-y-2 md:space-y-3 pt-3 border-t border-slate-700">
//                     {product.sizes.map((size) => {
//                         const cartItem = cart.find((item) => item.product.id === product.id && item.size.mg === size.mg);
//                         const qty = cartItem ? cartItem.quantity : 0;
//                         const show = qty > 0;

//                         return (
//                             <div key={size.mg} className="flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
//                                 <span className="text-xs md:text-sm text-gray-400">{size.mg}mg</span>
//                                 <div className="flex items-center gap-1 md:gap-2">
//                                     <div className="flex flex-col items-end">
//                                         <span className="text-white text-xs line-through">${size.price.toFixed(2)}</span>
//                                         <span className="text-cyan-400 font-bold text-sm md:text-base">${getMemberPrice(size.price, user)}</span>
//                                     </div>
//                                     {show ? (
//                                         <div className="flex items-center gap-1 bg-slate-700 rounded px-2 py-1">
//                                             <button onClick={() => removeFromCart(product.id, size.mg)} className="text-white hover:text-cyan-400 font-bold text-sm">
//                                                 −
//                                             </button>
//                                             <span className="text-white font-bold text-sm min-w-5 text-center">{qty}</span>
//                                             <button onClick={() => addToCart(product, size)} className="text-white hover:text-cyan-400 font-bold text-sm">
//                                                 +
//                                             </button>
//                                         </div>
//                                     ) : (
//                                         <button onClick={() => addToCart(product, size)} className="px-2 md:px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white text-xs md:text-sm rounded">
//                                             +
//                                         </button>
//                                     )}
//                                 </div>
//                             </div>
//                         );
//                     })}
//                 </div>
//             </div>
//         </Link>
//     );
// }

"use client";

import Link from "next/link";
import { Product } from "../types";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../contexts/AuthContext";
import { getMemberPrice } from "../lib/products";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const { cart, addToCart, removeFromCart } = useCart();
    const { user } = useAuth();

    return (
        <div className="product-card bg-slate-800 rounded-xl border border-slate-700 overflow-hidden hover:border-cyan-500 transition flex flex-col">
            {/* Product info as link */}
            <Link href={`/product/${product.id}`} className="flex-1">
                <div className="aspect-square bg-linear-to-br from-slate-700 to-slate-900 flex items-center justify-center flex-1">
                    <div className="product-abbr text-3xl md:text-4xl font-black text-slate-600 text-center px-2">{product.name.substring(0, 5)}</div>
                </div>
                <div className="p-4 md:p-6">
                    <h3 className="text-sm md:text-lg font-bold text-white mb-2">{product.name}</h3>
                    <p className="text-xs text-gray-400 mb-3 md:mb-4 line-clamp-2">{product.desc}</p>
                </div>
            </Link>

            {/* Cart buttons - separate from link */}
            <div className="p-4 md:p-6 pt-0">
                <div className="space-y-2 md:space-y-3 pt-3 border-t border-slate-700">
                    {product.sizes.map((size) => {
                        const cartItem = cart.find((item) => item.product.id === product.id && item.size.mg === size.mg);
                        const qty = cartItem ? cartItem.quantity : 0;
                        const show = qty > 0;

                        return (
                            <div key={size.mg} className="flex justify-between items-center">
                                <span className="text-xs md:text-sm text-gray-400">{size.mg}mg</span>
                                <div className="flex items-center gap-1 md:gap-2">
                                    <div className="flex flex-col items-end">
                                        <span className="text-white text-xs line-through">${size.price.toFixed(2)}</span>
                                        <span className="text-cyan-400 font-bold text-sm md:text-base">${getMemberPrice(size.price, user)}</span>
                                    </div>
                                    {show ? (
                                        <div className="flex items-center gap-1 bg-slate-700 rounded px-2 py-1">
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    removeFromCart(product.id, size.mg);
                                                }}
                                                className="text-white hover:text-cyan-400 font-bold text-sm"
                                            >
                                                −
                                            </button>
                                            <span className="text-white font-bold text-sm min-w-5 text-center">{qty}</span>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    addToCart(product, size);
                                                }}
                                                className="text-white hover:text-cyan-400 font-bold text-sm"
                                            >
                                                +
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToCart(product, size);
                                            }}
                                            className="px-2 md:px-3 py-1 bg-cyan-500 hover:bg-cyan-600 text-white text-xs md:text-sm rounded"
                                        >
                                            +
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
