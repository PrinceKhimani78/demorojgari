"use client";
import React, { useEffect, useState, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaEye,
  FaGlobe,
  FaUserFriends,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaBriefcase,
  FaHourglassHalf,
  FaGraduationCap,
  FaVenusMars,
  FaDollarSign,
  FaFacebook,
  FaTwitter,
  FaLinkedin,
  FaWhatsapp,
  FaPinterest,
} from "react-icons/fa";

type JobData = {
  id: string;
  title: string;
  description: string;
  requirements: string;
  location: string;
  job_category: string;
  department: string;
  job_role: string;
  qualifications: string;
  gender: string;
  skills: string;
  industry: string;
  languages: string;
  employment_type: string;
  salary_min: string | number;
  salary_max: string | number;
  exp_min: string | number;
  exp_max: string | number;
  company_name: string;
  perks_and_benefits: string;
  posting_as: string;
  contact_name: string;
  contact_number: string;
  created_at: string;
  status: string;
};

const formatSalary = (min?: string | number, max?: string | number) => {
  if (!min && !max) return "Not disclosed";
  if (min && max) return `₹${Number(min).toLocaleString()} - ₹${Number(max).toLocaleString()} /Month`;
  if (min) return `₹${Number(min).toLocaleString()} /Month`;
  return `₹${Number(max).toLocaleString()} /Month`;
};

const formatExp = (min?: string | number, max?: string | number) => {
  if (min == null && max == null) return "Not specified";
  if (min != null && max != null) return `${min} - ${max} Yrs`;
  if (min != null) return `${min}+ Yrs`;
  return `Up to ${max} Yrs`;
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const JobDetailsContent = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/jobs/view/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setJob(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#72B76A]"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-2xl font-bold text-gray-800">Job Not Found</h2>
        <p className="text-gray-500 mt-2">The job you are looking for does not exist or has been removed.</p>
        <Link href="/jobs" className="mt-4 px-6 py-2 bg-[#00c9ff] text-white rounded-lg font-medium hover:bg-[#00b4e6] transition-colors">
          Browse Jobs
        </Link>
      </div>
    );
  }

  // Parse arrays from CSV
  const requirementsList = job.requirements ? job.requirements.split("\n").filter(Boolean) : [];
  const skillsList = job.skills ? job.skills.split(",").map(s => s.trim()).filter(Boolean) : [];
  const perksList = job.perks_and_benefits ? job.perks_and_benefits.split(",").filter(Boolean) : [];

  const crumbs = [
    { name: "Home", href: "/" },
    { name: "Jobs", href: "/jobs" },
    { name: job.title },
  ];

  // Sharing links
  const JOB_URL = typeof window !== "undefined" ? window.location.href : "";
  const SHARE_TEXT = `${job.title} at ${job.company_name} — apply now!`;

  const SHARE_LINKS = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(JOB_URL)}`,
      Icon: FaFacebook,
      cls: "bg-[#1877F2] hover:brightness-95",
    },
    {
      name: "Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(SHARE_TEXT)}&url=${encodeURIComponent(JOB_URL)}`,
      Icon: FaTwitter,
      cls: "bg-[#1DA1F2] hover:brightness-95",
    },
    {
      name: "Linkedin",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(JOB_URL)}`,
      Icon: FaLinkedin,
      cls: "bg-[#0A66C2] hover:brightness-95",
    },
    {
      name: "Whatsapp",
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(`${SHARE_TEXT} ${JOB_URL}`)}`,
      Icon: FaWhatsapp,
      cls: "bg-[#25D366] hover:brightness-95",
    },
  ];

  const Check = () => (
    <svg viewBox="0 0 24 24" className="h-5 w-5 flex-shrink-0">
      <path d="M9 12.75 11.25 15 15 9.75" fill="none" stroke="rgb(37 99 235)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="h-[180px] sm:h-[220px] lg:h-[350px] bg-[url('/images/RI_banner_bg.webp')] bg-cover bg-center bg-no-repeat bg-fixed" />
        <div className="absolute inset-0 flex h-[180px] sm:h-[220px] lg:h-[350px] place-items-end justify-center px-5 lg:px-[5%] 2xl:px-[10%]">
          <div className="max-w-screen-xl w-full text-center">
            <h1 className="inline-block mb-4 px-4 py-2 text-slate-900 sm:text-xl fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5">
              {job.title}
            </h1>
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-700">
              <ol className="flex items-center justify-center gap-2">
                {crumbs.map((c, i) => {
                  const isLast = i === crumbs.length - 1;
                  return (
                    <li key={c.name} className="flex items-center gap-2">
                      {i > 0 && (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                          <path d="M7.05 4.55a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 1 1-1.4-1.4L9.88 10 7.05 7.15a1 1 0 0 1 0-1.4z" />
                        </svg>
                      )}
                      {isLast || !c.href ? (
                        <span className="fontPOP text-xs sm:text-sm text-gray-800 font-semibold">{c.name}</span>
                      ) : (
                        <Link href={c.href} className="hover:text-slate-900 fontPOP text-xs sm:text-sm text-gray-500">
                          {c.name}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        </div>
      </section>

      <section className="py-10 px-5 lg:px-[5%] 2xl:px-[15%]">
        <div className="mx-auto max-w-6xl grid gap-10 lg:grid-cols-[2fr_1fr] items-start">
          {/* Main content */}
          <div className="h-full">
            <div className="h-full rounded-2xl bg-white p-5 flex flex-col gap-8 shadow">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="relative h-[220px] xs:h-[260px] md:h-[320px] lg:h-[360px] bg-slate-100 flex items-center justify-center">
                  <FaBriefcase className="text-6xl text-slate-300" />
                </div>
                <span className="absolute left-4 top-4 rounded-full bg-[#72b76a] px-3 py-1 text-xs font-semibold text-white shadow">
                  {job.status}
                </span>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between -mt-2">
                <div>
                  <h1 className="text-xl font-bold text-[#0b0b0b] md:text-2xl mt-2 leading-tight">
                    {job.title}
                  </h1>
                  
                  {job.company_name && (
                    <div className="mt-2 text-md font-medium text-slate-700">
                      {job.company_name}
                    </div>
                  )}

                  <p className="mt-2 flex items-center gap-2 text-sm text-neutral-600 font-medium">
                    <FaMapMarkerAlt className="text-sky-500" /> {job.location || "Location not specified"}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                    <span className="font-semibold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-md">
                      {formatSalary(job.salary_min, job.salary_max)}
                    </span>
                    <span className="font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md uppercase tracking-wide text-xs">
                      {job.employment_type}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 mt-2 sm:mt-0">
                  <button className="w-full sm:w-auto px-8 h-11 bg-[#00C9FF] rounded-lg text-white font-bold hover:bg-[#00b4e6] active:scale-95 transition-all shadow-md">
                    Apply Now
                  </button>
                </div>
              </div>

              <hr className="border-gray-100" />

              <div>
                <h2 className="text-lg font-bold text-neutral-900 mb-3 border-l-4 border-[#00c9ff] pl-3">
                  Job Description
                </h2>
                <div className="prose prose-neutral max-w-none text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                  {job.description || "No description provided."}
                </div>
              </div>

              {requirementsList.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 mb-4 border-l-4 border-emerald-400 pl-3">
                    Requirements & Responsibilities
                  </h2>
                  <ul className="space-y-3">
                    {requirementsList.map((item, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-700 items-start">
                        <Check />
                        <span className="leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {perksList.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold text-neutral-900 mb-4 border-l-4 border-purple-400 pl-3">
                    Perks & Benefits
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {perksList.map((item, i) => (
                      <span key={i} className="text-sm px-4 py-2 bg-purple-50 text-purple-700 rounded-lg font-medium">
                        {item.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h2 className="text-lg font-bold text-neutral-900 mb-4">
                  Share this job
                </h2>
                <div className="flex flex-wrap gap-3">
                  {SHARE_LINKS.map(({ name, href, Icon, cls }) => (
                    <a key={name} href={href} target="_blank" rel="noopener noreferrer" className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-white text-sm font-medium transition-all ${cls}`}>
                      <Icon className="text-lg" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="h-full flex flex-col gap-6">
            <div className="rounded-2xl bg-white p-6 shadow border border-slate-50">
              <h3 className="mb-6 font-bold text-lg text-neutral-900">Job Information</h3>

              <ul className="space-y-5 text-sm">
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-blue-50 text-[#00c9ff] rounded-lg"><FaCalendarAlt className="text-lg" /></div>
                  <div>
                    <p className="text-neutral-500 text-xs font-semibold tracking-wider uppercase mb-1">Date Posted</p>
                    <p className="font-medium text-slate-800">{formatDate(job.created_at)}</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-2 bg-emerald-50 text-emerald-500 rounded-lg"><FaMapMarkerAlt className="text-lg" /></div>
                  <div>
                    <p className="text-neutral-500 text-xs font-semibold tracking-wider uppercase mb-1">Location</p>
                    <p className="font-medium text-slate-800">{job.location || "Not specified"}</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-2 bg-purple-50 text-purple-500 rounded-lg"><FaBriefcase className="text-lg" /></div>
                  <div>
                    <p className="text-neutral-500 text-xs font-semibold tracking-wider uppercase mb-1">Job Role</p>
                    <p className="font-medium text-slate-800">{job.job_role || job.title}</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-2 bg-amber-50 text-amber-500 rounded-lg"><FaHourglassHalf className="text-lg" /></div>
                  <div>
                    <p className="text-neutral-500 text-xs font-semibold tracking-wider uppercase mb-1">Experience</p>
                    <p className="font-medium text-slate-800">{formatExp(job.exp_min, job.exp_max)}</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-2 bg-rose-50 text-rose-500 rounded-lg"><FaGraduationCap className="text-lg" /></div>
                  <div>
                    <p className="text-neutral-500 text-xs font-semibold tracking-wider uppercase mb-1">Qualification</p>
                    <p className="font-medium text-slate-800">{job.qualifications || "Any"}</p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-50 text-indigo-500 rounded-lg"><FaVenusMars className="text-lg" /></div>
                  <div>
                    <p className="text-neutral-500 text-xs font-semibold tracking-wider uppercase mb-1">Gender</p>
                    <p className="font-medium text-slate-800">{job.gender || "Any"}</p>
                  </div>
                </li>
              </ul>
            </div>

            {skillsList.length > 0 && (
              <div className="rounded-2xl bg-white p-6 shadow border border-slate-50">
                <h4 className="mb-4 font-bold text-lg text-neutral-900">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, index) => (
                    <span key={index} className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {(job.company_name || job.contact_name) && (
              <div className="rounded-2xl bg-white p-6 shadow border border-slate-50">
                <h3 className="mb-5 text-lg font-bold text-neutral-900">Contact / Company</h3>
                <div className="space-y-4 text-sm">
                  {job.company_name && (
                    <div className="flex items-start gap-3">
                      <FaBriefcase className="text-[#00C9FF] mt-1" />
                      <div>
                        <p className="font-medium text-gray-800">{job.company_name}</p>
                      </div>
                    </div>
                  )}

                  {job.contact_name && (
                    <div className="flex items-start gap-3">
                      <FaUserFriends className="text-[#00C9FF] mt-1" />
                      <div>
                        <p className="text-neutral-500 text-xs">Recruiter Name</p>
                        <p className="font-medium text-gray-800">{job.contact_name}</p>
                      </div>
                    </div>
                  )}

                  {job.allow_calls && job.contact_number && (
                    <div className="flex items-start gap-3">
                      <FaPhoneAlt className="text-[#00C9FF] mt-1" />
                      <div>
                        <p className="text-neutral-500 text-xs">Phone</p>
                        <p className="font-medium text-gray-800">{job.contact_number}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </>
  );
};

export default function Details() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#72B76A]"></div></div>}>
      <JobDetailsContent />
    </Suspense>
  );
}
