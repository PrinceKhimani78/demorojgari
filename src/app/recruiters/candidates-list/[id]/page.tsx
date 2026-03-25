import Candidateslist from "@/components/Recruiters/Candidates-list/Candidates-list";
import ProtectedRoute from "@/components/Common/ProtectedRoute";

export default function Page() {
    return (
        <ProtectedRoute allowedRole="recruiter" redirectTo="/recruiters">
            <Candidateslist />
        </ProtectedRoute>
    );
}
