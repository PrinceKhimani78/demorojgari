"use client";
import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Common/Sidebar";
import RecruiterProfileHeader from "@/components/Recruiters/Common/RecruiterProfileHeader";
import { useAuth } from "@/context/AuthContext";
import { INDUSTRY_OPTIONS } from "@/constants/industryData";
import { FaCheckCircle, FaHourglassHalf, FaPlus, FaBuilding } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";

interface RecruiterData {
    id: string;
    industries: { id: string, name: string }[];
    pending_industries: string[];
    denied_industries: string[];
}

const ManageIndustries = () => {
    const { user, token } = useAuth();
    const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.rojgariindia.com/api";

    const [mobileOpen, setMobileOpen] = useState(false);
    const [recruiterData, setRecruiterData] = useState<RecruiterData | null>(null);
    const [loading, setLoading] = useState(true);
    const [requestLoading, setRequestLoading] = useState(false);
    const [selectedIndustry, setSelectedIndustry] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fetchRecruiterData = async () => {
        if (!user || !token) return;
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND}/recruiter/profile`, {
                headers: { "Authorization": `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setRecruiterData(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch recruiter data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecruiterData();
    }, [user, token]);

    const handleRequestIndustry = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedIndustry || !token) return;

        setRequestLoading(true);
        setMessage("");
        setError("");

        try {
            const res = await fetch(`${BACKEND}/recruiter/request-industry`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ industryName: selectedIndustry })
            });

            const data = await res.json();
            if (res.ok) {
                setMessage("Industry request submitted successfully! Pending admin approval.");
                setSelectedIndustry("");
                fetchRecruiterData(); // Refresh list
            } else {
                setError(data.message || "Failed to submit request.");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setRequestLoading(false);
        }
    };

    return (
        <div className="pl-2 pr-4 sm:px-2 py-2 flex gap-3 sm:gap-4 my-10 relative">
            <Sidebar
                type="recruiter"
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />
            <main className="flex-1 px-5 py-5 min-w-0 bg-white shadow rounded-lg space-y-8">
                <div className="border-b pb-4">
                    <div className="flex items-center gap-5">
                        <IoChevronForward
                            onClick={() => setMobileOpen(true)}
                            className="text-[white] text-2xl cursor-pointer md:hidden bg-black rounded-full p-1"
                        />
                        <h1 className="fontAL font-semibold capitalize text-xl md:text-2xl lg:text-3xl">
                            Manage Industries
                        </h1>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">View approved industries and request access to new ones</p>
                </div>

                <RecruiterProfileHeader />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Approved Industries */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800">
                            <FaCheckCircle className="text-[#72B76A]" /> Approved Industries
                        </h2>
                        {loading ? (
                            <div className="h-20 bg-gray-50 animate-pulse rounded-lg"></div>
                        ) : recruiterData?.industries.length === 0 ? (
                            <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg">No approved industries yet.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {recruiterData?.industries.map((ind) => (
                                    <span key={ind.id} className="bg-[#72B76A]/10 text-[#72B76A] border border-[#72B76A]/20 px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-2">
                                        <FaBuilding size={12} /> {ind.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 pt-4">
                            <FaHourglassHalf className="text-amber-500" /> Pending Approval
                        </h2>
                        {loading ? (
                            <div className="h-20 bg-gray-50 animate-pulse rounded-lg"></div>
                        ) : recruiterData?.pending_industries?.length === 0 ? (
                            <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg text-sm">No pending requests.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {recruiterData?.pending_industries.map((name) => (
                                    <span key={name} className="bg-amber-50 text-amber-700 border border-amber-200 px-3 py-1.5 rounded-full text-sm font-semibold">
                                        {name}
                                    </span>
                                ))}
                            </div>
                        )}

                        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 pt-4">
                            <span className="text-red-500 text-xl font-bold">×</span> Denied Industries
                        </h2>
                        {loading ? (
                            <div className="h-20 bg-gray-50 animate-pulse rounded-lg"></div>
                        ) : recruiterData?.denied_industries?.length === 0 ? (
                            <p className="text-gray-500 italic bg-gray-50 p-4 rounded-lg text-sm">No denied requests.</p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {recruiterData?.denied_industries.map((name) => (
                                    <span key={name} className="bg-red-50 text-red-700 border border-red-200 px-3 py-1.5 rounded-full text-sm font-semibold">
                                        {name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Request New Industry */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 h-fit">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-slate-800 mb-4">
                            <FaPlus className="text-[#72B76A]" /> Request New Industry
                        </h2>
                        <form onSubmit={handleRequestIndustry} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Select Industry</label>
                                <select
                                    value={selectedIndustry}
                                    onChange={(e) => setSelectedIndustry(e.target.value)}
                                    className="w-full p-2.5 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-[#72B76A] outline-none transition"
                                >
                                    <option value="">-- Choose an Industry --</option>
                                    {INDUSTRY_OPTIONS.filter(opt =>
                                        !recruiterData?.industries.some(i => i.name === opt.value) &&
                                        !recruiterData?.pending_industries.includes(opt.value)
                                    ).map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>

                            {message && <p className="text-green-600 text-sm">{message}</p>}
                            {error && <p className="text-red-600 text-sm">{error}</p>}

                            <button
                                type="submit"
                                disabled={requestLoading || !selectedIndustry}
                                className="w-full py-3 bg-[#72B76A] hover:bg-[#72B76A]/90 text-white font-bold rounded-lg transition disabled:bg-gray-400"
                            >
                                {requestLoading ? "Submitting..." : "Submit Request"}
                            </button>
                        </form>
                        <p className="text-xs text-gray-500 mt-4 italic">
                            * After approval, you will be able to see candidates from this industry in your listing.
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ManageIndustries;
