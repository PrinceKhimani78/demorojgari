"use client";

import React, {
  useEffect,
  useRef,
  useState,
  ChangeEvent,
  FormEvent,
} from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FaArrowRightToBracket } from "react-icons/fa6";
import Link from "next/link";
import "../Home/Home.css";
import "./Header.css";
import Image from "next/image";
import { RxCross2 } from "react-icons/rx";
import { useAuth } from "@/context/AuthContext";
import { sendOtp } from "@/services/otpService";

type Mode = "login" | "signup";


interface FormState {
  username: string;
  password: string;
  fullName: string;
  email: string;
  confirmPassword: string;
  otp: string;
  companyName?: string;
  mobileNumber?: string;
  industry?: string;
}

// type JobsMenuItem = { label: string; href: string };

const Header: React.FC = () => {
  const pathnameRaw = usePathname() || "/";
  const pathname = pathnameRaw.toLowerCase();
  const router = useRouter();
  const searchParams = useSearchParams();

  // route checks (case-insensitive)
  const isHome = pathname === "/";
  const isJobs = pathname === "/jobs";
  {
    /*|| pathname.startsWith("/jobs/");*/
  }
  const isCandidates = pathname === "/candidates";
  const isRecruiters = pathname === "/recruiters";
  const isPages = pathname === "/pages" || pathname.startsWith("/pages/");
  const isBlogs = pathname === "/blogs" || pathname.startsWith("/blogs/");
  type MenuItem = { label: string; href: string };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState<boolean>(false);
  const [mode, setMode] = useState<Mode>("login");
  const [formData, setFormData] = useState<FormState>({
    username: "",
    password: "",
    confirmPassword: "",
    fullName: "",
    email: "",
    otp: "",
    companyName: "",
    mobileNumber: "",
    industry: "",
  });
  const [otpLoading, setOtpLoading] = useState(false);
  useEffect(() => {
    if (!showPopup) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    // prevent layout shift when hiding scrollbar
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = "hidden";
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    return () => {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [showPopup]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const [userType, setUserType] = useState<"candidates" | "recruiter">(
    "candidates"
  );
  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email address first.");
      return;
    }
    setOtpLoading(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "/api";
    console.log("DEBUG: backendUrl from env:", backendUrl);
    const res = await sendOtp(backendUrl, formData.email);
    setOtpLoading(false);

    if (res.success) {
      alert("OTP sent to " + formData.email);
    } else {
      alert(res.message || "Failed to send OTP. Please try again.");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      let res;
      if (userType === "recruiter") {
        if (!formData.companyName || !formData.fullName || !formData.email || !formData.mobileNumber || !formData.industry) {
          alert("Please fill in all required fields for recruiter signup.");
          return;
        }
        res = await register({
          companyName: formData.companyName,
          fullName: formData.fullName,
          email: formData.email,
          mobileNumber: formData.mobileNumber,
          industry: formData.industry,
          password: formData.password,
        }, "recruiter");
      } else {
        res = await register({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          otp: formData.otp,
        }, "candidate");
      }

      if (res.success) {
        setShowPopup(false);
        setMenuOpen(false);
        
        // Handle post-login redirection
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get('redirect');
        if (redirect) {
          router.push(redirect);
        } else {
          if (userType === "candidates") {
            router.push("/candidates/dashboard");
          } else {
            router.push("/recruiters/dashboard");
          }
        }
      } else {
        alert(res.message || "Registration failed");
      }
    } else {
      const res = await login(formData.username, formData.password, userType === "candidates" ? "candidate" : "recruiter");
      if (res.success) {
        setShowPopup(false);
        setMenuOpen(false);
        
        // Handle post-login redirection
        const searchParams = new URLSearchParams(window.location.search);
        const redirect = searchParams.get('redirect');
        if (redirect) {
          router.push(redirect);
        } else {
          if (userType === "candidates") {
            router.push("/candidates/dashboard");
          } else {
            router.push("/recruiters/dashboard");
          }
        }
      } else {
        alert(res.message || "Login failed");
      }
    }
  };
  const { isAuthenticated, user, logout, login, register } = useAuth();

  const handleLogout = () => {
    logout();
    router.push("/");
    setMenuOpen(false);
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [isChanged, setIsChanged] = useState<boolean>(false);
  // const [jobsOpen, setJobsOpen] = useState<boolean>(false);
  // const [pagesOpen, setPagesOpen] = useState<boolean>(false);

  const handleToggleChange = () => {
    setMenuOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setMenuOpen(false);
        setIsChanged(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Listen for global openAuthModal event
  useEffect(() => {
    const handleOpenAuthModal = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetMode = customEvent.detail?.mode || "login";
      const targetUserType = customEvent.detail?.userType || "candidates";
      
      setMode(targetMode);
      setUserType(targetUserType);
      setShowPopup(true);
      setMenuOpen(false);
    };

    window.addEventListener("openAuthModal", handleOpenAuthModal);
    return () => window.removeEventListener("openAuthModal", handleOpenAuthModal);
  }, []);

  // Check URL params for auth open request
  useEffect(() => {
    if (!searchParams) return;
    const authAction = searchParams.get("auth");
    if (authAction === "login" || authAction === "signup") {
      setMode(authAction);
      const roleParam = searchParams.get("role") as "candidates" | "recruiter";
      if (roleParam === "candidates" || roleParam === "recruiter") {
        setUserType(roleParam);
      }
      setShowPopup(true);
      
      // Optional: remove query params from URL without reloading
      const newUrl = window.location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [searchParams]);

  return (
    <>
      {/* Header for mobile */}
      <div className="lg:hidden">
        <div className="fixed top-0 grid grid-cols-2 items-center justify-between rounded-md bg-[#FFFFF0]/0 backdrop-blur-md h-20 w-[98%] mt-4 mx-[1%] px-3 py-2 z-[70]">
          {/* Logo */}
          <div className="flex justify-start">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={48}
                height={48}
                className="h-14 w-auto"
              />
            </Link>
          </div>

          {/* Toggle Menu (hamburger / X) */}
          <div
            className={`flex justify-end cursor-pointer ${menuOpen ? "change" : ""
              }`}
            onClick={handleToggleChange}
          >
            <div className="mx-3">
              <div className="bar1"></div>
              <div className="bar2"></div>
              <div className="bar3"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu panel */}
      <div
        className={[
          "menu_bg fixed inset-0 z-[60] bg-white shadow-lg pt-24",
          "transform transition-transform duration-500",
          menuOpen
            ? "translate-y-0 pointer-events-auto"
            : "-translate-y-full pointer-events-none",
          "h-screen",
        ].join(" ")}
      >
        <div className="flex flex-col justify-center items-center mb-8 mx-7 space-y-6">
          <div>
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              className={`relative inline-block group font-semibold ${isHome ? "text-[#72B76A]" : "text-black hover:text-[#72B76A]"
                }`}
            >
              Home
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-current transition-all duration-300 ${isHome ? "w-full text-[#72B76A]" : "w-0 group-hover:w-full"
                  }`}
              />
            </Link>
          </div>
          
          {isAuthenticated && (
            <div>
              <Link
                href={user?.role === "candidate" ? "/candidates/dashboard" : "/recruiters/dashboard"}
                onClick={() => setMenuOpen(false)}
                className={`relative inline-block group font-semibold ${(pathname.includes("/dashboard")) ? "text-[#72B76A]" : "text-black hover:text-[#72B76A]"}`}
              >
                Dashboard
                <span
                  className={`absolute left-0 -bottom-0.5 h-[2px] bg-current transition-all duration-300 ${(pathname.includes("/dashboard")) ? "w-full text-[#72B76A]" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            </div>
          )}

          <div>
            <Link
              href="/jobs"
              onClick={() => setMenuOpen(false)}
              className={`relative inline-block group font-semibold ${isJobs ? "text-[#72B76A]" : "text-black hover:text-[#72B76A]"
                }`}
            >
              Jobs
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-current transition-all duration-300 ${isJobs ? "w-full text-[#72B76A]" : "w-0 group-hover:w-full"
                  }`}
              />
            </Link>
          </div>

          <div>
            <Link
              href="/candidates"
              onClick={() => setMenuOpen(false)}
              className={`relative inline-block group font-semibold ${isCandidates
                ? "text-[#72B76A]"
                : "text-black hover:text-[#72B76A]"
                }`}
            >
              Candidates
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-current transition-all duration-300 ${isCandidates
                  ? "w-full text-[#72B76A]"
                  : "w-0 group-hover:w-full"
                  }`}
              />
            </Link>
          </div>

          <div>
            <Link
              href="/recruiters"
              onClick={() => setMenuOpen(false)}
              className={`relative inline-block group font-semibold ${isRecruiters
                ? "text-[#72B76A]"
                : "text-black hover:text-[#72B76A]"
                }`}
            >
              Recruiters
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-current transition-all duration-300 ${isRecruiters
                  ? "w-full text-[#72B76A]"
                  : "w-0 group-hover:w-full"
                  }`}
              />
            </Link>
          </div>

          {/* Pages accordion */}
          <div>
            <Link
              href="/about-us"
              onClick={() => setMenuOpen(false)}
              className={`relative inline-block group font-semibold ${pathname === "/about-us"
                ? "text-[#72B76A]"
                : "text-black hover:text-[#72B76A]"
                }`}
            >
              About&nbsp;Us
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-current transition-all duration-300 ${pathname === "/about-us"
                  ? "w-full text-[#72B76A]"
                  : "w-0 group-hover:w-full"
                  }`}
              />
            </Link>
          </div>

          {/* Blogs link — hidden for now
          <div>
            <Link
              href="/blogs"
              onClick={() => setMenuOpen(false)}
              className={`relative inline-block group font-semibold ${isBlogs ? "text-[#72B76A]" : "text-black hover:text-[#72B76A]"
                }`}
            >
              Blogs
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-current transition-all duration-300 ${isBlogs ? "w-full text-[#72B76A]" : "w-0 group-hover:w-full"
                  }`}
              />
            </Link>
          </div>
          */}

          <div>
            <Link
              href="/contactus"
              onClick={() => setMenuOpen(false)}
              className="relative w-32 h-9 overflow-hidden group border border-[#72B76A] bg-transparent rounded-lg hover:bg-[#72B76A] text-[#72B76A] hover:text-white active:scale-90 transition-all ease-out duration-700 flex items-center justify-center"
            >
              <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-24 ease" />
              <span className="relative text-sm font-semibold">Contact Us</span>
            </Link>
          </div>

          {/* Auth button (mobile) */}
          <div>
            {isAuthenticated ? (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#72B76A] flex items-center justify-center text-white font-bold text-sm">
                    {user?.full_name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-700 truncate max-w-[120px]">
                    {user?.full_name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="relative w-32 h-9 overflow-hidden group border border-red-400 bg-transparent rounded-lg hover:bg-red-400 text-red-400 hover:text-white active:scale-90 transition-all ease-out duration-700 flex items-center justify-center text-sm font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setUserType("candidates");
                  setMode("login");
                  setShowPopup(true);
                  setMenuOpen(false);
                }}
                className="relative w-32 h-9 overflow-hidden group border border-[#72B76A] bg-[#72B76A] rounded-lg hover:bg-transparent text-white hover:text-[#72B76A] active:scale-90 transition-all ease-out duration-700"
              >
                <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-24 ease" />
                <span className="relative flex gap-2 justify-center items-center text-sm font-semibold">
                  <FaArrowRightToBracket />
                  Sign In
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Header for desktop */}
      <div className="hidden lg:block">
        <div className="fixed top-0 grid grid-cols-3 items-center justify-between bg-[#FFFFF0]/0 backdrop-blur-md rounded-md h-20 w-[98%] mt-4 mx-[1%] px-8 py-2 z-[70]">
          {/* Logo */}
          <div className="flex">
            <Link href="/" className="flex items-center">
              <Image
                src="/images/logo.svg"
                alt="Logo"
                width={48}
                height={48}
                className="h-16 w-auto"
              />
            </Link>
          </div>

          {/* Menu options */}
          <div className="fontPOP flex justify-center gap-5 text-sm">
            <Link
              href="/"
              className={`relative inline-block group font-semibold ${isHome ? "text-[#72B76A]" : "text-black hover:text-[#72B76A]"
                }`}
            >
              Home
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-current transition-all duration-300 ${isHome ? "w-full text-[#72B76A]" : "w-0 group-hover:w-full"
                  }`}
              />
            </Link>

            {isAuthenticated && (
              <Link
                href={user?.role === "candidate" ? "/candidates/dashboard" : "/recruiters/dashboard"}
                className={`relative inline-block group font-semibold ${(pathname.includes("/dashboard")) ? "text-[#72B76A]" : "text-black hover:text-[#72B76A]"}`}
              >
                Dashboard
                <span
                  className={`absolute left-0 -bottom-0.5 h-[2px] bg-current transition-all duration-300 ${(pathname.includes("/dashboard")) ? "w-full text-[#72B76A]" : "w-0 group-hover:w-full"}`}
                />
              </Link>
            )}

            <div className="relative group text-center">
              <Link
                href="/jobs"
                className={`relative inline-block font-semibold ${isJobs ? "text-[#72B76A]" : "text-black hover:text-[#72B76A]"
                  }`}
              >
                Jobs
                <span
                  className={`absolute left-0 -bottom-0.5 h-[2px] bg-current transition-all duration-300 ${isJobs ? "w-full text-[#72B76A]" : "w-0 group-hover:w-full"
                    }`}
                />
              </Link>
            </div>

            <Link
              href="/candidates"
              className={`relative inline-block group font-semibold ${isCandidates
                ? "text-[#72B76A]"
                : "text-black hover:text-[#72B76A]"
                }`}
            >
              Candidates
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-current transition-all duration-300 ${isCandidates
                  ? "w-full text-[#72B76A]"
                  : "w-0 group-hover:w-full"
                  }`}
              />
            </Link>

            <Link
              href="/recruiters"
              className={`relative inline-block group font-semibold ${isRecruiters
                ? "text-[#72B76A]"
                : "text-black hover:text-[#72B76A]"
                }`}
            >
              Recruiters
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-current transition-all duration-300 ${isRecruiters
                  ? "w-full text-[#72B76A]"
                  : "w-0 group-hover:w-full"
                  }`}
              />
            </Link>

            {/* About Us */}
            <Link
              href="/about-us"
              className={`relative inline-block group font-semibold ${pathname === "/about-us"
                ? "text-[#72B76A]"
                : "text-black hover:text-[#72B76A]"
                }`}
            >
              About&nbsp;Us
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-current transition-all duration-300 ${pathname === "/about-us"
                  ? "w-full text-[#72B76A]"
                  : "w-0 group-hover:w-full"
                  }`}
              />
            </Link>

            {/* Blogs link — hidden for now
            <Link
              href="/blogs"
              className={`relative inline-block group font-semibold ${isBlogs ? "text-[#72B76A]" : "text-black hover:text-[#72B76A]"
                }`}
            >
              Blogs
              <span
                className={`absolute left-0 -bottom-0.5 h-[2px] bg-current transition-all duration-300 ${isBlogs ? "w-full text-[#72B76A]" : "w-0 group-hover:w-full"
                  }`}
              />
            </Link>
            */}
          </div>

          {/* Contact / Auth */}
          <div className="flex gap-2 justify-end items-center">
            <Link
              href="/contactus"
              className="relative px-4 h-9 overflow-hidden group border border-[#72B76A] bg-transparent rounded-lg hover:bg-[#72B76A] text-[#72B76A] hover:text-white active:scale-90 transition-all ease-out duration-700 flex items-center justify-center"
            >
              <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-24 ease" />
              <span className="relative text-sm font-semibold">Contact Us</span>
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* User avatar + name */}
                <Link
                  href={user?.role === "recruiter" ? "/recruiters/dashboard" : "/candidates/dashboard"}
                  className="flex items-center gap-2 group"
                >
                  <div className="w-8 h-8 rounded-full bg-[#72B76A] flex items-center justify-center text-white font-bold text-sm">
                    {user?.full_name?.[0]?.toUpperCase() ?? "U"}
                  </div>
                  <span className="text-sm font-medium text-slate-700 group-hover:text-[#72B76A] transition truncate max-w-[120px]">
                    {user?.full_name}
                  </span>
                </Link>
                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="relative px-4 h-9 overflow-hidden group border border-red-400 bg-transparent rounded-lg hover:bg-red-400 text-red-400 hover:text-white active:scale-90 transition-all ease-out duration-700"
                >
                  <span className="relative text-sm font-semibold">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setUserType("candidates");
                  setMode("login");
                  setShowPopup(true);
                }}
                className="relative px-4 h-9 overflow-hidden group border border-[#72B76A] bg-[#72B76A] rounded-lg hover:bg-transparent text-white hover:text-[#72B76A] active:scale-90 transition-all ease-out duration-700"
              >
                <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-24 ease" />
                <span className="relative flex gap-2 items-center text-sm font-semibold">
                  <FaArrowRightToBracket />
                  Sign In
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Auth Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-[10000]"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="popupContent bg-white shadow-xl w-[90%] sm:w-auto max-w-[1000px] max-h-[80vh] overflow-y-auto rounded-lg relative z-10 mx-4 sm:mx-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              aria-label="Close sign in"
              className="absolute top-4 right-4 z-20 text-2xl sm:text-3xl font-bold text-gray-400 hover:text-black"
            >
              <RxCross2 size={20} />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-center bg-[#FFFFF0] rounded-lg min-h-full">
              {/* Left Panel */}
              <div className="hidden md:block relative w-full h-full sm:rounded-l-lg border-r border-gray-300">
                <div className="flex flex-col items-center justify-center text-gray-900 p-5 h-full">
                  {/* Logo visible only on md+ */}
                  <Image
                    src="/images/logo.svg"
                    alt="Rojgari Logo"
                    width={260}
                    height={180}
                    className="mb-4 sm:w-48 md:w-[260px] h-auto"
                  />
                  <div className="overflow-y-auto sm:overflow-visible sm:max-h-none">
                    <p className="text-sm font-bold uppercase mb-4 text-center">
                      ➤ Please Note
                    </p>
                    <ul className="text-xs space-y-2">
                       <li>
                         - Verify your email with the secure OTP sent to you.
                       </li>
                       <li>
                         - Complete your profile fully to increase job interview calls.
                       </li>
                       <li>
                         - Upload a recent resume in PDF, DOC, or DOCX formats.
                       </li>
                       <li>
                         - Update your skill list regularly to match new job postings.
                       </li>
                       <li>
                         - Keep your current contact number active for HR coordinators.
                       </li>
                       <li>
                         - Review job requirements and salary details before applying.
                       </li>
                       <li>
                         - We will never ask you to pay any charges for registrations.
                       </li>
                       <li>
                         - Keep your account password secure and do not share it.
                       </li>
                     </ul>
                  </div>
                </div>
              </div>

              {/* Right Panel */}
              <form
                className="col-span-1
             flex flex-col justify-center
             px-4 sm:px-6 lg:px-8
             py-6 sm:py-10
             order-1 md:order-2"
                onSubmit={handleSubmit}
              >
                {/* Mobile Top Row (Logo only, centered) */}
                <div className="flex justify-center mb-6 md:hidden">
                  <Image
                    src="/images/logo.svg"
                    alt="Rojgari Logo"
                    width={180}
                    height={120}
                    className="h-14 sm:h-16 w-auto"
                  />
                </div>

                {/* Title */}
                <h2 className="fontAL font-semibold capitalize text-xl md:text-2xl lg:text-3xl my-5 text-center md:text-left">
                  {mode === "login" ? "Login" : "Sign Up"}
                </h2>
                {/* Candidate / Recruiter toggle */}
                 <div className="relative flex p-1 mb-6 bg-gray-100 rounded-xl w-[272px] mx-auto md:mx-0">
                   {/* Sliding pill */}
                   <div
                     className={`absolute top-1 bottom-1 w-[128px] bg-[#72B76A] rounded-lg transition-transform duration-300 ease-in-out ${
                       userType === "recruiter" ? "translate-x-[132px]" : "translate-x-0"
                     }`}
                   />
                   {/* Candidates Button */}
                   <button
                     type="button"
                     onClick={() => setUserType("candidates")}
                     className={`relative z-10 w-32 h-9 flex items-center justify-center text-sm font-semibold rounded-lg transition-colors duration-300 ${
                       userType === "candidates" ? "text-white" : "text-gray-600 hover:text-black"
                     }`}
                   >
                     Candidates
                   </button>
                   {/* Recruiters Button */}
                   <button
                     type="button"
                     onClick={() => setUserType("recruiter")}
                     className={`relative z-10 w-32 h-9 flex items-center justify-center text-sm font-semibold rounded-lg transition-colors duration-300 ${
                       userType === "recruiter" ? "text-white" : "text-gray-600 hover:text-black"
                     }`}
                   >
                     Recruiters
                   </button>
                 </div>

                {/* Inputs */}
                <motion.div
                  key={`${mode}-${userType}`}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={mode === "signup" && userType === "recruiter" ? "grid grid-cols-2 gap-3" : "space-y-3"}
                >
                  {mode === "signup" ? (
                    <>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        className="w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 focus:bg-white focus:outline-none ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A]"
                        value={formData.fullName}
                        onChange={handleChange}
                      />
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          placeholder="Email Address"
                          className={`w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 focus:bg-white focus:outline-none ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A] ${userType === "candidates" ? "pr-20" : ""}`}
                          value={formData.email}
                          onChange={handleChange}
                        />
                        {userType === "candidates" && (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={otpLoading}
                            className={`absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-bold text-white rounded transition ${otpLoading ? "bg-gray-400" : "bg-[#72B76A] hover:bg-[#5da356]"}`}
                          >
                            {otpLoading ? "Sending..." : "Send OTP"}
                          </button>
                        )}
                      </div>

                      {userType === "recruiter" && (
                        <>
                          <input
                            type="text"
                            name="companyName"
                            placeholder="Company Name"
                            className="w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 focus:bg-white focus:outline-none ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A]"
                            value={formData.companyName}
                            onChange={handleChange}
                          />
                          <input
                            type="tel"
                            name="mobileNumber"
                            placeholder="Mobile Number"
                            className="w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 focus:bg-white focus:outline-none ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A]"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                          />
                          <select
                            name="industry"
                            className="col-span-2 w-full p-2 rounded bg-white text-sm text-gray-500 ring-1 focus:bg-white focus:outline-none ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A]"
                            value={formData.industry}
                            onChange={handleChange}
                          >
                            <option value="">Select Industry</option>
                            <option value="IT Services">IT Services</option>
                            <option value="Manufacturing">Manufacturing</option>
                            <option value="Finance">Finance</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Education">Education</option>
                            <option value="Retail">Retail</option>
                            <option value="Other">Other</option>
                          </select>
                        </>
                      )}
                      {/* Password */}
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          className="w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 focus:bg-white focus:outline-none ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A]"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>

                      {/* Confirm Password */}
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Confirm Password"
                          className="w-full p-2 rounded bg-white text-sm placeholder-slate-400  focus:bg-white focus:outline-none ring-1 ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A]"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>

                      {userType === "candidates" && (
                        <input
                          type="text"
                          name="otp"
                          placeholder="Enter OTP"
                          className="w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 focus:bg-white focus:outline-none  ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A]"
                          value={formData.otp}
                          onChange={handleChange}
                        />
                      )}
                    </>
                  ) : (
                    <>
                      <input
                        type="text"
                        name="username"
                        placeholder="Username"
                        className="w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 ring-gray-300 focus:bg-white focus:outline-none transition focus:ring-2 focus:ring-[#72B76A]"
                        value={formData.username}
                        onChange={handleChange}
                      />
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Password"
                          className="w-full p-2 rounded bg-white text-sm focus:bg-white focus:outline-none placeholder-slate-400 ring-1 ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A]"
                          value={formData.password}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                          {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>

                {/* Action Button */}
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="relative mt-6 w-32 h-10 overflow-hidden group border border-[#72B76A] bg-[#72B76A] rounded-lg hover:bg-transparent text-white hover:text-[#72B76A] active:scale-90 transition-all ease-out duration-700 cursor-pointer flex items-center justify-center"
                  >
                    <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-24 ease"></span>
                    <span className="relative flex gap-2 items-center text-sm font-semibold">
                      {mode === "login" ? "Login" : "Sign Up"}
                    </span>
                  </button>
                </div>

                {/* Toggle SignUp / Login */}
                <p className="mt-5 text-center text-sm text-gray-600">
                  {mode === "login" ? (
                    <>
                      Don’t have an account?{" "}
                      <button
                        type="button"
                        className="text-[#72B76A] font-bold underline"
                        onClick={() => {
                          setMode("signup");
                        }}
                      >
                        Sign up
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-[#72B76A] font-bold underline"
                        onClick={() => setMode("login")}
                      >
                        Log in
                      </button>
                    </>
                  )}
                </p>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
