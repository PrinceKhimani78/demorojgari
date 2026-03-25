import Dashboard from "@/components/Recruiters/Dashboard/Dashboard";
import ProtectedRoute from "@/components/Common/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute allowedRole="recruiter" redirectTo="/recruiters">
            <Dashboard />
        </ProtectedRoute>
    );
}
