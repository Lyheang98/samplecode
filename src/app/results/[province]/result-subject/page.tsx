// src/app/results/[province]/result-subject/page.ts
"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  RefreshCw,
  ArrowLeft,
  Home,
  X,
  FileDown,
  Users,
  TrendingUp,
  Award,
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

export default function StudentTestPage() {
  const params = useParams();
  const router = useRouter();
  const province_name = useMemo(() => decodeProvinceName(params?.province), [params?.province]);

  // States
  const [testSummary, setTestSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tokenRetries, setTokenRetries] = useState(0);
  const [selectedYear, setSelectedYear] = useState("2025");
  const [selectedMonth, setSelectedMonth] = useState("ធ្នូ");

  const yearfilterOptions = ["2025", "2026", "2027"];
  const monthfilterOptions = [
    "មករា", "កុម្ភៈ", "មីនា", "មេសា", "ឧសភា", "មិថុនា",
    "កក្កដា", "សីហា", "កញ្ញា", "តុលា", "វិច្ឆិកា", "ធ្នូ",
  ];

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

  // Fetch test summary data
  const fetchTestSummary = useCallback(async () => {
    if (!province_name) return;
    setLoading(true);
    setError("");

    // Mock data for demonstration since API might not exist yet
    if (true) { // Set to false when real API is available
      setTestSummary({
        total_students: 1250,
        examined_students: 1180,
        absent_students: 70,
        passed_students: 950,
        failed_students: 230,
        pass_rate: 80.5,
        attendance_rate: 94.4,
        average_score: 72.3,
        highest_score: 98,
        lowest_score: 25,
        province_rank: 3
      });
      setLoading(false);
      return;
    }

    const url = `${API_BASE}/api/v1/result/test-summary/${encodeURIComponent(province_name)}/?year=${selectedYear}&month=${MONTH_NAME_TO_INT[selectedMonth]}`;
    console.log("Fetching test summary →", url);

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
      setTestSummary(data);
    } catch (err: any) {
      setError(`បរាជ័យក្នុងការផ្ទុកទិន្នន័យ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [province_name, selectedYear, selectedMonth, getAccessToken]);

  // Fetch data when component mounts or filters change
  useEffect(() => {
    if (province_name) {
      fetchTestSummary();
    }
  }, [province_name, fetchTestSummary]);

  // Handle download
  const handleDownloadCSV = () => {
    if (!testSummary) return;

    const headers = ["ចំណងជើង", "តម្លៃ", "កាលបរិច្ឆេទ"];
    const rows = [
      ["ខេត្ត", province_name],
      ["ឆ្នាំ", selectedYear],
      ["ខែ", selectedMonth],
      ["ចំនួនសិស្សសរុប", testSummary.total_students || 0],
      ["ចំនួនសិស្សប្រលង", testSummary.examined_students || 0],
      ["ចំនួនសិស្សជាប់", testSummary.passed_students || 0],
      ["ចំនួនសិស្សធ្លាក់", testSummary.failed_students || 0],
      ["ភាគរយជាប់ (%)", testSummary.pass_rate || 0],
      ["ពិន្ទុមធ្យម", testSummary.average_score || 0],
      ["ពិន្ទុខ្ពស់បំផុត", testSummary.highest_score || 0],
      ["ពិន្ទុទាបបំផុត", testSummary.lowest_score || 0],
    ];
    
    const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${province_name}_test_summary_${selectedYear}_${selectedMonth}.csv`;
    link.click();
  };

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
                fetchTestSummary();
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
          របាយការណ៍បូកសរុបលទ្ធផលតេស្ត
        </h1>
        <p className="text-xl text-gray-600 mt-2">
          ខេត្ត <span className="text-blue-600 font-bold">{province_name}</span> - 
          ខែ <span className="text-blue-600 font-bold">{selectedMonth}</span> 
          ឆ្នាំ <span className="text-blue-600 font-bold">{selectedYear}</span>
        </p>
      </header>

      {/* Filters */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="bg-white rounded-xl shadow-lg p-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="flex gap-4 items-center">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ឆ្នាំ</label>
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm appearance-none cursor-pointer"
                >
                  {yearfilterOptions.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ខែ</label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-lg text-sm appearance-none cursor-pointer"
                >
                  {monthfilterOptions.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            </div>
            <Button
              onClick={handleDownloadCSV}
              className="bg-green-500 hover:bg-green-600 text-white mt-6 sm:mt-0"
            >
              <FileDown className="h-4 w-4 mr-2" /> ទាញយករបាយការណ៍
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">សិស្សសរុប</p>
                  <p className="text-3xl font-bold mt-2">{testSummary?.total_students || 0}</p>
                </div>
                <Users className="h-10 w-10 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">ជាប់</p>
                  <p className="text-3xl font-bold mt-2">{testSummary?.passed_students || 0}</p>
                  <p className="text-green-100 text-sm mt-1">{testSummary?.pass_rate || 0}%</p>
                </div>
                <Award className="h-10 w-10 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100 text-sm">ធ្លាក់</p>
                  <p className="text-3xl font-bold mt-2">{testSummary?.failed_students || 0}</p>
                  <p className="text-red-100 text-sm mt-1">{(100 - (testSummary?.pass_rate || 0))}%</p>
                </div>
                <X className="h-10 w-10 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">ពិន្ទុមធ្យម</p>
                  <p className="text-3xl font-bold mt-2">{testSummary?.average_score || 0}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Statistics */}
        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">ស្ថិតិលម្អិត</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">ចំនួនសិស្សប្រលង</span>
                  <span className="font-bold text-lg">{testSummary?.examined_students || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">ចំនួនសិស្សមិនប្រលង</span>
                  <span className="font-bold text-lg">{testSummary?.absent_students || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">ភាគរយមកចូលប្រលង</span>
                  <span className="font-bold text-lg">{testSummary?.attendance_rate || 0}%</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">ពិន្ទុខ្ពស់បំផុត</span>
                  <span className="font-bold text-lg text-green-600">{testSummary?.highest_score || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">ពិន្ទុទាបបំផុត</span>
                  <span className="font-bold text-lg text-red-600">{testSummary?.lowest_score || 0}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">ចំណាត់ថ្នាក់ខេត្ត</span>
                  <span className="font-bold text-lg text-blue-600">{testSummary?.province_rank || "N/A"}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}