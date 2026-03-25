"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/context/AuthContext";

interface ProtectedRouteProps {
    children: React.ReactNode;
    /** Which role is allowed on this page. Default: any authenticated user. */
    allowedRole?: UserRole;
    /** Where to redirect if not logged in. Default: /candidates/login */
    redirectTo?: string;
}

/**
 * Wrap any page component with this to require authentication.
 * Shows nothing while auth is loading, then redirects if not logged in.
 */
export default function ProtectedRoute({
    children,
    allowedRole,
    redirectTo = "/candidates/login",
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        // Not logged in at all → redirect to login
        if (!isAuthenticated) {
            router.replace(redirectTo);
            return;
        }

        // Wrong role → redirect to their own dashboard
        if (allowedRole && user?.role !== allowedRole) {
            const fallback =
                user?.role === "recruiter"
                    ? "/recruiters/dashboard"
                    : "/candidates/dashboard";
            router.replace(fallback);
            return;
        }

        // Recruiter not approved → redirect
        if (user?.role === "recruiter" && user?.status !== "Active") {
            router.replace("/recruiters/register"); // Or a specific pending page if we had one
            return;
        }
    }, [isLoading, isAuthenticated, allowedRole, user, router, redirectTo]);

    // Show loading spinner while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-[#72B76A] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // Don't render children if not authenticated or wrong role
    if (!isAuthenticated) return null;
    if (allowedRole && user?.role !== allowedRole) return null;

    return <>{children}</>;
}
