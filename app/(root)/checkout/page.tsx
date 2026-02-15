"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { selectCartItems, clearCart } from "@/app/redux/features/cart/cartSlice";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
import { getTier } from "@/app/utils/pricing";
import { useCreateCheckoutSessionMutation } from "@/app/redux/features/payment/paymentApi";
import { useAppDispatch } from "@/app/redux/hooks";
import { currentUser, setRedirectPath } from "@/app/redux/features/auth/authSlice";

const checkoutSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Please enter a valid phone number"),
    address: z.string().min(5, "Please enter a valid address"),
    city: z.string().min(2, "Please enter a valid city"),
    state: z.string().min(2, "Please enter a valid state"),
    zipCode: z.string().min(5, "Please enter a valid ZIP code"),
    country: z.string().min(2, "Please enter a valid country"),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const cart = useSelector(selectCartItems);

    const authUser = useSelector(currentUser);

    useEffect(() => {
        if (!authUser) {
            dispatch(setRedirectPath("/checkout"));
            router.push("/auth/login");
        }
    }, [authUser, dispatch, router]);

    const { data: userData } = useGetMeQuery();
    const user = userData?.data;

    const [createCheckout, { isLoading: isCheckoutLoading }] = useCreateCheckoutSessionMutation();

    const tier = getTier(user?.tier || "Member");

    const [useStoreCredit, setUseStoreCredit] = useState(false);
    const [storeCreditAmount, setStoreCreditAmount] = useState(0);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: user?.email || "",
            phone: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "US",
        },
    });

    // Auto-fill email when user loads
    useEffect(() => {
        if (user?.email) {
            setValue("email", user.email);
        }
    }, [user?.email, setValue]);

    // Redirect if cart is empty
    useEffect(() => {
        if (cart.length === 0) {
            router.push("/");
        }
    }, [cart, router]);

    // Calculate member price
    const getMemberPrice = (price: number) => {
        return (price * (1 - tier.discount / 100)).toFixed(2);
    };

    // Calculate subtotal (original price without store credit)
    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => {
            return sum + parseFloat(getMemberPrice(item.size.price)) * item.quantity;
        }, 0);
    };

    // Calculate shipping cost
    const calculateShipping = () => {
        const subtotal = calculateSubtotal();

        // Founder/VIP: Always free shipping
        if (user?.tier === "Founder" || user?.tier === "VIP") {
            return 0;
        }

        // Member: Check shipping credit first
        if (user?.tier === "Member") {
            // If user has shipping credit
            if (user?.shippingCredit && user.shippingCredit > 0) {
                // Check if shipping credit can cover $6.95
                if (user.shippingCredit >= 6.95) {
                    return 0; // Free from credit
                } else {
                    // Partially covered by credit, pay remaining
                    return 6.95 - user.shippingCredit;
                }
            }

            // No shipping credit: Check if subtotal >= $150
            if (subtotal >= 150) return 0;

            // Otherwise pay full shipping
            return 6.95;
        }

        // Other tiers (not Member, not Founder/VIP): Check subtotal
        return subtotal >= 150 ? 0 : 6.95;
    };

    // Calculate total payable (subtotal + shipping)
    const calculateTotalPayable = () => {
        return calculateSubtotal() + calculateShipping();
    };

    // Get maximum allowed store credit (leaves at least $1 for Stripe) - FIXED
    const getMaxAllowedStoreCredit = () => {
        const totalPayable = calculateTotalPayable();

        // If total is $1 or less, can't use any store credit
        if (totalPayable <= 1) {
            return 0;
        }

        // Maximum credit = total - $1 (minimum Stripe charge)
        const maxCredit = totalPayable - 1;
        return Math.max(0, maxCredit);
    };

    // Auto-set store credit when checkbox is toggled - FIXED
    useEffect(() => {
        if (useStoreCredit && user?.storeCredit && user.storeCredit > 0) {
            const maxCredit = user.storeCredit;
            const maxAllowed = getMaxAllowedStoreCredit();

            // If maxAllowed is 0 or less, don't allow store credit
            if (maxAllowed <= 0) {
                setUseStoreCredit(false);
                setStoreCreditAmount(0);
                return;
            }

            // Use the smaller of available credit or max allowed
            const amountToSet = Math.min(maxCredit, maxAllowed);
            setStoreCreditAmount(amountToSet);
        } else {
            setStoreCreditAmount(0);
        }
    }, [useStoreCredit, user?.storeCredit, cart]); // Added cart dependency

    // Calculate store credit usage - FIXED
    const calculateStoreCreditUsage = () => {
        if (!useStoreCredit || !user?.storeCredit || user.storeCredit <= 0) {
            return 0;
        }

        const maxAllowed = getMaxAllowedStoreCredit();

        // If no store credit can be used, return 0
        if (maxAllowed <= 0) {
            return 0;
        }

        const maxCredit = user.storeCredit;

        // Maximum user can apply is the smaller of their credit or max allowed
        const maxApplicable = Math.min(maxCredit, maxAllowed);

        // Use the amount they selected, but not more than max applicable
        const amountToUse = Math.min(storeCreditAmount, maxApplicable);

        return amountToUse;
    };

    // Calculate store credit distribution per item
    // const calculateAdjustedItems = () => {
    //     const storeCreditUsed = calculateStoreCreditUsage();
    //     const subtotal = calculateSubtotal();
    //     const totalPayable = calculateTotalPayable();

    //     // How much Stripe should charge
    //     const stripeChargeAmount = totalPayable - storeCreditUsed;

    //     return cart.map((item) => {
    //         const originalPrice = parseFloat(getMemberPrice(item.size.price));
    //         const itemTotal = originalPrice * item.quantity;
    //         const itemProportion = subtotal > 0 ? itemTotal / subtotal : 1 / cart.length;

    //         // Calculate how much of the Stripe charge applies to this item
    //         const stripeChargeForItem = stripeChargeAmount * itemProportion;

    //         // Calculate adjusted price per unit (minimum $0.01)
    //         const adjustedPricePerUnit = Math.max(0.01, stripeChargeForItem / item.quantity);

    //         // Calculate how much store credit was used for this item
    //         const storeCreditForItem = Math.max(0, itemTotal - stripeChargeForItem);

    //         return {
    //             productId: item.product.id,
    //             name: item.product.name,
    //             description: `${item.size.mg}mg ${item.product.name}`,
    //             price: adjustedPricePerUnit,
    //             originalPrice: originalPrice,
    //             storeCreditApplied: storeCreditForItem,
    //             quantity: item.quantity,
    //             size: `${item.size.mg}mg`,
    //         };
    //     });
    // };

    // Calculate store credit distribution per item
    const calculateAdjustedItems = () => {
        const storeCreditUsed = calculateStoreCreditUsage();
        const subtotal = calculateSubtotal();
        const totalPayable = calculateTotalPayable();

        // How much Stripe should charge
        const stripeChargeAmount = totalPayable - storeCreditUsed;

        return cart.map((item) => {
            const originalPrice = parseFloat(getMemberPrice(item.size.price));
            const itemTotal = originalPrice * item.quantity;
            const itemProportion = subtotal > 0 ? itemTotal / subtotal : 1 / cart.length;

            // Calculate how much of the Stripe charge applies to this item
            const stripeChargeForItem = stripeChargeAmount * itemProportion;

            // Calculate adjusted price per unit (minimum $0.01)
            const adjustedPricePerUnit = Math.max(0.01, stripeChargeForItem / item.quantity);

            // Calculate how much store credit was used for this item
            const storeCreditForItem = Math.max(0, itemTotal - stripeChargeForItem);

            return {
                productId: item.product.id,
                name: item.product.name,
                description: `${item.size.mg}mg ${item.product.name}`,
                price: adjustedPricePerUnit,
                originalPrice: originalPrice,
                storeCreditApplied: storeCreditForItem,
                quantity: item.quantity,
                size: item.size.mg, // Keep as number
            };
        });
    };

    // Calculate adjusted shipping after store credit
    const calculateAdjustedShipping = () => {
        const shipping = calculateShipping();
        const storeCreditUsed = calculateStoreCreditUsage();
        const subtotal = calculateSubtotal();

        // If store credit covers shipping (after covering products)
        if (storeCreditUsed > subtotal) {
            const creditForShipping = storeCreditUsed - subtotal;
            return Math.max(0, shipping - creditForShipping);
        }

        return shipping;
    };

    // Calculate the actual amount to charge in Stripe
    const calculateStripeTotal = () => {
        const adjustedItems = calculateAdjustedItems();
        const adjustedShipping = calculateAdjustedShipping();

        const itemsTotal = adjustedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const stripeTotal = itemsTotal + adjustedShipping;

        return stripeTotal;
    };

    // Calculate display total (what user sees on our site)
    const calculateDisplayTotal = () => {
        const totalPayable = calculateTotalPayable();
        const storeCreditUsed = calculateStoreCreditUsage();

        const displayTotal = totalPayable - storeCreditUsed;

        // Ensure at least $1.00 is displayed
        return Math.max(1.0, displayTotal);
    };

    // Get the amount user will actually pay (for button)
    const getUserPaysAmount = () => {
        return calculateDisplayTotal();
    };

    // Check if user can use store credit
    const canUseStoreCredit = () => {
        if (!user?.storeCredit || user.storeCredit <= 0) {
            return false;
        }
        const totalPayable = calculateTotalPayable();
        return totalPayable > 1; // Can only use store credit if total is more than $1
    };

    // Submit handler
    const onSubmit = async (data: CheckoutFormData) => {
        try {
            // Calculate adjusted prices with store credit distributed
            const adjustedItems = calculateAdjustedItems();

            // Transform items to match API expected type
            const itemsForApi = adjustedItems.map((item) => ({
                productId: item.productId,
                name: item.name,
                description: item.description,
                price: item.price,
                quantity: item.quantity,
                size: item.size.toString(),
            }));

            const subtotal = itemsForApi.reduce((sum, item) => sum + item.price * item.quantity, 0);
            const shippingAmount = calculateAdjustedShipping();
            const storeCreditUsed = calculateStoreCreditUsage();

            // Total to charge in Stripe
            const stripeTotal = subtotal + shippingAmount;

            const shippingInfo = {
                name: `${data.firstName} ${data.lastName}`,
                email: data.email,
                phone: data.phone,
                address: data.address,
                city: data.city,
                state: data.state,
                zip: data.zipCode,
                country: data.country,
            };

            const result = await createCheckout({
                userId: user?.id || "guest",
                items: itemsForApi,
                shippingInfo,
                shippingAmount,
                subtotal: calculateSubtotal(),
                storeCreditUsed,
                total: stripeTotal,
                metadata: {
                    userId: user?.id || "guest",
                    originalSubtotal: calculateSubtotal(),
                    storeCreditUsed,
                    // Send detailed item info including sizes
                    itemDetails: JSON.stringify(
                        adjustedItems.map((item) => ({
                            productId: item.productId,
                            originalPrice: item.originalPrice,
                            quantity: item.quantity,
                            name: item.name,
                            size: item.size,
                            storeCreditApplied: item.storeCreditApplied,
                            finalPrice: item.price,
                        })),
                    ),
                },
            }).unwrap();

            if (result.url) {
                dispatch(clearCart());
                window.location.href = result.url;
            }
        } catch (error: any) {
            console.error("Checkout failed:", error);
            alert(`Checkout failed: ${error?.data?.error || error.message}`);
        }
    };

    // Get shipping message
    const getShippingMessage = () => {
        const shippingCost = calculateShipping();

        if (shippingCost === 0) {
            if (user?.tier === "Founder" || user?.tier === "VIP") {
                return { text: `Free (${user.tier})`, className: "text-green-400" };
            }
            if (user?.tier === "Member" && user?.shippingCredit && user.shippingCredit >= 6.95) {
                return { text: "Free (Credit Applied)", className: "text-green-400" };
            }
            if (calculateSubtotal() >= 150) {
                return { text: "Free (Order ≥ $150)", className: "text-green-400" };
            }
            return { text: "Free", className: "text-green-400" };
        }

        // Check if partially paid by credit
        if (user?.tier === "Member" && user?.shippingCredit && user.shippingCredit > 0 && user.shippingCredit < 6.95) {
            return {
                text: `$${shippingCost.toFixed(2)} ($${user.shippingCredit.toFixed(2)} credit applied)`,
                className: "text-yellow-400",
            };
        }

        return { text: `$${shippingCost.toFixed(2)}`, className: "text-yellow-400" };
    };

    const shippingMessage = getShippingMessage();
    const totalPayable = calculateTotalPayable();
    const storeCreditUsed = calculateStoreCreditUsage();
    const displayTotal = calculateDisplayTotal();
    const maxAllowedCredit = getMaxAllowedStoreCredit();

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* LEFT COLUMN - Order Summary */}
                    <div>
                        <div className="bg-slate-800 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                            {cart.map((item) => {
                                const discountedPrice = getMemberPrice(item.size.price);
                                return (
                                    <div key={`${item.product.id}-${item.size.mg}`} className="flex justify-between items-center py-3 border-b border-slate-700">
                                        <div>
                                            <h3 className="font-semibold">{item.product.name}</h3>
                                            <p className="text-sm text-gray-400">
                                                {item.size.mg}mg × {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400 line-through">${item.size.price.toFixed(2)}</p>
                                            <p className="text-cyan-400">${discountedPrice}</p>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="mt-6 space-y-3">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${calculateSubtotal().toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className={shippingMessage.className}>{shippingMessage.text}</span>
                                </div>

                                {/* STORE CREDIT SECTION - FIXED */}
                                {user?.storeCredit && user.storeCredit > 0 && canUseStoreCredit() && (
                                    <div className="border-t border-slate-700 pt-3">
                                        <label className="flex items-center justify-between cursor-pointer">
                                            <div className="flex items-center space-x-2 gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={useStoreCredit}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setUseStoreCredit(checked);
                                                        if (checked) {
                                                            // Auto-use max allowed credit
                                                            const maxCredit = user.storeCredit;
                                                            const maxAllowed = maxAllowedCredit;
                                                            const amountToSet = Math.min(maxCredit, maxAllowed);
                                                            setStoreCreditAmount(amountToSet);
                                                        } else {
                                                            setStoreCreditAmount(0);
                                                        }
                                                    }}
                                                    disabled={maxAllowedCredit <= 0}
                                                    className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 disabled:opacity-50"
                                                />
                                                <span className="font-medium">Apply Store Credit</span>
                                            </div>
                                            <span className="text-blue-400">${user.storeCredit.toFixed(2)}</span>
                                        </label>

                                        {useStoreCredit && (
                                            <div className="mt-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-gray-400">Credit applied:</span>
                                                    <span className="text-green-400 text-lg font-bold">-${storeCreditUsed.toFixed(2)}</span>
                                                </div>

                                                {/* Informational text */}
                                                <div className="text-xs text-gray-500 mt-1 mb-2">{maxAllowedCredit > 0 ? `Maximum $${maxAllowedCredit.toFixed(2)} can be applied (minimum $1.00 card payment required)` : "Cannot apply store credit (order total must be more than $1.00)"}</div>

                                                {/* Slider for adjusting amount - FIXED */}
                                                {maxAllowedCredit > 0 && (
                                                    <div className="mt-3">
                                                        <input type="range" min="0" max={maxAllowedCredit.toFixed(2)} step="0.01" value={storeCreditAmount} onChange={(e) => setStoreCreditAmount(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                                            <span>$0</span>
                                                            <span>${maxAllowedCredit.toFixed(2)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Show message if user has store credit but can't use it */}
                                {user?.storeCredit && user.storeCredit > 0 && !canUseStoreCredit() && (
                                    <div className="border-t border-slate-700 pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-400">Store Credit Available:</span>
                                            <span className="text-blue-400">${user.storeCredit.toFixed(2)}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">Cannot apply store credit (order total must be more than $1.00)</div>
                                    </div>
                                )}

                                <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-700">
                                    <span>Total</span>
                                    <span className="text-cyan-400">${displayTotal.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tier Info */}
                        <div className="bg-slate-800 rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-4">Your Benefits</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Tier:</span>
                                    <span className="text-cyan-400">{tier.name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Discount:</span>
                                    <span className="text-green-400">{tier.discount}% OFF</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Shipping:</span>
                                    <span className={tier.freeShipping ? "text-green-400" : "text-yellow-400"}>{tier.freeShipping ? "Free Shipping" : "Free over $150"}</span>
                                </div>
                                {user?.tier === "Member" && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Shipping Credit:</span>
                                        <span className="text-blue-400">${(user?.shippingCredit || 0).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Store Credit:</span>
                                    <span className="text-blue-400">${(user?.storeCredit || 0).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Shipping Form */}
                    <div>
                        <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800 rounded-lg p-6">
                            <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">First Name</label>
                                    <input type="text" {...register("firstName")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
                                    {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Last Name</label>
                                    <input type="text" {...register("lastName")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
                                    {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-gray-400 mb-2">Email</label>
                                <input type="email" {...register("email")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
                                {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-gray-400 mb-2">Phone</label>
                                <input type="tel" {...register("phone")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
                                {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm text-gray-400 mb-2">Address</label>
                                <input type="text" {...register("address")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
                                {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address.message}</p>}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">City</label>
                                    <input type="text" {...register("city")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
                                    {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city.message}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">State</label>
                                    <input type="text" {...register("state")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
                                    {errors.state && <p className="mt-1 text-sm text-red-400">{errors.state.message}</p>}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-8">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">ZIP Code</label>
                                    <input type="text" {...register("zipCode")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
                                    {errors.zipCode && <p className="mt-1 text-sm text-red-400">{errors.zipCode.message}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Country</label>
                                    <select {...register("country")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none">
                                        <option value="US">United States</option>
                                        <option value="CA">Canada</option>
                                        <option value="GB">United Kingdom</option>
                                        <option value="AU">Australia</option>
                                        <option value="DE">Germany</option>
                                        <option value="FR">France</option>
                                        <option value="IT">Italy</option>
                                        <option value="ES">Spain</option>
                                        <option value="JP">Japan</option>
                                        <option value="CN">China</option>
                                        <option value="IN">India</option>
                                        <option value="BR">Brazil</option>
                                        <option value="MX">Mexico</option>
                                        <option value="KR">South Korea</option>
                                        <option value="RU">Russia</option>
                                        <option value="ZA">South Africa</option>
                                    </select>
                                    {errors.country && <p className="mt-1 text-sm text-red-400">{errors.country.message}</p>}
                                </div>
                            </div>

                            <button type="submit" disabled={isCheckoutLoading} className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                {isCheckoutLoading ? "Processing..." : `Pay $${getUserPaysAmount().toFixed(2)}`}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">By completing your order, you agree to our Terms of Service</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
