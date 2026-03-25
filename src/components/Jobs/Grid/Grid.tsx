"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaMapMarkerAlt, FaBriefcase, FaRupeeSign, FaClock } from "react-icons/fa";

/* =============================
   Types
============================= */
interface Job {
  id: string;
  title: string;
  description: string;
  requirements?: string;
  location: string;
  job_category?: string;
  employment_type: string;
  salary_min?: number;
  salary_max?: number;
  exp_min?: number;
  exp_max?: number;
  company_name?: string;
  department?: string;
  job_role?: string;
  industry?: string;
  skills?: string;
  status: string;
  created_at: string;
}

const categories = [
  "All Category",
  "Design",
  "Development",
  "Marketing",
  "Sales",
  "Operations",
];

const jobTypeOptions = [
  { label: "Full-time", key: "Full-time" },
  { label: "Part-time", key: "Part-time" },
  { label: "Contract", key: "Contract" },
  { label: "Internship", key: "Internship" },
  { label: "Freelance", key: "Freelance" },
];

const datePostOptions = [
  "Last 24 hours",
  "Last 7 days",
  "Last 14 days",
  "Last 30 days",
  "All",
] as const;
type DatePost = (typeof datePostOptions)[number];

const TAGS = [
  "General",
  "Jobs",
  "Payment",
  "Application",
  "Work",
  "Recruiting",
  "Employer",
  "Income",
  "Tips",
] as const;

/* =============================
   Helpers
============================= */
const timeAgo = (dateStr: string): string => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const formatSalary = (min?: number, max?: number): string => {
  if (!min && !max) return "Not disclosed";
  if (min && max) return `₹${min.toLocaleString('en-IN')} - ₹${max.toLocaleString('en-IN')} /Month`;
  if (min) return `₹${min.toLocaleString('en-IN')} /Month`;
  return `₹${max?.toLocaleString('en-IN')} /Month`;
};

const typeColors: Record<string, string> = {
  "Full-time": "#72B76A",
  "Part-time": "#FFCC23",
  "Contract": "#AE70BB",
  "Internship": "#00C9FF",
  "Freelance": "#023052",
};

/* =============================
   Page
============================= */
const Grid = () => {
  type Crumb = { name: string; href?: string };
  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Jobs" }];

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState(categories[0]);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [selectedJobTypes, setSelectedJobTypes] = useState<string[]>([]);
  const [datePost, setDatePost] = useState<DatePost>("All");
  const [sortOpen, setSortOpen] = useState(false);
  const [showOpen, setShowOpen] = useState(false);

  const sortOptions = ["Most Recent", "Salary High", "Salary Low"] as const;
  type SortOpt = (typeof sortOptions)[number];
  const [sortBy, setSortBy] = useState<SortOpt>("Most Recent");
  const showOptions = [10, 20, 30, 50] as const;
  const [showN, setShowN] = useState<(typeof showOptions)[number]>(10);

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/jobs");
        const data = await res.json();
        if (data.success && data.data) {
          setJobs(data.data);
        }
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  // Filter logic
  const filteredJobs = jobs.filter((job) => {
    if (keyword && !job.title.toLowerCase().includes(keyword.toLowerCase()) &&
        !(job.description || '').toLowerCase().includes(keyword.toLowerCase())) return false;
    if (location && !(job.location || '').toLowerCase().includes(location.toLowerCase())) return false;
    if (selectedJobTypes.length > 0 && !selectedJobTypes.includes(job.employment_type)) return false;
    if (datePost !== "All") {
      const hoursMap: Record<string, number> = {
        "Last 24 hours": 24,
        "Last 7 days": 168,
        "Last 14 days": 336,
        "Last 30 days": 720,
      };
      const hours = hoursMap[datePost] || Infinity;
      const diff = (Date.now() - new Date(job.created_at).getTime()) / 3600000;
      if (diff > hours) return false;
    }
    return true;
  });

  // Sort
  const sortedJobs = [...filteredJobs].sort((a, b) => {
    switch (sortBy) {
      case "Salary High":
        return (b.salary_max || 0) - (a.salary_max || 0);
      case "Salary Low":
        return (a.salary_min || 0) - (b.salary_min || 0);
      case "Most Recent":
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }
  });

  const displayedJobs = sortedJobs.slice(0, showN);

  const toggleJobType = (label: string) =>
    setSelectedJobTypes((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );

  // Job type counts from real data
  const jobTypeCounts = jobTypeOptions.map(opt => ({
    ...opt,
    count: jobs.filter(j => j.employment_type === opt.key).length,
  }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <>
      {/* ===== banner ===== */}
      <section className="relative overflow-hidden">
        <div className="h-[220px] lg:h-[350px] bg-[url('/images/RI_banner_bg.webp')] bg-cover bg-center bg-no-repeat bg-fixed" />
        <div className="absolute inset-0 flex h-[220px] lg:h-[350px] place-items-end  justify-center px-5 lg:px-[5%] 2xl:px-[10%]">
          <div className="max-w-screen-xl w-full text-center">
            <h1 className="inline-block mb-4 px-4 py-2 text-slate-900  sm:text-xl fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5">
              The Most Exciting Jobs
            </h1>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-700">
              <ol className="flex items-center justify-center gap-2">
                {crumbs.map((c, i) => {
                  const isLast = i === crumbs.length - 0;
                  return (
                    <li key={c.name} className="flex items-center gap-2">
                      {i > 0 && (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400" aria-hidden="true">
                          <path d="M7.05 4.55a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 1 1-1.4-1.4L9.88 10 7.05 7.15a1 1 0 0 1 0-1.4z" />
                        </svg>
                      )}
                      {isLast || !c.href ? (
                        <span className="fontPOP text-xs sm:text-sm">{c.name}</span>
                      ) : (
                        <a href={c.href} className="hover:text-slate-900 fontPOP text-xs sm:text-sm">{c.name}</a>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* ===== main content ===== */}
      <div className="">
        <section className="pb-10 px-1 lg:px-[5%] 2xl:px-[15%]">
          <div className="max-w-screen-xl px-4 py-10 mx-auto sm:px-6 lg:px-8 md:py-14">
            <div className="flex flex-col items-start gap-8 lg:flex-row lg:gap-8">
              {/* Sidebar filters */}
              <div className="w-full lg:w-[268px] lg:sticky lg:top-24 flex-shrink-0">
                <aside>
                  <form onSubmit={submit} className="p-5 bg-white shadow">
                    {/* Category */}
                    <label className="block mb-2 text-[15px] font-bold text-slate-800">Category</label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        className="flex items-center justify-between w-full px-4 py-3 text-sm text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50"
                      >
                        <span className="truncate">{category}</span>
                        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.54a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                        </svg>
                      </button>
                      {open && (
                        <ul className="absolute z-20 w-full mt-1 overflow-hidden bg-white border border-gray-200 shadow-lg rounded-xl" role="listbox">
                          {categories.map((c) => (
                            <li key={c}>
                              <button
                                type="button"
                                onClick={() => { setCategory(c); setOpen(false); }}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-50 ${c === category ? "bg-gray-50 font-medium" : ""}`}
                                role="option"
                                aria-selected={c === category}
                              >
                                {c}
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    {/* Keyword */}
                    <label className="block mt-6 mb-2 text-sm font-bold text-slate-700">Keyword</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Job title or Keyword"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className="w-full px-4 py-3 pr-10 text-sm placeholder-gray-400 border border-gray-200 rounded-xl focus:border-gray-300 focus:outline-none"
                      />
                      <div className="absolute inset-y-0 flex items-center pointer-events-none right-3">
                        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.9 14.32a7 7 0 111.414-1.414l3.39 3.39a1 1 0 01-1.414 1.414l-3.39-3.39zM14 9a5 5 0 11-10 0 5 5 0 0110 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>

                    {/* Location */}
                    <label className="block mt-6 mb-2 text-sm font-bold text-slate-700">Location</label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-4 py-3 pr-10 text-sm placeholder-gray-400 border border-gray-200 rounded-xl focus:border-gray-300 focus:outline-none"
                      />
                      <div className="absolute inset-y-0 flex items-center pointer-events-none right-3">
                        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                        </svg>
                      </div>
                    </div>

                    {/* Job Type */}
                    <label className="block mt-6 mb-3 text-sm font-semibold text-gray-800">Job Type</label>
                    <ul className="space-y-3">
                      {jobTypeCounts.map(({ label, key, count }) => {
                        const id = `jt-${key.toLowerCase().replace(/\s+/g, "-")}`;
                        const checked = selectedJobTypes.includes(key);
                        return (
                          <li key={key} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <input
                                id={id}
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleJobType(key)}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                              />
                              <label htmlFor={id} className="text-[15px] text-gray-800">{label}</label>
                            </div>
                            <span className="text-[13px] font-semibold text-blue-600">
                              {String(count).padStart(2, "0")}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Date Posts */}
                    <label className="block mt-8 mb-3 text-sm font-semibold text-gray-800">Date Posts</label>
                    <ul className="space-y-3">
                      {datePostOptions.map((opt) => {
                        const id = `dp-${opt.toLowerCase().replace(/\s+/g, "-")}`;
                        return (
                          <li key={opt} className="flex items-center gap-3">
                            <input id={id} type="radio" name="date-posts" value={opt} checked={datePost === opt} onChange={() => setDatePost(opt)} className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500" />
                            <label htmlFor={id} className="text-[15px] text-gray-800">{opt}</label>
                          </li>
                        );
                      })}
                    </ul>
                  </form>

                  {/* Tags */}
                  <div className="p-5 mt-6 bg-white border shadow-sm rounded-lg border-slate-200">
                    <h4 className="mb-4 text-[16px] font-semibold text-slate-900">Tags</h4>
                    <div className="flex flex-wrap gap-3">
                      {TAGS.map((tag) => (
                        <button key={tag} type="button" className="rounded-full bg-blue-50 px-3 py-1.5 text-[13px] font-medium text-blue-700 hover:bg-blue-100">
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Recruiting CTA */}
                  <div className="mt-6 overflow-hidden rounded-lg border border-blue-100 shadow-[0_6px_24px_-12px_rgba(59,130,246,0.35)]">
                    <div className="relative h-48 sm:h-56 md:h-64">
                      <Image src="/images/job-grid.webp" alt="Recruiting" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/70 to-blue-600/60" />
                      <div className="absolute inset-0 flex flex-col justify-center p-6">
                        <h3 className="mb-2 text-xl font-semibold text-white">Recruiting?</h3>
                        <p className="mb-5 text-sm leading-6 text-white/90">Get Best Matched Jobs On your Email. Add Resume NOW!</p>
                        <Link href="/pages/aboutus">
                          <button className="relative mt-8 px-4 h-9 overflow-hidden border border-[white] bg-white rounded-lg hover:bg-transparent text-[blue] hover:text-[white] active:scale-90 transition-all ease-out duration-700 cursor-pointer">
                            <span className="relative flex gap-2 items-center text-sm font-semibold">Know More</span>
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </aside>
              </div>

              {/* Main Job Cards */}
              <div className="w-full lg:flex-1">
                {/* Toolbar */}
                <div className="mb-12">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-semibold text-slate-800">
                      Showing{" "}
                      <span className="text-slate-900">{displayedJobs.length.toLocaleString()}</span>{" "}
                      of {filteredJobs.length} jobs
                    </p>

                    <div className="flex items-center justify-between w-full gap-3 sm:w-auto sm:gap-4 sm:justify-end">
                      {/* Sort By */}
                      <div className="flex items-center gap-2">
                        <span className="hidden text-sm font-semibold text-gray-800 sm:block">Sort By</span>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => { setSortOpen((v) => !v); setShowOpen(false); }}
                            className="inline-flex items-center justify-between w-full gap-2 px-4 py-2 text-sm font-medium border sm:w-auto rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                          >
                            <span className="font-semibold text-slate-900">{sortBy}</span>
                            <svg className="w-4 h-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.54a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
                            </svg>
                          </button>
                          {sortOpen && (
                            <ul className="absolute right-0 z-20 mt-2 overflow-hidden bg-white border shadow-lg w-44 rounded-xl border-slate-200">
                              {sortOptions.map((opt) => (
                                <li key={opt}>
                                  <button
                                    type="button"
                                    onClick={() => { setSortBy(opt); setSortOpen(false); }}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${sortBy === opt ? "bg-slate-50 font-semibold" : ""}`}
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
                          onClick={() => { setShowOpen((v) => !v); setSortOpen(false); }}
                          className="inline-flex items-center justify-between w-full gap-2 px-4 py-2 text-sm font-medium border sm:w-auto rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          Show <span className="font-semibold text-slate-900">{showN}</span>
                          <svg className="w-4 h-4 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5.23 7.21a.75.75 0 011.06.02L10 11.19l3.71-3.96a.75.75 0 111.08 1.04l-4.25 4.54a.75.75 0 01-1.08 0L5.25 8.27a.75.75 0 01-.02-1.06z" />
                          </svg>
                        </button>
                        {showOpen && (
                          <ul className="absolute right-0 z-20 w-32 mt-2 overflow-hidden bg-white border shadow-lg rounded-xl border-slate-200">
                            {showOptions.map((n) => (
                              <li key={n}>
                                <button
                                  type="button"
                                  onClick={() => { setShowN(n); setShowOpen(false); }}
                                  className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${showN === n ? "bg-slate-50 font-semibold" : ""}`}
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

                {/* Cards */}
                {loading ? (
                  <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#72B76A]"></div>
                  </div>
                ) : displayedJobs.length === 0 ? (
                  <div className="text-center py-20 text-gray-500">
                    <FaBriefcase className="text-5xl text-gray-300 mx-auto mb-4" />
                    <p className="text-lg font-semibold">No jobs found</p>
                    <p className="text-sm mt-1">Try adjusting your filters or check back later.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6 sm:gap-8 sm:grid-cols-2">
                    {displayedJobs.map((job) => {
                      const color = typeColors[job.employment_type] || "#72B76A";
                      return (
                        <div
                          key={job.id}
                          className="bg-white p-5 rounded-lg group shadow-md 
                     transition-all duration-300 ease-in-out 
                     hover:-translate-y-2 hover:shadow-xl hover:bg-[#F9FAFB]"
                        >
                          <div className="flex justify-between gap-4 items-start">
                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xl text-gray-400 flex-shrink-0">
                              <FaBriefcase />
                            </div>
                            <div className="flex gap-3 items-center flex-shrink-0">
                              <p className="text-[#72B76A] text-xs">{timeAgo(job.created_at)}</p>
                              <span
                                className="px-3 py-1 rounded-md text-white text-xs font-semibold"
                                style={{ backgroundColor: color }}
                              >
                                {job.employment_type}
                              </span>
                            </div>
                          </div>

                          <h3 className="font-semibold mt-4 text-base group-hover:text-[#72B76A] transition-colors line-clamp-2">
                            {job.title}
                          </h3>

                          {job.company_name && (
                            <p className="text-sm text-gray-600 mt-1 font-medium">{job.company_name}</p>
                          )}

                          <p className="text-sm text-gray-500 mt-2 mb-4 line-clamp-2">
                            {job.description}
                          </p>

                          <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-4">
                            {job.location && (
                              <span className="flex items-center gap-1">
                                <FaMapMarkerAlt className="text-[#00c9ff]" /> {job.location}
                              </span>
                            )}
                            {(job.exp_min !== undefined || job.exp_max !== undefined) && (
                              <span className="flex items-center gap-1">
                                <FaClock className="text-gray-400" />
                                {job.exp_min || 0}-{job.exp_max || 0} yrs
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <p className="font-semibold text-sm text-gray-800">
                              {formatSalary(job.salary_min, job.salary_max)}
                            </p>
                            <Link
                              href={`/jobs/details?id=${job.id}`}
                              className="text-[#72B76A] text-sm hover:underline underline-offset-4 font-medium"
                            >
                              Job details →
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Grid;
