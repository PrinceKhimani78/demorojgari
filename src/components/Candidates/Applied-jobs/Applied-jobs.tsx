"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Sidebar from "@/components/Common/Sidebar";
import CandidateProfileHeader from "@/components/Candidates/Common/CandidateProfileHeader";
import Link from "next/link";
import { IoChevronForward } from "react-icons/io5";
import { FiChevronRight } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";

const Appliedjobs = () => {
  const { token, isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const sortOptions = [
    "Most Recent",
    "Selected",
    "Shortlisted",
    "Applied",
  ] as const;
  type SortOpt = (typeof sortOptions)[number];
  const [sortBy, setSortBy] = useState<SortOpt>("Most Recent");

  const showOptions = [10, 20, 30, 50] as const;
  const [showN, setShowN] = useState<(typeof showOptions)[number]>(10);

  const [sortOpen, setSortOpen] = useState(false);
  const [showOpen, setShowOpen] = useState(false);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/applications/my-applications`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setApplications(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching applications:", err);
        setLoading(false);
      });
  }, [token]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selected":
        return "#72B76A";
      case "Rejected":
        return "#EF4444";
      case "Shortlisted":
        return "#3B82F6";
      case "Interviewed":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const sortedJobs = [...applications].sort((a, b) => {
    if (sortBy === "Most Recent") {
      return (
        new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
      );
    }
    return 0;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#72B76A]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="pl-2 pr-4 sm:px-2 py-2 flex gap-3 sm:gap-4 my-30 relative">
        {/* Sidebar */}
        <Sidebar
          type="candidate"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />
        {/* Main Content */}
        <main className="flex-1 px-5 py-5 bg-white shadow rounded-lg space-y-8">
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
                  My Applications
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
                    <span className="text-gray-700 font-medium">
                      My Applications
                    </span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>
          {/* Profile */}
          <CandidateProfileHeader />

          {/* Toolbar */}
          <div className="mb-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="font-semibold text-slate-800">
                Showing{" "}
                <span className="text-slate-900">
                  {sortedJobs.length.toLocaleString()}
                </span>{" "}
                jobs
              </p>

              <div className="flex items-center justify-between w-full gap-3 sm:w-auto sm:gap-4 sm:justify-end">
                {/* Sort By */}
                <div className="flex items-center gap-2">
                  <span className="hidden text-sm font-semibold text-gray-800 sm:block">
                    Sort By
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => {
                        setSortOpen((v) => !v);
                        setShowOpen(false);
                      }}
                      className="inline-flex items-center justify-between w-full gap-2 px-4 py-2 text-sm font-medium border sm:w-auto rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                    >
                      <span className="font-semibold text-slate-900">
                        {sortBy}
                      </span>
                      <svg
                        className="w-4 h-4 text-slate-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.54a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
                      </svg>
                    </button>
                    {sortOpen && (
                      <ul className="absolute right-0 z-20 mt-2 overflow-hidden bg-white border shadow-lg w-44 rounded-xl border-slate-200">
                        {sortOptions.map((opt) => (
                          <li key={opt}>
                            <button
                              type="button"
                              onClick={() => {
                                setSortBy(opt);
                                setSortOpen(false);
                              }}
                              className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                                sortBy === opt
                                  ? "bg-slate-50 font-semibold"
                                  : ""
                              }`}
                            >
                              {opt}
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                {/* Show N */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setShowOpen((v) => !v);
                      setSortOpen(false);
                    }}
                    className="inline-flex items-center justify-between w-full gap-2 px-4 py-2 text-sm font-medium border sm:w-auto rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    Show{" "}
                    <span className="font-semibold text-slate-900">
                      {showN}
                    </span>
                    <svg
                      className="w-4 h-4 text-slate-500"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.54a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
                    </svg>
                  </button>
                  {showOpen && (
                    <ul className="absolute right-0 z-20 w-32 mt-2 overflow-hidden bg-white border shadow-lg rounded-xl border-slate-200">
                      {showOptions.map((n) => (
                        <li key={n}>
                          <button
                            type="button"
                            onClick={() => {
                              setShowN(n);
                              setShowOpen(false);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                              showN === n ? "bg-slate-50 font-semibold" : ""
                            }`}
                          >
                            Show {n}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Table View */}
          <div className="overflow-x-auto border border-slate-100 rounded-xl shadow-sm">
            {sortedJobs.length === 0 ? (
              <div className="py-20 text-center">
                <p className="text-gray-500 mb-4 text-lg">
                  You haven't applied for any jobs yet.
                </p>
                <Link
                  href="/jobs"
                  className="px-6 py-2 bg-[#00C9FF] text-white rounded-lg font-bold shadow-md hover:bg-[#00b4e6] transition"
                >
                  Browse Jobs
                </Link>
              </div>
            ) : (
                <table className="min-w-full divide-y divide-slate-100">
                    <thead className="bg-slate-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Job Details</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Applied Date</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Salary</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-center text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-100">
                        {sortedJobs.slice(0, showN).map((app) => (
                            <tr key={app.id} className="hover:bg-slate-50 transition-colors group">
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 font-bold border">
                                            {app.Job?.title?.charAt(0)}
                                        </div>
                                        <div>
                                            <Link href={`/jobs/details?id=${app.Job?.id}`} className="font-bold text-slate-900 hover:text-[#00C9FF] transition-colors">{app.Job?.title}</Link>
                                            <p className="text-xs text-slate-500">{app.Job?.company_name} • {app.Job?.location}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">
                                    {new Date(app.applied_at).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-700">
                                    {app.Job?.salary_min ? `₹${app.Job.salary_min.toLocaleString()} /mo` : "N/A"}
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap">
                                    <span 
                                        className="px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm"
                                        style={{ backgroundColor: getStatusColor(app.status) }}
                                    >
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-5 whitespace-nowrap text-center">
                                    <Link 
                                        href={`/jobs/details?id=${app.Job?.id}`}
                                        className="inline-flex items-center gap-1 text-sm font-bold text-[#72B76A] hover:underline"
                                    >
                                        View Details <FiChevronRight />
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Appliedjobs;
