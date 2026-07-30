import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { apiFetch } from "../lib/api";
import {
    getToken,
    getStoredUser,
    setSession,
    clearSession
} from "../lib/authStorage";

interface User {
    id: string;
    name: string;
    email: string;
    avatarIcon?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (token: string, user: User, remember?: boolean) => void;
    logout: () => void;
    updateUser: (user: User) => void;
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

    function updateUser(updatedUser: User) {
        setUser(updatedUser);

        const token = getToken();

        if (token) {
            setSession(token, updatedUser, true);
        }
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout,
                updateUser,
            }}
        >
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