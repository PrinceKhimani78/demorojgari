import Managejobs from "@/components/Recruiters/Manage-jobs/Manage-jobs";
import ProtectedRoute from "@/components/Common/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute allowedRole="recruiter" redirectTo="/recruiters">
            <Managejobs />
        </ProtectedRoute>
    );
}
