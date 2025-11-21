"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Download, Search, RefreshCw, ArrowLeft, Home } from "lucide-react";

// --- UI Component Definitions (Replaced external imports for compilation) ---
const Card = ({ className = "", children }) => (
  <div
    className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}
  >
    {children}
  </div>
);
const CardContent = ({ className = "", children }) => (
  <div className={`p-6 ${className}`}>{children}</div>
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

  // Size variants
  if (size === "sm") {
    baseStyles += " h-9 px-3 text-xs";
  } else {
    baseStyles += " h-10 px-4 py-2";
  }

  // Variant styles
  if (variant === "default") {
    baseStyles += " bg-blue-600 text-white hover:bg-blue-700";
  } else if (variant === "outline") {
    baseStyles +=
      " border border-input bg-background hover:bg-accent hover:text-accent-foreground";
  } else if (variant === "ghost") {
    baseStyles += " hover:bg-accent hover:text-accent-foreground";
  }

  // Custom style overrides for the green download button
  if (className.includes("bg-green-500")) {
    baseStyles = baseStyles
      .replace(/bg-blue-600/, "")
      .replace(/hover:bg-blue-700/, "");
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
    className={`flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
  />
);

// --- Type Definitions ---
interface Result {
  id: number;
  student_id: string;
  full_name: string;
  gender: string;
  school: string;
  district: string;
  province: string;
  phone_number: string;
  subject: string;
  score: number;
  grade: string; // School Class Level (e.g., Grade 7, Grade 12)
  exam_class: string; // Exam Class (e.g., 12 - វិទ្យាសាស្ត្រ)
  result: string; // ជាប់/ធ្លាក់ (Pass/Fail)
  rank: string;
  level: string; // Achievement Grade (A, B, C, etc. or និទ្ទេស)
  exam_year?: number; // Used for filtering
  exam_month?: number; // Used for filtering
}

// --- Constants ---
const API_BASE = "http://10.1.79.47:8000";
const TOKEN_URL = `${API_BASE}/api/token/`;
const MOCK_USERNAME = "admin";
const MOCK_PASSWORD = "admin123";

// Month map used to convert Khmer month names in the UI dropdown to their numeric API value
const MONTH_NAME_TO_INT = {
  មករា: 1,
  កុម្ភៈ: 2,
  មីនា: 3,
  មេសា: 4,
  ឧសភា: 5,
  មិថុនា: 6,
  កក្កដា: 7,
  សីហា: 8,
  កញ្ញា: 9,
  តុលា: 10,
  វិច្ឆិកា: 11,
  ធ្នូ: 12,
};
const ALL_DATA_VALUE = "all";

// Decode the dynamic [province] segment into a human-readable province name
const decodeProvinceName = (slug: string | string[] | undefined) => {
  if (!slug) return "";
  const value = Array.isArray(slug) ? slug[slug.length - 1] : slug;
  // 1) decode URI (for Khmer or spaces encoded as %20)
  const decoded = decodeURIComponent(value);
  // 2) convert hyphen-based slugs into spaced names
  return decoded.replace(/-/g, " ");
};

// --- Main Component ---
export default function ProvinceResultsPage() {
  const params = useParams<{ province?: string }>();

  const province_name = useMemo(() => {
    return decodeProvinceName(params?.province);
  }, [params]);

  // --- State for Data and Filters ---
  const [results, setResults] = useState<Result[]>([]);
  const [filtered, setFiltered] = useState<Result[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFetchingOptions, setIsFetchingOptions] = useState(false);

  // Filter Selection States
  const [selectedDistrict, setSelectedDistrict] = useState<string>("");
  const [selectedSchool, setSelectedSchool] = useState<string>("");
  const [selectedClassLevel, setSelectedClassLevel] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<string>("");
  const [selectedAchievement, setSelectedAchievement] = useState<string>("");

  // State for Year and Month Filters
  const [selectedYear, setSelectedYear] = useState<string>("2025"); // Default to 2025
  const [selectedMonth, setSelectedMonth] = useState<string>("វិច្ឆិកា"); // Default to វិច្ឆិកា (November)

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  // Filter Option States
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [schoolOptions, setSchoolOptions] = useState<string[]>([]);
  const [classLevelOptions, setClassLevelOptions] = useState<string[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<string[]>([]);
  const genderOptions = ["ប្រុស", "ស្រី"];
  const achievementOptions = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const yearfilterOptions = ["2025", "2026", "2027"];
  const monthfilterOptions = [
    "មករា",
    "កុម្ភៈ",
    "មីនា",
    "មេសា",
    "ឧសភា",
    "មិថុនា",
    "កក្កដា",
    "សីហា",
    "កញ្ញា",
    "តុលា",
    "វិច្ឆិកា",
    "ធ្នូ",
  ];
  const rowsPerPageOptions = [10, 20, 30, 40, 50, 100, ALL_DATA_VALUE];

  // --- API Functions ---

  // Fetches a JWT Access Token
  const getAccessToken = useCallback(async () => {
    const tokenRes = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: MOCK_USERNAME,
        password: MOCK_PASSWORD,
      }),
    });
    if (!tokenRes.ok) throw new Error("Failed to get token");
    const tokenData = await tokenRes.json();
    return tokenData.access;
  }, []);

  // Constructs the most specific URL based on selected filters
  const buildResultsUrl = useCallback(() => {
    // API parameters must be URI encoded, especially for Khmer names
    const encodedProvince = encodeURIComponent(province_name);
    let url = `${API_BASE}/api/v1/filters/provinces/${encodedProvince}/`;
    let queryParams = new URLSearchParams();

    if (selectedDistrict) {
      const encodedDistrict = encodeURIComponent(selectedDistrict);
      url += `districts/${encodedDistrict}/`;
    }
    if (selectedSchool) {
      const encodedSchool = encodeURIComponent(selectedSchool);
      url += `schools/${encodedSchool}/`;
    }
    if (selectedClassLevel) {
      const encodedClassLevel = encodeURIComponent(selectedClassLevel);
      url += `grades/${encodedClassLevel}/`;
    }
    if (selectedSubject) {
      const encodedSubject = encodeURIComponent(selectedSubject);
      url += `subject/${encodedSubject}/`;
    }

    // Add Year and Month filters as query parameters (API will handle this if implemented)
    if (selectedYear) {
      queryParams.append("year", selectedYear);
    }
    if (selectedMonth) {
      const monthNumber =
        MONTH_NAME_TO_INT[selectedMonth as keyof typeof MONTH_NAME_TO_INT];
      if (monthNumber) {
        queryParams.append("month", String(monthNumber));
      }
    }

    const queryString = queryParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  }, [
    province_name,
    selectedDistrict,
    selectedSchool,
    selectedClassLevel,
    selectedSubject,
    selectedYear,
    selectedMonth,
  ]);

  // Fetches Dropdown Options (Districts, Schools, Class Levels, Subjects)
  const fetchFilterOptions = useCallback(async () => {
    if (!province_name) return;
    setIsFetchingOptions(true);

    try {
      const accessToken = await getAccessToken();
      const encodedProvince = encodeURIComponent(province_name);

      // 1. Fetch Districts
      const districtUrl = `${API_BASE}/api/v1/filters/provinces/${encodedProvince}/districts/`;
      const districtRes = await fetch(districtUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const districtData: { district: string }[] = await districtRes.json();
      const uniqueDistricts = Array.from(
        new Set(districtData.map((d) => d.district).filter(Boolean))
      ).sort();
      setDistrictOptions(uniqueDistricts);

      if (!selectedDistrict) {
        setSchoolOptions([]);
        setClassLevelOptions([]);
        setSubjectOptions([]);
        setIsFetchingOptions(false);
        return;
      }

      const encodedDistrict = encodeURIComponent(selectedDistrict);

      // 2. Fetch Schools
      const schoolUrl = `${API_BASE}/api/v1/filters/provinces/${encodedProvince}/districts/${encodedDistrict}/schools/`;
      const schoolRes = await fetch(schoolUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const schoolData: { school: string }[] = await schoolRes.json();
      const uniqueSchools = Array.from(
        new Set(schoolData.map((s) => s.school).filter(Boolean))
      ).sort();
      setSchoolOptions(uniqueSchools);

      if (!selectedSchool) {
        setClassLevelOptions([]);
        setSubjectOptions([]);
        setIsFetchingOptions(false);
        return;
      }

      const encodedSchool = encodeURIComponent(selectedSchool);

      // 3. Fetch Class Levels (Grades 7, 12, etc.)
      const classLevelUrl = `${API_BASE}/api/v1/filters/provinces/${encodedProvince}/districts/${encodedDistrict}/schools/${encodedSchool}/grades/`;
      const classLevelRes = await fetch(classLevelUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const classLevelData: { grade: string }[] = await classLevelRes.json();
      const uniqueClassLevels = Array.from(
        new Set(classLevelData.map((g) => g.grade).filter(Boolean))
      ).sort();
      setClassLevelOptions(uniqueClassLevels);

      if (!selectedClassLevel) {
        setSubjectOptions([]);
        setIsFetchingOptions(false);
        return;
      }

      const encodedClassLevel = encodeURIComponent(selectedClassLevel);

      // 4. Fetch Subjects
      const subjectUrl = `${API_BASE}/api/v1/filters/provinces/${encodedProvince}/districts/${encodedDistrict}/schools/${encodedSchool}/grades/${encodedClassLevel}/subjects/`;
      const subjectRes = await fetch(subjectUrl, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const subjectData: { subject: string }[] = await subjectRes.json();
      const uniqueSubjects = Array.from(
        new Set(subjectData.map((s) => s.subject).filter(Boolean))
      ).sort();
      setSubjectOptions(uniqueSubjects);
    } catch (err) {
      console.error("Error fetching filter options:", err);
    } finally {
      setIsFetchingOptions(false);
    }
  }, [
    province_name,
    selectedDistrict,
    selectedSchool,
    selectedClassLevel,
    getAccessToken,
  ]);

  // Main Data Fetching Function
  const fetchData = useCallback(async () => {
    if (!province_name) return;

    setLoading(true);
    setError("");

    // Build the URL based on current selections
    const fetchUrl = buildResultsUrl();

    try {
      const accessToken = await getAccessToken();

      const res = await fetch(fetchUrl, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok)
        throw new Error(`Error fetching data (${res.status}) from ${fetchUrl}`);

      let data: Result[] = await res.json();

      // ----------------------------------------------------
      // ⭐ BUG FIX: Apply client-side filters for Year, Month, Gender, and Achievement Grade
      // This guarantees the UI displays correct data even if the API's query params fail.
      // ----------------------------------------------------

      if (selectedYear) {
        const targetYear = Number(selectedYear);
        data = data.filter((r) => r.exam_year === targetYear);
      }

      if (selectedMonth) {
        const targetMonth =
          MONTH_NAME_TO_INT[selectedMonth as keyof typeof MONTH_NAME_TO_INT];
        data = data.filter((r) => r.exam_month === targetMonth);
      }

      if (selectedGender) {
        data = data.filter((r) => r.gender === selectedGender);
      }
      
      if (selectedAchievement) {
        const target = selectedAchievement.trim();
        // BUG FIX: Achievement Grade (ថ្នាក់រៀន) filters against r.exam_class
        data = data.filter((r) => (r.exam_class ?? "").toString().trim() === target);
      }

      setResults(data);
      setFiltered(data);
      setCurrentPage(1);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError(
        `បរាជ័យក្នុងការផ្ទុកលទ្ធផលសម្រាប់ ${province_name}: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  }, [
    province_name,
    selectedGender,
    selectedAchievement,
    selectedYear,
    selectedMonth,
    buildResultsUrl,
    getAccessToken,
  ]);

  // NEW: Auto-filter whenever Year, Month, Gender, or Achievement Grade changes
  useEffect(() => {
    if (province_name) {
      fetchData();
    }
  }, [
    selectedYear,
    selectedMonth,
    selectedGender,
    selectedAchievement,
    province_name,
    fetchData,
  ]);

  // Fetch filter options whenever a higher-level filter changes
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // --- Handler Functions ---

  function handleFilter() {
    // This is now primarily used for District/School/Class/Subject changes,
    // as Year/Month/Gender/Achievement are auto-triggered by the useEffect above.
    setCurrentPage(1);
    fetchData();
  }

  function handleSearch() {
    if (!searchValue.trim()) {
      setFiltered(results);
      setCurrentPage(1);
      return;
    }
    const value = searchValue.trim().toLowerCase();

    const filteredData = results.filter(
      (r) =>
        r.full_name.toLowerCase().includes(value) ||
        r.student_id.toLowerCase().includes(value) ||
        r.school.toLowerCase().includes(value)
    );

    setFiltered(filteredData);
    setCurrentPage(1);
  }

  function handleDownloadCSV() {
    const csvContent = [
      [
        "ID",
        "Student ID",
        "Full Name",
        "Gender",
        "Subject",
        "School",
        "District",
        "Province",
        "Phone",
        "Score",
        "Grade", // School Class Level (r.grade)
        "Class", // Exam Class (r.exam_class)
        "Rank",
        "Level", // Achievement Grade (r.level)
        "Result",
      ]
        .map((h) => `"${h}"`)
        .join(","),
      ...filtered.map((r) =>
        [
          r.id,
          r.student_id,
          r.full_name,
          r.gender,
          r.subject,
          r.school,
          r.district,
          r.province,
          r.phone_number,
          r.score,
          r.grade,
          r.exam_class,
          r.rank,
          r.level,
          r.result,
        ]
          .map((field) => `"${field}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csvContent], {
      type: "text/csv;charset=utf-8;",
    }); // Added UTF-8 BOM
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${province_name}_results_filtered.csv`;
    link.click();
  }

  // Custom Select component for Tailwind styling
  const SelectFilter = ({
    label,
    value,
    onChange,
    options,
    disabled = false,
  }: {
    label: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: (string | number)[];
    disabled?: boolean;
  }) => (
    <div className="relative w-full sm:w-auto">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full sm:min-w-[120px] bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition duration-150 ease-in-out cursor-pointer disabled:opacity-50 disabled:bg-gray-100"
        aria-label={label}
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option === ALL_DATA_VALUE ? "ទិន្នន័យទាំងអស់" : option}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg
          className="fill-current h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );

  // Pagination calculations now use rowsPerPage state
  const totalPages =
    rowsPerPage === ALL_DATA_VALUE
      ? 1
      : Math.max(1, Math.ceil(filtered.length / rowsPerPage));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(prev, totalPages));
  }, [totalPages]);

  const paginatedResults = useMemo(() => {
    if (rowsPerPage === ALL_DATA_VALUE) {
      return filtered;
    }
    const startIndex = (currentPage - 1) * rowsPerPage;
    return filtered.slice(startIndex, startIndex + rowsPerPage);
  }, [filtered, currentPage, rowsPerPage]);

  const handlePageChange = (direction: "prev" | "next") => {
    if (rowsPerPage === ALL_DATA_VALUE) return;
    setCurrentPage((prev) => {
      if (direction === "prev") {
        return Math.max(1, prev - 1);
      }
      return Math.min(totalPages, prev + 1);
    });
  };

  const displayStart = filtered.length
    ? (currentPage - 1) * rowsPerPage + 1
    : 0;
  const displayEnd = filtered.length
    ? Math.min(currentPage * rowsPerPage, filtered.length)
    : 0;

  // Use current selected month and year for the header
  const headerDateText =
    selectedMonth || selectedYear ? (
      <>
        ទិន្នន័យសិស្សក្នុង
        {selectedMonth && (
          <>
            ខែ <span className="text-blue-600 font-bold">{selectedMonth}</span>
          </>
        )}
        {selectedYear && (
          <>
            {selectedMonth ? " " : ""}ឆ្នាំ{" "}
            <span className="text-blue-600 font-bold">{selectedYear}</span>
          </>
        )}
      </>
    ) : (
      "ទិន្នន័យលទ្ធផលសិស្ស"
    );

  if (loading && !results.length)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-white/80 px-6 py-8 shadow-lg backdrop-blur">
          <div className="h-14 w-14 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
          <p className="text-lg font-semibold text-blue-700">
            កំពុងផ្ទុកទិន្នន័យសិស្ស
          </p>
          <p className="text-sm text-gray-500">
            សូមរង់ចាំបន្តិច… ការទាញយកទិន្នន័យកំពុងដំណើរការ។
          </p>
        </div>
      </div>
    );
  if (error)
    return (
      <h2 className="text-center text-red-600 mt-10 text-xl">
        មានបញ្ហា៖ {error}
      </h2>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4 sm:p-8">
      {/* Navigation Buttons */}
      <div className="flex justify-between sm:justify-around items-center mb-4 md:mb-6">
        <Link href="/results">
          <button className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="sm:inline">ត្រឡប់</span>
          </button>
        </Link>
        <Link href="/welcome">
          <button className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-3 py-2 sm:px-4 text-xs sm:text-sm font-medium transition-colors">
            <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="sm:inline">ទំព័រដើម</span>
          </button>
        </Link>
      </div>

      {/* Header with Logo and Title */}
      <header className="text-center mb-6">
        <div className="flex justify-center mb-4">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md ring-1 ring-gray-200">
            <div className="rounded-xl bg-blue-50 p-2 sm:p-3 ring-1 ring-blue-100">
              <Image
                src="/moeys-logo.png"
                alt="MoEYS Logo"
                width={40}
                height={40}
                className="h-10 w-10 sm:h-12 sm:w-12"
                priority
              />
            </div>
            <div className="text-gray-900 font-semibold text-sm sm:text-base leading-snug text-left whitespace-normal">
              MoEYS EdTech - GEIP ICT Team
            </div>
          </div>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
          លទ្ធផលប្រឡងរបស់សិស្សក្នុង{" "}
          <span className="text-blue-600">{province_name}</span>
        </h1>
        {/* UPDATED: Dynamic Date Display */}
        <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          {headerDateText}
        </p>
      </header>
      <Card className="bg-white shadow-xl rounded-lg relative">
        {loading && results.length > 0 && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg">
            <div className="h-12 w-12 rounded-full border-4 border-blue-200 border-t-blue-600 animate-spin" />
            <p className="mt-4 text-blue-700 font-medium">
              កំពុងបង្ហាញទិន្នន័យថ្មី...
            </p>
          </div>
        )}
        <CardContent className="p-4 space-y-4">
          {/* --- Filter Controls Section --- */}
          <div className="flex flex-wrap items-center gap-3 p-4 bg-gray-50 rounded-lg border">
            {/* Year Filter (API Query Param & Client-side filtered) */}
            <SelectFilter
              label="ឆ្នាំ"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              options={yearfilterOptions}
            />

            {/* Month Filter (API Query Param & Client-side filtered) */}
            <SelectFilter
              label="ខែ"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              options={monthfilterOptions}
            />

            {/* Gender Filter (Client-side) */}
            <SelectFilter
              label="ភេទ"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              options={genderOptions}
            />

            {/* District Filter (API) */}
            <SelectFilter
              label="ស្រុក"
              value={selectedDistrict}
              onChange={(e) => {
                setSelectedDistrict(e.target.value);
                // Reset lower-level filters when district changes
                setSelectedSchool("");
                setSelectedClassLevel("");
                setSelectedSubject("");
                setSelectedAchievement("");
              }}
              options={districtOptions}
            />

            {/* School Filter (API) */}
            <SelectFilter
              label="សាលារៀន"
              value={selectedSchool}
              onChange={(e) => {
                setSelectedSchool(e.target.value);
                // Reset lower-level filters when school changes
                setSelectedClassLevel("");
                setSelectedSubject("");
                setSelectedAchievement("");
              }}
              options={schoolOptions}
              disabled={
                !selectedDistrict ||
                schoolOptions.length === 0 ||
                isFetchingOptions
              }
            />

            {/* School Class Level Filter (API) - Renamed from 'ថ្នាក់' to 'កម្រិតថ្នាក់' */}
            <SelectFilter
              label="កម្រិតថ្នាក់"
              value={selectedClassLevel}
              onChange={(e) => {
                setSelectedClassLevel(e.target.value);
                // Reset lower-level filters when class level changes
                setSelectedSubject("");
                setSelectedAchievement("");
              }}
              options={classLevelOptions}
              disabled={
                !selectedSchool ||
                classLevelOptions.length === 0 ||
                isFetchingOptions
              }
            />

            {/* Achievement Grade Filter (Client-side) */}
            <SelectFilter
              label="ថ្នាក់រៀន"
              value={selectedAchievement}
              onChange={(e) => setSelectedAchievement(e.target.value)}
              options={achievementOptions}
              disabled={!selectedClassLevel}
            />

            {/* Subject Filter (API) */}
            <SelectFilter
              label="មុខវិជ្ជា"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              options={subjectOptions}
              disabled={
                !selectedClassLevel ||
                subjectOptions.length === 0 ||
                isFetchingOptions
              }
            />

            {/* Filter Button */}
            <Button
              onClick={handleFilter}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-150 ease-in-out flex items-center"
              disabled={loading || isFetchingOptions}
            >
              {loading || isFetchingOptions ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Search className="h-4 w-4 mr-2" />
              )}
              {loading || isFetchingOptions ? "កំពុងផ្ទុក..." : "ច្រោះទិន្នន័យ"}
            </Button>
          </div>

          {/* --- Search and Download Controls --- */}
          <div className="flex flex-col sm:flex-row gap-3 justify-between items-center mt-4">
            <div className="flex gap-2 items-center w-full sm:w-auto">
              <Input
                placeholder="ស្វែងរកឈ្មោះសិស្ស ឬសាលារៀន..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full sm:w-64"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSearch();
                }}
              />
              <Button
                onClick={handleSearch}
                variant="outline"
                className="text-blue-600 border-blue-600 hover:bg-blue-50"
              >
                ស្វែងរក
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={handleDownloadCSV}
              className="w-full sm:w-auto bg-green-500 text-white hover:bg-green-600"
            >
              <Download className="h-4 w-4 mr-2" /> ទាញយក CSV
            </Button>
          </div>

          {/* --- Pagination Info & Control --- */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between pt-4 border-t">
            <div className="flex items-center gap-3">
              <p className="text-sm text-gray-600 whitespace-nowrap">
                បង្ហាញ {displayStart} - {displayEnd} ក្នុងចំណោម{" "}
                {filtered.length.toLocaleString()} សិស្ស
              </p>
              {/* Rows Per Page Select */}
              <SelectFilter
                label="បង្ហាញ"
                value={rowsPerPage}
                onChange={(e) => {
                  const value = e.target.value;
                  setRowsPerPage(
                    value === ALL_DATA_VALUE ? ALL_DATA_VALUE : Number(value)
                  );
                  setCurrentPage(1); // Reset page on limit change
                }}
                options={rowsPerPageOptions}
              />
            </div>

            {rowsPerPage !== ALL_DATA_VALUE && (
              <div className="flex items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange("prev")}
                  disabled={currentPage === 1 || loading}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  មុន
                </Button>
                <span className="text-sm font-semibold text-gray-700">
                  ទំព័រ {currentPage} / {totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange("next")}
                  disabled={currentPage === totalPages || loading}
                  className="text-blue-600 border-blue-200 hover:bg-blue-50"
                >
                  បន្ទាប់
                </Button>
              </div>
            )}
          </div>

          {/* --- Results Table --- */}
          <div className="overflow-x-auto mt-6">
            <table className="min-w-full border text-sm rounded-lg overflow-hidden">
              <thead className="bg-blue-600 text-white sticky top-0">
                <tr>
                  <th className="px-3 py-3 border border-blue-700">អត្តលេខ</th>
                  <th className="px-3 py-3 border border-blue-700">
                    ឈ្មោះសិស្ស
                  </th>
                  <th className="px-3 py-3 border border-blue-700">ភេទ</th>
                  <th className="px-3 py-3 border border-blue-700">
                    កម្រិតថ្នាក់
                  </th>{" "}
                  {/* Displays r.grade */}
                  <th className="px-3 py-3 border border-blue-700">
                    ថ្នាក់រៀន
                  </th>
                  <th className="px-3 py-3 border border-blue-700">
                    មុខវិជ្ជា
                  </th>
                  <th className="px-3 py-3 border border-blue-700">សាលារៀន</th>
                  <th className="px-3 py-3 border border-blue-700">ស្រុក</th>
                  <th className="px-3 py-3 border border-blue-700">ខេត្ត</th>
                  <th className="px-3 py-3 border border-blue-700">
                    លេខទូរស័ព្ទ
                  </th>
                  <th className="px-3 py-3 border border-blue-700">ពិន្ទុ</th>
                  <th className="px-3 py-3 border border-blue-700">
                    ចំណាត់ថ្នាក់
                  </th>
                  <th className="px-3 py-3 border border-blue-700">និទ្ទេស</th>
                  <th className="px-3 py-3 border border-blue-700">លទ្ធផល</th>
                </tr>
              </thead>
              <tbody>
                {paginatedResults.length > 0
                  ? paginatedResults.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-blue-50/50 even:bg-gray-50"
                      >
                        <td className="px-3 py-2 border text-center font-mono">
                          {r.student_id}
                        </td>
                        <td className="px-3 py-2 border">{r.full_name}</td>
                        <td className="px-3 py-2 border text-center">
                          {r.gender}
                        </td>
                        <td className="px-3 py-2 border">{r.grade}</td>
                        <td className="px-3 py-2 border">{r.exam_class}</td>
                        <td className="px-3 py-2 border">{r.subject}</td>
                        <td className="px-3 py-2 border">{r.school}</td>
                        <td className="px-3 py-2 border text-center">
                          {r.district}
                        </td>
                        <td className="px-3 py-2 border text-center font-bold">
                          {r.province}
                        </td>
                        <td className="px-3 py-2 border text-center">
                          {r.phone_number}
                        </td>
                        <td className="px-3 py-2 border text-center">
                          {r.score}
                        </td>
                        <td className="px-3 py-2 border text-center">
                          {r.rank}
                        </td>
                        <td className="px-3 py-2 border text-center">
                          {r.level}
                        </td>
                        <td
                          className={`px-3 py-2 border text-center font-extrabold ${
                            r.result === "ជាប់"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {r.result}
                        </td>
                      </tr>
                    ))
                  : !loading && (
                      <tr>
                        <td
                          colSpan={14}
                          className="text-center py-8 text-gray-500 bg-white"
                        >
                          មិនមានទិន្នន័យសិស្សត្រូវនឹងលក្ខខណ្ឌដែលបានជ្រើសរើសទេ។
                        </td>
                      </tr>
                    )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}