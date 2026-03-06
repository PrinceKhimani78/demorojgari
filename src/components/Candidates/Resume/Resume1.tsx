"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Common/Sidebar";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { message, Spin } from "antd";
import { IoChevronForward } from "react-icons/io5";
import { FiChevronRight, FiUploadCloud } from "react-icons/fi";
import CandidateProfileHeader from "@/components/Candidates/Common/CandidateProfileHeader";

const Resume1 = () => {
  const { user, token, updateUserInfo } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.rojgariindia.com/api";

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Basic validation
      if (file.size > 5 * 1024 * 1024) {
        message.error("File size must be less than 5MB");
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      message.warning("Please select a file first");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", selectedFile);

    try {
      const res = await fetch(`${BACKEND_URL}/candidate-profile/${user?.id}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (res.ok) {
        const result = await res.json();
        message.success("Resume uploaded successfully!");
        updateUserInfo({
          resume: result.data.resume || result.resume
        });
        setSelectedFile(null);
      } else {
        const errData = await res.json();
        message.error(errData.message || "Failed to upload resume");
      }
    } catch (err) {
      message.error("Network error. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div className="pl-2 pr-4 sm:px-2 py-2 flex gap-3 sm:gap-4 my-30 relative">
        <Sidebar
          type="candidate"
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        <main className="flex-1 px-5 py-5 bg-white shadow rounded-lg space-y-8">
          {/* Title + Breadcrumb */}
          <div className="border-b pb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex gap-5 items-center ">
                <IoChevronForward
                  onClick={() => setMobileOpen(true)}
                  className="text-[white] text-2xl cursor-pointer md:hidden bg-black rounded-full p-1"
                />
                <h1 className="fontAL font-semibold capitalize text-xl md:text-2xl lg:text-3xl tracking-wider">
                  My Resume
                </h1>
              </div>

              <nav aria-label="Breadcrumb" className="hidden sm:block text-sm text-gray-500">
                <ol className="flex items-center gap-2">
                  <li className="flex items-center gap-2">
                    <Link href="/" className="hover:text-gray-700">Home</Link>
                    <FiChevronRight />
                  </li>
                  <li className="flex items-center gap-2">
                    <Link href="/candidates" className="hover:text-gray-700">Candidates</Link>
                    <FiChevronRight />
                  </li>
                  <li><span className="text-gray-700 font-medium">Resume</span></li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Dynamic Profile Header */}
          <CandidateProfileHeader />

          {/* Simple Resume Upload Section */}
          <div className="max-w-2xl mx-auto py-10">
            <div className="bg-gray-50 border-2 border-dashed border-[#72B76A] rounded-2xl p-10 text-center space-y-6">
              <div className="flex justify-center">
                <div className="p-5 bg-green-50 rounded-full">
                  <FiUploadCloud className="text-5xl text-[#72B76A]" />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-gray-800">Upload Your Resume</h3>
                <p className="text-gray-500 mt-2">
                  Upload your CV to let recruiters find you easily.
                  Supported formats: PDF, DOC, DOCX (Max 5MB)
                </p>
              </div>

              <div className="flex flex-col items-center gap-4">
                <label className="cursor-pointer">
                  <span className="px-6 py-3 bg-[#72B76A] text-white rounded-xl font-bold hover:bg-[#5da056] transition shadow-lg inline-block">
                    Select File
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                  />
                </label>

                {selectedFile && (
                  <div className="flex items-center gap-3 bg-white p-3 rounded-lg border shadow-sm">
                    <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
                      {selectedFile.name}
                    </span>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              {selectedFile && (
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full max-w-xs py-3 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition disabled:bg-gray-400"
                >
                  {uploading ? <Spin size="small" /> : "Upload Now"}
                </button>
              )}

              {user?.resume && (
                <div className="mt-8 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-3">Currently uploaded resume:</p>
                  <a
                    href={`${(BACKEND_URL || '').replace('/api', '')}/uploads/${user.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#72B76A] font-bold hover:underline inline-flex items-center gap-2"
                  >
                    View Current Resume
                  </a>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default Resume1;
