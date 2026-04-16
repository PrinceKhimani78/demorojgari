"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Common/Sidebar";
import { FaEye, FaEnvelope, FaMapMarkerAlt, FaCheck, FaTimes, FaClock, FaListAlt, FaDownload } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
import RecruiterProfileHeader from "@/components/Recruiters/Common/RecruiterProfileHeader";
import { useAuth } from "@/context/AuthContext";

interface ApplicantsProps {
  jobId: string;
}

const Applicants = ({ jobId }: ApplicantsProps) => {
  const { user, token } = useAuth();
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.rojgariindia.com/api";

  const [applicants, setApplicants] = useState<any[]>([]);
  const [jobDetails, setJobDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<any>(null);

  const fetchApplicants = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/applications/job/${jobId}/applicants`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setApplicants(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch applicants", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobDetails = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${BACKEND}/jobs/${jobId}`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setJobDetails(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch job details", err);
    }
  };

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
      fetchJobDetails();
    }
  }, [jobId, token]);

  const updateStatus = async (applicationId: string, newStatus: string) => {
    try {
      const res = await fetch(`${BACKEND}/applications/${applicationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setApplicants(prev => prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        ));
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const getStatusClasses = (status: string) => {
    switch (status) {
      case "Accepted":
      case "Shortlisted":
      case "Selected":
        return "bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold";
      case "In Review":
      case "Interviewed":
        return "bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold";
      case "Rejected":
        return "bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold";
      default:
        return "bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold";
    }
  };

  return (
    <>
      <div className="pl-2 pr-4 sm:px-2 py-2 flex gap-3 sm:gap-4 my-30 relative">
        <Sidebar
          type="recruiter"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        <main className="flex-1 px-5 py-5 min-w-0 bg-white shadow rounded-lg space-y-8">
          <div className="border-b pb-4">
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <div className="flex gap-5 items-center ">
                  <IoChevronForward
                    onClick={() => setMobileOpen(true)}
                    className="text-[white] text-2xl cursor-pointer md:hidden bg-black rounded-full p-1"
                  />
                  <h1 className="fontAL font-semibold capitalize text-xl md:text-2xl lg:text-3xl ">
                    Job Applicants
                  </h1>
                </div>
                <nav aria-label="Breadcrumb" className="hidden sm:block text-sm text-gray-500">
                  <ol className="flex items-center gap-2">
                    <li><Link href="/recruiters/dashboard" className="hover:text-gray-700">Dashboard</Link></li>
                    <li><FiChevronRight /></li>
                    <li><Link href="/recruiters/manage-jobs" className="hover:text-gray-700">Manage Jobs</Link></li>
                    <li><FiChevronRight /></li>
                    <li className="text-gray-700 font-medium truncate max-w-[150px]">{jobDetails?.title || "Applicants"}</li>
                  </ol>
                </nav>
             </div>
          </div>

          <RecruiterProfileHeader />

          {jobDetails && (
              <div className="bg-slate-50 p-4 rounded-lg mb-6 border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800">{jobDetails.title}</h2>
                  <p className="text-sm text-slate-600 font-medium mt-1">{applicants.length} Total Applicants</p>
              </div>
          )}

          <div className="bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show</span>
                <select value={entries} onChange={(e) => setEntries(Number(e.target.value))} className="border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-[#00C9FF]">
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#72B76A]"></div>
                </div>
            ) : (
                <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-left text-sm border-collapse">
                        <thead className="bg-slate-50 text-slate-600 font-semibold border-b">
                            <tr>
                                <th className="px-4 py-3">Applicant Name</th>
                                <th className="px-4 py-3">Applied Date</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applicants.map((app) => (
                                <tr key={app.id} className="border-b hover:bg-slate-50 transition-colors">
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold overflow-hidden">
                                                {app.Candidate?.profile_photo ? (
                                                     <Image 
                                                        src={app.Candidate.profile_photo.startsWith('http') ? app.Candidate.profile_photo : `${BACKEND.replace('/api', '')}/uploads/${app.Candidate.profile_photo}`} 
                                                        alt={app.Candidate.full_name} 
                                                        width={40} 
                                                        height={40} 
                                                        className="object-cover h-full w-full" 
                                                      />
                                                ) : app.Candidate?.full_name?.charAt(0) || "U"}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-slate-900">{app.Candidate?.full_name}</p>
                                                <p className="text-xs text-slate-500">{app.Candidate?.city || ""}{app.Candidate?.city && app.Candidate?.state ? ", " : ""}{app.Candidate?.state || ""}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 text-slate-500">
                                        {new Date(app.applied_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span className={getStatusClasses(app.status)}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4">
                                        <div className="flex items-center justify-center gap-2">
                                            <Link href={`/recruiters/candidates-list/${app.candidate_id}`} className="p-2 text-slate-600 hover:bg-slate-200 rounded-full transition-colors" title="View Profile">
                                                <FaEye />
                                            </Link>
                                            {app.screening_answers && (
                                                <button onClick={() => setSelectedAnswers(typeof app.screening_answers === 'string' ? JSON.parse(app.screening_answers) : app.screening_answers)} className="p-2 text-purple-600 hover:bg-purple-100 rounded-full transition-colors" title="View Screening Answers">
                                                    <FaListAlt />
                                                </button>
                                            )}
                                            {app.resume && (
                                                <a 
                                                    href={`${BACKEND.replace('/api', '')}/uploads/resume/${app.candidate_id}/${app.resume}`} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors" 
                                                    title="Download Resume"
                                                >
                                                    <FaDownload />
                                                </a>
                                            )}
                                            
                                            <div className="flex border rounded-lg overflow-hidden">
                                                <button onClick={() => updateStatus(app.id, 'Shortlisted')} className="p-2 bg-white text-green-600 hover:bg-green-500 hover:text-white transition-colors border-r" title="Shortlist">
                                                    <FaCheck />
                                                </button>
                                                <button onClick={() => updateStatus(app.id, 'Interviewed')} className="p-2 bg-white text-blue-600 hover:bg-blue-500 hover:text-white transition-colors border-r" title="Interview">
                                                    <FaClock />
                                                </button>
                                                <button onClick={() => updateStatus(app.id, 'Rejected')} className="p-2 bg-white text-red-600 hover:bg-red-500 hover:text-white transition-colors" title="Reject">
                                                    <FaTimes />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {applicants.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-4 py-10 text-center text-slate-500">No applicants yet for this job.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
          </div>
        </main>
      </div>

      {selectedAnswers && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Screening Answers</h3>
              <button onClick={() => setSelectedAnswers(null)} className="text-gray-400 hover:text-gray-700 transition">
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {Array.isArray(selectedAnswers) ? (
                selectedAnswers.map((item: any, index: number) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="font-semibold text-gray-900 text-sm mb-2">Q: {item.question}</p>
                    <p className="text-gray-700 text-sm italic">{item.answer}</p>
                  </div>
                ))
              ) : Object.keys(selectedAnswers || {}).length > 0 ? (
                Object.entries(selectedAnswers).map(([question, answer], index) => (
                  <div key={index} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <p className="font-semibold text-gray-900 text-sm mb-2">Q: {question}</p>
                    <p className="text-gray-700 text-sm italic">{String(answer)}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No answers provided.</p>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
              <button 
                onClick={() => setSelectedAnswers(null)}
                className="px-6 py-2 bg-white border border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Applicants;
