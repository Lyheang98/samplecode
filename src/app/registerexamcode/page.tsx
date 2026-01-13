"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useTransition,
} from "react";
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
  ArrowLeft,
  FileText,
  CheckCircle,
} from "lucide-react";

import SubjectSelection from "@/components/SubjectSelection";

// ---------------- Types ----------------
interface SchoolType {
  geip_school_ID: string;
  school_name: string;
  province_ID: string;
  district_name: string;
  grades?: string[];
}

interface Student {
  id: string;
  student_ID: string;
  first_name: string;
  last_name: string;
  school: string;
  grade: string;
  district?: string;
  fullName?: string;
  student_type?: string;
}

interface Province {
  id: string;
  name: string;
}

// ---------------- Constants ----------------
const PROVINCES: Province[] = [
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

const SUBJECTS: Record<string, string[]> = {
  "7": ["ភាសាខ្មែរ", "គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ប្រវត្តិវិទ្យា", "ភូមិវិទ្យា", "សីលធម៌-ពលរដ្ឋវិជ្ជា", "ផែនដីវិទ្យា", "អង់គ្លេស"],
  "8": ["ភាសាខ្មែរ", "គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ប្រវត្តិវិទ្យា", "ភូមិវិទ្យា", "សីលធម៌-ពលរដ្ឋវិជ្ជា", "ផែនដីវិទ្យា", "អង់គ្លេស"],
  "9": ["ភាសាខ្មែរ", "គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ប្រវត្តិវិទ្យា", "ភូមិវិទ្យា", "សីលធម៌-ពលរដ្ឋវិជ្ជា", "ផែនដីវិទ្យា", "អង់គ្លេស"],
  "10": ["ភាសាខ្មែរ", "គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ប្រវត្តិវិទ្យា", "ភូមិវិទ្យា", "សីលធម៌-ពលរដ្ឋវិជ្ជា", "ផែនដីវិទ្យា", "អង់គ្លេស"],
  "11": ["ភាសាខ្មែរ", "គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ប្រវត្តិវិទ្យា", "ភូមិវិទ្យា", "សីលធម៌-ពលរដ្ឋវិជ្ជា", "ផែនដីវិទ្យា", "អង់គ្លេស"],
  "12": ["ភាសាខ្មែរ", "គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ប្រវត្តិវិទ្យា", "ភូមិវិទ្យា", "សីលធម៌-ពលរដ្ឋវិជ្ជា", "ផែនដីវិទ្យា", "អង់គ្លេស"],
};

const DATA_LOADERS: Record<
  string,
  {
    students: () => Promise<{ default: Student[] }>;
    schools: () => Promise<{ default: SchoolType[] }>;
  }
> = {
  "1": { students: () => import("@/data/students/BanteayMeanChey.json"), schools: () => import("@/data/schools/school-bonteymenchey.json") },
  "2": { students: () => import("@/data/students/Battambang.json"), schools: () => import("@/data/schools/school-batdombong.json") },
  "3": { students: () => import("@/data/students/KampongCham.json"), schools: () => import("@/data/schools/school-kompongcham.json") },
  "4": { students: () => import("@/data/students/KampongChhnang.json"), schools: () => import("@/data/schools/school-kompongcnang.json") },
  "5": { students: () => import("@/data/students/KampongSpeu.json"), schools: () => import("@/data/schools/school-kompongspeu.json") },
  "6": { students: () => import("@/data/students/KampongThom.json"), schools: () => import("@/data/schools/school-kompongthom.json") },
  "7": { students: () => import("@/data/students/Kampot.json"), schools: () => import("@/data/schools/school-kompot.json") },
  "8": { students: () => import("@/data/students/Kandal.json"), schools: () => import("@/data/schools/school-kondal.json") },
  "9": { students: () => import("@/data/students/KohKong.json"), schools: () => import("@/data/schools/school-khoskong.json") },
  "10": { students: () => import("@/data/students/Kratie.json"), schools: () => import("@/data/schools/school-krorches.json") },
  "11": { students: () => import("@/data/students/MondulKiri.json"), schools: () => import("@/data/schools/school-mondolkiri.json") },
  "12": { students: () => import("@/data/students/PhnomPenh.json"), schools: () => import("@/data/schools/school-phnompenh.json") },
  "13": { students: () => import("@/data/students/PreahVihear.json"), schools: () => import("@/data/schools/school-presvihear.json") },
  "14": { students: () => import("@/data/students/PreyVeng.json"), schools: () => import("@/data/schools/school-preyveng.json") },
  "15": { students: () => import("@/data/students/Pursat.json"), schools: () => import("@/data/schools/school-posat.json") },
  "16": { students: () => import("@/data/students/Ratanakiri.json"), schools: () => import("@/data/schools/school-ratanakiri.json") },
  "17": { students: () => import("@/data/students/SiemReap.json"), schools: () => import("@/data/schools/school-siemreab.json") },
  "18": { students: () => import("@/data/students/PreahSihanouk.json"), schools: () => import("@/data/schools/school-presihanuk.json") },
  "19": { students: () => import("@/data/students/StungTreng.json"), schools: () => import("@/data/schools/school-strengtreang.json") },
  "20": { students: () => import("@/data/students/SvayRieng.json"), schools: () => import("@/data/schools/school-srayreang.json") },
  "21": { students: () => import("@/data/students/Takeo.json"), schools: () => import("@/data/schools/school-tekav.json") },
  "22": { students: () => import("@/data/students/Kep.json"), schools: () => import("@/data/schools/school-kep.json") },
  "23": { students: () => import("@/data/students/Pailin.json"), schools: () => import("@/data/schools/school-pailin.json") },
  "24": { students: () => import("@/data/students/OddarMeanChey.json"), schools: () => import("@/data/schools/school-udormenchey.json") },
  "25": { students: () => import("@/data/students/TboungKhmum.json"), schools: () => import("@/data/schools/school-tbongkhom.json") },
};

// ---------------- UI ----------------
const Card = ({
  children,
  className = "",
  variant = "default",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "gradient" | "glass" | "success";
}) => {
  const variants = {
    default:
      "bg-white border border-purple-100 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden",
    gradient: "relative overflow-hidden shadow-2xl",
    glass: "bg-white/90 backdrop-blur-md border border-purple-100 shadow-xl",
    success: "relative overflow-hidden shadow-2xl",
  };

  return (
    <div className={`rounded-3xl ${variants[variant as keyof typeof variants]} ${className}`}>
      {variant === "gradient" && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600" />
      )}
      {variant === "success" && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#107da8] via-[#107da8] to-[#107da8] rounded-lg shadow-xl" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

const Button = ({
  children,
  onClick,
  className = "",
  disabled = false,
  variant = "primary",
  ...props
}: any) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-2xl text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-11 px-6 py-2 relative overflow-hidden group";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    ghost: "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]} ${className}`}
      disabled={disabled}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

const SelectFilter = ({
  value,
  onChange,
  options,
  disabled = false,
  loading = false,
  icon,
  placeholder,
}: any) => (
  <div className="relative w-full">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
      {icon}
    </div>

    <select
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
      className="w-full h-11 bg-white border border-purple-200 text-gray-700 py-2 pl-10 pr-8 rounded-2xl text-sm appearance-none cursor-pointer disabled:opacity-60 disabled:bg-purple-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm hover:shadow-md"
    >
      <option value="">{placeholder}</option>
      {options.map((opt: any) => {
        const optValue = typeof opt === "object" ? opt.value || opt.id || opt.name : opt;
        const optName = typeof opt === "object" ? opt.name || opt : opt;
        return (
          <option key={optValue} value={optValue}>
            {optName}
          </option>
        );
      })}
    </select>

    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400 z-10">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ChevronDown className="h-4 w-4" />}
    </div>
  </div>
);

// ---------------- Helpers ----------------
const extractSchoolGrades = (schools: SchoolType[], students: Student[]): Map<string, string[]> => {
  const map = new Map<string, Set<string>>();
  schools.forEach((s) => map.set(s.geip_school_ID, new Set()));
  students.forEach((st) => {
    if (!st.school || !st.grade) return;
    const set = map.get(st.school);
    if (set) set.add(String(st.grade));
  });
  const out = new Map<string, string[]>();
  map.forEach((set, id) => out.set(id, Array.from(set).sort()));
  return out;
};

// small helper to avoid flicker: show loading only if > 150ms
const useDelayedBool = (value: boolean, delayMs = 150) => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let t: any;
    if (value) t = setTimeout(() => setShow(true), delayMs);
    else setShow(false);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return show;
};

// ---------------- Main Page ----------------
export default function RegisterExamCodePage() {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const [provinceSchools, setProvinceSchools] = useState<SchoolType[]>([]);
  const [provinceStudents, setProvinceStudents] = useState<Student[]>([]);

  const cacheRef = useRef<Record<string, { schools: SchoolType[]; students: Student[] }>>({});

  const [loadingProvinceData, setLoadingProvinceData] = useState(false);
  const showProvinceLoading = useDelayedBool(loadingProvinceData || isPending, 150);

  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [examCode, setExamCode] = useState("");

  const [isTransitioning, setIsTransitioning] = useState(false);
  const [currentStep, setCurrentStep] = useState<"code" | "subject">("code");

  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [districts, setDistricts] = useState<string[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string; grades?: string[] }[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const selectedSchool = useMemo(
    () => schools.find((s) => s.id === selectedSchoolId),
    [schools, selectedSchoolId]
  );

  // ---------- COPY ----------
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState<string | null>(null);

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";
    textarea.style.left = "-9999px";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  };

  const copyToClipboard = async () => {
    if (!examCode) return;
    setCopyError(null);
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(examCode);
        setCopied(true);
        return;
      }
      const ok = fallbackCopy(examCode);
      if (!ok) throw new Error("fallback copy failed");
      setCopied(true);
    } catch {
      setCopied(false);
      setCopyError("មិនអាចចម្លងបានទេ។ សូមសាកល្បងប្រើ HTTPS/localhost ឬចម្លងដោយដៃ។");
    }
  };

  // ---------- RESET ----------
  const resetAfterProvince = () => {
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
    setCopyError(null);
    setError(null);
  };

  // ---------- LOAD PROVINCE DATA (transition + cache + persist) ----------
  const loadProvince = useCallback(
    async (provinceId: string) => {
      if (!provinceId) {
        setProvinceSchools([]);
        setProvinceStudents([]);
        return;
      }

      const loader = DATA_LOADERS[provinceId];
      if (!loader) {
        setError("មិនមានទិន្នន័យសម្រាប់ខេត្តនេះ។");
        setProvinceSchools([]);
        setProvinceStudents([]);
        return;
      }

      const cached = cacheRef.current[provinceId];
      if (cached) {
        setProvinceSchools(cached.schools);
        setProvinceStudents(cached.students);
        return;
      }

      setLoadingProvinceData(true);
      setError(null);

      try {
        const [schoolsMod, studentsMod] = await Promise.all([loader.schools(), loader.students()]);
        const schoolsData = (schoolsMod.default || []) as SchoolType[];
        const studentsData = (studentsMod.default || []) as Student[];

        cacheRef.current[provinceId] = { schools: schoolsData, students: studentsData };

        setProvinceSchools(schoolsData);
        setProvinceStudents(studentsData);
      } catch (e) {
        console.error(e);
        setError("ផ្ទុកទិន្នន័យខេត្តមិនបាន។ សូមព្យាយាមម្ដងទៀត។");
        setProvinceSchools([]);
        setProvinceStudents([]);
      } finally {
        setLoadingProvinceData(false);
      }
    },
    []
  );

  const handleProvinceChange = (id: string) => {
    startTransition(() => {
      setSelectedProvinceId(id);
      resetAfterProvince();
    });

    // persist for next visit
    try {
      localStorage.setItem("lastProvinceId", id);
    } catch {}

    // load province immediately (but UI stays responsive)
    startTransition(() => {
      void loadProvince(id);
    });
  };

  // auto load last province (optional – makes page feel instant next time)
  useEffect(() => {
    try {
      const last = localStorage.getItem("lastProvinceId") || "";
      if (last && !selectedProvinceId) {
        setSelectedProvinceId(last);
        // load async without blocking
        startTransition(() => {
          void loadProvince(last);
        });
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // idle preload to make first selection feel instant
  useEffect(() => {
    const idle = (cb: () => void) => {
      // @ts-ignore
      if (window.requestIdleCallback) return window.requestIdleCallback(cb);
      return window.setTimeout(cb, 600);
    };

    const id = idle(() => {
      try {
        const last = localStorage.getItem("lastProvinceId") || "";
        if (last && !cacheRef.current[last]) void loadProvince(last);
      } catch {}
      // preload Phnom Penh as common case
      if (!cacheRef.current["12"]) void loadProvince("12");
    });

    return () => {
      // @ts-ignore
      if (window.cancelIdleCallback) window.cancelIdleCallback(id);
      else clearTimeout(id);
    };
  }, [loadProvince]);

  // whenever selectedProvinceId changes by other means
  useEffect(() => {
    if (!selectedProvinceId) return;
    // if already loaded, no-op
    if (cacheRef.current[selectedProvinceId]) return;
    void loadProvince(selectedProvinceId);
  }, [selectedProvinceId, loadProvince]);

  // ---------- Build updatedProvinceData ----------
  const updatedProvinceData: SchoolType[] = useMemo(() => {
    if (!provinceSchools.length) return [];
    const gradesMap = extractSchoolGrades(provinceSchools, provinceStudents);
    return provinceSchools.map((s) => ({
      ...s,
      grades: gradesMap.get(s.geip_school_ID) || [],
    }));
  }, [provinceSchools, provinceStudents]);

  // ---------- Chain data (fast, no heavy loops) ----------
  useEffect(() => {
    if (!selectedProvinceId || !updatedProvinceData.length) {
      setDistricts([]);
      return;
    }
    const names = Array.from(
      new Set(updatedProvinceData.map((s) => s.district_name).filter((x) => x && x.trim() !== ""))
    ).sort();
    setDistricts(names);
  }, [selectedProvinceId, updatedProvinceData]);

  useEffect(() => {
    if (!selectedProvinceId || !selectedDistrict) {
      setSchools([]);
      return;
    }
    const list = updatedProvinceData
      .filter((s) => s.province_ID === selectedProvinceId && s.district_name === selectedDistrict)
      .map((s) => ({ id: s.geip_school_ID, name: s.school_name, grades: s.grades || [] }));
    setSchools(list);
    setSelectedSchoolId("");
  }, [selectedProvinceId, selectedDistrict, updatedProvinceData]);

  useEffect(() => {
    if (!selectedSchoolId) {
      setGrades([]);
      return;
    }
    const school = updatedProvinceData.find((s) => s.geip_school_ID === selectedSchoolId);
    setGrades(school?.grades?.length ? school.grades : ["7", "8", "9", "10", "11", "12"]);
    setSelectedGrade("");
  }, [selectedSchoolId, updatedProvinceData]);

  useEffect(() => {
    if (!selectedSchoolId || !selectedGrade) {
      setStudents([]);
      return;
    }

    // ⚡ faster matching by comparing raw strings (avoid toLowerCase loops repeatedly)
    const schoolId = selectedSchoolId.trim();
    const grade = String(selectedGrade).trim();

    const filtered = provinceStudents.filter((st) => st.school === schoolId && String(st.grade) === grade);

    const mapped = filtered.map((st) => ({
      ...st,
      id: st.student_ID || `${st.last_name}${st.first_name}${st.grade}`,
      fullName: `${st.last_name || ""} ${st.first_name || ""}`.trim(),
    }));

    setStudents(mapped);
    setSelectedStudent(null);
  }, [selectedSchoolId, selectedGrade, provinceStudents]);

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
    setCopyError(null);
    setError(null);
  };

  const handleSchoolChange = (id: string) => {
    setSelectedSchoolId(id);
    setSelectedGrade("");
    setSelectedStudent(null);
    setGrades([]);
    setStudents([]);
    setExamCode("");
    setCopied(false);
    setCopyError(null);
    setError(null);
  };

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    setSelectedStudent(null);
    setStudents([]);
    setExamCode("");
    setCopied(false);
    setCopyError(null);
    setError(null);
  };

  // ---------- Start Exam ----------
  const handleStartExam = useCallback(() => {
    if (!examCode || examCode === "Error") {
      setError("សូមទាញយកកូដប្រឡងជាមុនសិន");
      return;
    }
    if (selectedSchool?.grades?.length && !selectedSchool.grades.includes(selectedGrade)) {
      setError(`ថ្នាក់ ${selectedGrade} មិនមាននៅសាលារៀន ${selectedSchool.name} ទេ។ សូមជ្រើសរើសថ្នាក់ផ្សេង។`);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep("subject");
      setIsTransitioning(false);
    }, 350);
  }, [examCode, selectedGrade, selectedSchool]);

  const handleBackToCode = useCallback(() => setCurrentStep("code"), []);

  // ---------- Get Exam Code ----------
  const handleGetExamCode = useCallback(() => {
    if (!selectedStudent || !selectedSchoolId) return;

    if (selectedSchool?.grades?.length && !selectedSchool.grades.includes(selectedGrade)) {
      setError(`ថ្នាក់ ${selectedGrade} មិនមាននៅសាលារៀន ${selectedSchool.name} ទេ។ សូមជ្រើសរើសថ្នាក់ផ្សេង។`);
      return;
    }

    if (selectedGrade === "11" || selectedGrade === "12") {
      if (!selectedStudent.student_type) {
        setError("សិស្សថ្នាក់ 11 និង 12 ត្រូវបានបញ្ជាក់ប្រភេទវិទ្យាសាស្រ្ដ ឬ វិទ្យាសាស្រ្ដសង្គម ទើបអាចកូដប្រឡង។");
        return;
      }
    }

    setLoadingStep("ExamCode");
    setExamCode("");
    setError(null);
    setCopied(false);
    setCopyError(null);

    try {
      const schoolId = selectedSchoolId;
      const studentId = selectedStudent.student_ID || "00000";
      const firstName = (selectedStudent.first_name || "").replace(/\s+/g, "");
      const lastName = (selectedStudent.last_name || "").replace(/\s+/g, "");
      setExamCode(`${schoolId}.${studentId}.${firstName}.${lastName}`);
    } catch {
      setError("បង្កើតកូដមិនបាន។");
      setExamCode("Error");
    } finally {
      setLoadingStep(null);
    }
  }, [selectedStudent, selectedSchoolId, selectedGrade, selectedSchool]);

  const studentOptions = students;

  // ---------- UI ----------
  const controlsDisabled = showProvinceLoading;

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-purple-600/[0.05]" />

      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full mb-4 shadow-2xl">
              <CheckCircle className="h-12 w-12 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">ការដាក់របាយល្អ!</h2>
            <p className="text-gray-600">កំពុងប្តូទៅទំព័រជ្រើសរើសមុខវិជ្ជា...</p>
            <div className="mt-4">
              <Loader2 className="h-8 w-8 text-green-600 animate-spin mx-auto" />
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto flex md:justify-between justify-between sm:justify-start sm:gap-4 mb-6">
          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-5 md:py-3 md:text-base rounded-lg shadow-lg transition"
            onClick={() => router.back()}
            type="button"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> ត្រឡប់
          </button>

          <Link href="/welcome">
            <button
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-2 text-xs sm:px-4 sm:py-2 sm:text-sm md:px-5 md:py-3 md:text-base rounded-lg shadow-lg transition"
              type="button"
            >
              <Home className="w-4 h-4 sm:w-5 sm:h-5" /> ទំព័រដើម
            </button>
          </Link>
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
                MoEYS EdTech - Online Exam
              </div>
            </div>
          </div>

          <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-blue-800 mb-2 sm:mb-3 leading-tight px-2">
            {currentStep === "code"
              ? "សូមបំពេញព័ត៍មានដើម្បីទទួលបានកូដប្រឡង"
              : "សូមជ្រើសរើសមុខវិជ្ជាប្រឡង"}
          </h1>

          <p className="text-gray-600 mt-2 text-xs sm:text-lg px-2">
            {currentStep === "code"
              ? "បញ្ជាក់៖ សូមពិនិត្យជ្រើសរើស​ ខេត្ត/ស្រុក/សាលារៀន/ឈ្មោះ របស់អ្នកឲ្យបានត្រឹមត្រូវ"
              : "ជ្រើសរើសមុខវិជ្ជាដើម្បីចូលរួមប្រឡង"}
          </p>

          {/* tiny loader (smooth) */}
          {showProvinceLoading && (
            <div className="mt-3 inline-flex items-center gap-2 text-sm text-purple-700">
              <Loader2 className="h-4 w-4 animate-spin" />
              កំពុងផ្ទុកទិន្នន័យ...
            </div>
          )}
        </header>

        <div className="max-w-5xl mx-auto">
          {currentStep === "code" ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">សូមបំពេញព័ត៍មានផ្ទាល់ខ្លួន</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
                      ខេត្ត/ក្រុង
                    </label>
                    <SelectFilter
                      placeholder="ជ្រើសរើសខេត្ត"
                      value={selectedProvinceId}
                      onChange={(e: any) => handleProvinceChange(e.target.value)}
                      options={PROVINCES.map((p) => ({ value: p.id, name: p.name }))}
                      icon={<MapPin className="h-4 w-4 text-purple-500" />}
                      loading={false}
                      disabled={false}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
                      ស្រុក/ខណ្ឌ
                    </label>
                    <SelectFilter
                      placeholder={!selectedProvinceId ? "សូមជ្រើសរើសខេត្តជាមុន" : "ជ្រើសរើសស្រុក/ខណ្ឌ"}
                      value={selectedDistrict}
                      onChange={(e: any) => handleDistrictChange(e.target.value)}
                      options={districts}
                      disabled={!selectedProvinceId || controlsDisabled}
                      loading={showProvinceLoading}
                      icon={<MapPin className="h-4 w-4 text-purple-500" />}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
                      សាលារៀន
                    </label>
                    <SelectFilter
                      placeholder={!selectedDistrict ? "សូមជ្រើសរើសស្រុកជាមុន" : "ជ្រើសរើសសាលារៀន"}
                      value={selectedSchoolId}
                      onChange={(e: any) => handleSchoolChange(e.target.value)}
                      options={schools.map((s) => ({ value: s.id, name: s.name }))}
                      disabled={!selectedDistrict || controlsDisabled}
                      loading={showProvinceLoading}
                      icon={<School className="h-4 w-4 text-purple-500" />}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
                      ថ្នាក់
                    </label>
                    <SelectFilter
                      placeholder={!selectedSchoolId ? "សូមជ្រើសរើសសាលាជាមុន" : "ជ្រើសរើសថ្នាក់"}
                      value={selectedGrade}
                      onChange={(e: any) => handleGradeChange(e.target.value)}
                      options={grades}
                      disabled={!selectedSchoolId || controlsDisabled}
                      loading={false}
                      icon={<BookOpen className="h-4 w-4 text-purple-500" />}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
                      ឈ្មោះសិស្ស
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
                        <Users className="h-4 w-4 text-purple-500" />
                      </div>

                      <select
                        value={selectedStudent?.id || ""}
                        onChange={(e) => {
                          const st = studentOptions.find((s) => s.id === e.target.value);
                          setSelectedStudent(st || null);
                          setExamCode("");
                          setCopied(false);
                          setCopyError(null);
                        }}
                        disabled={!selectedGrade || studentOptions.length === 0 || controlsDisabled}
                        className="w-full h-11 bg-white border border-purple-200 text-gray-700 py-2 pl-10 pr-8 rounded-2xl text-sm appearance-none cursor-pointer disabled:bg-purple-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm hover:shadow-md"
                      >
                        <option value="">
                          {!selectedGrade
                            ? "សូមជ្រើសរើសថ្នាក់ជាមុន"
                            : studentOptions.length > 0
                            ? "ជ្រើសរើសឈ្មោះសិស្ស"
                            : "មិនមានសិស្សក្នុងថ្នាក់នេះ"}
                        </option>
                        {studentOptions.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.fullName || `${s.last_name || ""} ${s.first_name || ""}`.trim()} (
                            {s.student_ID || "N/A"})
                          </option>
                        ))}
                      </select>

                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400 z-10">
                        <ChevronDown className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleGetExamCode}
                  className="w-full mt-6 text-base from-blue-500 via-sky-500 to-cyan-600"
                  disabled={!selectedStudent || loadingStep === "ExamCode" || controlsDisabled}
                >
                  {loadingStep === "ExamCode" ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5 mr-2" />
                  )}
                  បង្កើតកូដរបស់អ្នក
                </Button>
              </Card>

              <Card variant="success" className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-blue-400 shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">សូមចម្លងកូដប្រឡងរបស់អ្នក</h2>
                </div>

                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm text-white p-4 rounded-2xl border border-red-400/30 mb-4 flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 text-yellow-300" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                {copyError && (
                  <div className="bg-yellow-500/20 backdrop-blur-sm text-white p-4 rounded-2xl border border-yellow-300/40 mb-4 flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 text-yellow-300" />
                    <span className="text-sm">{copyError}</span>
                  </div>
                )}

                <div className="min-h-[220px] flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/40 bg-white/10 backdrop-blur-sm rounded-2xl">
                  {loadingStep === "ExamCode" ? (
                    <div className="text-center">
                      <Loader2 className="h-10 w-10 text-white animate-spin mx-auto mb-4" />
                      <p className="text-white/90 text-base font-semibold">កំពុងទាញយកកូដ...</p>
                    </div>
                  ) : examCode && examCode !== "Error" ? (
                    <>
                      <p className="text-gray-100 mb-2 text-xs sm:text-lg px-2">
                        សូមចម្លងកូដខាងក្រោម​ មុនពេលចាប់ផ្តើមប្រឡង៖
                      </p>

                      <div className="text-center bg-white/20 backdrop-blur-sm p-5 rounded-2xl border border-white/30 w-full">
                        <p className="text-white mt-2 text-sm sm:text-lg px-2 font-mono break-all">
                          {examCode}
                        </p>

                        <div className="flex gap-3 mt-4 justify-center">
                          <Button
                            onClick={copyToClipboard}
                            variant="ghost"
                            className="bg-blue-800 backdrop-blur-sm text-gray-100 border border-blue-400 shadow-lg hover:bg-yellow-600"
                          >
                            {copied ? (
                              <>
                                <Check className="h-4 w-4 mr-2" />
                                បានចម្លង
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
                    <div className="text-white text-1xl leading-relaxed">
                      <p className="text-2xl pb-4">សូមអនុវត្តតាមជំហាន៖</p>
                      <ol className="text-start list-none pl-0">
                        <li>១. សូមជ្រើសរើសខេត្ត</li>
                        <li>២. សូមជ្រើសរើសស្រុក</li>
                        <li>៣. សូមជ្រើសរើសសាលារៀន</li>
                        <li>៤. សូមជ្រើសរើសថ្នាក់</li>
                        <li>៥. សូមជ្រើសរើសឈ្មោះរបស់អ្នក ដើម្បីទទួលបានកូដប្រឡង។</li>
                      </ol>
                      <p className="pt-3">
                        <strong className="text-yellow-300">សម្គាល់៖</strong>{" "}
                        សូមចម្លងកូដនេះដើម្បីទុកបំពេញក្នុងទម្រង់ប្រឡង
                      </p>
                    </div>
                  )}
                </div>

                {copied && (
                  <div className="mt-5 flex justify-center">
                    <Button
                      onClick={handleStartExam}
                      className="bg-white text-green-700 hover:bg-green-50 shadow-2xl text-base"
                    >
                      ជ្រើសរើសមុខវិជ្ជា
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                )}
              </Card>
            </div>
          ) : (
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SubjectSelection
                selectedStudent={selectedStudent}
                selectedSchool={selectedSchool}
                selectedGrade={selectedGrade}
                selectedProvinceId={selectedProvinceId}
                examCode={examCode}
                SUBJECTS={SUBJECTS}
                handleBackToCode={handleBackToCode}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
