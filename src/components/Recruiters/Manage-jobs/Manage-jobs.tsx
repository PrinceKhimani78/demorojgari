"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Sidebar from "@/components/Common/Sidebar";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { IoChevronForward } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import RecruiterProfileHeader from "@/components/Recruiters/Common/RecruiterProfileHeader";
import { useAuth } from "@/context/AuthContext";

const Managejobs = () => {
  const { token, isAuthenticated, user } = useAuth();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editJob, setEditJob] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showModal, setShowModal] = useState(false);
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!token) return;

    fetch(`/api/jobs/recruiter`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJobs(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching recruiter jobs:", err);
        setLoading(false);
      });
  }, [token]);

  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredJobs.length / entries);
  const startIndex = (currentPage - 1) * entries;
  const endIndex = startIndex + entries;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntries(Number(e.target.value));
    setCurrentPage(1);
  };

  const isExpired = (date: string) => {
    return new Date(date) < new Date();
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  if (loading) {
     return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#72B76A]"></div>
        </div>
      );
  }

  return (
    <>
      <div className="pl-2 pr-4 sm:px-2 py-2 flex gap-3 sm:gap-4 my-30 relative">
        <Sidebar
          type="recruiter"
          onDeleteClick={() => setShowModal(true)}
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
                  Manage-Jobs
                </h1>
              </div>

              <nav aria-label="Breadcrumb" className="hidden sm:block text-sm text-gray-500 text-center sm:text-right">
                <ol className="flex items-center justify-center sm:justify-end gap-2 flex-wrap">
                  <li className="flex items-center gap-2">
                    <Link href="/" className="hover:text-gray-700 transition">Home</Link>
                    <FiChevronRight />
                  </li>
                  <li className="flex items-center gap-2">
                    <Link href="/recruiters/dashboard" className="hover:text-gray-700 transition">Recruiters</Link>
                    <FiChevronRight />
                  </li>
                  <li>
                    <span className="text-gray-700 font-medium">Manage-Jobs</span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          <RecruiterProfileHeader />

          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <div className="flex items-center gap-2">
              <span>Show</span>
              <select className="border rounded px-2 py-1 text-sm" value={entries} onChange={handleEntriesChange}>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
              <span>entries</span>
            </div>
            <div>
              <input
                type="text"
                placeholder="Search jobs..."
                className="w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 ring-gray-400 transition focus:outline-none focus:ring-2 focus:ring-[#00c9ff]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {currentJobs.map((job) => (
              <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 rounded-lg p-4 shadow-sm bg-white hover:bg-gray-50 transition">
                <div className="flex gap-4 items-center flex-1">
                  <div className="w-[60px] h-[60px] bg-slate-100 flex items-center justify-center rounded border">
                     <span className="text-xs font-bold text-slate-400">LOGO</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[#007bff] cursor-pointer hover:underline">
                      <Link href={`/jobs/details?id=${job.id}`}>{job.title}</Link>
                    </h3>
                    <p className="text-sm text-gray-500">{job.location}</p>
                    <p className="text-sm text-gray-700 mt-1">
                      <span className="font-medium">Category:</span> {job.job_category}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-3 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-white text-xs font-semibold ${job.status === 'Active' ? 'bg-[#72B76A]' : 'bg-gray-400'}`}>
                    {job.employment_type}
                  </span>
                  <Link href={`/recruiters/manage-jobs/${job.id}/applicants`} className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">
                    {job.applicationCount || 0} Applied
                  </Link>
                  <div className="text-xs text-gray-500">
                    <p>Created: {formatDate(job.created_at)}</p>
                    <p className={isExpired(job.created_at) ? "text-red-500" : ""}>Status: {job.status}</p>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/jobs/details?id=${job.id}`} className="p-2 rounded-full text-[#00233e] hover:bg-[rgba(0,35,62,0.1)] transition-colors">
                      <FaEye />
                    </Link>
                    <button onClick={() => setEditJob(job)} className="p-2 rounded-full text-[#0d6efd] hover:bg-[rgba(13,110,253,0.1)] transition-colors">
                      <FaEdit />
                    </button>
                    <button className="text-red-600 rounded-full p-2 hover:bg-[rgba(255,0,0,0.1)] transition-colors">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {currentJobs.length === 0 && (
                <div className="py-10 text-center text-gray-500">No jobs found.</div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-2 mt-5">
            <p>Showing {startIndex + 1} to {Math.min(endIndex, filteredJobs.length)} of {filteredJobs.length} entries</p>
            <div className="flex items-center gap-1">
              <button onClick={handlePrev} disabled={currentPage === 1} className={`px-3 py-1 border rounded ${currentPage === 1 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}>
                <FiChevronLeft size={16} />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button key={i} onClick={() => setCurrentPage(i + 1)} className={`px-3 py-1 border rounded ${currentPage === i + 1 ? "bg-[#023052] text-white" : "bg-gray-100 text-gray-700"}`}>
                  {i + 1}
                </button>
              ))}
              <button onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0} className={`px-3 py-1 border rounded ${currentPage === totalPages || totalPages === 0 ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-gray-100 hover:bg-gray-200"}`}>
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </main>
      </div>
      {/* Modals ... */}
    </>
  );
};

export default Managejobs;
