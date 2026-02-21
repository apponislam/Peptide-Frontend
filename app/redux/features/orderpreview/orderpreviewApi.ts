import { baseApi } from "../../api/baseApi";

export const orderPreviewApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create order preview
        createOrderPreview: builder.mutation({
            query: (data: { items: any[]; subtotal: number; shippingAmount: number; total: number }) => ({
                url: "/order-previews",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["OrderPreview"],
        }),

        // Get order preview by ID
        getOrderPreview: builder.query({
            query: (previewId: string) => ({
                url: `/order-previews/${previewId}`,
            }),
            providesTags: (result, error, previewId) => [{ type: "OrderPreview", id: previewId }],
        }),

        // Delete order preview
        deleteOrderPreview: builder.mutation({
            query: (previewId: string) => ({
                url: `/order-previews/${previewId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["OrderPreview"],
        }),
    }),
});

export const { useCreateOrderPreviewMutation, useLazyGetOrderPreviewQuery, useGetOrderPreviewQuery, useDeleteOrderPreviewMutation } = orderPreviewApi;
