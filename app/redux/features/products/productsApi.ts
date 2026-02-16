import { baseApi } from "../../api/baseApi";

export const productsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: (params?: { search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc" }) => ({
                url: "/products",
                params: params,
            }),
            providesTags: ["Products"],
        }),

        // Get single product by ID
        getSingleProduct: builder.query({
            query: (id: number) => ({
                url: `/products/${id}`,
            }),
            providesTags: (result, error, id) => [{ type: "Products", id }],
        }),

        // Create a new product
        createProduct: builder.mutation({
            query: (data) => ({
                url: "/products",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Products"],
        }),

        // Update product by ID
        updateProduct: builder.mutation({
            query: ({ id, data }) => ({
                url: `/products/${id}`,
                method: "PATCH", // Changed from PUT to PATCH
                body: data,
            }),
            invalidatesTags: (result, error, { id }) => ["Products", { type: "Products", id }],
        }),

        // Delete product by ID
        deleteProduct: builder.mutation({
            query: (id: number) => ({
                url: `/products/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: ["Products"],
        }),

        // NEW: Get deleted products (admin only) - from your routes
        getDeletedProducts: builder.query({
            query: () => ({
                url: "/products/admin/deleted",
            }),
            providesTags: ["DeletedProducts"],
        }),

        // NEW: Restore deleted product (admin only) - from your routes
        restoreProduct: builder.mutation({
            query: (id: number) => ({
                url: `/products/admin/restore/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: ["Products", "DeletedProducts"],
        }),

        // Admin - Get all products (no stock filters, only isDeleted: false)
        getAdminProducts: builder.query({
            query: (params?: { search?: string; page?: number; limit?: number; sortBy?: string; sortOrder?: "asc" | "desc" }) => ({
                url: "/products/admin",
                params: params,
            }),
            providesTags: ["Products"],
        }),

        // Admin - Get single product by ID (no stock filters, only isDeleted: false)
        getAdminSingleProduct: builder.query({
            query: (id: number) => ({
                url: `/products/admin/${id}`,
            }),
            providesTags: (result, error, id) => [{ type: "Products", id }],
        }),

        getProductsByIds: builder.mutation({
            query: (ids: number[]) => ({
                url: "/products/get-by-ids",
                method: "POST",
                body: { ids },
            }),
        }),
        toggleProductStock: builder.mutation({
            query: (id: number) => ({
                url: `/products/admin/toggle-stock/${id}`,
                method: "PATCH",
            }),
            invalidatesTags: (result, error, id) => ["Products", { type: "Products", id }],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useLazyGetProductsQuery,
    useGetSingleProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
    // New exports
    useGetDeletedProductsQuery,
    useRestoreProductMutation,

    // for admin
    useGetAdminProductsQuery,
    useGetAdminSingleProductQuery,
    useGetProductsByIdsMutation,
    useToggleProductStockMutation,
} = productsApi;
