export interface Product {
    id: number;
    name: string;
    sizes: ProductSize[];
    desc: string;
    details: string;
    references: Reference[];
}

export interface ProductSize {
    mg: number;
    price: number;
}

export interface Reference {
    url: string;
    title: string;
}

export interface CartItem {
    product: Product;
    size: ProductSize;
    quantity: number;
}

export interface User {
    id?: string;
    email: string;
    referralCount: number;
    referralCode: string;
    storeCredit: number;
    tier?: string;
    isAdmin?: boolean;
    referredBy?: string;
    // orders: any[];
}

export interface Order {
    id: string;
    date: Date;
    items: OrderItem[];
    subtotal: number;
    shipping: number;
    creditUsed: number;
    total: number;
    createdAt?: Date;
}

export interface OrderItem {
    id: number;
    name: string;
    mg: number;
    quantity: number;
}

export interface Tier {
    name: string;
    discount: number;
    commission: number;
    freeShipping: boolean;
}
