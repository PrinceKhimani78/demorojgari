"use client";

import React from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

const RecruiterProfileHeader = () => {
    const { user } = useAuth();
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.rojgariindia.com/api";

    const photoSrc = user?.profile_photo
        ? (user.profile_photo.startsWith('http')
            ? user.profile_photo
            : `${(BACKEND_URL || '').replace('/api', '')}/uploads/${user.profile_photo}`)
        : "/images/profile1.webp";

    return (
        <div className="flex items-center gap-4">
            <div className="relative h-20 w-20">
                <Image
                    src={photoSrc}
                    alt="Profile"
                    fill
                    className="rounded-full border object-cover shadow-sm"
                />
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">
                    {user?.full_name || "Recruiter"}
                </h2>
                <p className="text-gray-500 font-medium">Recruiter</p>
            </div>
        </div>
    );
};

export default RecruiterProfileHeader;
