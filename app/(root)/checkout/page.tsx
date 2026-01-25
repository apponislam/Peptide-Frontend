// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { selectCartItems } from "@/app/redux/features/cart/cartSlice";
// import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
// import { getTier } from "@/app/utils/pricing";

// // Zod schema for form validation
// const checkoutSchema = z.object({
//     firstName: z.string().min(2, "First name must be at least 2 characters"),
//     lastName: z.string().min(2, "Last name must be at least 2 characters"),
//     email: z.string().email("Please enter a valid email address"),
//     phone: z.string().min(10, "Please enter a valid phone number"),
//     address: z.string().min(5, "Please enter a valid address"),
//     city: z.string().min(2, "Please enter a valid city"),
//     state: z.string().min(2, "Please enter a valid state"),
//     zipCode: z.string().min(5, "Please enter a valid ZIP code"),
//     country: z.string().min(2, "Please enter a valid country"),
// });

// type CheckoutFormData = z.infer<typeof checkoutSchema>;

// export default function CheckoutPage() {
//     const router = useRouter();
//     const cart = useSelector(selectCartItems);
//     const { data: userData } = useGetMeQuery();
//     const user = userData?.data;

//     const tier = getTier(user?.tier || "Member");

//     // Initialize React Hook Form with Zod validation
//     const {
//         register,
//         handleSubmit,
//         formState: { errors, isSubmitting },
//         setValue,
//     } = useForm<CheckoutFormData>({
//         resolver: zodResolver(checkoutSchema),
//         defaultValues: {
//             firstName: "",
//             lastName: "",
//             email: user?.email || "",
//             phone: "",
//             address: "",
//             city: "",
//             state: "",
//             zipCode: "",
//             country: "",
//         },
//     });

//     // Pre-fill user email if available
//     useEffect(() => {
//         if (user?.email) {
//             setValue("email", user.email);
//         }
//     }, [user?.email, setValue]);

//     // Redirect if cart is empty
//     useEffect(() => {
//         if (cart.length === 0) {
//             router.push("/");
//         }
//     }, [cart, router]);

//     const getMemberPrice = (price: number) => {
//         return (price * (1 - tier.discount / 100)).toFixed(2);
//     };

//     const calculateSubtotal = () => {
//         return cart.reduce((sum, item) => {
//             return sum + parseFloat(getMemberPrice(item.size.price)) * item.quantity;
//         }, 0);
//     };

//     const calculateShipping = () => {
//         if (tier.freeShipping) return 0;
//         const subtotal = calculateSubtotal();
//         return subtotal >= 150 ? 0 : 6.95;
//     };

//     const calculateTotal = () => {
//         return calculateSubtotal() + calculateShipping();
//     };

//     const onSubmit = async (data: CheckoutFormData) => {
//         const orderData = {
//             customer: {
//                 firstName: data.firstName,
//                 lastName: data.lastName,
//                 email: data.email,
//                 phone: data.phone,
//             },

//             // Shipping Address from validated form
//             shippingAddress: {
//                 street: data.address,
//                 city: data.city,
//                 state: data.state,
//                 zipCode: data.zipCode,
//                 country: data.country,
//             },

//             items: cart.map((item) => ({
//                 productId: item.product.id,
//                 productName: item.product.name,
//                 sizeMg: item.size.mg,
//                 quantity: item.quantity,
//                 unitPrice: parseFloat(item.size.price.toFixed(2)),
//             })),

//             // Pricing Summary
//             pricing: {
//                 subtotal: parseFloat(calculateSubtotal().toFixed(2)),
//                 shipping: parseFloat(calculateShipping().toFixed(2)),
//                 total: parseFloat(calculateTotal().toFixed(2)),
//                 discountPercentage: tier.discount,
//                 discountAmount: parseFloat(cart.reduce((sum, item) => sum + item.size.price * (tier.discount / 100) * item.quantity, 0).toFixed(2)),
//             },

//             // Shipping Info
//             shipping: {
//                 cost: parseFloat(calculateShipping().toFixed(2)),
//                 freeShipping: tier.freeShipping,
//             },

//             // User/Tier Info
//             metadata: {
//                 userId: user?.id || "guest",
//                 userTier: tier.name,
//                 userEmail: user?.email || data.email,
//             },

//             // Order Details
//             orderNumber: `PC-${Date.now()}`,
//             orderDate: new Date().toISOString(),
//             paymentMethod: "stripe",
//         };

//         console.log("Validated order data for Stripe:", orderData);

//         alert(`Order submitted successfully!\nThis would redirect to Stripe Checkout in production.\n\nTotal: $${calculateTotal().toFixed(2)}`);
//     };

//     if (cart.length === 0) {
//         return (
//             <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
//                 <div className="text-center">
//                     <h1 className="text-2xl text-white mb-4">Your cart is empty</h1>
//                     <button onClick={() => router.push("/")} className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600">
//                         Continue Shopping
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
//             <div className="container mx-auto max-w-6xl">
//                 <h1 className="text-3xl font-bold mb-8">Checkout</h1>

//                 <div className="grid md:grid-cols-2 gap-8">
//                     {/* Left Column - Order Summary */}
//                     <div>
//                         <div className="bg-slate-800 rounded-lg p-6 mb-6">
//                             <h2 className="text-xl font-bold mb-4">Order Summary</h2>

//                             {cart.map((item) => {
//                                 const discountedPrice = getMemberPrice(item.size.price);
//                                 return (
//                                     <div key={`${item.product.id}-${item.size.mg}`} className="flex justify-between items-center py-3 border-b border-slate-700">
//                                         <div>
//                                             <h3 className="font-semibold">{item.product.name}</h3>
//                                             <p className="text-sm text-gray-400">
//                                                 {item.size.mg}mg × {item.quantity}
//                                             </p>
//                                         </div>
//                                         <div className="text-right">
//                                             <p className="text-sm text-gray-400 line-through">${item.size.price.toFixed(2)}</p>
//                                             <p className="text-cyan-400">${discountedPrice}</p>
//                                         </div>
//                                     </div>
//                                 );
//                             })}

//                             <div className="mt-6 space-y-3">
//                                 <div className="flex justify-between">
//                                     <span>Subtotal</span>
//                                     <span>${calculateSubtotal().toFixed(2)}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span>Shipping</span>
//                                     <span>{calculateShipping() === 0 ? <span className="text-green-400">Free</span> : `$${calculateShipping().toFixed(2)}`}</span>
//                                 </div>
//                                 <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-700">
//                                     <span>Total</span>
//                                     <span className="text-cyan-400">${calculateTotal().toFixed(2)}</span>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Tier Info */}
//                         <div className="bg-slate-800 rounded-lg p-6">
//                             <h2 className="text-xl font-bold mb-4">Your Benefits</h2>
//                             <div className="space-y-2">
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-400">Tier:</span>
//                                     <span className="text-cyan-400">{tier.name}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-400">Discount:</span>
//                                     <span className="text-green-400">{tier.discount}% OFF</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-400">Shipping:</span>
//                                     <span className={tier.freeShipping ? "text-green-400" : "text-yellow-400"}>{tier.freeShipping ? "Free Shipping" : "Free over $150"}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Right Column - Checkout Form with React Hook Form */}
//                     <div>
//                         <form onSubmit={handleSubmit(onSubmit)} className="bg-slate-800 rounded-lg p-6">
//                             <h2 className="text-xl font-bold mb-6">Shipping Information</h2>

//                             <div className="grid md:grid-cols-2 gap-4 mb-4">
//                                 <div>
//                                     <label className="block text-sm text-gray-400 mb-2">First Name</label>
//                                     <input type="text" {...register("firstName")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
//                                     {errors.firstName && <p className="mt-1 text-sm text-red-400">{errors.firstName.message}</p>}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm text-gray-400 mb-2">Last Name</label>
//                                     <input type="text" {...register("lastName")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
//                                     {errors.lastName && <p className="mt-1 text-sm text-red-400">{errors.lastName.message}</p>}
//                                 </div>
//                             </div>

//                             <div className="mb-4">
//                                 <label className="block text-sm text-gray-400 mb-2">Email</label>
//                                 <input type="email" {...register("email")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
//                                 {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>}
//                             </div>

//                             <div className="mb-4">
//                                 <label className="block text-sm text-gray-400 mb-2">Phone</label>
//                                 <input type="tel" {...register("phone")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
//                                 {errors.phone && <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>}
//                             </div>

//                             <div className="mb-4">
//                                 <label className="block text-sm text-gray-400 mb-2">Address</label>
//                                 <input type="text" {...register("address")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
//                                 {errors.address && <p className="mt-1 text-sm text-red-400">{errors.address.message}</p>}
//                             </div>

//                             <div className="grid md:grid-cols-2 gap-4 mb-4">
//                                 <div>
//                                     <label className="block text-sm text-gray-400 mb-2">City</label>
//                                     <input type="text" {...register("city")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
//                                     {errors.city && <p className="mt-1 text-sm text-red-400">{errors.city.message}</p>}
//                                 </div>
//                                 <div>
//                                     <label className="block text-sm text-gray-400 mb-2">State</label>
//                                     <input type="text" {...register("state")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
//                                     {errors.state && <p className="mt-1 text-sm text-red-400">{errors.state.message}</p>}
//                                 </div>
//                             </div>

//                             <div className="grid md:grid-cols-2 gap-4 mb-8">
//                                 <div>
//                                     <label className="block text-sm text-gray-400 mb-2">ZIP Code</label>
//                                     <input type="text" {...register("zipCode")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
//                                     {errors.zipCode && <p className="mt-1 text-sm text-red-400">{errors.zipCode.message}</p>}
//                                 </div>

//                                 <div>
//                                     <label className="block text-sm text-gray-400 mb-2">Country</label>
//                                     <input type="text" {...register("country")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
//                                     {errors.country && <p className="mt-1 text-sm text-red-400">{errors.country.message}</p>}
//                                 </div>
//                             </div>

//                             {/* Submit Button */}
//                             <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
//                                 {isSubmitting ? "Processing..." : `Pay with Stripe - $${calculateTotal().toFixed(2)}`}
//                             </button>

//                             <p className="text-xs text-gray-500 text-center mt-4">By completing your order, you agree to our Terms of Service</p>
//                         </form>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import { useEffect } from "react";
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

// Zod schema - KEEP YOUR EXACT SCHEMA
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
    const { data: userData } = useGetMeQuery();
    const user = userData?.data;

    // Stripe checkout mutation
    const [createCheckout, { isLoading: isCheckoutLoading }] = useCreateCheckoutSessionMutation();

    const tier = getTier(user?.tier || "Member");

    // KEEP YOUR EXACT FORM SETUP
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
            country: "",
        },
    });

    // KEEP YOUR EXACT USE EFFECTS
    useEffect(() => {
        if (user?.email) {
            setValue("email", user.email);
        }
    }, [user?.email, setValue]);

    useEffect(() => {
        if (cart.length === 0) {
            router.push("/");
        }
    }, [cart, router]);

    // KEEP YOUR EXACT PRICING FUNCTIONS
    const getMemberPrice = (price: number) => {
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

    // ONLY CHANGE THE onSubmit HANDLER:
    const onSubmit = async (data: CheckoutFormData) => {
        try {
            // Prepare items for Stripe
            const items = cart.map((item) => ({
                productId: item.product.id,
                name: item.product.name,
                description: `${item.size.mg}mg ${item.product.name}`,
                price: parseFloat(getMemberPrice(item.size.price)), // Use your discounted price
                quantity: item.quantity,
                size: `${item.size.mg}mg`,
            }));

            // Prepare shipping info
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

            // Call Stripe API
            const result = await createCheckout({
                userId: user?.id || "guest",
                items,
                shippingInfo,
                metadata: {
                    userId: user?.id || "guest",
                    userTier: tier.name,
                },
            }).unwrap();

            // Redirect to Stripe
            if (result.url) {
                dispatch(clearCart()); // Clear cart
                window.location.href = result.url;
            }
        } catch (error: any) {
            console.error("Checkout failed:", error);
            alert(`Checkout failed: ${error?.data?.error || error.message}`);
        }
    };

    // KEEP YOUR EXACT JSX DESIGN - ONLY CHANGE BUTTON TEXT:
    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* LEFT COLUMN - KEEP EXACTLY */}
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
                                    <span>{calculateShipping() === 0 ? <span className="text-green-400">Free</span> : `$${calculateShipping().toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-700">
                                    <span>Total</span>
                                    <span className="text-cyan-400">${calculateTotal().toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Tier Info - KEEP EXACT */}
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
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - KEEP EXACT FORM */}
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
                                    <input type="text" {...register("country")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none" />
                                    {errors.country && <p className="mt-1 text-sm text-red-400">{errors.country.message}</p>}
                                </div>
                            </div>

                            {/* ONLY CHANGE BUTTON TEXT */}
                            <button type="submit" disabled={isCheckoutLoading} className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                {isCheckoutLoading ? "Processing..." : `Pay with Stripe - $${calculateTotal().toFixed(2)}`}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">By completing your order, you agree to our Terms of Service</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
