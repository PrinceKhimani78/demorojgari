import Resumealerts from "@/components/Recruiters/Resume-alerts/Resume-alerts";
import ProtectedRoute from "@/components/Common/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute allowedRole="recruiter" redirectTo="/recruiters">
            <Resumealerts />
        </ProtectedRoute>
    );
}
