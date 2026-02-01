import { baseApi } from "../../api/baseApi";

export const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Create checkout session
        createCheckoutSession: builder.mutation({
            query: (data: {
                userId: string;
                items: Array<{
                    productId: number;
                    name: string;
                    description: string;
                    price: number;
                    quantity: number;
                    size?: string;
                    image?: string;
                }>;
                shippingInfo: {
                    name: string;
                    email: string;
                    phone: string;
                    address: string;
                    city: string;
                    state: string;
                    zip: string;
                    country: string;
                };
                shippingAmount: number;
                subtotal: number;
                total: number;
                storeCreditUsed: number;
                metadata?: Record<string, any>;
            }) => ({
                url: "/payment/checkout",
                method: "POST",
                body: data,
            }),
        }),

        // Get session status
        getSessionStatus: builder.query({
            query: (sessionId: string) => ({
                url: `/payment/session/${sessionId}`,
            }),
        }),

        // Create payment intent
        createPaymentIntent: builder.mutation({
            query: (data: { amount: number; metadata?: Record<string, any> }) => ({
                url: "/payment/create-payment-intent",
                method: "POST",
                body: data,
            }),
        }),

        // Create refund
        createRefund: builder.mutation({
            query: (data: { orderId: string; amount?: number }) => ({
                url: "/payment/refund",
                method: "POST",
                body: data,
            }),
            invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }, { type: "DashboardStats" }],
        }),
    }),
});

export const { useCreateCheckoutSessionMutation, useGetSessionStatusQuery, useLazyGetSessionStatusQuery, useCreatePaymentIntentMutation, useCreateRefundMutation } = paymentApi;
