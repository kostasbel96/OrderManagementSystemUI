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
import { type ReactNode, useState, useEffect } from "react";
import {Tooltip} from "@mui/material";
import {useUIStore} from "../hooks/store/useUIStore.ts";
import {useTabs} from "../contexts/TabContext.tsx";
import ProductsView from "./products/ProductsView.tsx";
import OrdersView from "./orders/OrdersView.tsx";
import CustomersView from "./customers/CustomersView.tsx";
import Dashboard from "./Dashboard.tsx";
import QuickAdd from "./QuickAdd.tsx";
import MySettings from "./Settings.tsx";

export default function SidebarLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const { addTab } = useTabs();

    const collapsed = useUIStore((s) => s.sidebarCollapsed);
    const toggleSidebar = useUIStore((s) => s.toggleSidebar);

    // Αρχικοποίηση με το Dashboard tab
    useEffect(() => {
        addTab({
            id: 'dashboard',
            label: 'Dashboard',
            component: <Dashboard />,
            path: '/'
        });
    }, []);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">

            {/* SIDEBAR */}
            <aside
                className={`
                    fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-200
                    transition-all duration-300
                    ${collapsed ? "w-16" : "w-64"}
                `}
            >
                {/* HEADER */}
                <div className="flex items-center justify-between p-2 border-b border-gray-200">

                    {!collapsed && (
                        <span className="font-bold text-lg text-blue-600 ml-2">OMS Admin</span>
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
                        id="dashboard"
                        icon={<LayoutDashboard size={18} />}
                        label="Dashboard"
                        collapsed={collapsed}
                        setOpen={setOpen}
                        component={<Dashboard />}
                    />

                    <NavItem
                        id="add"
                        icon={<PlusIcon size={18} />}
                        label="Add"
                        collapsed={collapsed}
                        setOpen={setOpen}
                        component={<QuickAdd />}
                    />

                    <NavItem
                        id="products"
                        icon={<Package size={18} />}
                        label="Products"
                        collapsed={collapsed}
                        setOpen={setOpen}
                        component={<ProductsView />}
                    />

                    <NavItem
                        id="orders"
                        icon={<ShoppingCart size={18} />}
                        label="Orders"
                        collapsed={collapsed}
                        setOpen={setOpen}
                        component={<OrdersView selection={false}/>}
                    />

                    <NavItem
                        id="customers"
                        icon={<Users size={18} />}
                        label="Customers"
                        collapsed={collapsed}
                        setOpen={setOpen}
                        component={<CustomersView />}
                    />

                    <NavItem
                        id="settings"
                        icon={<Settings size={18} />}
                        label="Settings"
                        collapsed={collapsed}
                        setOpen={setOpen}
                        component={<MySettings />}
                    />
                </nav>

                {/* SOCIAL */}
                <div className="absolute bottom-0 w-full p-3 flex justify-center gap-3 text-xs border-t border-gray-200">
                    <a href="https://www.linkedin.com" target="_blank" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Linkedin size={18} />
                    </a>
                    <a href="https://github.com" target="_blank" className="text-gray-400 hover:text-black transition-colors">
                        <Github size={18} />
                    </a>
                </div>
            </aside>

            {/* OVERLAY for mobile (optional) */}
            {open && (
                <button
                    className="fixed inset-0 bg-black/30 z-40"
                    onClick={() => setOpen(false)}
                />
            )}

            {/* MAIN CONTENT AREA */}
            <div className={`flex-1 flex flex-col h-full transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}>
                <main className="flex-1 max-h-[100vh] max-w-[100vw] overflow-hidden relative">
                    {children}
                </main>
            </div>
        </div>
    );
}

/* ---------------- NAV ITEM ---------------- */

type NavItemProps = {
    id: string;
    icon: ReactNode;
    label: string;
    collapsed: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    component: ReactNode;
};

function NavItem({
                     id,
                     icon,
                     label,
                     collapsed,
                     setOpen,
                     component
                 }: Readonly<NavItemProps>) {
    const { addTab, activeTabId } = useTabs();
    const isActive = activeTabId === id;

    return (
        <button
            onClick={() => {
                addTab({ id, label, component, path: id });
                setOpen(false);
            }}
            className={`
                flex items-center gap-3 px-3 py-2 rounded-lg transition w-full text-left
                ${collapsed ? "justify-center" : ""}
                ${isActive ? "bg-blue-50 text-blue-600 shadow-sm" : "hover:bg-gray-100 text-gray-600"}
            `}
        >
            <Tooltip
                title={collapsed ? label : ""}
                placement="right"
                arrow
            >
                <div className={`flex items-center gap-3 w-full ${collapsed ? "justify-center" : ""}`}>
                    <span className={isActive ? "text-blue-600" : "text-gray-400"}>
                        {icon}
                    </span>

                    {!collapsed && (
                        <span className="text-sm font-medium">
                            {label}
                        </span>
                    )}
                </div>
            </Tooltip>
        </button>
    );
}