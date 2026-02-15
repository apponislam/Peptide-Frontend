// import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// export interface ProductSize {
//     mg: number;
//     price: number;
// }

// export interface Product {
//     id: number;
//     name: string;
//     desc?: string;
//     details?: string;
//     sizes: ProductSize[];
//     coa?: string | null;
//     createdAt?: string;
//     deletedAt?: string | null;
//     isDeleted?: boolean;
//     references?: any[];
//     updatedAt?: string;
// }

// export interface CartItem {
//     product: Product;
//     size: ProductSize;
//     quantity: number;
// }

// interface CartState {
//     items: CartItem[];
//     isOpen: boolean;
// }

// const initialState: CartState = {
//     items: [],
//     isOpen: false,
// };

// const cartSlice = createSlice({
//     name: "cart",
//     initialState,
//     reducers: {
//         openCart: (state) => {
//             state.isOpen = true;
//         },
//         closeCart: (state) => {
//             state.isOpen = false;
//         },
//         toggleCart: (state) => {
//             state.isOpen = !state.isOpen;
//         },
//         addToCart: (state, action: PayloadAction<{ product: Product; size: ProductSize }>) => {
//             const { product, size } = action.payload;
//             const existingIndex = state.items.findIndex((item) => item.product.id === product.id && item.size.mg === size.mg);

//             if (existingIndex >= 0) {
//                 state.items[existingIndex].quantity += 1;
//             } else {
//                 state.items.push({ product, size, quantity: 1 });
//             }
//         },
//         removeFromCart: (state, action: PayloadAction<{ productId: number; mg: number }>) => {
//             const { productId, mg } = action.payload;
//             const itemIndex = state.items.findIndex((item) => item.product.id === productId && item.size.mg === mg);

//             if (itemIndex >= 0) {
//                 if (state.items[itemIndex].quantity > 1) {
//                     state.items[itemIndex].quantity -= 1;
//                 } else {
//                     state.items.splice(itemIndex, 1);
//                 }
//             }
//         },
//         removeItemCompletely: (state, action: PayloadAction<{ productId: number; mg: number }>) => {
//             const { productId, mg } = action.payload;
//             state.items = state.items.filter((item) => !(item.product.id === productId && item.size.mg === mg));
//         },
//         updateQuantity: (state, action: PayloadAction<{ productId: number; mg: number; quantity: number }>) => {
//             const { productId, mg, quantity } = action.payload;
//             const itemIndex = state.items.findIndex((item) => item.product.id === productId && item.size.mg === mg);

//             if (itemIndex >= 0) {
//                 if (quantity <= 0) {
//                     state.items.splice(itemIndex, 1);
//                 } else {
//                     state.items[itemIndex].quantity = quantity;
//                 }
//             }
//         },
//         clearCart: (state) => {
//             state.items = [];
//         },
//     },
// });

// export const { openCart, closeCart, toggleCart, addToCart, removeFromCart, removeItemCompletely, updateQuantity, clearCart } = cartSlice.actions;

// export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
// export const selectCartOpen = (state: { cart: CartState }) => state.cart.isOpen;
// export const selectCartCount = (state: { cart: CartState }) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
// export const selectCartTotal = (state: { cart: CartState }) => state.cart.items.reduce((sum, item) => sum + item.size.price * item.quantity, 0);

// export default cartSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ProductSize {
    mg: number;
    price: number;
    quantity: number;
}

export interface Product {
    id: number;
    name: string;
    desc?: string;
    details?: string;
    sizes: ProductSize[];
    coa?: string | null;
    createdAt?: string;
    deletedAt?: string | null;
    isDeleted?: boolean;
    references?: any[];
    updatedAt?: string;
}

export interface CartItem {
    product: Product;
    size: ProductSize;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    isOpen: boolean;
}

const initialState: CartState = {
    items: [],
    isOpen: false,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        openCart: (state) => {
            state.isOpen = true;
        },
        closeCart: (state) => {
            state.isOpen = false;
        },
        toggleCart: (state) => {
            state.isOpen = !state.isOpen;
        },
        addToCart: (state, action: PayloadAction<{ product: Product; size: ProductSize }>) => {
            const { product, size } = action.payload;
            const existingIndex = state.items.findIndex((item) => item.product.id === product.id && item.size.mg === size.mg);

            if (existingIndex >= 0) {
                state.items[existingIndex].quantity += 1;
            } else {
                state.items.push({ product, size, quantity: 1 });
            }
        },
        removeFromCart: (state, action: PayloadAction<{ productId: number; mg: number }>) => {
            const { productId, mg } = action.payload;
            const itemIndex = state.items.findIndex((item) => item.product.id === productId && item.size.mg === mg);

            if (itemIndex >= 0) {
                if (state.items[itemIndex].quantity > 1) {
                    state.items[itemIndex].quantity -= 1;
                } else {
                    state.items.splice(itemIndex, 1);
                }
            }
        },
        removeItemCompletely: (state, action: PayloadAction<{ productId: number; mg: number }>) => {
            const { productId, mg } = action.payload;
            state.items = state.items.filter((item) => !(item.product.id === productId && item.size.mg === mg));
        },
        updateQuantity: (state, action: PayloadAction<{ productId: number; mg: number; quantity: number }>) => {
            const { productId, mg, quantity } = action.payload;
            const itemIndex = state.items.findIndex((item) => item.product.id === productId && item.size.mg === mg);

            if (itemIndex >= 0) {
                if (quantity <= 0) {
                    state.items.splice(itemIndex, 1);
                } else {
                    state.items[itemIndex].quantity = quantity;
                }
            }
        },
        clearCart: (state) => {
            state.items = [];
        },
    },
});

export const { openCart, closeCart, toggleCart, addToCart, removeFromCart, removeItemCompletely, updateQuantity, clearCart } = cartSlice.actions;

export const selectCartItems = (state: { cart: CartState }) => state.cart.items;
export const selectCartOpen = (state: { cart: CartState }) => state.cart.isOpen;
export const selectCartCount = (state: { cart: CartState }) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectCartTotal = (state: { cart: CartState }) => state.cart.items.reduce((sum, item) => sum + item.size.price * item.quantity, 0);

export default cartSlice.reducer;
