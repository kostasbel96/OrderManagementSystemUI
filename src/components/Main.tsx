import { Outlet } from "react-router";

const Main = () => {
    return (
        <main className="mx-auto flex-1">
            <Outlet />
        </main>
    )
}

export default Main;