"use client";

import ProductCard from "@/app/components/ProductCard";
import { PRODUCTS } from "@/app/lib/products";
import { useState } from "react";
// import ProductCard from "@/components/ProductCard";
// import { PRODUCTS } from "@/lib/products";

export default function StorePage() {
    const [searchQuery, setSearchQuery] = useState("");

    const filteredProducts = PRODUCTS.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()) || product.desc.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="container mx-auto px-4 py-6 md:py-8">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">Research Peptides & Compounds</h1>

            {/* Products Grid */}
            <div className="product-grid grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">{filteredProducts.length === 0 ? <div className="col-span-full text-center text-gray-400 py-12">No products found</div> : filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div>
        </div>
    );
}
