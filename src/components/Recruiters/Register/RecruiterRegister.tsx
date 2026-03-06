"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import Footer from "@/components/Footer/Footer";

type Crumb = { name: string; href?: string };

const crumbs: Crumb[] = [
    { name: "Home", href: "/" },
    { name: "Recruiters", href: "/recruiters" },
    { name: "Register" },
];

interface FormState {
    companyName: string;
    fullName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export default function RecruiterRegister() {
    const router = useRouter();

    const [form, setForm] = useState<FormState>({
        companyName: "",
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError("");
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!form.companyName || !form.fullName || !form.email || !form.password) {
            setError("Please fill in all required fields.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (form.password.length < 8) {
            setError("Password must be at least 8 characters.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`${BACKEND}/auth/recruiter/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    company_name: form.companyName,
                    full_name: form.fullName,
                    email: form.email,
                    password: form.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Registration failed. Please try again.");
                return;
            }

            setSuccess(true);
        } catch {
            setError("Network error. Please check your connection and try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <>
                <div className="min-h-[70vh] flex items-center justify-center px-4 py-14 bg-[#FFFFF0]">
                    <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-10 text-center">
                        <div className="w-16 h-16 rounded-full bg-[#72B76A]/20 flex items-center justify-center mx-auto mb-5">
                            <span className="text-3xl">✅</span>
                        </div>
                        <h2 className="fontAL font-bold text-2xl text-slate-800 mb-3">Registration Submitted!</h2>
                        <p className="text-slate-600 text-sm mb-6">
                            Your recruiter account is <strong>pending admin approval</strong>. We'll notify you at{" "}
                            <strong>{form.email}</strong> once your account is approved.
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-2.5 bg-[#72B76A] text-white rounded-lg font-semibold hover:bg-[#5e9b55] transition"
                        >
                            Back to Home
                        </Link>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            {/* Banner */}
            <section className="relative overflow-hidden">
                <div className="h-[220px] lg:h-[350px] bg-[url('/images/RI_banner_bg.webp')] bg-cover bg-center bg-no-repeat bg-fixed" />
                <div className="absolute inset-0 flex h-[220px] lg:h-[350px] place-items-end justify-center px-5 lg:px-[5%] 2xl:px-[10%]">
                    <div className="max-w-screen-xl w-full text-center">
                        <h1 className="inline-block mb-4 px-4 py-2 text-slate-900 fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5">
                            Recruiter Registration
                        </h1>
                        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-700">
                            <ol className="flex items-center justify-center gap-2">
                                {crumbs.map((c, i) => (
                                    <li key={c.name} className="flex items-center gap-2">
                                        {i > 0 && (
                                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-slate-400">
                                                <path d="M7.05 4.55a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-4 4a1 1 0 1 1-1.4-1.4L9.88 10 7.05 7.15a1 1 0 0 1 0-1.4z" />
                                            </svg>
                                        )}
                                        {c.href ? (
                                            <a href={c.href} className="hover:text-slate-900 fontPOP text-xs sm:text-sm">{c.name}</a>
                                        ) : (
                                            <span className="fontPOP text-xs sm:text-sm">{c.name}</span>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    </div>
                </div>
            </section>

            {/* Form */}
            <div className="min-h-[60vh] flex items-center justify-center px-4 py-14 bg-[#FFFFF0]">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
                    <div className="flex justify-center mb-6">
                        <Image src="/images/logo.svg" alt="Rojgari India" width={160} height={55} style={{ height: "auto", width: "auto" }} />
                    </div>

                    <h2 className="fontAL font-semibold text-2xl text-center text-slate-800 mb-2">
                        Register as Recruiter
                    </h2>
                    <p className="text-center text-sm text-slate-500 mb-6">
                        Your account will be reviewed and approved by our admin team.
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Company Name */}
                        <div>
                            <label className="block text-sm text-slate-600 mb-1">Company Name <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                name="companyName"
                                value={form.companyName}
                                onChange={handleChange}
                                placeholder="Enter company name"
                                className="w-full p-2.5 rounded-lg bg-white text-sm placeholder-slate-400 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#72B76A] transition"
                            />
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm text-slate-600 mb-1">Your Full Name <span className="text-red-400">*</span></label>
                            <input
                                type="text"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className="w-full p-2.5 rounded-lg bg-white text-sm placeholder-slate-400 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#72B76A] transition"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm text-slate-600 mb-1">Email <span className="text-red-400">*</span></label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                autoComplete="email"
                                className="w-full p-2.5 rounded-lg bg-white text-sm placeholder-slate-400 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#72B76A] transition"
                            />
                        </div>


                        {/* Password */}
                        <div>
                            <label className="block text-sm text-slate-600 mb-1">Password <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="Min. 8 characters"
                                    autoComplete="new-password"
                                    className="w-full p-2.5 pr-10 rounded-lg bg-white text-sm placeholder-slate-400 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#72B76A] transition"
                                />
                                <button type="button" onClick={() => setShowPassword((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-sm text-slate-600 mb-1">Confirm Password <span className="text-red-400">*</span></label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Re-enter your password"
                                    autoComplete="new-password"
                                    className="w-full p-2.5 pr-10 rounded-lg bg-white text-sm placeholder-slate-400 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#72B76A] transition"
                                />
                                <button type="button" onClick={() => setShowConfirmPassword((p) => !p)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <p className="text-red-500 text-sm text-center bg-red-50 border border-red-200 rounded-lg p-2">
                                {error}
                            </p>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full h-11 mt-2 flex items-center justify-center gap-2 bg-[#72B76A] text-white rounded-lg font-semibold hover:bg-[#5e9b55] transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                "Register"
                            )}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link href="/candidates/login" className="text-[#72B76A] font-semibold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}
