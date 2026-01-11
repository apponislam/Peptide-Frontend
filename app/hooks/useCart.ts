import { useState, useEffect } from "react";
import { CartItem, Product, ProductSize } from "../types";

export const useCart = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);

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
        return cart.reduce((sum, item) => {
            // You'll need to implement getMemberPrice here
            return sum + item.size.price * item.quantity;
        }, 0);
    };

    const cartCount = () => {
        return cart.reduce((sum, item) => sum + item.quantity, 0);
    };

    const clearCart = () => {
        setCart([]);
    };

    return {
        cart,
        isOpen,
        setIsOpen,
        addToCart,
        removeFromCart,
        cartTotal,
        cartCount,
        clearCart,
    };
};
