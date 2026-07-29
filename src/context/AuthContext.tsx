import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "../lib/api";
import { getToken, getStoredUser, setSession, clearSession } from "../lib/authStorage"; 

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User, remember?: boolean) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = getToken();

        if (!token) {
            setLoading(false);
            return;
        }
        
        const storedUser = getStoredUser<User>();

        if (storedUser) {
            setUser(storedUser);
        }

        apiFetch("/auth/me")
            .then((res) => {
                if (!res.ok) throw new Error("Invalid session");
                return res.json();
            })
            .then((data: User) => {
                setUser(data);
            })
            .catch(() => {
                clearSession();
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    function login(token: string, user: User, remember = true) {
        setSession(token, user, remember);
        setUser(user);
    }

    function logout() {
        clearSession();
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