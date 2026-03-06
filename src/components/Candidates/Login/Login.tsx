"use client";

import React, { useState, FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash, FaArrowRightToBracket } from "react-icons/fa6";
import { useAuth, UserRole } from "@/context/AuthContext";
import Footer from "@/components/Footer/Footer";

type Crumb = { name: string; href?: string };

const crumbs: Crumb[] = [
  { name: "Home", href: "/" },
  { name: "Login" },
];

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("candidate");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    const result = await login(email, password, role);
    setLoading(false);

    if (!result.success) {
      setError(result.message || "Login failed. Please try again.");
      return;
    }

    // Redirect to the correct dashboard
    router.push(role === "candidate" ? "/candidates/dashboard" : "/recruiters/dashboard");
  };

  return (
    <>
      {/* Banner */}
      <section className="relative overflow-hidden">
        <div className="h-[220px] lg:h-[350px] bg-[url('/images/RI_banner_bg.webp')] bg-cover bg-center bg-no-repeat bg-fixed" />
        <div className="absolute inset-0 flex h-[220px] lg:h-[350px] place-items-end justify-center px-5 lg:px-[5%] 2xl:px-[10%]">
          <div className="max-w-screen-xl w-full text-center">
            <h1 className="inline-block mb-4 px-4 py-2 text-slate-900 fontAL font-semibold capitalize text-2xl md:text-3xl lg:text-4xl mt-5">
              Sign In
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
                      <a href={c.href} className="hover:text-slate-900 fontPOP text-xs sm:text-sm">
                        {c.name}
                      </a>
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

      {/* Login Card */}
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-14 bg-[#FFFFF0]">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image src="/images/logo.svg" alt="Rojgari India" width={160} height={55} style={{ height: "auto", width: "auto" }} />
          </div>

          <h2 className="fontAL font-semibold text-2xl text-center text-slate-800 mb-6">
            Welcome Back
          </h2>

          {/* Role Toggle */}
          <div className="flex gap-3 mb-6 justify-center">
            {(["candidate", "recruiter"] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r); setError(""); }}
                className={`relative w-36 h-9 overflow-hidden group rounded-lg border transition-all ease-out duration-300 text-sm font-semibold capitalize
                  ${role === r
                    ? "bg-[#72B76A] text-white border-[#72B76A]"
                    : "bg-transparent text-[#72B76A] border-[#72B76A] hover:bg-[#72B76A] hover:text-white"
                  }`}
              >
                {r === "candidate" ? "Candidate" : "Recruiter"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm text-slate-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                autoComplete="email"
                className="w-full p-2.5 rounded-lg bg-white text-sm placeholder-slate-400 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#72B76A] transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-slate-600 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full p-2.5 pr-10 rounded-lg bg-white text-sm placeholder-slate-400 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-[#72B76A] transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="flex justify-end">
              <Link href="/candidates/forgot-password" className="text-xs text-[#72B76A] hover:underline">
                Forgot password?
              </Link>
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
                <>
                  <FaArrowRightToBracket />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Sign up links */}
          <div className="mt-6 text-center text-sm text-slate-600 space-y-1">
            <p>
              Don't have an account?{" "}
              <Link href="/candidates/register" className="text-[#72B76A] font-semibold hover:underline">
                Sign Up as Candidate
              </Link>
            </p>
            <p>
              Are you a recruiter?{" "}
              <Link href="/recruiters/register" className="text-[#72B76A] font-semibold hover:underline">
                Register as Recruiter
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
