"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { Typewriter } from "react-simple-typewriter";
import "swiper/css";
import Link from "next/link";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation";
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
  mobile: string;
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
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#AE70BB]">
            <CheckIcon className="h-4 w-4 text-white" />
          </span>
          <span className="font-semibold text-[12px] text-gray-700 ">
            {text}
          </span>
        </li>
      ))}
    </ul>
  );
};

const AboutUs = () => {
  const router = useRouter();
  const [img2, img2InView] = useInView({ triggerOnce: true, threshold: 0.1 });
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
    mobile: "",
    email: "",
    confirmPassword: "",
    otp: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);

    localStorage.setItem("isAuthenticated", "true");

    if (userType === "candidates") {
      router.push("/candidates/dashboard");
    } else {
      router.push("/recruiters/dashboard");
    }

    setShowPopup(false);
  };
  type Crumb = { name: string; href?: string };
  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Aboutus" }];
  const [jobTyperRef, jobTyperSeen] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  // Toggle
  const [plan, setPlan] = useState<"monthly" | "annual">("monthly");

  // In-view to trigger counters only when visible
  const { ref: gridRef, inView } = useInView({
    triggerOnce: false,
    threshold: 0.2,
  });

  return (
    <>
      {/*  banner  */}
      <section className="relative overflow-hidden">
        <div className="h-[220px] lg:h-[350px] bg-[url('/images/RI_banner_bg.webp')] bg-cover bg-center bg-no-repeat bg-fixed" />
        <div className="absolute inset-0 flex h-[220px] lg:h-[350px] place-items-end  justify-center px-5 lg:px-[5%] 2xl:px-[10%]">
          <div className="max-w-screen-xl w-full text-center">
            <h1 className="inline-block mb-4 px-4 py-2 text-slate-900  sm:text-xl fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5">
              AboutUs
            </h1>
            {/* Breadcrumbs */}
            <nav
              aria-label="Breadcrumb"
              className="mb-6 text-sm text-slate-700"
            >
              <ol className="flex items-center justify-center gap-2">
                {crumbs.map((c, i) => {
                  const isLast = i === crumbs.length - 0;
                  return (
                    <li key={c.name} className="flex items-center gap-2">
                      {i > 0 && (
                        <svg
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4 text-slate-400"
                          aria-hidden="true"
                        >
                          <path d="M7.05 4.55a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 1 1-1.4-1.4L9.88 10 7.05 7.15a1 1 0 0 1 0-1.4z" />
                        </svg>
                      )}
                      {isLast || !c.href ? (
                        <span className=" fontPOP text-xs sm:text-sm">
                          {c.name}
                        </span>
                      ) : (
                        <a
                          href={c.href}
                          className="hover:text-slate-900 fontPOP text-xs sm:text-sm"
                        >
                          {c.name}
                        </a>
                      )}
                    </li>
                  );
                })}
              </ol>
            </nav>
          </div>
        </div>
      </section>
      {/* main content  */}
      {/* How It Works  */}
      <section className="section-container md:pt-12 2xl:pt-[5%] grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
        {/* left side */}
        <div className="flex flex-col gap-4 pr-6 md:pr-10 lg:pr-16 pt-6 md:pt-10 lg:pt-16 pb-6 md:pb-10 lg:pb-16">
          <p className="fontPOP text-[#AE70BB] text-xs sm:text-sm">
            How It Works
          </p>
          <p
            className="fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl max-w-[500px] min-h-10"
            style={{
              letterSpacing: "1px",
              wordSpacing: "2px",
              lineHeight: 1.2,
            }}
            ref={jobTyperRef}
          >
            {jobTyperSeen && (
              <Typewriter
                words={["Follow our steps we will help you."]}
                typeSpeed={90}
                deleteSpeed={0}
                delaySpeed={800}
                cursor={false}
                loop={1}
              />
            )}
          </p>
          <div className="mt-2">
            <FeatureList
              items={[
                "Trusted & Quality Job",
                "International Job",
                "No Extra Charge",
                "Top Companies",
              ]}
            />
          </div>
        </div>

        {/* ✅ right side */}
        <div className="grid flex-1 grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 lg:gap-16">
          {[
            {
              no: "01",
              bg: "bg-[#00c9ff]/40",
              num: "text-[#00c9ff]",
              icon: "/images/icon1.webp",
              titleTop: "Register",
              titleBottom: "Your Account",
              offset: "sm:translate-y-0",
              glow: "shadow-[0_30px_60px_rgba(24,39,75,0.12)]",
              badgeGlow: "shadow-[0_15px_45px_rgba(59,130,246,0.35)]",
            },
            {
              no: "02",
              bg: "bg-[#ffcc23]/50",
              num: "text-[#ffcc23]",
              icon: "/images/icon2.webp",
              titleTop: "Search",
              titleBottom: "Your Job",
              offset: "sm:-translate-y-6",
              glow: "shadow-[0_30px_60px_rgba(139,99,0,0.12)]",
              badgeGlow: "shadow-[0_15px_45px_rgba(245,158,11,0.35)]",
            },
            {
              no: "03",
              bg: "bg-[#ae70bb]/60",
              num: "text-[#ae70bb]",
              icon: "/images/icon3.webp",
              titleTop: "Apply",
              titleBottom: "For Dream Job",
              offset: "sm:-translate-y-2",
              glow: "shadow-[0_30px_60px_rgba(86,40,110,0.14)]",
              badgeGlow: "shadow-[0_15px_45px_rgba(168,85,247,0.35)]",
            },
            {
              no: "04",
              bg: "bg-[#72b76a]/60",
              num: "text-[#72b76a]",
              icon: "/images/icon4.webp",
              titleTop: "Upload",
              titleBottom: "Your Resume",
              offset: "sm:translate-y-4",
              glow: "shadow-[0_30px_60px_rgba(10,97,82,0.14)]",
              badgeGlow: "shadow-[0_15px_45px_rgba(45,212,191,0.35)]",
            },
          ].map((c, i) => {
            const isLeftCol = i % 2 === 0;
            return (
              <div
                key={c.no}
                className={`group relative rounded-2xl ${c.bg} p-6 ${c.glow} ${
                  c.offset
                }
                                  transition-all duration-300 ease-out will-change-transform
                                  hover:-translate-y-1 hover:shadow-xl
                                  ${
                                    isLeftCol ? "md:hover:-translate-x-2" : ""
                                  }`}
              >
                {/* floating white badge */}
                <div
                  className={`absolute
 -left-2 -top-3           /* base (mobile <640px) */
  sm:-left-4 sm:-top-4     /* ≥640px */
  md:-left-6 md:-top-5     /* ≥768px */
  lg:-left-7 lg:-top-7     /* ≥1024px */
  xl:-left-8 xl:-top-8     /* ≥1280px */
  2xl:-left-10 2xl:-top-10 /* ≥1536px */
    flex 
    h-16 w-16         /* base (mobile <640px) */
    sm:h-14 sm:w-14   /* ≥640px */
    md:h-16 md:w-16   /* ≥768px */
    lg:h-16 lg:w-16   /* ≥1024px */
    xl:h-18 xl:w-18   /* ≥1280px */
    2xl:h-20 2xl:w-20 /* ≥1536px */
    items-center justify-center
    rounded-2xl bg-white ${c.badgeGlow}
    transition-transform duration-300 group-hover:scale-105`}
                >
                  <Image
                    src={c.icon}
                    alt={`step-${c.no}`}
                    width={28}
                    height={28}
                    className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 xl:w-10 xl:h-10 2xl:w-12 2xl:h-12"
                  />
                </div>
                <span
                  className={`absolute right-3 top-2 select-none
    text-5xl           /* base (mobile <640px) */
    sm:text-xl        /* ≥640px */
    md:text-3xl        /* ≥768px */
    lg:text-4xl        /* ≥1024px */
    xl:text-5xl        /* ≥1280px */
    2xl:text-6xl       /* ≥1536px big screens */
    font-extrabold ${c.num}
    transition-opacity duration-300 group-hover:opacity-90`}
                >
                  {c.no}
                </span>
                <h4
                  className="mt-8 mb-2  sm:mt-6 
  text-xl        /* mobile default */
  sm:text-sm   /* ≥640px */
  md:text-sm     /* ≥768px */
  lg:text-lg     /* ≥1024px */
  xl:text-xl     /* ≥1280px */
  font-semibold text-[#17171d]"
                >
                  {c.titleTop} <br className="hidden sm:block" />{" "}
                  {c.titleBottom}
                </h4>
                <p
                  className="
    text-[13px] leading-6        /* base (mobile <640px) */
    sm:text-xs sm:leading-6      /* small screens ≥640px */
    md:text-[11px] md:leading-4  /* tablets ≥768px */
    lg:text-sm lg:leading-5      /* laptops ≥1024px */
    xl:text-sm xl:leading-6    /* desktops ≥1280px */
    text-black/70
  "
                >
                  You need to create an account to find the best and preferred
                  job.
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* call to action  */}
      <div className="px-5 lg:px-[5%] 2xl:px-[15%] my-20 sm:my-10">
        <div className="grid grid-cols-1 lg:grid-cols-[40%_55%] gap-10 items-center justify-between">
          <div className="">
            <div className="relative flex items-center justify-center">
              <div className="animate_outer_rotate absolute bg-[#EFE2F1] rounded-[50px] h-80 w-80 animate-rotate-slow z-0"></div>

              <div className="animate_inner_rotate absolute bg-white rounded-[50px] h-72 w-72 animate-rotate-reverse z-10"></div>
              <Link href="/" className="inline-block">
                <Image
                  src="/images/girl.webp"
                  alt="Girl-img"
                  height={400}
                  width={400}
                  className="relative z-20 "
                />
              </Link>
            </div>
          </div>

          <motion.div
            ref={img2}
            initial={{ opacity: 0, x: 100 }}
            animate={img2InView ? { opacity: 1, x: 0 } : { opacity: 0, x: 100 }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="mt-14"
          >
            <div className="relative inline-block lg:max-w-[600px] mr-5 lg:mr-0">
              <div className="absolute top-8 left-5 w-full h-full rounded-xl bg-[#DFC6E4]"></div>

              <div className="relative bg-white p-10 rounded-xl border border-[#DFC6E4]">
                <p
                  className="fontPOP text-xs sm:text-sm"
                  style={{
                    letterSpacing: "1px",
                    lineHeight: 1.3,
                  }}
                >
                  Lorem ipsum dolor.
                </p>

                <p
                  className="fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5"
                  style={{
                    letterSpacing: "1px",
                    wordSpacing: "2px",
                    lineHeight: 1.2,
                  }}
                >
                  Ready To Start Your Career Journey?
                </p>

                <p className="text-sm mt-5">
                  Create your candidate profile, upload your resume, and apply
                  to top companies in just a few clicks. Take the first step
                  towards your dream job today! Create your candidate profile,
                  upload your resume, and apply to top companies in just a few
                  clicks. Take the first step towards your dream job today!
                  Resume, and apply to top companies in just a few clicks. Take
                  the first step towards your dream job today!
                </p>

                <button
                  onClick={() => {
                    setShowPopup(true);
                    setMode("login");
                    setUserType("candidates");
                  }}
                  className="relative mt-8 px-4 h-9 overflow-hidden group border border-[#AE70BB] bg-[#AE70BB] rounded-lg hover:bg-transparent text-white hover:text-[#AE70BB] active:scale-90 transition-all ease-out duration-700 cursor-pointer"
                >
                  <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-24 ease"></span>
                  <span className="relative flex gap-2 items-center text-sm font-semibold">
                    Candidates Login
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
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
                        - Lorem ipsum dolor sit amet consectetur adipisicing
                        elit.
                      </li>
                      <li>
                        - Distinctio, recusandae. Lorem ipsum dolor sit amet.
                      </li>
                      <li>
                        - Lorem ipsum dolor sit amet consectetur adipisicing
                        elit.
                      </li>
                      <li>
                        - Distinctio, recusandae. Lorem ipsum dolor sit amet.
                      </li>
                      <li>
                        - Distinctio, recusandae. Lorem ipsum dolor sit amet.
                      </li>
                      <li>
                        - Distinctio, recusandae. Lorem ipsum dolor sit amet.
                      </li>
                      <li>
                        - Distinctio, recusandae. Lorem ipsum dolor sit amet.
                      </li>
                      <li>
                        - Distinctio, recusandae. Lorem ipsum dolor sit amet.
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
                <div className="flex gap-3 mb-6 justify-center md:justify-start">
                  {/* Candidates Button */}
                  <button
                    type="button"
                    onClick={() => setUserType("candidates")}
                    className={`relative w-32 h-9 overflow-hidden group rounded-lg active:scale-90 transition-all ease-out duration-700 flex items-center justify-center border
                           ${
                             userType === "candidates"
                               ? "bg-[#72B76A] text-white border-[#72B76A]"
                               : "bg-transparent text-[#72B76A] border-[#72B76A] hover:bg-[#72B76A] hover:text-white"
                           }`}
                  >
                    <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-24 ease"></span>
                    <span className="relative text-sm font-semibold">
                      Candidates
                    </span>
                  </button>

                  {/* Recruiters Button */}
                  <button
                    type="button"
                    onClick={() => setUserType("recruiter")}
                    className={`relative w-32 h-9 overflow-hidden group rounded-lg active:scale-90 transition-all ease-out duration-700 flex items-center justify-center border
                           ${
                             userType === "recruiter"
                               ? "bg-[#72B76A] text-white border-[#72B76A]"
                               : "bg-transparent text-[#72B76A] border-[#72B76A] hover:bg-[#72B76A] hover:text-white"
                           }`}
                  >
                    <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-24 ease"></span>
                    <span className="relative text-sm font-semibold">
                      Recruiters
                    </span>
                  </button>
                </div>

                {/* Inputs */}
                {mode === "signup" ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      name="fullName"
                      placeholder="Full Name"
                      className="w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 focus:bg-white focus:outline-none ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A]"
                      value={formData.fullName}
                      onChange={handleChange}
                    />
                    <input
                      type="text"
                      name="mobile"
                      placeholder="Mobile Number"
                      className="w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 focus:bg-white focus:outline-none ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A]"
                      value={formData.mobile}
                      onChange={handleChange}
                    />
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
                  </div>
                ) : (
                  <div className="space-y-3">
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
                  </div>
                )}

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
                        onClick={() => setMode("signup")}
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

export default AboutUs;
