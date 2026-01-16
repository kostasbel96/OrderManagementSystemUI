import logo from "../assets/logo_ed.png"
import {Link} from "react-router";

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
                        <Link to="/products">
                            <li className="nav-item">Products</li>
                        </Link>
                        <Link to="/orders">
                            <li className="nav-item">Orders</li>
                        </Link>
                        <Link to="/customers">
                            <li className="nav-item">Customers</li>
                        </Link>
                    </ul>
                </div>
            </header>
        </>
    );
}

export default Header;