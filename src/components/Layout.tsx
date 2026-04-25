import SidebarLayout from "./SidebarLayout.tsx";
import Workspaces from "./Workspaces.tsx";
import { TabProvider } from "../contexts/TabContext.tsx";


const Layout = () => {
    return (
        <TabProvider>
            <SidebarLayout>
                <Workspaces />
            </SidebarLayout>
        </TabProvider>
    );
};

export default Layout;