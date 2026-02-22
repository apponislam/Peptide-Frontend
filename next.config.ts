import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "http",
                hostname: "31.220.52.82",
                port: "3000",
                pathname: "/uploads/**",
            },
            {
                protocol: "https",
                hostname: "peptide.club",
                pathname: "/uploads/**",
            },
        ],
    },
};

export default nextConfig;
