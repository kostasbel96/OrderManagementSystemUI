import Banner from "./Banner.tsx";
import {Outlet} from "react-router";

const Main = () => {
    return (
        <>
            <main className="mx-auto min-h-[95vh] bg-gray-200 text-center space-x-2 w-full">
                <Banner title="Order Management System"/>
                <Outlet/>
            </main>
        </>
    )
}

export default Main