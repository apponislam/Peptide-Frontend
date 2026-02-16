// app/redux/features/admin/adminApi.ts
import { baseApi } from "../../api/baseApi";

export const adminApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Get dashboard stats
        getDashboardStats: builder.query({
            query: () => ({
                url: "/admin/stats",
            }),
            providesTags: ["DashboardStats"],
        }),

        // Get all orders
        getAllOrders: builder.query({
            query: (params?: { page?: number; limit?: number; search?: string; status?: string; userId?: string; sortBy?: string; sortOrder?: "asc" | "desc"; startDate?: string; endDate?: string; minAmount?: number; maxAmount?: number }) => ({
                url: "/admin/orders",
                params: params,
            }),
            providesTags: ["Orders"],
        }),

        getOrderById2: builder.query({
            query: (id: string) => ({
                // Change from number to string
                url: `/admin/orders/${id}`,
            }),
            providesTags: (result, error, id) => [{ type: "Orders", id }],
        }),

        // Get all users with pagination and filters
        getAllUsers: builder.query({
            query: (params?: { page?: number; limit?: number; search?: string; role?: string; tier?: string; sortBy?: string; sortOrder?: "asc" | "desc" }) => ({
                url: "/admin/users",
                params: params,
            }),
            providesTags: ["Users"],
        }),

        getUserById: builder.query({
            query: (id: string) => ({
                url: `/admin/users/${id}`,
            }),
            providesTags: (result, error, id) => [{ type: "UserDetails", id }],
        }),

        // Update order status
        updateOrderStatus: builder.mutation({
            query: ({ id, status }: { id: string; status: string }) => ({
                url: `/admin/orders/${id}`,
                method: "PATCH",
                body: { status },
            }),
            invalidatesTags: ["Orders", "DashboardStats"],
        }),

        // Update user
        updateUser: builder.mutation({
            query: ({ id, data }: { id: string; data: { storeCredit?: number; tier?: string; referralCount?: number } }) => ({
                url: `/admin/users/${id}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["Users", "DashboardStats", "UserDetails"],
        }),

        // Optional: Get user by ID
        // getUserById: builder.query({
        //     query: (id: string) => ({
        //         url: `/admin/users/${id}`,
        //     }),
        //     providesTags: (result, error, id) => [{ type: "Users", id }],
        // }),

        // Optional: Get user orders
        getUserOrders: builder.query({
            query: (userId: string) => ({
                url: `/admin/users/${userId}/orders`,
            }),
            providesTags: (result, error, userId) => [{ type: "Orders", userId }],
        }),

        getTopSellingProducts: builder.query({
            query: ({ limit = 5, year, month }: { limit?: number; year?: number; month?: number } = {}) => ({
                url: "/admin/top-products",
                params: {
                    limit,
                    ...(year && { year }),
                    ...(month && { month }),
                },
            }),
            providesTags: ["TopProducts"],
        }),

        // Get referral performance
        getReferralPerformance: builder.query({
            query: ({ tier }: { tier?: string } = {}) => ({
                url: "/admin/referral-performance",
                params: {
                    ...(tier && { tier }),
                },
            }),
            providesTags: ["ReferralPerformance"],
        }),
    }),
});

export const { useGetDashboardStatsQuery, useLazyGetDashboardStatsQuery, useGetAllOrdersQuery, useLazyGetAllOrdersQuery, useGetOrderById2Query, useGetAllUsersQuery, useLazyGetAllUsersQuery, useUpdateOrderStatusMutation, useUpdateUserMutation, useGetUserByIdQuery, useGetUserOrdersQuery, useGetTopSellingProductsQuery, useGetReferralPerformanceQuery } = adminApi;
