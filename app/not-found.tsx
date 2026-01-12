// import Link from "next/link";

// export default function NotFound() {
//     return (
//         <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex flex-col items-center justify-center p-4">
//             <div className="max-w-md w-full text-center">
//                 <div className="text-9xl font-bold text-cyan-400/20 mb-4">404</div>

//                 <h1 className="text-2xl font-bold text-white mb-2">Page Not Found</h1>
//                 <p className="text-gray-400 mb-8">The page you're looking for doesn't exist.</p>

//                 <Link href="/" className="inline-block px-8 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition-colors">
//                     Go Home
//                 </Link>

//                 <p className="mt-6 text-gray-500 text-sm">
//                     Or{" "}
//                     <Link href="/store" className="text-cyan-400 hover:text-cyan-300">
//                         browse our products
//                     </Link>
//                 </p>
//             </div>
//         </div>
//     );
// }

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold text-cyan-400 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-white mb-3">Page Not Found</h2>
                <p className="text-gray-400 mb-8">The page you're looking for doesn't exist or has been moved.</p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/" className="px-6 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors">
                        Go to Homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
