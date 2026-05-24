import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<{ exp: number }>(token);
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(() => {
        const saved = localStorage.getItem("token");
        if (saved && isTokenExpired(saved)) {
            localStorage.removeItem("token");
            return null;
        }
        return saved;
    });

    useEffect(() => {
        if (!token) return;

        const decoded = jwtDecode<{ exp: number }>(token);
        const expiresIn = decoded.exp * 1000 - Date.now();

        // auto logout όταν λήξει το token
        const timeout = setTimeout(() => {
            logout();
        }, expiresIn);

        return () => clearTimeout(timeout);
    }, [token]);

    const login = (newToken: string) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within AuthProvider");
    return context;
};