"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { message, Spin } from "antd";
import { FiCamera } from "react-icons/fi";

interface CandidateProfileHeaderProps {
    editable?: boolean;
}

const CandidateProfileHeader: React.FC<CandidateProfileHeaderProps> = ({ editable = false }) => {
    const { user, token, updateUserInfo } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Basic validation
            if (file.size > 2 * 1024 * 1024) {
                message.error("Photo size must be less than 2MB");
                return;
            }

            // Preview immediately
            const reader = new FileReader();
            reader.onloadend = () => setPreviewUrl(reader.result as string);
            reader.readAsDataURL(file);

            // Upload
            setUploading(true);
            const formData = new FormData();
            formData.append("profile_photo", file);

            try {
                const res = await fetch(`${BACKEND_URL}/candidate-profile/${user?.id}/upload`, {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    body: formData
                });

                if (res.ok) {
                    const result = await res.json();
                    message.success("Profile photo updated!");
                    updateUserInfo({
                        profile_photo: result.data.profile_photo || result.profile_photo
                    });
                } else {
                    message.error("Failed to upload photo");
                }
            } catch (err) {
                message.error("Network error");
            } finally {
                setUploading(false);
                setPreviewUrl(null);
            }
        }
    };

    const photoSrc = previewUrl || (user?.profile_photo ? (user.profile_photo.startsWith('http') ? user.profile_photo : `${(BACKEND_URL || '').replace('/api', '')}/uploads/${user.profile_photo}`) : "/images/profile1.webp");

    return (
        <div className="flex items-center gap-4">
            <div className="relative h-20 w-20 group">
                <Image
                    src={photoSrc}
                    alt="Profile"
                    fill
                    className="rounded-full border object-cover shadow-sm"
                />
                {editable && (
                    <label className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition cursor-pointer">
                        {uploading ? (
                            <Spin size="small" />
                        ) : (
                            <div className="flex flex-col items-center text-white">
                                <FiCamera className="text-xl" />
                                <span className="text-[10px]">Change</span>
                            </div>
                        )}
                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoChange} disabled={uploading} />
                    </label>
                )}
            </div>
            <div>
                <h2 className="text-xl font-bold text-slate-800">
                    {user?.full_name || "Guest User"}
                </h2>
                <p className="text-gray-500 font-medium">
                    {user?.job_category || "Candidate"}
                </p>
            </div>
        </div>
    );
};

export default CandidateProfileHeader;
