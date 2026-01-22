export const getTier = (tierName: string | null | undefined) => {
    // Handle null/undefined/empty string
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
