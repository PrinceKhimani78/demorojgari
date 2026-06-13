"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useInView } from "react-intersection-observer";
import { Typewriter } from "react-simple-typewriter";
import "swiper/css";
import Link from "next/link";
import { FaEye, FaEyeSlash, FaQuoteLeft, FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { motion } from "framer-motion";
import { RxCross2 } from "react-icons/rx";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { sendOtp } from "@/services/otpService";

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts[parts.length - 1]?.[0] ?? "";
  return (first + (parts.length > 1 ? last : "")).toUpperCase();
};

const testimonials = [
  { name: "Shashank Deep Singh", position: "Design Manager (Indore)", review: "Rojgari India is one of the best recruitment consultants in India. Their team is very supportive, professional, and helpful throughout the hiring process. They regularly provide job updates and guide candidates at every step.", rating: 5 },
  { name: "Rishi Kumar", position: "Sr. Quality engineer (Bangalore)", review: "I had a very positive experience with Rojgari India. The recruiters understood my profile and shared relevant job openings. Their communication was timely and transparent. They kept me updated at every stage of the recruitment process.", rating: 5 },
  { name: "Joshi hirji bhai shivram", position: "Warehouse sr. Supervisor (Mundra)", review: "Finding the right job became much easier with Rojgari India. The team is knowledgeable, supportive, and genuinely cares about candidates. They provided proper guidance before interviews and followed up regularly.", rating: 5 },
  { name: "Amit ramesh bhavsar", position: "Senior electrician (Silvassa)", review: "One of the best placement consultants I have come across. The team is friendly, helpful, and quick to respond. They matched my skills with the right opportunity. Very satisfied with their service.", rating: 5 },
  { name: "Shubham bhatt", position: "Instrument Engineer (Bhavnagar)", review: "I appreciate the efforts of the Rojgari India team in helping me find a suitable job. They were attentive, supportive, and professional throughout the process. The recruiters provided valuable guidance and interview preparation tips.", rating: 5 },
  { name: "Kishan Kumar", position: "Sr. Engineer Technical Publication (Bangalore)", review: "What I liked most about Rojgari India was their quick response and genuine effort to help candidates. They understood my experience and connected me with suitable opportunities. A very reliable recruitment partner.", rating: 5 },
  { name: "Pushpak Viliya", position: "Deputy Manager Warranty (Indore", review: "A professional and supportive recruitment team. They carefully matched my profile with relevant opportunities and assisted me at every step. Great experience overall.", rating: 5 },
  { name: "Sandip Sureshrao Bonlawar", position: "Assistant Manager (Pune", review: "Best consultancy, Thank you for your excellent support throughout my job search. Your team was highly professional, communicative, and truly understood my career goals. Because of your dedicated guidance, I secured a great position.", rating: 5 },
  { name: "Vishal Pawar", position: "Sr. Engineer design (Nasik", review: "Thank you for your support and guidance throughout the recruitment process. I appreciate your timely communication, coordination, and efforts in helping me secure this opportunity. It was a smooth and professional experience working with you.", rating: 5 },
  { name: "Anirudh Sharma", position: "Jobseeker (Uttar Pradesh", review: "Overall experience was good throughout the onboarding process. The team patiently answered all my queries, handled rescheduling my interview professionally when an urgent meeting conflicted, and provided continuous support.", rating: 5 },
  { name: "Vishvjeet Chaudhary", position: "SQA Officer (Uttar Pradesh", review: "Rojgari India portal is user-friendly and easy to navigate. It provides relevant job opportunities and keeps candidates updated throughout the recruitment process. The support team is responsive and helpful.", rating: 5 },
  { name: "Rahul S. Ingale", position: "Manager RTFE Design (Pune", review: "I had a very good experience with Rojgari India. They provide quality opportunities and genuinely help candidates. From arranging interviews to coordinating with companies and providing updates, they ensure everything is handled smoothly.", rating: 5 },
  { name: "Akshata Padoshi", position: "Conceptual Jewelry Designer (Bengaluru", review: "The team was professional, responsive, and helpful throughout the recruitment process. Their communication was timely, and they provided valuable support at every stage.", rating: 5 },
  { name: "Viral H. Sheth", position: "Structural Engineer (Vadodara", review: "The staff is very cooperative and knowledgeable. They provide excellent guidance and support throughout the recruitment process.", rating: 5 },
];

const renderStars = (rating: number): React.ReactNode[] => {
  const stars: React.ReactNode[] = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) stars.push(<FaStar key={i} className="text-yellow-400" />);
    else if (rating >= i - 0.5) stars.push(<FaStarHalfAlt key={i} className="text-yellow-400" />);
    else stars.push(<FaRegStar key={i} className="text-yellow-400" />);
  }
  return stars;
};

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
    email: "",
    confirmPassword: "",
    otp: "",
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
      {/* Immersive Hero */}
      <section className="relative overflow-hidden">
        <div className="h-screen bg-[url('/images/RI_banner_bg.webp')] bg-cover bg-center bg-no-repeat bg-fixed" />
        <div className="absolute inset-0 flex items-center justify-center px-5 lg:px-[5%] 2xl:px-[10%]">
          <div className="max-w-screen-xl w-full text-center">
            <h1 className="inline-block mb-4 px-4 py-2 text-slate-900 text-2xl sm:text-3xl md:text-4xl lg:text-5xl fontAL font-semibold capitalize mt-5">
              Empowering Careers, Elevating Businesses
            </h1>
            <p className="fontPOP text-sm md:text-base text-slate-700 mb-6 max-w-2xl mx-auto">
              We are India's premier employment portal dedicated to bridging the gap between exceptional talent and industry-leading corporate employers.
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

      {/* Our Story (Split Layout) */}
      <section className="section-container md:pt-20 2xl:pt-[5%] pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative order-last lg:order-first"
          >
            <div className="absolute -inset-4 bg-gradient-to-br from-[#AE70BB]/20 to-transparent rounded-[3rem] -z-10 blur-2xl"></div>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image src="/images/our_story_office.png" alt="Our Team" fill className="object-cover" />
            </div>
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 hidden md:block">
              <p className="text-3xl font-extrabold text-[#AE70BB]">25+</p>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-widest mt-1">Years of Excellence</p>
            </div>
          </motion.div>
          <div className="flex flex-col gap-6 order-first lg:order-last">
            <p className="fontPOP text-[#AE70BB] text-sm tracking-widest uppercase">Our Story</p>
            <h2 className="fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5 text-gray-900" style={{ letterSpacing: "1px", wordSpacing: "2px", lineHeight: 1.2 }}>
              25+ Years of Building Dream Careers
            </h2>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              Rojgari India was founded with a single, powerful mission: to make the job search and recruitment process transparent, efficient, and rewarding for everyone involved. What started as a small consultancy has grown into a nationwide network connecting thousands of ambitious professionals with top-tier organizations.
            </p>
            <p className="text-gray-600 leading-relaxed text-sm md:text-base">
              We believe that talent is everywhere, but opportunity is not. Our platform leverages advanced matching algorithms, a dedicated support team, and a vast network of corporate partners to ensure that every candidate finds their perfect role, and every employer finds their ideal hire.
            </p>
            <div className="mt-4 flex gap-4">
              <FeatureList items={["Verified Corporate Employers", "Dedicated Placement Support", "Nationwide Network", "100% Transparent Process"]} className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 w-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Grid */}
      <section className="py-20 px-5 lg:px-[5%] 2xl:px-[15%]">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="fontPOP text-[#00c9ff] text-sm tracking-widest uppercase">Core Values</p>
          <h2 className="fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5 text-gray-900" style={{ letterSpacing: "1px", wordSpacing: "2px", lineHeight: 1.2 }}>What Drives Us Forward</h2>
          <p className="text-gray-500 mt-4">We are guided by a strong set of principles that shape every interaction we have with our candidates and employer partners.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Our Mission", icon: "🚀", color: "from-[#00c9ff]/20 to-transparent", text: "To provide a seamless, transparent platform that connects talented individuals with companies where they can truly thrive and make an impact." },
            { title: "Our Vision", icon: "👁️", color: "from-[#AE70BB]/20 to-transparent", text: "To become India's most trusted and innovative recruitment partner, setting the standard for quality hiring and career advancement across all industries." },
            { title: "Our Commitment", icon: "🤝", color: "from-[#72B76A]/20 to-transparent", text: "We are committed to excellence, ensuring that every candidate is treated with respect and every employer receives highly qualified, vetted profiles." }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow relative overflow-hidden group"
            >
              <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-bl ${item.color} rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500`}></div>
              <div className="text-4xl mb-6">{item.icon}</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* By The Numbers */}
      <section className="py-20 px-5 lg:px-[5%] 2xl:px-[15%]">
        <div className="bg-[#023052] rounded-3xl p-10 md:p-16 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/images/map-img.webp')] opacity-10 bg-cover bg-center"></div>
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { num: "50K+", label: "Registered Candidates" },
              { num: "2,500+", label: "Partner Companies" },
              { num: "15K+", label: "Successful Placements" },
              { num: "50+", label: "Industries Covered" }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center justify-center border-r border-white/10 last:border-0">
                <p className="text-4xl md:text-5xl font-extrabold text-[#FFCC23] mb-2">{stat.num}</p>
                <p className="text-sm md:text-base text-white/80 font-medium uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
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
      {/* ── All Testimonials Section ─────────────────────────────── */}
      <section id="testimonials" className="scroll-mt-24 py-16 px-5 lg:px-[5%] 2xl:px-[15%]">
        <div className="text-center mb-12">
          <p className="fontPOP text-[#72B76A] text-sm tracking-widest uppercase">Reviews</p>
          <h2 className="fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-3" style={{ letterSpacing: "1px", lineHeight: 1.2 }}>
            What Our Candidates Say About Us
          </h2>
          <p className="mt-4 text-gray-500 max-w-xl mx-auto leading-relaxed">
            Real feedback from professionals across India who found their dream jobs through Rojgari India.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 border border-gray-100"
            >
              <div className="flex justify-between items-start">
                <FaQuoteLeft className="text-2xl text-[#72B76A]" />
                <div className="flex gap-0.5">{renderStars(t.rating)}</div>
              </div>
              <p className="text-gray-600 italic text-sm leading-relaxed flex-1">{t.review}</p>
              <div className="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div className="w-12 h-12 rounded-full bg-[#72B76A] flex items-center justify-center text-white font-bold text-base shrink-0">
                  {getInitials(t.name)}
                </div>
                <div>
                  <p className="font-bold text-sm text-gray-800">{t.name}</p>
                  <p className="text-xs text-gray-500">{t.position}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </>
  );
};

export default AboutUs;
