import Main from "./Main.tsx";
import SidebarLayout from "./SidebarLayout.tsx";


const Layout = () => {
    return (
        <>
            {/* Sidebar */}
            <SidebarLayout>
                {/* Right side */}
                <Main />
            </SidebarLayout>
        </>


    );
};

export default Layout;
