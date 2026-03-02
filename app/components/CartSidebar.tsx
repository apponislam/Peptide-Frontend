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
        return price * (1 - tier.discount / 100);
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => {
            return sum + getMemberPrice(item.size.price) * item.quantity;
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

        return SHIPPING_RATE;
    };

    // Calculate total payable (before store credit)
    const calculateTotalPayable = () => {
        return calculateSubtotal() + calculateShipping();
    };

    // AUTO store credit calculation
    const calculateStoreCreditUsed = () => {
        if (!user?.storeCredit) return 0;

        // Convert to number if it's a string
        const storeCredit = typeof user.storeCredit === "string" ? parseFloat(user.storeCredit) : user.storeCredit;

        if (storeCredit <= 0) return 0;

        const totalPayable = calculateTotalPayable();

        // Can't use credit if total is $1 or less
        if (totalPayable <= 1) return 0;

        // Maximum credit = total - $1 (minimum Stripe charge)
        const maxAllowed = totalPayable - 1;

        // Use the smaller of available credit or max allowed
        return Math.min(storeCredit, maxAllowed);
    };

    // Calculate how store credit is distributed - FIRST to shipping, THEN equally to products
    const calculateStripeDetails = () => {
        const storeCreditUsed = calculateStoreCreditUsed();

        // If no store credit used, just return the regular member prices with original shipping
        if (storeCreditUsed === 0) {
            return {
                items: cart.map((item) => ({
                    ...item,
                    memberPrice: getMemberPrice(item.size.price),
                    stripePrice: getMemberPrice(item.size.price),
                })),
                shippingAmount: calculateShipping(),
                totalPayable: calculateTotalPayable(),
            };
        }

        const subtotal = calculateSubtotal(); // $16.20
        const shippingCost = calculateShipping(); // $6.95
        const totalPayable = calculateTotalPayable(); // $23.15

        // STEP 1: Apply store credit to shipping first
        let remainingCredit = storeCreditUsed; // $10.00

        let shippingAfterCredit = shippingCost;
        if (remainingCredit >= shippingCost) {
            shippingAfterCredit = 0;
            remainingCredit -= shippingCost; // $10 - $6.95 = $3.05 remaining
        } else {
            shippingAfterCredit = shippingCost - remainingCredit;
            remainingCredit = 0;
        }

        // STEP 2: Calculate total amount to charge for items after shipping credit
        // Total to charge = (subtotal + shippingAfterCredit) but wait, that's not right
        // Actually: totalPayable - storeCreditUsed = amount to charge
        const amountToCharge = totalPayable - storeCreditUsed; // $23.15 - $10 = $13.15

        // STEP 3: Distribute remaining credit across products EQUALLY
        const productCount = cart.length; // 2 products

        // Calculate total amount to charge for items (after shipping credit is applied)
        // If shippingAfterCredit is 0, then all amountToCharge goes to items
        // If shippingAfterCredit > 0, then items amount = amountToCharge - shippingAfterCredit
        const itemsAmountToCharge = amountToCharge - shippingAfterCredit; // $13.15 - $0 = $13.15

        // Calculate target total for items (what they should sum to after credit)
        const itemsTargetTotal = itemsAmountToCharge; // $13.15

        // Calculate current items subtotal
        const currentItemsTotal = subtotal; // $16.20

        // Calculate the reduction factor for items
        const reductionFactor = itemsTargetTotal / currentItemsTotal; // $13.15 / $16.20 = 0.8117

        // Apply this factor to each item
        const stripeItems = cart.map((item) => {
            const memberPrice = getMemberPrice(item.size.price); // $10.80 or $5.40
            const itemCurrentTotal = memberPrice * item.quantity; // $10.80 or $5.40

            // Calculate new price per unit
            const newItemTotal = itemCurrentTotal * reductionFactor; // $8.77 or $4.38
            const stripePricePerUnit = newItemTotal / item.quantity;

            console.log(`Product: ${item.product.name}`);
            console.log(`  Member price: $${memberPrice.toFixed(2)}`);
            console.log(`  Current total: $${itemCurrentTotal.toFixed(2)}`);
            console.log(`  New total: $${newItemTotal.toFixed(2)}`);
            console.log(`  Stripe price: $${stripePricePerUnit.toFixed(2)}`);

            return {
                ...item,
                memberPrice,
                stripePrice: stripePricePerUnit,
            };
        });

        // Verify totals
        const stripeItemsTotal = stripeItems.reduce((sum, item) => sum + item.stripePrice * item.quantity, 0);
        console.log("=== CREDIT DISTRIBUTION ===");
        console.log(`Subtotal: $${subtotal.toFixed(2)}`);
        console.log(`Shipping: $${shippingCost.toFixed(2)}`);
        console.log(`Total Payable: $${totalPayable.toFixed(2)}`);
        console.log(`Store Credit Used: $${storeCreditUsed.toFixed(2)}`);
        console.log(`Amount to Charge: $${amountToCharge.toFixed(2)}`);
        console.log(`Shipping after credit: $${shippingAfterCredit.toFixed(2)}`);
        console.log(`Items after credit total: $${stripeItemsTotal.toFixed(2)}`);
        console.log(`Final total: $${(stripeItemsTotal + shippingAfterCredit).toFixed(2)}`);
        console.log("===========================");

        return {
            items: stripeItems,
            shippingAmount: shippingAfterCredit,
            totalPayable: amountToCharge,
        };
    };

    // Calculate display total (what user sees)
    const calculateDisplayTotal = () => {
        const totalPayable = calculateTotalPayable();
        const storeCreditUsed = calculateStoreCreditUsed();
        return totalPayable - storeCreditUsed;
    };

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
    const storeCreditUsed = calculateStoreCreditUsed();
    const displayTotal = calculateDisplayTotal();
    const stripeDetails = calculateStripeDetails();

    const handleCheckout = async () => {
        try {
            if (!user) {
                router.push("/auth/login");
                dispatch(closeCart());
                return;
            }

            const storeCreditUsed = calculateStoreCreditUsed();
            const subtotal = calculateSubtotal();
            const originalShippingAmount = calculateShipping();
            const displayTotal = calculateDisplayTotal();

            // Get stripe details with correct distribution
            const { items: stripeItems, shippingAmount: shippingAfterCredit } = calculateStripeDetails();

            // Get items with their regular member prices (for preview)
            const previewItems = cart.map((item) => ({
                productId: item.product.id,
                name: item.product.name,
                size: item.size.mg,
                quantity: item.quantity,
                originalPrice: item.size.price,
                finalPrice: getMemberPrice(item.size.price),
                description: `${item.size.mg}mg ${item.product.name}`,
            }));

            // Get items with their Stripe prices (for actual payment)
            const itemsForApi = stripeItems.map((item) => ({
                productId: item.product.id,
                name: item.product.name,
                description: `${item.size.mg}mg ${item.product.name}`,
                price: item.stripePrice,
                quantity: item.quantity,
                size: item.size.mg.toString(),
            }));

            // Calculate final total (items after credit + shipping after credit)
            const finalTotal = stripeItems.reduce((sum, item) => sum + item.stripePrice * item.quantity, 0) + shippingAfterCredit;

            console.log("===== ORDER PREVIEW DEBUG =====");
            console.log("userId:", user.id);
            console.log("preview items:", previewItems);
            console.log("stripe items:", itemsForApi);
            console.log("subtotal:", subtotal);
            console.log("originalShippingAmount:", originalShippingAmount);
            console.log("shippingAfterCredit:", shippingAfterCredit);
            console.log("finalTotal:", finalTotal);
            console.log("storeCreditUsed:", storeCreditUsed);
            console.log("===============================");

            // Create order preview with member prices
            const previewResult = await createOrderPreview({
                items: previewItems,
                subtotal: subtotal,
                shippingAmount: originalShippingAmount,
                total: finalTotal,
            }).unwrap();

            const previewId = previewResult.data.previewId;

            // Create checkout session with stripe prices and shipping after credit
            const checkoutResult = await createCheckout({
                userId: user.id,
                items: itemsForApi,
                shippingAmount: shippingAfterCredit, // Use shipping after credit (should be 0 in your case)
                subtotal: subtotal,
                storeCreditUsed,
                total: finalTotal,
                metadata: {
                    userId: user.id,
                    originalSubtotal: subtotal.toString(),
                    storeCreditUsed: storeCreditUsed.toString(),
                    orderPreviewId: previewId,
                },
            }).unwrap();

            if (checkoutResult.url) {
                dispatch(clearCart());
                dispatch(closeCart());
                window.location.href = checkoutResult.url;
            }
        } catch (error: any) {
            console.error("Checkout failed:", error);
            alert(`Checkout failed: ${error?.data?.error || error.message}`);
        }
    };

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
                            const memberPrice = getMemberPrice(originalPrice);

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
                                            <div className={`font-bold ${tier.name === "VIP" || tier.name === "Founder" ? "text-yellow-400" : "text-cyan-400"}`}>${memberPrice.toFixed(2)}</div>
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

                        <div className="mb-2 text-sm text-gray-400 flex justify-between">
                            <span>Shipping:</span>
                            <span className={shippingMessage.color}>{shippingMessage.text}</span>
                        </div>

                        {/* Store credit available */}
                        {user?.storeCredit && Number(user.storeCredit) > 0 ? (
                            <div className="mb-2 text-sm text-blue-400 flex justify-between">
                                <span>Store Credit Available:</span>
                                <span>${Number(user.storeCredit).toFixed(2)}</span>
                            </div>
                        ) : null}

                        {/* Store credit applied */}
                        {storeCreditUsed > 0 && (
                            <div className="mb-2 text-sm text-green-400 flex justify-between">
                                <span>Store Credit Applied:</span>
                                <span>-${storeCreditUsed.toFixed(2)}</span>
                            </div>
                        )}

                        <div className="flex justify-between mb-4 text-lg font-bold">
                            <span className="text-white">Total:</span>
                            <span className="text-cyan-400">${displayTotal.toFixed(2)}</span>
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
