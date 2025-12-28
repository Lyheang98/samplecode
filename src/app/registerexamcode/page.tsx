// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import {
//   Home,
//   User,
//   Search,
//   Loader2,
//   AlertTriangle,
//   Copy,
//   Check,
//   ArrowRight,
//   ChevronDown,
//   MapPin,
//   School,
//   Users,
//   BookOpen,
//   Sparkles,
//   Award,
//   ArrowLeft,
//   Zap,
//   FileText,
//   CheckCircle,
// } from "lucide-react";

// // Import the utility to get the correct exam link
// import { getExamLink } from "@/utils/examLinks";
// import SubjectSelection from "@/components/SubjectSelection";

// // NOTE: These API constants should match your project's configuration
// const API_BASE = "https://moeys-exam-qbfys.ondigitalocean.app";
// const MOCK_USERNAME = "Staff";
// const MOCK_PASSWORD = "staffmoeysedtech2025";
// // export const API_BASE = "http://127.0.0.1:8000"
// // export const MOCK_USERNAME = "admin"
// // export const MOCK_PASSWORD = "1234567"
// const TOKEN_URL = `${API_BASE}/api/token/`;

// // --- Constants (PROVINCES list) ---
// const PROVINCES = [
//   { id: "1", name: "ខេត្តបន្ទាយមានជ័យ" },
//   { id: "2", name: "ខេត្តបាត់ដំបង" },
//   { id: "3", name: "ខេត្តកំពង់ចាម" },
//   { id: "4", name: "ខេត្តកំពង់ឆ្នាំង" },
//   { id: "5", name: "ខេត្តកំពង់ស្ពឺ" },
//   { id: "6", name: "ខេត្តកំពង់ធំ" },
//   { id: "7", name: "ខេត្តកំពត" },
//   { id: "8", name: "ខេត្តកណ្ដាល" },
//   { id: "9", name: "ខេត្តកោះកុង" },
//   { id: "10", name: "ខេត្តក្រចេះ" },
//   { id: "11", name: "ខេត្តមណ្ឌលគិរី" },
//   { id: "12", name: "រាជធានីភ្នំពេញ" },
//   { id: "13", name: "ខេត្តព្រះវិហារ" },
//   { id: "14", name: "ខេត្តព្រៃវែង" },
//   { id: "15", name: "ខេត្តពោធិ៍សាត់" },
//   { id: "16", name: "ខេត្តរតនគិរី" },
//   { id: "17", name: "ខេត្តសៀមរាប" },
//   { id: "18", name: "ខេត្តព្រះសីហនុ" },
//   { id: "19", name: "ខេត្តស្ទឹងត្រែង" },
//   { id: "20", name: "ខេត្តស្វាយរៀង" },
//   { id: "21", name: "ខេត្តតាកែវ" },
//   { id: "22", name: "ខេត្តកែប" },
//   { id: "23", name: "ខេត្តប៉ៃលិន" },
//   { id: "24", name: "ខេត្តឧត្តរមានជ័យ" },
//   { id: "25", name: "ខេត្តត្បូងឃ្មុំ" },
// ];

// // Define subjects for each grade
// const SUBJECTS = {
//   "7": [
//     "ភាសាខ្មែរ",
//     "គណិតវិទ្យា",
//     "រូបវិទ្យា",
//     "គីមីវិទ្យា",
//     "ជីវវិទ្យា",
//     "ប្រវត្តិវិទ្យា",
//     "ភូមិវិទ្យា",
//     "សីលធម៌-ពលរដ្ឋវិជ្ជា",
//     "ផែនដីវិទ្យា",
//     "អង់គ្លេស",
//   ],
//   "8": [
//     "ភាសាខ្មែរ",
//     "គណិតវិទ្យា",
//     "រូបវិទ្យា",
//     "គីមីវិទ្យា",
//     "ជីវវិទ្យា",
//     "ប្រវត្តិវិទ្យា",
//     "ភូមិវិទ្យា",
//     "សីលធម៌-ពលរដ្ឋវិជ្ជា",
//     "ផែនដីវិទ្យា",
//     "អង់គ្លេស",
//   ],
//   "9": [
//     "ភាសាខ្មែរ",
//     "គណិតវិទ្យា",
//     "រូបវិទ្យា",
//     "គីមីវិទ្យា",
//     "ជីវវិទ្យា",
//     "ប្រវត្តិវិទ្យា",
//     "ភូមិវិទ្យា",
//     "សីលធម៌-ពលរដ្ឋវិជ្ជា",
//     "ផែនដីវិទ្យា",
//     "អង់គ្លេស",
//   ],
//   "10": [
//     "ភាសាខ្មែរ",
//     "គណិតវិទ្យា",
//     "រូបវិទ្យា",
//     "គីមីវិទ្យា",
//     "ជីវវិទ្យា",
//     "ប្រវត្តិវិទ្យា",
//     "ភូមិវិទ្យា",
//     "សីលធម៌-ពលរដ្ឋវិជ្ជា",
//     "ផែនដីវិទ្យា",
//     "អង់គ្លេស",
//   ],
//   "11": [
//     "ភាសាខ្មែរ",
//     "គណិតវិទ្យា",
//     "រូបវិទ្យា",
//     "គីមីវិទ្យា",
//     "ជីវវិទ្យា",
//     "ប្រវត្តិវិទ្យា",
//     "ភូមិវិទ្យា",
//     "សីលធម៌-ពលរដ្ឋវិជ្ជា",
//     "ផែនដីវិទ្យា",
//     "អង់គ្លេស",
//   ],
//   "12": [
//     "ភាសាខ្មែរ",
//     "គណិតវិទ្យា",
//     "រូបវិទ្យា",
//     "គីមីវិទ្យា",
//     "ជីវវិទ្យា", // Fixed typo: was "ជីវិទ្យា"
//     "ប្រវត្តិវិទ្យា",
//     "ភូមិវិទ្យា",
//     "សីលធម៌-ពលរដ្ឋវិជ្ជា",
//     "ផែនដីវិទ្យា",
//     "អង់គ្លេស",
//   ],
// };

// // --- UI Components ---
// const Card = ({ children, className = "", variant = "default" }: any) => {
//   const variants = {
//     default:
//       "bg-white border border-purple-100 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden",
//     gradient: "relative overflow-hidden shadow-2xl",
//     glass: "bg-white/90 backdrop-blur-md border border-purple-100 shadow-xl",
//     success: "relative overflow-hidden shadow-2xl",
//   };

//   return (
//     <div
//       className={`rounded-3xl ${variants[variant as keyof typeof variants]
//         } ${className}`}
//     >
//       {variant === "gradient" && (
//         <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600" />
//       )}
//       {variant === "success" && (
//         <div className="absolute inset-0 bg-gradient-to-r from-[#107da8] via-[#107da8] to-[#107da8] rounded-lg shadow-xl" />
//       )}
//       <div className="relative z-10">{children}</div>
//     </div>
//   );
// };

// const Button = ({
//   children,
//   onClick,
//   className = "",
//   disabled = false,
//   variant = "primary",
//   ...props
// }: any) => {
//   const baseClasses =
//     "inline-flex items-center justify-center rounded-2xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-11 px-6 py-2 relative overflow-hidden group";

//   const variantClasses = {
//     primary:
//       "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 transition-all",
//     secondary:
//       "bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
//     success:
//       "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
//     ghost:
//       "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200",
//     back: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
//   };

//   return (
//     <button
//       onClick={onClick}
//       className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]
//         } ${className}`}
//       disabled={disabled}
//       type="button"
//       {...props}
//     >
//       {children}
//     </button>
//   );
// };

// const SelectFilter = ({
//   label,
//   value,
//   onChange,
//   options,
//   disabled = false,
//   loading = false,
//   icon,
// }: any) => (
//   <div className="relative w-full">
//     <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
//       {icon}
//     </div>
//     <select
//       value={value}
//       onChange={onChange}
//       disabled={disabled || loading}
//       className="w-full h-11 bg-white border border-purple-200 text-gray-700 py-2 pl-10 pr-8 rounded-2xl text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:bg-purple-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm hover:shadow-md"
//     >
//       <option value="">{loading ? `កំពុងផ្ទុក ${label}...` : label}</option>
//       {options.map((opt: any) => {
//         const optValue =
//           typeof opt === "object" ? opt.value || opt.id || opt.name : opt;
//         const optName = typeof opt === "object" ? opt.name || opt : opt;
//         return (
//           <option key={optValue} value={optValue}>
//             {optName}
//           </option>
//         );
//       })}
//     </select>
//     <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400 z-10">
//       {loading ? (
//         <Loader2 className="h-4 w-4 animate-spin" />
//       ) : (
//         <ChevronDown className="h-4 w-4" />
//       )}
//     </div>
//   </div>
// );

// // --- Main Component ---
// export default function RegisterExamCodePage() {
//   const router = useRouter();
//   const [loadingStep, setLoadingStep] = useState<string | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [examCode, setExamCode] = useState("");
//   const [copied, setCopied] = useState(false);
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   // Add state to track current step (code generation or subject selection)
//   const [currentStep, setCurrentStep] = useState<"code" | "subject">("code");

//   // Filter states
//   const [selectedProvinceId, setSelectedProvinceId] = useState("");
//   const [selectedDistrict, setSelectedDistrict] = useState("");
//   const [selectedSchoolId, setSelectedSchoolId] = useState("");
//   const [selectedGrade, setSelectedGrade] = useState("");
//   const [selectedStudent, setSelectedStudent] = useState<any>(null);

//   // Data options states
//   const [districts, setDistricts] = useState<string[]>([]);
//   const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
//   const [grades, setGrades] = useState<string[]>([]);
//   const [students, setStudents] = useState<any[]>([]);

//   const selectedSchool = useMemo(
//     () => schools.find((s) => s.id === selectedSchoolId),
//     [schools, selectedSchoolId]
//   );

//   // Utility function to get access token
//   const getAccessToken = useCallback(async () => {
//     const res = await fetch(TOKEN_URL, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         username: MOCK_USERNAME,
//         password: MOCK_PASSWORD,
//       }),
//     });
//     if (!res.ok) throw new Error("Failed to get token");
//     const data = await res.json();
//     return data.access;
//   }, []);

//   // --- Recursive Pagination Function ---
//   const fetchPaginatedData = useCallback(
//     async (
//       url: string,
//       stepName: string,
//       accumulatedData: any[] = []
//     ): Promise<any[]> => {
//       const token = await getAccessToken();

//       const res = await fetch(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (res.status === 404) {
//         return accumulatedData;
//       }
//       if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);

//       const json = await res.json();
//       const currentPageData = Array.isArray(json) ? json : json.results || [];
//       const nextUrl = json.next;

//       const newData = accumulatedData.concat(currentPageData);

//       if (nextUrl) {
//         return fetchPaginatedData(nextUrl, stepName, newData);
//       } else {
//         return newData;
//       }
//     },
//     [getAccessToken]
//   );

//   const fetchAllDataAndSet = useCallback(
//     async (endpoint: string, setter: (data: any) => void, stepName: string) => {
//       if (!endpoint) return;
//       setLoadingStep(stepName);
//       setError(null);
//       try {
//         const allData = await fetchPaginatedData(endpoint, stepName);
//         setter(allData);
//       } catch (err: any) {
//         setError(`បរាជ័យក្នុងការផ្ទុក ${stepName}: ${err.message}`);
//         if (stepName === "ស្រុក") setDistricts([]);
//         if (stepName === "សាលារៀន") setSchools([]);
//         if (stepName === "ថ្នាក់") setGrades([]);
//         setStudents([]);
//       } finally {
//         setLoadingStep(null);
//       }
//     },
//     [fetchPaginatedData, setDistricts, setSchools, setGrades]
//   );

//   // --- Filter Reset Handlers ---
//   const handleProvinceChange = (id: string) => {
//     setSelectedProvinceId(id);
//     setSelectedDistrict("");
//     setSelectedSchoolId("");
//     setSelectedGrade("");
//     setSelectedStudent(null);
//     setDistricts([]);
//     setSchools([]);
//     setGrades([]);
//     setStudents([]);
//     setExamCode("");
//     setCopied(false);
//   };

//   const handleDistrictChange = (name: string) => {
//     setSelectedDistrict(name);
//     setSelectedSchoolId("");
//     setSelectedGrade("");
//     setSelectedStudent(null);
//     setSchools([]);
//     setGrades([]);
//     setStudents([]);
//     setExamCode("");
//     setCopied(false);
//   };

//   const handleSchoolChange = (id: string) => {
//     setSelectedSchoolId(id);
//     setSelectedGrade("");
//     setSelectedStudent(null);
//     setGrades([]);
//     setStudents([]);
//     setExamCode("");
//     setCopied(false);
//   };

//   const handleGradeChange = (grade: string) => {
//     setSelectedGrade(grade);
//     setSelectedStudent(null);
//     setStudents([]);
//     setExamCode("");
//     setCopied(false);
//   };

//   // --- Copy to clipboard function ---
//   const copyToClipboard = useCallback(() => {
//     if (examCode) {
//       navigator.clipboard.writeText(examCode);
//       setCopied(true);
//     }
//   }, [examCode]);

//   // --- Start Exam function ---
//   const handleStartExam = useCallback(() => {
//     if (!examCode || examCode === "Error") {
//       setError("សូមទាញយកកូដប្រឡងជាមុនសិន");
//       return;
//     }

//     // Add transition effect
//     setIsTransitioning(true);
//     setTimeout(() => {
//       setCurrentStep("subject");
//       setIsTransitioning(false);
//     }, 500);
//   }, [examCode]);

//   // --- Back to code generation ---
//   const handleBackToCode = useCallback(() => {
//     setCurrentStep("code");
//   }, []);

//   // --- Get Exam Code Handler ---
//   const handleGetExamCode = useCallback(async () => {
//     if (
//       !selectedStudent ||
//       !selectedProvinceId ||
//       !selectedDistrict ||
//       !selectedSchoolId ||
//       !selectedGrade
//     )
//       return;

//     setLoadingStep("ExamCode");
//     setExamCode("");
//     setError(null);
//     setCopied(false);

//     try {
//       const { last_name, first_name } = selectedStudent;
//       const endpoint = `${API_BASE}/api/Base/data/v1/api/generate/v1/code/${selectedProvinceId}/${encodeURIComponent(
//         selectedDistrict
//       )}/${selectedSchoolId}/${selectedGrade}/${encodeURIComponent(
//         last_name
//       )}/${encodeURIComponent(first_name)}`;

//       const token = await getAccessToken();
//       const res = await fetch(endpoint, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);

//       let examCodeResult;
//       try {
//         const jsonResponse = await res.json();
//         examCodeResult = jsonResponse.exam_code;
//       } catch (e) {
//         examCodeResult = await res.text();
//       }

//       setExamCode(examCodeResult || "N/A");
//     } catch (err: any) {
//       setError(`សិស្សមិ​នមានការបញ្ជាក់ថ្នាក់វិទ្យាសាស្រ្ដ ឬ ថ្នាក់វិទ្យាសាស្រ្ដសង្គម`);
//       setExamCode("Error");
//     } finally {
//       setLoadingStep(null);
//     }
//   }, [
//     selectedStudent,
//     selectedProvinceId,
//     selectedDistrict,
//     selectedSchoolId,
//     selectedGrade,
//     getAccessToken,
//   ]);

//   // --- useEffect Hooks ---
//   // 1. Fetch Districts
//   useEffect(() => {
//     if (!selectedProvinceId) return;
//     const endpoint = `${API_BASE}/api/Base/data/v1/api/lookup/v1/district/${selectedProvinceId}/`;

//     const districtSetter = (data: any[]) => {
//       const districtNames = data.map((d) => d.district_name).filter(Boolean);
//       setDistricts(districtNames);
//     };

//     fetchAllDataAndSet(endpoint, districtSetter, "ស្រុក");
//   }, [selectedProvinceId, fetchAllDataAndSet]);

//   // 2. Fetch Schools
//   useEffect(() => {
//     if (!selectedProvinceId || !selectedDistrict) return;
//     const encodedDistrict = encodeURIComponent(selectedDistrict);
//     const endpoint = `${API_BASE}/api/Base/data/v1/api/lookup/v1/school/${selectedProvinceId}/${encodedDistrict}/`;

//     const schoolSetter = (data: any[]) => {
//       const mappedSchools = data.map((s) => ({
//         id: s.geip_school_ID,
//         name: s.school_name,
//       }));
//       setSchools(mappedSchools);
//       setSelectedSchoolId("");
//     };

//     fetchAllDataAndSet(endpoint, schoolSetter, "សាលារៀន");
//   }, [selectedProvinceId, selectedDistrict, fetchAllDataAndSet]);

//   // 3. Fetch Grades
//   useEffect(() => {
//     if (!selectedProvinceId || !selectedDistrict || !selectedSchoolId) return;
//     const encodedDistrict = encodeURIComponent(selectedDistrict);
//     const endpoint = `${API_BASE}/api/Base/data/v1/api/lookup/v1/grade/${selectedProvinceId}/${encodedDistrict}/${selectedSchoolId}/`;

//     const gradeSetter = (data: any[]) => {
//       const gradeOptions = data.map((g) => String(g.grade || "")).filter(Boolean);
//       setGrades(gradeOptions);
//       setSelectedGrade("");
//     };
//     fetchAllDataAndSet(endpoint, gradeSetter, "ថ្នាក់");
//   }, [selectedProvinceId, selectedDistrict, selectedSchoolId, fetchAllDataAndSet]);

//   // 4. Fetch Students
//   useEffect(() => {
//     if (
//       !selectedProvinceId ||
//       !selectedDistrict ||
//       !selectedSchoolId ||
//       !selectedGrade
//     ) {
//       setStudents([]);
//       return;
//     }

//     const encodedDistrict = encodeURIComponent(selectedDistrict);
//     const endpoint = `${API_BASE}/api/Base/data/v1/api/lookup/v1/student/${selectedProvinceId}/${encodedDistrict}/${selectedSchoolId}/${selectedGrade}/`;

//     const studentSetter = (data: any[]) => {
//       const mappedStudents = data.map((s) => ({
//         ...s,
//         id: s.student_ID || `${s.last_name}${s.first_name}${s.grade}`,
//         fullName: `${s.last_name || ""} ${s.first_name || ""}`.trim(),
//       }));
//       setStudents(mappedStudents);
//       setSelectedStudent(null);
//     };
//     fetchAllDataAndSet(endpoint, studentSetter, `សិស្សថ្នាក់ ${selectedGrade}`);
//   }, [
//     selectedProvinceId,
//     selectedDistrict,
//     selectedSchoolId,
//     selectedGrade,
//     fetchAllDataAndSet,
//   ]);

//   const studentOptions = students;

//   return (
//     <div className="min-h-screen relative">
//       {/* White Background with 5% Purple Overlay */}
//       <div className="absolute inset-0 bg-white" />
//       <div className="absolute inset-0 bg-purple-600/[0.05]" />

//       {/* Transition Overlay */}
//       {isTransitioning && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
//           <div className="text-center">
//             <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full mb-4 shadow-2xl">
//               <CheckCircle className="h-12 w-12 text-white animate-pulse" />
//             </div>
//             <h2 className="text-2xl font-bold text-gray-800 mb-2">
//               ការដាក់របាយល្អ!
//             </h2>
//             <p className="text-gray-600">
//               កំពុងប្តូទៅទំព័រជ្រើសរើសមុខវិជ្ជា...
//             </p>
//             <div className="mt-4">
//               <Loader2 className="h-8 w-8 text-green-600 animate-spin mx-auto" />
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Content */}
//       <div className="relative z-10 p-4 sm:p-6 lg:p-8">
//         {/* Navigation & Header */}
//         <div className="max-w-5xl mx-auto flex md:justify-between justify-between sm:justify-start sm:gap-4 mb-6">
//             <button className="
//               flex items-center gap-2
//               bg-blue-600 hover:bg-blue-700 text-white font-bold
//               px-3 py-2 text-xs
//               sm:px-4 sm:py-2 sm:text-sm
//               md:px-5 md:py-3 md:text-base
//               rounded-lg shadow-lg transition
//             ">
//               <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> ត្រឡប់
//             </button>
//           <Link href="/welcome">
//             <button className="
//               flex items-center gap-2
//               bg-green-600 hover:bg-green-700 text-white font-bold
//               px-3 py-2 text-xs
//               sm:px-4 sm:py-2 sm:text-sm
//               md:px-5 md:py-3 md:text-base
//               rounded-lg shadow-lg transition
//             ">
//               <Home className="w-4 h-4 sm:w-5 sm:h-5" /> ទំព័រដើម
//             </button>
//           </Link>
//         </div>

//         <header className="text-center mb-6 sm:mb-8">
//           <div className="flex justify-center mb-4 sm:mb-6">
//             <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md ring-1 ring-gray-200">
//               <div className="rounded-lg bg-blue-50 p-2 sm:p-3 ring-1 ring-blue-100">
//                 <Image
//                   src="/moeys-logo.png"
//                   alt="MoEYS Logo"
//                   width={48}
//                   height={48}
//                   className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
//                 />
//               </div>
//               <div className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base leading-tight text-left">
//                 MoEYS EdTech - Online Exam
//               </div>
//             </div>
//           </div>
//           <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-800 mb-2 sm:mb-3 leading-tight px-2">
//             {currentStep === "code"
//               ? "សូមបំពេញព័ត៍មានដើម្បីទទួលបានកូដប្រឡង"
//               : "ជ្រើសរើសមុខវិជ្ជាប្រឡង"}
//           </h1>
//           <p className="text-gray-600 mt-2 text-xs sm:text-lg px-2">
//             {currentStep === "code"
//               ? "បញ្ជាក់៖ សូមជ្រើសរើស​ ខេត្ត/ស្រុក/សាលារៀន/ឈ្មោះ របស់អ្នកឲ្យបានត្រឹមត្រូវ"
//               : "ជ្រើសរើសមុខវិជ្ជាដើម្បីចូលរួមប្រឡង"}
//           </p>
//         </header>

//         <div className="max-w-5xl mx-auto">
//           {currentStep === "code" ? (
//             // Code Generation Step
//             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//               {/* --- Student Selection (Left Card) --- */}
//               <Card className="p-6">
//                 <div className="flex items-center gap-3 mb-5">
//                   <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
//                     <User className="h-6 w-6 text-white" />
//                   </div>
//                   <h2 className="text-xl font-bold text-gray-800">
//                     សូមបំពេញព័ត៍មានផ្ទាល់ខ្លួន
//                   </h2>
//                 </div>

//                 <div className="space-y-4">
//                   <div>
//                     <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
//                       ខេត្ត/ក្រុង
//                     </label>
//                     <SelectFilter
//                       label=""
//                       value={selectedProvinceId}
//                       onChange={(e: any) =>
//                         handleProvinceChange(e.target.value)
//                       }
//                       options={PROVINCES.map((p) => ({
//                         value: p.id,
//                         name: p.name,
//                       }))}
//                       icon={<MapPin className="h-4 w-4 text-purple-500" />}
//                     />
//                   </div>

//                   <div>
//                     <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
//                       ស្រុក/ខណ្ឌ
//                     </label>
//                     <SelectFilter
//                       label=""
//                       value={selectedDistrict}
//                       onChange={(e: any) =>
//                         handleDistrictChange(e.target.value)
//                       }
//                       options={districts}
//                       disabled={!selectedProvinceId}
//                       loading={loadingStep === "ស្រុក"}
//                       icon={<MapPin className="h-4 w-4 text-purple-500" />}
//                     />
//                   </div>

//                   <div>
//                     <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
//                       សាលារៀន
//                     </label>
//                     <SelectFilter
//                       label=""
//                       value={selectedSchoolId}
//                       onChange={(e: any) => handleSchoolChange(e.target.value)}
//                       options={schools.map((s) => ({
//                         value: s.id,
//                         name: s.name,
//                       }))}
//                       disabled={!selectedDistrict}
//                       loading={loadingStep === "សាលារៀន"}
//                       icon={<School className="h-4 w-4 text-purple-500" />}
//                     />
//                   </div>

//                   <div>
//                     <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
//                       ថ្នាក់
//                     </label>
//                     <SelectFilter
//                       label=""
//                       value={selectedGrade}
//                       onChange={(e: any) => handleGradeChange(e.target.value)}
//                       options={grades}
//                       disabled={!selectedSchoolId}
//                       loading={loadingStep === "ថ្នាក់"}
//                       icon={<BookOpen className="h-4 w-4 text-purple-500" />}
//                     />
//                   </div>

//                   {/* Student Name Selection */}
//                   <div>
//                     <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
//                       ឈ្មោះសិស្ស
//                     </label>
//                     <div className="relative">
//                       <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
//                         <Users className="h-4 w-4 text-purple-500" />
//                       </div>
//                       <select
//                         value={selectedStudent?.id || ""}
//                         onChange={(e) => {
//                           const student = studentOptions.find(
//                             (s) => s.id === e.target.value
//                           );
//                           setSelectedStudent(student || null);
//                           setExamCode("");
//                           setCopied(false);
//                         }}
//                         disabled={
//                           !selectedGrade ||
//                           loadingStep === `សិស្សថ្នាក់ ${selectedGrade}` ||
//                           studentOptions.length === 0
//                         }
//                         className="w-full h-11 bg-white border border-purple-200 text-gray-700 py-2 pl-10 pr-8 rounded-2xl text-sm appearance-none cursor-pointer disabled:bg-purple-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm hover:shadow-md"
//                       >
//                         <option value="">
//                           {loadingStep === `សិស្សថ្នាក់ ${selectedGrade}`
//                             ? "កំពុងផ្ទុកសិស្ស..."
//                             : studentOptions.length > 0
//                               ? "ជ្រើសរើសឈ្មោះសិស្ស"
//                               : "មិនមានសិស្សក្នុងថ្នាក់នេះ"}
//                         </option>
//                         {studentOptions.map((s) => (
//                           <option key={s.id} value={s.id}>
//                             {s.fullName} ({s.student_ID || "N/A"})
//                           </option>
//                         ))}
//                       </select>
//                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400 z-10">
//                         <ChevronDown className="h-4 w-4" />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 <Button
//                   onClick={handleGetExamCode}
//                   className="w-full mt-6 text-base from-blue-500 via-sky-500 to-cyan-600"
//                   disabled={!selectedStudent || loadingStep === "ExamCode"}
//                 >
//                   {loadingStep === "ExamCode" ? (
//                     <Loader2 className="h-5 w-5 mr-2 animate-spin" />
//                   ) : (
//                     <Search className="h-5 w-5 mr-2" />
//                   )}
//                   បង្កើតកូដរបស់អ្នក
//                 </Button>
//               </Card>

//               {/* --- Exam Code Result (Right Card) --- */}
//               <Card variant="success" className="p-6">
//                 <div className="flex items-center gap-3 mb-5">
//                   <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-blue-400 shadow-lg">
//                     <FileText className="h-6 w-6 text-white" />
//                   </div>
//                   <h2 className="text-xl font-bold text-white">
//                     សូមចម្លងកូដប្រឡងរបស់អ្នក
//                   </h2>
//                 </div>

//                 {error && (
//                   <div className="bg-red-500/20 backdrop-blur-sm text-white p-4 rounded-2xl border border-red-400/30 mb-4 flex items-start">
//                     <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 text-yellow-300" />
//                     <span className="text-sm">{error}</span>
//                   </div>
//                 )}

//                 <div className="min-h-[220px] flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/40 bg-white/10 backdrop-blur-sm rounded-2xl">
//                   {loadingStep === "ExamCode" ? (
//                     <div className="text-center">
//                       <Loader2 className="h-10 w-10 text-white animate-spin mx-auto mb-4" />
//                       <p className="text-white/90 text-base font-semibold">
//                         កំពុងទាញយកកូដ...
//                       </p>
//                     </div>
//                   ) : examCode && examCode !== "Error" ? (
//                     <>
//                       <p className="text-gray-100 mb-2 text-xs sm:text-lg px-2">
//                         សូមចម្លងកូដខាងក្រោម​ មុនពេលចាប់ផ្តើមប្រឡង៖
//                       </p>
//                       <div className="text-center bg-white/20 backdrop-blur-sm p-5 rounded-2xl border border-white/30 w-full">
//                         <p className="text-white mt-2 text-sm sm:text-lg px-2">
//                           {examCode}
//                         </p>
//                         <div className="flex gap-3 mt-4 justify-center">
//                           <Button
//                             onClick={copyToClipboard}
//                             variant="ghost"
//                             className="bg-blue-800 backdrop-blur-sm text-gray-100 border border-blue-400 shadow-lg hover:bg-yellow-600"
//                           >
//                             {copied ? (
//                               <>
//                                 <Check className="h-4 w-4 mr-2" />
//                                 បានចម្លង
//                               </>
//                             ) : (
//                               <>
//                                 <Copy className="h-4 w-4 mr-2" />
//                                 ចម្លងកូដ
//                               </>
//                             )}
//                           </Button>
//                         </div>
//                       </div>
//                     </>
//                   ) : (
//                     <div className="text-white  text-1xl leading-relaxed">
//                       <p className="text-2xl pb-4">សូមអនុវត្តតាមជំហាន៖</p>
//                       <ol className="text-start list-none pl-0">
//                         <li>១. សូមជ្រើសរើសខេត្ត</li>
//                         <li>២. សូមជ្រើសរើសស្រុក</li>
//                         <li>៣. សូមជ្រើសរើសសាលារៀន</li>
//                         <li>៤. សូមជ្រើសរើសថ្នាក់</li>
//                         <li>៥. សូមជ្រើសរើសឈ្មោះរបស់អ្នក ដើម្បីទទួលបានកូដប្រឡង។</li>
//                       </ol>
//                       <p className="pt-3">
//                         <strong className="text-yellow-300">សម្គាល់៖</strong>
//                         សូមយកកូដនេះដើម្បីទុកបំពេញក្នុងទម្រង់ប្រឡង
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 {/* Start Exam Button - Only visible after copying the code */}
//                 {copied && (
//                   <div className="mt-5 flex justify-center">
//                     <Button
//                       onClick={handleStartExam}
//                       className="bg-white text-green-700 hover:bg-green-50 shadow-2xl text-base"
//                     >
//                       ជ្រើសរើសមុខវិជ្ជា
//                       <ArrowRight className="h-4 w-4 ml-2" />
//                     </Button>
//                   </div>
//                 )}
//               </Card>
//             </div>
//           ) : (
//             // Subject Selection Step
//             <div>
//               <SubjectSelection
//                 selectedStudent={selectedStudent}
//                 selectedSchool={selectedSchool}
//                 selectedGrade={selectedGrade}
//                 selectedProvinceId={selectedProvinceId}
//                 examCode={examCode}
//                 SUBJECTS={SUBJECTS}
//                 PROVINCES={PROVINCES}
//                 handleBackToCode={handleBackToCode}
//               />
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
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
// export const API_BASE = "http://127.0.0.1:8000"
// export const MOCK_USERNAME = "admin"
// export const MOCK_PASSWORD = "1234567"
const TOKEN_URL = `${API_BASE}/api/token/`;

// --- Constants (PROVINCES list) ---
const PROVINCES = [
  { id: "1", name: "ខេត្តបន្ទាយមានជ័យ", jsonFile: "BanteayMeanChey" },
  { id: "2", name: "ខេត្តបាត់ដំបង", jsonFile: "Battambang" },
  { id: "3", name: "ខេត្តកំពង់ចាម", jsonFile: "KampongCham" },
  { id: "4", name: "ខេត្តកំពង់ឆ្នាំង", jsonFile: "KampongChhnang" },
  { id: "5", name: "ខេត្តកំពង់ស្ពឺ", jsonFile: "KampongSpeu" },
  { id: "6", name: "ខេត្តកំពង់ធំ", jsonFile: "KampongThom" },
  { id: "7", name: "ខេត្តកំពត", jsonFile: "Kampot" },
  { id: "8", name: "ខេត្តកណ្ដាល", jsonFile: "Kandal" },
  { id: "9", name: "ខេត្តកោះកុង", jsonFile: "KohKong" },
  { id: "10", name: "ខេត្តក្រចេះ", jsonFile: "Kratie" },
  { id: "11", name: "ខេត្តមណ្ឌលគិរី", jsonFile: "Mondulkiri" },
  { id: "12", name: "រាជធានីភ្នំពេញ", jsonFile: "PhnomPenh" },
  { id: "13", name: "ខេត្តព្រះវិហារ", jsonFile: "PreahVihear" },
  { id: "14", name: "ខេត្តព្រៃវែង", jsonFile: "PreyVeng" },
  { id: "15", name: "ខេត្តពោធិ៍សាត់", jsonFile: "Pursat" },
  { id: "16", name: "ខេត្តរតនគិរី", jsonFile: "Ratanakiri" },
  { id: "17", name: "ខេត្តសៀមរាប", jsonFile: "SiemReap" },
  { id: "18", name: "ខេត្តព្រះសីហនុ", jsonFile: "Sihanoukville" },
  { id: "19", name: "ខេត្តស្ទឹងត្រែង", jsonFile: "StungTreng" },
  { id: "20", name: "ខេត្តស្វាយរៀង", jsonFile: "SvayRieng" },
  { id: "21", name: "ខេត្តតាកែវ", jsonFile: "Takeo" },
  { id: "22", name: "ខេត្តកែប", jsonFile: "Kep" },
  { id: "23", name: "ខេត្តប៉ៃលិន", jsonFile: "Pailin" },
  { id: "24", name: "ខេត្តឧត្តរមានជ័យ", jsonFile: "OddarMeanchey" },
  { id: "25", name: "ខេត្តត្បូងឃ្មុំ", jsonFile: "TbongKhmom" },
];

// Define subjects for each grade
const SUBJECTS = {
  "7": ["ភាសាខ្មែរ", "គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ប្រវត្តិវិទ្យា", "ភូមិវិទ្យា", "សីលធម៌-ពលរដ្ឋវិជ្ជា", "ផែនដីវិទ្យា", "អង់គ្លេស"],
  "8": ["ភាសាខ្មែរ", "គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ប្រវត្តិវិទ្យា", "ភូមិវិទ្យា", "សីលធម៌-ពលរដ្ឋវិជ្ជា", "ផែនដីវិទ្យា", "អង់គ្លេស"],
  "9": ["ភាសាខ្មែរ", "គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ប្រវត្តិវិទ្យា", "ភូមិវិទ្យា", "សីលធម៌-ពលរដ្ឋវិជ្ជា", "ផែនដីវិទ្យា", "អង់គ្លេស"],
  "10": ["ភាសាខ្មែរ", "គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ប្រវត្តិវិទ្យា", "ភូមិវិទ្យា", "សីលធម៌-ពលរដ្ឋវិជ្ជា", "ផែនដីវិទ្យា", "អង់គ្លេស"],
  "11": ["ភាសាខ្មែរ", "គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ប្រវត្តិវិទ្យា", "ភូមិវិទ្យា", "សីលធម៌-ពលរដ្ឋវិជ្ជា", "ផែនដីវិទ្យា", "អង់គ្លេស"],
  "12": ["ភាសាខ្មែរ", "គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ប្រវត្តិវិទ្យា", "ភូមិវិទ្យា", "សីលធម៌-ពលរដ្ឋវិជ្ជា", "ផែនដីវិទ្យា", "អង់គ្លេស"],
};

// --- UI Components ---
const Card = ({ children, className = "", variant = "default" }: any) => {
  const variants = {
    default: "bg-white border border-purple-100 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden",
    gradient: "relative overflow-hidden shadow-2xl",
    glass: "bg-white/90 backdrop-blur-md border border-purple-100 shadow-xl",
    success: "relative overflow-hidden shadow-2xl",
  };
  return (
    <div className={`rounded-3xl ${variants[variant as keyof typeof variants]} ${className}`}>
      {variant === "gradient" && <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600" />}
      {variant === "success" && <div className="absolute inset-0 bg-gradient-to-r from-[#107da8] via-[#107da8] to-[#107da8] rounded-lg shadow-xl" />}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Button = ({ children, onClick, className = "", disabled = false, variant = "primary", ...props }: any) => {
  const baseClasses = "inline-flex items-center justify-center rounded-2xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-11 px-6 py-2 relative overflow-hidden group";
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 transition-all",
    secondary: "bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
    success: "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    ghost: "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200",
    back: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
  };
  return (
    <button onClick={onClick} className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]} ${className}`} disabled={disabled} type="button" {...props}>
      {children}
    </button>
  );
};

const SelectFilter = ({ label, value, onChange, options, disabled = false, loading = false, icon }: any) => (
  <div className="relative w-full">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">{icon}</div>
    <select value={value} onChange={onChange} disabled={disabled || loading} className="w-full h-11 bg-white border border-purple-200 text-gray-700 py-2 pl-10 pr-8 rounded-2xl text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:bg-purple-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm hover:shadow-md">
      <option value="">{loading ? `កំពុងផ្ទុក ${label}...` : label}</option>
      {options.map((opt: any) => { const optValue = typeof opt === "object" ? opt.value || opt.id || opt.name : opt; const optName = typeof opt === "object" ? opt.name || opt : opt; return <option key={optValue} value={optValue}>{optName}</option>; })}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400 z-10">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}</div>
  </div>
);

// --- Student Data Service with API Fallback ---
class StudentDataService {
  private API_TIMEOUT_MS = 0;
  private allSchoolsData: any[] = [];

  // --- API Methods ---
  async getAccessToken() {
    const res = await fetch(TOKEN_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ username: MOCK_USERNAME, password: MOCK_PASSWORD }) });
    if (!res.ok) throw new Error("Failed to get token");
    const data = await res.json();
    return data.access;
  }

  async fetchFromApiWithTimeout(url: string, token: string): Promise<any> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.API_TIMEOUT_MS);
    try {
      const response = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.status === 404) return [];
      if (!response.ok) throw new Error(`API ${response.status}: ${response.statusText}`);
      const json = await response.json();
      return Array.isArray(json) ? json : json.results || [];
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  }

  // --- Static File Methods ---
  private async getSchoolsData(): Promise<any[]> {
    if (this.allSchoolsData.length === 0) {
      try {
        const schoolsDataModule = await import(`./data/schools/SE_Schools.json`);
        this.allSchoolsData = schoolsDataModule.default || [];
      } catch (error) {
        console.error(`Failed to load static schools data:`, error);
        return [];
      }
    }
    return this.allSchoolsData;
  }

  private async getStudentData(provinceJsonFile: string): Promise<any[]> {
    try {
      const studentDataModule = await import(`./data/students/${provinceJsonFile}.json`);
      return studentDataModule.default || [];
    } catch (error) {
      console.error(`Failed to load static student data for ${provinceJsonFile}:`, error);
      return [];
    }
  }

  // --- Public Service Methods ---
  async getDistricts(provinceId: string): Promise<{ data: any[], source: 'api' | 'files' }> {
    try {
      const token = await this.getAccessToken();
      const endpoint = `${API_BASE}/api/Base/data/v1/api/lookup/v1/district/${provinceId}/`;
      const data = await this.fetchFromApiWithTimeout(endpoint, token);
      const districtNames = data.map((d: any) => d.district_name).filter(Boolean);
      return { data: districtNames, source: 'api' };
    } catch (error) {
      console.warn(`API failed. Falling back to static files for districts.`, error);
      const schoolsData = await this.getSchoolsData();
      const districtsInProvince = [...new Set(schoolsData.filter(s => s.province_ID === provinceId).map(s => s.district_name))];
      return { data: districtsInProvince.sort(), source: 'files' };
    }
  }

  async getSchools(provinceId: string, district: string): Promise<{ data: any[], source: 'api' | 'files' }> {
    try {
      const token = await this.getAccessToken();
      const endpoint = `${API_BASE}/api/Base/data/v1/api/lookup/v1/school/${provinceId}/${encodeURIComponent(district)}/`;
      const data = await this.fetchFromApiWithTimeout(endpoint, token);
      const mappedSchools = data.map((s: any) => ({ id: s.geip_school_ID, name: s.school_name }));
      return { data: mappedSchools, source: 'api' };
    } catch (error) {
      console.warn(`API failed. Falling back to static files for schools.`, error);
      const schoolsData = await this.getSchoolsData();
      const filteredSchools = schoolsData.filter(s => s.province_ID === provinceId && s.district_name === district);
      const mappedSchools = filteredSchools.map((school: any) => ({ id: school.geip_school_ID, name: school.school_name }));
      return { data: mappedSchools, source: 'files' };
    }
  }

  async getGrades(provinceId: string, district: string, schoolId: string): Promise<{ data: any[], source: 'api' | 'files' }> {
    try {
      const token = await this.getAccessToken();
      const endpoint = `${API_BASE}/api/Base/data/v1/api/lookup/v1/grade/${provinceId}/${encodeURIComponent(district)}/${schoolId}/`;
      const data = await this.fetchFromApiWithTimeout(endpoint, token);
      const gradeOptions = data.map((g: any) => String(g.grade || "")).filter(Boolean);
      return { data: gradeOptions, source: 'api' };
    } catch (error) {
      console.warn(`API failed. Falling back to static files for grades.`, error);
      const province = PROVINCES.find(p => p.id === provinceId);
      if (!province) return { data: [], source: 'files' };
      const studentData = await this.getStudentData(province.jsonFile);
      // **KEY FIX**: Filter students by the selected school FIRST, then get unique grades.
      const gradesAtSchool = [...new Set(studentData.filter(s => s.school === schoolId).map(s => s.grade))];
      return { data: gradesAtSchool.sort(), source: 'files' };
    }
  }

  async getStudents(provinceId: string, district: string, schoolId: string, grade: string): Promise<{ data: any[], source: 'api' | 'files' }> {
    try {
      const token = await this.getAccessToken();
      const endpoint = `${API_BASE}/api/Base/data/v1/api/lookup/v1/student/${provinceId}/${encodeURIComponent(district)}/${schoolId}/${grade}/`;
      const data = await this.fetchFromApiWithTimeout(endpoint, token);
      const mappedStudents = data.map((s: any) => ({ ...s, id: s.student_ID || `${s.last_name}${s.first_name}${s.grade}`, fullName: `${s.last_name || ""} ${s.first_name || ""}`.trim() }));
      return { data: mappedStudents, source: 'api' };
    } catch (error) {
      console.warn(`API failed. Falling back to static files for students.`, error);
      const province = PROVINCES.find(p => p.id === provinceId);
      if (!province) return { data: [], source: 'files' };
      const studentData = await this.getStudentData(province.jsonFile);
      const filteredData = studentData.filter(student => student.school === schoolId && student.grade === grade);
      const mappedStudents = filteredData.map((s: any) => ({ ...s, id: s.student_ID || `${s.last_name}${s.first_name}${s.grade}`, fullName: `${s.last_name || ""} ${s.first_name || ""}`.trim() }));
      return { data: mappedStudents, source: 'files' };
    }
  }
}

const studentDataService = new StudentDataService();

// --- Main Component ---
export default function RegisterExamCodePage() {
  const router = useRouter();
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [examCode, setExamCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [dataSource, setDataSource] = useState<'api' | 'files' | null>(null);
  const [currentStep, setCurrentStep] = useState<"code" | "subject">("code");
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [districts, setDistricts] = useState<string[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string }[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const selectedSchool = useMemo(() => schools.find((s) => s.id === selectedSchoolId), [schools, selectedSchoolId]);

  const handleProvinceChange = (id: string) => { setSelectedProvinceId(id); setSelectedDistrict(""); setSelectedSchoolId(""); setSelectedGrade(""); setSelectedStudent(null); setDistricts([]); setSchools([]); setGrades([]); setStudents([]); setExamCode(""); setCopied(false); setDataSource(null); };
  const handleDistrictChange = (name: string) => { setSelectedDistrict(name); setSelectedSchoolId(""); setSelectedGrade(""); setSelectedStudent(null); setSchools([]); setGrades([]); setStudents([]); setExamCode(""); setCopied(false); };
  const handleSchoolChange = (id: string) => { setSelectedSchoolId(id); setSelectedGrade(""); setSelectedStudent(null); setGrades([]); setStudents([]); setExamCode(""); setCopied(false); };
  const handleGradeChange = (grade: string) => { setSelectedGrade(grade); setSelectedStudent(null); setStudents([]); setExamCode(""); setCopied(false); };

  const copyToClipboard = useCallback(() => { if (examCode) { navigator.clipboard.writeText(examCode); setCopied(true); } }, [examCode]);
  const handleStartExam = useCallback(() => { if (!examCode || examCode === "Error") { setError("សូមទាញយកកូដប្រឡងជាមុនសិន"); return; } setIsTransitioning(true); setTimeout(() => { setCurrentStep("subject"); setIsTransitioning(false); }, 500); }, [examCode]);
  const handleBackToCode = useCallback(() => { setCurrentStep("code"); }, []);

  const handleGetExamCode = useCallback(async () => {
    if (!selectedStudent || !selectedProvinceId || !selectedDistrict || !selectedSchoolId || !selectedGrade) return;
    setLoadingStep("ExamCode"); setExamCode(""); setError(null); setCopied(false);
    try {
      const { last_name, first_name } = selectedStudent;
      const endpoint = `${API_BASE}/api/Base/data/v1/api/generate/v1/code/${selectedProvinceId}/${encodeURIComponent(selectedDistrict)}/${selectedSchoolId}/${selectedGrade}/${encodeURIComponent(last_name)}/${encodeURIComponent(first_name)}`;
      const token = await studentDataService.getAccessToken();
      const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${token}` } });
      if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
      let examCodeResult;
      try { const jsonResponse = await res.json(); examCodeResult = jsonResponse.exam_code; } catch (e) { examCodeResult = await res.text(); }
      setExamCode(examCodeResult || "N/A");
    } catch (err: any) { setError(`សិស្សមិ​នមានការបញ្ជាក់ថ្នាក់វិទ្យាសាស្រ្ដ ឬ ថ្នាក់វិទ្យាសាស្រ្ដសង្គម`); setExamCode("Error"); } finally { setLoadingStep(null); }
  }, [selectedStudent, selectedProvinceId, selectedDistrict, selectedSchoolId, selectedGrade]);

  useEffect(() => {
    if (!selectedProvinceId) return;
    setLoadingStep("ស្រុក"); setError(null);
    studentDataService.getDistricts(selectedProvinceId).then(({ data, source }) => { setDistricts(data); setDataSource(source); }).catch((err: any) => { setError(`បរាជ័យក្នុងការផ្ទុកស្រុក: ${err.message}`); setDistricts([]); }).finally(() => setLoadingStep(null));
  }, [selectedProvinceId]);

  useEffect(() => {
    if (!selectedProvinceId || !selectedDistrict) return;
    setLoadingStep("សាលារៀន"); setError(null);
    studentDataService.getSchools(selectedProvinceId, selectedDistrict).then(({ data, source }) => { setSchools(data); setDataSource(source); setSelectedSchoolId(""); }).catch((err: any) => { setError(`បរាជ័យក្នុងការផ្ទុកសាលារៀន: ${err.message}`); setSchools([]); }).finally(() => setLoadingStep(null));
  }, [selectedProvinceId, selectedDistrict]);

  useEffect(() => {
    if (!selectedProvinceId || !selectedDistrict || !selectedSchoolId) return;
    setLoadingStep("ថ្នាក់"); setError(null);
    studentDataService.getGrades(selectedProvinceId, selectedDistrict, selectedSchoolId).then(({ data, source }) => { setGrades(data); setDataSource(source); setSelectedGrade(""); }).catch((err: any) => { setError(`បរាជ័យក្នុងការផ្ទុកថ្នាក់: ${err.message}`); setGrades([]); }).finally(() => setLoadingStep(null));
  }, [selectedProvinceId, selectedDistrict, selectedSchoolId]);

  useEffect(() => {
    if (!selectedProvinceId || !selectedDistrict || !selectedSchoolId || !selectedGrade) { setStudents([]); return; }
    setLoadingStep(`សិស្សថ្នាក់ ${selectedGrade}`); setError(null);
    studentDataService.getStudents(selectedProvinceId, selectedDistrict, selectedSchoolId, selectedGrade).then(({ data, source }) => { setStudents(data); setDataSource(source); setSelectedStudent(null); }).catch((err: any) => { setError(`បរាជ័យក្នុងការផ្ទុកសិស្ស: ${err.message}`); setStudents([]); }).finally(() => setLoadingStep(null));
  }, [selectedProvinceId, selectedDistrict, selectedSchoolId, selectedGrade]);

  const studentOptions = students;

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-purple-600/[0.05]" />
      {isTransitioning && (<div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm"><div className="text-center"><div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full mb-4 shadow-2xl"><CheckCircle className="h-12 w-12 text-white animate-pulse" /></div><h2 className="text-2xl font-bold text-gray-800 mb-2">ការដាក់របាយល្អ!</h2><p className="text-gray-600">កំពុងប្តូទៅទំព័រជ្រើសរើសមុខវិជ្ជា...</p><div className="mt-4"><Loader2 className="h-8 w-8 text-green-600 animate-spin mx-auto" /></div></div></div>)}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto flex md:justify-between justify-between sm:justify-start sm:gap-4 mb-6">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-5 md:py-3 md:text-base rounded-lg shadow-lg transition"><ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> ត្រឡប់</button>
          <Link href="/welcome"><button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-5 md:py-3 md:text-base rounded-lg shadow-lg transition"><Home className="w-4 h-4 sm:w-5 sm:h-5" /> ទំព័រដើម</button></Link>
        </div>
        <header className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4 sm:mb-6"><div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-md ring-1 ring-gray-200"><div className="rounded-lg bg-blue-50 p-2 sm:p-3 ring-1 ring-blue-100"><Image src="/moeys-logo.png" alt="MoEYS Logo" width={48} height={48} className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" /></div><div className="text-gray-900 font-semibold text-xs sm:text-sm md:text-base leading-tight text-left">MoEYS EdTech - Online Exam</div></div></div>
          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-800 mb-2 sm:mb-3 leading-tight px-2">{currentStep === "code" ? "សូមបំពេញព័ត៍មានដើម្បីទទួលបានកូដប្រឡង" : "ជ្រើសរើសមុខវិជ្ជាប្រឡង"}</h1>
          <p className="text-gray-600 mt-2 text-xs sm:text-lg px-2">{currentStep === "code" ? "បញ្ជាក់៖ សូមជ្រើសរើស​ ខេត្ត/ស្រុក/សាលារៀន/ឈ្មោះ របស់អ្នកឲ្យបានត្រឹមត្រូវ" : "ជ្រើសរើសមុខវិជ្ជាដើម្បីចូលរួមប្រឡង"}</p>
          {dataSource && currentStep === "code" && (<div className="mt-2 text-xs"><span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{dataSource === 'api' ? (<><CheckCircle className="w-3 h-3 mr-1" />ប្រភពទិន្នន័យ: API ផ្ទាល់</>) : (<><FileText className="w-3 h-3 mr-1" />ប្រភពទិន្នន័យ: ឯកសារក្រៅបណ្តាញ (API យឺត)</>)}</span></div>)}
        </header>
        <div className="max-w-5xl mx-auto">
          {currentStep === "code" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-5"><div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg"><User className="h-6 w-6 text-white" /></div><h2 className="text-xl font-bold text-gray-800">សូមបំពេញព័ត៍មានផ្ទាល់ខ្លួន</h2></div>
                <div className="space-y-4">
                  <div><label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">ខេត្ត/ក្រុង</label><SelectFilter label="" value={selectedProvinceId} onChange={(e: any) => handleProvinceChange(e.target.value)} options={PROVINCES.map((p) => ({ value: p.id, name: p.name }))} icon={<MapPin className="h-4 w-4 text-purple-500" />} /></div>
                  <div><label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">ស្រុក/ខណ្ឌ</label><SelectFilter label="" value={selectedDistrict} onChange={(e: any) => handleDistrictChange(e.target.value)} options={districts} disabled={!selectedProvinceId} loading={loadingStep === "ស្រុក"} icon={<MapPin className="h-4 w-4 text-purple-500" />} /></div>
                  <div><label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">សាលារៀន</label><SelectFilter label="" value={selectedSchoolId} onChange={(e: any) => handleSchoolChange(e.target.value)} options={schools.map((s) => ({ value: s.id, name: s.name }))} disabled={!selectedDistrict} loading={loadingStep === "សាលារៀន"} icon={<School className="h-4 w-4 text-purple-500" />} /></div>
                  <div><label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">ថ្នាក់</label><SelectFilter label="" value={selectedGrade} onChange={(e: any) => handleGradeChange(e.target.value)} options={grades} disabled={!selectedSchoolId} loading={loadingStep === "ថ្នាក់"} icon={<BookOpen className="h-4 w-4 text-purple-500" />} /></div>
                  <div><label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">ឈ្មោះសិស្ស</label><div className="relative"><div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10"><Users className="h-4 w-4 text-purple-500" /></div><select value={selectedStudent?.id || ""} onChange={(e) => { const student = studentOptions.find((s) => s.id === e.target.value); setSelectedStudent(student || null); setExamCode(""); setCopied(false); }} disabled={!selectedGrade || loadingStep === `សិស្សថ្នាក់ ${selectedGrade}` || studentOptions.length === 0} className="w-full h-11 bg-white border border-purple-200 text-gray-700 py-2 pl-10 pr-8 rounded-2xl text-sm appearance-none cursor-pointer disabled:bg-purple-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm hover:shadow-md"><option value="">{loadingStep === `សិស្សថ្នាក់ ${selectedGrade}` ? "កំពុងផ្ទុកសិស្ស..." : studentOptions.length > 0 ? "ជ្រើសរើសឈ្មោះសិស្ស" : "មិនមានសិស្សក្នុងថ្នាក់នេះ"}</option>{studentOptions.map((s) => (<option key={s.id} value={s.id}>{s.fullName} ({s.student_ID || "N/A"})</option>))}</select><div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400 z-10"><ChevronDown className="h-4 w-4" /></div></div></div>
                </div>
                <Button onClick={handleGetExamCode} className="w-full mt-6 text-base from-blue-500 via-sky-500 to-cyan-600" disabled={!selectedStudent || loadingStep === "ExamCode"}>{loadingStep === "ExamCode" ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Search className="h-5 w-5 mr-2" />}បង្កើតកូដរបស់អ្នក</Button>
              </Card>
              <Card variant="success" className="p-6">
                <div className="flex items-center gap-3 mb-5"><div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-blue-400 shadow-lg"><FileText className="h-6 w-6 text-white" /></div><h2 className="text-xl font-bold text-white">សូមចម្លងកូដប្រឡងរបស់អ្នក</h2></div>
                {error && (<div className="bg-red-500/20 backdrop-blur-sm text-white p-4 rounded-2xl border border-red-400/30 mb-4 flex items-start"><AlertTriangle className="h-5 w-5 mr-2 mt-0.5 text-yellow-300" /><span className="text-sm">{error}</span></div>)}
                <div className="min-h-[220px] flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/40 bg-white/10 backdrop-blur-sm rounded-2xl">
                  {loadingStep === "ExamCode" ? (<div className="text-center"><Loader2 className="h-10 w-10 text-white animate-spin mx-auto mb-4" /><p className="text-white/90 text-base font-semibold">កំពុងទាញយកកូដ...</p></div>) : examCode && examCode !== "Error" ? (<><p className="text-gray-100 mb-2 text-xs sm:text-lg px-2">សូមចម្លងកូដខាងក្រោម​ មុនពេលចាប់ផ្តើមប្រឡង៖</p><div className="text-center bg-white/20 backdrop-blur-sm p-5 rounded-2xl border border-white/30 w-full"><p className="text-white mt-2 text-sm sm:text-lg px-2">{examCode}</p><div className="flex gap-3 mt-4 justify-center"><Button onClick={copyToClipboard} variant="ghost" className="bg-blue-800 backdrop-blur-sm text-gray-100 border border-blue-400 shadow-lg hover:bg-yellow-600">{copied ? (<><Check className="h-4 w-4 mr-2" />បានចម្លង</>) : (<><Copy className="h-4 w-4 mr-2" />ចម្លងកូដ</>)}</Button></div></div></>) : (<div className="text-white text-1xl leading-relaxed"><p className="text-2xl pb-4">សូមអនុវត្តតាមជំហាន៖</p><ol className="text-start list-none pl-0"><li>១. សូមជ្រើសរើសខេត្ត</li><li>២. សូមជ្រើសរើសស្រុក</li><li>៣. សូមជ្រើសរើសសាលារៀន</li><li>៤. សូមជ្រើសរើសថ្នាក់</li><li>៥. សូមជ្រើសរើសឈ្មោះរបស់អ្នក ដើម្បីទទួលបានកូដប្រឡង។</li></ol><p className="pt-3"><strong className="text-yellow-300">សម្គាល់៖</strong>សូមយកកូដនេះដើម្បីទុកបំពេញក្នុងទម្រង់ប្រឡង</p></div>)}
                </div>
                {copied && (<div className="mt-5 flex justify-center"><Button onClick={handleStartExam} className="bg-white text-green-700 hover:bg-green-50 shadow-2xl text-base">ជ្រើសរើសមុខវិជ្ជា<ArrowRight className="h-4 w-4 ml-2" /></Button></div>)}
              </Card>
            </div>
          ) : (<div><SubjectSelection selectedStudent={selectedStudent} selectedSchool={selectedSchool} selectedGrade={selectedGrade} selectedProvinceId={selectedProvinceId} examCode={examCode} SUBJECTS={SUBJECTS} PROVINCES={PROVINCES} handleBackToCode={handleBackToCode} /></div>)}
        </div>
      </div>
    </div>
  );
}