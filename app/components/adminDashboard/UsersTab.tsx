// "use client";

// import { useGetAllUsersQuery } from "@/app/redux/features/admin/adminApi";
// import { useState, useEffect } from "react";

// interface User {
//     id: string;
//     email: string;
//     tier: "Member" | "VIP" | "Founder";
//     referralCount: number;
//     storeCredit: number;
//     referralCode: string;
// }

// export default function UsersTab() {
//     const { data, error } = useGetAllUsersQuery({ page: 1, limit: 50 });
//     console.log(error);
//     console.log(data);

//     const [users, setUsers] = useState<User[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         loadUsers();
//     }, []);

//     const loadUsers = async () => {
//         try {
//             setLoading(true);
//             // Mock API call
//             await new Promise((resolve) => setTimeout(resolve, 500));

//             const mockUsers: User[] = [
//                 {
//                     id: "1",
//                     email: "user1@example.com",
//                     tier: "VIP",
//                     referralCount: 5,
//                     storeCredit: 150.0,
//                     referralCode: "VIPREF1",
//                 },
//                 {
//                     id: "2",
//                     email: "user2@example.com",
//                     tier: "Founder",
//                     referralCount: 12,
//                     storeCredit: 320.5,
//                     referralCode: "FOUNDER22",
//                 },
//                 {
//                     id: "3",
//                     email: "user3@example.com",
//                     tier: "Member",
//                     referralCount: 2,
//                     storeCredit: 45.0,
//                     referralCode: "MEMBER33",
//                 },
//             ];

//             setUsers(mockUsers);
//         } catch (error) {
//             console.error("Failed to load users:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const updateUser = async (userId: string, data: any) => {
//         try {
//             // Mock API call - replace with actual
//             await new Promise((resolve) => setTimeout(resolve, 300));

//             setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, ...data } : user)));
//         } catch (error) {
//             alert("Failed to update user: " + (error as Error).message);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-64">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <h2 className="text-3xl font-bold text-white mb-6">Users</h2>
//             <div className="overflow-x-auto">
//                 <table className="w-full text-sm text-gray-300">
//                     <thead className="border-b border-slate-700">
//                         <tr>
//                             <th className="px-4 py-3 text-left text-white">Email</th>
//                             <th className="px-4 py-3 text-left text-white">Tier</th>
//                             <th className="px-4 py-3 text-left text-white">Referrals</th>
//                             <th className="px-4 py-3 text-left text-white">Store Credit</th>
//                             <th className="px-4 py-3 text-left text-white">Referral Code</th>
//                             <th className="px-4 py-3 text-left text-white">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody className="space-y-2">
//                         {users.map((user) => (
//                             <tr key={user.id} className="bg-slate-800 border-b border-slate-700">
//                                 <td className="px-4 py-3">{user.email}</td>
//                                 <td className="px-4 py-3">
//                                     <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">{user.tier}</span>
//                                 </td>
//                                 <td className="px-4 py-3">{user.referralCount}</td>
//                                 <td className="px-4 py-3 text-green-400">${user.storeCredit.toFixed(2)}</td>
//                                 <td className="px-4 py-3 font-mono text-xs">{user.referralCode}</td>
//                                 <td className="px-4 py-3">
//                                     <button
//                                         onClick={() => {
//                                             const credit = prompt("Store Credit:", user.storeCredit.toString());
//                                             if (credit) updateUser(user.id, { storeCredit: parseFloat(credit) });
//                                         }}
//                                         className="text-cyan-400 hover:text-cyan-300 text-xs mr-2"
//                                     >
//                                         Edit Credit
//                                     </button>
//                                     <button
//                                         onClick={() => {
//                                             const tier = prompt("Tier (Member/VIP/Founder):", user.tier);
//                                             if (tier) updateUser(user.id, { tier });
//                                         }}
//                                         className="text-cyan-400 hover:text-cyan-300 text-xs"
//                                     >
//                                         Edit Tier
//                                     </button>
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// }

"use client";

import { useGetAllUsersQuery, useUpdateUserMutation } from "@/app/redux/features/admin/adminApi";
import { useState } from "react";
import { useModal } from "@/app/providers/ModalContext";
import Pagination from "@/app/utils/Pagination";
import { useRouter } from "next/navigation";

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
    const { openModal } = useModal();
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(12);

    const {
        data: usersData,
        isLoading,
        refetch,
    } = useGetAllUsersQuery({
        page,
        limit,
        search,
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

    const handleEditCredit = (user: User) => {
        openModal({
            type: "confirm",
            title: "Edit Store Credit",
            message: `Update store credit for ${user.name || user.email}`,
            children: (
                <div className="mt-4">
                    <input type="number" id="storeCreditInput" step="0.01" min="0" defaultValue={user.storeCredit} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500" />
                </div>
            ),
            confirmText: "Update",
            cancelText: "Cancel",
            onConfirm: async () => {
                const input = document.getElementById("storeCreditInput") as HTMLInputElement;
                const storeCredit = parseFloat(input.value);

                if (isNaN(storeCredit) || storeCredit < 0) {
                    openModal({
                        type: "error",
                        title: "Invalid Input",
                        message: "Please enter a valid number.",
                    });
                    return;
                }

                try {
                    await updateUserMutation({
                        id: user.id,
                        data: { storeCredit },
                    }).unwrap();

                    openModal({
                        type: "success",
                        title: "Success",
                        message: `Store credit updated to $${storeCredit.toFixed(2)}`,
                        onConfirm: async () => {
                            await refetch();
                        },
                    });
                } catch (error: any) {
                    openModal({
                        type: "error",
                        title: "Error",
                        message: error?.data?.message || "Failed to update",
                    });
                }
            },
        });
    };

    const handleEditTier = (user: User) => {
        let currentModalOpen = true;

        const showResultModal = (type: "success" | "error", title: string, message: string) => {
            if (!currentModalOpen) return;

            openModal({
                type,
                title,
                message,
                onConfirm:
                    type === "success"
                        ? async () => {
                              await refetch();
                              currentModalOpen = false;
                          }
                        : undefined,
                onCancel: () => {
                    currentModalOpen = false;
                },
            });
        };

        openModal({
            type: "confirm",
            title: "Edit User Tier",
            message: `Update tier for ${user.name || user.email}`,
            children: (
                <div className="mt-4">
                    <select id="tierInput" defaultValue={user.tier} className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
                        <option value="Member">Member</option>
                        <option value="VIP">VIP</option>
                        <option value="Founder">Founder</option>
                    </select>
                </div>
            ),
            confirmText: "Update",
            cancelText: "Cancel",
            onConfirm: async () => {
                const select = document.getElementById("tierInput") as HTMLSelectElement;
                const tier = select.value;

                try {
                    await updateUserMutation({
                        id: user.id,
                        data: { tier },
                    }).unwrap();

                    showResultModal("success", "Success", `Tier updated to ${tier}`);

                    // Return a rejected promise instead of throwing

                    return Promise.reject(new Error("Prevent auto-close (silent)"));
                } catch (error: any) {
                    showResultModal("error", "Error", error?.data?.message || error?.message || "Failed to update tier");

                    // Return a rejected promise instead of throwing

                    return Promise.reject(new Error("Prevent auto-close (silent)"));
                }
            },
            onCancel: () => {
                currentModalOpen = false;
            },
        });
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

            <input type="text" value={search} onChange={handleSearch} placeholder="Search users..." className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 mb-6" />

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
                                                <span className={`px-2 py-1 text-xs rounded ${user.tier === "Founder" ? "bg-purple-500/20 text-purple-400" : "bg-cyan-500/20 text-cyan-400"}`}>{user.tier}</span>
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

            {/* Only show pagination if there's more than 1 page */}
            {meta.totalPages > 1 && <Pagination meta={meta} onPageChange={handlePageChange} onLimitChange={handleLimitChange} showLimitSelector={true} />}
        </div>
    );
}
