import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ReduxProvider } from "./providers/ReduxProvider";
import { ModalProvider } from "./providers/ModalContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "PEPTIDE.CLUB - Research Peptides",
    description: "Premium Peptides Delivered",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <head suppressHydrationWarning={true}>
                <meta property="og:title" content="PEPTIDE.CLUB" />
                <meta property="og:description" content="Premium Peptides Delivered" />
                <meta property="og:image" content="https://peptide.club/social.jpg" />
                <meta property="og:image:secure_url" content="https://peptide.club/social.jpg" />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <meta property="og:url" content="https://peptide.club" />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="PEPTIDE.CLUB" />
                <meta name="twitter:description" content="Premium Peptides Delivered" />
                <meta name="twitter:image" content="https://peptide.club/social.jpg" />
            </head>
            <body className={`${inter.className}`} style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
                <ReduxProvider>
                    <ModalProvider>{children}</ModalProvider>
                </ReduxProvider>
            </body>
        </html>
    );
}
