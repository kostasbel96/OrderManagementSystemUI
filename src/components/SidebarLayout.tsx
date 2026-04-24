import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    Menu,
    X,
    PlusIcon,
    Linkedin,
    Github
} from "lucide-react";
import { type ReactNode, useState } from "react";
import { NavLink } from "react-router";
import {Tooltip} from "@mui/material";
import {useUIStore} from "../store/useUIStore.ts";

export default function SidebarLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    const collapsed = useUIStore((s) => s.sidebarCollapsed);
    const toggleSidebar = useUIStore((s) => s.toggleSidebar);

    return (
        <div className="flex h-screen bg-gray-100">

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full bg-white border-r
                    transition-all duration-300
                    ${collapsed ? "w-16" : "w-64"}
                `}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between p-2 border-b">

                    {!collapsed && (
                        <span className="font-bold text-lg">Admin</span>
                    )}

                    <div className="flex items-center justify-center gap-2">
                        <button
                            onClick={() => toggleSidebar()}
                            className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100"
                        >
                            {collapsed ? <Menu size={18} /> : <X size={18} />}
                        </button>
                    </div>
                </div>

                {/* NAV */}
                <nav className="flex flex-col p-2 gap-1 text-gray-700">

                    <NavItem
                        to="/"
                        icon={<LayoutDashboard size={18} />}
                        label="Dashboard"
                        collapsed={collapsed}
                        setOpen={setOpen}
                    />

                    <NavItem
                        to="/add"
                        icon={<PlusIcon size={18} />}
                        label="Add"
                        collapsed={collapsed}
                        setOpen={setOpen}
                    />

                    <NavItem
                        to="/products"
                        icon={<Package size={18} />}
                        label="Products"
                        collapsed={collapsed}
                        setOpen={setOpen}
                    />

                    <NavItem
                        to="/orders"
                        icon={<ShoppingCart size={18} />}
                        label="Orders"
                        collapsed={collapsed}
                        setOpen={setOpen}
                    />

                    <NavItem
                        to="/customers"
                        icon={<Users size={18} />}
                        label="Customers"
                        collapsed={collapsed}
                        setOpen={setOpen}
                    />

                    <NavItem
                        to="/settings"
                        icon={<Settings size={18} />}
                        label="Settings"
                        collapsed={collapsed}
                        setOpen={setOpen}
                    />
                </nav>

                {/* SOCIAL */}
                <div className="absolute bottom-0 w-full p-3 flex justify-center gap-3 text-xs">
                    <a href="https://www.linkedin.com" target="_blank">
                        <Linkedin size={18} />
                    </a>
                    <a href="https://github.com" target="_blank">
                        <Github size={18} />
                    </a>
                </div>
            </aside>

            {/* OVERLAY */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/30"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* MAIN */}
            <div className={`flex-1 w-full ml-16 ${collapsed ? "md:ml-16" : "md:ml-64"}`}>

                {/* CONTENT */}
                <main className="overflow-y-auto p-2">
                    {children}
                </main>
            </div>
        </div>
    );
}

/* ---------------- NAV ITEM ---------------- */

type NavItemProps = {
    to: string;
    icon: ReactNode;
    label: string;
    collapsed: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function NavItem({
                     to,
                     icon,
                     label,
                     collapsed,
                     setOpen
                 }: Readonly<NavItemProps>) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition
                ${collapsed ? "justify-center" : ""}
                ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`
            }
            onClick={() => {
                setOpen(false);
            }}
        >
            <Tooltip
                title={collapsed ? label : ""}
                placement="right"
                arrow
            >
                <div className="flex items-center gap-3 w-full">
                    {icon}

                    {!collapsed && (
                        <span className="text-sm font-medium">
                            {label}
                        </span>
                    )}
                </div>
            </Tooltip>
        </NavLink>
    );
}