// // app/examdata/page.tsx

// "use client";

// import React, { useState, useEffect } from "react";
// import {
//   BarChart3,
//   Users,
//   UserCheck,
//   UserX,
//   School,
//   MapPin,
//   GraduationCap,
//   DoorOpen,
//   RefreshCw,
//   LogOut,
//   Lock,
//   User,
//   Search,
//   Filter,
//   ChevronDown,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react";

// interface ExamStats {
//   exam_period: { year: number; month: number };
//   summary: {
//     total_students: number;
//     examined_students: number;
//     not_examined_students: number;
//     participation_rate_percent: number;
//   };
//   by_province: Array<{
//     school__province_name: string;
//     total: number;
//     examined: number;
//     not_examined: number;
//   }>;
//   by_district: Array<{
//     school__province_name: string;
//     school__district_name: string;
//     total: number;
//     examined: number;
//     not_examined: number;
//   }>;
//   by_school: Array<{
//     school__geip_school_ID: string;
//     school__school_name: string;
//     school__province_name: string;
//     school__district_name: string;
//     total: number;
//     examined: number;
//     not_examined: number;
//   }>;
//   by_grade: Array<{ 
//     grade: string; 
//     school__province_name: string;
//     school__district_name: string;
//     school__geip_school_ID: string;
//     school__school_name: string;
//     total: number; 
//     examined: number; 
//     not_examined: number;
//   }>;
//   by_room: Array<{
//     school__geip_school_ID: string;
//     school__school_name: string;
//     school__province_name: string;
//     school__district_name: string;
//     grade: string;
//     room: string;
//     total: number;
//     examined: number;
//     not_examined: number;
//   }>;
// }

// const monthNames = [
//   "",
//   "មករា",
//   "កុម្ភៈ",
//   "មីនា",
//   "មេសា",
//   "ឧសភា",
//   "មិថុនា",
//   "កក្កដា",
//   "សីហា",
//   "កញ្ញា",
//   "តុលា",
//   "វិច្ឆិកា",
//   "ធ្នូ",
// ];

// const API_BASE = "http://127.0.0.1:8000";
// const TOKEN_URL = `${API_BASE}/api/token/`;
// const STATS_URL = `${API_BASE}/api/v1/result/exam-participation-stats/`;

// export default function ExamParticipationReport() {
//   const [data, setData] = useState<ExamStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [token, setToken] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<
//     "summary" | "province" | "district" | "school" | "grade" | "room"
//   >("summary");

//   // Filter states
//   const [selectedProvince, setSelectedProvince] = useState("all");
//   const [selectedDistrict, setSelectedDistrict] = useState("all");
//   const [selectedSchool, setSelectedSchool] = useState("all");
//   const [selectedGrade, setSelectedGrade] = useState("all");
//   const [selectedRoom, setSelectedRoom] = useState("all");

//   // Dropdown visibility states
//   const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
//   const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
//   const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
//   const [showGradeDropdown, setShowGradeDropdown] = useState(false);
//   const [showRoomDropdown, setShowRoomDropdown] = useState(false);

//   // Pagination states
//   const [currentPage, setCurrentPage] = useState(1);
//   const [rowsPerPage, setRowsPerPage] = useState(30);

//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [loginError, setLoginError] = useState("");

//   // Check for existing token on load
//   useEffect(() => {
//     const savedToken = localStorage.getItem("access_token");
//     if (savedToken) {
//       setToken(savedToken);
//       fetchStats(savedToken);
//     } else {
//       setLoading(false);
//     }
//   }, []);

//   const login = async () => {
//     if (!username || !password) {
//       setLoginError("សូមបំពេញឈ្មោះអ្នកប្រើ និងពាក្យសម្ងាត់");
//       return;
//     }

//     setLoginError("");
//     setLoading(true);

//     try {
//       const res = await fetch(TOKEN_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ username, password }),
//       });

//       if (!res.ok) {
//         const err = await res.json();
//         throw new Error(err.detail || "ចូលប្រព័ន្ធមិនបាន");
//       }

//       const json = await res.json();
//       const accessToken = json.access;

//       localStorage.setItem("access_token", accessToken);
//       setToken(accessToken);
//       await fetchStats(accessToken);
//     } catch (err: any) {
//       setLoginError(err.message || "មានបញ្ហាចូលប្រព័ន្ធ");
//       setLoading(false);
//     }
//   };

//   const fetchStats = async (accessToken: string) => {
//     try {
//       const res = await fetch(STATS_URL, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       if (res.status === 401) {
//         localStorage.removeItem("access_token");
//         setToken(null);
//         setError("Token ផុតកំណត់។ សូមចូលប្រព័ន្ធម្តងទៀត។");
//         setLoading(false);
//         return;
//       }

//       if (!res.ok) throw new Error("មិនអាចទាញទិន្នន័យ");

//       const json = await res.json();
//       setData(json);
//       setError("");
//     } catch (err) {
//       setError("មិនអាចទាញទិន្នន័យ។ សូមពិនិត្យការតភ្ជាប់");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleRefresh = async () => {
//     if (!token) return;
//     setLoading(true);
//     setError("");
//     await fetchStats(token);
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     setToken(null);
//     setData(null);
//     setUsername("");
//     setPassword("");
//     setLoginError("");
//   };

//   // Reset page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [selectedProvince, selectedDistrict, selectedSchool, selectedGrade, selectedRoom, activeTab]);

//   // Get unique provinces
//   const provinces = data ? [...new Set(data.by_province.map(p => p.school__province_name))].sort() : [];
  
//   // Get districts based on selected province
//   const districts = data ? 
//     [...new Set(data.by_district
//       .filter(d => selectedProvince === "all" || d.school__province_name === selectedProvince)
//       .map(d => d.school__district_name)
//     )].sort() : [];

//   // Get schools based on selected province and district
//   const schools = data ? 
//     data.by_school
//       .filter(s => 
//         (selectedProvince === "all" || s.school__province_name === selectedProvince) &&
//         (selectedDistrict === "all" || s.school__district_name === selectedDistrict)
//       )
//       .sort((a, b) => a.school__school_name.localeCompare(b.school__school_name)) : [];

//   // Get grades based on filters
//   const grades = data ? 
//     [...new Set(data.by_grade
//       .filter(g => 
//         (selectedProvince === "all" || g.school__province_name === selectedProvince) &&
//         (selectedDistrict === "all" || g.school__district_name === selectedDistrict) &&
//         (selectedSchool === "all" || g.school__geip_school_ID === selectedSchool)
//       )
//       .map(g => g.grade)
//     )].sort((a, b) => parseInt(a) - parseInt(b)) : [];

//   // Get rooms based on filters
//   const rooms = data ? 
//     [...new Set(data.by_room
//       .filter(r => 
//         (selectedProvince === "all" || r.school__province_name === selectedProvince) &&
//         (selectedDistrict === "all" || r.school__district_name === selectedDistrict) &&
//         (selectedSchool === "all" || r.school__geip_school_ID === selectedSchool) &&
//         (selectedGrade === "all" || r.grade === selectedGrade)
//       )
//       .map(r => r.room)
//     )].sort() : [];

//   // Filtered data for each tab
//   const filteredProvinceData = data?.by_province.filter(p => 
//     selectedProvince === "all" || p.school__province_name === selectedProvince
//   ) || [];

//   const filteredDistrictData = data?.by_district.filter(d => 
//     (selectedProvince === "all" || d.school__province_name === selectedProvince) &&
//     (selectedDistrict === "all" || d.school__district_name === selectedDistrict)
//   ) || [];

//   const filteredSchoolData = data?.by_school.filter(s => 
//     (selectedProvince === "all" || s.school__province_name === selectedProvince) &&
//     (selectedDistrict === "all" || s.school__district_name === selectedDistrict) &&
//     (selectedSchool === "all" || s.school__geip_school_ID === selectedSchool)
//   ) || [];

//   const filteredGradeData = data?.by_grade.filter(g => 
//     (selectedProvince === "all" || g.school__province_name === selectedProvince) &&
//     (selectedDistrict === "all" || g.school__district_name === selectedDistrict) &&
//     (selectedSchool === "all" || g.school__geip_school_ID === selectedSchool) &&
//     (selectedGrade === "all" || g.grade === selectedGrade)
//   ) || [];

//   const filteredRoomData = data?.by_room.filter(r => 
//     (selectedProvince === "all" || r.school__province_name === selectedProvince) &&
//     (selectedDistrict === "all" || r.school__district_name === selectedDistrict) &&
//     (selectedSchool === "all" || r.school__geip_school_ID === selectedSchool) &&
//     (selectedGrade === "all" || r.grade === selectedGrade) &&
//     (selectedRoom === "all" || r.room === selectedRoom)
//   ) || [];

//   // Calculate filtered summary
//   const getFilteredSummary = () => {
//     let total = 0;
//     let examined = 0;
//     let notExamined = 0;

//     const activeData = activeTab === "province" ? filteredProvinceData :
//                       activeTab === "district" ? filteredDistrictData :
//                       activeTab === "school" ? filteredSchoolData :
//                       activeTab === "grade" ? filteredGradeData :
//                       activeTab === "room" ? filteredRoomData :
//                       [];

//     activeData.forEach(item => {
//       total += item.total;
//       examined += item.examined;
//       notExamined += item.not_examined;
//     });

//     return {
//       total_students: total,
//       examined_students: examined,
//       not_examined_students: notExamined,
//       participation_rate_percent: total > 0 ? parseFloat(((examined / total) * 100).toFixed(1)) : 0
//     };
//   };

//   const filteredSummary = getFilteredSummary();

//   // Get current data for pagination
//   const getCurrentData = () => {
//     const data = activeTab === "province" ? filteredProvinceData :
//                  activeTab === "district" ? filteredDistrictData :
//                  activeTab === "school" ? filteredSchoolData :
//                  activeTab === "grade" ? filteredGradeData :
//                  activeTab === "room" ? filteredRoomData :
//                  [];
    
//     const indexOfLastRow = currentPage * rowsPerPage;
//     const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//     return data.slice(indexOfFirstRow, indexOfLastRow);
//   };

//   const currentData = getCurrentData();
//   const totalRows = activeTab === "province" ? filteredProvinceData.length :
//                    activeTab === "district" ? filteredDistrictData.length :
//                    activeTab === "school" ? filteredSchoolData.length :
//                    activeTab === "grade" ? filteredGradeData.length :
//                    activeTab === "room" ? filteredRoomData.length :
//                    0;
//   const totalPages = Math.ceil(totalRows / rowsPerPage);

//   // Reset filters when switching tabs
//   useEffect(() => {
//     setSelectedProvince("all");
//     setSelectedDistrict("all");
//     setSelectedSchool("all");
//     setSelectedGrade("all");
//     setSelectedRoom("all");
//     setCurrentPage(1);
//   }, [activeTab]);

//   // Reset dependent filters
//   useEffect(() => {
//     setSelectedDistrict("all");
//     setSelectedSchool("all");
//     setSelectedGrade("all");
//     setSelectedRoom("all");
//     setCurrentPage(1);
//   }, [selectedProvince]);

//   useEffect(() => {
//     setSelectedSchool("all");
//     setSelectedGrade("all");
//     setSelectedRoom("all");
//     setCurrentPage(1);
//   }, [selectedDistrict]);

//   useEffect(() => {
//     setSelectedGrade("all");
//     setSelectedRoom("all");
//     setCurrentPage(1);
//   }, [selectedSchool]);

//   useEffect(() => {
//     setSelectedRoom("all");
//     setCurrentPage(1);
//   }, [selectedGrade]);

//   // Dropdown component
//   const Dropdown = ({ 
//     label, 
//     value, 
//     onChange, 
//     options, 
//     showDropdown, 
//     setShowDropdown 
//   }: {
//     label: string;
//     value: string;
//     onChange: (value: string) => void;
//     options: string[];
//     showDropdown: boolean;
//     setShowDropdown: (show: boolean) => void;
//   }) => (
//     <div className="relative">
//       <button
//         onClick={() => setShowDropdown(!showDropdown)}
//         className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2 min-w-[200px] hover:bg-gray-50"
//       >
//         <span>{value === "all" ? `ជ្រើសរើស${label}` : value}</span>
//         <ChevronDown className="h-4 w-4" />
//       </button>
//       {showDropdown && (
//         <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
//           <div
//             className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//             onClick={() => {
//               onChange("all");
//               setShowDropdown(false);
//             }}
//           >
//             ទាំងអស់
//           </div>
//           {options.map(option => (
//             <div
//               key={option}
//               className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
//               onClick={() => {
//                 onChange(option);
//                 setShowDropdown(false);
//               }}
//             >
//               {option}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );

//   // Pagination component
//   const Pagination = () => {
//     if (totalRows <= rowsPerPage) return null;

//     return (
//       <div className="flex items-center justify-between mt-4">
//         <div className="flex items-center gap-2">
//           <span className="text-sm text-gray-700">បង្ហាញ</span>
//           <select
//             value={rowsPerPage}
//             onChange={(e) => {
//               setRowsPerPage(Number(e.target.value));
//               setCurrentPage(1);
//             }}
//             className="border border-gray-300 rounded px-2 py-1 text-sm"
//           >
//             <option value={10}>10</option>
//             <option value={30}>30</option>
//             <option value={50}>50</option>
//             <option value={100}>100</option>
//           </select>
//           <span className="text-sm text-gray-700">ជួររាង</span>
//         </div>
        
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
//             disabled={currentPage === 1}
//             className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <ChevronLeft className="h-4 w-4" />
//           </button>
          
//           <span className="text-sm text-gray-700">
//             ទំព័រ {currentPage} នៃ {totalPages}
//           </span>
          
//           <button
//             onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
//             disabled={currentPage === totalPages}
//             className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <ChevronRight className="h-4 w-4" />
//           </button>
//         </div>
        
//         <div className="text-sm text-gray-700">
//           សរុប: {totalRows} ជួរ
//         </div>
//       </div>
//     );
//   };

//   // Login Form
//   if (!token) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-2xl p-10 max-w-md w-full">
//           <div className="text-center mb-8">
//             <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Lock className="h-10 w-10 text-blue-600" />
//             </div>
//             <h2 className="text-3xl font-bold text-gray-900">ចូលប្រព័ន្ធ</h2>
//             <p className="text-gray-600 mt-2">របាយការណ៍ចូលរួមប្រឡងសិស្ស</p>
//           </div>

//           <div className="space-y-5">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 ឈ្មោះអ្នកប្រើ
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="text"
//                   value={username}
//                   onChange={(e) => setUsername(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="បញ្ចូលឈ្មោះអ្នកប្រើ"
//                   onKeyDown={(e) => e.key === "Enter" && login()}
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 ពាក្យសម្ងាត់
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                 <input
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="បញ្ចូលពាក្យសម្ងាត់"
//                   onKeyDown={(e) => e.key === "Enter" && login()}
//                 />
//               </div>
//             </div>

//             {loginError && (
//               <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
//                 {loginError}
//               </div>
//             )}

//             <button
//               onClick={login}
//               disabled={loading}
//               className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold py-4 rounded-lg transition flex items-center justify-center gap-2"
//             >
//               {loading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
//                   កំពុងចូល...
//                 </>
//               ) : (
//                 "ចូលប្រព័ន្ធ"
//               )}
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // Loading data after login
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
//           <p className="text-xl font-medium text-gray-700">កំពុងផ្ទុកទិន្នន័យ...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !data) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
//         <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
//           <UserX className="h-16 w-16 text-red-600 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-800 mb-3">មានបញ្ហា</h2>
//           <p className="text-gray-600 mb-6">{error || "មិនមានទិន្នន័យ"}</p>
//           <button
//             onClick={handleRefresh}
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg inline-flex items-center gap-2"
//           >
//             <RefreshCw className="h-5 w-5" />
//             ព្យាយាមម្តងទៀត
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const { exam_period } = data;
//   const summary = activeTab === "summary" ? data.summary : filteredSummary;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
//       <div className="max-w-7xl mx-auto">
//         {/* Header with Logout */}
//         <div className="flex justify-between items-center mb-8">
//           <div>
//             <h1 className="text-4xl font-bold text-gray-900">របាយការណ៍ចូលរួមប្រឡងសិស្ស</h1>
//             <p className="text-2xl text-blue-700 font-semibold mt-2">
//               ខែ {monthNames[exam_period.month]} ឆ្នាំ {exam_period.year}
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={handleRefresh}
//               className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 shadow"
//             >
//               <RefreshCw className="h-5 w-5" />
//               ធ្វើបច្ចុប្បន្នភាព
//             </button>
//             <button
//               onClick={handleLogout}
//               className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 shadow"
//             >
//               <LogOut className="h-5 w-5" />
//               ចាកចេញ
//             </button>
//           </div>
//         </div>

//         {/* Summary Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
//           <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
//             <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
//             <p className="text-gray-600">សិស្សសរុប</p>
//             <p className="text-3xl font-bold text-gray-900">{summary.total_students.toLocaleString()}</p>
//           </div>
//           <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
//             <UserCheck className="h-12 w-12 text-green-600 mx-auto mb-3" />
//             <p className="text-gray-600">បានប្រឡង</p>
//             <p className="text-3xl font-bold text-green-600">{summary.examined_students.toLocaleString()}</p>
//           </div>
//           <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
//             <UserX className="h-12 w-12 text-red-600 mx-auto mb-3" />
//             <p className="text-gray-600">មិនបានប្រឡង</p>
//             <p className="text-3xl font-bold text-red-600">{summary.not_examined_students.toLocaleString()}</p>
//           </div>
//           <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
//             <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-3" />
//             <p className="text-gray-600">អត្រាចូលរួម</p>
//             <p className="text-3xl font-bold text-purple-600">{summary.participation_rate_percent}%</p>
//           </div>
//         </div>

//         {/* Filter Section - Moved here */}
//         <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
//           <div className="flex flex-wrap gap-4 items-center">
//             <span className="font-medium text-gray-700">តម្រង៖</span>
            
//             {/* Province Filter - Show for all tabs except summary */}
//             {activeTab !== "summary" && (
//               <Dropdown
//                 label="ខេត្ត"
//                 value={selectedProvince}
//                 onChange={setSelectedProvince}
//                 options={provinces}
//                 showDropdown={showProvinceDropdown}
//                 setShowDropdown={setShowProvinceDropdown}
//               />
//             )}

//             {/* District Filter - Show for district, school, grade, room tabs */}
//             {(activeTab === "district" || activeTab === "school" || activeTab === "grade" || activeTab === "room") && (
//               <Dropdown
//                 label="ស្រុក/ខណ្ឌ"
//                 value={selectedDistrict}
//                 onChange={setSelectedDistrict}
//                 options={districts}
//                 showDropdown={showDistrictDropdown}
//                 setShowDropdown={setShowDistrictDropdown}
//               />
//             )}

//             {/* School Filter - Show for school, grade, room tabs */}
//             {(activeTab === "school" || activeTab === "grade" || activeTab === "room") && (
//               <Dropdown
//                 label="សាលារៀន"
//                 value={selectedSchool === "all" ? "all" : schools.find(s => s.school__geip_school_ID === selectedSchool)?.school__school_name || "all"}
//                 onChange={(value) => {
//                   if (value === "all") {
//                     setSelectedSchool("all");
//                   } else {
//                     const school = schools.find(s => s.school__school_name === value);
//                     if (school) {
//                       setSelectedSchool(school.school__geip_school_ID);
//                     }
//                   }
//                 }}
//                 options={schools.map(s => s.school__school_name)}
//                 showDropdown={showSchoolDropdown}
//                 setShowDropdown={setShowSchoolDropdown}
//               />
//             )}

//             {/* Grade Filter - Show for grade, room tabs */}
//             {(activeTab === "grade" || activeTab === "room") && (
//               <Dropdown
//                 label="ថ្នាក់ទី"
//                 value={selectedGrade}
//                 onChange={setSelectedGrade}
//                 options={grades}
//                 showDropdown={showGradeDropdown}
//                 setShowDropdown={setShowGradeDropdown}
//               />
//             )}

//             {/* Room Filter - Show only for room tab */}
//             {activeTab === "room" && (
//               <Dropdown
//                 label="បន្ទប់"
//                 value={selectedRoom}
//                 onChange={setSelectedRoom}
//                 options={rooms}
//                 showDropdown={showRoomDropdown}
//                 setShowDropdown={setShowRoomDropdown}
//               />
//             )}

//             {/* Clear Filters Button - Show for all tabs except summary */}
//             {activeTab !== "summary" && (
//               <button
//                 onClick={() => {
//                   setSelectedProvince("all");
//                   setSelectedDistrict("all");
//                   setSelectedSchool("all");
//                   setSelectedGrade("all");
//                   setSelectedRoom("all");
//                 }}
//                 className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
//               >
//                 សម្អាតតម្រង
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
//           <div className="border-b border-gray-200">
//             <div className="flex flex-wrap gap-2 p-4 overflow-x-auto">
//               {[
//                 { key: "summary", label: "សង្ខេប", icon: BarChart3 },
//                 { key: "province", label: "ខេត្ត/រាជធានី", icon: MapPin },
//                 { key: "district", label: "ស្រុក/ខណ្ឌ", icon: MapPin },
//                 { key: "school", label: "សាលារៀន", icon: School },
//                 { key: "grade", label: "ថ្នាក់ទី", icon: GraduationCap },
//                 { key: "room", label: "បន្ទប់", icon: DoorOpen },
//               ].map(({ key, label, icon: Icon }) => (
//                 <button
//                   key={key}
//                   onClick={() => setActiveTab(key as any)}
//                   className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition whitespace-nowrap ${
//                     activeTab === key
//                       ? "bg-blue-600 text-white shadow-md"
//                       : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                   }`}
//                 >
//                   <Icon className="h-5 w-5" />
//                   {label}
//                 </button>
//               ))}
//             </div>
//           </div>

//           <div className="p-6">
//             {activeTab === "summary" && (
//               <div className="text-center py-32">
//                 <BarChart3 className="h-32 w-32 text-blue-400 mx-auto mb-6 opacity-50" />
//                 <p className="text-2xl text-gray-600">ជ្រើសរើស Tab ដើម្បីមើលលម្អិត</p>
//               </div>
//             )}

//             {activeTab === "province" && (
//               <div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead className="bg-blue-600 text-white">
//                       <tr>
//                         <th className="px-6 py-4 text-left">ខេត្ត/រាជធានី</th>
//                         <th className="px-6 py-4 text-center">សរុប</th>
//                         <th className="px-6 py-4 text-center">បានប្រឡង</th>
//                         <th className="px-6 py-4 text-center">មិនបានប្រឡង</th>
//                         <th className="px-6 py-4 text-center">អត្រា (%)</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {currentData.map((p) => (
//                         <tr key={p.school__province_name} className="hover:bg-blue-50">
//                           <td className="px-6 py-4 font-medium">{p.school__province_name || "មិនដឹង"}</td>
//                           <td className="px-6 py-4 text-center">{p.total.toLocaleString()}</td>
//                           <td className="px-6 py-4 text-center text-green-600 font-semibold">
//                             {p.examined.toLocaleString()}
//                           </td>
//                           <td className="px-6 py-4 text-center text-red-600 font-semibold">
//                             {p.not_examined.toLocaleString()}
//                           </td>
//                           <td className="px-6 py-4 text-center font-bold text-blue-600">
//                             {p.total > 0 ? ((p.examined / p.total) * 100).toFixed(1) : 0}%
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <Pagination />
//               </div>
//             )}

//             {activeTab === "district" && (
//               <div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead className="bg-indigo-600 text-white">
//                       <tr>
//                         <th className="px-6 py-4 text-left">ខេត្ត</th>
//                         <th className="px-6 py-4 text-left">ស្រុក/ខណ្ឌ</th>
//                         <th className="px-6 py-4 text-center">សរុប</th>
//                         <th className="px-6 py-4 text-center">បានប្រឡង</th>
//                         <th className="px-6 py-4 text-center">មិនបានប្រឡង</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {currentData.map((d) => (
//                         <tr key={`${d.school__province_name}-${d.school__district_name}`} className="hover:bg-indigo-50">
//                           <td className="px-6 py-4">{d.school__province_name}</td>
//                           <td className="px-6 py-4 font-medium">{d.school__district_name || "មិនដឹង"}</td>
//                           <td className="px-6 py-4 text-center">{d.total.toLocaleString()}</td>
//                           <td className="px-6 py-4 text-center text-green-600">{d.examined.toLocaleString()}</td>
//                           <td className="px-6 py-4 text-center text-red-600">{d.not_examined.toLocaleString()}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <Pagination />
//               </div>
//             )}

//             {activeTab === "school" && (
//               <div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead className="bg-purple-600 text-white">
//                       <tr>
//                         <th className="px-6 py-4 text-left">លេខកូដសាលា</th>
//                         <th className="px-6 py-4 text-left">ឈ្មោះសាលា</th>
//                         <th className="px-6 py-4 text-center">សរុប</th>
//                         <th className="px-6 py-4 text-center">បានប្រឡង</th>
//                         <th className="px-6 py-4 text-center">មិនបានប្រឡង</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {currentData.map((s) => (
//                         <tr key={s.school__geip_school_ID} className="hover:bg-purple-50">
//                           <td className="px-6 py-4 font-mono">{s.school__geip_school_ID}</td>
//                           <td className="px-6 py-4">{s.school__school_name}</td>
//                           <td className="px-6 py-4 text-center">{s.total.toLocaleString()}</td>
//                           <td className="px-6 py-4 text-center text-green-600">{s.examined.toLocaleString()}</td>
//                           <td className="px-6 py-4 text-center text-red-600">{s.not_examined.toLocaleString()}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <Pagination />
//               </div>
//             )}

//             {activeTab === "grade" && (
//               <div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead className="bg-green-600 text-white">
//                       <tr>
//                         <th className="px-6 py-4 text-center">ថ្នាក់ទី</th>
//                         <th className="px-6 py-4 text-center">សរុប</th>
//                         <th className="px-6 py-4 text-center">បានប្រឡង</th>
//                         <th className="px-6 py-4 text-center">មិនបានប្រឡង</th>
//                         <th className="px-6 py-4 text-center">អត្រា (%)</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {currentData.map((g) => (
//                         <tr key={`${g.grade}-${g.school__geip_school_ID}`} className="hover:bg-green-50 text-center">
//                           <td className="px-6 py-4 font-bold text-xl">ថ្នាក់ {g.grade}</td>
//                           <td className="px-6 py-4">{g.total.toLocaleString()}</td>
//                           <td className="px-6 py-4 text-green-600 font-semibold">{g.examined.toLocaleString()}</td>
//                           <td className="px-6 py-4 text-red-600 font-semibold">{g.not_examined.toLocaleString()}</td>
//                           <td className="px-6 py-4 font-bold text-blue-600">
//                             {g.total > 0 ? ((g.examined / g.total) * 100).toFixed(1) : 0}%
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <Pagination />
//               </div>
//             )}

//             {activeTab === "room" && (
//               <div>
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-sm">
//                     <thead className="bg-orange-600 text-white">
//                       <tr>
//                         <th className="px-6 py-4 text-left">ឈ្មោះសាលា</th>
//                         <th className="px-6 py-4 text-center">ថ្នាក់</th>
//                         <th className="px-6 py-4 text-center">បន្ទប់</th>
//                         <th className="px-6 py-4 text-center">សរុប</th>
//                         <th className="px-6 py-4 text-center">បានប្រឡង</th>
//                         <th className="px-6 py-4 text-center">មិនបានប្រឡង</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-gray-200">
//                       {currentData.map((r) => (
//                         <tr key={`${r.school__geip_school_ID}-${r.grade}-${r.room}`} className="hover:bg-orange-50">
//                           <td className="px-6 py-4">{r.school__school_name}</td>
//                           <td className="px-6 py-4 text-center font-bold">ថ្នាក់ {r.grade}</td>
//                           <td className="px-6 py-4 text-center font-bold text-indigo-600">{r.room}</td>
//                           <td className="px-6 py-4 text-center">{r.total.toLocaleString()}</td>
//                           <td className="px-6 py-4 text-center text-green-600">{r.examined.toLocaleString()}</td>
//                           <td className="px-6 py-4 text-center text-red-600">{r.not_examined.toLocaleString()}</td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//                 <Pagination />
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// app/examdata/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3,
  Users,
  UserCheck,
  UserX,
  School,
  MapPin,
  GraduationCap,
  DoorOpen,
  RefreshCw,
  LogOut,
  Lock,
  User,
  Search,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  PieChart,
  TrendingUp,
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
  PointElement,
  LineElement,
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
    school__province_name: string;
    total: number;
    examined: number;
    not_examined: number;
  }>;
  by_district: Array<{
    school__province_name: string;
    school__district_name: string;
    total: number;
    examined: number;
    not_examined: number;
  }>;
  by_school: Array<{
    school__geip_school_ID: string;
    school__school_name: string;
    school__province_name: string;
    school__district_name: string;
    total: number;
    examined: number;
    not_examined: number;
  }>;
  by_room: Array<{
    school__geip_school_ID: string;
    school__school_name: string;
    school__province_name: string;
    school__district_name: string;
    grade: string;
    room: string;
    total: number;
    examined: number;
    not_examined: number;
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
  const [selectedRoom, setSelectedRoom] = useState("all");

  // Dropdown visibility states
  const [showProvinceDropdown, setShowProvinceDropdown] = useState(false);
  const [showDistrictDropdown, setShowDistrictDropdown] = useState(false);
  const [showSchoolDropdown, setShowSchoolDropdown] = useState(false);
  const [showGradeDropdown, setShowGradeDropdown] = useState(false);
  const [showRoomDropdown, setShowRoomDropdown] = useState(false);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(30);

  // Chart states
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Chart.js registration
  useEffect(() => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      BarElement,
      Title,
      Tooltip,
      Legend,
      ArcElement,
      PointElement,
      LineElement
    );
  }, []);

  // Check for existing token on load
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
        throw new Error(err.detail || "ចូលប្រព័ន្ធមិនបាន");
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

  const fetchStats = async (accessToken: string) => {
    try {
      const res = await fetch(STATS_URL, {
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
      setData(json);
      setError("");
    } catch (err) {
      setError("មិនអាចទាញទិន្នន័យ។ សូមពិនិត្យការតភ្ជាប់");
    } finally {
      setLoading(false);
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

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedProvince, selectedDistrict, selectedSchool, selectedGrade, selectedRoom, activeTab]);

  // Get unique provinces
  const provinces = data ? [...new Set(data.by_province.map(p => p.school__province_name))].sort() : [];
  
  // Get districts based on selected province
  const districts = data ? 
    [...new Set(data.by_district
      .filter(d => selectedProvince === "all" || d.school__province_name === selectedProvince)
      .map(d => d.school__district_name)
    )].sort() : [];

  // Get schools based on selected province and district
  const schools = data ? 
    data.by_school
      .filter(s => 
        (selectedProvince === "all" || s.school__province_name === selectedProvince) &&
        (selectedDistrict === "all" || s.school__district_name === selectedDistrict)
      )
      .sort((a, b) => a.school__school_name.localeCompare(b.school__school_name)) : [];

  // Get grades based on filters
  const grades = data ? 
    [...new Set(data.by_room
      .filter(r => 
        (selectedProvince === "all" || r.school__province_name === selectedProvince) &&
        (selectedDistrict === "all" || r.school__district_name === selectedDistrict) &&
        (selectedSchool === "all" || r.school__geip_school_ID === selectedSchool)
      )
      .map(r => r.grade)
    )].sort((a, b) => parseInt(a) - parseInt(b)) : [];

  // Get rooms based on filters
  const rooms = data ? 
    [...new Set(data.by_room
      .filter(r => 
        (selectedProvince === "all" || r.school__province_name === selectedProvince) &&
        (selectedDistrict === "all" || r.school__district_name === selectedDistrict) &&
        (selectedSchool === "all" || r.school__geip_school_ID === selectedSchool) &&
        (selectedGrade === "all" || r.grade === selectedGrade)
      )
      .map(r => r.room)
    )].sort() : [];

  // Filtered data for each tab
  const filteredProvinceData = data?.by_province.filter(p => 
    selectedProvince === "all" || p.school__province_name === selectedProvince
  ) || [];

  const filteredDistrictData = data?.by_district.filter(d => 
    (selectedProvince === "all" || d.school__province_name === selectedProvince) &&
    (selectedDistrict === "all" || d.school__district_name === selectedDistrict)
  ) || [];

  const filteredSchoolData = data?.by_school.filter(s => 
    (selectedProvince === "all" || s.school__province_name === selectedProvince) &&
    (selectedDistrict === "all" || s.school__district_name === selectedDistrict) &&
    (selectedSchool === "all" || s.school__geip_school_ID === selectedSchool)
  ) || [];

  const filteredRoomData = data?.by_room.filter(r => 
    (selectedProvince === "all" || r.school__province_name === selectedProvince) &&
    (selectedDistrict === "all" || r.school__district_name === selectedDistrict) &&
    (selectedSchool === "all" || r.school__geip_school_ID === selectedSchool) &&
    (selectedGrade === "all" || r.grade === selectedGrade) &&
    (selectedRoom === "all" || r.room === selectedRoom)
  ) || [];

  // Calculate filtered summary
  const getFilteredSummary = () => {
    let total = 0;
    let examined = 0;
    let notExamined = 0;

    const activeData = activeTab === "province" ? filteredProvinceData :
                      activeTab === "district" ? filteredDistrictData :
                      activeTab === "school" ? filteredSchoolData :
                      activeTab === "room" ? filteredRoomData :
                      [];

    activeData.forEach(item => {
      total += item.total;
      examined += item.examined;
      notExamined += item.not_examined;
    });

    return {
      total_students: total,
      examined_students: examined,
      not_examined_students: notExamined,
      participation_rate_percent: total > 0 ? parseFloat(((examined / total) * 100).toFixed(1)) : 0
    };
  };

  const filteredSummary = getFilteredSummary();

  // Get current data for pagination
  const getCurrentData = () => {
    const data = activeTab === "province" ? filteredProvinceData :
                 activeTab === "district" ? filteredDistrictData :
                 activeTab === "school" ? filteredSchoolData :
                 activeTab === "room" ? filteredRoomData :
                 [];
    
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return data.slice(indexOfFirstRow, indexOfLastRow);
  };

  const currentData = getCurrentData();
  const totalRows = activeTab === "province" ? filteredProvinceData.length :
                   activeTab === "district" ? filteredDistrictData.length :
                   activeTab === "school" ? filteredSchoolData.length :
                   activeTab === "room" ? filteredRoomData.length :
                   0;
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  // Reset filters when switching tabs
  useEffect(() => {
    setSelectedProvince("all");
    setSelectedDistrict("all");
    setSelectedSchool("all");
    setSelectedGrade("all");
    setSelectedRoom("all");
    setCurrentPage(1);
  }, [activeTab]);

  // Reset dependent filters
  useEffect(() => {
    setSelectedDistrict("all");
    setSelectedSchool("all");
    setSelectedGrade("all");
    setSelectedRoom("all");
    setCurrentPage(1);
  }, [selectedProvince]);

  useEffect(() => {
    setSelectedSchool("all");
    setSelectedGrade("all");
    setSelectedRoom("all");
    setCurrentPage(1);
  }, [selectedDistrict]);

  useEffect(() => {
    setSelectedGrade("all");
    setSelectedRoom("all");
    setCurrentPage(1);
  }, [selectedSchool]);

  useEffect(() => {
    setSelectedRoom("all");
    setCurrentPage(1);
  }, [selectedGrade]);

  // Dropdown component
  const Dropdown = ({ 
    label, 
    value, 
    onChange, 
    options, 
    showDropdown, 
    setShowDropdown 
  }: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: string[];
    showDropdown: boolean;
    setShowDropdown: (show: boolean) => void;
  }) => (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2 min-w-[200px] hover:bg-gray-50"
      >
        <span>{value === "all" ? `ជ្រើសរើស${label}` : value}</span>
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
          {options.map(option => (
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

  // Pagination component
  const Pagination = () => {
    if (totalRows <= rowsPerPage) return null;

    return (
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700">បង្ហាញ</span>
          <select
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option value={10}>10</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span className="text-sm text-gray-700">ជួររាង</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <span className="text-sm text-gray-700">
            ទំព័រ {currentPage} នៃ {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        
        <div className="text-sm text-gray-700">
          សរុប: {totalRows} ជួរ
        </div>
      </div>
    );
  };

  // Chart component for summary tab
  const SummaryChart = () => {
    if (!data) return null;

    const chartData = activeTab === "summary" ? data.summary : filteredSummary;
    
    if (chartType === "bar") {
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">ស្ថានភាពចូលរួមប្រឡង</h3>
          <div className="h-80">
            <canvas id="participationChart"></canvas>
          </div>
        </div>
      );
    } else {
      return (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4 text-center">សមាធារបស់សិស្ស</h3>
          <div className="h-80">
            <canvas id="participationPieChart"></canvas>
          </div>
        </div>
      );
    }
  };

  // Initialize charts
  useEffect(() => {
    if (activeTab === "summary" && data) {
      const chartData = activeTab === "summary" ? data.summary : filteredSummary;
      
      // Destroy existing charts
      const barChart = ChartJS.getChart("participationChart");
      const pieChart = ChartJS.getChart("participationPieChart");
      if (barChart) barChart.destroy();
      if (pieChart) pieChart.destroy();

      if (chartType === "bar") {
        // Bar Chart
        const ctx = (document.getElementById("participationChart") as HTMLCanvasElement)?.getContext("2d");
        if (ctx) {
          new ChartJS(ctx, {
            type: "bar",
            data: {
              labels: ["សិស្សសរុប", "បានប្រឡង", "មិនបានប្រឡង"],
              datasets: [{
                label: "ចំនួន",
                data: [
                  chartData.total_students,
                  chartData.examined_students,
                  chartData.not_examined_students
                ],
                backgroundColor: [
                  "rgba(59, 130, 246, 0.8)",
                  "rgba(34, 197, 94, 0.8)",
                  "rgba(239, 68, 68, 0.8)"
                ],
                borderColor: [
                  "rgb(59, 130, 246)",
                  "rgb(34, 197, 94)",
                  "rgb(239, 68, 68)"
                ],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      return context.parsed.y.toLocaleString() + " នាក";
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function(value) {
                      return value.toLocaleString();
                    }
                  }
                }
              }
            }
          });
        }
      } else {
        // Pie Chart
        const ctx = (document.getElementById("participationPieChart") as HTMLCanvasElement)?.getContext("2d");
        if (ctx) {
          new ChartJS(ctx, {
            type: "pie",
            data: {
              labels: ["បានប្រឡង", "មិនបានប្រឡង"],
              datasets: [{
                data: [
                  chartData.examined_students,
                  chartData.not_examined_students
                ],
                backgroundColor: [
                  "rgba(34, 197, 94, 0.8)",
                  "rgba(239, 68, 68, 0.8)"
                ],
                borderColor: [
                  "rgb(34, 197, 94)",
                  "rgb(239, 68, 68)"
                ],
                borderWidth: 1
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "bottom"
                },
                tooltip: {
                  callbacks: {
                    label: function(context) {
                      const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                      const percentage = ((context.parsed / total) * 100).toFixed(1);
                      return context.label + ": " + context.parsed.toLocaleString() + " (" + percentage + "%)";
                    }
                  }
                }
              }
            }
          });
        }
      }
    }
  }, [data, activeTab, filteredSummary, chartType]);

  // Login Form
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

  // Loading data after login
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
        {/* Header with Logout */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">របាយការណ៍ចូលរួមប្រឡងសិស្ស</h1>
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
            <p className="text-3xl font-bold text-gray-900">{summary.total_students.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <UserCheck className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <p className="text-gray-600">បានប្រឡង</p>
            <p className="text-3xl font-bold text-green-600">{summary.examined_students.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <UserX className="h-12 w-12 text-red-600 mx-auto mb-3" />
            <p className="text-gray-600">មិនបានប្រឡង</p>
            <p className="text-3xl font-bold text-red-600">{summary.not_examined_students.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
            <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <p className="text-gray-600">អត្រាចូលរួម</p>
            <p className="text-3xl font-bold text-purple-600">{summary.participation_rate_percent}%</p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="font-medium text-gray-700">តម្រង៖</span>
            
            {/* Province Filter - Show for all tabs except summary */}
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

            {/* District Filter - Show for district, school, room tabs */}
            {(activeTab === "district" || activeTab === "school" || activeTab === "room") && (
              <Dropdown
                label="ស្រុក/ខណ្ឌ"
                value={selectedDistrict}
                onChange={setSelectedDistrict}
                options={districts}
                showDropdown={showDistrictDropdown}
                setShowDropdown={setShowDistrictDropdown}
              />
            )}

            {/* School Filter - Show for school, room tabs */}
            {(activeTab === "school" || activeTab === "room") && (
              <Dropdown
                label="សាលារៀន"
                value={selectedSchool === "all" ? "all" : schools.find(s => s.school__geip_school_ID === selectedSchool)?.school__school_name || "all"}
                onChange={(value) => {
                  if (value === "all") {
                    setSelectedSchool("all");
                  } else {
                    const school = schools.find(s => s.school__school_name === value);
                    if (school) {
                      setSelectedSchool(school.school__geip_school_ID);
                    }
                  }
                }}
                options={schools.map(s => s.school__school_name)}
                showDropdown={showSchoolDropdown}
                setShowDropdown={setShowSchoolDropdown}
              />
            )}

            {/* Grade Filter - Show only for room tab */}
            {activeTab === "room" && (
              <Dropdown
                label="ថ្នាក់ទី"
                value={selectedGrade}
                onChange={setSelectedGrade}
                options={grades}
                showDropdown={showGradeDropdown}
                setShowDropdown={setShowGradeDropdown}
              />
            )}

            {/* Room Filter - Show only for room tab */}
            {activeTab === "room" && (
              <Dropdown
                label="បន្ទប់"
                value={selectedRoom}
                onChange={setSelectedRoom}
                options={rooms}
                showDropdown={showRoomDropdown}
                setShowDropdown={setShowRoomDropdown}
              />
            )}

            {/* Clear Filters Button - Show for all tabs except summary */}
            {activeTab !== "summary" && (
              <button
                onClick={() => {
                  setSelectedProvince("all");
                  setSelectedDistrict("all");
                  setSelectedSchool("all");
                  setSelectedGrade("all");
                  setSelectedRoom("all");
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                សម្អាតតម្រង
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex flex-wrap gap-2 p-4 overflow-x-auto">
              {[
                { key: "summary", label: "សង្ខេប", icon: BarChart3 },
                { key: "province", label: "ខេត្ត/រាជធានី", icon: MapPin },
                { key: "district", label: "ស្រុក/ខណ្ឌ", icon: MapPin },
                { key: "school", label: "សាលារៀន", icon: School },
                { key: "room", label: "បន្ទប់", icon: DoorOpen },
              ].map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key as any)}
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
            {activeTab === "summary" && (
              <div>
                {/* Chart Type Toggle */}
                <div className="flex justify-center mb-6">
                  <div className="bg-gray-100 rounded-lg p-1 inline-flex">
                    <button
                      onClick={() => setChartType("bar")}
                      className={`px-4 py-2 rounded-md flex items-center gap-2 transition ${
                        chartType === "bar"
                          ? "bg-white text-blue-600 shadow"
                          : "text-gray-600 hover:text-gray-800"
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
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      <PieChart className="h-4 w-4" />
                      គូង
                    </button>
                  </div>
                </div>
                
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100">សិស្សសរុប</p>
                        <p className="text-3xl font-bold mt-2">{summary.total_students.toLocaleString()}</p>
                      </div>
                      <Users className="h-12 w-12 text-blue-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100">បានប្រឡង</p>
                        <p className="text-3xl font-bold mt-2">{summary.examined_students.toLocaleString()}</p>
                      </div>
                      <UserCheck className="h-12 w-12 text-green-200" />
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-red-100">មិនបានប្រឡង</p>
                        <p className="text-3xl font-bold mt-2">{summary.not_examined_students.toLocaleString()}</p>
                      </div>
                      <UserX className="h-12 w-12 text-red-200" />
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <SummaryChart />

                {/* Participation Rate */}
                <div className="mt-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white text-center">
                  <p className="text-purple-100 mb-2">អត្រាចូលរួមសរុប</p>
                  <p className="text-5xl font-bold">{summary.participation_rate_percent}%</p>
                </div>
              </div>
            )}

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
                      {currentData.map((p) => (
                        <tr key={p.school__province_name} className="hover:bg-blue-50">
                          <td className="px-6 py-4 font-medium">{p.school__province_name || "មិនដឹង"}</td>
                          <td className="px-6 py-4 text-center">{p.total.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center text-green-600 font-semibold">
                            {p.examined.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center text-red-600 font-semibold">
                            {p.not_examined.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 text-center font-bold text-blue-600">
                            {p.total > 0 ? ((p.examined / p.total) * 100).toFixed(1) : 0}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination />
              </div>
            )}

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
                      {currentData.map((d) => (
                        <tr key={`${d.school__province_name}-${d.school__district_name}`} className="hover:bg-indigo-50">
                          <td className="px-6 py-4">{d.school__province_name}</td>
                          <td className="px-6 py-4 font-medium">{d.school__district_name || "មិនដឹង"}</td>
                          <td className="px-6 py-4 text-center">{d.total.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center text-green-600">{d.examined.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center text-red-600">{d.not_examined.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination />
              </div>
            )}

            {activeTab === "school" && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-purple-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">លេខកូដសាលា</th>
                        <th className="px-6 py-4 text-left">ឈ្មោះសាលា</th>
                        <th className="px-6 py-4 text-center">សរុប</th>
                        <th className="px-6 py-4 text-center">បានប្រឡង</th>
                        <th className="px-6 py-4 text-center">មិនបានប្រឡង</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentData.map((s) => (
                        <tr key={s.school__geip_school_ID} className="hover:bg-purple-50">
                          <td className="px-6 py-4 font-mono">{s.school__geip_school_ID}</td>
                          <td className="px-6 py-4">{s.school__school_name}</td>
                          <td className="px-6 py-4 text-center">{s.total.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center text-green-600">{s.examined.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center text-red-600">{s.not_examined.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination />
              </div>
            )}

            {activeTab === "room" && (
              <div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-orange-600 text-white">
                      <tr>
                        <th className="px-6 py-4 text-left">ឈ្មោះសាលា</th>
                        <th className="px-6 py-4 text-center">ថ្នាក់</th>
                        <th className="px-6 py-4 text-center">បន្ទប់</th>
                        <th className="px-6 py-4 text-center">សរុប</th>
                        <th className="px-6 py-4 text-center">បានប្រឡង</th>
                        <th className="px-6 py-4 text-center">មិនបានប្រឡង</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {currentData.map((r) => (
                        <tr key={`${r.school__geip_school_ID}-${r.grade}-${r.room}`} className="hover:bg-orange-50">
                          <td className="px-6 py-4">{r.school__school_name}</td>
                          <td className="px-6 py-4 text-center font-bold">ថ្នាក់ {r.grade}</td>
                          <td className="px-6 py-4 text-center font-bold text-indigo-600">{r.room}</td>
                          <td className="px-6 py-4 text-center">{r.total.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center text-green-600">{r.examined.toLocaleString()}</td>
                          <td className="px-6 py-4 text-center text-red-600">{r.not_examined.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <Pagination />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}