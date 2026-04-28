import { Product, User } from "../types";

export const getTier = (count: number) => {
    if (count >= 10) return { name: "Founder", discount: 20, commission: 15, freeShipping: true };
    if (count >= 3) return { name: "VIP", discount: 20, commission: 10, freeShipping: true };
    return { name: "Member", discount: 10, commission: 0, freeShipping: false };
};

export const getMemberPrice = (price: number, user: User | null) => {
    if (!user) return price.toFixed(2);
    const tier = getTier(user.referralCount || 0);
    return (price * (1 - tier.discount / 100)).toFixed(2);
};
