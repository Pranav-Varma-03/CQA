import { createContext, useState } from "react";

export const authContext = createContext(null);

export default function UserContext({ children }) {
    const [auth, setAuth] = useState(0);

    console.log("Auth.js file is rendered " + auth)

    return (
        <>
            <authContext.Provider value={{ auth, setAuth }}>
                {children}
            </authContext.Provider>
        </>
    )
};