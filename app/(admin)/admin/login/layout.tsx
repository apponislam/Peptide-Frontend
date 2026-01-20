import AdminProvider from "@/app/providers/AdminProvider";
import React, { ReactNode } from "react";

interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
    return <AdminProvider allowNonAdmin={true}>{children}</AdminProvider>;
};

export default AdminLayout;
