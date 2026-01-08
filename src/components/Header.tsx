import logo from "../assets/logo_ed.png"

const Header = () => {
    return (
        <>
            <header className="flex justify-center flex-row  bg-[#F0F0F0] text-gray-900 navbar h-16">
                <div className="flex items-center p-5">
                    <img src={logo} alt="logo" className="w-64"/>
                </div>
                <div className="p-5">
                    <ul className="flex flex-row space-x-5 items-center">
                        <li className="nav-item">Products</li>
                        <li className="nav-item">Orders</li>
                        <li className="nav-item">Customers</li>
                    </ul>
                </div>
            </header>
        </>
    );
}

export default Header;