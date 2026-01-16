import Header from "./Header.tsx";
import Footer from "./Footer.tsx";
import {Outlet} from "react-router";


const Layout = () => {
    return (
        <>
            <Header/>
                <Outlet/>
            <Footer/>
        </>
    )
}

export default Layout;
