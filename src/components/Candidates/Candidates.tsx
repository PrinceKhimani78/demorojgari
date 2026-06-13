"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useInView } from "react-intersection-observer";
import "swiper/css";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Typewriter } from "react-simple-typewriter";
import Testimonials from "../Testimonials/Testimonials";
import { motion } from "framer-motion";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { sendOtp } from "@/services/otpService";

type FeatureListProps = {
  items: string[];
  className?: string;
};
type AuthSetter = React.Dispatch<React.SetStateAction<boolean>>;

interface HeaderProps {
  isAuthenticated?: boolean;
  setIsAuthenticated?: AuthSetter;
}
type Mode = "login" | "signup";

interface FormState {
  username: string;
  password: string;
  fullName: string;
  email: string;
  confirmPassword: string;
  otp: string;
}

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 0 1 0 1.414l-7.25 7.25a1 1 0 0 1-1.414 0l-3-3a1 1 0 1 1 1.414-1.414l2.293 2.293 6.543-6.543a1 1 0 0 1 1.414 0Z"
      clipRule="evenodd"
    />
  </svg>
);
const FeatureList: React.FC<FeatureListProps> = ({ items, className = "" }) => {
  return (
    <ul className={`space-y-2 ${className}`}>
      {items.map((text, i) => (
        <li key={i} className="flex items-center gap-3">
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FFCC23]">
            <CheckIcon className="h-4 w-4 text-white" />
          </span>
          <span className="font-semibold text-[12px] text-gray-700 align-middle ">
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
};

const Candidates = () => {
  const router = useRouter();
  const [isChanged, setIsChanged] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [userType, setUserType] = useState<"candidates" | "recruiter">(
    "candidates"
  );
  const [formData, setFormData] = useState<FormState>({
    username: "",
    password: "",
    fullName: "",
    email: "",
    confirmPassword: "",
    otp: "",
  });
  const [otpLoading, setOtpLoading] = useState(false);
  const [img2, img2InView] = useInView({ triggerOnce: true, threshold: 0.1 });
  type Crumb = { name: string; href?: string };
  const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "Candidates", href: "/candidates" },
  ];
  const [jobTyperRef, jobTyperSeen] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSendOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email address first.");
      return;
    }
    setOtpLoading(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "/api";
    const res = await sendOtp(backendUrl, formData.email);
    setOtpLoading(false);

    if (res.success) {
      alert("OTP sent to " + formData.email);
    } else {
      alert(res.message || "Failed to send OTP. Please try again.");
    }
  };

  const { login, register } = useAuth();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      const res = await register({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        otp: formData.otp,
      });
      if (res.success) {
        alert("Registration successful! You can now log in.");
        setMode("login");
      } else {
        alert(res.message || "Registration failed");
      }
    } else {
      const res = await login(formData.username, formData.password, userType === "candidates" ? "candidate" : "recruiter");
      if (res.success) {
        setShowPopup(false);
        setMenuOpen(false);
        if (userType === "candidates") {
          router.push("/candidates/dashboard");
        } else {
          router.push("/recruiters/dashboard");
        }
      } else {
        alert(res.message || "Login failed");
      }
    }
  };
  return (
    <>
      {/* Candidate Hero */}
      <section className="relative overflow-hidden">
        <div className="h-screen bg-[url('/images/RI_banner_bg.webp')] bg-cover bg-center bg-no-repeat bg-fixed" />
        <div className="absolute inset-0 flex items-center justify-center px-5 lg:px-[5%] 2xl:px-[10%]">
          <div className="max-w-screen-xl w-full text-center">
            <h1 className="inline-block mb-4 px-4 py-2 text-slate-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl fontAL font-semibold capitalize mt-5">
              Accelerate Your Career Growth
            </h1>
            <p className="fontPOP text-sm md:text-base text-slate-700 mb-6 max-w-2xl mx-auto">
              Discover thousands of premium job opportunities, connect with top employers, and take the next big step in your professional journey.
            </p>
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-700">
              <ol className="flex items-center justify-center gap-2">
                {crumbs.map((c, i) => {
                  const isLast = i === crumbs.length - 1;
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
                        <Link href={c.href} className="hover:text-slate-900 fontPOP text-xs sm:text-sm">{c.name}</Link>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        </div>
      </section>

      {/* Candidate Benefits */}
      <section className="py-16 md:py-24 px-5 lg:px-[5%] 2xl:px-[15%]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="fontPOP text-[#72B76A] text-sm tracking-widest uppercase">Why Choose Us</p>
          <h2 className="fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5 text-gray-900" style={{ letterSpacing: "1px", wordSpacing: "2px", lineHeight: 1.2 }}>Unlock Your True Potential</h2>
          <p className="text-gray-500 mt-4">We provide more than just job listings. We offer a comprehensive ecosystem designed to help you land your dream job faster.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { icon: "🏢", title: "Verified Employers", desc: "Access exclusive opportunities from highly reputed corporate employers across various industries." },
            { icon: "🎯", title: "Precision Job Matching", desc: "We connect you with roles that perfectly align with your unique skills and career aspirations." },
            { icon: "⚡", title: "Direct HR Access", desc: "Skip the queue. Apply directly and get your profile in front of hiring managers instantly." }
          ].map((benefit, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-col items-center text-center p-8 bg-white/70 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-3xl"
            >
              <div className="w-20 h-20 rounded-2xl bg-[#72B76A]/10 flex items-center justify-center text-4xl mb-6 shadow-inner">
                {benefit.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{benefit.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* The Journey (Redesigned Timeline) */}
      <section className="py-20 px-5 lg:px-[5%] 2xl:px-[15%] overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 relative">
            {/* Vertical Line */}
            <div className="absolute left-7 top-6 bottom-8 w-1 bg-gradient-to-b from-[#FFCC23] to-[#72B76A] rounded-full hidden md:block"></div>

            <div className="space-y-10 relative">
              {[
                { step: "01", title: "Build Your Profile", desc: "Sign up and create a comprehensive profile highlighting your skills, experience, and career aspirations.", color: "bg-[#FFCC23]" },
                { step: "02", title: "Discover Opportunities", desc: "Browse thousands of verified job listings or let our smart algorithms recommend the perfect roles for you.", color: "bg-[#00c9ff]" },
                { step: "03", title: "Apply Seamlessly", desc: "Apply to multiple jobs with a single click and track your application status in real-time.", color: "bg-[#ae70bb]" },
                { step: "04", title: "Get Hired", desc: "Ace your interviews with our preparation tips and secure your dream job at a top company.", color: "bg-[#72B76A]" }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.15 }}
                  className="flex gap-6 items-center relative z-10"
                >
                  <div className={`w-14 h-14 rounded-2xl ${item.color} text-white flex items-center justify-center font-bold text-lg shadow-lg shrink-0`}>
                    {item.step}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <div className="order-1">
            <p className="fontPOP text-[#FFCC23] text-sm tracking-widest uppercase">Your Path to Success</p>
            <h2 className="fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5 text-gray-900" style={{ letterSpacing: "1px", wordSpacing: "2px", lineHeight: 1.2 }}>A Simple Process to Land Your Dream Job</h2>
            <p className="text-gray-600 mt-5 mb-8 leading-relaxed">
              We've streamlined the job search process so you can focus on what matters most: preparing for your interviews and advancing your career. Follow our proven 4-step journey.
            </p>
            <FeatureList
              items={[
                "100% Free for Candidates",
                "Verified Corporate Employers",
                "Real-time Application Tracking"
              ]}
            />
          </div>
        </div>
      </section>

      {/* Featured Skills / Categories */}
      <div className="bg-[#CCF4F3] pt-20 pb-40 px-5 lg:px-[5%] 2xl:px-[15%] mt-10">
        <p
          className="fontPOP text-[#00C9FF] text-sm tracking-widest uppercase text-center"
          style={{ letterSpacing: "1px", lineHeight: 1.3 }}
        >
          Categories
        </p>
        <h2
          className="fontAL font-semibold capitalize text-center text-2xl md:text-3xl lg:text-4xl mt-5 mx-auto max-w-[800px] text-gray-900"
          style={{ letterSpacing: "1px", wordSpacing: "2px", lineHeight: 1.2 }}
        >
          Trending <span className="text-[#00C9FF]">Job Categories</span>
        </h2>
        <p className="text-gray-600 text-center mt-4">
          Explore opportunities in the most sought-after industries.
        </p>
      </div>

      {/* Categories Wrapper */}
      <div className="bg-[#F2FCF1] -mt-20 mx-5 lg:mx-[10%] 2xl:mx-[20%] p-10 rounded-xl shadow-sm mb-20 relative z-10">
        <div className="flex flex-wrap justify-center gap-4">
          {["Information Technology", "Healthcare", "Finance & Banking", "Engineering", "Marketing & Sales", "Human Resources", "Education", "Manufacturing", "Customer Support"].map((skill, idx) => (
            <div key={idx} className="px-6 py-3 rounded-full border border-[#e5e5e5] bg-white shadow-sm hover:shadow-md hover:border-[#00C9FF] hover:text-[#00C9FF] transition-all cursor-pointer text-sm font-medium text-gray-700">
              {skill}
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="px-5 lg:px-[5%] 2xl:px-[15%] pb-20 pt-10">
        <div className="bg-gradient-to-r from-[#00c9ff]/80 to-[#005c99]/90 rounded-3xl p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('/images/map-img.webp')] opacity-10 bg-cover bg-center"></div>

          <div className="relative z-10 max-w-xl text-center lg:text-left">
            <h2 className="fontAL font-bold text-3xl md:text-4xl text-white mb-6 leading-tight">Ready to Take the Next Step in Your Career?</h2>
            <p className="text-white/80 text-sm md:text-base mb-8 leading-relaxed">
              Join over 50,000 professionals who have successfully accelerated their careers through Rojgari India. Create your free profile today and start applying.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => {
                  setShowPopup(true);
                  setMode("signup");
                  setUserType("candidates");
                }}
                className="relative px-6 h-11 overflow-hidden group border border-[#0A2540] bg-[#0A2540] rounded-lg hover:bg-transparent text-white hover:text-[#0A2540] active:scale-90 transition-all ease-out duration-700 shadow-lg"
              >
                <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-20 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-64 ease"></span>
                <span className="relative flex justify-center items-center text-sm font-semibold">Create Free Profile</span>
              </button>
              <button
                onClick={() => {
                  setShowPopup(true);
                  setMode("login");
                  setUserType("candidates");
                }}
                className="relative px-6 h-11 overflow-hidden group border-2 border-[#0A2540] bg-transparent rounded-lg hover:bg-[#0A2540] text-[#0A2540] hover:text-white active:scale-90 transition-all ease-out duration-700"
              >
                <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-20 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-64 ease"></span>
                <span className="relative flex justify-center items-center text-sm font-semibold">Sign In</span>
              </button>
            </div>
          </div>

          <div className="relative z-10 hidden lg:block">
            <Image
              src="/images/girl.webp"
              alt="Candidate Success"
              height={350}
              width={350}
              className="drop-shadow-2xl"
            />
          </div>
        </div>
      </div>
      {showPopup && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/60 z-[10000]"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="popupContent bg-white shadow-xl max-w-[1000px] h-auto  sm:-[50vh] mx-5  rounded-lg relative z-10 "
            onClick={(e) => e.stopPropagation()}
          >
            {/* Desktop Close Button */}
            <button
              onClick={() => setShowPopup(false)}
              aria-label="Close sign in"
              className="absolute top-4 right-4 z-20 text-3xl font-bold text-gray-400 hover:text-black hidden md:block"
            >
              <RxCross2 size={20} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 items-center justify-center bg-[#FFFFF0] rounded-lg max-h-[80vh] ">
              {/* Left Panel */}
              <div className="relative w-full h-full rounded-b-lg sm:rounded-b-none sm:rounded-l-lg order-2 sm:order-1 border-r border-gray-300">
                <div className="flex flex-col items-center justify-center text-gray-900 p-5 h-full">
                  {/* Logo visible only on md+ */}
                  <Image
                    src="/images/logo.svg"
                    alt="Rojgari Logo"
                    width={220}
                    height={180}
                    className="mb-6 hidden md:block"
                  />
                  <div className="overflow-y-auto max-h-20 md:overflow-visible md:max-h-none ">
                    <p className="font-bold uppercase mb-4 text-center">
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
                className="col-span-2 sm:col-span-1
                  flex flex-col justify-center
                  px-4 sm:px-6 lg:px-8
                  py-6 sm:py-10
                  order-1 sm:order-2"
                onSubmit={handleSubmit}
              >
                {/* Mobile Top Row (Logo + Close Button) */}
                <div className="  flex items-start sm:items-center justify-between top-2 mb-6 md:hidden ">
                  <Image
                    src="/images/logo.svg"
                    alt="Rojgari Logo"
                    width={170}
                    height={150}
                    className="h-16 "
                  />
                  <button
                    onClick={() => setShowPopup(false)}
                    aria-label="Close sign in"
                    className="text-3xl mt-2 font-bold text-gray-400 hover:text-black"
                  >
                    <RxCross2 size={20} />
                  </button>
                </div>

                {/* Title */}
                <h2 className="fontAL font-semibold capitalize text-xl md:text-2xl lg:text-3xl my-5 text-center md:text-left">
                  {mode === "login" ? "Login" : "Sign Up"}
                </h2>

                {/* Candidate / Recruiter buttons */}
                <div className="relative flex p-1 gap-2 mb-6 justify-center md:justify-start bg-gray-100 rounded-xl w-fit mx-auto md:mx-0">
                  {/* Candidates Button */}
                  <button
                    type="button"
                    onClick={() => setUserType("candidates")}
                    className={`relative z-10 w-32 h-9 flex items-center justify-center text-sm font-semibold rounded-lg transition-colors duration-300 ${userType === "candidates" ? "text-white" : "text-gray-600 hover:text-black"
                      }`}
                  >
                    Candidates
                    {userType === "candidates" && (
                      <motion.div
                        layoutId="activeTabCandidate"
                        className="absolute inset-0 bg-[#72B76A] rounded-lg -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>

                  {/* Recruiters Button */}
                  <button
                    type="button"
                    onClick={() => {
                      if (mode === "signup") {
                        setShowPopup(false);
                        router.push("/recruiters/register");
                      } else {
                        setUserType("recruiter");
                      }
                    }}
                    className={`relative z-10 w-32 h-9 flex items-center justify-center text-sm font-semibold rounded-lg transition-colors duration-300 ${userType === "recruiter" ? "text-white" : "text-gray-600 hover:text-black"
                      }`}
                  >
                    Recruiters
                    {userType === "recruiter" && (
                      <motion.div
                        layoutId="activeTabCandidate"
                        className="absolute inset-0 bg-[#72B76A] rounded-lg -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </button>
                </div>

                {/* Inputs */}
                <motion.div
                  key={`${mode}-${userType}`}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="space-y-3"
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
                          className="w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 focus:bg-white focus:outline-none ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A] pr-20"
                          value={formData.email}
                          onChange={handleChange}
                        />
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpLoading}
                          className={`absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-bold text-white rounded transition ${otpLoading ? "bg-gray-400" : "bg-[#72B76A] hover:bg-[#5da356]"
                            }`}
                        >
                          {otpLoading ? "Sending..." : "Send OTP"}
                        </button>
                      </div>
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

                      <input
                        type="text"
                        name="otp"
                        placeholder="Enter OTP"
                        className="w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 focus:bg-white focus:outline-none  ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A]"
                        value={formData.otp}
                        onChange={handleChange}
                      />
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
                          if (userType === "recruiter") {
                            setShowPopup(false);
                            router.push("/recruiters/register");
                          } else {
                            setMode("signup");
                          }
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
      {/* Testimonials */}
      <Testimonials />
      {/* <Footer /> */}
    </>
  );
};

export default Candidates;
