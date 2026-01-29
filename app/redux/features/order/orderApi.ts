import { baseApi } from "../../api/baseApi";

export enum OrderStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    SHIPPED = "SHIPPED",
    CANCELLED = "CANCELLED",
}

export const orderApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: (params?: { page?: number; limit?: number; status?: OrderStatus | string; startDate?: string; endDate?: string; sortBy?: string; sortOrder?: "asc" | "desc" }) => ({
                url: "/orders",
                params,
            }),
            providesTags: ["Orders"],
        }),

        getOrder: builder.query({
            query: (orderId: string) => ({
                url: `/orders/${orderId}`,
            }),
            providesTags: (result, error, orderId) => [{ type: "Orders", id: orderId }],
        }),
    }),
});

export const { useGetOrdersQuery, useLazyGetOrdersQuery, useGetOrderQuery, useLazyGetOrderQuery } = orderApi;
