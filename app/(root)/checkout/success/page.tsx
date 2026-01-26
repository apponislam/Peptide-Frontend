"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLazyGetSessionStatusQuery } from "@/app/redux/features/payment/paymentApi";
import { clearCart } from "@/app/redux/features/cart/cartSlice";
import { useAppDispatch } from "@/app/redux/hooks";

interface SessionData {
    status: string;
    paymentStatus: string;
    customerDetails: any;
    shipping: any;
    shippingCost: any;
    amountTotal: number;
}

export default function CheckoutSuccessPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();

    const sessionId = searchParams.get("session_id");
    const [sessionData, setSessionData] = useState<SessionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [getSessionStatus] = useLazyGetSessionStatusQuery();

    // Clear cart on success
    useEffect(() => {
        dispatch(clearCart());
    }, [dispatch]);

    // Fetch session data
    useEffect(() => {
        const fetchSessionData = async () => {
            if (!sessionId) {
                setError("No session ID found");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const result = await getSessionStatus(sessionId).unwrap();

                console.log(result);

                if (result.success) {
                    setSessionData(result.session);
                } else {
                    setError(result.error || "Failed to fetch session data");
                }
            } catch (err: any) {
                console.error("Error fetching session:", err);
                setError(err?.data?.error || err.message || "Unknown error");
            } finally {
                setLoading(false);
            }
        };

        fetchSessionData();
    }, [sessionId, getSessionStatus]);

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white text-lg">Processing your payment...</p>
                </div>
            </div>
        );
    }

    if (error || !sessionData) {
        return (
            <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
                <div className="text-center max-w-md p-6 bg-slate-800/50 rounded-xl border border-red-500/30">
                    <div className="text-red-400 text-5xl mb-4">⚠️</div>
                    <h1 className="text-2xl font-bold text-white mb-2">Payment Verification Failed</h1>
                    <p className="text-gray-300 mb-6">{error || "Unable to verify your payment"}</p>
                    <div className="flex gap-4 justify-center">
                        <Link href="/" className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg">
                            Return Home
                        </Link>
                        <Link href="/contact" className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg">
                            Contact Support
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
            <div className="container mx-auto max-w-4xl">
                {/* Success Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500/20 rounded-full mb-6 border-4 border-green-500/30">
                        <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Payment Successful!</h1>
                    <p className="text-gray-400 text-lg">Thank you for your order</p>
                    <p className="text-green-400 mt-2">Order ID: {sessionId?.slice(0, 8)}...</p>
                </div>

                {/* Order Summary Card */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold mb-6 pb-4 border-b border-slate-700">Order Details</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Payment Info */}
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-cyan-400">Payment Information</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Status:</span>
                                    <span className={`font-semibold ${sessionData.paymentStatus === "paid" ? "text-green-400" : "text-yellow-400"}`}>{sessionData.paymentStatus.toUpperCase()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Amount Paid:</span>
                                    <span className="text-xl font-bold text-green-400">${(sessionData.amountTotal || 0).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Payment Method:</span>
                                    <span className="text-gray-300">Card</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Session ID:</span>
                                    <span className="text-gray-400 text-sm">{sessionId?.slice(0, 12)}...</span>
                                </div>
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-cyan-400">Shipping Information</h3>
                            {sessionData.customerDetails?.address ? ( // ← Check customerDetails.address
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Name:</span>
                                        <span className="text-gray-300">{sessionData.customerDetails.name || "N/A"}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Address:</span>
                                        <span className="text-gray-300 text-right">
                                            {sessionData.customerDetails.address.line1 || "N/A"}
                                            {sessionData.customerDetails.address.line2 && <br />}
                                            {sessionData.customerDetails.address.line2}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">City/State/Zip:</span>
                                        <span className="text-gray-300">
                                            {sessionData.customerDetails.address.city || ""} {sessionData.customerDetails.address.state || ""} {sessionData.customerDetails.address.postal_code || ""}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Country:</span>
                                        <span className="text-gray-300">{sessionData.customerDetails.address.country || "N/A"}</span>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-gray-400">Shipping details not available</p>
                            )}
                        </div>
                    </div>

                    {/* Customer Details */}
                    {sessionData.customerDetails && (
                        <div className="mt-8 pt-6 border-t border-slate-700">
                            <h3 className="font-bold text-lg mb-4 text-cyan-400">Customer Information</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-gray-400 text-sm">Email</p>
                                    <p className="text-gray-300">{sessionData.customerDetails.email || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Phone</p>
                                    <p className="text-gray-300">{sessionData.customerDetails.phone || "N/A"}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">Name</p>
                                    <p className="text-gray-300">{sessionData.customerDetails.name || "N/A"}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link href="/" className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition text-center w-full sm:w-auto">
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
