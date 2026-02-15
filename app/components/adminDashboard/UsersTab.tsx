// "use client";

// import { useGetAllUsersQuery, useUpdateUserMutation } from "@/app/redux/features/admin/adminApi";
// import { useState } from "react";
// import { useModal } from "@/app/providers/ModalContext";
// import Pagination from "@/app/utils/Pagination";
// import { useRouter } from "next/navigation";

// interface User {
//     id: string;
//     name: string;
//     email: string;
//     role: "ADMIN" | "USER";
//     tier: string;
//     referralCode: string;
//     referralCount: number;
//     storeCredit: number;
//     createdAt: string;
// }

// export default function UsersTab() {
//     const router = useRouter();
//     const { showModal } = useModal();
//     const [search, setSearch] = useState("");
//     const [page, setPage] = useState(1);
//     const [limit, setLimit] = useState(12);

//     const {
//         data: usersData,
//         isLoading,
//         refetch,
//     } = useGetAllUsersQuery({
//         page,
//         limit,
//         search,
//     });

//     const [updateUserMutation, { isLoading: isUpdating }] = useUpdateUserMutation();

//     const users = usersData?.data || [];
//     const meta = usersData?.meta || { page: 1, limit: 12, total: 0, totalPages: 1 };

//     const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearch(e.target.value);
//         setPage(1);
//     };

//     const handlePageChange = (newPage: number) => {
//         setPage(newPage);
//     };

//     const handleLimitChange = (newLimit: number) => {
//         setLimit(newLimit);
//         setPage(1);
//     };

//     const handleEditCredit = async (user: User) => {
//         // Show modal with input field
//         const storeCredit = await showModal({
//             type: "confirm",
//             title: "Edit Store Credit",
//             message: `Update store credit for ${user.name || user.email}`,
//             confirmText: "Update",
//             cancelText: "Cancel",
//             children: (
//                 <div className="mt-4">
//                     <input type="number" id="storeCreditInput" step="0.01" min="0" defaultValue={user.storeCredit} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
//                 </div>
//             ),
//             // Return value from modal: we will extract input in code
//         });

//         if (!storeCredit) return; // user canceled

//         const input = document.getElementById("storeCreditInput") as HTMLInputElement;
//         const newCredit = parseFloat(input.value);

//         if (isNaN(newCredit) || newCredit < 0) {
//             await showModal({
//                 type: "error",
//                 title: "Invalid Input",
//                 message: "Please enter a valid number.",
//             });
//             return;
//         }

//         try {
//             await updateUserMutation({
//                 id: user.id,
//                 data: { storeCredit: newCredit },
//             }).unwrap();

//             await showModal({
//                 type: "success",
//                 title: "Success",
//                 message: `Store credit updated to $${newCredit.toFixed(2)}`,
//                 confirmText: "OK",
//             });

//             await refetch();
//         } catch (error: any) {
//             await showModal({
//                 type: "error",
//                 title: "Error",
//                 message: error?.data?.message || "Failed to update",
//             });
//         }
//     };

//     const handleEditTier = async (user: User) => {
//         const selectedTier = await showModal({
//             type: "confirm",
//             title: "Edit User Tier",
//             message: `Update tier for ${user.name || user.email}`,
//             confirmText: "Update",
//             cancelText: "Cancel",
//             children: (
//                 <div className="mt-4">
//                     <select id="tierInput" defaultValue={user.tier} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
//                         <option value="Member">Member</option>
//                         <option value="VIP">VIP</option>
//                         <option value="Founder">Founder</option>
//                     </select>
//                 </div>
//             ),
//         });

//         if (!selectedTier) return; // canceled

//         const select = document.getElementById("tierInput") as HTMLSelectElement;
//         const tier = select.value;

//         try {
//             await updateUserMutation({
//                 id: user.id,
//                 data: { tier },
//             }).unwrap();

//             await showModal({
//                 type: "success",
//                 title: "Success",
//                 message: `Tier updated to ${tier}`,
//                 confirmText: "OK",
//             });

//             await refetch();
//         } catch (error: any) {
//             await showModal({
//                 type: "error",
//                 title: "Error",
//                 message: error?.data?.message || error?.message || "Failed to update tier",
//             });
//         }
//     };

//     const handleViewDetails = (user: any) => {
//         router.push(`/admin/users/${user.id}`);
//     };

//     if (isLoading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
//             </div>
//         );
//     }

//     return (
//         <div className="p-4 md:p-6">
//             <div className="mb-6">
//                 <h2 className="text-3xl font-bold text-white">Users</h2>
//             </div>

//             <input type="text" value={search} onChange={handleSearch} placeholder="Search users..." className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-6" />

//             <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead className="border-b border-white/10">
//                             <tr>
//                                 <th className="px-6 py-4 text-left text-sm font-semibold text-white">User</th>
//                                 <th className="px-6 py-4 text-center text-sm font-semibold text-white">Role/Tier</th>
//                                 <th className="px-6 py-4 text-center text-sm font-semibold text-white">Credit/Refs</th>
//                                 <th className="px-6 py-4 text-right text-sm font-semibold text-white">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {users.map((user: any) => (
//                                 <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
//                                     <td className="px-6 py-4">
//                                         <div>
//                                             <p className="text-white font-medium">{user.name || "No name"}</p>
//                                             <p className="text-gray-400 text-sm">{user.email}</p>
//                                             <p className="text-gray-500 text-xs mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 text-center">
//                                         <div className="space-y-2">
//                                             <span className={`px-2 py-1 text-xs rounded ${user.role === "ADMIN" ? "bg-cyan-500/20 text-cyan-400" : "bg-blue-500/20 text-blue-400"}`}>{user.role}</span>
//                                             <div>
//                                                 <span className={`px-2 py-1 text-xs rounded ${user.tier === "Founder" ? "bg-purple-500/20 text-purple-400" : "bg-cyan-500/20 text-cyan-400"}`}>{user.tier}</span>
//                                             </div>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4 text-center">
//                                         <div>
//                                             <p className="text-green-400 font-medium">${user.storeCredit.toFixed(2)}</p>
//                                             <p className="text-gray-400 text-sm">{user.referralCount} referrals</p>
//                                         </div>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="flex gap-2 justify-end">
//                                             <button onClick={() => handleEditCredit(user)} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors" disabled={isUpdating}>
//                                                 Edit Credit
//                                             </button>
//                                             <button onClick={() => handleEditTier(user)} className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors" disabled={isUpdating}>
//                                                 Edit Tier
//                                             </button>
//                                             <button onClick={() => handleViewDetails(user)} className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg text-sm hover:bg-gray-500/30 transition-colors" disabled={isUpdating}>
//                                                 View Details
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>

//                     {users.length === 0 && (
//                         <div className="text-center py-12">
//                             <p className="text-gray-400">No users found</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* Only show pagination if there's more than 1 page */}
//             {meta.totalPages > 1 && <Pagination meta={meta} onPageChange={handlePageChange} onLimitChange={handleLimitChange} showLimitSelector={true} />}
//         </div>
//     );
// }

"use client";

import { useGetAllUsersQuery, useUpdateUserMutation } from "@/app/redux/features/admin/adminApi";
import { useState } from "react";
import { useModal } from "@/app/providers/ModalContext";
import Pagination from "@/app/utils/Pagination";
import { useRouter } from "next/navigation";
import { ChevronUp, ChevronDown, Filter } from "lucide-react";

interface User {
    id: string;
    name: string;
    email: string;
    role: "ADMIN" | "USER";
    tier: string;
    referralCode: string;
    referralCount: number;
    storeCredit: number;
    createdAt: string;
}

export default function UsersTab() {
    const router = useRouter();
    const { showModal } = useModal();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);
    const [sortBy, setSortBy] = useState("createdAt");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
    const [tierFilter, setTierFilter] = useState<string>("");

    const {
        data: usersData,
        isLoading,
        refetch,
    } = useGetAllUsersQuery({
        page,
        limit,
        search,
        sortBy,
        sortOrder,
        tier: tierFilter || undefined,
    });

    const [updateUserMutation, { isLoading: isUpdating }] = useUpdateUserMutation();

    const users = usersData?.data || [];
    const meta = usersData?.meta || { page: 1, limit: 12, total: 0, totalPages: 1 };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    const handleLimitChange = (newLimit: number) => {
        setLimit(newLimit);
        setPage(1);
    };

    const handleSort = (field: string) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(field);
            setSortOrder("asc");
        }
    };

    const handleTierFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTierFilter(e.target.value);
        setPage(1);
    };

    const clearFilters = () => {
        setTierFilter("");
        setSearch("");
        setSortBy("createdAt");
        setSortOrder("desc");
        setPage(1);
    };

    const handleEditCredit = async (user: User) => {
        // Show modal with input field
        const storeCredit = await showModal({
            type: "confirm",
            title: "Edit Store Credit",
            message: `Update store credit for ${user.name || user.email}`,
            confirmText: "Update",
            cancelText: "Cancel",
            children: (
                <div className="mt-4">
                    <input type="number" id="storeCreditInput" step="0.01" min="0" defaultValue={user.storeCredit} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
            ),
        });

        if (!storeCredit) return;

        const input = document.getElementById("storeCreditInput") as HTMLInputElement;
        const newCredit = parseFloat(input.value);

        if (isNaN(newCredit) || newCredit < 0) {
            await showModal({
                type: "error",
                title: "Invalid Input",
                message: "Please enter a valid number.",
            });
            return;
        }

        try {
            await updateUserMutation({
                id: user.id,
                data: { storeCredit: newCredit },
            }).unwrap();

            await showModal({
                type: "success",
                title: "Success",
                message: `Store credit updated to $${newCredit.toFixed(2)}`,
                confirmText: "OK",
            });

            await refetch();
        } catch (error: any) {
            await showModal({
                type: "error",
                title: "Error",
                message: error?.data?.message || "Failed to update",
            });
        }
    };

    const handleEditTier = async (user: User) => {
        const selectedTier = await showModal({
            type: "confirm",
            title: "Edit User Tier",
            message: `Update tier for ${user.name || user.email}`,
            confirmText: "Update",
            cancelText: "Cancel",
            children: (
                <div className="mt-4">
                    <select id="tierInput" defaultValue={user.tier} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option value="Member">Member</option>
                        <option value="VIP">VIP</option>
                        <option value="Founder">Founder</option>
                    </select>
                </div>
            ),
        });

        if (!selectedTier) return;

        const select = document.getElementById("tierInput") as HTMLSelectElement;
        const tier = select.value;

        try {
            await updateUserMutation({
                id: user.id,
                data: { tier },
            }).unwrap();

            await showModal({
                type: "success",
                title: "Success",
                message: `Tier updated to ${tier}`,
                confirmText: "OK",
            });

            await refetch();
        } catch (error: any) {
            await showModal({
                type: "error",
                title: "Error",
                message: error?.data?.message || error?.message || "Failed to update tier",
            });
        }
    };

    const handleViewDetails = (user: any) => {
        router.push(`/admin/users/${user.id}`);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-6">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-white">Users</h2>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <input type="text" value={search} onChange={handleSearch} placeholder="Search users by name, email, or referral code..." className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>

                <div className="flex gap-2">
                    {/* Tier Filter Dropdown */}
                    <select value={tierFilter} onChange={handleTierFilterChange} className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 min-w-35">
                        <option value="">All Tiers</option>
                        <option value="Member">Member</option>
                        <option value="Founder">Founder</option>
                        <option value="VIP">VIP</option>
                    </select>

                    {/* Sort Dropdown */}
                    <select
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => {
                            const [field, order] = e.target.value.split("-");
                            setSortBy(field);
                            setSortOrder(order as "asc" | "desc");
                            setPage(1);
                        }}
                        className="px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 min-w-45"
                    >
                        <option value="createdAt-desc">Newest First</option>
                        <option value="createdAt-asc">Oldest First</option>
                        <option value="name-asc">Name (A-Z)</option>
                        <option value="name-desc">Name (Z-A)</option>
                        <option value="storeCredit-desc">Highest Credit</option>
                        <option value="storeCredit-asc">Lowest Credit</option>
                    </select>

                    {/* Clear Filters Button */}
                    {(search || tierFilter || sortBy !== "createdAt" || sortOrder !== "desc") && (
                        <button onClick={clearFilters} className="px-4 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                            Clear
                        </button>
                    )}
                </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-white">User</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-white">Role/Tier</th>
                                <th className="px-6 py-4 text-center text-sm font-semibold text-white">Credit/Refs</th>
                                <th className="px-6 py-4 text-right text-sm font-semibold text-white">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user: any) => (
                                <tr key={user.id} className="border-b border-white/10 hover:bg-white/5">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="text-white font-medium">{user.name || "No name"}</p>
                                            <p className="text-gray-400 text-sm">{user.email}</p>
                                            <p className="text-gray-500 text-xs mt-1">{new Date(user.createdAt).toLocaleDateString()}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="space-y-2">
                                            <span className={`px-2 py-1 text-xs rounded ${user.role === "ADMIN" ? "bg-cyan-500/20 text-cyan-400" : "bg-blue-500/20 text-blue-400"}`}>{user.role}</span>
                                            <div>
                                                <span className={`px-2 py-1 text-xs rounded ${user.tier === "Founder" ? "bg-purple-500/20 text-purple-400" : user.tier === "VIP" ? "bg-amber-500/20 text-amber-400" : "bg-cyan-500/20 text-cyan-400"}`}>{user.tier}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div>
                                            <p className="text-green-400 font-medium">${user.storeCredit.toFixed(2)}</p>
                                            <p className="text-gray-400 text-sm">{user.referralCount} referrals</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2 justify-end">
                                            <button onClick={() => handleEditCredit(user)} className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors" disabled={isUpdating}>
                                                Edit Credit
                                            </button>
                                            <button onClick={() => handleEditTier(user)} className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors" disabled={isUpdating}>
                                                Edit Tier
                                            </button>
                                            <button onClick={() => handleViewDetails(user)} className="px-4 py-2 bg-gray-500/20 text-gray-300 rounded-lg text-sm hover:bg-gray-500/30 transition-colors" disabled={isUpdating}>
                                                View Details
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {users.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-400">No users found</p>
                        </div>
                    )}
                </div>
            </div>

            {meta.totalPages > 1 && <Pagination meta={meta} onPageChange={handlePageChange} onLimitChange={handleLimitChange} showLimitSelector={true} />}
        </div>
    );
}
