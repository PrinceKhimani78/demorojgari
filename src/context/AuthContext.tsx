"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

export type UserRole = "candidate" | "recruiter";

export interface AuthUser {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
    profile_photo?: string;
    resume?: string;
    job_category?: string;
    status?: "Active" | "Inactive" | "PendingApproval";
}

interface AuthContextValue {
    user: AuthUser | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; message?: string }>;
    register: (data: any, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
    logout: () => void;
    updateUserInfo: (updates: Partial<AuthUser>) => void;
    isAuthenticated: boolean;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | null>(null);

const TOKEN_KEY = "rj_token";
const USER_KEY = "rj_user";

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.rojgariindia.com/api";

    // Rehydrate from localStorage on mount
    useEffect(() => {
        try {
            const storedToken = localStorage.getItem(TOKEN_KEY);
            const storedUser = localStorage.getItem(USER_KEY);
            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
            }
        } catch {
            // corrupted storage — clear it
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // ── Login ──────────────────────────────────────────────────────────────────
    const login = useCallback(
        async (email: string, password: string, role: UserRole) => {
            try {
                const endpoint = role === "recruiter" ? "/recruiter/auth/login" : "/auth/login";
                const res = await fetch(`${BACKEND}${endpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });

                const data = await res.json();

                if (!res.ok) {
                    return { success: false, message: data.message || "Login failed. Please check your credentials." };
                }

                const authUser: AuthUser = {
                    id: data.data.user.id,
                    email: data.data.user.email,
                    full_name: data.data.user.fullName,
                    role: role,
                    profile_photo: data.data.user.profile_photo ?? undefined,
                    status: data.data.user.status,
                };

                localStorage.setItem(TOKEN_KEY, data.data.token);
                localStorage.setItem(USER_KEY, JSON.stringify(authUser));

                setToken(data.data.token);
                setUser(authUser);

                return { success: true };
            } catch {
                return { success: false, message: "Network error. Please try again." };
            }
        },
        [BACKEND],
    );

    // ── Register ───────────────────────────────────────────────────────────────
    const register = useCallback(
        async (data: any, role: UserRole = "candidate") => {
            try {
                const endpoint = role === "recruiter" ? "/recruiter/auth/register" : "/auth/register";
                const res = await fetch(`${BACKEND}${endpoint}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });

                const result = await res.json();

                if (!res.ok) {
                    return { success: false, message: result.message || "Registration failed." };
                }

                // For recruiters, we don't auto-login because they need approval
                if (role === "candidate" && result.success && result.data?.token && result.data?.user) {
                    const authUser: AuthUser = {
                        id: result.data.user.id,
                        email: result.data.user.email,
                        full_name: result.data.user.fullName,
                        role: "candidate",
                        profile_photo: result.data.user.profile_photo ?? undefined,
                    };

                    localStorage.setItem(TOKEN_KEY, result.data.token);
                    localStorage.setItem(USER_KEY, JSON.stringify(authUser));

                    setToken(result.data.token);
                    setUser(authUser);
                }

                return { success: true, message: result.message };
            } catch {
                return { success: false, message: "Network error. Please try again." };
            }
        },
        [BACKEND],
    );

    // ── Logout ─────────────────────────────────────────────────────────────────
    const logout = useCallback(() => {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
    }, []);

    // ── Update User Info ───────────────────────────────────────────────────────
    const updateUserInfo = useCallback((updates: Partial<AuthUser>) => {
        setUser((prev) => {
            if (!prev) return null;
            const updatedUser = { ...prev, ...updates };
            localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
            return updatedUser;
        });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                login,
                register,
                logout,
                updateUserInfo,
                isAuthenticated: !!token && !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
    return ctx;
}
