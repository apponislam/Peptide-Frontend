import { baseApi } from "../../api/baseApi";

export const shipmentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // ========== ONLY 6 SHIPSTATION ENDPOINTS ==========
        // 1. Create ShipStation order
        createShipStationOrder: builder.mutation({
            query: (orderId: string) => ({
                url: `/shipment/order/${orderId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, orderId) => [{ type: "ShipStationOrders", id: orderId }, "ShipStationOrders"],
        }),

        // 2. Get ShipStation shipping rates
        getShipStationRates: builder.query({
            query: (orderId: string) => ({
                url: `/shipment/rates/${orderId}`,
            }),
        }),

        // 3. Create ShipStation label
        createShipStationLabel: builder.mutation({
            query: (orderId: string) => ({
                url: `/shipment/label/${orderId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, orderId) => [{ type: "ShipStationOrders", id: orderId }, "ShipStationOrders"],
        }),

        // 4. List ShipStation orders
        listShipStationOrders: builder.query({
            query: (params?: { page?: number; pageSize?: number; orderStatus?: string; storeId?: number; customerName?: string; createDateStart?: string; createDateEnd?: string }) => ({
                url: "/shipment/orders",
                params,
            }),
            providesTags: ["ShipStationOrders"],
        }),

        // 5. Update ShipStation tracking
        updateShipStationTracking: builder.mutation({
            query: ({ orderId, trackingNumber, carrier }: { orderId: string; trackingNumber: string; carrier: string }) => ({
                url: `/shipment/tracking/${orderId}`,
                method: "PUT",
                body: { trackingNumber, carrier },
            }),
            invalidatesTags: (result, error, { orderId }) => [{ type: "ShipStationOrders", id: orderId }, "ShipStationOrders"],
        }),

        // 6. Mark as shipped in ShipStation
        markAsShipped: builder.mutation({
            query: (orderId: string) => ({
                url: `/shipment/ship/${orderId}`,
                method: "POST",
            }),
            invalidatesTags: (result, error, orderId) => [{ type: "ShipStationOrders", id: orderId }, "ShipStationOrders"],
        }),
        // 7. Get carriers list (NEW - Added because you added the route)
        getCarriers: builder.query({
            query: () => ({
                url: "/shipment/carriers",
            }),
            providesTags: ["Carriers"],
        }),
        getWarehouses: builder.query({
            query: () => ({
                url: "/shipment/warehouses",
            }),
            providesTags: ["Warehouses"],
        }),

        // 9. NEW: Mark order as delivered
        markAsDelivered: builder.mutation({
            query: (orderId: string) => ({
                url: `/shipment/delivered/${orderId}`,
                method: "PUT",
            }),
            invalidatesTags: (result, error, orderId) => [{ type: "ShipStationOrders", id: orderId }, { type: "Orders", id: orderId }, "ShipStationOrders", "Orders"],
        }),

        // 10. NEW: Cancel order
        cancelOrder: builder.mutation({
            query: (orderId: string) => ({
                url: `/shipment/order/${orderId}/cancel`,
                method: "POST",
            }),
            invalidatesTags: ["Orders", "ShipStationOrders"],
        }),
    }),
});

export const {
    // ONLY 6 exports - no more, no less
    useCreateShipStationOrderMutation,
    useGetShipStationRatesQuery,
    useCreateShipStationLabelMutation,
    useListShipStationOrdersQuery,
    useUpdateShipStationTrackingMutation,
    useMarkAsShippedMutation,
    useGetCarriersQuery,
    useGetWarehousesQuery,
    useMarkAsDeliveredMutation,
    useCancelOrderMutation,
} = shipmentApi;
