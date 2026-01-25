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
            query: (data: { paymentIntentId: string; amount?: number }) => ({
                url: "/payment/refund",
                method: "POST",
                body: data,
            }),
        }),

        // ShipStation: Create order
        createShipStationOrder: builder.mutation({
            query: (orderId: string) => ({
                url: `/shipstation/order/${orderId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, orderId) => [{ type: "Orders", id: orderId }, "Orders"],
        }),

        // ShipStation: Get shipping rates
        getShippingRates: builder.query({
            query: (orderId: string) => ({
                url: `/shipstation/rates/${orderId}`,
            }),
        }),

        // ShipStation: Create shipping label
        createShippingLabel: builder.mutation({
            query: (orderId: string) => ({
                url: `/shipstation/label/${orderId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, orderId) => [{ type: "Orders", id: orderId }, "Orders"],
        }),

        // ShipStation: Update tracking
        updateTracking: builder.mutation({
            query: ({ orderId, trackingNumber, carrier }: { orderId: string; trackingNumber: string; carrier: string }) => ({
                url: `/shipstation/tracking/${orderId}`,
                method: "PUT",
                body: { trackingNumber, carrier },
            }),
            invalidatesTags: (result, error, { orderId }) => [{ type: "Orders", id: orderId }, "Orders"],
        }),

        // ShipStation: Mark as shipped
        markAsShipped: builder.mutation({
            query: (orderId: string) => ({
                url: `/shipstation/ship/${orderId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, orderId) => [{ type: "Orders", id: orderId }, "Orders"],
        }),

        // ShipStation: List orders
        listShipStationOrders: builder.query({
            query: (params?: { page?: number; pageSize?: number; orderStatus?: string; storeId?: number; customerName?: string; createDateStart?: string; createDateEnd?: string }) => ({
                url: "/shipstation/orders",
                params,
            }),
        }),
    }),
});

export const {
    useCreateCheckoutSessionMutation,
    useGetSessionStatusQuery,
    useLazyGetSessionStatusQuery,
    useCreatePaymentIntentMutation,
    useCreateRefundMutation,
    useCreateShipStationOrderMutation,
    useGetShippingRatesQuery,
    useLazyGetShippingRatesQuery,
    useCreateShippingLabelMutation,
    useUpdateTrackingMutation,
    useMarkAsShippedMutation,
    useListShipStationOrdersQuery,
    useLazyListShipStationOrdersQuery,
} = paymentApi;
