import Header from "./Header.tsx";
import Footer from "./Footer.tsx";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout = ({children}: LayoutProps) => {
    return (
        <>
            <Header/>
                <div className="container mx-auto min-h-[85vh] pt-24">
                    {children}
                </div>
            <Footer/>
        </>
    )
}

export default Layout
