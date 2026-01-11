"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { CartItem, Product, ProductSize } from "../types";

interface CartContextType {
    cart: CartItem[];
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    addToCart: (product: Product, size: ProductSize) => void;
    removeFromCart: (productId: number, mg: number) => void;
    cartTotal: () => number;
    cartCount: () => number;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem("peptide_cart");
        if (savedCart) {
            try {
                setCart(JSON.parse(savedCart));
            } catch (error) {
                console.error("Error loading cart:", error);
            }
        }
    }, []);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("peptide_cart", JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: Product, size: ProductSize) => {
        setCart((prevCart) => {
            const existingIndex = prevCart.findIndex((item) => item.product.id === product.id && item.size.mg === size.mg);

            if (existingIndex >= 0) {
                const newCart = [...prevCart];
                newCart[existingIndex].quantity += 1;
                return newCart;
            }

            return [...prevCart, { product, size, quantity: 1 }];
        });
    };

    const removeFromCart = (productId: number, mg: number) => {
        setCart((prevCart) => {
            const itemIndex = prevCart.findIndex((item) => item.product.id === productId && item.size.mg === mg);

            if (itemIndex >= 0) {
                const newCart = [...prevCart];
                if (newCart[itemIndex].quantity > 1) {
                    newCart[itemIndex].quantity -= 1;
                } else {
                    newCart.splice(itemIndex, 1);
                }
                return newCart;
            }
            return prevCart;
        });
    };

    const cartTotal = () => {
        return cart.reduce((sum, item) => sum + item.size.price * item.quantity, 0);
    };

    const cartCount = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const clearCart = () => {
        setCart([]);
    };

    return (
        <CartContext.Provider
            value={{
                cart,
                isOpen,
                setIsOpen,
                addToCart,
                removeFromCart,
                cartTotal,
                cartCount,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
