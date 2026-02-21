// "use client";

// import { useGetMeQuery } from "../redux/features/auth/authApi";
// import { getTier } from "../utils/pricing";
// import { useSelector, useDispatch } from "react-redux";
// import { closeCart, addToCart, removeFromCart, clearCart } from "../redux/features/cart/cartSlice";
// import { selectCartItems, selectCartOpen } from "../redux/features/cart/cartSlice";
// import { useCreateCheckoutSessionMutation } from "../redux/features/payment/paymentApi";
// import { useRouter } from "next/navigation";

// export default function CartSidebar() {
//     const dispatch = useDispatch();
//     const router = useRouter();
//     const { data: userData } = useGetMeQuery();
//     const user = userData?.data;

//     // Get cart state from Redux
//     const cart = useSelector(selectCartItems);
//     const isOpen = useSelector(selectCartOpen);

//     const [createCheckout, { isLoading: isCheckoutLoading }] = useCreateCheckoutSessionMutation();

//     const tier = getTier(user?.tier || "Member");

//     const getMemberPrice = (price: number) => {
//         return (price * (1 - tier.discount / 100)).toFixed(2);
//     };

//     const calculateSubtotal = () => {
//         return cart.reduce((sum, item) => {
//             return sum + parseFloat(getMemberPrice(item.size.price)) * item.quantity;
//         }, 0);
//     };

//     const calculateShipping = () => {
//         const subtotal = calculateSubtotal();
//         const SHIPPING_RATE = 6.95;
//         if (user?.tier === "Founder" || user?.tier === "VIP") {
//             return 0;
//         }
//         if (user?.tier === "Member") {
//             return subtotal >= 150 ? 0 : SHIPPING_RATE;
//         }
//         return subtotal >= 150 ? 0 : SHIPPING_RATE;
//     };

//     const calculateTotal = () => {
//         return calculateSubtotal() + calculateShipping();
//     };

//     // Get shipping display message
//     const getShippingMessage = () => {
//         const shippingCost = calculateShipping();
//         const subtotal = calculateSubtotal();

//         if (shippingCost === 0) {
//             if (user?.tier === "Founder" || user?.tier === "VIP") {
//                 return { text: `Free (${user.tier})`, color: "text-green-400" };
//             }
//             if (user?.tier === "Member" && subtotal >= 150) {
//                 return { text: "Free (Over $150)", color: "text-green-400" };
//             }
//             if (subtotal >= 150) {
//                 return { text: "Free (Over $150)", color: "text-green-400" };
//             }
//             return { text: "Free", color: "text-green-400" };
//         }

//         return { text: `$${shippingCost.toFixed(2)}`, color: "text-yellow-400" };
//     };

//     const shippingMessage = getShippingMessage();

//     // Handle checkout directly from sidebar
//     const handleCheckout = async () => {
//         try {
//             if (!user) {
//                 router.push("/auth/login");
//                 dispatch(closeCart());
//                 return;
//             }

//             // Prepare items for API
//             const itemsForApi = cart.map((item) => ({
//                 productId: item.product.id,
//                 name: item.product.name,
//                 description: `${item.size.mg}mg ${item.product.name}`,
//                 price: parseFloat(getMemberPrice(item.size.price)),
//                 quantity: item.quantity,
//                 size: item.size.mg.toString(),
//             }));

//             const subtotal = calculateSubtotal();
//             const shippingAmount = calculateShipping();
//             const total = calculateTotal();

//             // Create checkout session
//             // const result = await createCheckout({
//             //     userId: user.id,
//             //     items: itemsForApi,
//             //     shippingAmount,
//             //     subtotal,
//             //     storeCreditUsed: 0,
//             //     total,
//             //     metadata: {
//             //         userId: user.id,
//             //         originalSubtotal: subtotal,
//             //         storeCreditUsed: 0,
//             //         itemDetails: JSON.stringify(
//             //             cart.map((item) => ({
//             //                 productId: item.product.id,
//             //                 originalPrice: item.size.price,
//             //                 quantity: item.quantity,
//             //                 name: item.product.name,
//             //                 size: item.size.mg,
//             //                 finalPrice: parseFloat(getMemberPrice(item.size.price)),
//             //             })),
//             //         ),
//             //     },
//             // }).unwrap();

//             // const result = await createCheckout({
//             //     userId: user.id,
//             //     items: itemsForApi,
//             //     shippingAmount,
//             //     subtotal,
//             //     storeCreditUsed: 0,
//             //     total,
//             //     metadata: {
//             //         userId: user.id,
//             //         originalSubtotal: subtotal,
//             //         storeCreditUsed: 0,
//             //         itemCount: cart.length,
//             //         itemIds: JSON.stringify(cart.map((item) => item.product.id)),
//             //     },
//             // }).unwrap();

//             const itemString = cart.map((item) => `${item.product.id}-${item.size.mg}-${item.quantity}`).join(",");
//             const result = await createCheckout({
//                 userId: user.id,
//                 items: itemsForApi,
//                 shippingAmount,
//                 subtotal,
//                 storeCreditUsed: 0,
//                 total,
//                 metadata: {
//                     userId: user.id,
//                     originalSubtotal: subtotal,
//                     storeCreditUsed: 0,
//                     items: itemString,
//                     itemCount: cart.length,
//                 },
//             }).unwrap();

//             if (result.url) {
//                 dispatch(clearCart());
//                 dispatch(closeCart());
//                 window.location.href = result.url;
//             }
//         } catch (error: any) {
//             console.error("Checkout failed:", error);
//             alert(`Checkout failed: ${error?.data?.error || error.message}`);
//         }
//     };

//     // Handle add to cart with stock limit
//     const handleAddToCart = (item: (typeof cart)[0]) => {
//         const productSize = item.product.sizes.find((s) => s.mg === item.size.mg);
//         if (!productSize) return;

//         const currentQty = item.quantity;
//         if (currentQty < productSize.quantity) {
//             dispatch(addToCart({ product: item.product, size: item.size }));
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex justify-end">
//             {/* Overlay */}
//             <div className="absolute inset-0 bg-black/50" onClick={() => dispatch(closeCart())} />

//             {/* Cart Sidebar */}
//             <div className="relative w-full max-w-sm bg-slate-900 shadow-2xl flex flex-col h-full border-l border-slate-700">
//                 {/* Header */}
//                 <div className="p-4 border-b border-slate-700 flex items-center justify-between">
//                     <h2 className="text-xl font-bold text-white">Cart</h2>
//                     <button onClick={() => dispatch(closeCart())} className="text-gray-400 hover:text-white transition-colors">
//                         ✕
//                     </button>
//                 </div>

//                 {/* Cart Items */}
//                 <div className="flex-1 overflow-y-auto p-4">
//                     {cart.length === 0 ? (
//                         <p className="text-gray-400 text-center py-8">Cart is empty</p>
//                     ) : (
//                         cart.map((item) => {
//                             const originalPrice = item.size.price;
//                             const discountedPrice = getMemberPrice(originalPrice);

//                             const productSize = item.product.sizes.find((s) => s.mg === item.size.mg);
//                             const availableQty = productSize?.quantity || 0;
//                             const maxReached = item.quantity >= availableQty;

//                             return (
//                                 <div key={`${item.product.id}-${item.size.mg}`} className="bg-slate-800 rounded-lg p-3 mb-3">
//                                     <div className="flex justify-between mb-2">
//                                         <div>
//                                             <h4 className="font-bold text-white text-sm">{item.product.name}</h4>
//                                             <p className="text-xs text-gray-400">{item.size.mg}mg</p>
//                                         </div>
//                                         <div className="text-right">
//                                             <div className="text-xs text-gray-500 line-through mb-1">${originalPrice.toFixed(2)}</div>
//                                             {/* <div className="text-cyan-400 font-bold">${discountedPrice}</div> */}
//                                             <div className={`font-bold ${tier.name === "VIP" || tier.name === "Founder" ? "text-yellow-400" : "text-cyan-400"}`}>${discountedPrice}</div>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center gap-3">
//                                         <button
//                                             onClick={() =>
//                                                 dispatch(
//                                                     removeFromCart({
//                                                         productId: item.product.id,
//                                                         mg: item.size.mg,
//                                                     }),
//                                                 )
//                                             }
//                                             className="px-3 py-1 bg-slate-700 rounded hover:bg-slate-600 text-white transition-colors"
//                                         >
//                                             -
//                                         </button>
//                                         <span className="text-white font-bold">{item.quantity}</span>
//                                         <button onClick={() => handleAddToCart(item)} disabled={maxReached} className={`px-3 py-1 rounded transition-colors ${maxReached ? "bg-gray-600 cursor-not-allowed opacity-50" : "bg-slate-700 hover:bg-slate-600 text-white"}`}>
//                                             +
//                                         </button>
//                                     </div>
//                                     {maxReached && <p className="text-xs text-red-400 mt-2">Max stock reached</p>}
//                                 </div>
//                             );
//                         })
//                     )}
//                 </div>

//                 {/* Footer with Totals and Checkout */}
//                 {cart.length > 0 && (
//                     <div className="p-4 border-t border-slate-700">
//                         <div className="mb-2 text-sm text-gray-400 flex justify-between">
//                             <span>Subtotal:</span>
//                             <span>${calculateSubtotal().toFixed(2)}</span>
//                         </div>

//                         <div className="mb-4 text-sm text-gray-400 flex justify-between">
//                             <span>Shipping:</span>
//                             <span className={shippingMessage.color}>{shippingMessage.text}</span>
//                         </div>

//                         <div className="flex justify-between mb-4 text-lg font-bold">
//                             <span className="text-white">Total:</span>
//                             <span className="text-cyan-400">${calculateTotal().toFixed(2)}</span>
//                         </div>

//                         <button onClick={handleCheckout} disabled={isCheckoutLoading} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
//                             {isCheckoutLoading ? "Processing..." : "Checkout via REVEL"}
//                         </button>

//                         <p className="text-xs text-gray-500 text-center mt-2">Payments will appear on statement as REVEL</p>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

"use client";

import { useGetMeQuery } from "../redux/features/auth/authApi";
import { getTier } from "../utils/pricing";
import { useSelector, useDispatch } from "react-redux";
import { closeCart, addToCart, removeFromCart, clearCart } from "../redux/features/cart/cartSlice";
import { selectCartItems, selectCartOpen } from "../redux/features/cart/cartSlice";
import { useCreateCheckoutSessionMutation } from "../redux/features/payment/paymentApi";
import { useRouter } from "next/navigation";
import { useCreateOrderPreviewMutation } from "../redux/features/orderpreview/orderpreviewApi";

export default function CartSidebar() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { data: userData } = useGetMeQuery();
    const user = userData?.data;

    // Get cart state from Redux
    const cart = useSelector(selectCartItems);
    const isOpen = useSelector(selectCartOpen);

    const [createCheckout, { isLoading: isCheckoutLoading }] = useCreateCheckoutSessionMutation();
    const [createOrderPreview, { isLoading: isPreviewLoading }] = useCreateOrderPreviewMutation();

    const tier = getTier(user?.tier || "Member");

    const getMemberPrice = (price: number) => {
        return (price * (1 - tier.discount / 100)).toFixed(2);
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => {
            return sum + parseFloat(getMemberPrice(item.size.price)) * item.quantity;
        }, 0);
    };

    const calculateShipping = () => {
        const subtotal = calculateSubtotal();
        const SHIPPING_RATE = 6.95;

        // VIP and Founder always get free shipping
        if (user?.tier === "Founder" || user?.tier === "VIP") {
            return 0;
        }

        // Members get free shipping over $150
        if (user?.tier === "Member" && subtotal >= 150) {
            return 0;
        }

        // Default shipping rate
        return SHIPPING_RATE;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping();
    };

    // Get shipping display message
    const getShippingMessage = () => {
        const shippingCost = calculateShipping();
        const subtotal = calculateSubtotal();

        if (shippingCost === 0) {
            if (user?.tier === "Founder" || user?.tier === "VIP") {
                return { text: `Free (${user.tier})`, color: "text-green-400" };
            }
            if (user?.tier === "Member" && subtotal >= 150) {
                return { text: "Free (Over $150)", color: "text-green-400" };
            }
            return { text: "Free", color: "text-green-400" };
        }

        return { text: `$${shippingCost.toFixed(2)}`, color: "text-yellow-400" };
    };

    const shippingMessage = getShippingMessage();

    const handleCheckout = async () => {
        try {
            if (!user) {
                router.push("/auth/login");
                dispatch(closeCart());
                return;
            }

            // Prepare full item details for database storage
            const fullItemDetails = cart.map((item) => ({
                productId: item.product.id,
                name: item.product.name,
                size: item.size.mg,
                quantity: item.quantity,
                originalPrice: item.size.price,
                finalPrice: parseFloat(getMemberPrice(item.size.price)),
                description: `${item.size.mg}mg ${item.product.name}`,
            }));

            const subtotal = calculateSubtotal();
            const shippingAmount = calculateShipping();
            const total = calculateTotal();

            console.log("Creating order preview with:", {
                items: fullItemDetails,
                subtotal,
                shippingAmount,
                total,
            });

            // 1. CREATE ORDER PREVIEW IN DATABASE
            let previewResult;
            try {
                previewResult = await createOrderPreview({
                    items: fullItemDetails,
                    subtotal,
                    shippingAmount,
                    total,
                }).unwrap();
                console.log("Preview created:", previewResult);
            } catch (previewError: any) {
                console.error("Order preview creation failed:", previewError);
                alert(`Failed to create order preview: ${previewError?.data?.error || previewError?.message || JSON.stringify(previewError)}`);
                return;
            }

            const previewId = previewResult.data.previewId;

            // 2. Prepare minimal items for Stripe API
            const itemsForApi = cart.map((item) => ({
                productId: item.product.id,
                name: item.product.name,
                description: `${item.size.mg}mg ${item.product.name}`,
                price: parseFloat(getMemberPrice(item.size.price)),
                quantity: item.quantity,
                size: item.size.mg.toString(),
            }));

            console.log("Creating checkout with previewId:", previewId);

            // 3. Create checkout session with ONLY the preview ID
            let checkoutResult;
            try {
                checkoutResult = await createCheckout({
                    userId: user.id,
                    items: itemsForApi,
                    shippingAmount,
                    subtotal,
                    storeCreditUsed: 0,
                    total,
                    metadata: {
                        userId: user.id,
                        originalSubtotal: subtotal.toString(),
                        storeCreditUsed: "0",
                        orderPreviewId: previewId,
                    },
                }).unwrap();
                console.log("Checkout created:", checkoutResult);
            } catch (checkoutError: any) {
                console.error("Checkout creation failed:", checkoutError);
                alert(`Checkout failed: ${checkoutError?.data?.error || checkoutError?.message || JSON.stringify(checkoutError)}`);
                return;
            }

            if (checkoutResult.url) {
                dispatch(clearCart());
                dispatch(closeCart());
                window.location.href = checkoutResult.url;
            }
        } catch (error: any) {
            console.error("Unexpected error:", error);
            alert(`Unexpected error: ${error?.message || JSON.stringify(error)}`);
        }
    };

    // Handle add to cart with stock limit
    const handleAddToCart = (item: (typeof cart)[0]) => {
        const productSize = item.product.sizes.find((s) => s.mg === item.size.mg);
        if (!productSize) return;

        const currentQty = item.quantity;
        if (currentQty < productSize.quantity) {
            dispatch(addToCart({ product: item.product, size: item.size }));
        }
    };

    if (!isOpen) return null;

    const isLoading = isCheckoutLoading || isPreviewLoading;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" onClick={() => dispatch(closeCart())} />

            {/* Cart Sidebar */}
            <div className="relative w-full max-w-sm bg-slate-900 shadow-2xl flex flex-col h-full border-l border-slate-700">
                {/* Header */}
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-white">Cart</h2>
                    <button onClick={() => dispatch(closeCart())} className="text-gray-400 hover:text-white transition-colors">
                        ✕
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4">
                    {cart.length === 0 ? (
                        <p className="text-gray-400 text-center py-8">Cart is empty</p>
                    ) : (
                        cart.map((item) => {
                            const originalPrice = item.size.price;
                            const discountedPrice = getMemberPrice(originalPrice);

                            const productSize = item.product.sizes.find((s) => s.mg === item.size.mg);
                            const availableQty = productSize?.quantity || 0;
                            const maxReached = item.quantity >= availableQty;

                            return (
                                <div key={`${item.product.id}-${item.size.mg}`} className="bg-slate-800 rounded-lg p-3 mb-3">
                                    <div className="flex justify-between mb-2">
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{item.product.name}</h4>
                                            <p className="text-xs text-gray-400">{item.size.mg}mg</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-xs text-gray-500 line-through mb-1">${originalPrice.toFixed(2)}</div>
                                            <div className={`font-bold ${tier.name === "VIP" || tier.name === "Founder" ? "text-yellow-400" : "text-cyan-400"}`}>${discountedPrice}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() =>
                                                dispatch(
                                                    removeFromCart({
                                                        productId: item.product.id,
                                                        mg: item.size.mg,
                                                    }),
                                                )
                                            }
                                            className="px-3 py-1 bg-slate-700 rounded hover:bg-slate-600 text-white transition-colors"
                                        >
                                            -
                                        </button>
                                        <span className="text-white font-bold">{item.quantity}</span>
                                        <button onClick={() => handleAddToCart(item)} disabled={maxReached} className={`px-3 py-1 rounded transition-colors ${maxReached ? "bg-gray-600 cursor-not-allowed opacity-50" : "bg-slate-700 hover:bg-slate-600 text-white"}`}>
                                            +
                                        </button>
                                    </div>
                                    {maxReached && <p className="text-xs text-red-400 mt-2">Max stock reached</p>}
                                </div>
                            );
                        })
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
                            <span className={shippingMessage.color}>{shippingMessage.text}</span>
                        </div>

                        <div className="flex justify-between mb-4 text-lg font-bold">
                            <span className="text-white">Total:</span>
                            <span className="text-cyan-400">${calculateTotal().toFixed(2)}</span>
                        </div>

                        <button onClick={handleCheckout} disabled={isLoading} className="w-full py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? "Processing..." : "Checkout via REVEL"}
                        </button>

                        <p className="text-xs text-gray-500 text-center mt-2">Payments will appear on statement as REVEL</p>
                    </div>
                )}
            </div>
        </div>
    );
}
