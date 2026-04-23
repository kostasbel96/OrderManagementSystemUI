// import Banner from "./Banner";
import { Outlet } from "react-router";

const Main = () => {
    return (
        <>
            <main className="mx-auto text-center space-x-2 w-full">
                {/*<Banner title="Order Management System"/>*/}
                <Outlet/>
            </main>
        </>
    )
}

export default Main;