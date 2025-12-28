"use client";
import React from "react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
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
  Eye,
  BarChart3,
} from "lucide-react";
import { API_BASE, MOCK_USERNAME, MOCK_PASSWORD } from "../../../../api/api.js";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
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
// UI Components
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
// Constants
const TOKEN_URL = `${API_BASE}/api/token/`;
const MONTH_NAME_TO_INT = {
  មករា: 1, កុម្ភៈ: 2, មីនា: 3, មេសា: 4, ឧសភា: 5, មិថុនា: 6,
  កក្កដា: 7, សីហា: 8, កញ្ញា: 9, តុលា: 10, វិច្ឆិកា: 11, ធ្នូ: 12,
};
const ALL_DATA_VALUE = "ទាំងអស់";
export default function ProvinceResultsPage() {
  const params = useParams();
  const province_id = params.province as string;
  const province_name = useMemo(() => PROVINCES.find(p => p.id === province_id)?.name || "", [province_id]);
  const [rawStudents, setRawStudents] = useState<any[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<any[]>([]);
  const [summaryData, setSummaryData] = useState<any[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [backgroundLoading, setBackgroundLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0); // Track loaded count
  const [totalCount, setTotalCount] = useState(0); // Track total count
  const [error, setError] = useState("");
  const [isFetchingOptions, setIsFetchingOptions] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedClassLevel, setSelectedClassLevel] = useState("");
  const [selectedRoom, setSelectedRoom] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedAchievement, setSelectedAchievement] = useState("");
  const [selectedStudentType, setSelectedStudentType] = useState("");
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("ធ្នូ");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [districtOptions, setDistrictOptions] = useState<string[]>([]);
  const [schoolOptions, setSchoolOptions] = useState<{ id: string; name: string }[]>([]);
  const [classLevelOptions, setClassLevelOptions] = useState<string[]>([]);
  const [roomOptions, setRoomOptions] = useState<string[]>([]);
  const [studentTypeOptions, setStudentTypeOptions] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("result-subject");
  const [showScores, setShowScores] = useState(true);
  const [countAllStudents, setCountAllStudents] = useState(true);
  const [showChartView, setShowChartView] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECT_LIST[0]?.code || "");
  const genderOptions = ["ប្រុស", "ស្រី"];
  const achievementOptions = ["A", "B", "C", "D", "E", "F"];
  const yearfilterOptions = ["2025", "2026", "2027"];
  const monthfilterOptions = [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
  ];
  const rowsPerPageOptions = [10, 20, 30, 40, 50, 100, 200, ALL_DATA_VALUE];
  // Subject options for dropdown
  const subjectOptions = useMemo(() => [
    { code: "ALL", name: "គ្រប់មុខវិជ្ជា" },
    ...SUBJECT_LIST
  ], []);
  const getAccessToken = useCallback(async () => {
    const res = await fetch(TOKEN_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: MOCK_USERNAME, password: MOCK_PASSWORD }),
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Token failed");
    const data = await res.json();
    return data.access;
  }, []);
  const fetchData = useCallback(async () => {
    if (!province_id) return;
    setLoading(true);
    setBackgroundLoading(true);
    setError("");
    setProgress(0); // Start from 0%
    setLoadedCount(20); // Reset loaded count
    setTotalCount(0); // Reset total count
    let token;
    try {
      // Initial progress for token acquisition (5%)
      setProgress(5);
      token = await getAccessToken();
      // Token acquired (10%)
      setProgress(10);
    } catch {
      setError("មិនអាចទទួលបាន token");
      setLoading(false);
      setBackgroundLoading(false);
      return;
    }
    const monthInt = MONTH_NAME_TO_INT[selectedMonth] || 12;
    const year = parseInt(selectedYear) || 2025;
    let baseUrl = `${API_BASE}/api/v1/result/result-Subjects-byMonth-Year/${province_id}/${monthInt}/${year}/`;
    // First, fetch just 20 rows to show immediately
    try {
      // Progress for starting initial fetch (15%)
      setProgress(15);
      // Fetch first 20 rows
      const initialRes = await fetch(`${baseUrl}?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!initialRes.ok) throw new Error("API error");
      const initialJson = await initialRes.json();
      // Process and display the first 20 rows immediately
      const initialMapped = initialJson.results.map((r: any) => {
        const subjects = r.subjects || {};
        return {
          id: `${r.student_ID || ""}${r.geip_school_ID || ""}`,
          student_id: r.student_ID || "",
          full_name: `${r.last_name || ""} ${r.first_name || ""}`.trim(),
          gender: r.gender || "",
          school: r.school_name || "",
          district: r.district_name || "",
          province: r.province_name || "",
          phone_number: r.phone_number || "",
          grade: r.grade || "",
          exam_class: r.room || "",
          student_type: r.student_type || "",
          exam_year: r.exam_year || year,
          exam_month: r.exam_month || monthInt,
          subjects: subjects,
          geip_school_ID: r.geip_school_ID || "",
        };
      });
      // Update UI with initial data (30%)
      setProgress(30);
      setRawStudents(initialMapped);
      setLoadedCount(initialMapped.length); // Update loaded count
      setTotalCount(initialJson.count || initialMapped.length); // Set total count
      // Stop the main loading indicator since we have data to show
      setLoading(false);
      // Now fetch the rest of the data in the background
      const totalCountValue = initialJson.count || initialJson.results.length;
      // If there's more data to fetch, continue in background
      if (totalCountValue > 20) {
        // Start background fetch (35%)
        setProgress(35);
        // Fetch remaining data in chunks of 10,000
        const CHUNK_SIZE = 10000;
        let allData = [...initialMapped];
        let fetchedCount = initialMapped.length;
        // Create URLs for remaining chunks
        const urls = [];
        for (let offset = 20; offset < totalCountValue; offset += CHUNK_SIZE) {
          urls.push(`${baseUrl}?limit=${CHUNK_SIZE}&offset=${offset}`);
        }
        // Process chunks with concurrency control
        const concurrency = 3; // Reduced concurrency to avoid overwhelming the server
        let processedBatches = 0;
        const totalBatches = Math.ceil(urls.length / concurrency);
        for (let i = 0; i < urls.length; i += concurrency) {
          const batch = urls.slice(i, i + concurrency);
          const batchResults = await Promise.all(
            batch.map(async (url) => {
              const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
              const json = await res.json();
              return json.results;
            })
          );
          // Process batch results
          batchResults.forEach(page => {
            const mappedPage = page.map((r: any) => {
              const subjects = r.subjects || {};
              return {
                id: `${r.student_ID || ""}${r.geip_school_ID || ""}`,
                student_id: r.student_ID || "",
                full_name: `${r.last_name || ""} ${r.first_name || ""}`.trim(),
                gender: r.gender || "",
                school: r.school_name || "",
                district: r.district_name || "",
                province: r.province_name || "",
                phone_number: r.phone_number || "",
                grade: r.grade || "",
                exam_class: r.room || "",
                student_type: r.student_type || "",
                exam_year: r.exam_year || year,
                exam_month: r.exam_month || monthInt,
                subjects: subjects,
                geip_school_ID: r.geip_school_ID || "",
              };
            });
            allData = allData.concat(mappedPage);
            fetchedCount += mappedPage.length;
            setLoadedCount(fetchedCount); // Update loaded count
          });
          processedBatches++;
          // Update progress based on batches processed (35-95%)
          const batchProgress = 35 + (processedBatches / totalBatches) * 60;
          const dataProgress = 35 + (fetchedCount / totalCountValue) * 60;
          setProgress(Math.round(Math.max(batchProgress, dataProgress)));
          // Update UI with new data
          setRawStudents([...allData]);
        }
      }
      // Complete (100%)
      setProgress(100);
    } catch (err) {
      setError(`មិនទាន់មានទិន្នន័យ`);
    } finally {
      // Small delay to ensure 100% is visible
      setTimeout(() => {
        setBackgroundLoading(false);
      }, 300);
    }
  }, [province_id, selectedMonth, selectedYear, getAccessToken]);
  useEffect(() => {
    if (province_id) fetchData();
  }, [province_id, selectedMonth, selectedYear, fetchData]);
  // Update district options from rawStudents
  useEffect(() => {
    const districts = [...new Set(rawStudents.map((d: any) => d.district).filter(Boolean))].sort();
    setDistrictOptions(districts);
  }, [rawStudents]);
  // Update school options based on selectedDistrict
  useEffect(() => {
    if (selectedDistrict) {
      const schoolsMap = new Map<string, string>();
      rawStudents.filter((s: any) => s.district === selectedDistrict).forEach((s: any) => {
        if (s.geip_school_ID && s.school) {
          schoolsMap.set(s.geip_school_ID, s.school);
        }
      });
      const schools = Array.from(schoolsMap, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
      setSchoolOptions(schools);
    } else {
      setSchoolOptions([]);
    }
    setSelectedSchool("");
    setSelectedClassLevel("");
    setSelectedRoom("");
    setSelectedStudentType("");
  }, [selectedDistrict, rawStudents]);
  // Update class level options based on selectedSchool (and district)
  useEffect(() => {
    if (selectedSchool) {
      const grades = [...new Set(rawStudents.filter(g => g.district === selectedDistrict && g.geip_school_ID === selectedSchool).map((g: any) => String(g.grade ?? "")).filter(Boolean))].sort();
      setClassLevelOptions(grades);
    } else {
      setClassLevelOptions([]);
    }
    setSelectedClassLevel("");
    setSelectedRoom("");
    setSelectedStudentType("");
  }, [selectedSchool, selectedDistrict, rawStudents]);
  // Update room options based on selectedClassLevel (and school)
  useEffect(() => {
    if (selectedClassLevel) {
      const rooms = [...new Set(rawStudents.filter(r => r.district === selectedDistrict && r.geip_school_ID === selectedSchool && r.grade === selectedClassLevel).map((r: any) => String(r.exam_class ?? "")).filter(Boolean))].sort();
      setRoomOptions(rooms);
    } else {
      setRoomOptions([]);
    }
    setSelectedRoom("");
    setSelectedStudentType("");
  }, [selectedClassLevel, selectedSchool, selectedDistrict, rawStudents]);
  // Update student type options based on selectedClassLevel
  useEffect(() => {
    if (["11", "12"].includes(selectedClassLevel) && rawStudents.length > 0) {
      const types = [...new Set(rawStudents.filter(s => s.grade === selectedClassLevel && s.student_type).map(s => s.student_type))].sort();
      setStudentTypeOptions(types);
    } else {
      setStudentTypeOptions([]);
      setSelectedStudentType("");
    }
  }, [selectedClassLevel, rawStudents]);
  // Client-side filtering for all filters
  useEffect(() => {
    let tempFiltered = rawStudents;
    if (selectedDistrict) tempFiltered = tempFiltered.filter(r => r.district === selectedDistrict);
    if (selectedSchool) tempFiltered = tempFiltered.filter(r => r.geip_school_ID === selectedSchool);
    if (selectedClassLevel) tempFiltered = tempFiltered.filter(r => r.grade === selectedClassLevel);
    if (selectedRoom) tempFiltered = tempFiltered.filter(r => r.exam_class === selectedRoom);
    if (selectedGender) tempFiltered = tempFiltered.filter(r => r.gender === selectedGender);
    if (selectedAchievement) tempFiltered = tempFiltered.filter(r => r.level === selectedAchievement);
    if (selectedStudentType) tempFiltered = tempFiltered.filter(r => r.student_type === selectedStudentType);
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
    selectedDistrict,
    selectedSchool,
    selectedClassLevel,
    selectedRoom,
    selectedGender,
    selectedAchievement,
    selectedStudentType,
    searchValue,
  ]);
  // Aggregate for total-results
  useEffect(() => {
    if (!filteredStudents.length) return;
    const summaryMap = new Map<string, any>();
    SUBJECT_LIST.forEach(subject => {
      summaryMap.set(subject.code, {
        code: subject.code,
        name: subject.name,
        A: 0, A_female: 0, B: 0, B_female: 0, C: 0, C_female: 0,
        D: 0, D_female: 0, E: 0, E_female: 0, F: 0, F_female: 0,
        ABC: 0, ABC_female: 0, DEF: 0, DEF_female: 0,
      });
    });
    if (countAllStudents) {
      filteredStudents.forEach((r: any) => {
        const isFemale = r.gender === "ស្រី";
        SUBJECT_LIST.forEach(subject => {
          const level = r.subjects?.[subject.name]?.level || "F";
          const summary = summaryMap.get(subject.code);
          if (level === "A") { summary.A += 1; if (isFemale) summary.A_female += 1; }
          else if (level === "B") { summary.B += 1; if (isFemale) summary.B_female += 1; }
          else if (level === "C") { summary.C += 1; if (isFemale) summary.C_female += 1; }
          else if (level === "D") { summary.D += 1; if (isFemale) summary.D_female += 1; }
          else if (level === "E") { summary.E += 1; if (isFemale) summary.E_female += 1; }
          else { summary.F += 1; if (isFemale) summary.F_female += 1; }
          summary.ABC = summary.A + summary.B + summary.C;
          summary.ABC_female = summary.A_female + summary.B_female + summary.C_female;
          summary.DEF = summary.D + summary.E + summary.F;
          summary.DEF_female = summary.D_female + summary.E_female + summary.F_female;
        });
      });
    } else {
      SUBJECT_LIST.forEach(subject => {
        const summary = summaryMap.get(subject.code);
        filteredStudents.forEach((r: any) => {
          const subjData = r.subjects?.[subject.name];
          if (subjData?.score > 0) {
            const level = subjData.level;
            const isFemale = r.gender === "ស្រី";
            if (level === "A") { summary.A += 1; if (isFemale) summary.A_female += 1; }
            else if (level === "B") { summary.B += 1; if (isFemale) summary.B_female += 1; }
            else if (level === "C") { summary.C += 1; if (isFemale) summary.C_female += 1; }
            else if (level === "D") { summary.D += 1; if (isFemale) summary.D_female += 1; }
            else if (level === "E") { summary.E += 1; if (isFemale) summary.E_female += 1; }
            else { summary.F += 1; if (isFemale) summary.F_female += 1; }
          }
        });
        summary.ABC = summary.A + summary.B + summary.C;
        summary.ABC_female = summary.A_female + summary.B_female + summary.C_female;
        summary.DEF = summary.D + summary.E + summary.F;
        summary.DEF_female = summary.D_female + summary.E_female + summary.F_female;
      });
    }
    setSummaryData(Array.from(summaryMap.values()));
  }, [filteredStudents, countAllStudents]);
  // Calculate total for all subjects
  const totalAllSubjects = useMemo(() => {
    if (!summaryData.length) return null;
    const total = {
      code: "TOTAL",
      name: "១០ គ្រប់មុខវិជ្ជា",
      A: 0, A_female: 0, B: 0, B_female: 0, C: 0, C_female: 0,
      D: 0, D_female: 0, E: 0, E_female: 0, F: 0, F_female: 0,
      ABC: 0, ABC_female: 0, DEF: 0, DEF_female: 0,
    };
    summaryData.forEach(subject => {
      total.A += subject.A;
      total.A_female += subject.A_female;
      total.B += subject.B;
      total.B_female += subject.B_female;
      total.C += subject.C;
      total.C_female += subject.C_female;
      total.D += subject.D;
      total.D_female += subject.D_female;
      total.E += subject.E;
      total.E_female += subject.E_female;
      total.F += subject.F;
      total.F_female += subject.F_female;
      total.ABC += subject.ABC;
      total.ABC_female += subject.ABC_female;
      total.DEF += subject.DEF;
      total.DEF_female += subject.DEF_female;
    });
    return total;
  }, [summaryData]);
  // Get selected subject data
  const selectedSubjectData = useMemo(() => {
    if (selectedSubject === "ALL" && totalAllSubjects) {
      return totalAllSubjects;
    }
    return summaryData.find(s => s.code === selectedSubject) || summaryData[0];
  }, [summaryData, selectedSubject, totalAllSubjects]);
  // Bar chart data for A-F grades
  const barChartData = useMemo(() => {
    if (!selectedSubjectData) return null;
    const grades = ['A', 'B', 'C', 'D', 'E', 'F'];
    const totalData = grades.map(grade => selectedSubjectData[grade]);
    const femaleData = grades.map(grade => selectedSubjectData[`${grade}_female`]);
    const maleData = grades.map(grade => selectedSubjectData[grade] - selectedSubjectData[`${grade}_female`]);
    return {
      labels: grades,
      datasets: [
        {
          label: 'ប្រុស',
          data: maleData,
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'ស្រី',
          data: femaleData,
          backgroundColor: 'rgba(236, 72, 153, 0.7)',
          borderColor: 'rgba(236, 72, 153, 1)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        },
      ]
    };
  }, [selectedSubjectData]);
  // Bar chart data for ABC vs DEF
  const abcDefBarData = useMemo(() => {
    if (!selectedSubjectData) return null;
    const abcMale = selectedSubjectData.ABC - selectedSubjectData.ABC_female;
    const abcFemale = selectedSubjectData.ABC_female;
    const defMale = selectedSubjectData.DEF - selectedSubjectData.DEF_female;
    const defFemale = selectedSubjectData.DEF_female;
    return {
      labels: ['ABC', 'DEF'],
      datasets: [
        {
          label: 'ប្រុស',
          data: [abcMale, defMale],
          backgroundColor: 'rgba(99, 102, 241, 0.7)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        },
        {
          label: 'ស្រី',
          data: [abcFemale, defFemale],
          backgroundColor: 'rgba(236, 72, 153, 0.7)',
          borderColor: 'rgba(236, 72, 153, 1)',
          borderWidth: 1,
          borderRadius: 6,
          borderSkipped: false,
        }
      ]
    };
  }, [selectedSubjectData]);
  // Custom tooltip for bar charts
  const barTooltip = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    titleColor: '#333',
    bodyColor: '#333',
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 12,
    displayColors: true,
    callbacks: {
      title: function(context: any) {
        return context[0].label;
      },
      label: function(context: any) {
        const label = context.dataset.label || '';
        const value = context.raw || 0;
        const total = context.chart.data.datasets.reduce((sum: number, dataset: any) => sum + dataset.data[context.dataIndex], 0);
        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
        return `${label}: ${value} (${percentage}%)`;
      },
      afterBody: function(context: any) {
        const dataIndex = context[0].dataIndex;
        const label = context[0].label;
        const maleValue = context[0].dataset.label === 'ប្រុស' ? context[0].raw : 
                          context[0].chart.data.datasets.find((d: any) => d.label === 'ប្រុស')?.data[dataIndex] || 0;
        const femaleValue = context[0].dataset.label === 'ស្រី' ? context[0].raw : 
                           context[0].chart.data.datasets.find((d: any) => d.label === 'ស្រី')?.data[dataIndex] || 0;
        const total = maleValue + femaleValue;
        return [
          `សរុប: ${total}`,
        ];
      }
    }
  };
  // Chart options for bar charts
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: 'bold'
          },
          usePointStyle: true,
          pointStyle: 'rectRounded'
        }
      },
      tooltip: barTooltip,
      title: {
        display: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          font: {
            size: 12
          },
          precision: 0
        },
        title: {
          display: true,
          text: 'ចំនួនសិស្ស',
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      }
    },
    animation: {
      duration: 1000,
      easing: 'easeOutQuart' as const
    },
    interaction: {
      mode: 'index' as const,
      intersect: false
    }
  };
  const handleClearFilters = () => {
    setSelectedDistrict("");
    setSelectedSchool("");
    setSelectedClassLevel("");
    setSelectedRoom("");
    setSelectedGender("");
    setSelectedAchievement("");
    setSelectedStudentType("");
    setSelectedYear("2025");
    setSelectedMonth("ធ្នូ");
    setSearchValue("");
  };
  const handleDownloadCSV = () => {
    let headers = [];
    let rows = [];
    let headerTitle = "";
    if (activeTab === "result-subject") {
      headerTitle = "បញ្ជីឈ្មោះសិស្សនិងលទ្ធផលតេស្ដស្ដង់ដា";
      headers = ["អត្តលេខ", "គោត្តនាម និងនាម", "ភេទ", "សាលរៀន", "ស្រុក", "ខេត្ត", "កម្រិតថ្នាក់", "បន្ទប់"];
      SUBJECT_LIST.forEach(subject => {
        headers.push(showScores ? `${subject.name}` : `${subject.name}`);
      });
      rows = filteredStudents.map(r => {
        const row = [r.student_id, r.full_name, r.gender, r.school, r.district, r.province, r.grade, r.exam_class];
        SUBJECT_LIST.forEach(subject => {
          const subj = r.subjects?.[subject.name];
          row.push(showScores ? (subj?.score || "0") : (subj?.level || "F"));
        });
        return row;
      });
    } else if (activeTab === "total-results") {
      headerTitle = "របាយការណ៍បូកសរុបលទ្ធិផលតេស្ដស្ដង់ដា";
      headers = ["សូចនាករ", "មុខវិជ្ជា", "A", "ស្រី", "B", "ស្រី", "C", "ស្រី", "D", "ស្រី", "E", "ស្រី", "F", "ស្រី", "ABC", "ស្រី", "DEF", "ស្រី"];
      rows = summaryData.map((r) => [r.code, r.name, r.A, r.A_female, r.B, r.B_female, r.C, r.C_female, r.D, r.D_female, r.E, r.E_female, r.F, r.F_female, r.ABC, r.ABC_female, r.DEF, r.DEF_female]);
    }
    const schoolName = filteredStudents.length > 0 ? filteredStudents[0].school : "";
    const officialHeader = [
      ["ព្រះរាជាណាចក្រកម្ពុជា"],
      ["ជាតិ សាសនា ព្រះមហាក្សត្រ"],
      ["ក្រសួងអប់រំ យុវជន និងកីឡា"],
      ["គម្រោងកែលម្អការអប់រំចំណេះដីងទូទៅ Moeys Edtech " + headerTitle],
      ["សាកលវិទ្យាល័យភូមិន្ទភ្នំពេញ ( ស..ភ.ភព )"],
      [schoolName ? `វិទ្យាល័យ ${schoolName}` : "វិទ្យាល័យ by name school"],
      [""], [""],
      [`ទិន្នន័យសិស្សក្នុង${selectedMonth ? ` ខែ ${selectedMonth}` : ""}${selectedYear ? ` ឆ្នាំ ${selectedYear}` : ""}`],
      [`ខេត្ត: ${province_name}`],
      [""], [""],
      headers
    ];
    const allRows = [...officialHeader, ...rows];
    const csv = allRows.map((row, index) => {
      if (row.length === 1 && row[0] === "") return "";
      if (index < 7 || index === 8 || index === 9) return `"${row[0]}"`;
      return row.map(cell => `"${cell}"`).join(",");
    }).join("\n");
    const BOM = "\uFEFF";
    const csvContent = BOM + csv;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
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
  const displayStart = useMemo(() => (currentPage - 1) * rowsPerPage + 1, [currentPage, rowsPerPage]);
  const displayEnd = useMemo(() => Math.min(currentPage * rowsPerPage, activeTab === "total-results" ? summaryData.length : filteredStudents.length), [currentPage, rowsPerPage, activeTab, summaryData.length, filteredStudents.length]);
  const headerDateText = useMemo(() => selectedMonth || selectedYear ? (
    <>ទិន្នន័យសិស្សក្នុង {selectedMonth && <>ខែ <span className="text-blue-600 font-bold">{selectedMonth}</span></>} {selectedYear && <>{selectedMonth ? " " : ""}ឆ្នាំ <span className="text-blue-600 font-bold">{selectedYear}</span></>}</>
  ) : "ទិន្នន័យលទ្ធផលសិស្ស", [selectedMonth, selectedYear]);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center max-w-md w-full px-4">
          <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
          <p className="text-xl font-semibold text-gray-700 mb-4">កំពុងផ្ទុកទិន្នន័យ {province_name}...</p>
          <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-700 h-full flex items-center justify-center text-white font-bold text-lg transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            >
              {progress > 10 && `${loadedCount.toLocaleString()}`}
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            កំពុងទាញយកទិន្នន័យសិស្ស... {loadedCount.toLocaleString()}នាក់ដំបូង
          </p>
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
            <button onClick={() => { setError(""); fetchData(); }} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg">
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
        <Link href="/results"><button className="flex items-center gap-2
              bg-blue-600 hover:bg-blue-700 text-white font-bold
              px-3 py-2 text-xs
              sm:px-4 sm:py-2 sm:text-sm
              md:px-5 md:py-3 md:text-base
              rounded-lg shadow-lg transition"><ArrowLeft className="h-4 w-4" />ត្រឡប់</button></Link>
        <Link href="/welcome"><button className="
              flex items-center gap-2
              bg-green-600 hover:bg-green-700 text-white font-bold
              px-3 py-2 text-xs
              sm:px-4 sm:py-2 sm:text-sm
              md:px-5 md:py-3 md:text-base
              rounded-lg shadow-lg transition
            ">
              <Home className="w-4 h-4 sm:w-5 sm:h-5" /> ទំព័រដើម
            </button></Link>
      </div>
      <header className="text-center mb-6 sm:mb-8">
        <div className="flex justify-center mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md ring-1 ring-gray-200">
            <div className="rounded-lg bg-blue-50 p-2 sm:p-3 ring-1 ring-blue-100">
              <Image
                src="/moeys-logo.png"
                alt="MoEYS Logo"
                width={48}
                height={48}
                className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
              />
            </div>
            <div className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base leading-tight text-left">
              MoEYS EdTech - GEIP ICT Team
            </div>
          </div>
        </div>
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 leading-tight px-2">
          លទ្ធផលប្រឡងរបស់សិស្សក្នុង <span className="text-blue-600">{province_name}</span>
        </h1>
        <p className="text-xl text-gray-600 mt-2">{headerDateText}</p>
      </header>
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-wrap gap-2 justify-center bg-white rounded-xl p-2 shadow-md">
          <button onClick={() => setActiveTab("result-subject")} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "result-subject" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>មើលតាមមុខវិជ្ជា</button>
          <button onClick={() => setActiveTab("total-results")} className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === "total-results" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>របាយការណ៍</button>
        </div>
      </div>
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white shadow-lg">
          <CardContent className="p-5 space-y-6">
            {/* === FILTER SECTION - UPDATED === */}
            <div className="bg-gray-50 rounded-xl p-4 border">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold">ការច្រោះយកទិន្នន័យ</h3>
              </div>
              {/* Phone layout: Multiple rows */}
              <div className="sm:hidden">
                {/* Top row: ឆ្នាំ ខែ ភេទ និទ្ទេស */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <SelectFilter label="ឆ្នាំ" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} options={yearfilterOptions} />
                  <SelectFilter label="ខែ" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} options={monthfilterOptions} />
                  {activeTab !== "total-results" && (
                    <>
                      <SelectFilter label="ភេទ" value={selectedGender} onChange={e => setSelectedGender(e.target.value)} options={genderOptions} />
                      <SelectFilter label="និទ្ទេស" value={selectedAchievement} onChange={e => setSelectedAchievement(e.target.value)} options={achievementOptions} />
                    </>
                  )}
                  {activeTab === "total-results" && (
                    <>
                      <div></div><div></div>
                    </>
                  )}
                </div>
                {/* ស្រុក and សាលារៀន */}
                <div className="grid grid-cols-1 gap-3 mb-3">
                  <SelectFilter label="ស្រុក" value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} options={districtOptions} />
                  <SelectFilter 
                    label="សាលារៀន" 
                    value={selectedSchool} 
                    onChange={e => setSelectedSchool(e.target.value)} 
                    options={schoolOptions} 
                    disabled={!selectedDistrict || isFetchingOptions} 
                  />
                </div>
                {/* កម្រិតថ្នាក់ and បន្ទប់ */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <SelectFilter 
                    label="កម្រិតថ្នាក់" 
                    value={selectedClassLevel} 
                    onChange={e => setSelectedClassLevel(e.target.value)} 
                    options={classLevelOptions} 
                    disabled={!selectedSchool || isFetchingOptions} 
                  />
                  <SelectFilter 
                    label="បន្ទប់" 
                    value={selectedRoom} 
                    onChange={e => setSelectedRoom(e.target.value)} 
                    options={roomOptions} 
                    disabled={!selectedClassLevel || isFetchingOptions} 
                  />
                </div>
                {/* Optional ប្រភេទសិស្ស + Clear button */}
                <div className="space-y-3">
                  {["11", "12"].includes(selectedClassLevel) && studentTypeOptions.length > 0 && (
                    <SelectFilter 
                      label="ប្រភេទសិស្ស" 
                      value={selectedStudentType} 
                      onChange={e => setSelectedStudentType(e.target.value)} 
                      options={studentTypeOptions} 
                    />
                  )}
                  <div className="flex gap-3">
                    <Button onClick={handleClearFilters} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                      <X className="h-4 w-4" /> លុបច្រោះ
                    </Button>
                    {activeTab === "total-results" && (
                      <Button onClick={handleDownloadCSV} className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                        <FileDown className="h-4 w-4" /> ទាញយក
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            {/* Non-phone layout: Single row for all filters */}
            <div className="hidden sm:block">
              <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 overflow-x-auto pb-2">
                <SelectFilter label="ឆ្នាំ" value={selectedYear} onChange={e => setSelectedYear(e.target.value)} options={yearfilterOptions} />
                <SelectFilter label="ខែ" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} options={monthfilterOptions} />
                {activeTab !== "total-results" && (
                  <>
                    <SelectFilter label="ភេទ" value={selectedGender} onChange={e => setSelectedGender(e.target.value)} options={genderOptions} />
                    <SelectFilter label="និទ្ទេស" value={selectedAchievement} onChange={e => setSelectedAchievement(e.target.value)} options={achievementOptions} />
                  </>
                )}
                <SelectFilter label="ស្រុក" value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} options={districtOptions} />
                <SelectFilter label="សាលារៀន" value={selectedSchool} onChange={e => setSelectedSchool(e.target.value)} options={schoolOptions} disabled={!selectedDistrict || isFetchingOptions} />
                {activeTab !== "total-results" ? (
                  <>
                    <SelectFilter label="កម្រិតថ្នាក់" value={selectedClassLevel} onChange={e => setSelectedClassLevel(e.target.value)} options={classLevelOptions} disabled={!selectedSchool || isFetchingOptions} />
                    <SelectFilter label="បន្ទប់" value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} options={roomOptions} disabled={!selectedClassLevel || isFetchingOptions} />
                  </>
                ) : (
                  <>
                    <SelectFilter label="កម្រិតថ្នាក់" value={selectedClassLevel} onChange={e => setSelectedClassLevel(e.target.value)} options={classLevelOptions} disabled={!selectedSchool} />
                    <SelectFilter label="បន្ទប់" value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} options={roomOptions} disabled={!selectedClassLevel} />
                  </>
                )}
                {["11", "12"].includes(selectedClassLevel) && studentTypeOptions.length > 0 && (
                  <SelectFilter label="ប្រភេទសិស្ស" value={selectedStudentType} onChange={e => setSelectedStudentType(e.target.value)} options={studentTypeOptions} />
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
          </div>
            {activeTab !== "total-results" && (
              <div className="flex flex-row sm:flex-row gap-2 justify-between items-center bg-blue-50 rounded-lg p-4">
                <div className="relative flex-1 sm:w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input placeholder="ស្វែងរកឈ្មោះ ឬអត្តលេខ..." value={searchValue} onChange={e => setSearchValue(e.target.value)} className="pl-9" />
                </div>
                <Button onClick={handleDownloadCSV} className="bg-green-500 hover:bg-green-600 text-white">
                  <FileDown className="h-4 w-4" /> ទាញយក
                </Button>
              </div>
            )}
            {activeTab !== "total-results" && (
              <div className="flex flex-row sm:flex-row justify-between items-center gap-2 bg-gray-50 rounded-lg px-4 py-3">
                <p className="text-sm text-gray-600 text-center sm:text-left">
                  {displayStart} - {displayEnd}, សរុប៖ {filteredStudents.length.toLocaleString()}
                  {backgroundLoading && <span className="ml-2 text-blue-600 font-medium">ផ្ទុកបន្ថែម... / {totalCount.toLocaleString()} នាក់</span>}
                </p>
                <div className="w-auto">
                  <SelectFilter 
                    label="" 
                    value={rowsPerPage} 
                    onChange={e => { 
                      const v = e.target.value; 
                      setRowsPerPage(v === ALL_DATA_VALUE ? ALL_DATA_VALUE : Number(v)); 
                      setCurrentPage(1); 
                    }} 
                    options={rowsPerPageOptions} 
                  />
                </div>
              </div>
            )}
            <div className="overflow-x-auto border rounded-lg">
              {activeTab === "result-subject" && (
                <div className="overflow-x-auto">
                  <div className="flex flex-row sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
                    <h3 className="text-sm sm:text-lg font-semibold px-2">
                      លទ្ធផលតាមមុខវិជ្ជា
                    </h3>
                    <div className="flex w-full sm:w-auto gap-2 px-2">
                      <Button
                        onClick={() => setShowScores(true)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2 px-4 ${showScores ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span>ពិន្ទុ</span>
                      </Button>
                      <Button
                        onClick={() => setShowScores(false)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2 px-4 ${!showScores ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
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
                        <th className="px-4 py-3 text-left whitespace-nowrap">គោត្តនាម និងនាម</th>
                        <th className="px-4 py-3 text-center whitespace-nowrap">ភេទ</th>
                        <th className="px-4 py-3 text-center whitespace-nowrap">ថ្នាក់</th>
                        <th className="px-4 py-3 text-center whitespace-nowrap">បន្ទប់</th>
                        <th className="px-4 py-3 text-center whitespace-nowrap">សាលា</th>
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
                        <tr key={r.id} className={`hover:bg-blue-50 ${i % 2 === 0 ? "bg-white " : "bg-gray-50"}`}>
                          <td className="px-4 py-3 text-center font-mono whitespace-nowrap border-r border-gray-200 ">{r.student_id}</td>
                          <td className="px-4 py-3 whitespace-nowrap border-r border-gray-200">{r.full_name}</td>
                          <td className="px-4 py-3 text-center whitespace-nowrap border-r border-gray-200">
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded">{r.gender}</span>
                          </td>
                          <td className="px-4 py-3 text-center font-bold whitespace-nowrap border-r border-gray-200">{r.grade}</td>
                          <td className="px-4 py-3 text-center text-indigo-600 font-bold whitespace-nowrap border-r border-gray-200">{r.exam_class}</td>
                          <td className="px-4 py-3 whitespace-nowrap border-r border-gray-200">{r.school}</td>
                          <td className="px-4 py-3 text-center text-gray-600 whitespace-nowrap border-r border-gray-200">{r.district}</td>
                          <td className="px-4 py-3 text-center text-blue-600 font-bold whitespace-nowrap border-r border-gray-200">{r.province}</td>
                          {SUBJECT_LIST.map(subject => {
                            const subjectData = r.subjects?.[subject.name];
                            let displayValue = "";
                            let className = "";
                            if (showScores) {
                              displayValue = subjectData ? subjectData.score : "0";
                              className = displayValue !== "0" && displayValue !== 0 ? "text-blue-600 font-semibold " : "text-red-600";
                            } else {
                              if (subjectData?.level) {
                                displayValue = subjectData.level;
                                className =
                                  subjectData.level === "A" ? "bg-red-100 text-red-700 " :
                                    subjectData.level === "B" ? "bg-purple-100 text-purple-700" :
                                      subjectData.level === "C" ? "bg-orange-100 text-orange-700" :
                                        subjectData.level === "D" ? "bg-blue-100 text-blue-700" :
                                          subjectData.level === "E" ? "bg-green-100 text-green-700" :
                                            "bg-gray-100 text-gray-700 ";
                              } else {
                                displayValue = "F";
                                className = "bg-gray-100 text-gray-700";
                              }
                            }
                            return (
                              <td key={`${r.id}-${subject.code}`} className="px-2 py-3 text-center whitespace-nowrap min-w-[120px] border-r border-gray-200">
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
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 className="text-lg font-semibold px-2">
                      របាយការណ៍បូកសរុបនិទ្ទេស
                    </h3>
                    <div className="flex flex-wrap gap-2 px-0 sm:p-2 w-full sm:w-auto mt-2 ">
                      <Button
                        onClick={() => setCountAllStudents(true)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${countAllStudents ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span className="text-xs sm:text-xs">ទាំងអស់</span>
                      </Button>
                      <Button
                        onClick={() => setCountAllStudents(false)}
                        className={`flex-1 xs sm:text-xs:flex-none flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-colors ${!countAllStudents ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"}`}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="text-xs sm:text-xs">បានប្រឡង</span>
                      </Button>
                      <Button
                        onClick={() => setShowChartView(!showChartView)}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-2 py-2 px-4 rounded-md transition-all transform hover:scale-105 ${showChartView ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg" : "bg-gray-200 text-gray-700"}`}
                      >
                        <BarChart3 className="h-4 w-4" />
                        <span className="text-sm">ក្រាហ្វិក</span>
                      </Button>
                    </div>
                  </div>
                  {showChartView ? (
                    <div className="space-y-8">
                      {/* Subject selector dropdown */}
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mx-2 sm:mx-4">
                        {/* Flex column on mobile, row on sm+ */}
                        <div className="flex flex-row items-center justify-between gap-8 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="text-sm sm:text-lg font-semibold text-blue-900 whitespace-nowrap">
                            ជ្រើសរើសមុខវិជ្ជា
                          </h3>
                          <div className="relative w-full sm:w-64">
                            <select
                              value={selectedSubject}
                              onChange={(e) => setSelectedSubject(e.target.value)}
                              className="w-full bg-white border border-gray-300 text-gray-700 py-2.5 px-2 rounded-lg text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                            >
                              {subjectOptions.map((subject) => (
                                <option key={subject.code} value={subject.code}>
                                  {subject.name}
                                </option>
                              ))}
                            </select>
                            {/* Custom dropdown arrow */}
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5.293 7.293l4.5 4.5 4.5-4.5L15.707 8 10 13.707 4.293 8z" />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Charts section */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:mx-2">
                        {/* Bar chart 1: A-F grades */}
                        <div className="bg-white rounded-xl shadow-lg py-6 px-1 border border-gray-100 hover:shadow-xl transition-shadow">
                          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
                            និទ្ទេស A-F {selectedSubject === "ALL" ? "គ្រប់មុខវិជ្ជា" : `មុខវិជ្ជា៖ ${selectedSubjectData?.name}`}
                          </h3>
                          <div className="relative h-80">
                            {barChartData && <Bar data={barChartData} options={barOptions} />}
                          </div>
                          <div className="mt-4 text-center">
                            {/* <p className="text-sm text-gray-600">សរុបសិស្ស: {Object.values(selectedSubjectData || {}).reduce((sum: any, val: any) => typeof val === 'number' && !String(val).includes('female') ? sum + val : sum, 0)}</p> */}
                            <p className="text-sm text-gray-600">សរុបសិស្ស: {filteredStudents.length.toLocaleString()}</p>
                          </div>
                        </div>
                        {/* Bar chart 2: ABC vs DEF */}
                        <div className="bg-white rounded-xl shadow-lg py-6 px-1 border border-gray-100 hover:shadow-xl transition-shadow">
                          <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
                            និទ្ទេស ABC & DEF {selectedSubject === "ALL" ? "គ្រប់មុខវិជ្ជា" : `មុខវិជ្ជា៖ ${selectedSubjectData?.name}`}
                          </h3>
                          <div className="relative h-80">
                            {abcDefBarData && <Bar data={abcDefBarData} options={barOptions} />}
                          </div>
                          <div className="mt-4 text-center">
                            <p className="text-sm text-gray-600">សរុបសិស្ស: {filteredStudents.length.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      {/* Summary statistics */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200 shadow-md">
                        <h3 className="text-lg font-semibold mb-4 text-blue-800">សរុបនិទ្ទេស{selectedSubject === "ALL" ? "គ្រប់មុខវិជ្ជា" : "គ្រប់មុខវិជ្ជា"}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-white rounded-lg p-4 shadow-md">
                            <h4 className="font-medium text-center mb-4 text-gray-700">សរុបនិទ្ទេស A-F</h4>
                            <div className="space-y-3">
                              {['A', 'B', 'C', 'D', 'E', 'F'].map(grade => {
                                const total = selectedSubject === "ALL" 
                                  ? selectedSubjectData[grade]
                                  : summaryData.reduce((sum, subject) => sum + subject[grade], 0);
                                const female = selectedSubject === "ALL"
                                  ? selectedSubjectData[`${grade}_female`]
                                  : summaryData.reduce((sum, subject) => sum + subject[`${grade}_female`], 0);
                                const percentage = selectedSubject === "ALL"
                                  ? ((total / (selectedSubjectData.A + selectedSubjectData.B + selectedSubjectData.C + selectedSubjectData.D + selectedSubjectData.E + selectedSubjectData.F)) * 100).toFixed(1)
                                  : summaryData.reduce((sum, subject) => sum + (subject.A + subject.B + subject.C + subject.D + subject.E + subject.F), 0) > 0 
                                    ? ((total / summaryData.reduce((sum, subject) => sum + (subject.A + subject.B + subject.C + subject.D + subject.E + subject.F), 0)) * 100).toFixed(1)
                                    : 0;
                                return (
                                  <div key={grade} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="font-medium">និទ្ទេស {grade}:</span>
                                    <div className="text-right">
                                      <span className="font-bold text-blue-600">{total}</span>
                                      <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
                                      <div className="text-xs text-gray-600">ស្រី: {female}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="bg-white rounded-lg p-4 shadow-md">
                            <h4 className="font-medium text-center mb-4 text-gray-700">សរុបនិទ្ទេស ABC និង DEF</h4>
                            <div className="space-y-3">
                              {['ABC', 'DEF'].map(grade => {
                                const total = selectedSubject === "ALL"
                                  ? selectedSubjectData[grade]
                                  : summaryData.reduce((sum, subject) => sum + subject[grade], 0);
                                const female = selectedSubject === "ALL"
                                  ? selectedSubjectData[`${grade}_female`]
                                  : summaryData.reduce((sum, subject) => sum + subject[`${grade}_female`], 0);
                                const percentage = selectedSubject === "ALL"
                                  ? ((total / (selectedSubjectData.ABC + selectedSubjectData.DEF)) * 100).toFixed(1)
                                  : summaryData.reduce((sum, subject) => sum + (subject.ABC + subject.DEF), 0) > 0 
                                    ? ((total / summaryData.reduce((sum, subject) => sum + (subject.ABC + subject.DEF), 0)) * 100).toFixed(1)
                                    : 0;
                                return (
                                  <div key={grade} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                    <span className="font-medium">និទ្ទេស {grade}:</span>
                                    <div className="text-right">
                                      <span className="font-bold text-blue-600">{total}</span>
                                      <span className="text-sm text-gray-500 ml-2">({percentage}%)</span>
                                      <div className="text-xs text-gray-600">ស្រី: {female}</div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="overflow-x-auto border rounded-lg shadow-md">
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
                          {paginated.length > 0 ? paginated.map((data, index) => (
                            <tr key={data.code} className={`hover:bg-blue-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                              <td className="px-6 py-3 text-center font-mono border-r border-gray-300 whitespace-nowrap min-w-[60px]">{data.code}</td>
                              <td className="px-6 py-3 text-left font-bold border-r border-gray-300 whitespace-nowrap min-w-[140px]">{data.name}</td>
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
                          )) : (
                            <tr><td colSpan={18} className="text-center py-16 text-gray-500">មិនមានទិន្នន័យ</td></tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
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
      {options.map((opt: any) => {
        const optValue = typeof opt === "object" ? opt.id : opt;
        const optLabel = typeof opt === "object" ? opt.name : opt;
        return (
          <option key={optValue} value={optValue}>
            {optLabel}
          </option>
        );
      })}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
      <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M5.293 7.293l4.5 4.5 4.5-4.5L15.707 8 10 13.707 4.293 8z" /></svg>
    </div>
  </div>
);