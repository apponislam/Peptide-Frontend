import { Product, User } from "../types";

export const PRODUCTS: Product[] = [
    {
        id: 1,
        name: "Retatrutide",
        sizes: [{ mg: 10, price: 129 }],
        desc: "Triple receptor agonist for laboratory research.",
        details: "Retatrutide (LY3437943) is a synthetic research peptide used in laboratory settings only.",
        references: [
            {
                url: "https://pubmed.ncbi.nlm.nih.gov/37366315/",
                title: "Triple-Hormone-Receptor Agonist Retatrutide for Obesity: A Phase 2 Trial",
            },
        ],
    },
    // ... Add all other products from your original code
];

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
