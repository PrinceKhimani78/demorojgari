import ManageIndustries from "@/components/Recruiters/Manage-industries/Manage-industries";
import ProtectedRoute from "@/components/Common/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute allowedRole="recruiter" redirectTo="/recruiters">
            <ManageIndustries />
        </ProtectedRoute>
    );
}
