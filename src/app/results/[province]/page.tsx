"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
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
} from "lucide-react";
import { API_BASE, MOCK_USERNAME, MOCK_PASSWORD } from "../../../../api/api.js";

// --- UI Components (unchanged) ---
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
  else if (variant === "outline")
    baseStyles += " border border-input bg-background hover:bg-accent hover:text-accent-foreground";
  else if (variant === "ghost")
    baseStyles += " hover:bg-accent hover:text-accent-foreground";

  if (className.includes("bg-green-500") || className.includes("bg-red-500")) {
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
  const province_name = useMemo(() => decodeProvinceName(params?.province), [params?.province]);

  // States
  const [allResults, setAllResults] = useState<any[]>([]); // Master dataset
  const [filteredResults, setFilteredResults] = useState<any[]>([]); // Displayed dataset
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFetchingOptions, setIsFetchingOptions] = useState(false);

  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClassLevel, setSelectedClassLevel] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAchievement, setSelectedAchievement] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("ធ្នូ");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [schoolOptions, setSchoolOptions] = useState<{ id: string; name: string }[]>([]);
  const [classLevelOptions, setClassLevelOptions] = useState<string[]>([]);

  const genderOptions = ["ប្រុស", "ស្រី"];
  const achievementOptions = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const yearfilterOptions = ["2025", "2026", "2027"];
  const monthfilterOptions = [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
  ];
  const rowsPerPageOptions = [10, 20, 30, 40, 50, 100, ALL_DATA_VALUE];

  const getAccessToken = useCallback(async () => {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: MOCK_USERNAME, password: MOCK_PASSWORD }),
    });
    if (!res.ok) throw new Error("Failed to get token");
    const data = await res.json();
    return data.access;
  }, []);

  // Fetch the COMPLETE dataset for the province ONCE
  const fetchAllData = useCallback(async () => {
    if (!province_name) return;
    setLoading(true);
    setError("");

    const url = `${API_BASE}/api/v1/result/full-results/${encodeURIComponent(province_name)}/`;
    console.log("Fetching ALL data for province →", url);

    try {
      const token = await getAccessToken();
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
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
        // Add year and month fields
        exam_year: r.exam_year || new Date().getFullYear().toString(),
        exam_month: r.exam_month || new Date().getMonth() + 1,
      }));

      setAllResults(mapped);
      // Initial display will be handled by the filter effect
    } catch (err: any) {
      setError(`បរាជ័យក្នុងការផ្ទុកទិន្នន័យ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [province_name, getAccessToken]);

  // Fetch filter options based on the full dataset
  const fetchFilterOptions = useCallback(() => {
    if (allResults.length === 0) return;
    setIsFetchingOptions(true);
    try {
      // 1. Districts
      const districts = [...new Set(allResults.map((d: any) => d.district).filter(Boolean))].sort();
      setDistrictOptions(districts);

      if (!selectedDistrict) {
        setSchoolOptions([]);
        setClassLevelOptions([]);
        setIsFetchingOptions(false);
        return;
      }

      // 2. Schools (filtered by selectedDistrict)
      let schools: { id: string; name: string }[] = [];
      if (selectedDistrict) {
        const schoolSet = new Set<string>();

        allResults
          .filter((s: any) => s.district === selectedDistrict)
          .forEach((s: any) => {
            if (s.school) {
              schoolSet.add(s.school);
            }
          });
        
        schools = Array.from(schoolSet.keys())
          .map(name => ({ id: name, name: name }))
          .sort((a, b) => a.name.localeCompare(b.name));
      }
      setSchoolOptions(schools);

      // 3. Grades (filtered by selectedDistrict AND selectedSchool)
      let grades: string[] = [];
      if (selectedDistrict && selectedSchool) {
        grades = [...new Set(
          allResults
            .filter(g => g.district === selectedDistrict && g.school === selectedSchool)
            .map((g: any) => String(g.grade ?? "")).filter(Boolean)
        )].sort();
      }
      setClassLevelOptions(grades);
    } catch (err) {
      console.error("Error loading filters:", err);
    } finally {
      setIsFetchingOptions(false);
    }
  }, [allResults, selectedDistrict, selectedSchool]);

  // --- MAIN FILTERING LOGIC ---
  // This effect runs whenever any filter or search term changes
  useEffect(() => {
    let tempFiltered = allResults;

    // Apply dropdown filters
    if (selectedDistrict) {
      tempFiltered = tempFiltered.filter(r => r.district === selectedDistrict);
    }
    if (selectedSchool) {
      tempFiltered = tempFiltered.filter(r => r.school === selectedSchool);
    }
    if (selectedClassLevel) {
      tempFiltered = tempFiltered.filter(r => r.grade === selectedClassLevel);
    }
    if (selectedGender) {
      tempFiltered = tempFiltered.filter(r => r.gender === selectedGender);
    }
    if (selectedAchievement) {
      tempFiltered = tempFiltered.filter(r => r.level === selectedAchievement);
    }
    
    // FIX: Add year and month filtering
    if (selectedYear) {
      tempFiltered = tempFiltered.filter(r => String(r.exam_year) === selectedYear);
    }
    if (selectedMonth) {
      const monthInt = MONTH_NAME_TO_INT[selectedMonth];
      if (monthInt) {
        tempFiltered = tempFiltered.filter(r => {
          const examMonth = parseInt(r.exam_month);
          return !isNaN(examMonth) && examMonth === monthInt;
        });
      }
    }

    // Apply search filter
    if (searchValue.trim()) {
      const val = searchValue.trim().toLowerCase();
      tempFiltered = tempFiltered.filter(
        (r) =>
          r.full_name.toLowerCase().includes(val) ||
          r.student_id.includes(val) ||
          r.school.toLowerCase().includes(val)
      );
    }

    setFilteredResults(tempFiltered);
    setCurrentPage(1); // Reset to first page on filter
  }, [
    allResults,
    searchValue,
    selectedDistrict,
    selectedSchool,
    selectedClassLevel,
    selectedGender,
    selectedAchievement,
    selectedYear,
    selectedMonth,
  ]);

  // --- EFFECTS ---
  // 1. Initial data fetch when the province name is available
  useEffect(() => {
    if (province_name) {
      fetchAllData();
    }
  }, [province_name, fetchAllData]);

  // 2. Load filter options when the main data or district/school selection changes
  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  // --- HANDLERS ---
  const handleClearFilters = () => {
    setSelectedDistrict("");
    setSelectedSchool("");
    setSelectedClassLevel("");
    setSelectedGender("");
    setSelectedAchievement("");
    setSelectedYear("2025");
    setSelectedMonth("ធ្នូ");
    setSearchValue("");
  };

  const handleDownloadCSV = () => {
    const headers = [
      "ID", "Student ID", "Full Name", "Gender", "School", "District", "Province",
      "Phone", "Score", "Average", "Grade", "Class", "Rank", "Level", "Result", "Year", "Month"
    ];
    const rows = filteredResults.map(r => [
      r.id, r.student_id, r.full_name, r.gender, r.school, r.district, r.province,
      r.phone_number, r.score, r.average, r.grade, r.exam_class, r.rank, r.level, r.result, r.exam_year, r.exam_month
    ]);
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    // Add BOM for proper Cambodian character (Unicode) display in Excel
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${province_name}_results.csv`;
    link.click();
  };

  // --- LOGIC ---
  const totalPages = rowsPerPage === ALL_DATA_VALUE ? 1 : Math.max(1, Math.ceil(filteredResults.length / rowsPerPage));
  const paginated = useMemo(() => {
    if (rowsPerPage === ALL_DATA_VALUE) return filteredResults;
    const start = (currentPage - 1) * rowsPerPage;
    return filteredResults.slice(start, start + rowsPerPage);
  }, [filteredResults, currentPage, rowsPerPage]);

  const displayStart = filteredResults.length ? (currentPage - 1) * rowsPerPage + 1 : 0;
  const displayEnd = filteredResults.length ? Math.min(currentPage * rowsPerPage, filteredResults.length) : 0;

  const headerDateText = selectedMonth || selectedYear ? (
    <>ទិន្នន័យសិស្សក្នុង {selectedMonth && <>ខែ <span className="text-blue-600 font-bold">{selectedMonth}</span></>} {selectedYear && <>{selectedMonth ? " " : ""}ឆ្នាំ <span className="text-blue-600 font-bold">{selectedYear}</span></>}</>
  ) : "ទិន្នន័យលទ្ធផលសិស្ស";

  if (loading && !allResults.length) {
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
          <Link href="/results">
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg">
              <ArrowLeft className="inline h-4 w-4 mr-2" /> ត្រឡប់ទៅជ្រើសរើសខេត្ត
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      {/* Navigation */}
      <div className="max-w-7xl mx-auto flex justify-around sm:justify-around sm:gap-4 mb-6">
        <Link href="/results"><button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"><ArrowLeft className="h-4 w-4" />ត្រឡប់</button></Link>
        <Link href="/welcome"><button className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"><Home className="h-4 w-4" />ទំព័រដើម</button></Link>
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
        <h1 className="text-4xl font-extrabold">
          លទ្ធផលប្រឡងរបស់សិស្សក្នុង <span className="text-blue-600">{province_name}</span>
        </h1>
        <p className="text-xl text-gray-600 mt-2">{headerDateText}</p>
      </header>

      <div className="max-w-7xl mx-auto">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-5 space-y-6">
            {/* Filters */}
            <div className="bg-gray-50 rounded-xl p-4 border">
              <div className="flex items-center gap-2 mb-3"><Filter className="h-5 w-5 text-blue-600" /><h3 className="font-semibold">ការច្រោះយកទិន្នន័យ</h3></div>
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
                <SelectFilter label="ឆ្នាំ" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} options={yearfilterOptions} />
                <SelectFilter label="ខែ" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} options={monthfilterOptions} />
                <SelectFilter label="ភេទ" value={selectedGender} onChange={e => setSelectedGender(e.target.value)} options={genderOptions} />
                <SelectFilter 
                  label="ស្រុក" 
                  value={selectedDistrict} 
                  onChange={e => { setSelectedDistrict(e.target.value); setSelectedSchool(""); setSelectedClassLevel(""); }} 
                  options={districtOptions} 
                />
                <SelectFilter 
                  label="សាលារៀន" 
                  value={selectedSchool} 
                  onChange={e => { setSelectedSchool(e.target.value); setSelectedClassLevel(""); }} 
                  options={schoolOptions.map(s => s.name)} 
                  disabled={!selectedDistrict || isFetchingOptions} 
                />
                <SelectFilter 
                  label="កម្រិតថ្នាក់" 
                  value={selectedClassLevel} 
                  onChange={e => setSelectedClassLevel(e.target.value)} 
                  options={classLevelOptions} 
                  disabled={!selectedSchool || isFetchingOptions} 
                />
                <SelectFilter label="និទ្ទេស" value={selectedAchievement} onChange={e => setSelectedAchievement(e.target.value)} options={achievementOptions} />
                
                {/* The filter button is no longer needed, but a clear button is essential */}
                <Button onClick={handleClearFilters} className="bg-red-500 hover:bg-red-600 text-white border-0">
                  <X className="h-4 w-4" /> លុបច្រោះ
                </Button>
              </div>
            </div>

            {/* Search & Download */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-center bg-blue-50 rounded-lg p-4">
              <div className="relative flex-1 sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input placeholder="ស្វែងរកឈ្មោះ ឬ អត្តលេខ..." value={searchValue} onChange={e => setSearchValue(e.target.value)} className="pl-9" />
              </div>
              <Button onClick={handleDownloadCSV} className="bg-green-500 hover:bg-green-600 text-white">
                <FileDown className="h-4 w-4" /> ទាញយក CSV
              </Button>
            </div>
            {/* Pagination Info */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-sm text-gray-600">
                បង្ហាញ {displayStart} - {displayEnd} ក្នុងចំណោម {filteredResults.length.toLocaleString()}
              </p>
              <SelectFilter label="បង្ហាញ" value={rowsPerPage} onChange={e => { const v = e.target.value; setRowsPerPage(v === ALL_DATA_VALUE ? ALL_DATA_VALUE : Number(v)); setCurrentPage(1); }} options={rowsPerPageOptions} />
            </div>

            {/* Table */}
            <div className="overflow-x-auto border rounded-lg">
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
                        <span className={`px-4 py-1.5 rounded-full font-bold ${r.result === "ជាប់" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                          {r.result}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={14} className="text-center py-16 text-gray-500">មិនមានទិន្នន័យ</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {rowsPerPage !== ALL_DATA_VALUE && (
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
  <div className="relative">
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm appearance-none cursor-pointer disabled:opacity-50"
    >
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