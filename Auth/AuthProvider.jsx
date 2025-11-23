import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    // load initial state from local storage
    const storedUser = JSON.parse(localStorage.getItem("authUser"));

    const [user, setUser] = useState(storedUser || null);
    const [isLoggedIn, setIsLoggedIn] = useState(!!storedUser);

    // save to local storage whenever user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem("authUser", JSON.stringify(user));
            setIsLoggedIn(true);
        } else {
            localStorage.removeItem("authUser");
            setIsLoggedIn(false);
        }
    }, [user]);

    // login function
    const login = (name, email, picture) => {
        setUser({ name, email, picture });
    };

    // logout function
    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// ⬅ ADD THIS
export const useAuth = () => useContext(AuthContext);
