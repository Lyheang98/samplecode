"use client";
import React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  Download,
  Search,
  RefreshCw,
  ArrowLeft,
  Home,
  X,
  Filter,
  FileDown,
  ArrowRight,
  Eye,
  BarChart3,
} from "lucide-react";
import { API_BASE, MOCK_USERNAME, MOCK_PASSWORD } from "../../../../api/api.js";

const SUBJECT_LIST = [
  { code: "1.3.2", name: "ភាសាខ្មែរ" },
  { code: "1.3.3", name: "គណិតវិទ្យា" },
  { code: "1.3.4", name: "រូបវិទ្យា" },
  { code: "1.3.5", name: "គីមីវិទ្យា" },
  { code: "1.3.6", name: "ជីវវិទ្យា" },
  { code: "1.3.7", name: "ប្រវត្តិវិទ្យា" },
  { code: "1.3.8", name: "សីលធម៌-ពលរដ្ឋវិជ្ជា" },
  { code: "1.3.9", name: "ផែនដីវិទ្យា" },
  { code: "1.3.10", name: "ភូមិវិទ្យា" },
  { code: "1.3.11", name: "អង់គ្លេស" },
];
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
  { id: "22", name: "ខេត្តកែប" },
  { id: "23", name: "ខេត្តប៉ៃលិន" },
  { id: "24", name: "ខេត្តឧត្តរមានជ័យ" },
  { id: "25", name: "ខេត្តត្បូងឃ្មុំ" },
];
// --- UI Components ---
const Card = ({ className = "", children }) => (
  <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}>
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

  if (size === "sm") baseStyles += " h-9 px-3 text-xs";
  else baseStyles += " h-10 px-4 py-2";

  if (variant === "default") baseStyles += " bg-blue-600 text-white hover:bg-blue-700";
  else if (variant === "outline") baseStyles += " border border-input bg-background hover:bg-accent hover:text-accent-foreground";
  else if (variant === "ghost") baseStyles += " hover:bg-accent hover:text-accent-foreground";

  if (className.includes("bg-green-500") || className.includes("bg-red-500") || className.includes("bg-indigo-600") || className.includes("bg-purple-600")) {
    baseStyles = baseStyles.replace(/bg-blue-600/, "").replace(/hover:bg-blue-700/, "");
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${className}`} disabled={disabled} type="button">
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
const ALL_DATA_VALUE = "all";

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
const toAverage = (avgStr: any) => {
  if (typeof avgStr === "string") return parseFloat(avgStr).toFixed(2);
  return Number(avgStr).toFixed(2);
};

export default function ProvinceResultsPage() {
  const params = useParams();
  const router = useRouter();
  const province_name = useMemo(() => decodeProvinceName(params?.province), [params?.province]);

  const [rawStudents, setRawStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFetchingOptions, setIsFetchingOptions] = useState(false);
  const [tokenRetries, setTokenRetries] = useState(0);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClassLevel, setSelectedClassLevel] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAchievement, setSelectedAchievement] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("ធ្នូ");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [schoolOptions, setSchoolOptions] = useState<{ id: string; name: string }[]>([]);
  const [classLevelOptions, setClassLevelOptions] = useState<string[]>([]);
  const [roomOptions, setRoomOptions] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState("result-subject"); // Default to result-subject
  const [showScores, setShowScores] = useState(true);
  const [countAllStudents, setCountAllStudents] = useState(true); // New state for counting mode

  const genderOptions = ["ប្រុស", "ស្រី"];
  const achievementOptions = ["A", "B", "C", "D", "E", "F"];
  const yearfilterOptions = ["2025", "2026", "2027"];
  const monthfilterOptions = [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
  ];
  const rowsPerPageOptions = [10, 20, 30, 40, 50, 100, ALL_DATA_VALUE];

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

  const fetchData = useCallback(async () => {
    if (!province_name) return;
    setLoading(true);
    setError("");

    let url = "";
    if (activeTab === "full-results") {
      url = `${API_BASE}/api/v1/result/full-results/${encodeURIComponent(province_name)}/`;
    } else if (activeTab === "result-subject" || activeTab === "total-results") {
      url = `${API_BASE}/api/v1/result/result-Subjects/${encodeURIComponent(province_name)}/`;
    }

    try {
      const token = await getAccessToken();
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        credentials: "omit",
        cache: "no-store",
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`API ${res.status}: ${txt || res.statusText}`);
      }

      const json = await res.json();
      const rawData = Array.isArray(json) ? json : json.results || json.data || [];

      const mapped = rawData.map((r: any) => ({
        id: `${r.student_ID || ""}${r.geip_school_ID || ""}`,
        student_id: r.student_ID || "",
        full_name: `${r.last_name || ""} ${r.first_name || ""}`.trim(),
        gender: r.gender || "",
        school: r.school_name || "",
        district: r.district_name || "",
        province: r.province_name || "",
        phone_number: r.phone_number || "",
        score: toIntegerScore(r.total_score ?? r.score ?? 0),
        average: toAverage(r.total_average ?? r.average ?? "0"),
        grade: r.grade || "",
        exam_class: r.room || "",
        rank: r.current_rank || r.rank || "",
        level: r.overall_level || r.level || "",
        result: r.overall_result || r.result || "",
        exam_year: r.exam_year || new Date().getFullYear().toString(),
        exam_month: r.exam_month || new Date().getMonth() + 1,
        subjects: r.subjects || {},
        total_score: toIntegerScore(r.total_score ?? 0),
        total_possible: toIntegerScore(r.total_possible ?? 0),
        total_average: toAverage(r.total_average ?? "0"),
        overall_level: r.overall_level || "",
        overall_result: r.overall_result || "",
      }));

      setRawStudents(mapped);
    } catch (err: any) {
      setError(`មិនទាន់មានទិន្នន័យ`);
    } finally {
      setLoading(false);
    }
  }, [province_name, getAccessToken, activeTab]);

  // Filter students
  useEffect(() => {
    let tempFiltered = rawStudents;

    if (selectedDistrict) tempFiltered = tempFiltered.filter(r => r.district === selectedDistrict);
    if (selectedSchool) tempFiltered = tempFiltered.filter(r => r.school === selectedSchool);
    if (selectedClassLevel) tempFiltered = tempFiltered.filter(r => r.grade === selectedClassLevel);
    if (selectedRoom) tempFiltered = tempFiltered.filter(r => r.exam_class === selectedRoom);
    if (selectedGender) tempFiltered = tempFiltered.filter(r => r.gender === selectedGender);
    if (selectedAchievement) tempFiltered = tempFiltered.filter(r => r.level === selectedAchievement);

    if (selectedYear) tempFiltered = tempFiltered.filter(r => String(r.exam_year) === selectedYear);
    if (selectedMonth) {
      const monthInt = MONTH_NAME_TO_INT[selectedMonth];
      if (monthInt) tempFiltered = tempFiltered.filter(r => parseInt(r.exam_month) === monthInt);
    }

    if (searchValue.trim()) {
      const val = searchValue.trim().toLowerCase();
      tempFiltered = tempFiltered.filter(r =>
        r.full_name.toLowerCase().includes(val) ||
        r.student_id.includes(val) ||
        r.school.toLowerCase().includes(val)
      );
    }

    setFilteredStudents(tempFiltered);
    setCurrentPage(1);
  }, [
    rawStudents,
    searchValue,
    selectedDistrict,
    selectedSchool,
    selectedClassLevel,
    selectedRoom,
    selectedGender,
    selectedAchievement,
    selectedYear,
    selectedMonth,
  ]);

  // Aggregate for total-results
  useEffect(() => {
    if (activeTab !== "total-results" || !filteredStudents.length) return;

    const summaryMap = new Map<string, any>();
    SUBJECT_LIST.forEach(subject => {
      summaryMap.set(subject.code, {
        code: subject.code,
        name: subject.name,
        A: 0,
        A_female: 0,
        B: 0,
        B_female: 0,
        C: 0,
        C_female: 0,
        D: 0,
        D_female: 0,
        E: 0,
        E_female: 0,
        F: 0,
        F_female: 0,
        ABC: 0,
        ABC_female: 0,
        DEF: 0,
        DEF_female: 0,
      });
    });

    if (countAllStudents) {
      // Count all students, treating missing data as "F"
      filteredStudents.forEach((r: any) => {
        const gender = r.gender || "";
        const isFemale = gender === "ស្រី";

        SUBJECT_LIST.forEach(subject => {
          const subjData = r.subjects?.[subject.name] || {};
          const level = subjData.level || "F"; // Default to "F" if no data

          const summary = summaryMap.get(subject.code);
          if (level === "A") {
            summary.A += 1;
            if (isFemale) summary.A_female += 1;
          } else if (level === "B") {
            summary.B += 1;
            if (isFemale) summary.B_female += 1;
          } else if (level === "C") {
            summary.C += 1;
            if (isFemale) summary.C_female += 1;
          } else if (level === "D") {
            summary.D += 1;
            if (isFemale) summary.D_female += 1;
          } else if (level === "E") {
            summary.E += 1;
            if (isFemale) summary.E_female += 1;
          } else if (level === "F") {
            summary.F += 1;
            if (isFemale) summary.F_female += 1;
          }

          summary.ABC = summary.A + summary.B + summary.C;
          summary.ABC_female = summary.A_female + summary.B_female + summary.C_female;
          summary.DEF = summary.D + summary.E + summary.F;
          summary.DEF_female = summary.D_female + summary.E_female + summary.F_female;
        });
      });
    } else {
      // Count only students with actual data for each subject
      SUBJECT_LIST.forEach(subject => {
        const summary = summaryMap.get(subject.code);
        
        filteredStudents.forEach((r: any) => {
          const gender = r.gender || "";
          const isFemale = gender === "ស្រី";
          
          // Only count if student has data for this subject
          if (r.subjects && r.subjects[subject.name]) {
            const subjData = r.subjects[subject.name];
            const level = subjData.level || "";
            
            if (level === "A") {
              summary.A += 1;
              if (isFemale) summary.A_female += 1;
            } else if (level === "B") {
              summary.B += 1;
              if (isFemale) summary.B_female += 1;
            } else if (level === "C") {
              summary.C += 1;
              if (isFemale) summary.C_female += 1;
            } else if (level === "D") {
              summary.D += 1;
              if (isFemale) summary.D_female += 1;
            } else if (level === "E") {
              summary.E += 1;
              if (isFemale) summary.E_female += 1;
            } else if (level === "F") {
              summary.F += 1;
              if (isFemale) summary.F_female += 1;
            }
          }
        });
        
        summary.ABC = summary.A + summary.B + summary.C;
        summary.ABC_female = summary.A_female + summary.B_female + summary.C_female;
        summary.DEF = summary.D + summary.E + summary.F;
        summary.DEF_female = summary.D_female + summary.E_female + summary.F_female;
      });
    }

    setSummaryData(Array.from(summaryMap.values()));
  }, [filteredStudents, activeTab, countAllStudents]);

  // Fetch filter options
  const fetchFilterOptions = useCallback(() => {
    if (rawStudents.length === 0) return;
    setIsFetchingOptions(true);
    try {
      const districts = [...new Set(rawStudents.map((d: any) => d.district).filter(Boolean))].sort();
      setDistrictOptions(districts);

      if (!selectedDistrict) {
        setSchoolOptions([]);
        setClassLevelOptions([]);
        setRoomOptions([]);
        setIsFetchingOptions(false);
        return;
      }

      let schools: { id: string; name: string }[] = [];
      if (selectedDistrict) {
        const schoolSet = new Set<string>();
        rawStudents.filter((s: any) => s.district === selectedDistrict).forEach((s: any) => {
          if (s.school) schoolSet.add(s.school);
        });
        schools = Array.from(schoolSet).map(name => ({ id: name, name })).sort((a, b) => a.name.localeCompare(b.name));
      }
      setSchoolOptions(schools);

      let grades: string[] = [];
      if (selectedDistrict && selectedSchool) {
        grades = [...new Set(rawStudents.filter(g => g.district === selectedDistrict && g.school === selectedSchool).map((g: any) => String(g.grade ?? "")).filter(Boolean))].sort();
      }
      setClassLevelOptions(grades);

      let rooms: string[] = [];
      if (selectedDistrict && selectedSchool && selectedClassLevel) {
        rooms = [...new Set(rawStudents.filter(r => r.district === selectedDistrict && r.school === selectedSchool && r.grade === selectedClassLevel).map((r: any) => String(r.exam_class ?? "")).filter(Boolean))].sort();
      }
      setRoomOptions(rooms);
    } catch (err) {
      console.error("Error loading filters:", err);
    } finally {
      setIsFetchingOptions(false);
    }
  }, [rawStudents, selectedDistrict, selectedSchool, selectedClassLevel]);

  useEffect(() => {
    if (province_name) fetchData();
  }, [province_name, fetchData]);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  const handleClearFilters = () => {
    setSelectedDistrict("");
    setSelectedSchool("");
    setSelectedClassLevel("");
    setSelectedRoom("");
    setSelectedGender("");
    setSelectedAchievement("");
    setSelectedYear("2025");
    setSelectedMonth("ធ្នូ");
    setSearchValue("");
  };

  const handleDownloadCSV = () => {
    let headers = [];
    let rows = [];
    let headerTitle = "";

    if (activeTab === "full-results") {
      headerTitle = "បញ្ជីឈ្មោះសិស្សនិងលទ្ធផលតេស្ដស្ដង់ដា";
      headers = ["Student ID", "Full Name", "Gender", "School", "District", "Province", "Phone", "Score", "Average", "Grade", "Class", "Rank", "Level", "Result", "Year", "Month"];
      rows = filteredStudents.map(r => [r.student_id, r.full_name, r.gender, r.school, r.district, r.province, r.phone_number, r.score, r.average, r.grade, r.exam_class, r.rank, r.level, r.result, r.exam_year, r.exam_month]);
    } else if (activeTab === "result-subject") {
      headerTitle = "បញ្ជីឈ្មោះសិស្សនិងលទ្ធផលតេស្ដស្ដង់ដា";
      headers = ["Student ID", "Full Name", "Gender", "School", "District", "Province", "Grade", "Class"];
      SUBJECT_LIST.forEach(subject => {
        if (showScores) headers.push(`${subject.name}`);
        else headers.push(`${subject.name}`);
      });

      rows = filteredStudents.map(r => {
        const row = [r.student_id, r.full_name, r.gender, r.school, r.district, r.province, r.grade, r.exam_class];
        SUBJECT_LIST.forEach(subject => {
          if (r.subjects?.[subject.name]) {
            if (showScores) {
              row.push(r.subjects[subject.name].score || "0");
            } else {
              row.push(r.subjects[subject.name].level || "F");
            }
          } else {
            if (showScores) {
              row.push("0");
            } else {
              row.push("F");
            }
          }
        });
        return row;
      });
    } else if (activeTab === "total-results") {
      headerTitle = "របាយការណ៍បូកសរុបលទ្ធិផលតេស្ដស្ដង់ដា";
      headers = ["សូចនាករ", "មុខវិជ្ជា", "A", "ស្រី", "B", "ស្រី", "C", "ស្រី", "D", "ស្រី", "E", "ស្រី", "F", "ស្រី", "ABC", "ស្រី", "DEF", "ស្រី"];
      rows = summaryData.map((r, i) => [r.code, r.name, r.A, r.A_female, r.B, r.B_female, r.C, r.C_female, r.D, r.D_female, r.E, r.E_female, r.F, r.F_female, r.ABC, r.ABC_female, r.DEF, r.DEF_female]);
    }

    // Get school name from first student (or use a default if no students)
    const schoolName = filteredStudents.length > 0 ? filteredStudents[0].school : "";

    // Create official header section
    const officialHeader = [
      ["ព្រះរាជាណាចក្រកម្ពុជា"],
      ["ជាតិ​ សាសនា ព្រះមហាក្សត្រ"],
      ["ក្រសួងអប់រំ យុវជន និងកីឡា"],
      ["គម្រោងកែលម្អការអប់រំចំណេះដីងទូទៅ Moeys Edtech " + headerTitle],
      ["សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ ( ស.ព.ភ )"],
      [schoolName ? `វិទ្យាល័យ ${schoolName}` : "វិទ្យាល័យ by name school"],
      [""], // Empty row for spacing
      [""], // Empty row for spacing
      [`ទិន្នន័យសិស្សក្នុង${selectedMonth ? ` ខែ ${selectedMonth}` : ""}${selectedYear ? ` ឆ្នាំ ${selectedYear}` : ""}`],
      [`ខេត្ត: ${province_name}`],
      [""], // Empty row for spacing
      [""], // Empty row for spacing
      headers // Add the actual data headers
    ];

    // Combine official header with data rows
    const allRows = [...officialHeader, ...rows];

    // Convert to CSV format with proper Excel formatting
    const csv = allRows.map((row, index) => {
      // Handle empty rows properly - create empty rows for spacing
      if (row.length === 1 && row[0] === "") {
        return "";
      }

      // For official headers, create merged cell appearance in Excel
      if (index < 7) {
        return `"${row[0]}"`;
      }

      // For date and province info
      if (index === 8 || index === 9) {
        return `"${row[0]}"`;
      }

      // For data headers and data rows
      return row.map(cell => `"${cell}"`).join(",");
    }).join("\n");

    // Create Excel-compatible CSV with BOM for Khmer characters
    const BOM = "\uFEFF";
    const csvContent = BOM + csv;

    // Create and download file
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${province_name}_${activeTab}_results.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = useMemo(() => rowsPerPage === ALL_DATA_VALUE ? 1 : Math.max(1, Math.ceil((activeTab === "total-results" ? summaryData.length : filteredStudents.length) / rowsPerPage)), [activeTab, summaryData.length, filteredStudents.length, rowsPerPage]);
  const paginated = useMemo(() => {
    const data = activeTab === "total-results" ? summaryData : filteredStudents;
    if (rowsPerPage === ALL_DATA_VALUE) return data;
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [activeTab, summaryData, filteredStudents, currentPage, rowsPerPage]);

  const displayStart = useMemo(() => {
    const data = activeTab === "total-results" ? summaryData : filteredStudents;
    return data.length ? (currentPage - 1) * rowsPerPage + 1 : 0;
  }, [activeTab, summaryData, filteredStudents, currentPage, rowsPerPage]);

  const displayEnd = useMemo(() => {
    const data = activeTab === "total-results" ? summaryData : filteredStudents;
    return data.length ? Math.min(currentPage * rowsPerPage, data.length) : 0;
  }, [activeTab, summaryData, filteredStudents, currentPage, rowsPerPage]);

  const headerDateText = useMemo(() => selectedMonth || selectedYear ? (
    <>
      ទិន្នន័យសិស្សក្នុង {selectedMonth && <>ខែ <span className="text-blue-600 font-bold">{selectedMonth}</span></>} {selectedYear && <>{selectedMonth ? " " : ""}ឆ្នាំ <span className="text-blue-600 font-bold">{selectedYear}</span></>}
    </>
  ) : "ទិន្នន័យលទ្ធផលសិស្ស", [selectedMonth, selectedYear]);

  if (loading && !rawStudents.length) {
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
            <button onClick={() => { setError(""); setTokenRetries(0); fetchData(); }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg">
              <RefreshCw className="inline h-4 w-4 mr-2" /> ព្យាយាមម្តងទៀត
            </button>
            <Link href="/results">
              <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg">
                <ArrowLeft className="inline h-4 w-4 mr-2" /> ត្រឡប់ទៅជ្រើសរើសខេត្ត
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto flex justify-between sm:justify-around sm:gap-4 mb-6">
        <Link href="/results"><button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"><ArrowLeft className="h-4 w-4" />ត្រឡប់</button></Link>
        <Link href="/welcome"><button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"><Home className="h-4 w-4" />ទំព័រដើម</button></Link>
      </div>

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
          លទ្ធផលប្រឡងរបស់សិស្សក្នុង <span className="text-blue-600">{province_name}</span>
        </h1>
        <p className="text-xl text-gray-600 mt-2">{headerDateText}</p>
      </header>

      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap gap-2 justify-center bg-white rounded-xl p-2 shadow-md">
          {/* <button onClick={() => setActiveTab("full-results")} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "full-results" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200 hidden"}`}>លទ្ធផលសរុប</button> */}
          <button onClick={() => setActiveTab("result-subject")} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "result-subject" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>មើលតាមមុខវិជ្ជា</button>
          <button onClick={() => setActiveTab("total-results")} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "total-results" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>របាយការណ៍</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-5 space-y-6">
            <div className="bg-gray-50 rounded-xl p-4 border">
              <div className="flex items-center gap-2 mb-3">
                <Filter className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">ការច្រោះយកទិន្នន័យ</h3>
              </div>
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 overflow-x-auto pb-2">
                <SelectFilter label="ឆ្នាំ" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} options={yearfilterOptions} />
                <SelectFilter label="ខែ" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} options={monthfilterOptions} />
                {activeTab !== "total-results" && (
                  <>
                    <SelectFilter label="ភេទ" value={selectedGender} onChange={e => setSelectedGender(e.target.value)} options={genderOptions} />
                    <SelectFilter label="និទ្ទេស" value={selectedAchievement} onChange={e => setSelectedAchievement(e.target.value)} options={achievementOptions} />
                  </>
                )}
                <SelectFilter label="ស្រុក" value={selectedDistrict} onChange={e => { setSelectedDistrict(e.target.value); setSelectedSchool(""); setSelectedClassLevel(""); setSelectedRoom(""); }} options={districtOptions} />
                <SelectFilter label="សាលារៀន" value={selectedSchool} onChange={e => { setSelectedSchool(e.target.value); setSelectedClassLevel(""); setSelectedRoom(""); }} options={schoolOptions.map(s => s.name)} disabled={!selectedDistrict || isFetchingOptions} />
                {activeTab !== "total-results" ? (
                  <>
                    <SelectFilter label="កម្រិតថ្នាក់" value={selectedClassLevel} onChange={e => { setSelectedClassLevel(e.target.value); setSelectedRoom(""); }} options={classLevelOptions} disabled={!selectedSchool || isFetchingOptions} />
                    <SelectFilter label="បន្ទប់" value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} options={roomOptions} disabled={!selectedClassLevel || isFetchingOptions} />
                  </>
                ) : (
                  <>
                    <SelectFilter label="កម្រិតថ្នាក់" value={selectedClassLevel} onChange={e => { setSelectedClassLevel(e.target.value); setSelectedRoom(""); }} options={classLevelOptions} />
                    <SelectFilter label="បន្ទប់" value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} options={roomOptions} disabled={!selectedClassLevel} />
                  </>
                )}
                <Button onClick={handleClearFilters} className="bg-red-500 hover:bg-red-600 text-white border-0">
                  <X className="h-4 w-4" /> លុបច្រោះ
                </Button>
                {activeTab === "total-results" && (
                  <Button onClick={handleDownloadCSV} className="bg-green-500 hover:bg-green-600 text-white">
                    <FileDown className="h-4 w-4" /> ទាញយក
                  </Button>
                )}

              </div>
            </div>

            {/* Search and pagination only for non-total-results tabs */}
            {activeTab !== "total-results" && (
              <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-blue-50 rounded-lg p-4">
                <div className="relative flex-1 sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="ស្វែងរកឈ្មោះ ឬ អត្តលេខ..." value={searchValue} onChange={e => setSearchValue(e.target.value)} className="pl-9" />
                </div>
                <Button onClick={handleDownloadCSV} className="bg-green-500 hover:bg-green-600 text-white">
                  <FileDown className="h-4 w-4" /> ទាញយកទិន្នន័យ
                </Button>
              </div>
            )}

            {activeTab !== "total-results" && (
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
                <p className="text-sm text-gray-600">បង្ហាញ {displayStart} - {displayEnd} ក្នុងចំណោម {(activeTab === "total-results" ? summaryData.length : filteredStudents.length).toLocaleString()}</p>
                <SelectFilter label="បង្ហាញ" value={rowsPerPage} onChange={e => { const v = e.target.value; setRowsPerPage(v === ALL_DATA_VALUE ? ALL_DATA_VALUE : Number(v)); setCurrentPage(1); }} options={rowsPerPageOptions} />
              </div>
            )}

            <div className="overflow-x-auto border rounded-lg">
              {activeTab === "full-results" && (
                <table className="min-w-full text-sm">
                  <thead className="bg-blue-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">អត្តលេខ</th>
                      <th className="px-4 py-3 text-left">ឈ្មោះសិស្ស</th>
                      <th className="px-4 py-3 text-center">ភេទ</th>
                      <th className="px-4 py-3 text-center">ថ្នាក់</th>
                      <th className="px-4 py-3 text-center">ថ្នាក់រៀន</th>
                      <th className="px-4 py-3 text-left">សាលា</th>
                      <th className="px-4 py-3 text-center">ស្រុក</th>
                      <th className="px-4 py-3 text-center">ខេត្ត</th>
                      <th className="px-4 py-3 text-center">ទូរស័ព្ទ</th>
                      <th className="px-4 py-3 text-center">ពិន្ទុ</th>
                      <th className="px-4 py-3 text-center">មធ្យម</th>
                      <th className="px-4 py-3 text-center">ចំណាត់</th>
                      <th className="px-4 py-3 text-center">និទ្ទេស</th>
                      <th className="px-4 py-3 text-center">លទ្ធផល</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginated.length > 0 ? paginated.map((r, i) => (
                      <tr key={r.id} className={`hover:bg-blue-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        <td className="px-4 py-3 text-center font-mono">{r.student_id}</td>
                        <td className="px-4 py-3">{r.full_name}</td>
                        <td className="px-4 py-3 text-center"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{r.gender}</span></td>
                        <td className="px-4 py-3 text-center font-bold">{r.grade}</td>
                        <td className="px-4 py-3 text-center text-indigo-600 font-bold">{r.exam_class}</td>
                        <td className="px-4 py-3">{r.school}</td>
                        <td className="px-4 py-3 text-center text-gray-600">{r.district}</td>
                        <td className="px-4 py-3 text-center text-blue-600 font-bold">{r.province}</td>
                        <td className="px-4 py-3 text-center">{r.phone_number}</td>
                        <td className="px-4 py-3 text-center text-indigo-600 font-bold">{r.score}</td>
                        <td className="px-4 py-3 text-center font-semibold">{r.average}</td>
                        <td className="px-4 py-3 text-center"><span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-bold">{r.rank}</span></td>
                        <td className="px-4 py-3 text-center"><span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-bold">{r.level}</span></td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-4 py-1.5 rounded-full font-bold ${r.result === "ជាប់" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{r.result}</span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan={14} className="text-center py-16 text-gray-500">មិនមានទិន្នន័យ</td></tr>
                    )}
                  </tbody>
                </table>
              )}

              {activeTab === "result-subject" && (
                <div className="overflow-x-auto">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    {/* Title - Stays left/top */}
                    <h3 className="text-lg font-semibold px-2">
                      លទ្ធផលតាមមុខវិជ្ជា
                    </h3>

                    {/* Button Group - Stacks on mobile, Rows on desktop */}
                    <div className="flex w-full sm:w-auto gap-2 px-2">
                      <Button
                        onClick={() => setShowScores(true)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2 px-4 ${showScores ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>ពិន្ទុ</span>
                      </Button>

                      <Button
                        onClick={() => setShowScores(false)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2 px-4 ${!showScores ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        <Eye className="h-4 w-4" />
                        <span>និទ្ទេស</span>
                      </Button>
                    </div>
                  </div>
                  <table className="min-w-full text-sm">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-4 py-3 text-left whitespace-nowrap">អត្តលេខ</th>
                        <th className="px-4 py-3 text-left whitespace-nowrap">ឈ្មោះសិស្ស</th>
                        <th className="px-4 py-3 text-center whitespace-nowrap">ភេទ</th>
                        <th className="px-4 py-3 text-center whitespace-nowrap">ថ្នាក់</th>
                        <th className="px-4 py-3 text-center whitespace-nowrap">បន្ទប់</th>
                        <th className="px-4 py-3 text-left whitespace-nowrap">សាលា</th>
                        <th className="px-4 py-3 text-center whitespace-nowrap">ស្រុក</th>
                        <th className="px-4 py-3 text-center whitespace-nowrap">ខេត្ត</th>
                        {SUBJECT_LIST.map(subject => (
                          <th key={subject.code} className="px-4 py-3 text-center whitespace-nowrap min-w-[120px]">
                            {subject.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {paginated.length > 0 ? paginated.map((r, i) => (
                        <tr key={r.id} className={`hover:bg-blue-50 ${i % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                          <td className="px-4 py-3 text-center font-mono whitespace-nowrap">{r.student_id}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{r.full_name}</td>
                          <td className="px-4 py-3 text-center whitespace-nowrap">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{r.gender}</span>
                          </td>
                          <td className="px-4 py-3 text-center font-bold whitespace-nowrap">{r.grade}</td>
                          <td className="px-4 py-3 text-center text-indigo-600 font-bold whitespace-nowrap">{r.exam_class}</td>
                          <td className="px-4 py-3 whitespace-nowrap">{r.school}</td>
                          <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap">{r.district}</td>
                          <td className="px-4 py-3 text-center text-blue-600 font-bold whitespace-nowrap">{r.province}</td>
                          {SUBJECT_LIST.map(subject => {
                            const subjectData = r.subjects?.[subject.name];
                            let displayValue = "";
                            let className = "";

                            if (showScores) {
                              displayValue = subjectData ? subjectData.score : "0";
                              className = displayValue !== "0" && displayValue !== 0 ? "text-blue-600 font-semibold" : "text-red-600";
                            } else {
                              if (subjectData?.level) {
                                displayValue = subjectData.level;
                                className =
                                  subjectData.level === "A" ? "bg-red-100 text-red-700" :
                                    subjectData.level === "B" ? "bg-purple-100 text-purple-700" :
                                      subjectData.level === "C" ? "bg-orange-100 text-orange-700" :
                                        subjectData.level === "D" ? "bg-blue-100 text-blue-700" :
                                          subjectData.level === "E" ? "bg-green-100 text-green-700" :
                                            "bg-gray-100 text-gray-700";
                              } else {
                                displayValue = "F";
                                className = "bg-gray-100 text-gray-700";
                              }
                            }

                            return (
                              <td key={`${r.id}-${subject.code}`} className="px-2 py-3 text-center whitespace-nowrap min-w-[120px]">
                                {showScores ? (
                                  <span className={className}>{displayValue}</span>
                                ) : (
                                  <span className={`px-2 py-1 rounded font-bold ${className}`}>
                                    {displayValue}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      )) : (
                        <tr><td colSpan={8 + SUBJECT_LIST.length} className="text-center py-16 text-gray-500">មិនមានទិន្នន័យ</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "total-results" && (
                <div className="overflow-x-auto border rounded-lg shadow-md">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    {/* Title Section */}
                    <h3 className="text-lg font-semibold px-2">
                      របាយការណ៍បូកសរុបនិទ្ទេស
                    </h3>

                    {/* Buttons Section */}
                    <div className="flex flex-wrap gap-2 px-2 w-full sm:w-auto">
                      <Button
                        onClick={() => setCountAllStudents(true)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${countAllStudents ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span className="text-sm">និទ្ទេសសិស្សទាំងអស់</span>
                      </Button>

                      <Button
                        onClick={() => setCountAllStudents(false)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${!countAllStudents ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
                          }`}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-sm">និទ្ទេសសិស្សបានប្រឡង</span>
                      </Button>
                    </div>
                  </div>
                  <table className="min-w-full text-sm border-collapse whitespace-nowrap">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th rowSpan={2} className="px-4 py-3 text-center border-r border-blue-500 whitespace-nowrap min-w-[60px]">សូចនាករ</th>
                        <th rowSpan={2} className="px-6 py-3 text-center border-r border-blue-500 whitespace-nowrap min-w-[140px]">មុខវិជ្ជា</th>
                        <th colSpan={2} className="px-3 py-2 text-center border-b border-blue-500 bg-blue-700 whitespace-nowrap min-w-[60px]">A</th>
                        <th colSpan={2} className="px-3 py-2 text-center border-b border-blue-500 bg-blue-700 whitespace-nowrap min-w-[60px]">B</th>
                        <th colSpan={2} className="px-3 py-2 text-center border-b border-blue-500 bg-blue-700 whitespace-nowrap min-w-[60px]">C</th>
                        <th colSpan={2} className="px-3 py-2 text-center border-b border-blue-500 bg-blue-700 whitespace-nowrap min-w-[60px]">D</th>
                        <th colSpan={2} className="px-3 py-2 text-center border-b border-blue-500 bg-blue-700 whitespace-nowrap min-w-[60px]">E</th>
                        <th colSpan={2} className="px-3 py-2 text-center border-b border-blue-500 bg-blue-700 whitespace-nowrap min-w-[60px]">F</th>
                        <th colSpan={2} className="px-3 py-2 text-center border-b border-blue-500 bg-purple-700 whitespace-nowrap min-w-[60px]">ABC</th>
                        <th colSpan={2} className="px-3 py-2 text-center border-b border-blue-500 bg-red-700 whitespace-nowrap min-w-[60px]">DEF</th>
                      </tr>
                      <tr>
                        <th className="px-2 py-1 text-center border-r border-blue-500 whitespace-nowrap">សរុប</th>
                        <th className="px-2 py-1 text-center whitespace-nowrap">ស្រី</th>
                        <th className="px-2 py-1 text-center border-r border-blue-500 whitespace-nowrap">សរុប</th>
                        <th className="px-2 py-1 text-center whitespace-nowrap">ស្រី</th>
                        <th className="px-2 py-1 text-center border-r border-blue-500 whitespace-nowrap">សរុប</th>
                        <th className="px-2 py-1 text-center whitespace-nowrap">ស្រី</th>
                        <th className="px-2 py-1 text-center border-r border-blue-500 whitespace-nowrap">សរុប</th>
                        <th className="px-2 py-1 text-center whitespace-nowrap">ស្រី</th>
                        <th className="px-2 py-1 text-center border-r border-blue-500 whitespace-nowrap">សរុប</th>
                        <th className="px-2 py-1 text-center whitespace-nowrap">ស្រី</th>
                        <th className="px-2 py-1 text-center border-r border-blue-500 whitespace-nowrap">សរុប</th>
                        <th className="px-2 py-1 text-center whitespace-nowrap">ស្រី</th>
                        <th className="px-2 py-1 text-center border-r border-blue-500 bg-purple-700 font-bold whitespace-nowrap">សរុប</th>
                        <th className="px-2 py-1 text-center bg-purple-700 font-bold whitespace-nowrap">ស្រី</th>
                        <th className="px-2 py-1 text-center border-r border-blue-500 bg-red-700 font-bold whitespace-nowrap">សរុប</th>
                        <th className="px-2 py-1 text-center bg-red-700 font-bold whitespace-nowrap">ស្រី</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {SUBJECT_LIST.map((subject, index) => {
                        const data = paginated.find(d => d.code === subject.code) || {
                          A: 0, A_female: 0, B: 0, B_female: 0, C: 0, C_female: 0,
                          D: 0, D_female: 0, E: 0, E_female: 0, F: 0, F_female: 0,
                          ABC: 0, ABC_female: 0, DEF: 0, DEF_female: 0,
                        };

                        return (
                          <tr key={subject.code} className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                            <td className="px-6 py-3 text-center font-mono border-r border-gray-300 whitespace-nowrap min-w-[60px]">{subject.code}</td>
                            <td className="px-6 py-3 text-left font-bold border-r border-gray-300 whitespace-nowrap min-w-[140px]">{subject.name}</td>
                            <td className="px-3 py-3 text-center border-r border-gray-300 min-w-[60px]">{data.A > 0 ? <span className="text-blue-600 font-semibold">{data.A}</span> : <span className="text-red-600">{data.A}</span>}</td>
                            <td className="px-3 py-3 text-center border-r border-gray-300 min-w-[60px]">{data.A_female > 0 ? <span className="text-blue-600 font-semibold">{data.A_female}</span> : <span className="text-red-600">{data.A_female}</span>}</td>
                            <td className="px-3 py-3 text-center border-r border-gray-300 min-w-[60px]">{data.B > 0 ? <span className="text-blue-600 font-semibold">{data.B}</span> : <span className="text-red-600">{data.B}</span>}</td>
                            <td className="px-3 py-3 text-center border-r border-gray-300 min-w-[60px]">{data.B_female > 0 ? <span className="text-blue-600 font-semibold">{data.B_female}</span> : <span className="text-red-600">{data.B_female}</span>}</td>
                            <td className="px-3 py-3 text-center border-r border-gray-300 min-w-[60px]">{data.C > 0 ? <span className="text-blue-600 font-semibold">{data.C}</span> : <span className="text-red-600">{data.C}</span>}</td>
                            <td className="px-3 py-3 text-center border-r border-gray-300 min-w-[60px]">{data.C_female > 0 ? <span className="text-blue-600 font-semibold">{data.C_female}</span> : <span className="text-red-600">{data.C_female}</span>}</td>
                            <td className="px-3 py-3 text-center border-r border-gray-300 min-w-[60px]">{data.D > 0 ? <span className="text-blue-600 font-semibold">{data.D}</span> : <span className="text-red-600">{data.D}</span>}</td>
                            <td className="px-3 py-3 text-center border-r border-gray-300 min-w-[60px]">{data.D_female > 0 ? <span className="text-blue-600 font-semibold">{data.D_female}</span> : <span className="text-red-600">{data.D_female}</span>}</td>
                            <td className="px-3 py-3 text-center border-r border-gray-300 min-w-[60px]">{data.E > 0 ? <span className="text-blue-600 font-semibold">{data.E}</span> : <span className="text-red-600">{data.E}</span>}</td>
                            <td className="px-3 py-3 text-center border-r border-gray-300 min-w-[60px]">{data.E_female > 0 ? <span className="text-blue-600 font-semibold">{data.E_female}</span> : <span className="text-red-600">{data.E_female}</span>}</td>
                            <td className="px-3 py-3 text-center border-r border-gray-300 min-w-[60px]">{data.F > 0 ? <span className="text-blue-600 font-semibold">{data.F}</span> : <span className="text-red-600">{data.F}</span>}</td>
                            <td className="px-3 py-3 text-center border-r border-gray-300 min-w-[60px]">{data.F_female > 0 ? <span className="text-blue-600 font-semibold">{data.F_female}</span> : <span className="text-red-600">{data.F_female}</span>}</td>
                            <td className="px-3 py-3 text-center font-bold text-purple-700 border-r border-gray-300 min-w-[60px]">{data.ABC > 0 ? <span className="text-blue-600 font-semibold">{data.ABC}</span> : <span className="text-red-600">{data.ABC}</span>}</td>
                            <td className="px-3 py-3 text-center font-bold text-purple-700 border-r border-gray-300 min-w-[60px]">{data.ABC_female > 0 ? <span className="text-blue-600 font-semibold">{data.ABC_female}</span> : <span className="text-red-600">{data.ABC_female}</span>}</td>
                            <td className="px-3 py-3 text-center font-bold text-red-700 border-r border-gray-300 min-w-[60px]">{data.DEF > 0 ? <span className="text-blue-600 font-semibold">{data.DEF}</span> : <span className="text-red-600">{data.DEF}</span>}</td>
                            <td className="px-3 py-3 text-center font-bold text-red-700 min-w-[60px]">{data.DEF_female > 0 ? <span className="text-blue-600 font-semibold">{data.DEF_female}</span> : <span className="text-red-600">{data.DEF_female}</span>}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {rowsPerPage !== ALL_DATA_VALUE && activeTab !== "total-results" && (
              <div className="flex justify-center gap-3">
                <Button size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>មុន</Button>
                <span className="py-2 px-4">ទំព័រ {currentPage} / {totalPages}</span>
                <Button size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>បន្ទាប់</Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const SelectFilter = ({ label, value, onChange, options, disabled = false }: any) => (
  <div className="relative w-full sm:w-auto">
    <select value={value} onChange={onChange} disabled={disabled} className="bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm appearance-none cursor-pointer disabled:opacity-50 w-full sm:w-auto">
      <option value="">{label}</option>
      {options.map((opt: any) => (
        <option key={typeof opt === "object" ? opt.id || opt.name : opt} value={typeof opt === "object" ? opt.name || opt : opt}>
          {typeof opt === "object" ? opt.name || opt : opt}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5.293 7.293l4.5 4.5 4.5-4.5L15.707 8 10 13.707 4.293 8z" /></svg>
    </div>
  </div>
);