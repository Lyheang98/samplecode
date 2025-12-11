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
} from "lucide-react";

import { getExamLink } from "@/utils/examLinks";

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
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
  const baseClasses = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
    ghost: "text-gray-700 hover:bg-gray-100",
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

const Input = ({ value, onChange, type = "text", placeholder, className = "", ...props }: any) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange && onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full h-10 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
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
  "ភាសាខ្មែរ": <MessageSquare className="h-5 w-5" />,
  "គណិតវិទ្យា": <Calculator className="h-5 w-5" />,
  "រូបវិទ្យា": <Zap className="h-5 w-5" />,
  "គីមីវិទ្យា": <FlaskConical className="h-5 w-5" />,
  "ជីវវិទ្យា": <Dna className="h-5 w-5" />,
  "ប្រវត្តិវិទ្យា": <Clock className="h-5 w-5" />,
  "ភូមិវិទ្យា": <Map className="h-5 w-5" />,
  "សីលធម៌-ពលរដ្ឋវិជ្ជា": <Users className="h-5 w-5" />,
  "ផែនដីវិទ្យា": <Globe className="h-5 w-5" />,
  "អង់គ្លេស": <Languages className="h-5 w-5" />,
};

// Subject colors mapping
const SUBJECT_COLORS: { [key: string]: string } = {
  "ភាសាខ្មែរ": "text-blue-600",
  "គណិតវិទ្យា": "text-purple-600",
  "រូបវិទ្យា": "text-yellow-600",
  "គីមីវិទ្យា": "text-green-600",
  "ជីវវិទ្យា": "text-teal-600",
  "ប្រវត្តិវិទ្យា": "text-amber-600",
  "ភូមិវិទ្យា": "text-emerald-600",
  "សីលធម៌-ពលរដ្ឋវិជ្ជា": "text-pink-600",
  "ផែនដីវិទ្យា": "text-cyan-600",
  "អង់គ្លេស": "text-indigo-600",
};

// Subject background colors for non-selected state
const SUBJECT_BG_COLORS: { [key: string]: string } = {
  "ភាសាខ្មែរ": "bg-blue-50",
  "គណិតវិទ្យា": "bg-purple-50",
  "រូបវិទ្យា": "bg-yellow-50",
  "គីមីវិទ្យា": "bg-green-50",
  "ជីវវិទ្យា": "bg-teal-50",
  "ប្រវត្តិវិទ្យា": "bg-amber-50",
  "ភូមិវិទ្យា": "bg-emerald-50",
  "សីលធម៌-ពលរដ្ឋវិជ្ជា": "bg-pink-50",
  "ផែនដីវិទ្យា": "bg-cyan-50",
  "អង់គ្លេស": "bg-indigo-50",
};

// Subject points data structure
const SUBJECT_POINTS: { [key: string]: { [key: string]: number } } = {
  "7": {
    "ភាសាខ្មែរ": 100,
    "គណិតវិទ្យា": 100,
    "រូបវិទ្យា": 50,
    "គីមីវិទ្យា": 50,
    "ជីវវិទ្យា": 50,
    "ប្រវត្តិវិទ្យា": 50,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 50,
    "ផែនដីវិទ្យា": 50,
    "ភូមិវិទ្យា": 50,
    "អង់គ្លេស": 50,
  },
  "8": {
    "ភាសាខ្មែរ": 100,
    "គណិតវិទ្យា": 100,
    "រូបវិទ្យា": 50,
    "គីមីវិទ្យា": 50,
    "ជីវវិទ្យា": 50,
    "ប្រវត្តិវិទ្យា": 50,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 50,
    "ផែនដីវិទ្យា": 50,
    "ភូមិវិទ្យា": 50,
    "អង់គ្លេស": 50,
  },
  "9": {
    "ភាសាខ្មែរ": 100,
    "គណិតវិទ្យា": 100,
    "រូបវិទ្យា": 35,
    "គីមីវិទ្យា": 25,
    "ជីវវិទ្យា": 35,
    "ប្រវត្តិវិទ្យា": 33,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 35,
    "ផែនដីវិទ្យា": 25,
    "ភូមិវិទ្យា": 32,
    "អង់គ្លេស": 50,
  },
  "10": {
    "ភាសាខ្មែរ": 150,
    "គណិតវិទ្យា": 150,
    "រូបវិទ្យា": 50,
    "គីមីវិទ្យា": 37,
    "ជីវវិទ្យា": 38,
    "ប្រវត្តិវិទ្យា": 37,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 38,
    "ផែនដីវិទ្យា": 25,
    "ភូមិវិទ្យា": 38,
    "អង់គ្លេស": 100,
  },
  "11-វិទ្យាសាស្រ្ត": {
    "ភាសាខ្មែរ": 75,
    "គណិតវិទ្យា": 125,
    "រូបវិទ្យា": 75,
    "គីមីវិទ្យា": 75,
    "ជីវវិទ្យា": 75,
    "ប្រវត្តិវិទ្យា": 50,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 50,
    "ផែនដីវិទ្យា": 50,
    "ភូមិវិទ្យា": 50,
    "អង់គ្លេស": 50,
  },
  "11-វិទ្យាសាស្រ្តសង្គម": {
    "ភាសាខ្មែរ": 125,
    "គណិតវិទ្យា": 75,
    "រូបវិទ្យា": 50,
    "គីមីវិទ្យា": 50,
    "ជីវវិទ្យា": 50,
    "ប្រវត្តិវិទ្យា": 75,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 75,
    "ផែនដីវិទ្យា": 75,
    "ភូមិវិទ្យា": 75,
    "អង់គ្លេស": 50,
  },
  "12-វិទ្យាសាស្រ្ត": {
    "ភាសាខ្មែរ": 75,
    "គណិតវិទ្យា": 125,
    "រូបវិទ្យា": 75,
    "គីមីវិទ្យា": 75,
    "ជីវវិទ្យា": 75,
    "ប្រវត្តិវិទ្យា": 50,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 50,
    "ផែនដីវិទ្យា": 50,
    "ភូមិវិទ្យា": 50,
    "អង់គ្លេស": 50,
  },
  "12-វិទ្យាសាស្រ្តសង្គម": {
    "ភាសាខ្មែរ": 125,
    "គណិតវិទ្យា": 75,
    "រូបវិទ្យា": 50,
    "គីមីវិទ្យា": 50,
    "ជីវវិទ្យា": 50,
    "ប្រវត្តិវិទ្យា": 75,
    "សីលធម៌-ពលរដ្ឋវិជ្ជា": 75,
    "ផែនដីវិទ្យា": 75,
    "ភូមិវិទ្យា": 75,
    "អង់គ្លេស": 50,
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
  const [scienceStream, setScienceStream] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [examLink, setExamLink] = useState("");

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);

  const [linkLoading, setLinkLoading] = useState(false);
  const [subjectPasswords, setSubjectPasswords] = useState<Record<string, string>>({});
  
  // New state to control whether to show the Google Form
  const [showGoogleForm, setShowGoogleForm] = useState(false);

  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('examSystemSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.subjectPasswords) {
          setSubjectPasswords(settings.subjectPasswords);
        }
      }
    } catch (error) {
      console.error("Error loading passwords from localStorage:", error);
      setSubjectPasswords({
        "ភាសាខ្មែរ": "1234",
        "គណិតវិទ្យា": "5678",
        "រូបវិទ្យា": "9012",
        "គីមីវិទ្យា": "3456",
        "ជីវវិទ្យា": "7890",
        "ប្រវត្តិវិទ្យា": "2345",
        "ភូមិវិទ្យា": "6789",
        "សីលធម៌-ពលរដ្ឋវិជ្ជា": "0123",
        "ផែនដីវិទ្យា": "4567",
        "អង់គ្លេស": "8901",
      });
    }
  }, []);

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

    const subjectPassword = subjectPasswords[selectedSubject];

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
  }, [password, selectedSubject, examLink, subjectPasswords]);

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
    const numericValue = value.replace(/[^0-9]/g, '');
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
    if ((selectedGrade === "11" || selectedGrade === "12") && scienceStream) {
      key = `${selectedGrade}-${scienceStream}`;
    }

    return SUBJECT_POINTS[key]?.[subject] || 0;
  };

  const subjects = getSubjects();

  // If the Google Form should be shown, render it instead of the normal content
  if (showGoogleForm && examLink) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-normal text-gray-800">ប្រព័ន្ធប្រឡងអនឡាញ</h1>
            </div>
            <Button variant="ghost" onClick={() => setShowGoogleForm(false)}>
              <X className="h-4 w-4 mr-2" />
              បិទ
            </Button>
          </div>
        </div>

        {/* Exam Info Bar */}
        <div className="bg-blue-50 border-b border-blue-200 px-4 py-3">
          <div className="max-w-4xl mx-auto flex items-center">
            <div className={`p-2 rounded-md mr-3 ${SUBJECT_BG_COLORS[selectedSubject] || 'bg-gray-50'}`}>
              <div className={SUBJECT_COLORS[selectedSubject] || 'text-gray-600'}>
                {SUBJECT_ICONS[selectedSubject] || <BookOpen className="h-5 w-5" />}
              </div>
            </div>
            <div>
              <div className="font-medium text-gray-800">{selectedSubject}</div>
              <div className="text-sm text-gray-500">សម្រាប់ថ្នាក់ {selectedGrade}</div>
            </div>
          </div>
        </div>

        {/* Google Form Container */}
        <div className="p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
            <iframe
              src={examLink}
              width="100%"
              height="100%"
              frameBorder="0"
              marginHeight={0}
              marginWidth={0}
              title={`${selectedSubject} Exam Form`}
            >
              កំពុងផ្ទុក...
            </iframe>
          </div>
        </div>
      </div>
    );
  }

  // Normal content rendering when Google Form is not shown
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center mr-3">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-normal text-gray-800">ប្រព័ន្ធប្រឡងអនឡាញ</h1>
          </div>
          {/* <Button variant="ghost" onClick={handleBackToCode}>
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            ត្រឡប់
          </Button> */}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>ជំហាន 1 នៃ 2</span>
            <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: "50%" }}></div>
            </div>
            <span>បញ្ចប់បញ្ចូល</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Student Information Section */}
        <Card className="mb-6 p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
            ព័ត៌មានសិស្ស
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="pb-4 border-b border-gray-100">
              <div className="text-sm text-gray-500 mb-1">ឈ្មោះ</div>
              <div className="text-base">{selectedStudent?.fullName || ""}</div>
            </div>
            
            <div className="pb-4 border-b border-gray-100">
              <div className="text-sm text-gray-500 mb-1">សាលារៀន</div>
              <div className="text-base">{selectedSchool?.name || ""}</div>
            </div>
            
            <div className="pb-4 border-b border-gray-100">
              <div className="text-sm text-gray-500 mb-1">ថ្នាក់</div>
              <div className="text-base">{selectedGrade}</div>
            </div>
            
            <div className="pb-4 border-b border-gray-100">
              <div className="text-sm text-gray-500 mb-1">ខេត្ត/ក្រុង</div>
              <div className="text-base">
                {PROVINCES.find((p) => p.id === selectedProvinceId)?.name || ""}
              </div>
            </div>
            
            <div className="pb-4 border-b border-gray-100">
              <div className="text-sm text-gray-500 mb-1">កូដប្រឡង</div>
              <div className="text-base font-mono">{examCode}</div>
            </div>
          </div>
        </Card>

        {/* Science Stream Selection for Grades 11-12 */}
        {(selectedGrade === "11" || selectedGrade === "12") && (
          <Card className="mb-6 p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
              ជ្រើសរើសជំនាញវិទ្យាសាស្រ្ត
            </h2>
            
            <div className="space-y-3">
              <div 
                className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                  scienceStream === "វិទ្យាសាស្រ្ត" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setScienceStream("វិទ្យាសាស្រ្ត")}
              >
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  scienceStream === "វិទ្យាសាស្រ្ត" 
                    ? "border-blue-500" 
                    : "border-gray-400"
                }`}>
                  {scienceStream === "វិទ្យាសាស្រ្ត" && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div className="text-base">វិទ្យាសាស្រ្ត</div>
              </div>
              
              <div 
                className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${
                  scienceStream === "វិទ្យាសាស្រ្តសង្គម" 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-300 hover:bg-gray-50"
                }`}
                onClick={() => setScienceStream("វិទ្យាសាស្រ្តសង្គម")}
              >
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${
                  scienceStream === "វិទ្យាសាស្រ្តសង្គម" 
                    ? "border-blue-500" 
                    : "border-gray-400"
                }`}>
                  {scienceStream === "វិទ្យាសាស្រ្តសង្គម" && (
                    <div className="w-2.5 h-2.5 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <div className="text-base">វិទ្យាសាស្រ្តសង្គម</div>
              </div>
            </div>
          </Card>
        )}

        {/* Subject Selection */}
        <Card className="mb-6 p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
            ជ្រើសរើសមុខវិជ្ជា
          </h2>
          
          {(selectedGrade === "11" || selectedGrade === "12") && !scienceStream ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mb-3" />
              <p className="text-lg text-gray-700 mb-1">សូមជ្រើសរើសជំនាញវិទ្យាសាស្រ្តជាមុនសិន</p>
              <p className="text-sm text-gray-500">សូមជ្រើសរើសជំនាញវិទ្យាសាស្រ្តនៅក្នុងផ្នែកខាងលើ</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjects.length > 0 ? (
                subjects.map((subject) => {
                  const points = getSubjectPoints(subject);
                  const isSelected = selectedSubject === subject;
                  const subjectColor = SUBJECT_COLORS[subject] || "text-gray-600";
                  const subjectBgColor = SUBJECT_BG_COLORS[subject] || "bg-gray-50";
                  
                  return (
                    <div
                      key={subject}
                      className={`p-4 border rounded-md cursor-pointer transition-all ${
                        isSelected
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setPasswordVerified(false);
                      }}
                    >
                      <div className="flex items-start mb-3">
                        <div className={`p-2 rounded-md mr-3 ${isSelected ? 'bg-blue-100' : subjectBgColor}`}>
                          <div className={isSelected ? 'text-blue-600' : subjectColor}>
                            {SUBJECT_ICONS[subject] || <BookOpen className="h-5 w-5" />}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="text-base font-medium text-gray-800 mb-2">
                        {subject}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="h-4 w-4 mr-1 text-amber-500" />
                        <span>{points} ពិន្ទុ</span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <BookOpen className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-lg text-gray-700">មិនមានមុខវិជ្ជាសម្រាប់ថ្នាក់ {selectedGrade}</p>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Exam Link Section */}
        {selectedSubject && (
          <Card className="mb-6 p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4 pb-2 border-b border-gray-200">
              តំណភ្ជាប់ទៅកាន់កម្មវិធីប្រឡង
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="flex items-center mb-3">
                <div className={`p-2 rounded-md mr-3 ${SUBJECT_BG_COLORS[selectedSubject] || 'bg-gray-50'}`}>
                  <div className={SUBJECT_COLORS[selectedSubject] || 'text-gray-600'}>
                    {SUBJECT_ICONS[selectedSubject] || <BookOpen className="h-5 w-5" />}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-gray-800">{selectedSubject}</div>
                  <div className="text-sm text-gray-500">សម្រាប់ថ្នាក់ {selectedGrade}</div>
                </div>
              </div>
              
              {linkLoading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin text-blue-600" />
                  <span className="text-gray-700">កំពុងរកតំណភ្ជាប់...</span>
                </div>
              ) : examLink ? (
                <Button 
                  onClick={handleExamLinkClick}
                  className="w-full"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  ចូលរួមប្រឡង
                </Button>
              ) : (
                <div className="flex items-center justify-center py-4 text-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  <div>
                    <div className="font-medium text-gray-700">មិនមានតំណភ្ជាប់សម្រាប់មុខវិជ្ជានេះ</div>
                    <div className="text-sm text-gray-500">សូមព្យាយាមមុខវិជ្ជាផ្សេងទៀត</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <Lock className="h-6 w-6 text-gray-600 mr-3" />
                <h3 className="text-lg font-medium text-gray-800">តម្រូវឱ្យមានលេខសម្ងាត់</h3>
              </div>
              
              <p className="text-gray-600 mb-4">
                សូមបញ្ចូលលេខសម្ងាត់ 4 ខ្ទង់ដើម្បីចូលប្រើប្រាស់ការប្រឡងមុខវិជ្ជា {selectedSubject}
              </p>
              
              <div className="mb-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="លេខសម្ងាត់ 4 ខ្ទង់"
                    maxLength={4}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <div className="mt-2 text-sm text-red-600">{passwordError}</div>
                )}
              </div>
              
              <div className="flex justify-end space-x-2">
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