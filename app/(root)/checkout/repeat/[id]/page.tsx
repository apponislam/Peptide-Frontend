"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
import { getTier } from "@/app/utils/pricing";
import { useCreateCheckoutSessionMutation } from "@/app/redux/features/payment/paymentApi";
import { useGetOrderQuery } from "@/app/redux/features/order/orderApi";

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

export default function RepeatOrderPage() {
    const router = useRouter();
    const params = useParams();

    const orderId = params.id as string;
    const { data: orderData, isLoading: isOrderLoading } = useGetOrderQuery(orderId);
    const order = orderData?.data;

    const { data: userData } = useGetMeQuery();
    console.log(userData);
    const user = userData?.data;

    const [createCheckout, { isLoading: isCheckoutLoading }] = useCreateCheckoutSessionMutation();

    const tier = getTier(user?.tier || "Member");

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
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

    // Pre-fill form with order shipping info
    useEffect(() => {
        if (order) {
            reset({
                firstName: order.name?.split(" ")[0] || "",
                lastName: order.name?.split(" ").slice(1).join(" ") || "",
                email: order.email || user?.email || "",
                phone: order.phone || "",
                address: order.address || "",
                city: order.city || "",
                state: order.state || "",
                zipCode: order.zip || "",
                country: order.country || "US",
            });
        }
    }, [order, user?.email, reset]);

    useEffect(() => {
        if (user?.email) {
            setValue("email", user.email);
        }
    }, [user?.email, setValue]);

    const getMemberPrice = (price: number) => {
        return (price * (1 - tier.discount / 100)).toFixed(2);
    };

    const calculateSubtotal = () => {
        if (!order?.items) return 0;

        return order.items.reduce((sum: number, item: any) => {
            const itemPrice = item.discountedPrice || item.unitPrice || 0;
            return sum + parseFloat(getMemberPrice(itemPrice)) * (item.quantity || 1);
        }, 0);
    };

    const calculateShipping = () => {
        const subtotal = calculateSubtotal();

        // Founder/VIP: Always free shipping
        if (user?.tier === "Founder" || user?.tier === "VIP") {
            return 0;
        }

        // Member: Check shipping credit first
        if (user?.tier === "Member") {
            if (user?.shippingCredit && user.shippingCredit > 0) {
                if (user.shippingCredit >= 6.95) {
                    return 0;
                } else {
                    return 6.95 - user.shippingCredit;
                }
            }

            if (subtotal >= 150) return 0;
            return 6.95;
        }

        return subtotal >= 150 ? 0 : 6.95;
    };

    const calculateTotal = () => {
        return calculateSubtotal() + calculateShipping();
    };

    const getShippingMessage = () => {
        const shippingCost = calculateShipping();
        const subtotal = calculateSubtotal();

        if (shippingCost === 0) {
            if (user?.tier === "Founder" || user?.tier === "VIP") {
                return { text: "Free (Premium Tier)", className: "text-green-400" };
            }
            if (user?.tier === "Member" && user?.shippingCredit && user.shippingCredit >= 6.95) {
                return { text: "Free (Credit Applied)", className: "text-green-400" };
            }
            if (subtotal >= 150) {
                return { text: "Free (Order ≥ $150)", className: "text-green-400" };
            }
            return { text: "Free", className: "text-green-400" };
        }

        if (user?.tier === "Member" && user?.shippingCredit && user.shippingCredit > 0 && user.shippingCredit < 6.95) {
            return {
                text: `$${shippingCost.toFixed(2)} ($${user.shippingCredit.toFixed(2)} credit applied)`,
                className: "text-yellow-400",
            };
        }

        return { text: `$${shippingCost.toFixed(2)}`, className: "text-yellow-400" };
    };

    const onSubmit = async (data: CheckoutFormData) => {
        try {
            if (!order?.items) {
                alert("No items to order");
                return;
            }

            const items = order.items.map((item: any) => ({
                productId: item.product?.id || 0,
                name: item.product?.name || "Product",
                description: `${item.product?.name || "Product"}`,
                price: parseFloat(getMemberPrice(item.discountedPrice || item.unitPrice || 0)),
                quantity: item.quantity || 1,
                size: "0mg", // You need to determine how to get this
            }));

            const shippingAmount = calculateShipping();
            const subtotal = calculateSubtotal();
            const total = subtotal + shippingAmount;

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
                items,
                shippingInfo,
                shippingAmount,
                subtotal,
                total,
                metadata: {
                    userId: user?.id || "guest",
                    userTier: tier.name,
                    userShippingCredit: user?.shippingCredit || 0,
                    repeatOrderId: orderId,
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

    const shippingMessage = getShippingMessage();

    if (isOrderLoading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
                <div className="container mx-auto max-w-6xl">
                    <h1 className="text-3xl font-bold mb-8">Repeat Order</h1>
                    <div className="text-center py-20">Loading order details...</div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
                <div className="container mx-auto max-w-6xl">
                    <h1 className="text-3xl font-bold mb-8">Repeat Order</h1>
                    <div className="text-center py-20 text-red-400">Order not found or you don't have permission to view it.</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
            <div className="container mx-auto max-w-6xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Repeat Order</h1>
                    <p className="text-gray-400">
                        Reordering: #{order.id?.slice(-8)} from {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    <div>
                        <div className="bg-slate-800 rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold mb-4">Repeat Order Summary</h2>

                            {order.items &&
                                order.items.map((item: any, index: number) => {
                                    const discountedPrice = getMemberPrice(item.discountedPrice || item.unitPrice || 0);
                                    return (
                                        <div key={index} className="flex justify-between items-center py-3 border-b border-slate-700">
                                            <div>
                                                <h3 className="font-semibold">{item.product?.name || "Product"}</h3>
                                                <p className="text-sm text-gray-400">Quantity: {item.quantity || 1}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm text-gray-400 line-through">${(item.unitPrice || 0).toFixed(2)}</p>
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
                                <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-700">
                                    <span>Total</span>
                                    <span className="text-cyan-400">${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

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
                            </div>
                        </div>
                    </div>

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
                                {isCheckoutLoading ? "Processing..." : `Repeat Order - Pay $${calculateTotal().toFixed(2)}`}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">By completing your order, you agree to our Terms of Service</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
