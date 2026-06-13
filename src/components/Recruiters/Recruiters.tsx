"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { Typewriter } from "react-simple-typewriter";
import "swiper/css";
import Link from "next/link";
import Testimonials from "../Testimonials/Testimonials";
import CountUp from "react-countup";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { sendOtp } from "@/services/otpService";
import { INDUSTRY_OPTIONS } from "@/constants/industryData";
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
  companyName?: string;
  industry?: string;
  mobileNumber?: string;
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
          <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#881A2D]">
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

const Recruiters = () => {
  const router = useRouter();
  const [img2, img2InView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [userType, setUserType] = useState<"candidates" | "recruiter">(
    "recruiter"
  );
  const [formData, setFormData] = useState<FormState>({
    username: "",
    password: "",
    fullName: "",
    email: "",
    confirmPassword: "",
    otp: "",
    companyName: "",
    industry: "",
    mobileNumber: "",
  });
  const [otpLoading, setOtpLoading] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (mode === "signup") {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      const registerPayload: any = {
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        otp: formData.otp,
      };

      if (userType === "recruiter") {
        registerPayload.companyName = formData.companyName;
        registerPayload.industry = formData.industry;
        registerPayload.mobileNumber = formData.mobileNumber;
      }

      const res = await register(registerPayload, userType === "candidates" ? "candidate" : "recruiter");
      if (res.success) {
        alert(res.message || "we are working on your request");
        setMode("login");
      } else {
        alert(res.message || "Registration failed");
      }
    } else {
      const res = await login(formData.username, formData.password, userType === "candidates" ? "candidate" : "recruiter");
      if (res.success) {
        setShowPopup(false);
        if (userType === "candidates") {
          router.push("/candidates/dashboard");
        } else {
          router.push("/recruiters/dashboard");
        }
      } else {
        alert(res.message || "we are working on your request");
      }
    }
  };
  type Crumb = { name: string; href?: string };
  const crumbs: Crumb[] = [{ name: "Home", href: "/" }, { name: "Recruiters" }];
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

  // Animated check / cross icons (unchanged)
  function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-9 w-9 text-blue-600 flex-none"
        aria-hidden="true"
        {...props}
      >
        <path
          d="M9 12.75 11.25 15 15 9.75"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  function CrossIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5 text-slate-300 flex-none"
        aria-hidden="true"
        {...props}
      >
        <path
          d="M6 6l12 12M18 6L6 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  const Feature: React.FC<{ ok?: boolean; children: React.ReactNode }> = ({
    ok,
    children,
  }) => (
    <li
      className={`flex items-center gap-3 text-sm ${ok ? "" : "text-slate-400"
        }`}
    >
      {ok ? <CheckIcon /> : <CrossIcon />}
      <span>{children}</span>
    </li>
  );

  // Prices
  const PRICES = {
    monthly: { basic: 90, standard: 248, extended: 499 },
    annual: { basic: 149, standard: 449, extended: 1499 },
  } as const;

  //counter
  const AnimatedPrice: React.FC<{
    amount: number;
    shouldAnimate: boolean;
    k: string;
  }> = ({ amount, shouldAnimate, k }) => (
    <CountUp
      key={`${k}-${amount}-${shouldAnimate}-${plan}`} // re-animate on plan change
      start={0}
      end={shouldAnimate ? amount : 0}
      duration={5.5}
      separator=","
    />
  );

  return (
    <>
      {/* B2B Hero */}
      <section className="relative overflow-hidden">
        <div className="h-screen bg-[url('/images/RI_banner_bg.webp')] bg-cover bg-center bg-no-repeat bg-fixed" />
        <div className="absolute inset-0 flex items-center justify-center px-5 lg:px-[5%] 2xl:px-[10%]">
          <div className="max-w-screen-xl w-full text-center">
            <p className="fontPOP text-slate-500 font-semibold tracking-widest uppercase mb-2 text-xs md:text-sm mt-5">
              For Corporate Employers
            </p>
            <h1 className="inline-block mb-4 px-4 py-2 text-slate-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl fontAL font-semibold capitalize">
              Hire Top Talent, Faster.
            </h1>
            <p className="fontPOP text-sm md:text-base text-slate-700 mb-6 max-w-2xl mx-auto">
              Streamline your recruitment process. Access our database of thousands of pre-screened, verified professionals ready to join your team today.
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

      {/* Why Partner With Us (Grid) */}
      <section className="py-20 px-5 lg:px-[5%] 2xl:px-[15%]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5 text-gray-900" style={{ letterSpacing: "1px", wordSpacing: "2px", lineHeight: 1.2 }}>Why Industry Leaders Trust Us</h2>
          <p className="text-gray-500 mt-4 text-base md:text-lg">We provide an end-to-end recruitment solution designed to reduce time-to-hire and improve candidate quality.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: "🔍", title: "Pre-Screened Talent", desc: "Every profile undergoes a preliminary screening to ensure quality and authenticity." },
            { icon: "⚡", title: "Faster Hiring", desc: "Reduce your average time-to-hire by up to 40% with our advanced matching algorithms." },
            { icon: "👨‍💼", title: "Dedicated Manager", desc: "Get personalized support from an Account Manager dedicated to your company's success." },
            { icon: "🎯", title: "Targeted Outreach", desc: "Access passive candidates who aren't actively looking but are open to the right offer." }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:border-[#00c9ff] transition-colors group"
            >
              <div className="text-4xl mb-6 bg-blue-50 w-16 h-16 rounded-lg flex items-center justify-center group-hover:bg-[#00c9ff] group-hover:text-white transition-colors">
                {item.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Our Recruitment Process */}
      <section className="py-20 px-5 lg:px-[5%] 2xl:px-[15%]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="fontPOP text-[#00c9ff] text-sm tracking-widest uppercase">Seamless Workflow</p>
            <h2 className="fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5 text-gray-900" style={{ letterSpacing: "1px", wordSpacing: "2px", lineHeight: 1.2 }}>A Corporate Recruitment Process Built for Scale</h2>
            <p className="text-gray-600 mt-5 mb-10 leading-relaxed text-sm md:text-base">
              Our platform allows HR teams and hiring managers to manage the entire recruitment lifecycle from a single, intuitive dashboard. Post jobs, review applicants, and coordinate interviews effortlessly.
            </p>
            <div className="relative mt-10">
              {/* Vertical Line */}
              <div className="absolute left-7 top-6 bottom-8 w-1 bg-gradient-to-b from-[#FFCC23] to-[#72B76A] rounded-full hidden md:block"></div>

              <div className="space-y-10 relative">
                {[
                  { step: "01", title: "Create Your Company Profile", desc: "Establish your employer brand and showcase your company culture.", color: "bg-[#FFCC23]" },
                  { step: "02", title: "Post Vacancies & Source", desc: "Publish detailed job descriptions or actively search our resume database.", color: "bg-[#00c9ff]" },
                  { step: "03", title: "Screen & Shortlist", desc: "Use advanced filters to identify the top 5% of candidates for your roles.", color: "bg-[#ae70bb]" },
                  { step: "04", title: "Interview & Hire", desc: "Connect with candidates directly and make data-driven hiring decisions.", color: "bg-[#72B76A]" }
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
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#00c9ff]/20 to-transparent rounded-[3rem] -z-10 blur-3xl"></div>
            <Image
              src="/images/recruitment_widgets_matte.png"
              alt="Recruitment Software Dashboard"
              width={600}
              height={500}
              className="rounded-2xl shadow-2xl object-cover w-full h-auto mix-blend-multiply"
            />
          </div>
        </div>
      </section>

      {/* Pricing Teaser */}
      {/* <section className="py-20 px-5 lg:px-[5%] 2xl:px-[15%]">
        <div className="bg-white rounded-3xl p-10 lg:p-16 border border-gray-100 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="max-w-2xl text-center lg:text-left">
            <h2 className="fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5 text-gray-900" style={{ letterSpacing: "1px", wordSpacing: "2px", lineHeight: 1.2 }}>Flexible Plans for Every Business Size</h2>
            <p className="text-gray-600 text-base md:text-lg mb-0 leading-relaxed">
              Whether you are a fast-growing startup needing a single hire, or an enterprise scaling a nationwide team, we have a package designed to meet your recruitment budget.
            </p>
          </div>
          <div className="shrink-0 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link href="/recruiters/packages" className="relative px-6 h-11 flex items-center justify-center overflow-hidden group border border-[#023052] bg-[#023052] rounded-lg hover:bg-transparent text-white hover:text-[#023052] active:scale-90 transition-all ease-out duration-700 shadow-lg text-center whitespace-nowrap">
              <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-20 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-64 ease"></span>
              <span className="relative flex justify-center items-center text-sm font-semibold">View Packages & Pricing</span>
            </Link>
          </div>
        </div>
      </section> */}

      {/* Call to Action (Login/Register) */}
      <div className="px-5 lg:px-[5%] 2xl:px-[15%] pb-20 pt-10">
        <div className="bg-gradient-to-r from-[#00c9ff]/80 to-[#005c99]/90 rounded-3xl p-10 lg:p-16 flex flex-col items-center text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/map-img.webp')] opacity-10 bg-cover bg-center"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="fontAL font-bold text-3xl md:text-4xl text-white mb-6 leading-tight">Ready to Find Your Next Great Hire?</h2>
            <p className="text-white/80 text-sm md:text-base mb-8 leading-relaxed">
              Join thousands of employers who trust Rojgari India to build their dream teams. Create your employer account today and post your first job.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  setShowPopup(true);
                  setMode("signup");
                  setUserType("recruiter");
                }}
                className="relative px-6 h-11 overflow-hidden group border border-[#023052] bg-[#023052] rounded-lg hover:bg-transparent text-white hover:text-[#023052] active:scale-90 transition-all ease-out duration-700 shadow-lg"
              >
                <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-20 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-64 ease"></span>
                <span className="relative flex justify-center items-center text-sm font-semibold">Create Employer Account</span>
              </button>
              <button
                onClick={() => {
                  setShowPopup(true);
                  setMode("login");
                  setUserType("recruiter");
                }}
                className="relative px-6 h-11 overflow-hidden group border-2 border-[#023052] bg-transparent rounded-lg hover:bg-[#023052] text-[#023052] hover:text-white active:scale-90 transition-all ease-out duration-700"
              >
                <span className="absolute right-0 w-10 h-full top-0 transition-all duration-1000 transform translate-x-20 bg-white opacity-10 -skew-x-12 group-hover:-translate-x-64 ease"></span>
                <span className="relative flex justify-center items-center text-sm font-semibold">Employer Login</span>
              </button>
            </div>
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

                {/* Candidate / Recruiter toggle */}
                <div className="relative flex p-1 mb-6 bg-gray-100 rounded-xl w-[272px] mx-auto md:mx-0">
                  {/* Sliding pill */}
                  <div
                    className={`absolute top-1 bottom-1 w-[128px] bg-[#72B76A] rounded-lg transition-transform duration-300 ease-in-out ${userType === "recruiter" ? "translate-x-[132px]" : "translate-x-0"
                      }`}
                  />
                  {/* Candidates Button */}
                  <button
                    type="button"
                    onClick={() => setUserType("candidates")}
                    className={`relative z-10 w-32 h-9 flex items-center justify-center text-sm font-semibold rounded-lg transition-colors duration-300 ${userType === "candidates" ? "text-white" : "text-gray-600 hover:text-black"
                      }`}
                  >
                    Candidates
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
                  </button>
                </div>

                {/* Inputs */}
                <motion.div
                  key={`${mode}-${userType}`}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={mode === "signup" ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : "space-y-3"}
                >
                  {mode === "signup" ? (
                    <>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        className={`w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 focus:bg-white focus:outline-none ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A] ${userType === "candidates" ? "sm:col-span-2" : ""}`}
                        value={formData.fullName}
                        onChange={handleChange}
                      />

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
                            type="text"
                            name="mobileNumber"
                            placeholder="Mobile Number"
                            className="w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 focus:bg-white focus:outline-none ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A]"
                            value={formData.mobileNumber}
                            onChange={handleChange}
                          />
                          <select
                            name="industry"
                            className="w-full p-2 rounded bg-white text-sm text-slate-700 ring-1 focus:bg-white focus:outline-none ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A]"
                            value={formData.industry}
                            onChange={handleChange as any}
                          >
                            <option value="">Select Industry</option>
                            {INDUSTRY_OPTIONS.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </>
                      )}

                      <div className="relative sm:col-span-2">
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
                            className={`absolute right-1 top-1/2 -translate-y-1/2 px-2 py-1 text-[10px] font-bold text-white rounded transition ${otpLoading ? "bg-gray-400" : "bg-[#72B76A] hover:bg-[#5da356]"
                              }`}
                          >
                            {otpLoading ? "Sending..." : "Send OTP"}
                          </button>
                        )}
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

                      {userType === "candidates" && (
                        <input
                          type="text"
                          name="otp"
                          placeholder="Enter OTP"
                          className="w-full p-2 rounded bg-white text-sm placeholder-slate-400 ring-1 focus:bg-white focus:outline-none  ring-gray-300 transition focus:ring-2 focus:ring-[#72B76A] sm:col-span-2"
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
      <div className="recruiter-testimonials">
        <Testimonials />
      </div>
      {/* <Footer /> */}
    </>
  );
};

export default Recruiters;
