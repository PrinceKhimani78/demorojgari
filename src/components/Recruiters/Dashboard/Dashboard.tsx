"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Link from "next/link";
import {
  FaBriefcase,
  FaFileAlt,
  FaBell,
  FaEnvelope,
  FaBookmark,
  FaCode,
  FaUserCheck,
  FaBoxOpen,
  FaMapMarkerAlt,
  FaEye,
  FaBuilding,
  FaStar,
  FaTrash,
} from "react-icons/fa";
import Sidebar from "@/components/Common/Sidebar";
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
import { FiChevronRight } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
import RecruiterProfileHeader from "@/components/Recruiters/Common/RecruiterProfileHeader";
const profileViewsData = [
  { month: "January", viewers: 200 },
  { month: "February", viewers: 250 },
  { month: "March", viewers: 350 },
  { month: "April", viewers: 200 },
  { month: "May", viewers: 250 },
  { month: "June", viewers: 150 },
];
const inboxMessages = [
  {
    name: "Lucy Smith",
    message:
      "Bring to the table win-win survival strategies to ensure proactive domination. at the end of the day, going forward, a new normal that has evolved from generation.",
    date: "18 June 2023",
    image: "/images/profile1.webp",
  },
  {
    name: "Richred Paul",
    message:
      "Bring to the table win-win survival strategies to ensure proactive domination. at the end of the day, going forward, a new normal that has evolved from generation.",
    date: "19 June 2023",
    image: "/images/profile1.webp",
  },
  {
    name: "Jon Doe",
    message:
      "Bring to the table win-win survival strategies to ensure proactive domination. at the end of the day, going forward, a new normal that has evolved from generation.",
    date: "20 June 2023",
    image: "/images/profile1.webp",
  },
  {
    name: "Lucy Smith",
    message:
      "Bring to the table win-win survival strategies to ensure proactive domination. at the end of the day, going forward, a new normal that has evolved from generation.",
    date: "18 June 2023",
    image: "/images/profile1.webp",
  },
  {
    name: "Richred Paul",
    message:
      "Bring to the table win-win survival strategies to ensure proactive domination. at the end of the day, going forward, a new normal that has evolved from generation.",
    date: "19 June 2023",
    image: "/images/profile1.webp",
  },
  {
    name: "Jon Doe",
    message:
      "Bring to the table win-win survival strategies to ensure proactive domination. at the end of the day, going forward, a new normal that has evolved from generation.",
    date: "20 June 2023",
    image: "/images/profile1.webp",
  },
];
const applicants = [
  {
    name: "Wanda Montgomery",
    role: "Charted Accountant",
    location: "New York",
    rate: "$20 / Day",
    image: "/images/profile1.webp",
  },
  {
    name: "Peter Hawkins",
    role: "Medical Professed",
    location: "New York",
    rate: "$7 / Hour",
    image: "/images/profile1.webp",
  },
  {
    name: "Ralph Johnson",
    role: "Bank Manger",
    location: "New York",
    rate: "$180 / Day",
    image: "/images/profile1.webp",
  },
  {
    name: "Alexander Black",
    role: "IT Contractor",
    location: "New York",
    rate: "$90 / Week",
    image: "/images/profile1.webp",
  },
];

const activities = [
  {
    icon: <FaEnvelope className="text-green-600" />,
    text: (
      <>
        Nikol Tesla has sent you{" "}
        <span className="text-green-600 font-medium">private message!</span>
      </>
    ),
  },
  {
    icon: <FaBriefcase className="text-blue-600" />,
    text: (
      <>
        Your job for{" "}
        <span className="text-blue-600 font-medium">Web Designer</span> has been
        approved!
      </>
    ),
  },

  {
    icon: <FaBookmark className="text-yellow-500" />,
    text: (
      <>
        Someone bookmarked your{" "}
        <span className="text-yellow-500 font-medium">SEO Expert</span> Job
        listing!
      </>
    ),
  },
  {
    icon: <FaCode className="text-cyan-600" />,
    text: (
      <>
        Your job listing{" "}
        <span className="text-cyan-600 font-medium">Core PHP Developer</span>{" "}
        for Site Maintenance is expiring!
      </>
    ),
  },
  {
    icon: <FaUserCheck className="text-green-700" />,
    text: (
      <>
        You have new application for{" "}
        <span className="text-green-700 font-medium">
          UI/UX Developer & Designer!
        </span>
      </>
    ),
  },
  {
    icon: <FaBoxOpen className="text-red-600" />,
    text: (
      <>
        Your Magento Developer job expire{" "}
        <span className="text-red-600 font-medium">Renew</span> now it.
      </>
    ),
  },
  {
    icon: <FaStar className="text-orange-500" />,
    text: (
      <>
        David cope left a{" "}
        <span className="text-orange-500 font-medium">review 4.5</span> for Real
        Estate Logo
      </>
    ),
  },
  {
    icon: <FaEnvelope className="text-green-600" />,
    text: (
      <>
        Nikol Tesla has sent you{" "}
        <span className="text-green-600 font-medium">private message!</span>
      </>
    ),
  },
  {
    icon: <FaBriefcase className="text-blue-600" />,
    text: (
      <>
        Your job for{" "}
        <span className="text-blue-600 font-medium">Web Designer</span> has been
        approved!
      </>
    ),
  },
];

const Dashboard = () => {
  const { token } = useAuth();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState({
    postedJobs: 0,
    totalCandidates: 0,
    messages: 0,
    newApplications: 0
  });
  const [recentApplicants, setRecentApplicants] = useState<any[]>([]);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.rojgariindia.com/api";

  useEffect(() => {
    const fetchStats = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${BACKEND_URL}/recruiter/stats`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    const fetchRecentApplicants = async () => {
      if (!token) return;
      try {
        const res = await fetch(`${BACKEND_URL}/recruiter/recent-applicants`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await res.json();
        if (data.success) {
          setRecentApplicants(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch recent applicants", err);
      }
    };

    fetchStats();
    fetchRecentApplicants();
  }, [token, BACKEND_URL]);

  return (
    <>
      <div className="pl-2 pr-4 sm:px-2 py-2 flex gap-3 sm:gap-4 my-30 relative">
        {/* Sidebar */}
        <Sidebar
          type="recruiter"
          onDeleteClick={() => setShowModal(true)}
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
                  Recruiters Dashboard
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
                      Recruiters
                    </Link>
                    <FiChevronRight />
                  </li>
                  <li>
                    <span className="text-gray-700 font-medium">Dashboard</span>
                  </li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Profile */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-200">
            <RecruiterProfileHeader />
            <Link 
              href="/recruiters/manage-industries"
              className="px-4 py-2 bg-white border border-[#72B76A] text-[#72B76A] hover:bg-[#72B76A] hover:text-white rounded-lg text-sm font-semibold transition flex items-center gap-2 h-fit w-fit"
            >
              <FaBuilding size={14} /> Manage My Industries
            </Link>
          </div>


          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Posted Jobs",
                value: stats.postedJobs,
                icon: <FaBriefcase />,
                color: "bg-[#FFCC23]",
                link: "/recruiters/manage-jobs"
              },
              {
                title: "Total Candidates",
                value: stats.totalCandidates,
                icon: <FaFileAlt />,
                color: "bg-[#72B76A]",
                link: "/recruiters/candidates-list"
              },
              {
                title: "Messages",
                value: stats.messages,
                icon: <FaEnvelope />,
                color: "bg-[#AE70BB]",
                link: "/recruiters/resume-alerts"
              },
              {
                title: "New Applications",
                value: stats.newApplications,
                icon: <FaBell />,
                color: "bg-[#00C9FF]",
                link: "/recruiters/manage-jobs"
              },
            ].map((card, i) => (
              <Link
                key={i}
                href={card.link}
                className={`${card.color} text-white p-6 rounded-lg shadow flex justify-between items-center hover:opacity-90 transition-all active:scale-95`}
              >
                <div className="flex flex-col gap-2">
                  <div className="text-3xl text-white">{card.icon}</div>
                  <p className="text-sm">{card.title}</p>
                </div>
                <p className="text-3xl font-bold">{card.value}</p>
              </Link>
            ))}
          </div>
          {/* Profile Views & Inbox side by side */}
          <div className="grid ">
            {/* Profile Views */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FaFileAlt /> Your Profile Views
              </h3>
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={profileViewsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="viewers"
                      stroke="#42A5F5"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "#42A5F5" }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Inbox */}
            {/* <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Inbox</h3>

             
              <div className="divide-y divide-gray-200 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-[#023052] scrollbar-track-gray-100">
                {inboxMessages.map((msg, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-4 py-4 hover:bg-gray-50 transition"
                  >
                    <Image
                      src={msg.image}
                      alt={msg.name}
                      width={50}
                      height={50}
                      className="rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <h4 className="font-semibold">{msg.name}</h4>
                        <span className="text-xs text-gray-500">
                          {msg.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                        {msg.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div> */}
          </div>
          {/* Recent Activities  */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
              <FaBriefcase className="text-gray-600" />
              Recent Activities
            </h3>

            {/* Activities list */}
            <div className="divide-y divide-gray-200 max-h-72 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {activities.map((activity, i) => (
                <div key={i} className="flex items-start gap-3 py-3 text-sm">
                  <div className="text-lg">{activity.icon}</div>
                  <p className="text-gray-700 leading-snug">{activity.text}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Recent Applicants */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Applicants</h3>
            <div className="divide-y divide-gray-400">
              {recentApplicants.length === 0 ? (
                <div className="py-8 text-center text-gray-400">No recent applications found.</div>
              ) : (
                recentApplicants.map((app, i) => {
                  const candidate = app.CandidateProfile;
                  const photoSrc = candidate?.profile_photo
                      ? (candidate.profile_photo.startsWith('http')
                          ? candidate.profile_photo
                          : `${(BACKEND_URL || '').replace('/api', '')}/uploads/${candidate.profile_photo}`)
                      : "/images/profile1.webp";

                  return (
                    <div
                      key={i}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4  hover:bg-gray-50 rounded-lg transition gap-4"
                    >
                      <div className=" flex items-center gap-4  ">
                        <Image
                          src={photoSrc}
                          alt={candidate?.full_name || "Applicant"}
                          width={50}
                          height={50}
                          className="rounded-full border object-cover h-12 w-12"
                        />
                        <div>
                          <h4 className="font-semibold text-sm sm:text-base">
                            {candidate?.full_name}
                          </h4>
                          <p className="text-[10px] sm:text-[15px] text-gray-500">
                            Applied for: {app.Job?.title}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] sm:text-sm text-gray-600 mt-1">
                            <FaMapMarkerAlt className="text-[#42A5F5]" />
                            <span>{candidate?.location || "N/A"}</span>
                            <span className="text-green-600 font-medium">
                              {app.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex sm:flex-row flex-row sm:justify-end justify-center gap-3 ">
                        <Link href={`/recruiters/candidates-list`} className="p-2 rounded-full text-[#00233e] hover:bg-[rgba(0,35,62,0.1)] transition-colors">
                          <FaEye />
                        </Link>
                        <button className="p-2 hover:bg-blue-50 rounded-full text-[#42A5F5]">
                          <FaEnvelope />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </main>
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
            <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md relative">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl font-bold"
              >
                ×
              </button>
              <div className="px-6 py-8 text-center">
                <p className="text-lg font-medium mb-6">
                  Do you want to delete your profile?
                </p>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    No
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch("/api/delete-profile", {
                          method: "DELETE",
                        });
                        if (res.ok) {
                          console.log("Profile deleted successfully");
                          // optional: redirect or logout
                        } else {
                          console.error("Failed to delete profile");
                        }
                      } catch (err) {
                        console.error("Error deleting profile", err);
                      }
                      setShowModal(false);
                    }}
                    className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                  >
                    Yes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* <Footer /> */}
    </>
  );
};

export default Dashboard;
