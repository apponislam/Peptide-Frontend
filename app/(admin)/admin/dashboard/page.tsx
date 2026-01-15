// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// // import AdminSidebar from "./AdminSidebar";
// // import DashboardTab from "./DashboardTab";
// // import OrdersTab from "./OrdersTab";
// import UsersTab from "./UsersTab";
// import DashboardTab from "./DashboardTab";
// import OrdersTab from "./OrdersTab";
// import ProductsTab from "./ProductsTab";
// import AnalyticsTab from "./AnalyticsTab";
// // import ProductsTab from "./ProductsTab";
// // import AnalyticsTab from "./AnalyticsTab";

// export default function AdminDashboard() {
//     const router = useRouter();
//     const [selectedTab, setSelectedTab] = useState("dashboard");
//     const [stats, setStats] = useState({
//         totalOrders: 0,
//         totalRevenue: 0,
//         totalCustomers: 0,
//         totalProducts: 0,
//     });
//     const [orders, setOrders] = useState<any[]>([]);
//     const [users, setUsers] = useState<any[]>([]);
//     const [products, setProducts] = useState<any[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         // Check authentication
//         // const token = localStorage.getItem("admin_token");
//         // if (!token) {
//         //     router.push("/admin/login");
//         //     return;
//         // }

//         // Load all data
//         loadDashboardData();
//     }, [router]);

//     const loadDashboardData = async () => {
//         try {
//             setLoading(true);
//             // Mock data loading - replace with actual API calls
//             await new Promise((resolve) => setTimeout(resolve, 1000));

//             // Mock stats
//             setStats({
//                 totalOrders: 157,
//                 totalRevenue: 45280.5,
//                 totalCustomers: 89,
//                 totalProducts: 12,
//             });

//             // Mock orders
//             setOrders([
//                 {
//                     id: "ORD001",
//                     user: { email: "customer@example.com" },
//                     total: 299.99,
//                     createdAt: new Date().toISOString(),
//                     shippingName: "John Doe",
//                     shippingAddress: "123 Main St, City",
//                     items: [{ name: "Retatrutide", quantity: 1 }],
//                     status: "pending",
//                 },
//                 // Add more mock orders...
//             ]);

//             // Mock users
//             setUsers([
//                 {
//                     id: "1",
//                     email: "user1@example.com",
//                     tier: "VIP",
//                     referralCount: 5,
//                     storeCredit: 150.0,
//                     referralCode: "VIPREF1",
//                 },
//                 // Add more mock users...
//             ]);

//             // Mock products
//             setProducts([
//                 {
//                     id: "1",
//                     name: "Retatrutide",
//                     desc: "Advanced peptide formula",
//                     price: 299.99,
//                     sizes: ["10mg", "20mg", "30mg"],
//                 },
//                 // Add more mock products...
//             ]);
//         } catch (error) {
//             console.error("Failed to load dashboard data:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleLogout = () => {
//         localStorage.removeItem("admin_token");
//         localStorage.removeItem("admin_user");
//         router.push("/admin/login");
//     };

//     const renderTabContent = () => {
//         switch (selectedTab) {
//             case "dashboard":
//                 return <DashboardTab stats={stats} loading={loading} />;
//             case "orders":
//                 return <OrdersTab orders={orders} loading={loading} />;
//             case "users":
//                 return <UsersTab users={users} loading={loading} />;
//             case "products":
//                 return <ProductsTab products={products} loading={loading} />;
//             case "analytics":
//                 return <AnalyticsTab orders={orders} loading={loading} />;
//             default:
//                 return <DashboardTab stats={stats} loading={loading} />;
//         }
//     };

//     return (
//         <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
//             {/* Navigation */}
//             <nav className="bg-slate-900/80 border-b border-cyan-500/20">
//                 <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
//                     <a href="/" className="flex items-center">
//                         <div className="text-white text-2xl font-bold" style={{ fontFamily: "'GreaterTheory', sans-serif", letterSpacing: "-2px" }}>
//                             PEPTIDE.CLUB
//                         </div>
//                     </a>
//                     <button onClick={handleLogout} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
//                         Log Out
//                     </button>
//                 </div>
//             </nav>

//             {/* Main Content */}
//             <div className="max-w-7xl mx-auto px-6 py-12">
//                 {/* Tab Navigation */}
//                 <div className="flex gap-4 mb-8 flex-wrap border-b border-slate-700 pb-4">
//                     {["dashboard", "orders", "users", "products", "analytics"].map((tab) => (
//                         <button key={tab} onClick={() => setSelectedTab(tab)} className={`px-6 py-2 font-semibold transition-colors ${selectedTab === tab ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
//                             {tab.charAt(0).toUpperCase() + tab.slice(1)}
//                         </button>
//                     ))}
//                 </div>

//                 {/* Tab Content */}
//                 {renderTabContent()}
//             </div>
//         </div>
//     );
// }

// components/admin/AdminDashboard.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardTab from "./DashboardTab";
import OrdersTab from "./OrdersTab";
import UsersTab from "./UsersTab";
import ProductsTab from "./ProductsTab";
import AnalyticsTab from "./AnalyticsTab";
// import DashboardTab from "./tabs/DashboardTab";
// import OrdersTab from "./tabs/OrdersTab";
// import UsersTab from "./tabs/UsersTab";
// import ProductsTab from "./tabs/ProductsTab";
// import AnalyticsTab from "./tabs/AnalyticsTab";

export default function AdminDashboard() {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState<"dashboard" | "orders" | "users" | "products" | "analytics">("dashboard");
    const [loading, setLoading] = useState(false);
    const [adminUser, setAdminUser] = useState<any>(null);

    // Load initial data
    useEffect(() => {
        const user = localStorage.getItem("admin_user");
        if (user) {
            setAdminUser(JSON.parse(user));
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        router.push("/admin/login");
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">
            <nav className="bg-slate-900/80 border-b border-cyan-500/20">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <a href="/">
                        <div className="text-white text-2xl font-bold" style={{ fontFamily: "'GreaterTheory', sans-serif", letterSpacing: "-2px" }}>
                            PEPTIDE.CLUB
                        </div>
                    </a>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-300 text-sm">{adminUser?.email}</span>
                        <button onClick={handleLogout} className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                            Log Out
                        </button>
                    </div>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-12">
                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8" style={{ flexWrap: "wrap" }}>
                    <button onClick={() => setSelectedTab("dashboard")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold ${selectedTab === "dashboard" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
                        Dashboard
                    </button>

                    <button onClick={() => setSelectedTab("orders")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold ${selectedTab === "orders" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
                        Orders
                    </button>

                    <button onClick={() => setSelectedTab("users")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold ${selectedTab === "users" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
                        Users
                    </button>

                    <button onClick={() => setSelectedTab("products")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold ${selectedTab === "products" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
                        Products
                    </button>

                    <button onClick={() => setSelectedTab("analytics")} className={`px-4 py-2 md:px-6 md:py-2 font-semibold ${selectedTab === "analytics" ? "text-cyan-400 border-b-2 border-cyan-500" : "text-gray-400 hover:text-gray-300"}`}>
                        Analytics
                    </button>
                </div>

                {/* Tab Content */}
                {selectedTab === "dashboard" && <DashboardTab />}
                {selectedTab === "orders" && <OrdersTab />}
                {selectedTab === "users" && <UsersTab />}
                {selectedTab === "products" && <ProductsTab />}
                {selectedTab === "analytics" && <AnalyticsTab />}
            </div>
        </div>
    );
}
