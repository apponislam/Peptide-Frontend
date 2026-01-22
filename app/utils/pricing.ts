export const getTier = (tierName: string | null | undefined) => {
    if (!tierName) {
        return { name: "Member", discount: 10, commission: 0, freeShipping: false };
    }
    const normalizedTier = tierName.toLowerCase().trim();
    if (normalizedTier === "founder") {
        return { name: "Founder", discount: 20, commission: 15, freeShipping: true };
    }
    if (normalizedTier === "vip") {
        return { name: "VIP", discount: 20, commission: 10, freeShipping: true };
    }
    return { name: "Member", discount: 10, commission: 0, freeShipping: false };
};

export const getMemberPrice = (price: number, user: { tier?: string } | null) => {
    const tier = getTier(user?.tier);
    return (price * (1 - tier.discount / 100)).toFixed(2);
};
