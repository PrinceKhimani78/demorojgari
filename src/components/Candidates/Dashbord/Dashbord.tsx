"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaBriefcase,
  FaFileAlt,
  FaBell,
  FaEnvelope,
  FaMapMarkerAlt,
  FaEye,
  FaTrash,
} from "react-icons/fa";
import { FiChevronRight } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "@/components/Common/Sidebar";
import CandidateProfileHeader from "@/components/Candidates/Common/CandidateProfileHeader";
import { IoChevronForward } from "react-icons/io5";

const profileViewsData = [
  { month: "January", viewers: 200 },
  { month: "February", viewers: 250 },
  { month: "March", viewers: 350 },
  { month: "April", viewers: 200 },
  { month: "May", viewers: 250 },
  { month: "June", viewers: 150 },
];

const Dashbord = () => {
  const { user, token, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState({
    totalApplications: 0,
    savedJobs: 0,
    messages: 0,
    jobAlerts: 0,
    recentApplications: []
  });
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/");
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (!token) return;

    fetch(`/api/candidate-profile/dashboard/stats`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .catch(err => console.error("Error fetching candidate stats:", err))
      .finally(() => setFetching(false));
  }, [token]);

  if (isLoading || (fetching && !stats.totalApplications)) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#72B76A]"></div>
      </div>
    );
  }

  return (
    <>
      <div className="pl-2 pr-4 sm:px-2 py-2 flex gap-3 sm:gap-4 my-30 relative ">
        <Sidebar
          type="candidate"
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
                  Candidates Dashboard
                </h1>
              </div>
              <nav aria-label="Breadcrumb" className="hidden sm:block text-sm text-gray-500">
                <ol className="flex items-center gap-2">
                  <li><Link href="/" className="hover:text-gray-700">Home</Link></li>
                  <li><FiChevronRight /></li>
                  <li><Link href="/candidates" className="hover:text-gray-700">Candidates</Link></li>
                  <li><FiChevronRight /></li>
                  <li className="text-gray-700 font-medium">Dashboard</li>
                </ol>
              </nav>
            </div>
          </div>

          <CandidateProfileHeader />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Total Applications", value: stats.totalApplications, icon: <FaBriefcase />, color: "bg-[#FFCC23]" },
              { title: "Saved Jobs", value: stats.savedJobs, icon: <FaFileAlt />, color: "bg-[#72B76A]" },
              { title: "Messages", value: stats.messages, icon: <FaEnvelope />, color: "bg-[#AE70BB]" },
              { title: "Job Alerts", value: stats.jobAlerts, icon: <FaBell />, color: "bg-[#00C9FF]" },
            ].map((card, i) => (
              <div key={i} className={`${card.color} text-white p-6 rounded-lg shadow flex justify-between items-center transform hover:scale-102 transition-transform`}>
                <div className="flex flex-col gap-2">
                  <div className="text-3xl">{card.icon}</div>
                  <p className="text-sm font-medium">{card.title}</p>
                </div>
                <p className="text-3xl font-bold">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Your Profile Views</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={profileViewsData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="viewers" stroke="#42A5F5" strokeWidth={3} dot={{ r: 5, fill: "#42A5F5" }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Applications</h3>
            <div className="divide-y divide-gray-100 italic">
              {stats.recentApplications && stats.recentApplications.length > 0 ? (
                stats.recentApplications.map((app: any, i) => (
                  <div key={i} className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 px-2 hover:bg-gray-50 rounded-lg transition gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded border bg-slate-100 flex items-center justify-center text-slate-400 font-bold">LOGO</div>
                      <div>
                        <h4 className="font-semibold text-lg hover:text-[#00C9FF] transition-colors">
                          <Link href={`/jobs/details?id=${app.job_id}`}>{app.Job?.title}</Link>
                        </h4>
                        <p className="text-sm text-gray-500">{app.Job?.company_name}</p>
                        <div className="flex items-center gap-4 text-xs mt-1">
                          <span className="flex items-center gap-1 text-gray-500">
                             <FaMapMarkerAlt className="text-[#00C9FF]" /> {app.Job?.location}
                          </span>
                          <span className="text-blue-600 font-semibold">{app.status}</span>
                          <span className="text-gray-400">Applied on: {new Date(app.applied_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                       <Link href={`/jobs/details?id=${app.job_id}`} className="p-2 border rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                          <FaEye />
                       </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-400 not-italic">No recent applications found.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashbord;
