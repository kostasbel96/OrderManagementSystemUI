import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    Users,
    Settings,
    Menu,
    X,
    PlusIcon,
    ChevronRight, Truck, HandCoins, Factory, LogOut
} from "lucide-react";
import {type ReactNode, useState, useEffect, useRef} from "react";
import { useTranslation } from 'react-i18next';
import {MenuItem, Popover} from "@mui/material";
import {useUIStore} from "../hooks/store/useUIStore.ts";
import {useTabs} from "../contexts/TabContext.tsx";
import OrdersView from "./orders/OrdersView.tsx";
import CustomersView from "./customers/CustomersView.tsx";
import Dashboard from "./dashboard/Dashboard.tsx";
import QuickAdd from "./QuickAdd.tsx";
import MySettings from "./Settings.tsx";
import AddCustomerTab from "./customers/AddCustomerTab.tsx";
import AddOrderTab from "./orders/AddOrderTab.tsx";
import AddProductTab from "./products/AddProductTab.tsx";
import ProductsView from "./products/ProductsView.tsx";
import AddRouteTab from "./routes/AddRouteTab.tsx";
import AddDriverTab from "./drivers/AddDriverTab.tsx";
import DriversView from "./drivers/DriversView.tsx";
import RoutesView from "./routes/RoutesView.tsx";
import AddReceiptTab from "./receipts/AddReceiptTab.tsx";
import ReceiptsView from "./receipts/ReceiptsView.tsx";
import AddSupplierTab from "./suppliers/AddSupplierTab.tsx";
import SuppliersView from "./suppliers/SuppliersView.tsx";
import {useAuth} from "../contexts/AuthContext.tsx";

export default function SidebarLayout({ children }: Readonly<{ children: ReactNode }>) {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const { addTab } = useTabs();
    const { logout } = useAuth();

    const collapsed = useUIStore((s) => s.sidebarCollapsed);
    const toggleSidebar = useUIStore((s) => s.toggleSidebar);

    // Αρχικοποίηση με το Dashboard tab
    useEffect(() => {
        addTab({
            id: 'dashboard',
            label: t('nav.dashboard'),
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
                        <span className="font-bold text-lg text-blue-600 ml-2">{t('app.adminTitle')}</span>
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
                        label={t('nav.dashboard')}
                        collapsed={collapsed}
                        setOpen={setOpen}
                        component={<Dashboard />}
                    />

                    <NavItem
                        id="add"
                        icon={<PlusIcon size={18} />}
                        label={t('nav.quickAdd')}
                        collapsed={collapsed}
                        setOpen={setOpen}
                        component={<QuickAdd />}
                    />

                    <NavItemWithSubmenu
                        id="products"
                        icon={<Package size={18} />}
                        label={t('nav.products')}
                        collapsed={collapsed}
                        setOpen={setOpen}
                    >
                        {[
                            { id: "addProduct", label: t('nav.addProduct'), component: <AddProductTab /> },
                            { id: "products",   label: t('nav.products'), component: <ProductsView /> },
                        ]}
                    </NavItemWithSubmenu>

                    <NavItemWithSubmenu
                        id="orders"
                        icon={<ShoppingCart size={18} />}
                        label={t('nav.orders')}
                        collapsed={collapsed}
                        setOpen={setOpen}
                    >
                        {[
                            { id: "addOrder", label: t('nav.addOrder'), component: <AddOrderTab /> },
                            { id: "customerOrders",   label: t('nav.customerOrders'), component: <OrdersView /> },
                            { id: "supplierOrders",   label: t('nav.supplierOrders'), component: <OrdersView orderType={"orderSupplier"} /> }
                        ]}
                    </NavItemWithSubmenu>

                    <NavItemWithSubmenu
                        id="customers"
                        icon={<Users size={18} />}
                        label={t('nav.customers')}
                        collapsed={collapsed}
                        setOpen={setOpen}
                    >
                        {[
                            { id: "addCustomer", label: t('nav.addCustomer'), component: <AddCustomerTab /> },
                            { id: "customers",   label: t('nav.customers'), component: <CustomersView /> },
                        ]}
                    </NavItemWithSubmenu>

                    <NavItemWithSubmenu
                        id="payments"
                        icon={<HandCoins size={18} />}
                        label={t('nav.payments')}
                        collapsed={collapsed}
                        setOpen={setOpen}
                    >
                        {[
                            { id: "customerPayments",   label: t('nav.customerPayments'),
                                component: <ReceiptsView receiptType="receipt" /> },
                            { id: "supplierPayments",   label: t('nav.supplierPayments'),
                                component: <ReceiptsView receiptType="payment" /> },
                            { id: "addPayment", label: t('nav.addPayment'), component: <AddReceiptTab />}
                        ]}
                    </NavItemWithSubmenu>

                    <NavItemWithSubmenu
                        id="routes"
                        icon={<Truck size={18} />}
                        label={t('nav.routes')}
                        collapsed={collapsed}
                        setOpen={setOpen}
                    >
                        {[
                            { id: "addRoute", label: t('nav.addRoute'), component: <AddRouteTab /> },
                            { id: "addDriver", label: t('nav.addDriver'), component: <AddDriverTab /> },
                            { id: "drivers",   label: t('nav.drivers'), component: <DriversView /> },
                            { id: "routes",   label: t('nav.routes'), component: <RoutesView /> },
                        ]}
                    </NavItemWithSubmenu>

                    <NavItemWithSubmenu
                        id="suppliers"
                        icon={<Factory size={18} />}
                        label={t('nav.suppliers')}
                        collapsed={collapsed}
                        setOpen={setOpen}
                    >
                        {[
                            { id: "addSupplier",   label: t('nav.addSupplier'), component: <AddSupplierTab /> },
                            { id: "suppliers",   label: t('nav.suppliers'), component: <SuppliersView /> },
                        ]}
                    </NavItemWithSubmenu>


                    <NavItem
                        id="settings"
                        icon={<Settings size={18} />}
                        label={t('nav.settings')}
                        collapsed={collapsed}
                        setOpen={setOpen}
                        component={<MySettings />}
                    />
                </nav>

                {/* SOCIAL */}
                <div className="absolute bottom-0 w-full p-3 flex justify-center gap-3 text-xs border-t border-gray-200">
                    <button
                        onClick={() => logout()}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title={t('auth.logout')}
                    >
                        <LogOut size={18} />
                    </button>
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