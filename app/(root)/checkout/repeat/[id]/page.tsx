// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { z } from "zod";
// import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
// import { getTier } from "@/app/utils/pricing";
// import { useCreateCheckoutSessionMutation } from "@/app/redux/features/payment/paymentApi";
// import { useGetOrderQuery } from "@/app/redux/features/order/orderApi";
// import { useGetProductsByIdsMutation } from "@/app/redux/features/products/productsApi"; // Add this
// import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
// import { currentUser, setRedirectPath } from "@/app/redux/features/auth/authSlice";

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

// export default function RepeatOrderPage() {
//     const router = useRouter();
//     const params = useParams();
//     const dispatch = useAppDispatch();

//     const authUser = useAppSelector(currentUser);

//     const orderId = params.id as string;

//     useEffect(() => {
//         if (!authUser) {
//             dispatch(setRedirectPath(`/checkout/repeat/${orderId}`));
//             router.push("/auth/login");
//         }
//     }, [authUser, dispatch, router, orderId]);

//     const { data: orderData, isLoading: isOrderLoading } = useGetOrderQuery(orderId);
//     const order = orderData?.data;

//     const { data: userData } = useGetMeQuery();
//     const user = userData?.data;

//     const [getProductsByIds] = useGetProductsByIdsMutation();

//     const [validatedItems, setValidatedItems] = useState<any[]>([]);
//     const [validationErrors, setValidationErrors] = useState<string[]>([]);
//     const [isValidating, setIsValidating] = useState(false);

//     const [createCheckout, { isLoading: isCheckoutLoading }] = useCreateCheckoutSessionMutation();

//     const tier = getTier(user?.tier || "Member");

//     const [useStoreCredit, setUseStoreCredit] = useState(false);
//     const [storeCreditAmount, setStoreCreditAmount] = useState(0);

//     const {
//         register,
//         handleSubmit,
//         formState: { errors },
//         setValue,
//         reset,
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
//             country: "US",
//         },
//     });

//     // Validate products when order loads
//     useEffect(() => {
//         const validateProducts = async () => {
//             if (!order?.items || isValidating || validatedItems.length > 0 || validationErrors.length > 0) {
//                 return;
//             }

//             setIsValidating(true);

//             try {
//                 // Get unique product IDs from order items
//                 const productIds = [...new Set(order.items.map((item: any) => item.product?.id).filter(Boolean))] as number[];

//                 // Or use type assertion when calling the API
//                 const result = await getProductsByIds(productIds as number[]).unwrap();
//                 const products = result.data || [];

//                 // Create a map for easy lookup
//                 const productMap = new Map();
//                 products.forEach((product: any) => {
//                     productMap.set(product.id, product);
//                 });

//                 const validated: any[] = [];
//                 const errors: string[] = [];

//                 // Validate each order item
//                 for (const item of order.items) {
//                     const productId = item.product?.id;
//                     const currentProduct = productMap.get(productId);

//                     if (!currentProduct) {
//                         errors.push(`Product "${item.product?.name || "Unknown"}" is no longer available`);
//                         continue;
//                     }

//                     const size = item.size;
//                     const currentSize = currentProduct.sizes?.find((s: any) => s.mg === size);

//                     if (!currentSize) {
//                         errors.push(`Size ${size || "?"}mg for "${item.product?.name}" is no longer available`);
//                         continue;
//                     }

//                     if (currentSize.quantity <= 0) {
//                         errors.push(`Size ${size}mg for "${item.product?.name}" is out of stock`);
//                         continue;
//                     }

//                     if (currentSize.quantity < (item.quantity || 1)) {
//                         errors.push(`Only ${currentSize.quantity} available for "${item.product?.name}" ${size}mg (you need ${item.quantity || 1})`);
//                         continue;
//                     }

//                     validated.push({
//                         ...item,
//                         currentProduct,
//                         currentSize,
//                         price: item.discountedPrice || item.unitPrice,
//                         originalPrice: currentSize.price,
//                     });
//                 }

//                 setValidatedItems(validated);
//                 setValidationErrors(errors);
//             } catch (error) {
//                 console.error("Error validating products:", error);
//                 setValidationErrors(["Failed to validate products. Please try again."]);
//             } finally {
//                 setIsValidating(false);
//             }
//         };

//         validateProducts();
//     }, [order, getProductsByIds, isValidating, validatedItems.length, validationErrors.length]);

//     // Rest of your component remains the same...
//     // (all the calculation functions and JSX from before)

//     // Pre-fill form with order shipping info
//     useEffect(() => {
//         if (order) {
//             reset({
//                 firstName: order.name?.split(" ")[0] || "",
//                 lastName: order.name?.split(" ").slice(1).join(" ") || "",
//                 email: order.email || user?.email || "",
//                 phone: order.phone || "",
//                 address: order.address || "",
//                 city: order.city || "",
//                 state: order.state || "",
//                 zipCode: order.zip || "",
//                 country: order.country || "US",
//             });
//         }
//     }, [order, user?.email, reset]);

//     useEffect(() => {
//         if (user?.email) {
//             setValue("email", user.email);
//         }
//     }, [user?.email, setValue]);

//     // Auto-set store credit when checkbox is toggled
//     useEffect(() => {
//         if (useStoreCredit && user?.storeCredit && user.storeCredit > 0) {
//             const maxCredit = user.storeCredit;
//             const maxAllowed = getMaxAllowedStoreCredit();

//             if (maxAllowed <= 0) {
//                 setUseStoreCredit(false);
//                 setStoreCreditAmount(0);
//                 return;
//             }

//             const amountToSet = Math.min(maxCredit, maxAllowed);
//             setStoreCreditAmount(amountToSet);
//         } else {
//             setStoreCreditAmount(0);
//         }
//     }, [useStoreCredit, user?.storeCredit, validatedItems]);

//     const getItemPrice = useCallback((item: any) => {
//         return item.discountedPrice || item.unitPrice || 0;
//     }, []);

//     const calculateSubtotal = useCallback(() => {
//         return validatedItems.reduce((sum: number, item: any) => {
//             const itemPrice = getItemPrice(item);
//             return sum + itemPrice * (item.quantity || 1);
//         }, 0);
//     }, [validatedItems, getItemPrice]);

//     const getOriginalPrice = useCallback((item: any) => {
//         return item.currentSize?.price || item.unitPrice * 1.25 || 0;
//     }, []);

//     const calculateShipping = useCallback(() => {
//         const subtotal = calculateSubtotal();

//         if (user?.tier === "Founder" || user?.tier === "VIP") {
//             return 0;
//         }

//         if (user?.tier === "Member") {
//             if (user?.shippingCredit && user.shippingCredit > 0) {
//                 if (user.shippingCredit >= 6.95) {
//                     return 0;
//                 } else {
//                     return 6.95 - user.shippingCredit;
//                 }
//             }

//             if (subtotal >= 150) return 0;
//             return 6.95;
//         }

//         return subtotal >= 150 ? 0 : 6.95;
//     }, [user, calculateSubtotal]);

//     const calculateTotalPayable = useCallback(() => {
//         return calculateSubtotal() + calculateShipping();
//     }, [calculateSubtotal, calculateShipping]);

//     const getMaxAllowedStoreCredit = useCallback(() => {
//         const totalPayable = calculateTotalPayable();

//         if (totalPayable <= 1) {
//             return 0;
//         }

//         const maxCredit = totalPayable - 1;
//         return Math.max(0, maxCredit);
//     }, [calculateTotalPayable]);

//     const calculateStoreCreditUsage = useCallback(() => {
//         if (!useStoreCredit || !user?.storeCredit || user.storeCredit <= 0) {
//             return 0;
//         }

//         const maxAllowed = getMaxAllowedStoreCredit();

//         if (maxAllowed <= 0) {
//             return 0;
//         }

//         const maxCredit = user.storeCredit;
//         const maxApplicable = Math.min(maxCredit, maxAllowed);
//         const amountToUse = Math.min(storeCreditAmount, maxApplicable);

//         return amountToUse;
//     }, [useStoreCredit, user?.storeCredit, storeCreditAmount, getMaxAllowedStoreCredit]);

//     const calculateAdjustedItems = useCallback(() => {
//         const storeCreditUsed = calculateStoreCreditUsage();
//         const subtotal = calculateSubtotal();
//         const totalPayable = calculateTotalPayable();

//         const stripeChargeAmount = totalPayable - storeCreditUsed;

//         return validatedItems.map((item: any) => {
//             const itemPrice = getItemPrice(item);
//             const itemTotal = itemPrice * (item.quantity || 1);
//             const itemProportion = subtotal > 0 ? itemTotal / subtotal : 1 / validatedItems.length;

//             const stripeChargeForItem = stripeChargeAmount * itemProportion;
//             const adjustedPricePerUnit = Math.max(0.01, stripeChargeForItem / (item.quantity || 1));
//             const storeCreditForItem = Math.max(0, itemTotal - stripeChargeForItem);

//             const size = item.size || "0";

//             return {
//                 productId: item.product?.id || 0,
//                 name: item.product?.name || "Product",
//                 description: `${size}mg ${item.product?.name || "Product"}`,
//                 price: adjustedPricePerUnit,
//                 originalPrice: itemPrice,
//                 storeCreditApplied: storeCreditForItem,
//                 quantity: item.quantity || 1,
//                 size: size.toString(),
//             };
//         });
//     }, [validatedItems, calculateStoreCreditUsage, calculateSubtotal, calculateTotalPayable, getItemPrice]);

//     const calculateAdjustedShipping = useCallback(() => {
//         const shipping = calculateShipping();
//         const storeCreditUsed = calculateStoreCreditUsage();
//         const subtotal = calculateSubtotal();

//         if (storeCreditUsed > subtotal) {
//             const creditForShipping = storeCreditUsed - subtotal;
//             return Math.max(0, shipping - creditForShipping);
//         }

//         return shipping;
//     }, [calculateShipping, calculateStoreCreditUsage, calculateSubtotal]);

//     const calculateDisplayTotal = useCallback(() => {
//         const totalPayable = calculateTotalPayable();
//         const storeCreditUsed = calculateStoreCreditUsage();

//         const displayTotal = totalPayable - storeCreditUsed;
//         return Math.max(1.0, displayTotal);
//     }, [calculateTotalPayable, calculateStoreCreditUsage]);

//     const canUseStoreCredit = useCallback(() => {
//         if (!user?.storeCredit || user.storeCredit <= 0) {
//             return false;
//         }
//         const totalPayable = calculateTotalPayable();
//         return totalPayable > 1;
//     }, [user, calculateTotalPayable]);

//     const getShippingMessage = useCallback(() => {
//         const shippingCost = calculateShipping();
//         const subtotal = calculateSubtotal();

//         if (shippingCost === 0) {
//             if (user?.tier === "Founder" || user?.tier === "VIP") {
//                 return { text: `Free (${user.tier})`, className: "text-green-400" };
//             }
//             if (user?.tier === "Member" && user?.shippingCredit && user.shippingCredit >= 6.95) {
//                 return { text: "Free (Credit Applied)", className: "text-green-400" };
//             }
//             if (subtotal >= 150) {
//                 return { text: "Free (Order ≥ $150)", className: "text-green-400" };
//             }
//             return { text: "Free", className: "text-green-400" };
//         }

//         if (user?.tier === "Member" && user?.shippingCredit && user.shippingCredit > 0 && user.shippingCredit < 6.95) {
//             return {
//                 text: `$${shippingCost.toFixed(2)} ($${user.shippingCredit.toFixed(2)} credit applied)`,
//                 className: "text-yellow-400",
//             };
//         }

//         return { text: `$${shippingCost.toFixed(2)}`, className: "text-yellow-400" };
//     }, [user, calculateShipping, calculateSubtotal]);

//     const onSubmit = async (data: CheckoutFormData) => {
//         try {
//             if (validatedItems.length === 0) {
//                 alert("No valid items to order");
//                 return;
//             }

//             if (validationErrors.length > 0) {
//                 alert("Please resolve validation errors first");
//                 return;
//             }

//             const adjustedItems = calculateAdjustedItems();

//             const subtotal = adjustedItems.reduce((sum: any, item: any) => sum + item.price * item.quantity, 0);
//             const shippingAmount = calculateAdjustedShipping();
//             const storeCreditUsed = calculateStoreCreditUsage();
//             const stripeTotal = subtotal + shippingAmount;

//             const shippingInfo = {
//                 name: `${data.firstName} ${data.lastName}`,
//                 email: data.email,
//                 phone: data.phone,
//                 address: data.address,
//                 city: data.city,
//                 state: data.state,
//                 zip: data.zipCode,
//                 country: data.country,
//             };

//             const result = await createCheckout({
//                 userId: user?.id || "guest",
//                 items: adjustedItems,
//                 shippingInfo,
//                 shippingAmount,
//                 subtotal: calculateSubtotal(),
//                 storeCreditUsed,
//                 total: stripeTotal,
//                 metadata: {
//                     userId: user?.id || "guest",
//                     originalSubtotal: calculateSubtotal(),
//                     storeCreditUsed,
//                     repeatOrderId: orderId,
//                     userTier: tier.name,
//                     userShippingCredit: user?.shippingCredit || 0,
//                     itemDetails: JSON.stringify(
//                         adjustedItems.map((item: any) => ({
//                             productId: item.productId,
//                             originalPrice: item.originalPrice,
//                             quantity: item.quantity,
//                             name: item.name,
//                             size: item.size,
//                             storeCreditApplied: item.storeCreditApplied,
//                             finalPrice: item.price,
//                         })),
//                     ),
//                 },
//             }).unwrap();

//             if (result.url) {
//                 window.location.href = result.url;
//             }
//         } catch (error: any) {
//             console.error("Checkout failed:", error);
//             alert(`Checkout failed: ${error?.data?.error || error.message}`);
//         }
//     };

//     const shippingMessage = getShippingMessage();
//     const subtotal = calculateSubtotal();
//     const storeCreditUsed = calculateStoreCreditUsage();
//     const displayTotal = calculateDisplayTotal();
//     const maxAllowedCredit = getMaxAllowedStoreCredit();

//     if (isOrderLoading) {
//         return (
//             <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
//                 <div className="container mx-auto max-w-6xl">
//                     <h1 className="text-3xl font-bold mb-8">Repeat Order</h1>
//                     <div className="text-center py-20">Loading order details...</div>
//                 </div>
//             </div>
//         );
//     }

//     if (!order) {
//         return (
//             <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
//                 <div className="container mx-auto max-w-6xl">
//                     <h1 className="text-3xl font-bold mb-8">Repeat Order</h1>
//                     <div className="text-center py-20 text-red-400">Order not found or you don't have permission to view it.</div>
//                 </div>
//             </div>
//         );
//     }

//     if (isValidating) {
//         return (
//             <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
//                 <div className="container mx-auto max-w-6xl">
//                     <h1 className="text-3xl font-bold mb-8">Repeat Order</h1>
//                     <div className="text-center py-20">
//                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
//                         <p className="text-gray-400">Validating products...</p>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     if (validationErrors.length > 0) {
//         return (
//             <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
//                 <div className="container mx-auto max-w-6xl">
//                     <h1 className="text-3xl font-bold mb-8">Repeat Order</h1>
//                     <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 mb-6">
//                         <h2 className="text-xl font-bold text-red-400 mb-4">Cannot Repeat Order</h2>
//                         <p className="text-gray-300 mb-4">The following items have issues:</p>
//                         <ul className="list-disc list-inside space-y-2">
//                             {validationErrors.map((error, index) => (
//                                 <li key={index} className="text-red-400">
//                                     {error}
//                                 </li>
//                             ))}
//                         </ul>
//                         <button onClick={() => router.push("/")} className="mt-6 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold">
//                             Browse Products
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
//             <div className="container mx-auto max-w-6xl">
//                 <div className="mb-6">
//                     <h1 className="text-3xl font-bold">Repeat Order</h1>
//                     <p className="text-gray-400">
//                         Reordering: #{order.id?.slice(-8)} from {new Date(order.createdAt).toLocaleDateString()}
//                     </p>
//                 </div>

//                 <div className="grid md:grid-cols-2 gap-8">
//                     <div>
//                         <div className="bg-slate-800 rounded-lg p-6 mb-6">
//                             <h2 className="text-xl font-bold mb-4">Repeat Order Summary</h2>

//                             {validatedItems.map((item: any, index: number) => {
//                                 const originalPrice = getOriginalPrice(item);
//                                 const itemPrice = getItemPrice(item);
//                                 const size = item.size || "0";

//                                 return (
//                                     <div key={`${item.product?.id}-${size}-${index}`} className="flex justify-between items-center py-3 border-b border-slate-700">
//                                         <div>
//                                             <h3 className="font-semibold">{item.product?.name || "Product"}</h3>
//                                             <p className="text-sm text-gray-400">
//                                                 {size}mg × {item.quantity || 1}
//                                             </p>
//                                             <p className="text-xs text-green-400">In stock: {item.currentSize?.quantity}</p>
//                                         </div>
//                                         <div className="text-right">
//                                             <p className="text-sm text-gray-400 line-through">${originalPrice.toFixed(2)}</p>
//                                             <p className="text-cyan-400">${itemPrice.toFixed(2)}</p>
//                                         </div>
//                                     </div>
//                                 );
//                             })}

//                             <div className="mt-6 space-y-3">
//                                 <div className="flex justify-between">
//                                     <span>Subtotal</span>
//                                     <span>${subtotal.toFixed(2)}</span>
//                                 </div>
//                                 <div className="flex justify-between">
//                                     <span>Shipping</span>
//                                     <span className={shippingMessage.className}>{shippingMessage.text}</span>
//                                 </div>

//                                 {user?.storeCredit && user.storeCredit > 0 && canUseStoreCredit() && (
//                                     <div className="border-t border-slate-700 pt-3">
//                                         <label className="flex items-center justify-between cursor-pointer">
//                                             <div className="flex items-center space-x-2 gap-2">
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={useStoreCredit}
//                                                     onChange={(e) => {
//                                                         const checked = e.target.checked;
//                                                         setUseStoreCredit(checked);
//                                                         if (checked) {
//                                                             const maxCredit = user.storeCredit;
//                                                             const maxAllowed = maxAllowedCredit;
//                                                             const amountToSet = Math.min(maxCredit, maxAllowed);
//                                                             setStoreCreditAmount(amountToSet);
//                                                         } else {
//                                                             setStoreCreditAmount(0);
//                                                         }
//                                                     }}
//                                                     disabled={maxAllowedCredit <= 0}
//                                                     className="w-4 h-4 text-cyan-500 bg-slate-700 border-slate-600 rounded focus:ring-cyan-500 disabled:opacity-50"
//                                                 />
//                                                 <span className="font-medium">Apply Store Credit</span>
//                                             </div>
//                                             <span className="text-blue-400">${user.storeCredit.toFixed(2)}</span>
//                                         </label>

//                                         {useStoreCredit && (
//                                             <div className="mt-2">
//                                                 <div className="flex justify-between items-center">
//                                                     <span className="text-gray-400">Credit applied:</span>
//                                                     <span className="text-green-400 text-lg font-bold">-${storeCreditUsed.toFixed(2)}</span>
//                                                 </div>

//                                                 <div className="text-xs text-gray-500 mt-1 mb-2">{maxAllowedCredit > 0 ? `Maximum $${maxAllowedCredit.toFixed(2)} can be applied (minimum $1.00 card payment required)` : "Cannot apply store credit (order total must be more than $1.00)"}</div>

//                                                 {maxAllowedCredit > 0 && (
//                                                     <div className="mt-3">
//                                                         <input type="range" min="0" max={maxAllowedCredit.toFixed(2)} step="0.01" value={storeCreditAmount} onChange={(e) => setStoreCreditAmount(parseFloat(e.target.value))} className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer" />
//                                                         <div className="flex justify-between text-xs text-gray-400 mt-1">
//                                                             <span>$0</span>
//                                                             <span>${maxAllowedCredit.toFixed(2)}</span>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}

//                                 {user?.storeCredit && user.storeCredit > 0 && !canUseStoreCredit() && (
//                                     <div className="border-t border-slate-700 pt-3">
//                                         <div className="flex items-center justify-between">
//                                             <span className="text-gray-400">Store Credit Available:</span>
//                                             <span className="text-blue-400">${user.storeCredit.toFixed(2)}</span>
//                                         </div>
//                                         <div className="text-xs text-gray-500 mt-1">Cannot apply store credit (order total must be more than $1.00)</div>
//                                     </div>
//                                 )}

//                                 <div className="flex justify-between text-lg font-bold pt-3 border-t border-slate-700">
//                                     <span>Total</span>
//                                     <span className="text-cyan-400">${displayTotal.toFixed(2)}</span>
//                                 </div>
//                             </div>
//                         </div>

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
//                                 {user?.tier === "Member" && (
//                                     <div className="flex justify-between">
//                                         <span className="text-gray-400">Shipping Credit:</span>
//                                         <span className="text-blue-400">${(user?.shippingCredit || 0).toFixed(2)}</span>
//                                     </div>
//                                 )}
//                                 <div className="flex justify-between">
//                                     <span className="text-gray-400">Store Credit:</span>
//                                     <span className="text-blue-400">${(user?.storeCredit || 0).toFixed(2)}</span>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

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
//                                     <select {...register("country")} className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg focus:border-cyan-500 focus:outline-none">
//                                         <option value="US">United States</option>
//                                         <option value="CA">Canada</option>
//                                         <option value="GB">United Kingdom</option>
//                                         <option value="AU">Australia</option>
//                                         <option value="DE">Germany</option>
//                                         <option value="FR">France</option>
//                                         <option value="IT">Italy</option>
//                                         <option value="ES">Spain</option>
//                                         <option value="JP">Japan</option>
//                                         <option value="CN">China</option>
//                                         <option value="IN">India</option>
//                                         <option value="BR">Brazil</option>
//                                         <option value="MX">Mexico</option>
//                                         <option value="KR">South Korea</option>
//                                         <option value="RU">Russia</option>
//                                         <option value="ZA">South Africa</option>
//                                     </select>
//                                     {errors.country && <p className="mt-1 text-sm text-red-400">{errors.country.message}</p>}
//                                 </div>
//                             </div>

//                             <button type="submit" disabled={isCheckoutLoading || validatedItems.length === 0} className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
//                                 {isCheckoutLoading ? "Processing..." : `Repeat Order - Pay $${displayTotal.toFixed(2)}`}
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

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useGetMeQuery } from "@/app/redux/features/auth/authApi";
import { getTier } from "@/app/utils/pricing";
import { useCreateCheckoutSessionMutation } from "@/app/redux/features/payment/paymentApi";
import { useGetOrderQuery } from "@/app/redux/features/order/orderApi";
import { useGetProductsByIdsMutation } from "@/app/redux/features/products/productsApi";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
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

export default function RepeatOrderPage() {
    const router = useRouter();
    const params = useParams();
    const dispatch = useAppDispatch();

    const authUser = useAppSelector(currentUser);

    const orderId = params.id as string;

    useEffect(() => {
        if (!authUser) {
            dispatch(setRedirectPath(`/checkout/repeat/${orderId}`));
            router.push("/auth/login");
        }
    }, [authUser, dispatch, router, orderId]);

    const { data: orderData, isLoading: isOrderLoading } = useGetOrderQuery(orderId);
    const order = orderData?.data;

    const { data: userData } = useGetMeQuery();
    const user = userData?.data;

    const [getProductsByIds] = useGetProductsByIdsMutation();

    const [validatedItems, setValidatedItems] = useState<any[]>([]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);
    const [isValidating, setIsValidating] = useState(false);

    const [createCheckout, { isLoading: isCheckoutLoading }] = useCreateCheckoutSessionMutation();

    const tier = getTier(user?.tier || "Member");

    const [useStoreCredit, setUseStoreCredit] = useState(false);
    const [storeCreditAmount, setStoreCreditAmount] = useState(0);

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

    // Validate products when order loads
    useEffect(() => {
        const validateProducts = async () => {
            if (!order?.items || isValidating || validatedItems.length > 0 || validationErrors.length > 0) {
                return;
            }

            setIsValidating(true);

            try {
                // Get unique product IDs from order items
                const productIds = [...new Set(order.items.map((item: any) => item.product?.id).filter(Boolean))] as number[];

                const result = await getProductsByIds(productIds as number[]).unwrap();
                const products = result.data || [];

                // Create a map for easy lookup
                const productMap = new Map();
                products.forEach((product: any) => {
                    productMap.set(product.id, product);
                });

                const validated: any[] = [];
                const errors: string[] = [];

                // Validate each order item
                for (const item of order.items) {
                    const productId = item.product?.id;
                    const currentProduct = productMap.get(productId);

                    if (!currentProduct) {
                        errors.push(`Product "${item.product?.name || "Unknown"}" is no longer available`);
                        continue;
                    }

                    const size = item.size;
                    const currentSize = currentProduct.sizes?.find((s: any) => s.mg === size);

                    if (!currentSize) {
                        errors.push(`Size ${size || "?"}mg for "${item.product?.name}" is no longer available`);
                        continue;
                    }

                    if (currentSize.quantity <= 0) {
                        errors.push(`Size ${size}mg for "${item.product?.name}" is out of stock`);
                        continue;
                    }

                    if (currentSize.quantity < (item.quantity || 1)) {
                        errors.push(`Only ${currentSize.quantity} available for "${item.product?.name}" ${size}mg (you need ${item.quantity || 1})`);
                        continue;
                    }

                    validated.push({
                        ...item,
                        currentProduct,
                        currentSize,
                        price: item.discountedPrice || item.unitPrice,
                        originalPrice: currentSize.price,
                    });
                }

                setValidatedItems(validated);
                setValidationErrors(errors);
            } catch (error) {
                console.error("Error validating products:", error);
                setValidationErrors(["Failed to validate products. Please try again."]);
            } finally {
                setIsValidating(false);
            }
        };

        validateProducts();
    }, [order, getProductsByIds, isValidating, validatedItems.length, validationErrors.length]);

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

    // Auto-set store credit when checkbox is toggled
    useEffect(() => {
        if (useStoreCredit && user?.storeCredit && user.storeCredit > 0) {
            const maxCredit = user.storeCredit;
            const maxAllowed = getMaxAllowedStoreCredit();

            if (maxAllowed <= 0) {
                setUseStoreCredit(false);
                setStoreCreditAmount(0);
                return;
            }

            const amountToSet = Math.min(maxCredit, maxAllowed);
            setStoreCreditAmount(amountToSet);
        } else {
            setStoreCreditAmount(0);
        }
    }, [useStoreCredit, user?.storeCredit, validatedItems]);

    const getItemPrice = useCallback((item: any) => {
        return item.discountedPrice || item.unitPrice || 0;
    }, []);

    const calculateSubtotal = useCallback(() => {
        return validatedItems.reduce((sum: number, item: any) => {
            const itemPrice = getItemPrice(item);
            return sum + itemPrice * (item.quantity || 1);
        }, 0);
    }, [validatedItems, getItemPrice]);

    const getOriginalPrice = useCallback((item: any) => {
        return item.currentSize?.price || item.unitPrice * 1.25 || 0;
    }, []);

    // UPDATED: Calculate shipping based on tier and subtotal only
    const calculateShipping = useCallback(() => {
        const subtotal = calculateSubtotal();
        const SHIPPING_RATE = 6.95;

        // Founder/VIP: Always free shipping
        if (user?.tier === "Founder" || user?.tier === "VIP") {
            return 0;
        }

        // Member: Free shipping on orders $150+, otherwise $6.95
        if (user?.tier === "Member") {
            return subtotal >= 150 ? 0 : SHIPPING_RATE;
        }

        // Other tiers: Free shipping on orders $150+, otherwise $6.95
        return subtotal >= 150 ? 0 : SHIPPING_RATE;
    }, [user, calculateSubtotal]);

    const calculateTotalPayable = useCallback(() => {
        return calculateSubtotal() + calculateShipping();
    }, [calculateSubtotal, calculateShipping]);

    const getMaxAllowedStoreCredit = useCallback(() => {
        const totalPayable = calculateTotalPayable();

        if (totalPayable <= 1) {
            return 0;
        }

        const maxCredit = totalPayable - 1;
        return Math.max(0, maxCredit);
    }, [calculateTotalPayable]);

    const calculateStoreCreditUsage = useCallback(() => {
        if (!useStoreCredit || !user?.storeCredit || user.storeCredit <= 0) {
            return 0;
        }

        const maxAllowed = getMaxAllowedStoreCredit();

        if (maxAllowed <= 0) {
            return 0;
        }

        const maxCredit = user.storeCredit;
        const maxApplicable = Math.min(maxCredit, maxAllowed);
        const amountToUse = Math.min(storeCreditAmount, maxApplicable);

        return amountToUse;
    }, [useStoreCredit, user?.storeCredit, storeCreditAmount, getMaxAllowedStoreCredit]);

    const calculateAdjustedItems = useCallback(() => {
        const storeCreditUsed = calculateStoreCreditUsage();
        const subtotal = calculateSubtotal();
        const totalPayable = calculateTotalPayable();

        const stripeChargeAmount = totalPayable - storeCreditUsed;

        return validatedItems.map((item: any) => {
            const itemPrice = getItemPrice(item);
            const itemTotal = itemPrice * (item.quantity || 1);
            const itemProportion = subtotal > 0 ? itemTotal / subtotal : 1 / validatedItems.length;

            const stripeChargeForItem = stripeChargeAmount * itemProportion;
            const adjustedPricePerUnit = Math.max(0.01, stripeChargeForItem / (item.quantity || 1));
            const storeCreditForItem = Math.max(0, itemTotal - stripeChargeForItem);

            const size = item.size || "0";

            return {
                productId: item.product?.id || 0,
                name: item.product?.name || "Product",
                description: `${size}mg ${item.product?.name || "Product"}`,
                price: adjustedPricePerUnit,
                originalPrice: itemPrice,
                storeCreditApplied: storeCreditForItem,
                quantity: item.quantity || 1,
                size: size.toString(),
            };
        });
    }, [validatedItems, calculateStoreCreditUsage, calculateSubtotal, calculateTotalPayable, getItemPrice]);

    const calculateAdjustedShipping = useCallback(() => {
        const shipping = calculateShipping();
        const storeCreditUsed = calculateStoreCreditUsage();
        const subtotal = calculateSubtotal();

        if (storeCreditUsed > subtotal) {
            const creditForShipping = storeCreditUsed - subtotal;
            return Math.max(0, shipping - creditForShipping);
        }

        return shipping;
    }, [calculateShipping, calculateStoreCreditUsage, calculateSubtotal]);

    const calculateDisplayTotal = useCallback(() => {
        const totalPayable = calculateTotalPayable();
        const storeCreditUsed = calculateStoreCreditUsage();

        const displayTotal = totalPayable - storeCreditUsed;
        return Math.max(1.0, displayTotal);
    }, [calculateTotalPayable, calculateStoreCreditUsage]);

    const canUseStoreCredit = useCallback(() => {
        if (!user?.storeCredit || user.storeCredit <= 0) {
            return false;
        }
        const totalPayable = calculateTotalPayable();
        return totalPayable > 1;
    }, [user, calculateTotalPayable]);

    // UPDATED: Get shipping message without credit references
    const getShippingMessage = useCallback(() => {
        const shippingCost = calculateShipping();
        const subtotal = calculateSubtotal();

        if (shippingCost === 0) {
            if (user?.tier === "Founder" || user?.tier === "VIP") {
                return { text: `Free (${user.tier})`, className: "text-green-400" };
            }
            if (user?.tier === "Member" && subtotal >= 150) {
                return { text: "Free (Order ≥ $150)", className: "text-green-400" };
            }
            if (subtotal >= 150) {
                return { text: "Free (Order ≥ $150)", className: "text-green-400" };
            }
            return { text: "Free", className: "text-green-400" };
        }

        return { text: `$${shippingCost.toFixed(2)}`, className: "text-yellow-400" };
    }, [user, calculateShipping, calculateSubtotal]);

    const onSubmit = async (data: CheckoutFormData) => {
        try {
            if (validatedItems.length === 0) {
                alert("No valid items to order");
                return;
            }

            if (validationErrors.length > 0) {
                alert("Please resolve validation errors first");
                return;
            }

            const adjustedItems = calculateAdjustedItems();

            const subtotal = adjustedItems.reduce((sum: any, item: any) => sum + item.price * item.quantity, 0);
            const shippingAmount = calculateAdjustedShipping();
            const storeCreditUsed = calculateStoreCreditUsage();
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
                items: adjustedItems,
                shippingInfo,
                shippingAmount,
                subtotal: calculateSubtotal(),
                storeCreditUsed,
                total: stripeTotal,
                metadata: {
                    userId: user?.id || "guest",
                    originalSubtotal: calculateSubtotal(),
                    storeCreditUsed,
                    repeatOrderId: orderId,
                    userTier: tier.name,
                    itemDetails: JSON.stringify(
                        adjustedItems.map((item: any) => ({
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
                window.location.href = result.url;
            }
        } catch (error: any) {
            console.error("Checkout failed:", error);
            alert(`Checkout failed: ${error?.data?.error || error.message}`);
        }
    };

    const shippingMessage = getShippingMessage();
    const subtotal = calculateSubtotal();
    const storeCreditUsed = calculateStoreCreditUsage();
    const displayTotal = calculateDisplayTotal();
    const maxAllowedCredit = getMaxAllowedStoreCredit();

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

    if (isValidating) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
                <div className="container mx-auto max-w-6xl">
                    <h1 className="text-3xl font-bold mb-8">Repeat Order</h1>
                    <div className="text-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500 mx-auto mb-4"></div>
                        <p className="text-gray-400">Validating products...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (validationErrors.length > 0) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
                <div className="container mx-auto max-w-6xl">
                    <h1 className="text-3xl font-bold mb-8">Repeat Order</h1>
                    <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 mb-6">
                        <h2 className="text-xl font-bold text-red-400 mb-4">Cannot Repeat Order</h2>
                        <p className="text-gray-300 mb-4">The following items have issues:</p>
                        <ul className="list-disc list-inside space-y-2">
                            {validationErrors.map((error, index) => (
                                <li key={index} className="text-red-400">
                                    {error}
                                </li>
                            ))}
                        </ul>
                        <button onClick={() => router.push("/")} className="mt-6 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold">
                            Browse Products
                        </button>
                    </div>
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

                            {validatedItems.map((item: any, index: number) => {
                                const originalPrice = getOriginalPrice(item);
                                const itemPrice = getItemPrice(item);
                                const size = item.size || "0";

                                return (
                                    <div key={`${item.product?.id}-${size}-${index}`} className="flex justify-between items-center py-3 border-b border-slate-700">
                                        <div>
                                            <h3 className="font-semibold">{item.product?.name || "Product"}</h3>
                                            <p className="text-sm text-gray-400">
                                                {size}mg × {item.quantity || 1}
                                            </p>
                                            <p className="text-xs text-green-400">In stock: {item.currentSize?.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-400 line-through">${originalPrice.toFixed(2)}</p>
                                            <p className="text-cyan-400">${itemPrice.toFixed(2)}</p>
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="mt-6 space-y-3">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span className={shippingMessage.className}>{shippingMessage.text}</span>
                                </div>

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

                                                <div className="text-xs text-gray-500 mt-1 mb-2">{maxAllowedCredit > 0 ? `Maximum $${maxAllowedCredit.toFixed(2)} can be applied (minimum $1.00 card payment required)` : "Cannot apply store credit (order total must be more than $1.00)"}</div>

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
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Store Credit:</span>
                                    <span className="text-blue-400">${(user?.storeCredit || 0).toFixed(2)}</span>
                                </div>
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

                            <button type="submit" disabled={isCheckoutLoading || validatedItems.length === 0} className="w-full py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-lg hover:from-cyan-600 hover:to-blue-700 transition shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer">
                                {isCheckoutLoading ? "Processing..." : `Repeat Order - Pay $${displayTotal.toFixed(2)}`}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">By completing your order, you agree to our Terms of Service</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
