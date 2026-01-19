import logo from "../assets/logo_ed.png"
import {Link, NavLink} from "react-router";
import {useEffect, useRef, useState} from "react";
import {Menu, X} from "lucide-react";

const Header = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLUListElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    return (
        <>
            <header className="flex justify-center flex-row bg-[#F0F0F0] text-gray-900 navbar h-16">
                <div className="flex items-center p-5">
                    <Link to="/">
                        <img src={logo} alt="logo" className="w-64"/>
                    </Link>
                </div>
                <button
                    ref={buttonRef}
                    className="text-black md:hidden"
                    type="button"
                    onClick={() => {setMenuOpen(!menuOpen)}}
                >
                    {menuOpen ? <X size={36}/> : <Menu size={36}/>}
                </button>
                <div className="p-5">
                    <ul ref={menuRef}
                        className={`
                                    absolute top-16 left-0 w-full
                                    bg-[#F0F0F9]
                                    z-50
                                    overflow-hidden
                                    md:flex
                                    ${menuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
                                
                                    md:static
                                    md:opacity-100
                                    md:bg-transparent
                                    md:z-auto
                                  `}
                    >
                        <NavLink to="/products"
                        className={({isActive}) => isActive ? `border-b border-b-[#0274f8]` : ``}>
                            <li className="nav-item px-2">Products</li>
                        </NavLink>
                        <NavLink to="/orders"
                                 className={({isActive}) => (isActive ? `border-b border-b-[#0274f8]` : ``)}>
                            <li className="nav-item px-2">Orders</li>
                        </NavLink>
                        <NavLink to="/customers"
                                 className={({isActive}) => isActive ? `border-b border-b-[#0274f8]` : ``}>
                            <li className="nav-item px-2">Customers</li>
                        </NavLink>
                        <NavLink to="/"
                                 className={({isActive}) => isActive ? `border-b border-b-[#0274f8]` : ``}>
                            <li className="nav-item px-2">Dashboard</li>
                        </NavLink>
                    </ul>
                </div>
            </header>
        </>
    );
}

export default Header;