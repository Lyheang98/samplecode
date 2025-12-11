"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from 'next/image';
import { useRouter } from "next/navigation";
import {
  Home,
  User,
  Search,
  Loader2,
  AlertTriangle,
  Copy,
  Check,
  ArrowRight,
  ChevronDown,
  MapPin,
  School,
  Users,
  BookOpen,
  Sparkles,
  Award,
  ArrowLeft,
  Zap,
  FileText,
  CheckCircle,
} from "lucide-react";

// Import the utility to get the correct exam link
import { getExamLink } from "@/utils/examLinks";
import SubjectSelection from "@/components/SubjectSelection";

// NOTE: These API constants should match your project's configuration
const API_BASE = "https://moeys-exam-qbfys.ondigitalocean.app";
const MOCK_USERNAME = "Staff";
const MOCK_PASSWORD = "staffmoeysedtech2025";
const TOKEN_URL = `${API_BASE}/api/token/`;

// --- Constants (PROVINCES list - CRITICALLY CORRECTED MAPPING) ---
// Based on API response where province_ID: "1" corresponds to "ខេត្តបន្ទាយមានជ័យ"
const PROVINCES = [
  { id: "1", name: "ខេត្តបន្ទាយមានជ័យ" },
  { id: "2", name: "ខេត្តបាត់ដំបង" },
  { id: "3", name: "ខេត្តកំពង់ចាម" },
  { id: "4", name: "ខេត្តកំពង់ឆ្នាំង" },
  { id: "5", name: "ខេត្តកំពង់ស្ពឺ" },
  { id: "6", name: "ខេត្តកំពង់ធំ" },
  { id: "7", name: "ខេត្តកំពត" },
  { id: "8", name: "ខេត្តកណ្ដាល" },
  { id: "9", name: "ខេត្តកោះកុង" },
  { id: "10", name: "ខេត្តក្រចេះ" },
  { id: "11", name: "ខេត្តមណ្ឌលគិរី" },
  { id: "12", name: "រាជធានីភ្នំពេញ" },
  { id: "13", name: "ខេត្តព្រះវិហារ" },
  { id: "14", name: "ខេត្តព្រៃវែង" },
  { id: "15", name: "ខេត្តពោធិ៍សាត់" },
  { id: "16", name: "ខេត្តរតនគិរី" },
  { id: "17", name: "ខេត្តសៀមរាប" },
  { id: "18", name: "ខេត្តព្រះសីហនុ" },
  { id: "19", name: "ខេត្តស្ទឹងត្រែង" },
  { id: "20", name: "ខេត្តស្វាយរៀង" },
  { id: "21", name: "ខេត្តតាកែវ" },
  { id: "22", name: "ខេត្តឧត្តរមានជ័យ" },
  { id: "23", name: "ខេត្តកែប" },
  { id: "24", name: "ខេត្តប៉ៃលិន" },
  { id: "25", name: "ខេត្តត្បូងឃ្មុំ" },
];

// Define subjects for each grade
const SUBJECTS = {
  "7": [
    "ភាសាខ្មែរ",
    "គណិតវិទ្យា",
    "រូបវិទ្យា",
    "គីមីវិទ្យា",
    "ជីវវិទ្យា",
    "ប្រវត្តិវិទ្យា",
    "ភូមិវិទ្យា",
    "សីលធម៌-ពលរដ្ឋវិជ្ជា",
    "ផែនដីវិទ្យា",
    "អង់គ្លេស",
  ],
  "8": [
    "ភាសាខ្មែរ",
    "គណិតវិទ្យា",
    "រូបវិទ្យា",
    "គីមីវិទ្យា",
    "ជីវវិទ្យា",
    "ប្រវត្តិវិទ្យា",
    "ភូមិវិទ្យា",
    "សីលធម៌-ពលរដ្ឋវិជ្ជា",
    "ផែនដីវិទ្យា",
    "អង់គ្លេស",
  ],
  "9": [
    "ភាសាខ្មែរ",
    "គណិតវិទ្យា",
    "រូបវិទ្យា",
    "គីមីវិទ្យា",
    "ជីវវិទ្យា",
    "ប្រវត្តិវិទ្យា",
    "ភូមិវិទ្យា",
    "សីលធម៌-ពលរដ្ឋវិជ្ជា",
    "ផែនដីវិទ្យា",
    "អង់គ្លេស",
  ],
  "10": [
    "ភាសាខ្មែរ",
    "គណិតវិទ្យា",
    "រូបវិទ្យា",
    "គីមីវិទ្យា",
    "ជីវវិទ្យា",
    "ប្រវត្តិវិទ្យា",
    "ភូមិវិទ្យា",
    "សីលធម៌-ពលរដ្ឋវិជ្ជា",
    "ផែនដីវិទ្យា",
    "អង់គ្លេស",
  ],
  "11": [
    "ភាសាខ្មែរ",
    "គណិតវិទ្យា",
    "រូបវិទ្យា",
    "គីមីវិទ្យា",
    "ជីវវិទ្យា",
    "ប្រវត្តិវិទ្យា",
    "ភូមិវិទ្យា",
    "សីលធម៌-ពលរដ្ឋវិជ្ជា",
    "ផែនដីវិទ្យា",
    "អង់គ្លេស",
  ],
  "12": [
    "ភាសាខ្មែរ",
    "គណិតវិទ្យា",
    "រូបវិទ្យា",
    "គីមីវិទ្យា",
    "ជីវិទ្យា",
    "ប្រវត្តិវិទ្យា",
    "ភូមិវិទ្យា",
    "សីលធម៌-ពលរដ្ឋវិជ្ជា",
    "ផែនដីវិទ្យា",
    "អង់គ្លេស",
  ],
};

// --- UI Components (Modern and Compact) ---
const Card = ({ children, className = "", variant = "default" }: any) => {
  const variants = {
    default: "bg-white border border-purple-100 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden",
    gradient: "relative overflow-hidden shadow-2xl",
    glass: "bg-white/90 backdrop-blur-md border border-purple-100 shadow-xl",
    success: "relative overflow-hidden shadow-2xl",
  };

  return (
    <div
      className={`rounded-3xl ${variants[variant as keyof typeof variants]} ${className}`}
    >
      {variant === "gradient" && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600" />
      )}
      {variant === "success" && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-700 " />
      )}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

const Button = ({
  children,
  onClick,
  className = "",
  disabled = false,
  variant = "primary",
  ...props
}: any) => {
  const baseClasses = "inline-flex items-center justify-center rounded-2xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-11 px-6 py-2 relative overflow-hidden group";

  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 transition-all",
    secondary: "bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
    success: "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    ghost: "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200",
    back: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]} ${className}`}
      disabled={disabled}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

const SelectFilter = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  loading = false,
  icon,
}: any) => (
  <div className="relative w-full">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
      {icon}
    </div>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
      className="w-full h-11 bg-white border border-purple-200 text-gray-700 py-2 pl-10 pr-8 rounded-2xl text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:bg-purple-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm hover:shadow-md"
    >
      <option value="">{loading ? `កំពុងផ្ទុក ${label}...` : label}</option>
      {options.map((opt: any) => {
        const optValue =
          typeof opt === "object" ? opt.value || opt.id || opt.name : opt;
        const optName = typeof opt === "object" ? opt.name || opt : opt;
        return (
          <option key={optValue} value={optValue}>
            {optName}
          </option>
        );
      })}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400 z-10">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </div>
  </div>
);

// --- Main Component ---
export default function RegisterExamCodePage() {
  const router = useRouter();
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [examCode, setExamCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Add state to track current step (code generation or subject selection)
  const [currentStep, setCurrentStep] = useState<"code" | "subject">("code");

  // Filter states
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Data options states
  const [districts, setDistricts] = useState<string[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const selectedSchool = useMemo(
    () => schools.find((s) => s.id === selectedSchoolId),
    [schools, selectedSchoolId]
  );

  // --- FIX: Define getAccessToken FIRST ---
  // Utility function to get access token
  const getAccessToken = useCallback(async () => {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: MOCK_USERNAME,
        password: MOCK_PASSWORD,
      }),
    });
    if (!res.ok) throw new Error("Failed to get token");
    const data = await res.json();
    return data.access;
  }, []);

  // --- CORE FIX: Recursive Pagination Function ---
  /**
   * Recursive function to fetch ALL data by following the 'next' pagination links.
   * @param url The current API URL (initial or 'next' URL).
   * @param stepName The name of the step for loading indicators.
   * @param accumulatedData Array to hold data from all pages.
   * @returns A promise resolving to the complete data array.
   */
  const fetchPaginatedData = useCallback(
    async (
      url: string,
      stepName: string,
      accumulatedData: any[] = []
    ): Promise<any[]> => {
      const token = await getAccessToken();

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 404) {
        // Treat 404 as end of data or no results
        return accumulatedData;
      }
      if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);

      const json = await res.json();
      // The data is always in the 'results' array based on your example response body
      const currentPageData = Array.isArray(json) ? json : json.results || [];
      const nextUrl = json.next;

      const newData = accumulatedData.concat(currentPageData);

      if (nextUrl) {
        // Recursively call for the next page using the full URL from 'next' field
        return fetchPaginatedData(nextUrl, stepName, newData);
      } else {
        // No more pages, return all collected data
        return newData;
      }
    },
    [getAccessToken] // Now getAccessToken is defined and available
  );

  /**
   * Wrapper function to handle the entire fetching process including loading and error state.
   */
  const fetchAllDataAndSet = useCallback(
    async (endpoint: string, setter: (data: any) => void, stepName: string) => {
      if (!endpoint) return;
      setLoadingStep(stepName);
      setError(null);
      try {
        // Start the recursive fetch from the base endpoint
        const allData = await fetchPaginatedData(endpoint, stepName);
        setter(allData);
      } catch (err: any) {
        setError(`បរាជ័យក្នុងការផ្ទុក ${stepName}: ${err.message}`);
        // Force reset dependent lists on error
        if (stepName === "ស្រុក") {
          setDistricts([]);
        }
        if (stepName === "សាលារៀន") {
          setSchools([]);
        }
        if (stepName === "ថ្នាក់") {
          setGrades([]);
        }
        setStudents([]); // Reset students on any preceding failure
      } finally {
        setLoadingStep(null);
      }
    },
    [fetchPaginatedData, setDistricts, setSchools, setGrades]
  );

  // --- Filter Reset Handlers ---
  const handleProvinceChange = (id: string) => {
    setSelectedProvinceId(id);
    setSelectedDistrict("");
    setSelectedSchoolId("");
    setSelectedGrade("");
    setSelectedStudent(null);
    setDistricts([]);
    setSchools([]);
    setGrades([]);
    setStudents([]);
    setExamCode("");
    setCopied(false);
  };

  const handleDistrictChange = (name: string) => {
    setSelectedDistrict(name);
    setSelectedSchoolId("");
    setSelectedGrade("");
    setSelectedStudent(null);
    setSchools([]);
    setGrades([]);
    setStudents([]);
    setExamCode("");
    setCopied(false);
  };

  const handleSchoolChange = (id: string) => {
    setSelectedSchoolId(id);
    setSelectedGrade("");
    setSelectedStudent(null);
    setGrades([]);
    setStudents([]);
    setExamCode("");
    setCopied(false);
  };

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    setSelectedStudent(null);
    setStudents([]);
    setExamCode("");
    setCopied(false);
  };

  // --- Copy to clipboard function ---
  const copyToClipboard = useCallback(() => {
    if (examCode) {
      navigator.clipboard.writeText(examCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000); // Reset copied state after 3 seconds
    }
  }, [examCode]);

  // --- Start Exam function ---
  const handleStartExam = useCallback(() => {
    if (!examCode || examCode === "Error") {
      setError("សូមទាញយកកូដប្រឡងជាមុនសិន");
      return;
    }

    // Add transition effect
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep("subject");
      setIsTransitioning(false);
    }, 500);
  }, [examCode]);

  // --- Back to code generation ---
  const handleBackToCode = useCallback(() => {
    setCurrentStep("code");
  }, []);

  // --- Get Exam Code Handler (NEW API 5 - Single Call) ---
  const handleGetExamCode = useCallback(async () => {
    if (
      !selectedStudent ||
      !selectedProvinceId ||
      !selectedDistrict ||
      !selectedSchoolId ||
      !selectedGrade
    )
      return;

    setLoadingStep("ExamCode");
    setExamCode("");
    setError(null);
    setCopied(false);

    try {
      // Use the student's last_name and first_name fields from the fetched record
      const { last_name, first_name } = selectedStudent;

      // NEW API 5: Updated to new API endpoint with the additional path segment
      const endpoint = `${API_BASE}/api/Base/data/v1/api/generate/v1/code/${selectedProvinceId}/${encodeURIComponent(
        selectedDistrict
      )}/${selectedSchoolId}/${selectedGrade}/${encodeURIComponent(
        last_name
      )}/${encodeURIComponent(first_name)}`;

      const token = await getAccessToken();
      const res = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);

      // Parse the response to extract the exam code
      let examCodeResult;
      try {
        const jsonResponse = await res.json();
        examCodeResult = jsonResponse.exam_code;
      } catch (e) {
        // If parsing fails, try to get it as text
        examCodeResult = await res.text();
      }

      setExamCode(examCodeResult || "N/A");
    } catch (err: any) {
      setError(`បរាជ័យក្នុងការទាញយកកូដប្រឡង: ${err.message}`);
      setExamCode("Error");
    } finally {
      setLoadingStep(null);
    }
  }, [
    selectedStudent,
    selectedProvinceId,
    selectedDistrict,
    selectedSchoolId,
    selectedGrade,
    getAccessToken,
  ]);

  // --- useEffect Hooks ---
  // 1. Fetch Districts (NEW API 1)
  useEffect(() => {
    if (!selectedProvinceId) return;

    // Updated to new API endpoint with the additional path segment
    const endpoint = `${API_BASE}/api/Base/data/v1/api/lookup/v1/district/${selectedProvinceId}/`;

    const districtSetter = (data: any[]) => {
      // Extract district names from the response
      const districtNames = data.map((d) => d.district_name).filter(Boolean);
      setDistricts(districtNames);
    };

    fetchAllDataAndSet(endpoint, districtSetter, "ស្រុក");
  }, [selectedProvinceId, fetchAllDataAndSet]);

  // 2. Fetch Schools (NEW API 2)
  useEffect(() => {
    if (!selectedProvinceId || !selectedDistrict) return;

    const encodedDistrict = encodeURIComponent(selectedDistrict);
    // Updated to new API endpoint with the additional path segment
    const endpoint = `${API_BASE}/api/Base/data/v1/api/lookup/v1/school/${selectedProvinceId}/${encodedDistrict}/`;

    const schoolSetter = (data: any[]) => {
      // --- FIX: Corrected the school ID field to match the API response ---
      const mappedSchools = data.map((s) => ({
        id: s.geip_school_ID, // Corrected from geip to geip
        name: s.school_name,
      }));

      setSchools(mappedSchools);
      setSelectedSchoolId("");
    };

    fetchAllDataAndSet(endpoint, schoolSetter, "សាលារៀន");
  }, [selectedProvinceId, selectedDistrict, fetchAllDataAndSet]);

  // 3. Fetch Grades (NEW API 3)
  useEffect(() => {
    if (!selectedProvinceId || !selectedDistrict || !selectedSchoolId) return;

    const encodedDistrict = encodeURIComponent(selectedDistrict);
    // Updated to new API endpoint with the additional path segment
    const endpoint = `${API_BASE}/api/Base/data/v1/api/lookup/v1/grade/${selectedProvinceId}/${encodedDistrict}/${selectedSchoolId}/`;

    const gradeSetter = (data: any[]) => {
      // Extract grades from the response
      const gradeOptions = data
        .map((g) => String(g.grade || ""))
        .filter(Boolean);
      setGrades(gradeOptions);
      setSelectedGrade("");
    };
    fetchAllDataAndSet(endpoint, gradeSetter, "ថ្នាក់");
  }, [
    selectedProvinceId,
    selectedDistrict,
    selectedSchoolId,
    fetchAllDataAndSet,
  ]);

  // 4. Fetch Students (NEW API 4)
  useEffect(() => {
    if (
      !selectedProvinceId ||
      !selectedDistrict ||
      !selectedSchoolId ||
      !selectedGrade
    ) {
      setStudents([]);
      return;
    }

    const encodedDistrict = encodeURIComponent(selectedDistrict);
    // Updated to new API endpoint with the additional path segment
    const endpoint = `${API_BASE}/api/Base/data/v1/api/lookup/v1/student/${selectedProvinceId}/${encodedDistrict}/${selectedSchoolId}/${selectedGrade}/`;

    const studentSetter = (data: any[]) => {
      const mappedStudents = data.map((s) => ({
        ...s,
        id: s.student_ID || `${s.last_name}${s.first_name}${s.grade}`,
        fullName: `${s.last_name || ""} ${s.first_name || ""}`.trim(),
      }));
      setStudents(mappedStudents);
      setSelectedStudent(null);
    };
    // This is necessary because API 4 also returns a paginated list of students
    fetchAllDataAndSet(endpoint, studentSetter, `សិស្សថ្នាក់ ${selectedGrade}`);
  }, [
    selectedProvinceId,
    selectedDistrict,
    selectedSchoolId,
    selectedGrade,
    fetchAllDataAndSet,
  ]);

  const studentOptions = students;

  return (
    <div className="min-h-screen relative">
      {/* White Background with 5% Purple Overlay */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-purple-600/[0.05]" />

      {/* Transition Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full mb-4 shadow-2xl">
              <CheckCircle className="h-12 w-12 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ការដាក់របាយល្អ!
            </h2>
            <p className="text-gray-600">
              កំពុងប្តូទៅទំព័រជ្រើសរើសមុខវិជ្ជា...
            </p>
            <div className="mt-4">
              <Loader2 className="h-8 w-8 text-green-600 animate-spin mx-auto" />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Navigation & Header */}
        <div className="max-w-5xl mx-auto flex md:justify-between justify-between sm:justify-start sm:gap-4 mb-6">
          <Button onClick={handleBackToCode} variant="back">
            <ArrowLeft className="h-4 w-4 mr-2" />
            ត្រឡប់
          </Button>
          <Link href="/welcome">
            <Button className="bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 shadow-lg">
              <Home className="h-4 w-4 mr-2" />
              ទំព័រដើម
            </Button>
          </Link>
        </div>

        <header className="text-center mb-8 max-w-5xl mx-auto">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600 rounded-full mb-4 shadow-2xl">
              <Image src="/moeys-logo.png" alt="MoEYS Logo" width={64} height={64} className="h-16 w-16" />
          </div>
          <h1 className="text-3xl p-4 font-bold bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-700 bg-clip-text text-transparent">
            {currentStep === "code"
              ? "សូមបំពេញព័ត៍មានដើម្បីបានកូដប្រឡង"
              : "ជ្រើសរើសមុខវិជ្ជាប្រឡង"}
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            {currentStep === "code"
              ? "ជ្រើសរើសទីតាំងនិងសិស្សដើម្បីទាញយកកូដប្រឡង"
              : "ជ្រើសរើសមុខវិជ្ជាដើម្បីចូលរួមប្រឡង"}
          </p>
        </header>

        <div className="max-w-5xl mx-auto">
          {currentStep === "code" ? (
            // Code Generation Step
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* --- Student Selection (Left Card) --- */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    បំពេញព័ត៍មានផ្ទាល់ខ្លួន
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
                      ខេត្ត/ក្រុង
                    </label>
                    <SelectFilter
                      label=""
                      value={selectedProvinceId}
                      onChange={(e: any) => handleProvinceChange(e.target.value)}
                      options={PROVINCES.map((p) => ({
                        value: p.id,
                        name: p.name,
                      }))}
                      icon={<MapPin className="h-4 w-4 text-purple-500" />}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
                      ស្រុក/ខណ្ឌ
                    </label>
                    <SelectFilter
                      label=""
                      value={selectedDistrict}
                      onChange={(e: any) => handleDistrictChange(e.target.value)}
                      options={districts}
                      disabled={!selectedProvinceId}
                      loading={loadingStep === "ស្រុក"}
                      icon={<MapPin className="h-4 w-4 text-purple-500" />}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
                      សាលារៀន
                    </label>
                    <SelectFilter
                      label=""
                      value={selectedSchoolId}
                      onChange={(e: any) => handleSchoolChange(e.target.value)}
                      options={schools.map((s) => ({ value: s.id, name: s.name }))}
                      disabled={!selectedDistrict}
                      loading={loadingStep === "សាលារៀន"}
                      icon={<School className="h-4 w-4 text-purple-500" />}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
                      ថ្នាក់
                    </label>
                    <SelectFilter
                      label=""
                      value={selectedGrade}
                      onChange={(e: any) => handleGradeChange(e.target.value)}
                      options={grades}
                      disabled={!selectedSchoolId}
                      loading={loadingStep === "ថ្នាក់"}
                      icon={<BookOpen className="h-4 w-4 text-purple-500" />}
                    />
                  </div>

                  {/* Student Name Selection */}
                  <div>
                    <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
                      ឈ្មោះសិស្ស
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                        <Users className="h-4 w-4 text-purple-500" />
                      </div>
                      <select
                        value={selectedStudent?.id || ""}
                        onChange={(e) => {
                          const student = studentOptions.find(
                            (s) => s.id === e.target.value
                          );
                          setSelectedStudent(student || null);
                          setExamCode("");
                          setCopied(false);
                        }}
                        disabled={
                          !selectedGrade ||
                          loadingStep === `សិស្សថ្នាក់ ${selectedGrade}` ||
                          studentOptions.length === 0
                        }
                        className="w-full h-11 bg-white border border-purple-200 text-gray-700 py-2 pl-10 pr-8 rounded-2xl text-sm appearance-none cursor-pointer disabled:bg-purple-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm hover:shadow-md"
                      >
                        <option value="">
                          {loadingStep === `សិស្សថ្នាក់ ${selectedGrade}`
                            ? "កំពុងផ្ទុកសិស្ស..."
                            : studentOptions.length > 0
                              ? "ជ្រើសរើសឈ្មោះសិស្ស"
                              : "មិនមានសិស្សក្នុងថ្នាក់នេះ"}
                        </option>
                        {studentOptions.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.fullName} ({s.student_ID || "N/A"})
                          </option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400 z-10">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGetExamCode}
                  className="w-full mt-6 text-base from-blue-500 via-sky-500 to-cyan-600"
                  disabled={!selectedStudent || loadingStep === "ExamCode"}
                >
                  {loadingStep === "ExamCode" ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5 mr-2" />
                  )}
                  យកកូដប្រឡង
                </Button>
              </Card>

              {/* --- Exam Code Result (Right Card) --- */}
              <Card variant="success" className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-blue-400 shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    លទ្ធផលកូដប្រឡង
                  </h2>
                </div>

                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm text-white p-4 rounded-2xl border border-red-400/30 mb-4 flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 text-yellow-300" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="min-h-[220px] flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/40 bg-white/10 backdrop-blur-sm rounded-2xl">
                  {loadingStep === "ExamCode" ? (
                    <div className="text-center">
                      <Loader2 className="h-10 w-10 text-white animate-spin mx-auto mb-4" />
                      <p className="text-white/90 text-base font-semibold">
                        កំពុងទាញយកកូដ...
                      </p>
                    </div>
                  ) : examCode && examCode !== "Error" ? (
                    <>
                      <p className="text-white/90 mb-4 text-base">
                        សូមចម្លងកូដខាងក្រោម​ មុនពេលចាប់ផ្តើមប្រឡង៖
                      </p>
                      <div className="text-center bg-white/20 backdrop-blur-sm p-5 rounded-2xl border border-white/30 w-full">
                        <p className="text-xl font-mono font-bold text-white tracking-wider select-all break-all">
                          {examCode}
                        </p>
                        <div className="flex gap-3 mt-4 justify-center">
                          <Button
                            onClick={copyToClipboard}
                            variant="ghost"
                            className="bg-blue-800 backdrop-blur-sm text-gray-100 border border-blue-400 shadow-lg hover:bg-yellow-600"
                          >
                            {copied ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                បានចម្លង
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-2" />
                                ចម្លងកូដ
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p className="text-white text-center  text-1xl leading-relaxed">
                      សូមអនុវត្តតាមជំហានពីឆ្វេងទៅស្ដាំ៖ ជ្រើសរើសខេត្ត ស្រុក
                      សាលារៀន ថ្នាក់
                      និងឈ្មោះសិស្ស ដើម្បីទទួលបានកូដប្រឡង។
                    </p>
                  )}
                </div>

                {/* Start Exam Button - Only visible after copying the code */}
                {copied && (
                  <div className="mt-5 flex justify-center">
                    <Button
                      onClick={handleStartExam}
                      className="bg-white text-green-700 hover:bg-green-50 shadow-2xl text-base"
                    >
                      ជ្រើសរើសមុខវិជ្ជា
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            // Subject Selection Step
            <div>
              <SubjectSelection
                selectedStudent={selectedStudent}
                selectedSchool={selectedSchool}
                selectedGrade={selectedGrade}
                selectedProvinceId={selectedProvinceId}
                examCode={examCode}
                SUBJECTS={SUBJECTS}
                PROVINCES={PROVINCES}
                handleBackToCode={handleBackToCode}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}