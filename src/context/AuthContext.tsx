import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "../lib/api";

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // check if there is already a token in localStorage and fetch user data if so
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            setLoading(false);
            return;
        }

        apiFetch("/auth/me")
        .then((res) => {
            if (!res.ok) throw new Error("Invalid session");
            return res.json();
        })  
        .then((data: User) => setUser(data))
        .catch(() => {
            localStorage.removeItem("access_token");
            setUser(null);
        })
        .finally(() => setLoading(false));
    }, []);

    function login(token: string, user: User) {
        localStorage.setItem("access_token", token);
        setUser(user);
    }

    function logout() {
        localStorage.removeItem("access_token");
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}