// src/app/results/[province]/total-results/page.ts
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  Search,
  RefreshCw,
  ArrowLeft,
  Home,
  X,
  Filter,
  FileDown,
  BookOpen,
  Target,
  TrendingUp,
} from "lucide-react";
import { API_BASE, MOCK_USERNAME, MOCK_PASSWORD } from "../../../../../api/api.js";

// --- UI Components ---
const Card = ({ className = "", children }) => (
  <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}>
    {children}
  </div>
);
const CardContent = ({ className = "", children }) => (
  <div className={`p-6 ${className}`}>{children}</div>
);
const CardHeader = ({ className = "", children }) => (
  <div className={`p-6 pb-3 ${className}`}>{children}</div>
);
const CardTitle = ({ className = "", children }) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);
const Button = ({
  children,
  onClick,
  className = "",
  variant = "default",
  size = "default",
  disabled = false,
}) => {
  let baseStyles =
    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

  if (size === "sm") baseStyles += " h-9 px-3 text-xs";
  else baseStyles += " h-10 px-4 py-2";

  if (variant === "default") baseStyles += " bg-blue-600 text-white hover:bg-blue-700";
  else if (variant === "outline")
    baseStyles += " border border-input bg-background hover:bg-accent hover:text-accent-foreground";
  else if (variant === "ghost")
    baseStyles += " hover:bg-accent hover:text-accent-foreground";

  if (className.includes("bg-green-500") || className.includes("bg-red-500") || className.includes("bg-indigo-600") || className.includes("bg-purple-600")) {
    baseStyles = baseStyles.replace(/bg-blue-600/, "").replace(/hover:bg-blue-700/, "");
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${className}`}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};
const Input = ({
  className = "",
  type = "text",
  placeholder = "",
  value,
  onChange,
  onKeyDown,
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    className={`flex h-10 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  />
);

// --- Constants ---
const TOKEN_URL = `${API_BASE}/api/token/`;
const MONTH_NAME_TO_INT = {
  មករា: 1, កុម្ភៈ: 2, មីនា: 3, មេសា: 4, ឧសភា: 5, មិថុនា: 6,
  កក្កដា: 7, សីហា: 8, កញ្ញា: 9, តុលា: 10, វិច្ឆិកា: 11, ធ្នូ: 12,
};

const decodeProvinceName = (slug: string | string[] | undefined) => {
  if (!slug) return "";
  const value = Array.isArray(slug) ? slug[slug.length - 1] : slug;
  return decodeURIComponent(value);
};

const toIntegerScore = (scoreStr: any) => {
  if (typeof scoreStr === "string") {
    const cleaned = scoreStr.split(".")[0];
    return parseInt(cleaned, 10) || 0;
  }
  return Math.floor(Number(scoreStr)) || 0;
};

export default function TestResultPage() {
  const params = useParams();
  const router = useRouter();
  const province_name = useMemo(() => decodeProvinceName(params?.province), [params?.province]);

  // States
  const [subjectResults, setSubjectResults] = useState<any[]>([]);
  const [filteredResults, setFilteredResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokenRetries, setTokenRetries] = useState(0);
  const [searchValue, setSearchValue] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("ធ្នូ");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const yearfilterOptions = ["2025", "2026", "2027"];
  const monthfilterOptions = [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
  ];
  const rowsPerPageOptions = [10, 20, 30, 40, 50, 100, "all"];
  const ALL_DATA_VALUE = "all";

  // Get access token with retry logic
  const getAccessToken = useCallback(async () => {
    try {
      const res = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: MOCK_USERNAME, password: MOCK_PASSWORD }),
        credentials: "omit",
        cache: "no-store",
      });

      if (!res.ok) {
        if (tokenRetries < 1) {
          setTokenRetries(prev => prev + 1);
          await new Promise(resolve => setTimeout(resolve, 1000));
          return getAccessToken();
        }
        throw new Error(`Failed to get token: ${res.status}`);
      }

      setTokenRetries(0);
      const data = await res.json();
      return data.access;
    } catch (err) {
      if (tokenRetries < 1) {
        setTokenRetries(prev => prev + 1);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return getAccessToken();
      }
      throw err;
    }
  }, [tokenRetries]);

  // Generate mock data for demonstration
  const generateMockData = useCallback(() => {
    const subjects = ["គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ប្រវត្តិវិទ្យា", "ភូមិវិទ្យា", "ភាសាខ្មែរ", "ភាសាអង់គ្លេស"];
    const grades = ["ថ្នាក់ទី៧", "ថ្នាក់ទី៨", "ថ្នាក់ទី៩", "ថ្នាក់ទី១០", "ថ្នាក់ទី១១", "ថ្នាក់ទី១២"];
    const mockData = [];
    
    for (let i = 0; i < 100; i++) {
      const studentId = `STU${String(i + 1).padStart(4, '0')}`;
      const firstName = `និស្ស${i + 1}`;
      const lastName = `គឹម`;
      const subject = subjects[Math.floor(Math.random() * subjects.length)];
      const grade = grades[Math.floor(Math.random() * grades.length)];
      const score = Math.floor(Math.random() * 100);
      const maxScore = 100;
      const percentage = (score / maxScore * 100).toFixed(2);
      const gradeLetter = score >= 90 ? 'A' : score >= 80 ? 'B' : score >= 70 ? 'C' : score >= 60 ? 'D' : 'F';
      
      mockData.push({
        id: `${studentId}${subject}`,
        student_id: studentId,
        full_name: `${lastName} ${firstName}`,
        subject_code: subject.substring(0, 3).toUpperCase(),
        subject_name: subject,
        subject_kh: subject,
        grade: grade,
        score: score,
        max_score: maxScore,
        percentage: percentage,
        grade_letter: gradeLetter,
        school: `សាលារៀន ${Math.floor(Math.random() * 10) + 1}`,
        district: `ស្រុក ${Math.floor(Math.random() * 5) + 1}`,
        exam_year: selectedYear,
        exam_month: MONTH_NAME_TO_INT[selectedMonth],
      });
    }
    
    return mockData;
  }, [selectedYear, selectedMonth]);

  // Fetch subject results data
  const fetchSubjectResults = useCallback(async () => {
    if (!province_name) return;
    setLoading(true);
    setError("");

    // Use mock data for demonstration since API might not exist yet
    if (true) { // Set to false when real API is available
      const mockData = generateMockData();
      setSubjectResults(mockData);
      setLoading(false);
      return;
    }

    const url = `${API_BASE}/api/v1/result/subject-results/${encodeURIComponent(province_name)}/?year=${selectedYear}&month=${MONTH_NAME_TO_INT[selectedMonth]}`;
    console.log("Fetching subject results →", url);

    try {
      const token = await getAccessToken();
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "omit",
        cache: "no-store",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API ${res.status}: ${txt || res.statusText}`);
      }

      const data = await res.json();
      const rawData = Array.isArray(data) ? data : data.results || data.data || [];
      
      const mapped = rawData.map((r: any) => ({
        id: `${r.student_ID || ""}${r.subject_code || ""}`,
        student_id: r.student_ID || "",
        full_name: `${r.last_name || ""} ${r.first_name || ""}`.trim(),
        subject_code: r.subject_code || "",
        subject_name: r.subject_name || "",
        subject_kh: r.subject_kh || "",
        grade: r.grade || "",
        score: toIntegerScore(r.score ?? 0),
        max_score: toIntegerScore(r.max_score ?? 100),
        percentage: parseFloat(r.percentage || "0").toFixed(2),
        grade_letter: r.grade_letter || "",
        school: r.school_name || "",
        district: r.district_name || "",
        exam_year: r.exam_year || selectedYear,
        exam_month: r.exam_month || MONTH_NAME_TO_INT[selectedMonth],
      }));

      setSubjectResults(mapped);
    } catch (err: any) {
      setError(`បរាជ័យក្នុងការផ្ទុកទិន្នន័យ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [province_name, selectedYear, selectedMonth, getAccessToken, generateMockData]);

  // Filter results
  useEffect(() => {
    let tempFiltered = subjectResults;

    if (selectedSubject) {
      tempFiltered = tempFiltered.filter(r => r.subject_kh === selectedSubject);
    }
    if (selectedGrade) {
      tempFiltered = tempFiltered.filter(r => r.grade === selectedGrade);
    }
    if (searchValue.trim()) {
      const val = searchValue.trim().toLowerCase();
      tempFiltered = tempFiltered.filter(
        (r) =>
          r.full_name.toLowerCase().includes(val) ||
          r.student_id.includes(val) ||
          r.school.toLowerCase().includes(val) ||
          r.subject_name.toLowerCase().includes(val) ||
          r.subject_kh.toLowerCase().includes(val)
      );
    }

    setFilteredResults(tempFiltered);
    setCurrentPage(1);
  }, [subjectResults, selectedSubject, selectedGrade, searchValue]);

  // Fetch data when component mounts or filters change
  useEffect(() => {
    if (province_name) {
      fetchSubjectResults();
    }
  }, [province_name, fetchSubjectResults]);

  // Get unique subjects and grades for filters
  const subjectOptions = useMemo(() => {
    const subjects = [...new Set(subjectResults.map(r => r.subject_kh).filter(Boolean))];
    return subjects.sort();
  }, [subjectResults]);

  const gradeOptions = useMemo(() => {
    const grades = [...new Set(subjectResults.map(r => r.grade).filter(Boolean))];
    return grades.sort();
  }, [subjectResults]);

  // Handle download
  const handleDownloadCSV = () => {
    const headers = [
      "Student ID", "Full Name", "Subject (KH)", "Subject (EN)", "Grade", "Score", "Max Score", 
      "Percentage", "Grade Letter", "School", "District", "Year", "Month"
    ];
    const rows = filteredResults.map(r => [
      r.student_id, r.full_name, r.subject_kh, r.subject_name, r.grade, r.score, r.max_score,
      r.percentage, r.grade_letter, r.school, r.district, r.exam_year, r.exam_month
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${province_name}_subject_results_${selectedYear}_${selectedMonth}.csv`;
    link.click();
  };

  // Pagination
  const totalPages = rowsPerPage === ALL_DATA_VALUE ? 1 : Math.max(1, Math.ceil(filteredResults.length / rowsPerPage));
  const paginated = useMemo(() => {
    if (rowsPerPage === ALL_DATA_VALUE) return filteredResults;
    const start = (currentPage - 1) * rowsPerPage;
    return filteredResults.slice(start, start + rowsPerPage);
  }, [filteredResults, currentPage, rowsPerPage]);

  const displayStart = filteredResults.length ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const displayEnd = filteredResults.length ? Math.min(currentPage * rowsPerPage, filteredResults.length) : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-xl font-semibold text-gray-700 mt-4">កំពុងផ្ទុកទិន្នន័យ...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
        <div className="text-center max-w-lg bg-white rounded-2xl shadow-2xl p-8 border-2 border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <X className="h-10 w-10 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-red-600 mb-3">មានបញ្ហា</h2>
          <p className="text-gray-700 mb-8">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setError("");
                setTokenRetries(0);
                fetchSubjectResults();
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
            >
              <RefreshCw className="inline h-4 w-4 mr-2" /> ព្យាយាមម្តងទៀត
            </button>
            <Link href={`/results/province/${encodeURIComponent(province_name)}`}>
              <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg">
                <ArrowLeft className="inline h-4 w-4 mr-2" /> ត្រឡប់
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto flex justify-between sm:justify-around sm:gap-4 mb-6">
        <Link href={`/results/province/${encodeURIComponent(province_name)}`}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />ត្រឡប់
          </button>
        </Link>
        <Link href="/welcome">
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl flex items-center gap-2">
            <Home className="h-4 w-4" />ទំព័រដើម
          </button>
        </Link>
      </div>

      {/* Header */}
      <header className="text-center mb-8 max-w-7xl mx-auto">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3 px-5 py-3 bg-white/90 rounded-2xl shadow-xl">
            <div className="rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 p-2.5">
              <Image src="/moeys-logo.png" alt="Logo" width={48} height={48} />
            </div>
            <div className="font-bold">MoEYS EdTech - GEIP ICT Team</div>
          </div>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold">
          លទ្ធផលតេស្តសិស្សតាមមុខវិជ្ជា
        </h1>
        <p className="text-xl text-gray-600 mt-2">
          ខេត្ត <span className="text-blue-600 font-bold">{province_name}</span> - 
          ខែ <span className="text-blue-600 font-bold">{selectedMonth}</span> 
          ឆ្នាំ <span className="text-blue-600 font-bold">{selectedYear}</span>
        </p>
      </header>

      <div className="max-w-7xl mx-auto">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-5 space-y-6">
            {/* Filters */}
            <div className="bg-gray-50 rounded-xl p-4 border">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">ការច្រោះយកទិន្នន័យ</h3>
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 overflow-x-auto pb-2">
                <div className="relative w-full sm:w-auto">
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm appearance-none cursor-pointer w-full sm:w-auto"
                  >
                    <option value="">ឆ្នាំ</option>
                    {yearfilterOptions.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293l4.5 4.5 4.5-4.5L15.707 8 10 13.707 4.293 8z" />
                    </svg>
                  </div>
                </div>

                <div className="relative w-full sm:w-auto">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm appearance-none cursor-pointer w-full sm:w-auto"
                  >
                    <option value="">ខែ</option>
                    {monthfilterOptions.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293l4.5 4.5 4.5-4.5L15.707 8 10 13.707 4.293 8z" />
                    </svg>
                  </div>
                </div>

                <div className="relative w-full sm:w-auto">
                  <select
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm appearance-none cursor-pointer w-full sm:w-auto"
                  >
                    <option value="">មុខវិជ្ជា</option>
                    {subjectOptions.map(subject => (
                      <option key={subject} value={subject}>{subject}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293l4.5 4.5 4.5-4.5L15.707 8 10 13.707 4.293 8z" />
                    </svg>
                  </div>
                </div>

                <div className="relative w-full sm:w-auto">
                  <select
                    value={selectedGrade}
                    onChange={(e) => setSelectedGrade(e.target.value)}
                    className="bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm appearance-none cursor-pointer w-full sm:w-auto"
                  >
                    <option value="">ថ្នាក់</option>
                    {gradeOptions.map(grade => (
                      <option key={grade} value={grade}>{grade}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.293 7.293l4.5 4.5 4.5-4.5L15.707 8 10 13.707 4.293 8z" />
                    </svg>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedSubject("");
                    setSelectedGrade("");
                    setSearchValue("");
                  }}
                  className="bg-red-500 hover:bg-red-600 text-white border-0"
                >
                  <X className="h-4 w-4" /> លុបច្រោះ
                </Button>
              </div>
            </div>

            {/* Search & Download */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-blue-50 rounded-lg p-4">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="ស្វែងរកឈ្មោះ ឬ អត្តលេខ..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button
                onClick={handleDownloadCSV}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <FileDown className="h-4 w-4" /> ទាញយកទិន្នន័យ
              </Button>
            </div>

            {/* Pagination Info */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-sm text-gray-600">
                បង្ហាញ {displayStart} - {displayEnd} ក្នុងចំណោម {filteredResults.length.toLocaleString()}
              </p>
              <div className="relative w-full sm:w-auto">
                <select
                  value={rowsPerPage}
                  onChange={(e) => {
                    const v = e.target.value;
                    setRowsPerPage(v === ALL_DATA_VALUE ? ALL_DATA_VALUE : Number(v));
                    setCurrentPage(1);
                  }}
                  className="bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm appearance-none cursor-pointer w-full sm:w-auto"
                >
                  <option value="20">បង្ហាញ 20</option>
                  {rowsPerPageOptions.map(opt => (
                    <option key={opt} value={opt}>
                      {opt === ALL_DATA_VALUE ? "ទាំងអស់" : `បង្ហាញ ${opt}`}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5.293 7.293l4.5 4.5 4.5-4.5L15.707 8 10 13.707 4.293 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full text-sm">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">អត្តលេខ</th>
                    <th className="px-4 py-3 text-left">ឈ្មោះសិស្ស</th>
                    <th className="px-4 py-3 text-center">មុខវិជ្ជា</th>
                    <th className="px-4 py-3 text-center">ថ្នាក់</th>
                    <th className="px-4 py-3 text-center">ពិន្ទុ</th>
                    <th className="px-4 py-3 text-center">ពិន្ទុអតិបរមា</th>
                    <th className="px-4 py-3 text-center">ភាគរយ</th>
                    <th className="px-4 py-3 text-center">ចំណាត់ថ្នាក់</th>
                    <th className="px-4 py-3 text-left">សាលា</th>
                    <th className="px-4 py-3 text-center">ស្រុក</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {paginated.length > 0 ? paginated.map((r, i) => (
                    <tr key={r.id} className={`hover:bg-blue-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                      <td className="px-4 py-3 text-center font-mono">{r.student_id}</td>
                      <td className="px-4 py-3">{r.full_name}</td>
                      <td className="px-4 py-3 text-center">
                        <div>
                          <div className="font-medium">{r.subject_kh}</div>
                          <div className="text-xs text-gray-500">{r.subject_name}</div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center font-bold">{r.grade}</td>
                      <td className="px-4 py-3 text-center font-bold text-indigo-600">{r.score}</td>
                      <td className="px-4 py-3 text-center">{r.max_score}</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          parseFloat(r.percentage) >= 80 ? 'bg-green-100 text-green-800' :
                          parseFloat(r.percentage) >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {r.percentage}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          r.grade_letter === 'A' ? 'bg-purple-100 text-purple-800' :
                          r.grade_letter === 'B' ? 'bg-blue-100 text-blue-800' :
                          r.grade_letter === 'C' ? 'bg-green-100 text-green-800' :
                          r.grade_letter === 'D' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {r.grade_letter}
                        </span>
                      </td>
                      <td className="px-4 py-3">{r.school}</td>
                      <td className="px-4 py-3 text-center text-gray-600">{r.district}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={10} className="text-center py-16 text-gray-500">
                        មិនមានទិន្នន័យ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {rowsPerPage !== ALL_DATA_VALUE && (
              <div className="flex justify-center gap-3">
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  មុន
                </Button>
                <span className="py-2 px-4">ទំព័រ {currentPage} / {totalPages}</span>
                <Button
                  size="sm"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  បន្ទាប់
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}