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
