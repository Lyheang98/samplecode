// app/examdata/page.tsx

"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  BarChart3,
  Users,
  UserCheck,
  UserX,
  School,
  MapPin,
  DoorOpen,
  RefreshCw,
  LogOut,
  Lock,
  User,
  ChevronDown,
  PieChart,
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarController,
  PieController,
} from "chart.js";

interface ExamStats {
  exam_period: { year: number; month: number };
  summary: {
    total_students: number;
    examined_students: number;
    not_examined_students: number;
    participation_rate_percent: number;
  };
  by_province: Array<{
    province_name: string;
    province_id: string;
    total: number;
    examined: number;
    not_examined: number;
    participation_rate_percent: number;
  }>;
  by_district: Array<{
    province_name: string;
    province_id: string;
    district_name: string;
    total: number;
    examined: number;
    not_examined: number;
    participation_rate_percent: number;
  }>;
  by_school: Array<{
    geip_school_ID: string;
    school_name: string;
    province_name: string;
    province_id: string;
    district_name: string;
    total: number;
    examined: number;
    not_examined: number;
    participation_rate_percent: number;
  }>;
  by_room: Array<{
    geip_school_ID: string;
    school_name: string;
    province_name: string;
    province_id: string;
    district_name: string;
    grade: string;
    room: string;
    total: number;
    examined: number;
    not_examined: number;
    participation_rate_percent: number;
  }>;
}

const monthNames = [
  "",
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

// const API_BASE = "http://127.0.0.1:8000";
const API_BASE = "https://moeys-exam-qbfys.ondigitalocean.app";
const TOKEN_URL = `${API_BASE}/api/token/`;
const STATS_URL = `${API_BASE}/api/v1/result/exam-participation-stats/`;

export default function ExamParticipationReport() {
  const [data, setData] = useState<ExamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "summary" | "province" | "district" | "school" | "room"
  >("summary");

  // Filter states
  const [selectedProvince, setSelectedProvince] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedSchool, setSelectedSchool] = useState("all");
  const [selectedGrade, setSelectedGrade] = useState("all");

  // Dropdown visibility
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);

  // Pagination
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Chart
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [chartInitialized, setChartInitialized] = useState(false);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Register Chart.js components
  useEffect(() => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      BarController,
      PieController,
      Title,
      Tooltip,
      Legend,
      ArcElement
    );
    setChartInitialized(true);
  }, []);

  // Check for saved token
  useEffect(() => {
    const savedToken = localStorage.getItem("access_token");
    if (savedToken) {
      setToken(savedToken);
      fetchStats(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const login = async () => {
    if (!username || !password) {
      setLoginError("សូមបំពេញឈ្មោះអ្នកប្រើ និងពាក្យសម្ងាត់");
      return;
    }

    setLoginError("");
    setLoading(true);

    try {
      const res = await fetch(TOKEN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "ចូលប្រព័ន្មិនបាន");
      }

      const json = await res.json();
      const accessToken = json.access;

      localStorage.setItem("access_token", accessToken);
      setToken(accessToken);
      await fetchStats(accessToken);
    } catch (err: any) {
      setLoginError(err.message || "មានបញ្ហាចូលប្រព័ន្ធ");
      setLoading(false);
    }
  };

  const fetchStats = async (accessToken: string, category?: string, loadMore = false) => {
    try {
      const dataCategory = category || activeTab;
      let url = `${STATS_URL}?category=${dataCategory}`;

      // Add filter parameters to the URL
      if (selectedProvince !== "all") {
        url += `&province_name=${encodeURIComponent(selectedProvince)}`;
      }
      if (selectedDistrict !== "all") {
        url += `&district_name=${encodeURIComponent(selectedDistrict)}`;
      }
      if (selectedSchool !== "all") {
        url += `&geip_school_ID=${encodeURIComponent(selectedSchool)}`;
      }
      if (selectedGrade !== "all") {
        url += `&grade=${encodeURIComponent(selectedGrade)}`;
      }

      // Determine limit based on tab
      const limit = (dataCategory === "school" || dataCategory === "room") ? 500 : 100;

      if (loadMore && data && getCurrentData().length > 0) {
        url += `&offset=${getCurrentData().length}&limit=${limit}`;
      } else if (activeTab !== "summary") {
        url += `&offset=0&limit=${limit}`;
      }

      if (loadMore) setIsLoadingMore(true);
      else if (!data) setLoading(true);

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (res.status === 401) {
        localStorage.removeItem("access_token");
        setToken(null);
        setError("Token ផុតកំណត់។ សូមចូលប្រព័ន្ធម្តងទៀត។");
        setLoading(false);
        return;
      }

      if (!res.ok) throw new Error("មិនអាចទាញទិន្នន័យ");

      const json = await res.json();

      if (dataCategory === "summary") {
        setData(json);
      } else {
        const resultsKey = `by_${dataCategory}` as keyof ExamStats;

        if (loadMore && data) {
          const existing = (data[resultsKey] as any[]) || [];
          setData({
            ...data,
            [resultsKey]: [...existing, ...json.results],
          });
        } else {
          setData((prev) => ({
            ...(prev || { 
              by_province: [], 
              by_district: [], 
              by_school: [], 
              by_room: [], 
              exam_period: { year: 0, month: 0 }, 
              summary: { 
                total_students: 0, 
                examined_students: 0, 
                not_examined_students: 0, 
                participation_rate_percent: 0 
              } 
            } as ExamStats),
            [resultsKey]: json.results,
          }));
        }

        setTotalCount(json.count);
        setHasMore(json.next !== null);
      }

      setError("");
    } catch (err) {
      setError("មិនអាចទាញទិន្នន័យ។ សូមពិនិត្យការតភ្ជាប់");
    } finally {
      setLoading(false);
      setIsLoadingMore(false);
    }
  };

  const handleRefresh = async () => {
    if (!token) return;
    setLoading(true);
    setError("");
    await fetchStats(token);
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setToken(null);
    setData(null);
    setUsername("");
    setPassword("");
    setLoginError("");
  };

  // Refetch data when filters change
  useEffect(() => {
    setHasMore(true);
    if (token && activeTab !== "summary") {
      fetchStats(token, activeTab, false);
    }
  }, [activeTab, selectedProvince, selectedDistrict, selectedSchool, selectedGrade]);

  // Derived filter options - FIX: Add null checks
  const provinces = data?.by_province
    ? [...new Set(data.by_province.map((p) => p.province_name))].filter(Boolean).sort()
    : [];

  const districts = data?.by_district
    ? [
        ...new Set(
          data.by_district
            .filter(
              (d) =>
                selectedProvince === "all" ||
                d.province_name === selectedProvince
            )
            .map((d) => d.district_name)
        ),
      ].filter(Boolean).sort()
    : [];

  const schools = data?.by_school
    ? data.by_school
        .filter(
          (s) =>
            (selectedProvince === "all" ||
              s.province_name === selectedProvince) &&
            (selectedDistrict === "all" ||
              s.district_name === selectedDistrict)
        )
        .sort((a, b) =>
          (a.school_name || "").localeCompare(b.school_name || "")
        )
    : [];

  const grades = data?.by_room
    ? [
        ...new Set(
          data.by_room
            .filter(
              (r) =>
                (selectedProvince === "all" ||
                  r.province_name === selectedProvince) &&
                (selectedDistrict === "all" ||
                  r.district_name === selectedDistrict) &&
                (selectedSchool === "all" ||
                  r.geip_school_ID === selectedSchool)
            )
            .map((r) => r.grade)
        ),
      ].filter(Boolean).sort((a, b) => parseInt(a || "0") - parseInt(b || "0"))
    : [];

  const getCurrentData = () => {
    if (!data) return [];
    switch (activeTab) {
      case "province":
        return data.by_province || [];
      case "district":
        return data.by_district || [];
      case "school":
        return data.by_school || [];
      case "room":
        return data.by_room || [];
      default:
        return [];
    }
  };

  const currentData = getCurrentData();

  const getFilteredSummary = () => {
    if (activeTab === "summary") {
      return data?.summary || {
        total_students: 0,
        examined_students: 0,
        not_examined_students: 0,
        participation_rate_percent: 0,
      };
    }

    let total = 0,
      examined = 0,
      notExamined = 0;

    currentData.forEach((item: any) => {
      total += item.total || 0;
      examined += item.examined || 0;
      notExamined += item.not_examined || 0;
    });

    return {
      total_students: total,
      examined_students: examined,
      not_examined_students: notExamined,
      participation_rate_percent:
        total > 0 ? parseFloat(((examined / total) * 100).toFixed(1)) : 0,
    };
  };

  const filteredSummary = getFilteredSummary();

  // New function to get entity summary
  const getEntitySummary = () => {
    if (activeTab === "summary") return null;

    const data = getCurrentData();
    if (data.length === 0) return null;

    let totalEntities = 0;
    let entitiesWithExam = 0;
    let entityLabel = "";

    switch (activeTab) {
      case "province":
        totalEntities = data.length;
        entitiesWithExam = data.filter(p => p.examined > 0).length;
        entityLabel = "ខេត្ត/រាជធានី";
        break;
      case "district":
        totalEntities = data.length;
        entitiesWithExam = data.filter(d => d.examined > 0).length;
        entityLabel = "ស្រុក/ខណ្ឌ";
        break;
      case "school":
        totalEntities = data.length;
        entitiesWithExam = data.filter(s => s.examined > 0).length;
        entityLabel = "សាលារៀន";
        break;
      case "room":
        totalEntities = data.length;
        entitiesWithExam = data.filter(r => r.examined > 0).length;
        entityLabel = "បន្ទប់";
        break;
    }

    return {
      totalEntities,
      entitiesWithExam,
      entityLabel,
      percentage: totalEntities > 0 ? ((entitiesWithExam / totalEntities) * 100).toFixed(1) : 0
    };
  };

  const entitySummary = getEntitySummary();

  const loadMoreData = async () => {
    if (!token || isLoadingMore || !hasMore) return;
    await fetchStats(token, activeTab, true);
  };

  const Dropdown = ({
    label,
    value,
    onChange,
    options,
    showDropdown,
    setShowDropdown,
    displayValue,
  }: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    options: string[];
    showDropdown: boolean;
    setShowDropdown: (v: boolean) => void;
    displayValue?: string;
  }) => (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2 min-w-[200px] hover:bg-gray-50"
      >
        <span>{displayValue || (value === "all" ? `ជ្រើសរើស${label}` : value)}</span>
        <ChevronDown className="h-4 w-4" />
      </button>
      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          <div
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => {
              onChange("all");
              setShowDropdown(false);
            }}
          >
            ទាំងអស់
          </div>
          {options.map((option) => (
            <div
              key={option}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                onChange(option);
                setShowDropdown(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const LoadMore = () => {
    if (activeTab === "summary" || !hasMore || currentData.length === 0)
      return null;

    const limit = (activeTab === "school" || activeTab === "room") ? 200 : 100;

    return (
      <div className="flex items-center justify-center mt-4">
        <button
          onClick={loadMoreData}
          disabled={isLoadingMore}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-6 py-3 rounded-lg flex items-center gap-2"
        >
          {isLoadingMore ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
              កំពុងផ្ទុក...
            </>
          ) : (
            <>
              បង្ហាញបន្ថែម {limit} ជួរ
              <ChevronDown className="h-4 w-4" />
            </>
          )}
        </button>
        <div className="text-sm text-gray-700 ml-4">
          បានបង្ហាញ {currentData.length} នៃ {totalCount || 0} ជួរ
        </div>
      </div>
    );
  };

  // Chart rendering
  useEffect(() => {
    if (!data || activeTab !== "summary" || !chartInitialized) return;

    const chartData = filteredSummary;

    // Destroy old charts
    ["participationChart", "participationPieChart"].forEach((id) => {
      const chart = ChartJS.getChart(id);
      if (chart) chart.destroy();
    });

    if (chartType === "bar") {
      const ctx = document
        .getElementById("participationChart")
        ?.getContext("2d");
      if (ctx) {
        try {
          new ChartJS(ctx, {
            type: "bar",
            data: {
              labels: ["សិស្សសរុប", "បានប្រឡង", "មិនបានប្រឡង"],
              datasets: [
                {
                  label: "ចំនួន",
                  data: [
                    chartData.total_students,
                    chartData.examined_students,
                    chartData.not_examined_students,
                  ],
                  backgroundColor: [
                    "rgba(59, 130, 246, 0.8)",
                    "rgba(34, 197, 94, 0.8)",
                    "rgba(239, 68, 68, 0.8)",
                  ],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (context) =>
                      `${context.parsed.y.toLocaleString()} នាក់`,
                  },
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: { callback: (value) => value.toLocaleString() },
                },
              },
            },
          });
        } catch (error) {
          console.error("Error creating bar chart:", error);
        }
      }
    } else {
      const ctx = document
        .getElementById("participationPieChart")
        ?.getContext("2d");
      if (ctx) {
        try {
          new ChartJS(ctx, {
            type: "pie",
            data: {
              labels: ["បានប្រឡង", "មិនបានប្រឡង"],
              datasets: [
                {
                  data: [
                    chartData.examined_students,
                    chartData.not_examined_students,
                  ],
                  backgroundColor: [
                    "rgba(34, 197, 94, 0.8)",
                    "rgba(239, 68, 68, 0.8)",
                  ],
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: "bottom" },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const total =
                        context.dataset.data.reduce(
                          (a: number, b: number) => a + b,
                          0
                        );
                      const percentage = ((context.parsed / total) * 100).toFixed(
                        1
                      );
                      return `${context.label}: ${context.parsed.toLocaleString()} (${percentage}%)`;
                    },
                  },
                },
              },
            },
          });
        } catch (error) {
          console.error("Error creating pie chart:", error);
        }
      }
    }
  }, [data, activeTab, filteredSummary, chartType, chartInitialized]);

  const handleTabClick = (key: any) => {
    setActiveTab(key);
    setHasMore(true);
  };

  // Login Screen
  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-10 w-10 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">ចូលប្រព័ន្ធ</h2>
            <p className="text-gray-600 mt-2">របាយការណ៍ចូលរួមប្រឡងសិស្ស</p>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ឈ្មោះអ្នកប្រើ
              </label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="បញ្ចូលឈ្មោះអ្នកប្រើ"
                  onKeyDown={(e) => e.key === "Enter" && login()}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ពាក្យសម្ងាត់
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="បញ្ចូលពាក្យសម្ងាត់"
                  onKeyDown={(e) => e.key === "Enter" && login()}
                />
              </div>
            </div>

            {loginError && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                {loginError}
              </div>
            )}

            <button
              onClick={login}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                  កំពុងចូល...
                </>
              ) : (
                "ចូលប្រព័ន្ធ"
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-medium text-gray-700">កំពុងផ្ទុកទិន្នន័យ...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <UserX className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-3">មានបញ្ហា</h2>
          <p className="text-gray-600 mb-6">{error || "មិនមានទិន្នន័យ"}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg inline-flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            ព្យាយាមម្តងទៀត
          </button>
        </div>
      </div>
    );
  }

  const { exam_period } = data;
  const summary = activeTab === "summary" ? data.summary : filteredSummary;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              របាយការណ៍ចូលរួមប្រឡងសិស្ស
            </h1>
            <p className="text-2xl text-blue-700 font-semibold mt-2">
              ខែ {monthNames[exam_period.month]} ឆ្នាំ {exam_period.year}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 shadow"
            >
              <RefreshCw className="h-5 w-5" />
              ធ្វើបច្ចុប្បន្នភាព
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 shadow"
            >
              <LogOut className="h-5 w-5" />
              ចាកចេញ
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <p className="text-gray-600">សិស្សសរុប</p>
            <p className="text-3xl font-bold text-gray-900">
              {summary.total_students.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <UserCheck className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <p className="text-gray-600">បានប្រឡង</p>
            <p className="text-3xl font-bold text-green-600">
              {summary.examined_students.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <UserX className="h-12 w-12 text-red-600 mx-auto mb-3" />
            <p className="text-gray-600">មិនបានប្រឡង</p>
            <p className="text-3xl font-bold text-red-600">
              {summary.not_examined_students.toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <p className="text-gray-600">អត្រាចូលរួម</p>
            <p className="text-3xl font-bold text-purple-600">
              {summary.participation_rate_percent}%
            </p>
          </div>
        </div>

        {/* Entity Summary Cards - New addition */}
        {entitySummary && (
          <div className="flex gap-6 items-center justify-center mb-10 mx-40">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 w-[300px] text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">ចំនួន{entitySummary.entityLabel}សរុប</p>
                  <p className="text-2xl font-bold mt-2">
                    {entitySummary.totalEntities.toLocaleString()}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-blue-200" />
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 w-[300px] text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100">{entitySummary.entityLabel}ដែលមានសិស្សប្រឡង</p>
                  <p className="text-2xl font-bold mt-2">
                    {entitySummary.entitiesWithExam.toLocaleString()} ({entitySummary.percentage}%)
                  </p>
                </div>
                <UserCheck className="h-8 w-8 text-green-200" />
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="font-medium text-gray-700">តម្រង៖</span>

            {activeTab !== "summary" && (
              <Dropdown
                label="ខេត្ត"
                value={selectedProvince}
                onChange={setSelectedProvince}
                options={provinces}
                showDropdown={showProvinceDropdown}
                setShowDropdown={setShowProvinceDropdown}
              />
            )}

            {(activeTab === "district" ||
              activeTab === "school" ||
              activeTab === "room") && (
              <Dropdown
                label="ស្រុក/ខណ្ឌ"
                value={selectedDistrict}
                onChange={setSelectedDistrict}
                options={districts}
                showDropdown={showDistrictDropdown}
                setShowDropdown={setShowDistrictDropdown}
              />
            )}

            {(activeTab === "school" || activeTab === "room") && (
              <Dropdown
                label="សាលារៀន"
                value={selectedSchool}
                onChange={(val) => {
                  if (val === "all") setSelectedSchool("all");
                  else {
                    const school = schools.find(
                      (s) => s.school_name === val
                    );
                    setSelectedSchool(school?.geip_school_ID || "all");
                  }
                }}
                options={schools.map((s) => s.school_name || "")}
                displayValue={
                  selectedSchool === "all"
                    ? "all"
                    : schools.find((s) => s.geip_school_ID === selectedSchool)
                        ?.school_name
                }
                showDropdown={showSchoolDropdown}
                setShowDropdown={setShowSchoolDropdown}
              />
            )}

            {/* {activeTab === "room" && (
              <Dropdown
                label="ថ្នាក់ទី"
                value={selectedGrade}
                onChange={setSelectedGrade}
                options={grades}
                showDropdown={showGradeDropdown}
                setShowDropdown={setShowGradeDropdown}
              />
            )} */}

            {activeTab !== "summary" && (
              <button
                onClick={() => {
                  setSelectedProvince("all");
                  setSelectedDistrict("all");
                  setSelectedSchool("all");
                  setSelectedGrade("all");
                  // Refetch data after resetting filters
                  if (token && activeTab !== "summary") {
                    fetchStats(token, activeTab, false);
                  }
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                សម្អាតតម្រង
              </button>
            )}
          </div>
        </div>

        {/* Tabs & Content */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap gap-2 p-4 overflow-x-auto">
              {[
                { key: "summary", label: "សង្ខេប", icon: BarChart3 },
                { key: "province", label: "ខេត្ត/រាជធានី", icon: MapPin },
                { key: "district", label: "ស្រុក/ខណ្ឌ", icon: MapPin },
                { key: "school", label: "សាលារៀន", icon: School },
                // { key: "room", label: "បន្ទប់", icon: DoorOpen },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => handleTabClick(key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
                    activeTab === key
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Summary Tab */}
            {activeTab === "summary" && (
              <div>
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                    <button
                      onClick={() => setChartType("bar")}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${
                        chartType === "bar"
                          ? "bg-white text-blue-600 shadow"
                          : "text-gray-600"
                      }`}
                    >
                      <BarChart3 className="h-4 w-4" />
                      ក្រាប់បរ
                    </button>
                    <button
                      onClick={() => setChartType("pie")}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${
                        chartType === "pie"
                          ? "bg-white text-blue-600 shadow"
                          : "text-gray-600"
                      }`}
                    >
                      <PieChart className="h-4 w-4" />
                      គូង
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">សិស្សសរុប</p>
                        <p className="text-3xl font-bold mt-2">
                          {summary.total_students.toLocaleString()}
                        </p>
                      </div>
                      <Users className="h-12 w-12 text-blue-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">បានប្រឡង</p>
                        <p className="text-3xl font-bold mt-2">
                          {summary.examined_students.toLocaleString()}
                        </p>
                      </div>
                      <UserCheck className="h-12 w-12 text-green-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100">មិនបានប្រឡង</p>
                        <p className="text-3xl font-bold mt-2">
                          {summary.not_examined_students.toLocaleString()}
                        </p>
                      </div>
                      <UserX className="h-12 w-12 text-red-200" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-semibold mb-4 text-center">
                    {chartType === "bar"
                      ? "ស្ថានភាពចូលរួមប្រឡង"
                      : "សមាមាត្រចូលរួមប្រឡង"}
                  </h3>
                  <div className="h-80">
                    <canvas
                      id={
                        chartType === "bar"
                          ? "participationChart"
                          : "participationPieChart"
                      }
                    ></canvas>
                  </div>
                </div>

                <div className="mt-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center">
                  <p className="text-purple-100 mb-2">អត្រាចូលរួម</p>
                  <p className="text-5xl font-bold">
                    {summary.participation_rate_percent}%
                  </p>
                </div>
              </div>
            )}

            {/* Province Tab */}
            {activeTab === "province" && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-blue-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">ខេត្ត/រាជធានី</th>
                        <th className="px-6 py-4 text-center">សរុប</th>
                        <th className="px-6 py-4 text-center">បានប្រឡង</th>
                        <th className="px-6 py-4 text-center">មិនបានប្រឡង</th>
                        <th className="px-6 py-4 text-center">អត្រា (%)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentData.map((p: any) => (
                        <tr
                          key={p.province_name}
                          className="hover:bg-blue-50"
                        >
                          <td className="px-6 py-4 font-medium">
                            {p.province_name || "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {p.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-green-600 font-semibold">
                            {p.examined.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-red-600 font-semibold">
                            {p.not_examined.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-blue-600">
                            {p.participation_rate_percent || (p.total
                              ? ((p.examined / p.total) * 100).toFixed(1)
                              : 0)}
                            %
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <LoadMore />
              </div>
            )}

            {/* District Tab */}
            {activeTab === "district" && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-indigo-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">ខេត្ត</th>
                        <th className="px-6 py-4 text-left">ស្រុក/ខណ្ឌ</th>
                        <th className="px-6 py-4 text-center">សរុប</th>
                        <th className="px-6 py-4 text-center">បានប្រឡង</th>
                        <th className="px-6 py-4 text-center">មិនបានប្រឡង</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentData.map((d: any) => (
                        <tr
                          key={`${d.province_name}-${d.district_name}`}
                          className="hover:bg-indigo-50"
                        >
                          <td className="px-6 py-4">
                            {d.province_name || "-"}
                          </td>
                          <td className="px-6 py-4 font-medium">
                            {d.district_name || "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {d.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-green-600">
                            {d.examined.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-red-600">
                            {d.not_examined.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <LoadMore />
              </div>
            )}

            {/* School Tab */}
            {activeTab === "school" && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-purple-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">លេខកូដសាលា</th>
                        <th className="px-6 py-4 text-left">ឈ្មោះសាលា</th>
                        <th className="px-6 py-4 text-left">ខេត្ត/រាជធានី</th>
                        <th className="px-6 py-4 text-left">ស្រុក/ខណ្ឌ</th>
                        <th className="px-6 py-4 text-center">សរុប</th>
                        <th className="px-6 py-4 text-center">បានប្រឡង</th>
                        <th className="px-6 py-4 text-center">មិនបានប្រឡង</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentData.map((s: any) => (
                        <tr
                          key={s.geip_school_ID}
                          className="hover:bg-purple-50"
                        >
                          <td className="px-6 py-4 font-mono">
                            {s.geip_school_ID || "-"}
                          </td>
                          <td className="px-6 py-4">
                            {s.school_name || "-"}
                          </td>
                          <td className="px-6 py-4">
                            {s.province_name || "-"}
                          </td>
                          <td className="px-6 py-4">
                            {s.district_name || "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {s.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-green-600">
                            {s.examined.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-red-600">
                            {s.not_examined.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <LoadMore />
              </div>
            )}

            {/* Room Tab */}
            {/* {activeTab === "room" && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-orange-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">ឈ្មោះសាលា</th>
                        <th className="px-6 py-4 text-center">ថ្នាក់ទី</th>
                        <th className="px-6 py-4 text-center">បន្ទប់</th>
                        <th className="px-6 py-4 text-center">សរុប</th>
                        <th className="px-6 py-4 text-center">បានប្រឡង</th>
                        <th className="px-6 py-4 text-center">មិនបានប្រឡង</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentData.map((r: any) => (
                        <tr
                          key={`${r.geip_school_ID}-${r.grade}-${r.room}`}
                          className="hover:bg-orange-50"
                        >
                          <td className="px-6 py-4">
                            {r.school_name || "-"}
                          </td>
                          <td className="px-6 py-4 text-center font-bold">
                            ថ្នាក់ {r.grade || "-"}
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-indigo-600">
                            {r.room || "-"}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {r.total.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-green-600">
                            {r.examined.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-red-600">
                            {r.not_examined.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <LoadMore />
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}