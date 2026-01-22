// ../lib/products.ts

export const getTier = (tierOrCount: string | number) => {
    // If it's a number (legacy referralCount support)
    if (typeof tierOrCount === "number") {
        if (tierOrCount >= 10) return { name: "Founder", discount: 20, commission: 15, freeShipping: true };
        if (tierOrCount >= 3) return { name: "VIP", discount: 20, commission: 10, freeShipping: true };
        return { name: "Member", discount: 10, commission: 0, freeShipping: false };
    }

    // If it's a string (tier from user.tier)
    const tierName = tierOrCount.toString().toLowerCase();

    if (tierName === "founder") {
        return { name: "Founder", discount: 20, commission: 15, freeShipping: true };
    }
    if (tierName === "vip") {
        return { name: "VIP", discount: 20, commission: 10, freeShipping: true };
    }
    // Default to Member
    return { name: "Member", discount: 10, commission: 0, freeShipping: false };
};

// export const getMemberPrice = (price: number, user: User | null) => {
//     if (!user) return price.toFixed(2);
//     const tier = getTier(user.tier || "Member"); // Updated to use user.tier
//     return (price * (1 - tier.discount / 100)).toFixed(2);
// };
