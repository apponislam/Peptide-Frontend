"use client";

import { useCart } from "../contexts/CartContext";
import { getTier } from "../lib/products";
import { useGetMeQuery } from "../redux/features/auth/authApi";

export default function CartSidebar() {
    const { cart, isOpen, setIsOpen, addToCart, removeFromCart, cartTotal, cartCount, clearCart } = useCart();
    const { data: userData } = useGetMeQuery();
    const user = userData?.data;

    const tier = getTier(user?.referralCount || 0);

    const getMemberPrice = (price: number) => {
        if (!user) return price.toFixed(2);
        return (price * (1 - tier.discount / 100)).toFixed(2);
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => {
            return sum + parseFloat(getMemberPrice(item.size.price)) * item.quantity;
        }, 0);
    };

    const calculateShipping = () => {
        if (tier.freeShipping) return 0;
        const subtotal = calculateSubtotal();
        return subtotal >= 150 ? 0 : 6.95;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping();
    };

    const checkout = () => {
        alert("Checkout functionality coming soon!");
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)} />

            {/* Cart Sidebar */}
            <div className="relative w-full max-w-sm bg-slate-900 shadow-2xl flex flex-col h-full border-l border-slate-700">
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Cart</h2>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
                        ✕
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {cart.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">Cart is empty</p>
                    ) : (
                        cart.map((item) => (
                            <div key={`${item.product.id}-${item.size.mg}`} className="bg-slate-800 rounded-lg p-3 mb-3">
                                <div className="flex justify-between mb-2">
                                    <div>
                                        <h4 className="font-bold text-white text-sm">{item.product.name}</h4>
                                        <p className="text-xs text-gray-400">{item.size.mg}mg</p>
                                    </div>
                                    <div className="text-cyan-400 font-bold">${getMemberPrice(item.size.price)}</div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={() => removeFromCart(item.product.id, item.size.mg)} className="px-3 py-1 bg-slate-700 rounded hover:bg-slate-600 text-white">
                                        -
                                    </button>
                                    <span className="text-white font-bold">{item.quantity}</span>
                                    <button onClick={() => addToCart(item.product, item.size)} className="px-3 py-1 bg-slate-700 rounded hover:bg-slate-600 text-white">
                                        +
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer with Totals and Checkout */}
                {cart.length > 0 && (
                    <div className="p-4 border-t border-slate-700">
                        <div className="mb-2 text-sm text-gray-400 flex justify-between">
                            <span>Subtotal:</span>
                            <span>${calculateSubtotal().toFixed(2)}</span>
                        </div>
                        <div className="mb-4 text-sm text-gray-400 flex justify-between">
                            <span>Shipping:</span>
                            <span>${calculateShipping().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between mb-4 text-lg font-bold">
                            <span className="text-white">Total:</span>
                            <span className="text-cyan-400">${calculateTotal().toFixed(2)}</span>
                        </div>
                        <button onClick={checkout} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-bold hover:shadow-lg transition">
                            Checkout via REVEL
                        </button>
                        <p className="text-xs text-gray-500 text-center mt-2">Payments will appear on statement as REVEL</p>
                    </div>
                )}
            </div>
        </div>
    );
}
