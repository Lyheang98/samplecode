

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


import SubjectSelection from "@/components/SubjectSelection";

// Student Data Imports (all JSON files contain student data)
import banteayMeancheyStudentsData from "@/data/students/BanteayMeanChey.json";
import battambangStudentsData from "@/data/students/Battambang.json";
import kampongChamStudentsData from "@/data/students/KampongCham.json";
import kampongChhnangStudentsData from "@/data/students/KampongChhnang.json";
import kampongSpeuStudentsData from "@/data/students/KampongSpeu.json";
import kampongThomStudentsData from "@/data/students/KampongThom.json";
import kampotStudentsData from "@/data/students/Kampot.json";
import kandalStudentsData from "@/data/students/Kandal.json";
import kepStudentsData from "@/data/students/Kep.json";
import kohKongStudentsData from "@/data/students/KohKong.json";
import kratieStudentsData from "@/data/students/Kratie.json";
import mondulKiriStudentsData from "@/data/students/MondulKiri.json";
import oddarMeancheyStudentsData from "@/data/students/OddarMeanChey.json";
import pailinStudentsData from "@/data/students/Pailin.json";
import phnomPenhStudentsData from "@/data/students/PhnomPenh.json";
import preahSihanoukStudentsData from "@/data/students/PreahSihanouk.json";
import preahVihearStudentsData from "@/data/students/PreahVihear.json";
import preyVengStudentsData from "@/data/students/PreyVeng.json";
import pursatStudentsData from "@/data/students/Pursat.json";
import ratanakiriStudentsData from "@/data/students/Ratanakiri.json";
import siemReapStudentsData from "@/data/students/SiemReap.json";
import stungTrengStudentsData from "@/data/students/StungTreng.json";
import svayRiengStudentsData from "@/data/students/SvayRieng.json";
import takeoStudentsData from "@/data/students/Takeo.json";
import tboungKhmumStudentsData from "@/data/students/TboungKhmum.json";

// School Data Imports (all JSON files contain school data)
import banteayMeancheySchoolData from "@/data/schools/school-bonteymenchey.json";
import battambangSchoolData from "@/data/schools/school-batdombong.json";
import kepSchoolData from "@/data/schools/school-kep.json";
import kohkongSchoolData from "@/data/schools/school-khoskong.json";
import kompongchamSchoolData from "@/data/schools/school-kompongcham.json";
import kompongchhnangSchoolData from "@/data/schools/school-kompongcnang.json";
import kompongspeuSchoolData from "@/data/schools/school-kompongspeu.json";
import kompongThomSchoolData from "@/data/schools/school-kompongthom.json";
import kompotSchoolData from "@/data/schools/school-kompot.json";
import kratieSchoolData from "@/data/schools/school-krorches.json";
import mondolkiriSchoolData from "@/data/schools/school-mondolkiri.json";
import oddarMeancheySchoolData from "@/data/schools/school-udormenchey.json";
import pailinSchoolData from "@/data/schools/school-pailin.json";
import phnompenhSchoolData from "@/data/schools/school-phnompenh.json";
import preahSihanoukSchoolData from "@/data/schools/school-presihanuk.json";
import preahVihearSchoolData from "@/data/schools/school-presvihear.json";
import preyvengSchoolData from "@/data/schools/school-preyveng.json";
import pursatSchoolData from "@/data/schools/school-posat.json";
import rattanakiriSchoolData from "@/data/schools/school-ratanakiri.json";
import siemreapSchoolData from "@/data/schools/school-siemreab.json";
import stungtrengSchoolData from "@/data/schools/school-strengtreang.json";
import svayriengSchoolData from "@/data/schools/school-srayreang.json";
import takaeoSchoolData from "@/data/schools/school-tekav.json";
import tboungKhmumSchoolData from "@/data/schools/school-tbongkhom.json";
import kandalSchoolData from "@/data/schools/school-kondal.json";

// Define types for our data structures
interface School {
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

// --- Import student data as arrays and combine them ---
export const allStudents: Student[] = [
  ...(banteayMeancheyStudentsData as Student[]),
  ...(battambangStudentsData as Student[]),
  ...(kepStudentsData as Student[]),
  ...(kohKongStudentsData as Student[]),
  ...(kampongChamStudentsData as Student[]),
  ...(kampongChhnangStudentsData as Student[]),
  ...(kampongSpeuStudentsData as Student[]),
  ...(kampongThomStudentsData as Student[]),
  ...(kampotStudentsData as Student[]),
  ...(kandalStudentsData as Student[]),
  ...(kratieStudentsData as Student[]),
  ...(mondulKiriStudentsData as Student[]),
  ...(oddarMeancheyStudentsData as Student[]),
  ...(pailinStudentsData as Student[]),
  ...(phnomPenhStudentsData as Student[]),
  ...(preahSihanoukStudentsData as Student[]),
  ...(preahVihearStudentsData as Student[]),
  ...(preyVengStudentsData as Student[]),
  ...(pursatStudentsData as Student[]),
  ...(ratanakiriStudentsData as Student[]),
  ...(siemReapStudentsData as Student[]),
  ...(stungTrengStudentsData as Student[]),
  ...(svayRiengStudentsData as Student[]),
  ...(takeoStudentsData as Student[]),
  ...(tboungKhmumStudentsData as Student[]),
];

// --- Use the actual school data from your imports ---
export const provinceData: School[] = [
  ...(banteayMeancheySchoolData as School[]),
  ...(battambangSchoolData as School[]),
  ...(kepSchoolData as School[]),
  ...(kohkongSchoolData as School[]),
  ...(kompongchamSchoolData as School[]),
  ...(kompongchhnangSchoolData as School[]),
  ...(kompongspeuSchoolData as School[]),
  ...(kompongThomSchoolData as School[]),
  ...(kompotSchoolData as School[]),
  ...(kratieSchoolData as School[]),
  ...(mondolkiriSchoolData as School[]),
  ...(oddarMeancheySchoolData as School[]),
  ...(pailinSchoolData as School[]),
  ...(phnompenhSchoolData as School[]),
  ...(preahSihanoukSchoolData as School[]),
  ...(preahVihearSchoolData as School[]),
  ...(preyvengSchoolData as School[]),
  ...(pursatSchoolData as School[]),
  ...(rattanakiriSchoolData as School[]),
  ...(siemreapSchoolData as School[]),
  ...(stungtrengSchoolData as School[]),
  ...(kandalSchoolData as School[]),
  ...(svayriengSchoolData as School[]),
  ...(takaeoSchoolData as School[]),
  ...(tboungKhmumSchoolData as School[]),
];

// Function to extract available grades for each school from student data
const extractSchoolGrades = (): Map<string, string[]> => {
  const schoolGradesMap = new Map<string, Set<string>>();

  // Initialize with empty sets for all schools
  provinceData.forEach(school => {
    schoolGradesMap.set(school.geip_school_ID, new Set());
  });

  // Populate with grades from student data
  allStudents.forEach(student => {
    if (student.school && student.grade) {
      const schoolId = student.school;
      if (schoolGradesMap.has(schoolId)) {
        const grades = schoolGradesMap.get(schoolId);
        if (grades) {
          grades.add(student.grade);
        }
      }
    }
  });

  // Convert Sets to sorted arrays
  const result = new Map<string, string[]>();
  schoolGradesMap.forEach((grades, schoolId) => {
    result.set(schoolId, Array.from(grades).sort());
  });

  return result;
};

// Get school grades map
const schoolGradesMap = extractSchoolGrades();

// Update provinceData to include grades for each school
const updatedProvinceData: School[] = provinceData.map(school => ({
  ...school,
  grades: schoolGradesMap.get(school.geip_school_ID) || []
}));

// --- Constants (PROVINCES list) ---
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
  { id: "23", name: "ខេត្តប៉ៃលិន" },  // Changed from Kep to Pailin
  { id: "24", name: "ខេត្តឧត្តរមានជ័យ" },
  { id: "25", name: "ខេត្តត្បូងឃ្មុំ" },
];

// Define subjects for each grade
const SUBJECTS: Record<string, string[]> = {
  "7": [
    "ភាសាខ្មែរ",
    "គណិតវិទ្យា",
    "រូបវិទ្យា",
    "គីមីវិទ្យា",
    "ជីវវិទ្យា",
    "ប្រវត្តិវិទ្យា",
    "ភូមិវិទ្យា",
    "សីលធម៌-ពលរដ្ឋវិជ្ជា",
    "ផែនដីវិទ្យា",
    "អង់គ្លេស",
  ],
  "8": [
    "ភាសាខ្មែរ",
    "គណិតវិទ្យា",
    "រូបវិទ្យា",
    "គីមីវិទ្យា",
    "ជីវវិទ្យា",
    "ប្រវត្តិវិទ្យា",
    "ភូមិវិទ្យា",
    "សីលធម៌-ពលរដ្ឋវិជ្ជា",
    "ផែនដីវិទ្យា",
    "អង់គ្លេស",
  ],
  "9": [
    "ភាសាខ្មែរ",
    "គណិតវិទ្យា",
    "រូបវិទ្យា",
    "គីមីវិទ្យា",
    "ជីវវិទ្យា",
    "ប្រវត្តិវិទ្យា",
    "ភូមិវិទ្យា",
    "សីលធម៌-ពលរដ្ឋវិជ្ជា",
    "ផែនដីវិទ្យា",
    "អង់គ្លេស",
  ],
  "10": [
    "ភាសាខ្មែរ",
    "គណិតវិទ្យា",
    "រូបវិទ្យា",
    "គីមីវិទ្យា",
    "ជីវវិទ្យា",
    "ប្រវត្តិវិទ្យា",
    "ភូមិវិទ្យា",
    "សីលធម៌-ពលរដ្ឋវិជ្ជា",
    "ផែនដីវិទ្យា",
    "អង់គ្លេស",
  ],
  "11": [
    "ភាសាខ្មែរ",
    "គណិតវិទ្យា",
    "រូបវិទ្យា",
    "គីមីវិទ្យា",
    "ជីវវិទ្យា",
    "ប្រវត្តិវិទ្យា",
    "ភូមិវិទ្យា",
    "សីលធម៌-ពលរដ្ឋវិជ្ជា",
    "ផែនដីវិទ្យា",
    "អង់គ្លេស",
  ],
  "12": [
    "ភាសាខ្មែរ",
    "គណិតវិទ្យា",
    "រូបវិទ្យា",
    "គីមីវិទ្យា",
    "ជីវវិទ្យា",
    "ប្រវត្តិវិទ្យា",
    "ភូមិវិទ្យា",
    "សីលធម៌-ពលរដ្ឋវិជ្ជា",
    "ផែនដីវិទ្យា",
    "អង់គ្លេស",
  ],
};

// --- UI Components ---
const Card = ({ children, className = "", variant = "default" }: any) => {
  const variants = {
    default:
      "bg-white border border-purple-100 shadow-xl hover:shadow-2xl transition-all duration-300 relative overflow-hidden",
    gradient: "relative overflow-hidden shadow-2xl",
    glass: "bg-white/90 backdrop-blur-md border border-purple-100 shadow-xl",
    success: "relative overflow-hidden shadow-2xl",
  };

  return (
    <div
      className={`rounded-3xl ${variants[variant as keyof typeof variants]
        } ${className}`}
    >
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
      "bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 transition-all",
    secondary:
      "bg-white text-purple-700 border border-purple-200 hover:bg-purple-50 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
    success:
      "bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 text-white hover:from-emerald-600 hover:via-green-600 hover:to-teal-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    ghost:
      "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200",
    back: "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]
        } ${className}`}
      disabled={disabled}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

const SelectFilter = ({
  label,
  value,
  onChange,
  options,
  disabled = false,
  loading = false,
  icon,
}: any) => (
  <div className="relative w-full">
    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none z-10">
      {icon}
    </div>
    <select
      value={value}
      onChange={onChange}
      disabled={disabled || loading}
      className="w-full h-11 bg-white border border-purple-200 text-gray-700 py-2 pl-10 pr-8 rounded-2xl text-sm appearance-none cursor-pointer disabled:opacity-50 disabled:bg-purple-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm hover:shadow-md"
    >
      <option value="">{loading ? `កំពុងផ្ទុក ${label}...` : label}</option>
      {options.map((opt: any) => {
        const optValue =
          typeof opt === "object" ? opt.value || opt.id || opt.name : opt;
        const optName = typeof opt === "object" ? opt.name || opt : opt;
        return (
          <option key={optValue} value={optValue}>
            {optName}
          </option>
        );
      })}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-purple-400 z-10">
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <ChevronDown className="h-4 w-4" />
      )}
    </div>
  </div>
);

// --- Main Component ---
export default function RegisterExamCodePage() {
  const router = useRouter();
  const [loadingStep, setLoadingStep] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [examCode, setExamCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Add state to track current step (code generation or subject selection)
  const [currentStep, setCurrentStep] = useState<"code" | "subject">("code");

  // Filter states
  const [selectedProvinceId, setSelectedProvinceId] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState("");
  const [selectedGrade, setSelectedGrade] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  // Data options states
  const [districts, setDistricts] = useState<string[]>([]);
  const [schools, setSchools] = useState<{ id: string; name: string; grades?: string[] }[]>([]);
  const [grades, setGrades] = useState<string[]>([]);
  const [students, setStudents] = useState<any[]>([]);

  const selectedSchool = useMemo(
    () => schools.find((s) => s.id === selectedSchoolId),
    [schools, selectedSchoolId]
  );

  // --- Static Data Functions ---
  const fetchDistrictsFromStatic = useCallback(() => {
    if (!selectedProvinceId) return;

    const provinceSchools = updatedProvinceData.filter(
      (school: School) => school.province_ID === selectedProvinceId
    );

    if (provinceSchools.length === 0) {
      setError(`មិនមានទិន្នន័យសម្រាប់ខេត្តដែលបានជ្រើសរើស។ សូមជ្រើសរើសខេត្តផ្សេង។`);
      setDistricts([]);
      return;
    }

    const districtNames = Array.from(
      new Set(
        provinceSchools
          .map((school: School) => school.district_name)
          .filter((name: string) => name && name.trim() !== "")
      )
    ).sort() as string[];

    setDistricts(districtNames);
    setError(null);
  }, [selectedProvinceId]);

  const fetchSchoolsFromStatic = useCallback(() => {
    if (!selectedProvinceId || !selectedDistrict) {
      setSchools([]);
      return;
    }

    const filteredSchools = updatedProvinceData.filter(
      (school: School) =>
        school.province_ID === selectedProvinceId &&
        school.district_name === selectedDistrict
    );

    const mappedSchools = filteredSchools.map((school: School) => ({
      id: school.geip_school_ID,
      name: school.school_name,
      grades: school.grades || []
    }));

    setSchools(mappedSchools);
    setSelectedSchoolId("");
  }, [selectedProvinceId, selectedDistrict]);

  const fetchGradesFromStatic = useCallback(() => {
    if (!selectedProvinceId || !selectedDistrict || !selectedSchoolId) {
      setGrades([]);
      return;
    }

    const school = updatedProvinceData.find(
      (s: School) => s.geip_school_ID === selectedSchoolId
    );

    if (school && school.grades && school.grades.length > 0) {
      setGrades(school.grades);
    } else {
      const defaultGrades = ["7", "8", "9", "10", "11", "12"];
      setGrades(defaultGrades);
    }

    setSelectedGrade("");
  }, [selectedProvinceId, selectedDistrict, selectedSchoolId]);

  const fetchStudentsFromStatic = useCallback(() => {
    if (
      !selectedProvinceId ||
      !selectedDistrict ||
      !selectedSchoolId ||
      !selectedGrade
    ) {
      setStudents([]);
      return;
    }

    const normalizedSelectedSchoolId = selectedSchoolId.toLowerCase().trim();
    const normalizedSelectedGrade = selectedGrade
      .toString()
      .toLowerCase()
      .trim();

    const filteredStudents = allStudents.filter((student: Student) => {
      const studentSchoolId = student.school
        ? student.school.toLowerCase().trim()
        : "";
      const studentGrade = student.grade
        ? student.grade.toString().toLowerCase().trim()
        : "";

      return (
        studentSchoolId === normalizedSelectedSchoolId &&
        studentGrade === normalizedSelectedGrade
      );
    });

    // Create proper student objects with fullName for display
    const mappedStudents = filteredStudents.map((student) => ({
      ...student,
      id: student.student_ID || `${student.last_name}${student.first_name}${student.grade}`,
      fullName: `${student.last_name || ""} ${student.first_name || ""}`.trim(),
    }));

    setStudents(mappedStudents);
    setSelectedStudent(null);
  }, [selectedProvinceId, selectedDistrict, selectedSchoolId, selectedGrade]);

  // --- Filter Reset Handlers ---
  const handleProvinceChange = (id: string) => {
    setSelectedProvinceId(id);
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
    setError(null);
  };

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
    setError(null);
  };

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    setSelectedStudent(null);
    setStudents([]);
    setExamCode("");
    setCopied(false);
    setError(null);
  };

  // --- Copy to clipboard function ---
  const copyToClipboard = useCallback(() => {
    if (examCode) {
      navigator.clipboard.writeText(examCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }, [examCode]);

  // --- Start Exam function ---
  const handleStartExam = useCallback(() => {
    if (!examCode || examCode === "Error") {
      setError("សូមទាញយកកូដប្រឡងជាមុនសិន");
      return;
    }

    if (selectedSchool && selectedSchool.grades && !selectedSchool.grades.includes(selectedGrade)) {
      setError(`ថ្នាក់ ${selectedGrade} មិនមាននៅសាលារៀន ${selectedSchool.name} ទេ។ សូមជ្រើសរើសថ្នាក់ផ្សេង។`);
      return;
    }

    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentStep("subject");
      setIsTransitioning(false);
    }, 500);
  }, [examCode, selectedGrade, selectedSchool]);

  // --- Back to code generation ---
  const handleBackToCode = useCallback(() => {
    setCurrentStep("code");
  }, []);

  // --- Get Exam Code Handler ---
  const handleGetExamCode = useCallback(() => {
    if (!selectedStudent || !selectedSchoolId) return;

    if (selectedSchool && selectedSchool.grades && !selectedSchool.grades.includes(selectedGrade)) {
      setError(`ថ្នាក់ ${selectedGrade} មិនមាននៅសាលារៀន ${selectedSchool.name} ទេ។ សូមជ្រើសរើសថ្នាក់ផ្សេង។`);
      return;
    }

    // VALIDATION: Check student_type for grades 11 and 12
    if ((selectedGrade === "11" || selectedGrade === "12")) {
      if (!selectedStudent.student_type || selectedStudent.student_type === "") {
        setError("សិស្សថ្នាក់ 11 និង 12 ត្រូវបានបញ្ជាក់ប្រភេទវិទ្យាសាស្រ្ដ ឬ វិទ្យាសាស្រ្ដសង្គម ទើបអាចកូដប្រឡង។");
        return;
      }
    }

    setLoadingStep("ExamCode");
    setExamCode("");
    setError(null);
    setCopied(false);

    try {
      // Use static data approach - CHANGED FORMAT: firstName.lastName instead of lastName.firstName
      const schoolId = selectedSchoolId;
      const studentId = selectedStudent.student_ID || "00000";
      const firstName = (selectedStudent.first_name || "").replace(/\s+/g, "");
      const lastName = (selectedStudent.last_name || "").replace(/\s+/g, "");
      // CHANGED: firstName.lastName instead of lastName.firstName
      const examCodeResult = `${schoolId}.${studentId}.${firstName}.${lastName}`;
      setExamCode(examCodeResult);
    } catch (err: any) {
      setError(`សិស្សមិ​នមានការបញ្ជាក់ថ្នាក់វិទ្យាសាស្រ្ដ ឬ ថ្នាក់វិទ្យាសាស្រ្ដសង្គម`);
      setExamCode("Error");
    } finally {
      setLoadingStep(null);
    }
  }, [
    selectedStudent,
    selectedProvinceId,
    selectedDistrict,
    selectedSchoolId,
    selectedGrade,
    selectedSchool,
  ]);

  // --- useEffect Hooks ---
  // 1. Fetch Districts
  useEffect(() => {
    fetchDistrictsFromStatic();
  }, [selectedProvinceId, fetchDistrictsFromStatic]);

  // 2. Fetch Schools
  useEffect(() => {
    fetchSchoolsFromStatic();
  }, [selectedProvinceId, selectedDistrict, fetchSchoolsFromStatic]);

  // 3. Fetch Grades
  useEffect(() => {
    fetchGradesFromStatic();
  }, [selectedProvinceId, selectedDistrict, selectedSchoolId, fetchGradesFromStatic]);

  // 4. Fetch Students
  useEffect(() => {
    fetchStudentsFromStatic();
  }, [
    selectedProvinceId,
    selectedDistrict,
    selectedSchoolId,
    selectedGrade,
    fetchStudentsFromStatic,
  ]);

  const studentOptions = students;

  return (
    <div className="min-h-screen relative">
      {/* White Background with 5% Purple Overlay */}
      <div className="absolute inset-0 bg-white" />
      <div className="absolute inset-0 bg-purple-600/[0.05]" />

      {/* Transition Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm">
          <div className="text-center">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full mb-4 shadow-2xl">
              <CheckCircle className="h-12 w-12 text-white animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              ការដាក់របាយល្អ!
            </h2>
            <p className="text-gray-600">
              កំពុងប្តូទៅទំព័រជ្រើសរើសមុខវិជ្ជា...
            </p>
            <div className="mt-4">
              <Loader2 className="h-8 w-8 text-green-600 animate-spin mx-auto" />
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        {/* Navigation & Header */}
        <div className="max-w-5xl mx-auto flex md:justify-between justify-between sm:justify-start sm:gap-4 mb-6">
          <button className="
              flex items-center gap-2
              bg-blue-600 hover:bg-blue-700 text-white font-bold
              px-3 py-2 text-xs
              sm:px-4 sm:py-2 sm:text-sm
              md:px-5 md:py-3 md:text-base
              rounded-lg shadow-lg transition
            ">
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" /> ត្រឡប់
          </button>
          <Link href="/welcome">
            <button className="
              flex items-center gap-2
              bg-green-600 hover:bg-green-700 text-white font-bold
              px-3 py-2 text-xs
              sm:px-4 sm:py-2 sm:text-sm
              md:px-5 md:py-3 md:text-base
              rounded-lg shadow-lg transition
            ">
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
              : "ជ្រើសរើសមុខវិជ្ជាប្រឡង"}
          </h1>
          <p className="text-gray-600 mt-2 text-xs sm:text-lg px-2">
            {currentStep === "code"
              ? "បញ្ជាក់៖ សូមជ្រើសរើស​ ខេត្ត/ស្រុក/សាលារៀន/ឈ្មោះ របស់អ្នកឲ្យបានត្រឹមត្រូវ"
              : "ជ្រើសរើសមុខវិជ្ជាដើម្បីចូលរួមប្រឡង"}
          </p>
          {/* <div className="mt-2 px-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {ទាញទិន្នន័យបានជោគជ័យ}
              </span>
            </div> */}

        </header>

        <div className="max-w-5xl mx-auto">
          {currentStep === "code" ? (
            // Code Generation Step
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* --- Student Selection (Left Card) --- */}
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl shadow-lg">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">
                    សូមបំពេញព័ត៍មានផ្ទាល់ខ្លួន
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
                      ខេត្ត/ក្រុង
                    </label>
                    <SelectFilter
                      label=""
                      value={selectedProvinceId}
                      onChange={(e: any) =>
                        handleProvinceChange(e.target.value)
                      }
                      options={PROVINCES.map((p) => ({
                        value: p.id,
                        name: p.name,
                      }))}
                      icon={<MapPin className="h-4 w-4 text-purple-500" />}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
                      ស្រុក/ខណ្ឌ
                    </label>
                    <SelectFilter
                      label=""
                      value={selectedDistrict}
                      onChange={(e: any) =>
                        handleDistrictChange(e.target.value)
                      }
                      options={districts}
                      disabled={!selectedProvinceId}
                      loading={loadingStep === "ស្រុក"}
                      icon={<MapPin className="h-4 w-4 text-purple-500" />}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
                      សាលារៀន
                    </label>
                    <SelectFilter
                      label=""
                      value={selectedSchoolId}
                      onChange={(e: any) => handleSchoolChange(e.target.value)}
                      options={schools.map((s) => ({
                        value: s.id,
                        name: s.name,
                      }))}
                      disabled={!selectedDistrict}
                      loading={loadingStep === "សាលារៀន"}
                      icon={<School className="h-4 w-4 text-purple-500" />}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-purple-600 block mb-1 uppercase tracking-wider">
                      ថ្នាក់
                    </label>
                    <SelectFilter
                      label=""
                      value={selectedGrade}
                      onChange={(e: any) => handleGradeChange(e.target.value)}
                      options={grades}
                      disabled={!selectedSchoolId}
                      loading={loadingStep === "ថ្នាក់"}
                      icon={<BookOpen className="h-4 w-4 text-purple-500" />}
                    />
                  </div>

                  {/* Student Name Selection */}
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
                          const student = studentOptions.find(
                            (s) => s.id === e.target.value
                          );
                          setSelectedStudent(student || null);
                          setExamCode("");
                          setCopied(false);
                        }}
                        disabled={
                          !selectedGrade ||
                          loadingStep === `សិស្សថ្នាក់ ${selectedGrade}` ||
                          studentOptions.length === 0
                        }
                        className="w-full h-11 bg-white border border-purple-200 text-gray-700 py-2 pl-10 pr-8 rounded-2xl text-sm appearance-none cursor-pointer disabled:bg-purple-50 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all shadow-sm hover:shadow-md"
                      >
                        <option value="">
                          {loadingStep === `សិស្សថ្នាក់ ${selectedGrade}`
                            ? "កំពុងផ្ទុកសិស្ស..."
                            : studentOptions.length > 0
                              ? "ជ្រើសរើសឈ្មោះសិស្ស"
                              : "មិនមានសិស្សក្នុងថ្នាក់នេះ"}
                        </option>
                        {studentOptions.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.fullName || `${s.last_name || ""} ${s.first_name || ""}`.trim()} ({s.student_ID || "N/A"})
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
                  disabled={!selectedStudent || loadingStep === "ExamCode"}
                >
                  {loadingStep === "ExamCode" ? (
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5 mr-2" />
                  )}
                  បង្កើតកូដរបស់អ្នក
                </Button>
              </Card>

              {/* --- Exam Code Result (Right Card) --- */}
              <Card variant="success" className="p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl border border-blue-400 shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white">
                    សូមចម្លងកូដប្រឡងរបស់អ្នក
                  </h2>
                </div>

                {error && (
                  <div className="bg-red-500/20 backdrop-blur-sm text-white p-4 rounded-2xl border border-red-400/30 mb-4 flex items-start">
                    <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 text-yellow-300" />
                    <span className="text-sm">{error}</span>
                  </div>
                )}

                <div className="min-h-[220px] flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/40 bg-white/10 backdrop-blur-sm rounded-2xl">
                  {loadingStep === "ExamCode" ? (
                    <div className="text-center">
                      <Loader2 className="h-10 w-10 text-white animate-spin mx-auto mb-4" />
                      <p className="text-white/90 text-base font-semibold">
                        កំពុងទាញយកកូដ...
                      </p>
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
                        <strong className="text-yellow-300">សម្គាល់៖</strong>
                        សូមយកូដនេះដើម្បីទុកបំពេញក្នុងទម្រង់ប្រឡង
                      </p>
                    </div>
                  )}
                </div>

                {/* Start Exam Button - Only visible after copying code */}
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
            // Subject Selection Step
            <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
              <SubjectSelection
                selectedStudent={selectedStudent}
                selectedSchool={selectedSchool}
                selectedGrade={selectedGrade}
                selectedProvinceId={selectedProvinceId}
                examCode={examCode}
                SUBJECTS={SUBJECTS}
                handleBackToCode={handleBackToCode} // Key for returning to the first step
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}