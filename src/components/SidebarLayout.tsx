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
    Github, ChevronRight, Truck
} from "lucide-react";
import {type ReactNode, useState, useEffect, useRef} from "react";
import {MenuItem, Popover} from "@mui/material";
import {useUIStore} from "../hooks/store/useUIStore.ts";
import {useTabs} from "../contexts/TabContext.tsx";
import OrdersView from "./orders/OrdersView.tsx";
import CustomersView from "./customers/CustomersView.tsx";
import Dashboard from "./Dashboard.tsx";
import QuickAdd from "./QuickAdd.tsx";
import MySettings from "./Settings.tsx";
import AddCustomerTab from "./customers/AddCustomerTab.tsx";
import AddOrderTab from "./orders/AddOrderTab.tsx";
import AddProductTab from "./products/AddProductTab.tsx";
import ProductsView from "./products/ProductsView.tsx";
import AddRouteTab from "./routes/AddRouteTab.tsx";
import AddDriverTab from "./drivers/AddDriverTab.tsx";
import DriversView from "./drivers/DriversView.tsx";

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
        <div className="flex h-screen overflow-hidden">

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
                        label="Quick Add"
                        collapsed={collapsed}
                        setOpen={setOpen}
                        component={<QuickAdd />}
                    />

                    <NavItemWithSubmenu
                        id="products"
                        icon={<Package size={18} />}
                        label="Products"
                        collapsed={collapsed}
                        setOpen={setOpen}
                    >
                        {[
                            { id: "addProduct", label: "Add Product", component: <AddProductTab /> },
                            { id: "products",   label: "Products", component: <ProductsView /> },
                        ]}
                    </NavItemWithSubmenu>

                    <NavItemWithSubmenu
                        id="orders"
                        icon={<ShoppingCart size={18} />}
                        label="Orders"
                        collapsed={collapsed}
                        setOpen={setOpen}
                    >
                        {[
                            { id: "addOrder", label: "Add Order", component: <AddOrderTab /> },
                            { id: "orders",   label: "Orders", component: <OrdersView /> },
                        ]}
                    </NavItemWithSubmenu>

                    <NavItemWithSubmenu
                        id="customers"
                        icon={<Users size={18} />}
                        label="Customers"
                        collapsed={collapsed}
                        setOpen={setOpen}
                    >
                        {[
                            { id: "addCustomer", label: "Add Customer", component: <AddCustomerTab /> },
                            { id: "customers",   label: "Customers", component: <CustomersView /> },
                        ]}
                    </NavItemWithSubmenu>

                    <NavItemWithSubmenu
                        id="routes"
                        icon={<Truck size={18} />}
                        label="Routes"
                        collapsed={collapsed}
                        setOpen={setOpen}
                    >
                        {[
                            { id: "addRoute", label: "Add Route", component: <AddRouteTab /> },
                            { id: "addDriver", label: "Add Driver", component: <AddDriverTab /> },
                            { id: "drivers",   label: "Drivers", component: <DriversView /> },
                            { id: "orders",   label: "Routes", component: <OrdersView /> }
                        ]}
                    </NavItemWithSubmenu>


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
                <main className="flex-1 max-h-screen max-w-screen overflow-auto relative bg-gray-100">
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
        <div className="relative group">
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
            </button>

            {/* Tooltip — εμφανίζεται μόνο όταν είναι collapsed */}
            {collapsed && (
                <div className="
                    absolute left-full top-1/2 -translate-y-1/2 ml-2 z-50
                    pointer-events-none
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-150
                ">
                    {/* Arrow */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1
                        border-4 border-transparent border-r-gray-800"
                    />
                    {/* Label */}
                    <div className="
                        bg-gray-800 text-white text-xs font-medium
                        px-2.5 py-1.5 rounded-md whitespace-nowrap
                        shadow-lg
                    ">
                        {label}
                    </div>
                </div>
            )}
        </div>
    );
}

function NavItemWithSubmenu({
                                icon,
                                label,
                                collapsed,
                                setOpen,
                                children
                            }: Readonly<{
    id: string;
    icon: ReactNode;
    label: string;
    collapsed: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    children: { id: string; label: string; component: ReactNode }[];
}>) {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const { addTab, activeTabId } = useTabs();
    const isActive = children.some(c => c.id === activeTabId);
    const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const openMenu = (e: React.MouseEvent<HTMLElement>) => {
        if (leaveTimer.current) clearTimeout(leaveTimer.current);
        setAnchorEl(e.currentTarget);
    };

    const closeMenu = () => {
        leaveTimer.current = setTimeout(() => setAnchorEl(null), 150);
    };

    const cancelClose = () => {
        if (leaveTimer.current) clearTimeout(leaveTimer.current);
    };

    return (
        <>
            <button
                onMouseEnter={openMenu}
                onMouseLeave={closeMenu}
                onClick={openMenu}
                className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition w-full text-left
                    ${collapsed ? "justify-center" : ""}
                    ${isActive ? "bg-blue-50 text-blue-600 shadow-sm" : "hover:bg-gray-100 text-gray-600"}
                `}
            >
                <div className={`flex items-center gap-3 w-full ${collapsed ? "justify-center" : ""}`}>
                    <span className={isActive ? "text-blue-600" : "text-gray-400"}>
                        {icon}
                    </span>
                    {!collapsed && (
                        <span className="text-sm font-medium">{label}</span>
                    )}
                    {!collapsed && (
                        <ChevronRight size={14} className="ml-auto text-gray-400" />
                    )}
                </div>
            </button>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={() => setAnchorEl(null)}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                disableRestoreFocus
                sx={{ pointerEvents: "none" }}
                slotProps={{
                    paper: {
                        onMouseEnter: cancelClose,
                        onMouseLeave: closeMenu,
                        sx: {
                            pointerEvents: "auto",
                            borderRadius: 2,
                            minWidth: 180,
                            boxShadow: 3,
                            py: 0.5
                        }
                    }
                }}
            >
                {children.map((item) => (
                    <MenuItem
                        key={item.id}
                        selected={activeTabId === item.id}
                        onClick={() => {
                            addTab({
                                id: item.id,
                                label: item.label,
                                component: item.component,
                                path: item.id
                            });
                            setOpen(false);
                            setAnchorEl(null);
                        }}
                        sx={(theme)=>({ fontSize: 12, py: 1, borderBottom: `1px solid ${theme.palette.grey[200]}` })}
                    >
                        {item.label}
                    </MenuItem>
                ))}
            </Popover>
        </>
    );
}