"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  User,
  Search,
  Loader2,
  AlertTriangle,
  Copy,
  Check,
} from "lucide-react";

// NOTE: These API constants should match your project's configuration
const API_BASE = "https://moeys-exam-qbfys.ondigitalocean.app";
const MOCK_USERNAME = "Staff";
const MOCK_PASSWORD = "staffmoeysedtech2025";
const TOKEN_URL = `${API_BASE}/api/token/`;

// --- Constants (PROVINCES list - CRITICALLY CORRECTED MAPPING) ---
// Based on API response where province_ID: "1" corresponds to "ខេត្តបន្ទាយមានជ័យ"
const PROVINCES = [
    { id: "1", name: "ខេត្តភ្នំពេញ" },
    { id: "2", name: "ខេត្តបន្ទាយមានជ័យ" },
    { id: "3", name: "ខេត្តបាត់ដំបង" },
    { id: "4", name: "ខេត្តកំពង់ចាម" },
    { id: "5", name: "ខេត្តកំពង់ឆ្នាំង" },
    { id: "6", name: "ខេត្តកំពង់ស្ពី" },
    { id: "7", name: "ខេត្តកំពង់ធំ" },
    { id: "8", name: "ខេត្តកំពត" },
    { id: "9", name: "ខេត្តកណ្ដាល" },
    { id: "10", name: "ខេត្តកោះកុង" },
    { id: "11", name: "ខេត្តក្រចេះ" },
    { id: "12", name: "ខេត្តមណ្ឌលគិរី" },
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

// --- UI Components (Simplified) ---
const Card = ({ children, className = "" }: any) => (
  <div
    className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}
  >
    {children}
  </div>
);
const Button = ({
  children,
  onClick,
  className = "",
  disabled = false,
  ...props
}: any) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 ${className}`}
    disabled={disabled}
    type="button"
    {...props}
  >
    {children}
  </button>
);

const SelectFilter = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  loading = false,
}: any) => (
  <div className="relative w-full">
    <select
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
      className="w-full h-10 bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:bg-gray-100"
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
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5.293 7.293l4.5 4.5 4.5-4.5L15.707 8 10 13.707 4.293 8z" />
        </svg>
      )}
    </div>
    <label className="absolute top-[-8px] left-3 bg-white px-1 text-xs text-gray-400">
      {label}
    </label>
  </div>
);

// --- Main Component ---
export default function RegisterExamCodePage() {
  const router = useRouter();
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [examCode, setExamCode] = useState("");
  const [copied, setCopied] = useState(false);

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

  const selectedSchool = useMemo(
    () => schools.find((s) => s.id === selectedSchoolId),
    [schools, selectedSchoolId]
  );

  // --- Filter Reset Handlers (Unchanged) ---
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
    router.push("/provinces");
}, [router]);

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
    [getAccessToken]
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
      // Extract schools from the response
      const mappedSchools = data.map((s) => ({
        id: s.geip_school_ID,
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      {/* Navigation & Header */}
      <div className="max-w-6xl mx-auto flex justify-between sm:justify-start sm:gap-4 mb-8">
        <Link href="/welcome">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Home className="h-4 w-4 mr-2" />
            ទំព័រដើម
          </Button>
        </Link>
      </div>
      <header className="text-center mb-10 max-w-6xl mx-auto">
        <h1 className="text-4xl font-extrabold text-blue-800">
          ចុះឈ្មោះកូដប្រឡង
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          ជ្រើសរើសទីតាំងនិងសិស្សដើម្បីទាញយកកូដប្រឡង
        </p>
      </header>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* --- Student Selection (Left Card) --- */}
        <Card className="shadow-2xl p-6 bg-white">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-gray-700">
            <User className="h-5 w-5 text-blue-600" />
            ជ្រើសរើសសិស្សដើម្បីយកកូដ
          </h2>

          <div className="space-y-6">
            <SelectFilter
              label="ខេត្ត/ក្រុង"
              value={selectedProvinceId}
              onChange={(e: any) => handleProvinceChange(e.target.value)}
              options={PROVINCES.map((p) => ({ value: p.id, name: p.name }))}
            />

            <SelectFilter
              label="ស្រុក/ខណ្ឌ"
              value={selectedDistrict}
              onChange={(e: any) => handleDistrictChange(e.target.value)}
              options={districts}
              disabled={!selectedProvinceId}
              loading={loadingStep === "ស្រុក"}
            />

            <SelectFilter
              label="សាលារៀន"
              value={selectedSchoolId}
              onChange={(e: any) => handleSchoolChange(e.target.value)}
              options={schools.map((s) => ({ value: s.id, name: s.name }))}
              disabled={!selectedDistrict}
              loading={loadingStep === "សាលារៀន"}
            />

            <SelectFilter
              label="ថ្នាក់"
              value={selectedGrade}
              onChange={(e: any) => handleGradeChange(e.target.value)}
              options={grades}
              disabled={!selectedSchoolId}
              loading={loadingStep === "ថ្នាក់"}
            />

            {/* Student Name Selection */}
            <div className="relative pt-2">
              <label className="text-sm font-medium text-gray-700 block mb-1">
                ឈ្មោះសិស្ស
              </label>
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
                className="w-full h-10 border rounded-lg p-2 disabled:bg-gray-100"
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
            </div>
          </div>

          <Button
            onClick={handleGetExamCode}
            className="w-full mt-8 bg-green-600 hover:bg-green-700 text-white shadow-md"
            disabled={!selectedStudent || loadingStep === "ExamCode"}
          >
            {loadingStep === "ExamCode" ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            យកកូដប្រឡង
          </Button>
        </Card>

        {/* --- Exam Code Result (Right Card) --- */}
        <Card className="shadow-2xl p-6 bg-blue-50/70 border-blue-200">
          <h2 className="text-xl font-bold mb-5 flex items-center gap-2 text-blue-800">
            លទ្ធផលកូដប្រឡង
          </h2>

          {error && (
            <div className="bg-red-100 text-red-700 p-3 rounded-lg border border-red-200 mb-4 flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 text-red-500" />
              {error}
            </div>
          )}

          <div className="min-h-[250px] flex flex-col items-center justify-center p-4 border-2 border-dashed border-blue-300 bg-white rounded-xl shadow-inner">
            {loadingStep === "ExamCode" ? (
              <div className="text-center">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 font-semibold">កំពុងទាញយកកូដ...</p>
              </div>
            ) : examCode && examCode !== "Error" ? (
              <>
                <p className="text-gray-600 mb-4 text-lg">
                  សូមចម្លងកូដខាងក្រោម​ មុនពេលចាប់ផ្តើមប្រឡង៖
                </p>
                <div className="text-center bg-green-50 p-6 rounded-lg border border-green-200 w-full">
                  <p className="text-1xl font-mono font-extrabold text-green-700 tracking-wider select-all break-all">
                    {examCode}
                  </p>
                  <div className="flex gap-4 mt-4 justify-center">
                    <Button
                      onClick={copyToClipboard}
                      className="bg-blue-600 hover:bg-blue-700 "
                    >
                      {copied ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          បានចម្លងហើយ
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
              <p className="text-gray-500 text-center leading-relaxed">
                សូមអនុវត្តតាមជំហានពីឆ្វេងទៅស្ដាំ៖ ជ្រើសរើសខេត្ត ស្រុក សាលារៀន
                ថ្នាក់ <br />
                និងឈ្មោះសិស្ស ដើម្បីទទួលបានកូដប្រឡង។
              </p>
            )}
          </div>
          {/* Start Exam Button - Only visible after copying the code */}
          {copied && (
            <div className="max-w-6xl mx-auto mt-4  flex justify-center">
              <Button
                onClick={handleStartExam}
                className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg"
              >
                ចាប់ផ្តើមប្រឡងប្រឡង
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
