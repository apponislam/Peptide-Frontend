// // app/redux/features/shipment/shipmentApi.ts
// import { baseApi } from "../../api/baseApi";

// export const shipmentApi = baseApi.injectEndpoints({
//     endpoints: (builder) => ({
//         // Get all shipments/orders with filters
//         getShipments: builder.query({
//             query: (params?: { page?: number; limit?: number; status?: string; search?: string; startDate?: string; endDate?: string; hasTracking?: boolean }) => ({
//                 url: "/shipments",
//                 params,
//             }),
//             providesTags: ["Shipments"],
//         }),

//         // Get shipment by ID
//         getShipmentById: builder.query({
//             query: (id: string) => ({
//                 url: `/shipments/${id}`,
//             }),
//             providesTags: (result, error, id) => [{ type: "Shipments", id }],
//         }),

//         // Update shipment status
//         updateShipmentStatus: builder.mutation({
//             query: ({ id, status }: { id: string; status: string }) => ({
//                 url: `/shipments/${id}/status`,
//                 method: "PATCH",
//                 body: { status },
//             }),
//             invalidatesTags: (result, error, { id }) => [{ type: "Shipments", id }, "Shipments", "Orders"],
//         }),

//         // Add tracking number
//         addTracking: builder.mutation({
//             query: ({ id, trackingNumber, carrier }: { id: string; trackingNumber: string; carrier: string }) => ({
//                 url: `/shipments/${id}/tracking`,
//                 method: "POST",
//                 body: { trackingNumber, carrier },
//             }),
//             invalidatesTags: (result, error, { id }) => [{ type: "Shipments", id }, "Shipments", "Orders"],
//         }),

//         // Create shipping label
//         createShipmentLabel: builder.mutation({
//             query: ({ id, carrier, service }: { id: string; carrier: string; service: string }) => ({
//                 url: `/shipments/${id}/label`,
//                 method: "POST",
//                 body: { carrier, service },
//             }),
//             invalidatesTags: (result, error, { id }) => [{ type: "Shipments", id }, "Shipments", "Orders"],
//         }),

//         // Bulk create ShipStation orders
//         bulkCreateShipStation: builder.mutation({
//             query: (orderIds: string[]) => ({
//                 url: "/shipments/bulk/shipstation",
//                 method: "POST",
//                 body: { orderIds },
//             }),
//             invalidatesTags: ["Shipments", "Orders"],
//         }),

//         // Get shipment statistics
//         getShipmentStats: builder.query({
//             query: () => ({
//                 url: "/shipments/stats",
//             }),
//             providesTags: ["ShipmentStats"],
//         }),

//         // Get carriers list
//         getCarriers: builder.query({
//             query: () => ({
//                 url: "/shipments/carriers",
//             }),
//             providesTags: ["Carriers"],
//         }),

//         // Get shipping rates for order
//         getShipmentRates: builder.query({
//             query: (orderId: string) => ({
//                 url: `/shipments/${orderId}/rates`,
//             }),
//         }),

//         // Print shipping manifest
//         printManifest: builder.mutation({
//             query: ({ startDate, endDate }: { startDate: string; endDate: string }) => ({
//                 url: "/shipments/print-manifest",
//                 method: "POST",
//                 body: { startDate, endDate },
//             }),
//         }),

//         // Export shipments to CSV
//         exportShipments: builder.mutation({
//             query: (params?: any) => ({
//                 url: "/shipments/export",
//                 method: "POST",
//                 body: params,
//             }),
//         }),
//     }),
// });

// export const { useGetShipmentsQuery, useLazyGetShipmentsQuery, useGetShipmentByIdQuery, useUpdateShipmentStatusMutation, useAddTrackingMutation, useCreateShipmentLabelMutation, useBulkCreateShipStationMutation, useGetShipmentStatsQuery, useGetCarriersQuery, useGetShipmentRatesQuery, useLazyGetShipmentRatesQuery, usePrintManifestMutation, useExportShipmentsMutation } = shipmentApi;

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
        // ========== THAT'S IT, NO MORE ==========
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
} = shipmentApi;
