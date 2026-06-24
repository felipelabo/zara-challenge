import { Outlet } from "react-router";
import Navbar from "../../components/shared/Navbar";

const LayoutNavbar = () => {
    return (
        <>
            <Navbar />
            <Outlet />
        </>
    );
};

export default LayoutNavbar;
