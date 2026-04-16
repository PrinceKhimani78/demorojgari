"use client";
import React from "react";
import Applicants from "@/components/Recruiters/Applicants/Applicants";
import ProtectedRoute from "@/components/Common/ProtectedRoute";
import { useParams } from "next/navigation";

export default function JobApplicantsPage() {
    const params = useParams();
    const id = params.id as string;

    return (
        <ProtectedRoute allowedRole="recruiter" redirectTo="/recruiters">
            <Applicants jobId={id} />
        </ProtectedRoute>
    );
}
