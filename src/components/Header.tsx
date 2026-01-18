import logo from "../assets/logo_ed.png"
import {Link, NavLink} from "react-router";

const Header = () => {

    return (
        <>
            <header className="flex justify-center flex-row  bg-[#F0F0F0] text-gray-900 navbar h-16">
                <div className="flex items-center p-5">
                    <Link to="/">
                        <img src={logo} alt="logo" className="w-64"/>
                    </Link>
                </div>
                <div className="p-5">
                    <ul className="flex flex-row space-x-5 items-center">
                        <NavLink to="/products"
                        className={({isActive}) => isActive ? `border-b border-b-[#0274f8]` : ``}>
                            <li className="nav-item">Products</li>
                        </NavLink>
                        <NavLink to="/orders"
                                 className={({isActive}) => isActive ? `border-b border-b-[#0274f8]` : ``}>
                            <li className="nav-item">Orders</li>
                        </NavLink>
                        <NavLink to="/customers"
                                 className={({isActive}) => isActive ? `border-b border-b-[#0274f8]` : ``}>
                            <li className="nav-item">Customers</li>
                        </NavLink>
                        <NavLink to="/"
                                 className={({isActive}) => isActive ? `border-b border-b-[#0274f8]` : ``}>
                            <li className="nav-item">Dashboard</li>
                        </NavLink>
                    </ul>
                </div>
            </header>
        </>
    );
}

export default Header;