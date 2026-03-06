"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaUser,
  FaBriefcase,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaGraduationCap,
  FaLanguage,
  FaDollarSign,
  FaCalendarAlt,
  FaCity,
  FaMapPin,
  FaRegAddressCard,
  FaInfoCircle,
} from "react-icons/fa";
import { FiChevronRight, FiPlus, FiMinus } from "react-icons/fi";
import { IoChevronForward } from "react-icons/io5";
import Sidebar from "@/components/Common/Sidebar";
import CandidateProfileHeader from "@/components/Candidates/Common/CandidateProfileHeader";
import { useAuth } from "@/context/AuthContext";
import { message, Spin } from "antd";

// Ported Components
import InputBox from "@/components/resume/InputBox";
import DatePicker from "@/components/resume/DatePicker";
import SearchableSelectBox from "@/components/resume/SearchableSelectBox";
import MultiSelectBox from "@/components/resume/MultiSelectBox";

// Ported Constants & Utils
import { INDUSTRY_OPTIONS, INDUSTRY_JOB_MAP, SelectOption } from "@/constants/industryData";
import UI_MESSAGES from "@/constants/uiMessages";
import {
  initialForm,
  normalizeIndianPhone,
  validateField as validateFieldUtil,
  validateForm as validateFormUtil,
} from "@/utils/formValidation";

const INDIAN_LANGUAGES: SelectOption[] = [
  { label: "Hindi", value: "Hindi" },
  { label: "English", value: "English" },
  { label: "Bengali", value: "Bengali" },
  { label: "Marathi", value: "Marathi" },
  { label: "Telugu", value: "Telugu" },
  { label: "Tamil", value: "Tamil" },
  { label: "Gujarati", value: "Gujarati" },
  { label: "Urdu", value: "Urdu" },
  { label: "Kannada", value: "Kannada" },
  { label: "Odia", value: "Odia" },
  { label: "Malayalam", value: "Malayalam" },
  { label: "Punjabi", value: "Punjabi" },
  { label: "Sanskrit", value: "Sanskrit" },
  { label: "Assamese", value: "Assamese" },
  { label: "Maithili", value: "Maithili" },
  { label: "Santali", value: "Santali" },
  { label: "Kashmiri", value: "Kashmiri" },
  { label: "Nepali", value: "Nepali" },
  { label: "Gondi", value: "Gondi" },
  { label: "Sindhi", value: "Sindhi" },
  { label: "Konkani", value: "Konkani" },
  { label: "Dogri", value: "Dogri" },
  { label: "Manipuri", value: "Manipuri" },
  { label: "Khasi", value: "Khasi" },
  { label: "Bodo", value: "Bodo" },
  { label: "Garo", value: "Garo" },
  { label: "Mizo", value: "Mizo" },
  { label: "Ho", value: "Ho" },
  { label: "Kui", value: "Kui" },
  { label: "Mundari", value: "Mundari" },
  { label: "Tripuri", value: "Tripuri" },
];

type IndiaJson = {
  [state: string]: {
    [district: string]: {
      [city: string]: string[];
    };
  };
};

type WorkType = "experienced" | "fresher";

type ExperienceEntry = {
  industry: string;
  customIndustry?: string;
  position: string;
  company: string;
  noticePeriod: string;
  startDate: string;
  endDate: string;
  currentWages?: string;
  currentState?: string;
  currentCity?: string;
  currentVillage?: string;
  currentVillageOther?: string;
};

type CertificationEntry = {
  name: string;
  year: string;
  achievement: string;
};

const Profile = () => {
  const { user, token, updateUserInfo } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [indiaData, setIndiaData] = useState<IndiaJson | null>(null);
  const [workType, setWorkType] = useState<WorkType>("experienced");
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Dynamic Lists
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([
    { industry: "", position: "", company: "", noticePeriod: "", startDate: "", endDate: "", currentWages: "", currentState: "", currentCity: "", currentVillage: "", currentVillageOther: "" }
  ]);
  const [educationList, setEducationList] = useState([{ degree: "", university: "", passingYear: "", grade: "" }]);
  const [skillsList, setSkillsList] = useState([{ name: "", years: "", level: "" }]);
  const [certificationList, setCertificationList] = useState<CertificationEntry[]>([{ name: "", year: "", achievement: "" }]);

  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "https://api.rojgariindia.com/api";

  // Timers for debounced validation
  const validateTimers = React.useRef<Record<string, ReturnType<typeof setTimeout> | null>>({});

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch("/data/india_state_district_city_village.json");
        if (res.ok) {
          const json = await res.json();
          setIndiaData(json);
        }

        if (user?.id) {
          const profileRes = await fetch(`${BACKEND_URL}/candidate-profile/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (profileRes.ok) {
            const result = await profileRes.json();
            const data = result.data || result;

            if (data) {
              setForm({
                ...initialForm,
                firstName: data.full_name || "",
                surName: data.surname || "",
                email: data?.email || user?.email || "",
                phone: data.mobile_number || "",
                alternateMobile: data.alternate_mobile_number || "",
                dob: data.date_of_birth ? data.date_of_birth.split('T')[0] : "",
                gender: data.gender || "",
                maritalStatus: data.marital_status || "",
                state: data.state || "",
                district: data.district || "",
                taluka: data.city || "",
                village: data.village || "",
                address: data.address || "",
                pincode: data.pincode || "",
                languagesKnown: Array.isArray(data.languages_known) ? data.languages_known : [],
                availabilityCategory: data.interview_availability || "",
                availabilityIndustry: data.preferred_industry || "",
                availabilityJobCategory: data.job_category || "",
                availabilityState: data.pref_state ? data.pref_state.split(', ') : [],
                availabilityCity: data.pref_city ? data.pref_city.split(', ') : [],
                expectedSalary: data.expected_salary ? String(data.expected_salary) : "",
              });

              if (data.work_experience && Array.isArray(data.work_experience)) {
                setExperiences(data.work_experience.map((exp: any) => ({
                  industry: exp.industry || "",
                  position: exp.position || "",
                  company: exp.company || "",
                  startDate: exp.start_date ? exp.start_date.split('T')[0] : "",
                  endDate: exp.end_date ? exp.end_date.split('T')[0] : "",
                  currentWages: exp.current_wages ? String(exp.current_wages) : "",
                  noticePeriod: exp.salary_period || "",
                })));
              }

              if (data.education && Array.isArray(data.education)) {
                setEducationList(data.education.map((edu: any) => ({
                  degree: edu.degree || "",
                  university: edu.university || "",
                  passingYear: edu.passing_year || "",
                  grade: edu.grade || "",
                })));
              }

              if (data.skills && Array.isArray(data.skills)) {
                setSkillsList(data.skills.map((s: any) => ({
                  name: s.skill_name || "",
                  years: s.years_of_experience || "",
                  level: s.level || "",
                })));
              }

              setWorkType(data.experienced ? "experienced" : "fresher");
            }
          }
        }
      } catch (err) {
        console.error("Failed to load profile/india data", err);
      } finally {
        setFetching(false);
      }
    };
    loadData();
  }, [user?.id, user?.email, token, BACKEND_URL]);

  // Ensure email is always synced from session if not set from API
  useEffect(() => {
    if (user?.email && !form.email) {
      setForm(prev => ({ ...prev, email: user.email }));
      // Clear email error if we just synced it
      setErrors(prev => {
        const next = { ...prev };
        delete next.email;
        return next;
      });
    }
  }, [user?.email, form.email]);

  // Options memoization (kept same)
  const stateOptions = useMemo(() => {
    if (!indiaData) return [];
    return Object.keys(indiaData).map((s) => ({ label: s, value: s }));
  }, [indiaData]);

  const districtOptions = useMemo(() => {
    if (!indiaData || !form.state || !indiaData[form.state]) return [];
    return Object.keys(indiaData[form.state]).map((d) => ({ label: d, value: d }));
  }, [indiaData, form.state]);

  const talukaOptions = useMemo(() => {
    if (!indiaData || !form.state || !form.district || !indiaData[form.state][form.district]) return [];
    return Object.keys(indiaData[form.state][form.district]).map((t) => ({ label: t, value: t }));
  }, [indiaData, form.state, form.district]);

  const villageOptions = useMemo(() => {
    if (!indiaData || !form.state || !form.district || !form.taluka || !indiaData[form.state][form.district][form.taluka]) return [];
    return indiaData[form.state][form.district][form.taluka].map((v) => ({ label: v, value: v }));
  }, [indiaData, form.state, form.district, form.taluka]);

  const getExpCityOptions = (state: string) => {
    if (!indiaData || !state || !indiaData[state]) return [];
    return [...new Set(Object.values(indiaData[state]).flatMap(d => Object.keys(d)))].map(c => ({ label: c, value: c }));
  };

  const availabilityStateOptions = stateOptions;
  const availabilityCityOptions = useMemo(() => {
    if (!indiaData || !Array.isArray(form.availabilityState) || form.availabilityState.length === 0) return [];
    const cities = new Set<string>();
    form.availabilityState.forEach(s => {
      if (indiaData[s]) Object.values(indiaData[s]).forEach(d => Object.keys(d).forEach(c => cities.add(c)));
    });
    return Array.from(cities).map(c => ({ label: c, value: c }));
  }, [indiaData, form.availabilityState]);

  const scheduleValidate = (name: string, value: any) => {
    if (validateTimers.current[name]) clearTimeout(validateTimers.current[name]!);
    validateTimers.current[name] = setTimeout(() => {
      const err = validateFieldUtil(name, value, workType);
      setErrors(prev => {
        const next = { ...prev };
        if (err) next[name] = err;
        else delete next[name];
        return next;
      });
    }, 300);
  };

  const handleChange = (arg1: any, arg2?: any) => {
    let name: string;
    let value: any;

    if (arg1?.target) {
      name = arg1.target.name;
      value = arg1.target.type === "checkbox" ? arg1.target.checked : arg1.target.value;
    } else {
      name = arg1;
      value = arg2;
    }

    setTouched(prev => ({ ...prev, [name]: true }));

    // Special logic for dynamic lists
    if (name.includes("-")) {
      const parts = name.split("-");
      const index = parseInt(parts[parts.length - 1]);
      const field = parts.length > 2 ? parts[1] : parts[0];
      const prefix = parts.length > 2 ? parts[0] : "";

      if (prefix === "skill") {
        setSkillsList(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
      } else if (prefix === "cert") {
        setCertificationList(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
      } else if (["degree", "university", "passingYear", "grade"].includes(field)) {
        setEducationList(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
      } else {
        setExperiences(prev => prev.map((s, i) => i === index ? { ...s, [field]: value } : s));
      }
    } else {
      // Clear dependent fields if state changes in personal info
      if (name === "state") {
        setForm(prev => ({ ...prev, [name]: value, district: "", taluka: "", village: "" }));
      } else if (name === "district") {
        setForm(prev => ({ ...prev, [name]: value, taluka: "", village: "" }));
      } else if (name === "taluka") {
        setForm(prev => ({ ...prev, [name]: value, village: "" }));
      } else {
        setForm(prev => ({ ...prev, [name]: value }));
      }
    }

    scheduleValidate(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);

    const payload = {
      ...form,
      workType,
      experiences: workType === "fresher"
        ? []
        : experiences.filter(exp => exp.position.trim() || exp.company.trim() || exp.industry.trim()),
      educationList: educationList.filter(edu => edu.degree.trim() || edu.university.trim()),
      skillsList: skillsList.filter(s => s.name.trim()),
      phone: normalizeIndianPhone(form.phone)
    };

    console.log("Submit Payload:", payload);
    const vf = validateFormUtil(payload);
    if (!vf.isValid) {
      console.log("Validation Errors:", vf.errors);
      setErrors(vf.errors);
      message.error("Please fill all required fields correctly.");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const apiPayload = {
      full_name: form.firstName,
      surname: form.surName,
      email: form.email,
      mobile_number: form.phone.replace(/\D/g, "").slice(-10),
      gender: form.gender,
      marital_status: form.maritalStatus,
      alternate_mobile_number: form.alternateMobile?.replace(/\D/g, "") || "",
      date_of_birth: form.dob,
      address: form.address,
      state: form.state,
      district: form.district,
      city: form.taluka,
      village: form.village === "Other" ? form.otherVillage : form.village,
      country: "India",
      experienced: workType === "experienced",
      fresher: workType === "fresher",
      expected_salary: form.expectedSalary || "",
      job_category: form.availabilityJobCategory,
      interview_availability: form.availabilityCategory,
      pref_state: Array.isArray(form.availabilityState) ? form.availabilityState.join(", ") : "",
      pref_city: Array.isArray(form.availabilityCity) ? form.availabilityCity.join(", ") : "",
      summary: form.summary,
      pincode: form.pincode,
      work_experience: (workType === "experienced" ? experiences : [])
        .filter(exp => exp.position.trim() || exp.company.trim())
        .map(exp => ({
          position: exp.position,
          company: exp.company,
          start_date: exp.startDate || null,
          end_date: exp.endDate || null,
          salary_period: exp.noticePeriod || "",
          current_wages: exp.currentWages ? Number(exp.currentWages) : null,
          current_state: exp.currentState || "",
          current_city: exp.currentCity || "",
        })),
      education: educationList
        .filter(edu => edu.degree.trim() || edu.university.trim())
        .map(edu => ({
          degree: edu.degree,
          university: edu.university,
          passing_year: edu.passingYear,
          grade: edu.grade,
        })),
      skills: skillsList
        .filter(s => s.name.trim())
        .map(s => ({
          skill_name: s.name,
          years_of_experience: s.years || "",
          level: s.level || "",
        })),
      languages_known: form.languagesKnown,
    };

    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/candidate-profile/${user?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(apiPayload)
      });

      if (res.ok) {
        message.success("Profile updated successfully!");
        updateUserInfo({
          full_name: form.firstName,
        });
      } else {
        const text = await res.text();
        console.error("Profile update failed with status", res.status, text);
        try {
          const errData = JSON.parse(text);
          message.error(errData.message || "Failed to update profile");
        } catch {
          message.error(`Server error (${res.status}). Please check console for details.`);
        }
      }
    } catch (err) {
      console.error("Network error during profile update:", err);
      message.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  if (fetching) return <div className="flex justify-center items-center h-screen"><Spin size="large" /></div>;

  return (
    <>
      <div className="pl-2 pr-4 sm:px-2 py-2 flex gap-3 sm:gap-4 my-30 relative">
        <Sidebar type="candidate" mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <main className="flex-1 px-5 py-5 bg-white shadow rounded-lg space-y-8">
          <div className="border-b pb-4">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div className="flex gap-5 items-center ">
                <IoChevronForward onClick={() => setMobileOpen(true)} className="text-[white] text-2xl cursor-pointer md:hidden bg-black rounded-full p-1" />
                <h1 className="fontAL font-semibold capitalize text-xl md:text-2xl lg:text-3xl tracking-wider">My Profile</h1>
              </div>

              <nav aria-label="Breadcrumb" className="hidden sm:block text-sm text-gray-500">
                <ol className="flex items-center gap-2">
                  <li className="flex items-center gap-2"><Link href="/" className="hover:text-gray-700">Home</Link><FiChevronRight /></li>
                  <li className="flex items-center gap-2"><Link href="/candidates" className="hover:text-gray-700">Candidates</Link><FiChevronRight /></li>
                  <li><span className="text-gray-700 font-medium">Profile</span></li>
                </ol>
              </nav>
            </div>
          </div>

          {/* Profile */}
          <CandidateProfileHeader editable />


          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Personal Information */}
            <div className="bg-white p-6 border rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-6 border-b pb-3 flex items-center gap-2 text-[#72B76A]">
                <FaUser /> PERSONAL INFORMATION
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <InputBox label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
                <InputBox label="Last Name" name="surName" value={form.surName} onChange={handleChange} error={errors.surName} required />
                <InputBox label="Email" name="email" value={form.email} onChange={handleChange} error={errors.email} required disabled />
                <InputBox label="Phone" name="phone" value={form.phone} onChange={handleChange} error={errors.phone} required />
                <InputBox label="Alternate Mobile" name="alternateMobile" value={form.alternateMobile} onChange={handleChange} error={errors.alternateMobile} />
                <DatePicker label="Date of Birth" name="dob" value={form.dob} onChange={handleChange} error={errors.dob} required />
                <SearchableSelectBox label="Gender" name="gender" value={form.gender} options={[{ label: "Male", value: "Male" }, { label: "Female", value: "Female" }, { label: "Other", value: "Other" }]} onChange={handleChange} error={errors.gender} required />
                <SearchableSelectBox label="Marital Status" name="maritalStatus" value={form.maritalStatus} options={[{ label: "Single", value: "Single" }, { label: "Married", value: "Married" }, { label: "Divorced", value: "Divorced" }, { label: "Widowed", value: "Widowed" }]} onChange={handleChange} error={errors.maritalStatus} required />
                <SearchableSelectBox label="State" name="state" value={form.state} options={stateOptions} onChange={handleChange} error={errors.state} required />
                <SearchableSelectBox label="District" name="district" value={form.district} options={districtOptions} onChange={handleChange} error={errors.district} required />
                <SearchableSelectBox label="City/Taluka" name="taluka" value={form.taluka} options={talukaOptions} onChange={handleChange} error={errors.taluka} required />
                <SearchableSelectBox label="Village" name="village" value={form.village} options={[...villageOptions, { label: "Other", value: "Other" }]} onChange={handleChange} error={errors.village} />
                {form.village === "Other" && <InputBox label="Village Name" name="otherVillage" value={form.otherVillage} onChange={handleChange} error={errors.otherVillage} />}
                <InputBox label="Pincode" name="pincode" value={form.pincode} onChange={handleChange} error={errors.pincode} required />
                <div className="md:col-span-2">
                  <InputBox label="Full Address" name="address" value={form.address} onChange={handleChange} error={errors.address} required />
                </div>
                <MultiSelectBox label="Languages" name="languagesKnown" value={form.languagesKnown} options={INDIAN_LANGUAGES.map(l => l.value)} onChange={handleChange} error={errors.languagesKnown} />
              </div>
            </div>

            {/* Work Type Toggle */}
            <div className="flex gap-4 p-1 bg-gray-100 rounded-xl w-fit mx-auto">
              <button type="button" onClick={() => setWorkType("experienced")} className={`px-8 py-2 rounded-lg transition ${workType === "experienced" ? "bg-[#72B76A] text-white shadow" : "text-gray-600 hover:bg-gray-200"}`}>Experienced</button>
              <button type="button" onClick={() => setWorkType("fresher")} className={`px-8 py-2 rounded-lg transition ${workType === "fresher" ? "bg-[#72B76A] text-white shadow" : "text-gray-600 hover:bg-gray-200"}`}>Fresher</button>
            </div>

            {/* Work Experience */}
            {workType === "experienced" && (
              <div className="bg-white p-6 border rounded-xl shadow-sm">
                <h3 className="text-lg font-semibold mb-6 border-b pb-3 flex items-center gap-2 text-[#72B76A]">
                  <FaBriefcase /> WORK EXPERIENCE
                </h3>

                {experiences.map((exp, idx) => (
                  <div key={idx} className="mb-8 p-4 border rounded-lg relative bg-gray-50/50">
                    {idx > 0 && <button type="button" onClick={() => setExperiences(prev => prev.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-red-500 hover:scale-110 transition"><FiMinus size={20} /></button>}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <SearchableSelectBox label="Industry" name={`industry-${idx}`} value={exp.industry} options={INDUSTRY_OPTIONS} onChange={handleChange} error={errors[`industry-${idx}`]} required />
                      <InputBox label="Position" name={`position-${idx}`} value={exp.position} onChange={handleChange} error={errors[`position-${idx}`]} required />
                      <InputBox label="Company" name={`company-${idx}`} value={exp.company} onChange={handleChange} error={errors[`company-${idx}`]} required />
                      <DatePicker label="Start Date" name={`startDate-${idx}`} value={exp.startDate} onChange={handleChange} error={errors[`startDate-${idx}`]} required />
                      <DatePicker label="End Date" name={`endDate-${idx}`} value={exp.endDate} onChange={handleChange} error={errors[`endDate-${idx}`]} />
                      <InputBox label="Salary (Monthly)" name={`currentWages-${idx}`} value={exp.currentWages || ""} onChange={handleChange} error={errors[`currentWages-${idx}`]} />
                      <SearchableSelectBox label="Work State" name={`currentState-${idx}`} value={exp.currentState || ""} options={stateOptions} onChange={handleChange} error={errors[`currentState-${idx}`]} required />
                      <SearchableSelectBox label="Work City" name={`currentCity-${idx}`} value={exp.currentCity || ""} options={getExpCityOptions(exp.currentState || "")} onChange={handleChange} error={errors[`currentCity-${idx}`]} required />
                    </div>
                  </div>
                ))}

                <button type="button" onClick={() => setExperiences(prev => [...prev, { industry: "", position: "", company: "", noticePeriod: "", startDate: "", endDate: "", currentWages: "", currentState: "", currentCity: "", currentVillage: "", currentVillageOther: "" }])} className="flex items-center gap-2 text-[#72B76A] font-semibold hover:gap-3 transition-all"><FiPlus /> Add Experience</button>
              </div>
            )}

            {/* Education */}
            <div className="bg-white p-6 border rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-6 border-b pb-3 flex items-center gap-2 text-[#72B76A]">
                <FaGraduationCap /> EDUCATION
              </h3>

              {educationList.map((edu, idx) => (
                <div key={idx} className="mb-6 p-4 border rounded-lg relative bg-gray-50/50">
                  {idx > 0 && <button type="button" onClick={() => setEducationList(prev => prev.filter((_, i) => i !== idx))} className="absolute top-2 right-2 text-red-500"><FiMinus size={20} /></button>}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <InputBox label="Degree" name={`degree-${idx}`} value={edu.degree} onChange={handleChange} error={errors[`degree-${idx}`]} required />
                    <InputBox label="University" name={`university-${idx}`} value={edu.university} onChange={handleChange} error={errors[`university-${idx}`]} required />
                    <InputBox label="Year" name={`passingYear-${idx}`} value={edu.passingYear} onChange={handleChange} error={errors[`passingYear-${idx}`]} required />
                    <InputBox label="Grade" name={`grade-${idx}`} value={edu.grade} onChange={handleChange} />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => setEducationList(prev => [...prev, { degree: "", university: "", passingYear: "", grade: "" }])} className="flex items-center gap-2 text-[#72B76A] font-semibold"><FiPlus /> Add Education</button>
            </div>

            {/* Skills */}
            <div className="bg-white p-6 border rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-6 border-b pb-3 flex items-center gap-2 text-[#72B76A]">
                <IoChevronForward className="rotate-90" /> SKILLS
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillsList.map((skill, idx) => (
                  <div key={idx} className="flex gap-2 items-end">
                    <InputBox label="Skill Name" name={`skill-name-${idx}`} value={skill.name} onChange={handleChange} error={errors[`skill-name-${idx}`]} required />
                    <button type="button" onClick={() => setSkillsList(prev => prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev)} className="mb-2 p-2 text-red-400 hover:text-red-600"><FiMinus /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => setSkillsList(prev => [...prev, { name: "", years: "", level: "" }])} className="mt-4 flex items-center gap-2 text-[#72B76A] font-semibold"><FiPlus /> Add Skill</button>
            </div>

            {/* Preferences */}
            <div className="bg-white p-6 border rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold mb-6 border-b pb-3 flex items-center gap-2 text-[#72B76A]">
                <FaGlobe /> PREFERENCES & AVAILABILITY
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SearchableSelectBox label="Job Type" name="availabilityCategory" value={form.availabilityCategory} options={[{ label: "Full-Time", value: "Full-Time" }, { label: "Part-Time", value: "Part-Time" }, { label: "Contract", value: "Contract" }, { label: "Internship", value: "Internship" }]} onChange={handleChange} error={errors.availabilityCategory} required />
                <SearchableSelectBox label="Preferred Industry" name="availabilityIndustry" value={form.availabilityIndustry} options={INDUSTRY_OPTIONS} onChange={handleChange} error={errors.availabilityIndustry} required />
                <SearchableSelectBox label="Desired Role" name="availabilityJobCategory" value={form.availabilityJobCategory} options={Array.isArray(INDUSTRY_JOB_MAP[form.availabilityIndustry]) ? INDUSTRY_JOB_MAP[form.availabilityIndustry].map(j => ({ label: j, value: j })) : []} onChange={handleChange} error={errors.availabilityJobCategory} required allowCustomInput />
                <MultiSelectBox label="Preferred States" name="availabilityState" value={form.availabilityState} options={availabilityStateOptions.map(o => o.value)} onChange={handleChange} error={errors.availabilityState} required />
                <MultiSelectBox label="Preferred Cities" name="availabilityCity" value={form.availabilityCity} options={availabilityCityOptions.map(o => o.value)} onChange={handleChange} error={errors.availabilityCity} required />
                <InputBox label="Expected Salary" name="expectedSalary" value={form.expectedSalary} onChange={handleChange} error={errors.expectedSalary} required />
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Professional Summary</label>
                  <textarea
                    name="summary"
                    value={form.summary}
                    onChange={handleChange}
                    placeholder="Write a brief professional summary..."
                    rows={4}
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-[#72B76A] focus:outline-none transition group-hover:border-[#72B76A]"
                  />
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 mt-10">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="declarationChecked"
                  name="declarationChecked"
                  checked={form.declarationChecked}
                  onChange={handleChange}
                  className="mt-1 w-5 h-5 rounded border-gray-300 text-[#72B76A] focus:ring-[#72B76A] cursor-pointer"
                />
                <label htmlFor="declarationChecked" className="text-sm text-gray-700 leading-relaxed cursor-pointer">
                  I hereby declare that all the information provided in this profile is true and complete to the best of my knowledge and belief. I understand that any false statement may be grounds for rejection or termination.
                </label>
              </div>
              {errors.declarationChecked && (
                <p className="text-red-500 text-xs mt-2 ml-8 flex items-center gap-1">
                  <FaInfoCircle /> {errors.declarationChecked}
                </p>
              )}
            </div>

            {/* Save Button */}
            <div className="flex justify-center pt-10">
              <button type="submit" disabled={loading} className="relative px-12 h-14 overflow-hidden group border border-[#72B76A] bg-[#72B76A] rounded-2xl hover:bg-white text-white hover:text-[#72B76A] active:scale-95 transition-all duration-500 cursor-pointer shadow-lg hover:shadow-[#72B76A]/20">
                <span className="relative flex gap-3 items-center text-lg font-bold">
                  {loading ? <><span className="w-5 h-5 border-2 border-white group-hover:border-[#72B76A] rounded-full border-t-transparent animate-spin" /> Saving...</> : "Update My Profile"}
                </span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default Profile;

