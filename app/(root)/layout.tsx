import { Metadata } from "next";
import { AuthProvider } from "../contexts/AuthContext";
import { CartProvider } from "../contexts/CartContext";
import Header from "../components/Header";
import CartSidebar from "../components/CartSidebar";

export const metadata: Metadata = {
    title: "Peptide Club",
    description: "Research peptides for laboratory use",
};

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AuthProvider>
                <CartProvider>
                    <Header />
                    <main className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900">{children}</main>
                    <CartSidebar />
                </CartProvider>
            </AuthProvider>
        </>
    );
}
