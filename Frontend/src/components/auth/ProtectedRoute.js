import { Navigate, Outlet } from "react-router";

import { useContext } from "react";
import { authContext } from "./Auth";
import Cookies from "js-cookie";
import Navigation from "../Navbar/navigation";


export default function ProtectedRoute() {
    const { auth } = useContext(authContext);

    const ecookie = Cookies.get('User')

    console.log(ecookie)

    console.log("Protected route is being rendered:" + auth);

    if (ecookie) {
        return (
            <>
                <Navigation />
                <Outlet />
            </>
        )
    }
    else {
        return (
            <Navigate to='/login' />
        )
    }
};