"use client";
import Sidebar from "@/components/Common/Sidebar";
import CandidateProfileHeader from "@/components/Candidates/Common/CandidateProfileHeader";
import React, { useState } from "react";
import { FaEye, FaTrash } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";

import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const Savedjobs = () => {
  const { token, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    if (isAuthenticated && token) {
      fetchSavedJobs();
    }
  }, [isAuthenticated, token]);

  const fetchSavedJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/applications/saved-jobs", {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success && data.data) {
        setJobs(data.data);
      }
    } catch (err) {
      console.error("Error fetching saved jobs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (jobId: string) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/applications/saved-jobs/${jobId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setJobs(jobs.filter(j => j.job_id !== jobId));
      }
    } catch (err) {
      console.error("Error removing saved job:", err);
    }
  };

  const totalPages = Math.ceil(jobs.length / entries) || 1;

  const startIndex = (currentPage - 1) * entries;
  const endIndex = startIndex + entries;
  const currentJobs = jobs.slice(startIndex, endIndex);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleEntriesChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEntries(Number(e.target.value));
    setCurrentPage(1); // reset to first page on change
  };

  return (
    <div className="pl-2 pr-4 sm:px-2 py-2 flex gap-3 sm:gap-4 my-30 relative">
      {/* sidebar  */}
      <Sidebar
        type="candidate"
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      <main className="flex-1 px-5 py-5 min-w-0 bg-white shadow rounded-lg space-y-8">
        {/* Title + Breadcrumb */}
        <div className="border-b pb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            {/* Mobile toggle button */}
            <div className="flex gap-5 items-center ">
              <IoChevronForward
                onClick={() => setMobileOpen(true)}
                className="text-[white] text-2xl cursor-pointer md:hidden bg-black rounded-full p-1"
              />
              <h1
                className="fontAL font-semibold capitalize text-xl md:text-2xl lg:text-3xl "
                style={{
                  letterSpacing: "1px",
                  wordSpacing: "2px",
                  lineHeight: 1.2,
                }}
              >
                Saved-jobs
              </h1>
            </div>

            {/* Breadcrumbs (hidden on mobile) */}
            <nav
              aria-label="Breadcrumb"
              className="hidden sm:block text-sm text-gray-500 text-center sm:text-right"
            >
              <ol className="flex items-center justify-center sm:justify-end gap-2 flex-wrap">
                <li className="flex items-center gap-2">
                  <Link href="/" className="hover:text-gray-700 transition">
                    Home
                  </Link>
                  <FiChevronRight />
                </li>
                <li className="flex items-center gap-2">
                  <Link
                    href="/candidates"
                    className="hover:text-gray-700 transition"
                  >
                    Candidates
                  </Link>
                  <FiChevronRight />
                </li>
                <li>
                  <span className="text-gray-700 font-medium">Saved-jobs</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>

        {/* Profile */}
        <CandidateProfileHeader />


        {/* saved jobs controls */}
        <div className="flex flex-col sm:flex-row justify-between  gap-3">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={entries}
              onChange={handleEntriesChange}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={20}>20</option>
            </select>
            <span>entries</span>
          </div>
          <div>
            <input
              type="text"
              placeholder="Search..."
              className="w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 ring-gray-400 
      transition focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00c9ff]"
            />
          </div>
        </div>

        {/* Jobs Table */}
        <div className="">
          <div className="w-full border border-gray-400 rounded-md text-sm ">
            {/* Header Row (hidden on small screens) */}
            <div className="hidden sm:grid grid-cols-4 bg-gray-100 border-b border-gray-400 font-semibold">
              <div className="px-4 py-2 border-r last:border-r-0 border-gray-400">
                Job Title
              </div>
              <div className="px-4 py-2 border-r last:border-r-0 border-gray-400">
                Company
              </div>
              <div className="px-4 py-2 border-r last:border-r-0 border-gray-400">
                Date
              </div>
              <div className="px-4 py-2">Action</div>
            </div>

            {/* Data Rows */}
            {loading ? (
              <div className="p-10 text-center text-gray-500 font-medium">Loading saved jobs...</div>
            ) : currentJobs.length === 0 ? (
              <div className="p-10 text-center text-gray-500 font-medium">You have not saved any jobs yet.</div>
            ) : currentJobs.map((item, i) => (
              <div
                key={item.id}
                className={`grid grid-cols-1 sm:grid-cols-4 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } border-b border-gray-400`}
              >
                {/* Job Title */}
                <div className="px-3 py-2 border-r last:border-r-0 border-gray-400 grid grid-cols-[40px_1fr] gap-3 items-center font-medium text-[#00C9FF]">
                  {/* Logo */}
                  <Image
                    src={item.job?.company_logo || "/images/companyname.webp"}
                    alt={item.job?.title || "Job"}
                    width={32}
                    height={32}
                    className="rounded"
                  />

                  {/* Text (label + title stacked) */}
                  <div className="flex flex-col">
                    <span className="sm:hidden font-semibold text-gray-700 text-xs">
                      Job Title:
                    </span>
                    <Link href={`/jobs/details?id=${item.job_id}`} className="hover:underline">
                      {item.job?.title || "Unknown Job"}
                    </Link>
                  </div>
                </div>

                {/* Company */}
                <div className="px-4 py-2 border-r last:border-r-0 border-gray-400 flex items-center gap-2">
                  <span className="sm:hidden font-semibold text-gray-700">
                    Company:
                  </span>
                  {item.job?.company_name || "Unknown Company"}
                </div>

                {/* Date */}
                <div className="px-4 py-2 border-r border-gray-400 flex items-center gap-2">
                  <span className="sm:hidden font-semibold text-gray-700">
                    Date:
                  </span>
                  {new Date(item.created_at).toLocaleDateString()}
                </div>

                {/* Action */}
                <div className="px-4 py-2 flex gap-3 justify-center items-center">
                  <span className="sm:hidden font-semibold text-gray-700">
                    Action:
                  </span>
                  <Link href={`/jobs/details?id=${item.job_id}`}>
                    <button className="p-2 rounded-full text-[#00233e] hover:bg-[rgba(0,35,62,0.1)] transition-colors">
                      <FaEye />
                    </button>
                  </Link>
                  <button onClick={() => handleRemove(item.job_id)} className="text-red-600 rounded-full p-2 hover:bg-[rgba(255,0,0,0.1)] transition-colors">
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600 gap-2 mt-5">
            <p>
              Showing {startIndex + 1} to{" "}
              {endIndex > jobs.length ? jobs.length : endIndex} of {jobs.length}{" "}
              entries
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={handlePrev}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded flex items-center justify-center ${currentPage === 1
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                <FiChevronLeft size={16} />
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 border rounded cursor-pointer ${currentPage === index + 1
                      ? "bg-[#023052] text-white"
                      : "bg-gray-100 text-gray-700"
                    }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded flex items-center justify-center ${currentPage === totalPages
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 hover:bg-gray-200"
                  }`}
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Savedjobs;
