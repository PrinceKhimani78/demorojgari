import Packages from "@/components/Recruiters/Packages/Packages";
import ProtectedRoute from "@/components/Common/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute allowedRole="recruiter" redirectTo="/recruiters">
            <Packages />
        </ProtectedRoute>
    );
}
