"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaDownload, FaBriefcase, FaGraduationCap, FaCertificate, FaArrowLeft, FaCheck } from "react-icons/fa";
import { FiChevronRight, FiMail, FiPhone } from "react-icons/fi";
import Sidebar from "@/components/Common/Sidebar";
import { useAuth } from "@/context/AuthContext";

const CandidateProfilePage = () => {
    const { id } = useParams();
    const router = useRouter();
    const { user, token } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.rojgariindia.com/api";

    useEffect(() => {
        const fetchProfile = async () => {
            if (!id || !token) return;
            try {
                const res = await fetch(`${BACKEND}/candidate-profile/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
                const data = await res.json();
                if (res.ok && data.success) {
                    setProfile(data.data);
                } else {
                    console.error("Failed to fetch profile:", data.message);
                }
            } catch (err) {
                console.error("Error fetching profile:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id, token, BACKEND]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#72B76A]"></div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col gap-4">
                <h2 className="text-xl font-semibold text-gray-700">Candidate not found</h2>
                <button onClick={() => router.back()} className="text-[#00C9FF] hover:underline flex items-center gap-2">
                    <FaArrowLeft /> Go Back
                </button>
            </div>
        );
    }

    const {
        full_name,
        email,
        mobile_number,
        city,
        state,
        job_category,
        preferred_industry,
        summary,
        profile_photo,
        resume,
        work_experience = [],
        education = [],
        skills = [],
        certifications = []
    } = profile;

    return (
        <div className="pl-2 pr-4 sm:px-2 py-2 flex gap-3 sm:gap-4 my-20 relative min-h-screen bg-gray-50">
            <Sidebar type="recruiter" />
            
            <main className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden flex flex-col mb-10">
                {/* Header Section */}
                <div className="p-6 border-b">
                    <button onClick={() => router.back()} className="mb-4 text-xs font-bold flex items-center gap-2 text-gray-500 hover:text-[#72B76A] transition">
                        <FaArrowLeft /> BACK TO LIST
                    </button>
                    <div className="flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
                        {/* Photo */}
                        <div className="relative w-32 h-32 flex-shrink-0">
                            {profile_photo ? (
                                <Image
                                    src={profile_photo.startsWith('http') ? profile_photo : `${BACKEND.replace('/api', '')}/uploads/${profile_photo}`}
                                    alt={full_name}
                                    fill
                                    className="rounded-full object-cover border-4 border-white shadow-md"
                                />
                            ) : (
                                <div className="w-full h-full rounded-full bg-[#EFE2F1] flex items-center justify-center text-[#72B76A] text-4xl font-bold border-4 border-white shadow-md">
                                    {full_name?.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Basic Info */}
                        <div className="flex-1 space-y-2">
                            <h1 className="text-3xl font-bold text-gray-900">{full_name}</h1>
                            <p className="text-[#72B76A] font-semibold text-lg">{job_category || "No Role Specified"}</p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600 mt-2">
                                <span className="flex items-center gap-1">
                                    <FaMapMarkerAlt className="text-[#00C9FF]" />
                                    {city || "N/A"}, {state || "N/A"}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FaEnvelope className="text-[#00C9FF]" />
                                    {email}
                                </span>
                                <span className="flex items-center gap-1">
                                    <FaPhone className="text-[#00C9FF]" />
                                    {mobile_number}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 min-w-[200px]">
                            {resume && (
                                <a 
                                    href={`${BACKEND}/candidate-profile/${id}/download/resume`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 bg-[#72B76A] text-white py-2 px-4 rounded-lg hover:bg-[#5da356] transition shadow-md font-semibold"
                                >
                                    <FaDownload /> Download Resume
                                </a>
                            )}
                            <button className="flex items-center justify-center gap-2 border border-[#00C9FF] text-[#00C9FF] py-2 px-4 rounded-lg hover:bg-[#00C9FF] hover:text-white transition font-semibold">
                                <FaEnvelope /> Send Message
                            </button>
                        </div>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left/Middle Column - Profile Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Summary */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                                <FaBriefcase className="text-[#72B76A]" /> Profile Summary
                            </h2>
                            <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg border">
                                {summary || "No summary provided by the candidate."}
                            </p>
                        </section>

                        {/* Experience */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                                <FaBriefcase className="text-[#72B76A]" /> Work Experience
                            </h2>
                            <div className="space-y-4">
                                {work_experience.length > 0 ? work_experience.map((work: any, idx: number) => (
                                    <div key={idx} className="relative pl-6 border-l-2 border-[#EFE2F1]">
                                        <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-[#72B76A] border-2 border-white shadow-sm"></div>
                                        <h3 className="font-bold text-gray-900">{work.title}</h3>
                                        <p className="text-gray-600 font-medium">{work.company}</p>
                                        <p className="text-sm text-gray-500 mb-2">
                                            {new Date(work.start_date).toLocaleDateString()} - {work.is_current ? "Present" : new Date(work.end_date).toLocaleDateString()}
                                        </p>
                                        <p className="text-gray-600 text-sm">{work.description}</p>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 italic">No work experience listed.</p>
                                )}
                            </div>
                        </section>

                        {/* Education */}
                        <section>
                            <h2 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4 flex items-center gap-2">
                                <FaGraduationCap className="text-[#72B76A]" /> Education
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {education.length > 0 ? education.map((edu: any, idx: number) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border flex items-start gap-3 shadow-sm hover:shadow-md transition">
                                        <div className="bg-[#72B76A]/10 p-2 rounded-lg">
                                            <FaGraduationCap className="text-[#72B76A] text-xl" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">{edu.degree}</h3>
                                            <p className="text-gray-600 text-sm">{edu.university}</p>
                                            <p className="text-[#00C9FF] text-xs font-semibold mt-1">Class of {edu.passing_year}</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 italic">No education history listed.</p>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Right Column - Side Info */}
                    <div className="space-y-8">
                        {/* Skills */}
                        <section className="bg-[#EFE2F1]/30 p-5 rounded-xl border border-[#EFE2F1]">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaCheck className="text-[#72B76A]" /> Skills & Ratings
                            </h2>
                            <div className="flex flex-wrap gap-2">
                                {skills.length > 0 ? skills.map((skill: any, idx: number) => (
                                    <div key={idx} className="bg-white px-3 py-1 rounded-full border border-gray-200 shadow-sm text-sm text-gray-700 flex items-center gap-2">
                                        <span className="font-medium">{skill.skill}</span>
                                        <span className="bg-[#72B76A]/10 text-[#72B76A] px-2 py-0.5 rounded text-[10px] font-bold">
                                            {skill.exp}
                                        </span>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 text-sm italic">No skills listed.</p>
                                )}
                            </div>
                        </section>

                        {/* Certifications */}
                        <section className="bg-white p-5 rounded-xl border shadow-sm">
                            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <FaCertificate className="text-[#00C9FF]" /> Certifications
                            </h2>
                            <div className="space-y-3">
                                {certifications.length > 0 ? certifications.map((cert: any, idx: number) => (
                                    <div key={idx} className="border-b last:border-0 pb-3 last:pb-0">
                                        <h3 className="font-semibold text-gray-900 text-sm">{cert.name}</h3>
                                        <p className="text-gray-500 text-xs">{cert.year}</p>
                                    </div>
                                )) : (
                                    <p className="text-gray-500 text-sm italic">No certifications listed.</p>
                                )}
                            </div>
                        </section>

                        {/* Career Details */}
                        <section className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Stats</h2>
                            <ul className="space-y-3 text-sm">
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Industry:</span>
                                    <span className="font-semibold text-gray-800 text-right">{preferred_industry || "Not Set"}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Exp. Salary:</span>
                                    <span className="font-semibold text-gray-800">{profile.expected_salary || "N/A"}</span>
                                </li>
                                <li className="flex justify-between">
                                    <span className="text-gray-500">Availability:</span>
                                    <span className="font-semibold text-gray-800">{profile.interview_availability || "Immediate"}</span>
                                </li>
                            </ul>
                        </section>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CandidateProfilePage;
