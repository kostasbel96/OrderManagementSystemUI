import { LayoutDashboard, Package, ShoppingCart, Users, Settings, Menu, X } from "lucide-react";
import { type ReactNode, useState } from "react";
import { NavLink } from "react-router";
import Footer from "./Footer.tsx";

export default function SidebarLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100">

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r transform transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
            >
                {/* Header in Sidebar for mobile */}
                <div className="flex items-center justify-between border-b md:hidden">
                    <span className="font-bold text-lg">Admin Panel</span>
                    <button onClick={() => setOpen(false)}>
                        <X />
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex flex-col p-4 gap-2 text-gray-700">
                    <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" />
                    <NavItem to="/products" icon={<Package size={18} />} label="Products" />
                    <NavItem to="/orders" icon={<ShoppingCart size={18} />} label="Orders" />
                    <NavItem to="/customers" icon={<Users size={18} />} label="Customers" />
                    <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" />
                </nav>
            </aside>

            {/* Overlay for mobile */}
            {open && <div className="fixed inset-0 bg-black/30 md:hidden" onClick={() => setOpen(false)} />}

            {/* Main content */}
            <div className="w-full">
                {/* Header with mobile menu button */}
                <header className="h-16 flex items-center justify-between px-4 bg-white border-b md:px-8">
                    <button className="md:hidden" onClick={() => setOpen(true)}>
                        <Menu />
                    </button>
                    <h1 className="font-semibold text-gray-700">Dashboard</h1>
                </header>

                <main className="overflow-y-auto h-[calc(100vh-7.5rem)]">{children}</main>
                <Footer />
            </div>
        </div>
    );
}

type NavItemProps = {
    to: string;
    icon: ReactNode;
    label: string;
};

function NavItem({ to, icon, label }: NavItemProps) {
    return (
        <NavLink
            to={to}
            className={({ isActive }: { isActive: boolean }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition
         ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`
            }
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </NavLink>
    );
}