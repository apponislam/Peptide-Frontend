import { Product, User } from "../types";

// export const PRODUCTS: Product[] = [
//     {
//         id: 1,
//         name: "Retatrutide",
//         sizes: [{ mg: 10, price: 129 }],
//         desc: "Triple receptor agonist for laboratory research.",
//         details: "Retatrutide (LY3437943) is a synthetic research peptide used in laboratory settings only.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/37366315/",
//                 title: "Triple-Hormone-Receptor Agonist Retatrutide for Obesity: A Phase 2 Trial",
//             },
//         ],
//     },
//     {
//         id: 2,
//         name: "BPC-157",
//         sizes: [{ mg: 10, price: 65 }],
//         desc: "Pentadecapeptide for tissue research.",
//         details: "BPC-157 is a synthetic peptide composed of 15 amino acids used in laboratory research settings.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/40131143/",
//                 title: "Safety of Intravenous Infusion of BPC157 in Humans",
//             },
//         ],
//     },
//     {
//         id: 3,
//         name: "KPV",
//         sizes: [{ mg: 10, price: 49 }],
//         desc: "Tripeptide for cellular research.",
//         details: "KPV is a synthetic tripeptide used in laboratory research applications.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/18061177/",
//                 title: "PepT1-mediated tripeptide KPV uptake reduces intestinal inflammation",
//             },
//         ],
//     },
//     {
//         id: 4,
//         name: "Ipamorelin",
//         sizes: [{ mg: 10, price: 57 }],
//         desc: "Growth hormone secretagogue for research.",
//         details: "Ipamorelin is a synthetic pentapeptide used in laboratory research settings.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/9849822/",
//                 title: "Ipamorelin, the first selective growth hormone secretagogue",
//             },
//         ],
//     },
//     {
//         id: 5,
//         name: "Tesamorelin",
//         sizes: [{ mg: 10, price: 69 }],
//         desc: "GHRH analog for laboratory research.",
//         details: "Tesamorelin is a synthetic research peptide analog used in laboratory settings.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/20101189/",
//                 title: "Effects of tesamorelin in HIV-infected patients with excess abdominal fat",
//             },
//         ],
//     },
//     {
//         id: 6,
//         name: "NAD+",
//         sizes: [{ mg: 100, price: 29 }],
//         desc: "Energy metabolism coenzyme for research.",
//         details: "NAD+ (Nicotinamide Adenine Dinucleotide) is a synthetic coenzyme used extensively in laboratory research settings.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/33353981/",
//                 title: "NAD+ metabolism and its roles in cellular processes during ageing",
//             },
//         ],
//     },
//     {
//         id: 7,
//         name: "GHK-Cu",
//         sizes: [{ mg: 100, price: 67 }],
//         desc: "Copper peptide complex for research.",
//         details: "GHK-Cu is a synthetic copper tripeptide complex used in laboratory research.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/3169264/",
//                 title: "Stimulation of collagen synthesis in fibroblast cultures by tripeptide-copper complex",
//             },
//         ],
//     },
//     {
//         id: 8,
//         name: "Melanotan I",
//         sizes: [{ mg: 10, price: 39 }],
//         desc: "Alpha-MSH analog for research.",
//         details: "Melanotan I is a synthetic research peptide analog used in laboratory settings.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/16293341/",
//                 title: "Effect of Melanotan on melanin synthesis in humans with MC1R variant alleles",
//             },
//         ],
//     },
//     {
//         id: 9,
//         name: "TB-500",
//         sizes: [{ mg: 10, price: 69 }],
//         desc: "Thymosin beta-4 analog for research.",
//         details: "TB-500 (Thymosin Beta-4 analog) is a synthetic peptide composed of 43 amino acids used in laboratory research settings.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/23050815/",
//                 title: "The regenerative peptide thymosin β4 accelerates the rate of dermal healing",
//             },
//         ],
//     },
//     {
//         id: 10,
//         name: "MOTS-c",
//         sizes: [{ mg: 10, price: 49 }],
//         desc: "Mitochondrial peptide for metabolism research.",
//         details: "MOTS-c is a synthetic research peptide used in laboratory settings.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/25738459/",
//                 title: "The mitochondrial-derived peptide MOTS-c promotes metabolic homeostasis",
//             },
//         ],
//     },
//     {
//         id: 11,
//         name: "Semax",
//         sizes: [{ mg: 11, price: 43 }],
//         desc: "ACTH-derived heptapeptide for research.",
//         details: "Semax is a synthetic heptapeptide (7 amino acids) used in laboratory research settings.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/32580520/",
//                 title: "Novel insights into protective properties of ACTH(4-7)PGP semax peptide",
//             },
//         ],
//     },
//     {
//         id: 12,
//         name: "SLU-PP-322",
//         sizes: [{ mg: 5, price: 89 }],
//         desc: "ERR agonist for metabolic research.",
//         details: "SLU-PP-322 is a synthetic research peptide used in laboratory settings for academic investigation.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/37739806/",
//                 title: "A Synthetic ERR Agonist Alleviates Metabolic Syndrome",
//             },
//         ],
//     },
//     {
//         id: 13,
//         name: "Epithalon",
//         sizes: [{ mg: 10, price: 45 }],
//         desc: "Pineal tetrapeptide for research.",
//         details: "Epithalon is a synthetic tetrapeptide (4 amino acids) used in laboratory research applications.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/40141333/",
//                 title: "Overview of Epitalon-Highly Bioactive Pineal Tetrapeptide with Promising Properties",
//             },
//         ],
//     },
//     {
//         id: 14,
//         name: "Glutathione",
//         sizes: [{ mg: 1500, price: 89 }],
//         desc: "Antioxidant tripeptide for research.",
//         details: "Glutathione is a synthetic tripeptide compound used in laboratory research.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/36707132/",
//                 title: "The antioxidant glutathione",
//             },
//         ],
//     },
//     {
//         id: 15,
//         name: "PT-141",
//         sizes: [{ mg: 10, price: 46 }],
//         desc: "Melanocortin receptor agonist for research.",
//         details: "PT-141 is a synthetic research peptide used in laboratory settings.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/16839319/",
//                 title: "Effect on subjective sexual response by bremelanotide",
//             },
//         ],
//     },
//     {
//         id: 16,
//         name: "BAC Water 3mL",
//         sizes: [{ mg: 3, price: 6 }],
//         desc: "Sterile bacteriostatic water for research.",
//         details: "Bacteriostatic Water (3mL) is sterile water containing 0.9% benzyl alcohol used for reconstituting research peptides.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/",
//                 title: "PubMed Research Database",
//             },
//         ],
//     },
//     {
//         id: 17,
//         name: "BAC Water 10mL",
//         sizes: [{ mg: 10, price: 12 }],
//         desc: "Sterile bacteriostatic water for research.",
//         details: "Bacteriostatic Water (10mL) is sterile water containing 0.9% benzyl alcohol used for reconstituting multiple research peptide vials.",
//         references: [
//             {
//                 url: "https://pubmed.ncbi.nlm.nih.gov/",
//                 title: "PubMed Research Database",
//             },
//         ],
//     },
// ];

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
