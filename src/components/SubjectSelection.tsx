"use client";

import { useState, useEffect, useCallback } from "react";
import {
  User,
  BookOpen,
  Home,
  ArrowRight,
  ExternalLink,
  AlertTriangle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  Award,
  MessageSquare,
  Calculator,
  Zap,
  FlaskConical,
  Dna,
  Clock,
  Map,
  Users,
  Globe,
  Languages,
  Atom,
  Beaker,
  Calendar,
  Mountain,
  Shield,
  Hash,
  FileText,
  Heart,
  Bug,
  Archive,
  Compass,
  Handshake,
  Trees,
  TestTube,
  Square,
  Activity,
  CheckCircle,
  ChevronDown,
  X,
  UserCircle,
  School,
  GraduationCap,
  Star,
  BarChart3,
  Timer,
  BookMarked,
  PlayCircle,
  Info,
} from "lucide-react";

import { getExamLink } from "@/utils/examLinks";
import QuizUI from "@/components/QuizUI";

const Card = ({ children, className = "" }: any) => (
  <div
    className={`bg-white border border-gray-200 rounded-xl shadow-sm ${className}`}
  >
    {children}
  </div>
);

const Button = ({
  children,
  onClick,
  className = "",
  disabled = false,
  variant = "primary",
  ...props
}: any) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-11 px-5 py-2";

  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
    success: "bg-green-600 text-white hover:bg-green-700 shadow-sm",
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({
  value,
  onChange,
  type = "text",
  placeholder,
  className = "",
  ...props
}: any) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange && onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full h-11 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    {...props}
  />
);

interface SubjectSelectionProps {
  selectedStudent: any;
  selectedSchool: { id: string; name: string } | undefined;
  selectedGrade: string;
  selectedProvinceId: string;
  examCode: string;
  SUBJECTS: { [key: string]: string[] };
  PROVINCES: { id: string; name: string }[];
  handleBackToCode: () => void;
}

// Subject icons mapping
const SUBJECT_ICONS: { [key: string]: JSX.Element } = {
  ភាសាខ្មែរ: <MessageSquare className="h-6 w-6" />,
  គណិតវិទ្យា: <Calculator className="h-6 w-6" />,
  រូបវិទ្យា: <Zap className="h-6 w-6" />,
  គីមីវិទ្យា: <FlaskConical className="h-6 w-6" />,
  ជីវវិទ្យា: <Dna className="h-6 w-6" />,
  ប្រវត្តិវិទ្យា: <Clock className="h-6 w-6" />,
  ភូមិវិទ្យា: <Map className="h-6 w-6" />,
  "សីលធម៌-ពលរដ្ឋវិជ្ជា": <Users className="h-6 w-6" />,
  ផែនដីវិទ្យា: <Globe className="h-6 w-6" />,
  អង់គ្លេស: <Languages className="h-6 w-6" />,
};

// Subject colors mapping
const SUBJECT_COLORS: { [key: string]: string } = {
  ភាសាខ្មែរ: "text-blue-600",
  គណិតវិទ្យា: "text-purple-600",
  រូបវិទ្យា: "text-yellow-600",
  គីមីវិទ្យា: "text-green-600",
  ជីវវិទ្យា: "text-teal-600",
  ប្រវត្តិវិទ្យា: "text-amber-600",
  ភូមិវិទ្យា: "text-emerald-600",
  "សីលធម៌-ពលរដ្ឋវិជ្ជា": "text-pink-600",
  ផែនដីវិទ្យា: "text-cyan-600",
  អង់គ្លេស: "text-indigo-600",
};

// Subject background colors for non-selected state
const SUBJECT_BG_COLORS: { [key: string]: string } = {
  ភាសាខ្មែរ: "bg-blue-50",
  គណិតវិទ្យា: "bg-purple-50",
  រូបវិទ្យា: "bg-yellow-50",
  គីមីវិទ្យា: "bg-green-50",
  ជីវវិទ្យា: "bg-teal-50",
  ប្រវត្តិវិទ្យា: "bg-amber-50",
  ភូមិវិទ្យា: "bg-emerald-50",
  "សីលធម៌-ពលរដ្ឋវិជ្ជា": "bg-pink-50",
  ផែនដីវិទ្យា: "bg-cyan-50",
  អង់គ្លេស: "bg-indigo-50",
};

// Static subject passwords
const SUBJECT_PASSWORDS: Record<string, string> = {
  ភាសាខ្មែរ: "1221",
  គណិតវិទ្យា: "1222",
  រូបវិទ្យា: "1223",
  គីមីវិទ្យា: "1224",
  ជីវវិទ្យា: "1225",
  ប្រវត្តិវិទ្យា: "1226",
  ភូមិវិទ្យា: "1227",
  "សីលធម៌-ពលរដ្ឋវិជ្ជា": "1228",
  ផែនដីវិទ្យា: "1229",
  អង់គ្លេស: "1220",
};

// Subject points data structure
const SUBJECT_POINTS: { [key: string]: { [key: string]: number } } = {
  "7": {
    ភាសាខ្មែរ: 100,
    គណិតវិទ្យា: 100,
    រូបវិទ្យា: 50,
    គីមីវិទ្យា: 50,
    ជីវវិទ្យា: 50,
    ប្រវត្តិវិទ្យា: 50,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 50,
    ផែនដីវិទ្យា: 50,
    ភូមិវិទ្យា: 50,
    អង់គ្លេស: 50,
  },
  "8": {
    ភាសាខ្មែរ: 100,
    គណិតវិទ្យា: 100,
    រូបវិទ្យា: 50,
    គីមីវិទ្យា: 50,
    ជីវវិទ្យា: 50,
    ប្រវត្តិវិទ្យា: 50,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 50,
    ផែនដីវិទ្យា: 50,
    ភូមិវិទ្យា: 50,
    អង់គ្លេស: 50,
  },
  "9": {
    ភាសាខ្មែរ: 100,
    គណិតវិទ្យា: 100,
    រូបវិទ្យា: 35,
    គីមីវិទ្យា: 25,
    ជីវវិទ្យា: 35,
    ប្រវត្តិវិទ្យា: 33,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 35,
    ផែនដីវិទ្យា: 25,
    ភូមិវិទ្យា: 32,
    អង់គ្លេស: 50,
  },
  "10": {
    ភាសាខ្មែរ: 150,
    គណិតវិទ្យា: 150,
    រូបវិទ្យា: 50,
    គីមីវិទ្យា: 37,
    ជីវវិទ្យា: 38,
    ប្រវត្តិវិទ្យា: 37,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 38,
    ផែនដីវិទ្យា: 25,
    ភូមិវិទ្យា: 38,
    អង់គ្លេស: 100,
  },
  "11-វិទ្យាសាស្រ្ត": {
    ភាសាខ្មែរ: 75,
    គណិតវិទ្យា: 125,
    រូបវិទ្យា: 75,
    គីមីវិទ្យា: 75,
    ជីវវិទ្យា: 75,
    ប្រវត្តិវិទ្យា: 50,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 50,
    ផែនដីវិទ្យា: 50,
    ភូមិវិទ្យា: 50,
    អង់គ្លេស: 50,
  },
  "11-វិទ្យាសាស្រ្តសង្គម": {
    ភាសាខ្មែរ: 125,
    គណិតវិទ្យា: 75,
    រូបវិទ្យា: 50,
    គីមីវិទ្យា: 50,
    ជីវវិទ្យា: 50,
    ប្រវត្តិវិទ្យា: 75,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 75,
    ផែនដីវិទ្យា: 75,
    ភូមិវិទ្យា: 75,
    អង់គ្លេស: 50,
  },
  "12-វិទ្យាសាស្រ្ត": {
    ភាសាខ្មែរ: 75,
    គណិតវិទ្យា: 125,
    រូបវិទ្យា: 75,
    គីមីវិទ្យា: 75,
    ជីវវិទ្យា: 75,
    ប្រវត្តិវិទ្យា: 50,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 50,
    ផែនដីវិទ្យា: 50,
    ភូមិវិទ្យា: 50,
    អង់គ្លេស: 50,
  },
  "12-វិទ្យាសាស្រ្តសង្គម": {
    ភាសាខ្មែរ: 125,
    គណិតវិទ្យា: 75,
    រូបវិទ្យា: 50,
    គីមីវិទ្យា: 50,
    ជីវវិទ្យា: 50,
    ប្រវត្តិវិទ្យា: 75,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 75,
    ផែនដីវិទ្យា: 75,
    ភូមិវិទ្យា: 75,
    អង់គ្លេស: 50,
  },
};

export default function SubjectSelection({
  selectedStudent,
  selectedSchool,
  selectedGrade,
  selectedProvinceId,
  examCode,
  SUBJECTS,
  PROVINCES,
  handleBackToCode,
}: SubjectSelectionProps) {
  // Initialize scienceStream with a default value for grades 11-12
  const [scienceStream, setScienceStream] = useState(
    selectedGrade === "11" || selectedGrade === "12" ? "វិទ្យាសាស្រ្ត" : ""
  );
  const [selectedSubject, setSelectedSubject] = useState("");
  const [examLink, setExamLink] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);

  const [linkLoading, setLinkLoading] = useState(false);

  // New state to control whether to show the Google Form
  const [showGoogleForm, setShowGoogleForm] = useState(false);

  // Function to get default points if subject points are not found
  const getDefaultPoints = (subject: string, grade: string) => {
    if (grade === "7" || grade === "8") {
      return subject === "ភាសាខ្មែរ" || subject === "គណិតវិទ្យា" ? 100 : 50;
    } else if (grade === "9") {
      const highPoints = ["ភាសាខ្មែរ", "គណិតវិទ្យា", "អង់គ្លេស"];
      return highPoints.includes(subject) ? 100 : 50;
    } else if (grade === "10") {
      const highPoints = ["ភាសាខ្មែរ", "គណិតវិទ្យា", "អង់គ្លេស"];
      return highPoints.includes(subject) ? 150 : 50;
    } else if (grade === "11" || grade === "12") {
      // Default to science stream points
      const sciencePoints = {
        ភាសាខ្មែរ: 75,
        គណិតវិទ្យា: 125,
        រូបវិទ្យា: 75,
        គីមីវិទ្យា: 75,
        ជីវវិទ្យា: 75,
        ប្រវត្តិវិទ្យា: 50,
        "សីលធម៌-ពលរដ្ឋវិជ្ជា": 50,
        ផែនដីវិទ្យា: 50,
        ភូមិវិទ្យា: 50,
        អង់គ្លេស: 50,
      };
      return sciencePoints[subject] || 50;
    }
    return 50; // Default fallback
  };

  const fetchExamLink = useCallback(async () => {
    if (!selectedProvinceId || !selectedGrade || !selectedSubject) {
      setExamLink("");
      return;
    }

    if ((selectedGrade === "11" || selectedGrade === "12") && !scienceStream) {
      setExamLink("");
      return;
    }

    setLinkLoading(true);
    try {
      const link = await getExamLink(
        selectedProvinceId,
        selectedGrade,
        selectedSubject,
        scienceStream
      );
      setExamLink(link);
    } catch (error) {
      console.error("Error fetching exam link:", error);
      setExamLink("");
    } finally {
      setLinkLoading(false);
    }
  }, [selectedProvinceId, selectedGrade, selectedSubject, scienceStream]);

  useEffect(() => {
    fetchExamLink();
  }, [fetchExamLink]);

  const verifyPassword = useCallback(() => {
    if (!password) {
      setPasswordError("សូមបញ្ចូលលេខសម្ងាត់");
      return;
    }

    const subjectPassword = SUBJECT_PASSWORDS[selectedSubject];

    if (password === subjectPassword) {
      setPasswordVerified(true);
      setShowPasswordModal(false);
      setPasswordError("");
      // Instead of opening a new window, show the Google Form on the same page
      if (examLink) {
        setShowGoogleForm(true);
      }
    } else {
      setPasswordError("លេខសម្ងាត់មិនត្រឹមត្រូវ");
    }
  }, [password, selectedSubject, examLink]);

  const handleExamLinkClick = useCallback(() => {
    if (passwordVerified) {
      // Instead of opening a new window, show the Google Form on the same page
      if (examLink) {
        setShowGoogleForm(true);
      }
    } else {
      setShowPasswordModal(true);
      setPasswordError("");
    }
  }, [passwordVerified, examLink]);

  const handlePasswordChange = useCallback((value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "");
    const truncatedValue = numericValue.slice(0, 4);
    setPassword(truncatedValue);
  }, []);

  const getSubjects = () => {
    if (!selectedGrade) return [];

    if (selectedGrade === "11" || selectedGrade === "12") {
      if (!scienceStream) return [];
      return SUBJECTS[selectedGrade as keyof typeof SUBJECTS] || [];
    }

    return SUBJECTS[selectedGrade as keyof typeof SUBJECTS] || [];
  };

  const getSubjectPoints = (subject: string) => {
    if (!selectedGrade) return 0;

    let key = selectedGrade;
    if (selectedGrade === "11" || selectedGrade === "12") {
      // Ensure scienceStream is set to a valid value
      const stream = scienceStream || "វិទ្យាសាស្រ្ត";
      key = `${selectedGrade}-${stream}`;
    }

    // Return points if found, otherwise return a default value
    return (
      SUBJECT_POINTS[key]?.[subject] || getDefaultPoints(subject, selectedGrade)
    );
  };

  const subjects = getSubjects();

  // If the quiz should be shown, render it instead of the normal content
  if (showGoogleForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-800">
                ប្រព័ន្ធប្រឡងអនឡាញ
              </h1>
            </div>
            <Button variant="ghost" onClick={() => setShowGoogleForm(false)}>
              <X className="h-4 w-4 mr-2" />
              បិទ
            </Button>
          </div>
        </div>

        {/* Exam Info Bar */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-4 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center">
            <div
              className={`p-3 rounded-xl mr-4 bg-white/20 backdrop-blur-sm`}
            >
              <div className="text-white">
                {SUBJECT_ICONS[selectedSubject] || (
                  <BookOpen className="h-6 w-6" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-lg">{selectedSubject}</div>
              <div className="text-sm opacity-90">
                សម្រាប់ថ្នាក់ {selectedGrade} • កូដប្រឡង: {examCode}
              </div>
            </div>
            <div className="flex items-center bg-white/20 px-3 py-1 rounded-full">
              <Timer className="h-4 w-4 mr-1" />
              <span className="text-sm">កំពុងប្រឡង</span>
            </div>
          </div>
        </div>

        {/* Quiz Container */}
        <div className="p-4 md:p-6">
          <div className="max-w-4xl mx-auto">
            <QuizUI
              params={{ subject: selectedSubject }}
              examCode={examCode}
              selectedStudent={selectedStudent}
              selectedSchool={selectedSchool}
              selectedGrade={selectedGrade}
              selectedProvinceId={selectedProvinceId}
              selectedStream={scienceStream === "វិទ្យាសាស្រ្ត" ? "science" : "social"}
            />
          </div>
        </div>
      </div>
    );
  }

  // Normal content rendering when Google Form is not shown
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 px-4 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-semibold text-gray-800">
              ប្រព័ន្ធប្រឡងអនឡាញ
            </h1>
          </div>
          <Button variant="ghost" onClick={handleBackToCode}>
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            ត្រឡប់
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white px-4 py-3 shadow-sm">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-medium mr-2">1</div>
              <span>ជ្រើសរើសមុខវិជ្ជា</span>
            </div>
            <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full"
                style={{ width: "50%" }}
              ></div>
            </div>
            <div className="flex items-center">
              <span>បញ្ចប់បញ្ចូល</span>
              <div className="w-6 h-6 bg-gray-300 text-white rounded-full flex items-center justify-center text-xs font-medium ml-2">2</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto p-4 md:p-6">
        {/* Student Information Section */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
            <h2 className="text-lg font-semibold flex items-center">
              <UserCircle className="h-5 w-5 mr-2" />
              ព័ត៌មានសិស្ស
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">ឈ្មោះ</div>
                  <div className="text-base font-medium">{selectedStudent?.fullName || ""}</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <School className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">សាលារៀន</div>
                  <div className="text-base font-medium">{selectedSchool?.name || ""}</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">ថ្នាក់</div>
                  <div className="text-base font-medium">{selectedGrade}</div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Map className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">ខេត្ត/ក្រុង</div>
                  <div className="text-base font-medium">
                    {PROVINCES.find((p) => p.id === selectedProvinceId)?.name || ""}
                  </div>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                  <Hash className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">កូដប្រឡង</div>
                  <div className="text-base font-medium font-mono">{examCode}</div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/*Science Stream Selection for Grades 11-12*/}
        {(selectedGrade === "11" || selectedGrade === "12") && (
          <Card className="mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4">
              <h2 className="text-lg font-semibold flex items-center">
                <BookMarked className="h-5 w-5 mr-2" />
                ជ្រើសរើសជំនាញវិទ្យាសាស្រ្ត
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    scienceStream === "វិទ្យាសាស្រ្ត"
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                  onClick={() => setScienceStream("វិទ្យាសាស្រ្ត")}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        scienceStream === "វិទ្យាសាស្រ្ត"
                          ? "border-purple-500"
                          : "border-gray-400"
                      }`}
                    >
                      {scienceStream === "វិទ្យាសាស្រ្ត" && (
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="text-base font-medium">វិទ្យាសាស្រ្ត</div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    ផ្តោតលើវិទ្យាសាស្រ្តធម្មជាតិដូចជា រូបវិទ្យា គីមីវិទ្យា ជីវវិទ្យា និងគណិតវិទ្យា
                  </div>
                </div>

                <div
                  className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    scienceStream === "វិទ្យាសាស្រ្តសង្គម"
                      ? "border-purple-500 bg-purple-50 shadow-md"
                      : "border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                  onClick={() => setScienceStream("វិទ្យាសាស្រ្តសង្គម")}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center ${
                        scienceStream === "វិទ្យាសាស្រ្តសង្គម"
                          ? "border-purple-500"
                          : "border-gray-400"
                      }`}
                    >
                      {scienceStream === "វិទ្យាសាស្រ្តសង្គម" && (
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      )}
                    </div>
                    <div className="text-base font-medium">វិទ្យាសាស្រ្តសង្គម</div>
                  </div>
                  <div className="mt-3 text-sm text-gray-600">
                    ផ្តោតលើវិទ្យាសាស្រ្តសង្គមដូចជា ប្រវត្តិវិទ្យា ភូមិវិទ្យា សីលធម៌ និងអក្សរសាស្រ្ត
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Subject Selection */}
        <Card className="mb-6 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
            <h2 className="text-lg font-semibold flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              ជ្រើសរើសមុខវិជ្ជា
            </h2>
          </div>
          <div className="p-6">
            {(selectedGrade === "11" || selectedGrade === "12") &&
            !scienceStream ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <Info className="h-8 w-8 text-amber-600" />
                </div>
                <p className="text-lg text-gray-700 mb-2 font-medium">
                  សូមជ្រើសរើសជំនាញវិទ្យាសាស្រ្តជាមុនសិន
                </p>
                <p className="text-sm text-gray-500 max-w-md">
                  សូមជ្រើសរើសជំនាញវិទ្យាសាស្រ្តនៅក្នុងផ្នែកខាងលើដើម្បីបង្ហាញមុខវិជ្ជាដែលអាចជ្រើសរើសបាន
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {subjects.length > 0 ? (
                  subjects.map((subject) => {
                    const points = getSubjectPoints(subject);
                    const isSelected = selectedSubject === subject;
                    const subjectColor =
                      SUBJECT_COLORS[subject] || "text-gray-600";
                    const subjectBgColor =
                      SUBJECT_BG_COLORS[subject] || "bg-gray-50";

                    return (
                      <div
                        key={subject}
                        className={`p-5 border-2 rounded-xl cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                        onClick={() => {
                          setSelectedSubject(subject);
                          setPasswordVerified(false);
                        }}
                      >
                        <div className="flex items-start mb-4">
                          <div
                            className={`p-3 rounded-xl mr-3 ${
                              isSelected ? "bg-blue-100" : subjectBgColor
                            }`}
                          >
                            <div
                              className={
                                isSelected ? "text-blue-600" : subjectColor
                              }
                            >
                              {SUBJECT_ICONS[subject] || (
                                <BookOpen className="h-6 w-6" />
                              )}
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle className="h-6 w-6 text-blue-600" />
                          )}
                        </div>

                        <div className="text-base font-semibold text-gray-800 mb-3">
                          {subject}
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm text-gray-600">
                            <Award className="h-4 w-4 mr-1 text-amber-500" />
                            <span>{points} ពិន្ទុ</span>
                          </div>
                          {isSelected && (
                            <div className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                              បានជ្រើសរើស
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <BookOpen className="h-8 w-8 text-gray-400" />
                    </div>
                    <p className="text-lg text-gray-700 font-medium">
                      មិនមានមុខវិជ្ជាសម្រាប់ថ្នាក់ {selectedGrade}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>

        {/* Exam Link Section */}
        {selectedSubject && (
          <Card className="mb-6 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white px-6 py-4">
              <h2 className="text-lg font-semibold flex items-center">
                <PlayCircle className="h-5 w-5 mr-2" />
                តំណភ្ជាប់ទៅកាន់កម្មវិធីប្រឡង
              </h2>
            </div>
            <div className="p-6">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl">
                <div className="flex items-center mb-4">
                  <div
                    className={`p-3 rounded-xl mr-4 ${
                      SUBJECT_BG_COLORS[selectedSubject] || "bg-gray-50"
                    }`}
                  >
                    <div
                      className={
                        SUBJECT_COLORS[selectedSubject] || "text-gray-600"
                      }
                    >
                      {SUBJECT_ICONS[selectedSubject] || (
                        <BookOpen className="h-6 w-6" />
                      )}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg text-gray-800">
                      {selectedSubject}
                    </div>
                    <div className="text-sm text-gray-500">
                      សម្រាប់ថ្នាក់ {selectedGrade} • {getSubjectPoints(selectedSubject)} ពិន្ទុ
                    </div>
                  </div>
                </div>

                {linkLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-6 w-6 mr-3 animate-spin text-blue-600" />
                    <span className="text-gray-700 font-medium">កំពុងរកតំណភ្ជាប់...</span>
                  </div>
                ) : examLink ? (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button onClick={handleExamLinkClick} className="flex-1">
                      <PlayCircle className="h-4 w-4 mr-2" />
                      ចូលរួមប្រឡង
                    </Button>
                    
                    
                    
                    
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-6 text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                      <AlertTriangle className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 text-base">
                        មិនមានតំណភ្ជាប់សម្រាប់មុខវិជ្ជានេះ
                      </div>
                      <div className="text-sm text-gray-500">
                        សូមព្យាយាមមុខវិជ្ជាផ្សេងទៀត
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4">
              <h3 className="text-lg font-semibold flex items-center">
                <Lock className="h-5 w-5 mr-2" />
                តម្រូវឱ្យមានលេខសម្ងាត់
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-6">
                សូមបញ្ចូលលេខសម្ងាត់ 4 ខ្ទង់ដើម្បីចូលប្រើប្រាស់ការប្រឡងមុខវិជ្ជា{" "}
                <span className="font-medium">{selectedSubject}</span>
              </p>

              <div className="mb-6">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="លេខសម្ងាត់ 4 ខ្ទង់"
                    maxLength={4}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="pr-12 text-center text-lg tracking-widest"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <div className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1" />
                    {passwordError}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPassword("");
                    setPasswordError("");
                  }}
                >
                  បោះបង់
                </Button>
                <Button
                  onClick={verifyPassword}
                  disabled={!password || password.length !== 4}
                >
                  ផ្ទៀងផ្ទាត់
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}