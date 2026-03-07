import { Metadata } from "next";
import { AuthProvider } from "../contexts/AuthContext";
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
                <Header />
                {/* <main className="min-h-screen bg-linear-to-br from-[#010c20] via-[#143665] to-[#010c20]">{children}</main> */}
                <main className="min-h-screen bg-linear-to-br from-[#010c20] via-[#143665] to-[#010c20]">{children}</main>
                <CartSidebar />
            </AuthProvider>
        </>
    );
}
