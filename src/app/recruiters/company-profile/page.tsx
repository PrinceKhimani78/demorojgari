import Companyprofile from "@/components/Recruiters/Company-Profile/Company-profile";
import ProtectedRoute from "@/components/Common/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute allowedRole="recruiter" redirectTo="/recruiters">
            <Companyprofile />
        </ProtectedRoute>
    );
}
