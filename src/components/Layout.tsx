import Main from "./Main.tsx";
import SidebarLayout from "./SidebarLayout.tsx";


const Layout = () => {
    return (
        <>
            {/* Sidebar */}
            <SidebarLayout>
                {/* Right side */}
                <div className="flex flex-col">
                    <div className="flex flex-col flex-1">
                        <Main />
                    </div>

                </div>

            </SidebarLayout>
        </>


    );
};

export default Layout;
