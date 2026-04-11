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
import {NavLink } from "react-router";

export default function SidebarLayout({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);
    const [label, setLabel] = useState(location.pathname.split("/")[1].charAt(0).toUpperCase() + location.pathname.split("/")[1].slice(1));

    return (
        <div className="flex h-screen bg-gray-100">

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r transform transition-transform duration-300
                    ${open ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static`}
            >
                {/* Header in Sidebar for mobile */}
                <div className="flex items-center justify-between border-b md:hidden p-2">
                    <span className="font-bold text-lg">Admin Panel</span>
                    <button onClick={() => setOpen(false)}>
                        <X />
                    </button>
                </div>

                {/* Menu */}
                <nav className="flex flex-col p-4 gap-2 text-gray-700">
                    <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" setLabel={setLabel} setOpen={setOpen} />
                    <NavItem to="/add" icon={<PlusIcon size={18} />} label="Add" setLabel={setLabel} setOpen={setOpen}/>
                    <NavItem to="/products" icon={<Package size={18} />} label="Products" setLabel={setLabel} setOpen={setOpen}/>
                    <NavItem to="/orders" icon={<ShoppingCart size={18} />} label="Orders" setLabel={setLabel} setOpen={setOpen}/>
                    <NavItem to="/customers" icon={<Users size={18} />} label="Customers" setLabel={setLabel} setOpen={setOpen}/>
                    <NavItem to="/settings" icon={<Settings size={18} />} label="Settings" setLabel={setLabel} setOpen={setOpen}/>
                </nav>
                <div className="flex flex-row-reverse p-4 fixed bottom-0 right-0">
                    <div className="flex space-x-3 hover:cursor-pointer text-xs">
                        <a href="https://www.linkedin.com/in/kostas-veloutsos-026246266/"
                           target="_blank"
                        >
                            <Linkedin size={18}/>
                        </a>
                        <a href="https://github.com/kostasbel96"
                           target="_blank"
                        >
                            <Github size={18}/>
                        </a>
                    </div>
                </div>
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
                    <h1 className="font-semibold text-gray-700">{label}</h1>
                </header>

                <main className="overflow-y-auto h-[calc(100vh-7.5rem)]">{children}</main>
            </div>
        </div>
    );
}

type NavItemProps = {
    to: string;
    icon: ReactNode;
    label: string;
    setLabel: React.Dispatch<React.SetStateAction<string>>;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

function NavItem({ to, icon, label, setLabel, setOpen }: NavItemProps) {
    return (
        <NavLink
            to={to}
            className={({ isActive }: { isActive: boolean }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg transition
                ${isActive ? "bg-blue-100 text-blue-600" : "hover:bg-gray-100"}`
            }
            onClick={() => {setLabel(label);setOpen(false);}}
        >
            {icon}
            <span className="text-sm font-medium">{label}</span>
        </NavLink>
    );
}