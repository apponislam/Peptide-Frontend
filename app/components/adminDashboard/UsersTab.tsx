// interface User {
//     id: string;
//     email: string;
//     tier: "Member" | "VIP" | "Founder";
//     referralCount: number;
//     storeCredit: number;
//     referralCode: string;
//     createdAt?: string;
//     lastActive?: string;
// }

// interface UsersTabProps {
//     users: User[];
//     loading: boolean;
// }

// export default function UsersTab({ users, loading }: UsersTabProps) {
//     const updateUser = async (userId: string, field: string, value: any) => {
//         // TODO: Implement API call to update user
//         console.log(`Updating user ${userId} ${field} to ${value}`);
//         // Mock update - replace with actual API call
//         alert(`User ${field} updated to ${value}`);
//     };

//     const getTierColor = (tier: string) => {
//         switch (tier) {
//             case "Founder":
//                 return "bg-purple-500/20 text-purple-400";
//             case "VIP":
//                 return "bg-cyan-500/20 text-cyan-400";
//             case "Member":
//                 return "bg-blue-500/20 text-blue-400";
//             default:
//                 return "bg-gray-500/20 text-gray-400";
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
//             <div className="flex justify-between items-center mb-6">
//                 <h2 className="text-3xl font-bold text-white">Users</h2>
//                 <div className="flex gap-2">
//                     <input type="text" placeholder="Search users..." className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white w-64" />
//                     <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white">
//                         <option value="all">All Tiers</option>
//                         <option value="Member">Member</option>
//                         <option value="VIP">VIP</option>
//                         <option value="Founder">Founder</option>
//                     </select>
//                 </div>
//             </div>

//             <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden">
//                 <div className="overflow-x-auto">
//                     <table className="w-full">
//                         <thead className="bg-slate-900/50 border-b border-slate-700">
//                             <tr>
//                                 <th className="px-6 py-4 text-left text-gray-300 font-semibold">Email</th>
//                                 <th className="px-6 py-4 text-left text-gray-300 font-semibold">Tier</th>
//                                 <th className="px-6 py-4 text-left text-gray-300 font-semibold">Referrals</th>
//                                 <th className="px-6 py-4 text-left text-gray-300 font-semibold">Store Credit</th>
//                                 <th className="px-6 py-4 text-left text-gray-300 font-semibold">Referral Code</th>
//                                 <th className="px-6 py-4 text-left text-gray-300 font-semibold">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-700">
//                             {users.length > 0 ? (
//                                 users.map((user) => (
//                                     <tr key={user.id} className="hover:bg-slate-900/30 transition-colors">
//                                         <td className="px-6 py-4">
//                                             <div className="flex items-center gap-3">
//                                                 <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
//                                                     <span className="text-cyan-400 font-bold">{user.email.charAt(0).toUpperCase()}</span>
//                                                 </div>
//                                                 <div>
//                                                     <p className="text-white font-medium">{user.email}</p>
//                                                     <p className="text-sm text-gray-400">Joined {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</p>
//                                                 </div>
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4">
//                                             <span className={`px-3 py-1 rounded-full text-sm font-medium ${getTierColor(user.tier)}`}>{user.tier}</span>
//                                         </td>
//                                         <td className="px-6 py-4">
//                                             <div className="flex items-center gap-2">
//                                                 <span className="text-white font-medium">{user.referralCount}</span>
//                                                 <span className="text-gray-400 text-sm">referrals</span>
//                                             </div>
//                                         </td>
//                                         <td className="px-6 py-4">
//                                             <span className="text-green-400 font-bold">${user.storeCredit.toFixed(2)}</span>
//                                         </td>
//                                         <td className="px-6 py-4">
//                                             <code className="px-3 py-1 bg-slate-900 rounded text-sm font-mono text-gray-300">{user.referralCode}</code>
//                                         </td>
//                                         <td className="px-6 py-4">
//                                             <div className="flex gap-2">
//                                                 <button
//                                                     onClick={() => {
//                                                         const credit = prompt("Store Credit:", user.storeCredit.toString());
//                                                         if (credit) updateUser(user.id, "storeCredit", parseFloat(credit));
//                                                     }}
//                                                     className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm hover:bg-cyan-500/30 transition-colors"
//                                                 >
//                                                     Edit Credit
//                                                 </button>
//                                                 <button
//                                                     onClick={() => {
//                                                         const tier = prompt("Tier (Member/VIP/Founder):", user.tier);
//                                                         if (tier) updateUser(user.id, "tier", tier);
//                                                     }}
//                                                     className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded text-sm hover:bg-blue-500/30 transition-colors"
//                                                 >
//                                                     Edit Tier
//                                                 </button>
//                                             </div>
//                                         </td>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <td colSpan={6} className="px-6 py-12 text-center">
//                                         <p className="text-gray-400 text-lg">No users found</p>
//                                         <p className="text-gray-500 text-sm mt-2">User data will appear here</p>
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="px-6 py-4 border-t border-slate-700 flex justify-between items-center">
//                     <div className="text-sm text-gray-400">
//                         Showing 1 to {Math.min(users.length, 10)} of {users.length} users
//                     </div>
//                     <div className="flex gap-2">
//                         <button className="px-4 py-2 bg-slate-900 text-gray-300 rounded-lg hover:bg-slate-800 transition-colors">Previous</button>
//                         <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-colors">1</button>
//                         <button className="px-4 py-2 bg-slate-900 text-gray-300 rounded-lg hover:bg-slate-800 transition-colors">2</button>
//                         <button className="px-4 py-2 bg-slate-900 text-gray-300 rounded-lg hover:bg-slate-800 transition-colors">Next</button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// components/admin/tabs/UsersTab.tsx
"use client";

import { useState, useEffect } from "react";

interface User {
    id: string;
    email: string;
    tier: "Member" | "VIP" | "Founder";
    referralCount: number;
    storeCredit: number;
    referralCode: string;
}

export default function UsersTab() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            // Mock API call
            await new Promise((resolve) => setTimeout(resolve, 500));

            const mockUsers: User[] = [
                {
                    id: "1",
                    email: "user1@example.com",
                    tier: "VIP",
                    referralCount: 5,
                    storeCredit: 150.0,
                    referralCode: "VIPREF1",
                },
                {
                    id: "2",
                    email: "user2@example.com",
                    tier: "Founder",
                    referralCount: 12,
                    storeCredit: 320.5,
                    referralCode: "FOUNDER22",
                },
                {
                    id: "3",
                    email: "user3@example.com",
                    tier: "Member",
                    referralCount: 2,
                    storeCredit: 45.0,
                    referralCode: "MEMBER33",
                },
            ];

            setUsers(mockUsers);
        } catch (error) {
            console.error("Failed to load users:", error);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (userId: string, data: any) => {
        try {
            // Mock API call - replace with actual
            await new Promise((resolve) => setTimeout(resolve, 300));

            setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, ...data } : user)));
        } catch (error) {
            alert("Failed to update user: " + (error as Error).message);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-3xl font-bold text-white mb-6">Users</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-gray-300">
                    <thead className="border-b border-slate-700">
                        <tr>
                            <th className="px-4 py-3 text-left text-white">Email</th>
                            <th className="px-4 py-3 text-left text-white">Tier</th>
                            <th className="px-4 py-3 text-left text-white">Referrals</th>
                            <th className="px-4 py-3 text-left text-white">Store Credit</th>
                            <th className="px-4 py-3 text-left text-white">Referral Code</th>
                            <th className="px-4 py-3 text-left text-white">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="space-y-2">
                        {users.map((user) => (
                            <tr key={user.id} className="bg-slate-800 border-b border-slate-700">
                                <td className="px-4 py-3">{user.email}</td>
                                <td className="px-4 py-3">
                                    <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 rounded text-xs">{user.tier}</span>
                                </td>
                                <td className="px-4 py-3">{user.referralCount}</td>
                                <td className="px-4 py-3 text-green-400">${user.storeCredit.toFixed(2)}</td>
                                <td className="px-4 py-3 font-mono text-xs">{user.referralCode}</td>
                                <td className="px-4 py-3">
                                    <button
                                        onClick={() => {
                                            const credit = prompt("Store Credit:", user.storeCredit.toString());
                                            if (credit) updateUser(user.id, { storeCredit: parseFloat(credit) });
                                        }}
                                        className="text-cyan-400 hover:text-cyan-300 text-xs mr-2"
                                    >
                                        Edit Credit
                                    </button>
                                    <button
                                        onClick={() => {
                                            const tier = prompt("Tier (Member/VIP/Founder):", user.tier);
                                            if (tier) updateUser(user.id, { tier });
                                        }}
                                        className="text-cyan-400 hover:text-cyan-300 text-xs"
                                    >
                                        Edit Tier
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
