// // app/checkout/cancel/page.tsx
// "use client";

// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function CheckoutCancelPage() {
//     const router = useRouter();

//     // Optional: Redirect after some time
//     useEffect(() => {
//         const timer = setTimeout(() => {
//             router.push("/");
//         }, 10000); // Redirect after 10 seconds

//         return () => clearTimeout(timer);
//     }, [router]);

//     return (
//         <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8 flex items-center justify-center">
//             <div className="container mx-auto max-w-2xl">
//                 <div className="text-center bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 md:p-12">
//                     {/* Icon */}
//                     <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6 border-4 border-red-500/30">
//                         <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
//                         </svg>
//                     </div>

//                     {/* Title */}
//                     <h1 className="text-4xl font-bold mb-4">Payment Cancelled</h1>

//                     {/* Message */}
//                     <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">Your payment was cancelled. No charges were made to your account.</p>

//                     {/* Reasons List */}
//                     <div className="bg-slate-900/50 rounded-lg p-6 mb-8 text-left">
//                         <h2 className="text-xl font-bold mb-4 text-cyan-400">Common Reasons:</h2>
//                         <ul className="space-y-3 text-gray-300">
//                             <li className="flex items-start gap-3">
//                                 <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
//                                 <span>You cancelled the payment intentionally</span>
//                             </li>
//                             <li className="flex items-start gap-3">
//                                 <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
//                                 <span>Payment session expired (10-30 minutes)</span>
//                             </li>
//                             <li className="flex items-start gap-3">
//                                 <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
//                                 <span>Technical issue with the payment processor</span>
//                             </li>
//                             <li className="flex items-start gap-3">
//                                 <div className="w-2 h-2 bg-red-400 rounded-full mt-2"></div>
//                                 <span>Browser or network interruption</span>
//                             </li>
//                         </ul>
//                     </div>

//                     {/* Action Buttons */}
//                     <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                         <Link href="/" className="px-8 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition text-center w-full sm:w-auto">
//                             ← Return to Home
//                         </Link>
//                         <Link href="/cart" className="px-8 py-3 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg font-semibold transition text-center w-full sm:w-auto">
//                             View Cart
//                         </Link>
//                         <button onClick={() => window.history.back()} className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition text-center w-full sm:w-auto border border-slate-700">
//                             Try Again
//                         </button>
//                     </div>

//                     {/* Help Section */}
//                     <div className="mt-10 pt-6 border-t border-slate-800">
//                         <p className="text-gray-400 mb-4">Need help with your order?</p>
//                         <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
//                             <Link href="/contact" className="px-6 py-2 text-sm bg-slate-900 hover:bg-slate-800 text-gray-300 rounded-lg transition">
//                                 Contact Support
//                             </Link>
//                             <Link href="/faq" className="px-6 py-2 text-sm bg-slate-900 hover:bg-slate-800 text-gray-300 rounded-lg transition">
//                                 View FAQ
//                             </Link>
//                             <a href="tel:+15551234567" className="px-6 py-2 text-sm bg-slate-900 hover:bg-slate-800 text-gray-300 rounded-lg transition">
//                                 Call Us: (555) 123-4567
//                             </a>
//                         </div>
//                     </div>

//                     {/* Auto Redirect Notice */}
//                     <div className="mt-6 pt-4 border-t border-slate-800">
//                         <p className="text-gray-500 text-sm">
//                             You will be redirected to the homepage in <span className="text-cyan-400 font-bold">10 seconds</span>
//                         </p>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// app/checkout/cancel/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutCancelPage() {
    const router = useRouter();

    // Optional: Redirect after some time
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push("/");
        }, 10000); // Redirect after 10 seconds

        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4 md:p-8">
            <div className="container mx-auto max-w-4xl">
                {/* Cancel Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-red-500/20 rounded-full mb-6 border-4 border-red-500/30">
                        <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </div>
                    <h1 className="text-4xl font-bold mb-2">Payment Cancelled</h1>
                    <p className="text-gray-400 text-lg">Your payment was not completed</p>
                    <p className="text-red-400 mt-2">No charges were made to your account</p>
                </div>

                {/* Details Card */}
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 mb-8">
                    <h2 className="text-xl font-bold mb-6 pb-4 border-b border-slate-700">What Happened?</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Status Info */}
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-red-400">Payment Status</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Status:</span>
                                    <span className="font-semibold text-red-400">CANCELLED</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Charges:</span>
                                    <span className="text-gray-300">No charges were made</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Reason:</span>
                                    <span className="text-gray-300">Payment cancelled by user</span>
                                </div>
                            </div>
                        </div>

                        {/* Common Reasons */}
                        <div>
                            <h3 className="font-bold text-lg mb-4 text-red-400">Common Reasons</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Intentional Cancellation:</span>
                                    <span className="text-gray-300">You cancelled the payment</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Session Expired:</span>
                                    <span className="text-gray-300">Checkout session timed out</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Technical Issue:</span>
                                    <span className="text-gray-300">Payment processor error</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Network Problem:</span>
                                    <span className="text-gray-300">Browser or connection issue</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cart Items Preserved */}
                    <div className="mt-8 pt-6 border-t border-slate-700">
                        <h3 className="font-bold text-lg mb-4 text-cyan-400">Good News!</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <p className="text-gray-400 text-sm">Cart Items</p>
                                <p className="text-gray-300">Your cart items have been preserved</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">No Charges</p>
                                <p className="text-gray-300">Your account was not charged</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Try Again</p>
                                <p className="text-gray-300">You can retry the payment anytime</p>
                            </div>
                        </div>
                    </div>
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
