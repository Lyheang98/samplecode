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
  RefreshCw,
  Info,
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
    danger: "bg-red-600 text-white hover:bg-red-700",
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

// Static subject passwords
const SUBJECT_PASSWORDS: Record<string, string> = {
  "ភាសាខ្មែរ": "1221",
  "គណិតវិទ្យា": "1222",
  "រូបវិទ្យា": "1223",
  "គីមីវិទ្យា": "1224",
  "ជីវវិទ្យា": "1225",
  "ប្រវត្តិវិទ្យា": "1226",
  "ភូមិវិទ្យា": "1227",
  "សីលធម៌-ពលរដ្ឋវិជ្ជា": "1228",
  "ផែនដីវិទ្យា": "1229",
  "អង់គ្លេស": "1220",
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

// Fallback exam links for when the main links fail
const FALLBACK_EXAM_LINKS: Record<string, string> = {
  "ភាសាខ្មែរ": "https://docs.google.com/forms/d/e/1FAIpQLSfKh9T6RmSuEEg0hr9CQ-3q6fVnWxXJf-2JgK3wRm5vTQ7pXw/viewform",
  "គណិតវិទ្យា": "https://docs.google.com/forms/d/e/1FAIpQLSfKh9T6RmSuEEg0hr9CQ-3q6fVnWxXJf-2JgK3wRm5vTQ7pXw/viewform",
  "រូបវិទ្យា": "https://docs.google.com/forms/d/e/1FAIpQLSfKh9T6RmSuEEg0hr9CQ-3q6fVnWxXJf-2JgK3wRm5vTQ7pXw/viewform",
  "គីមីវិទ្យា": "https://docs.google.com/forms/d/e/1FAIpQLSfKh9T6RmSuEEg0hr9CQ-3q6fVnWxXJf-2JgK3wRm5vTQ7pXw/viewform",
  "ជីវវិទ្យា": "https://docs.google.com/forms/d/e/1FAIpQLSfKh9T6RmSuEEg0hr9CQ-3q6fVnWxXJf-2JgK3wRm5vTQ7pXw/viewform", // Biology fallback
  "ប្រវត្តិវិទ្យា": "https://docs.google.com/forms/d/e/1FAIpQLSfKh9T6RmSuEEg0hr9CQ-3q6fVnWxXJf-2JgK3wRm5vTQ7pXw/viewform",
  "ភូមិវិទ្យា": "https://docs.google.com/forms/d/e/1FAIpQLSfKh9T6RmSuEEg0hr9CQ-3q6fVnWxXJf-2JgK3wRm5vTQ7pXw/viewform",
  "សីលធម៌-ពលរដ្ឋវិជ្ជា": "https://docs.google.com/forms/d/e/1FAIpQLSfKh9T6RmSuEEg0hr9CQ-3q6fVnWxXJf-2JgK3wRm5vTQ7pXw/viewform",
  "ផែនដីវិទ្យា": "https://docs.google.com/forms/d/e/1FAIpQLSfKh9T6RmSuEEg0hr9CQ-3q6fVnWxXJf-2JgK3wRm5vTQ7pXw/viewform",
  "អង់គ្លេស": "https://docs.google.com/forms/d/e/1FAIpQLSfKh9T6RmSuEEg0hr9CQ-3q6fVnWxXJf-2JgK3wRm5vTQ7pXw/viewform",
};

// Function to validate if a Google Form link is accessible
export async function validateExamLink(link: string): Promise<boolean> {
  if (!link) return false;
  
  try {
    // Simple validation - check if it's a valid Google Forms URL
    const isValidGoogleForm = link.includes('docs.google.com/forms');
    if (!isValidGoogleForm) {
      console.error(`Invalid Google Form URL: ${link}`);
      return false;
    }
    
    // You could add more validation here, like checking if the form is actually accessible
    // For now, we'll just check the URL format
    return true;
  } catch (error) {
    console.error(`Error validating exam link: ${link}`, error);
    return false;
  }
}

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
    (selectedGrade === "11" || selectedGrade === "12") ? "វិទ្យាសាស្រ្ត" : ""
  );
  const [selectedSubject, setSelectedSubject] = useState("");
  const [examLink, setExamLink] = useState("");
  const [linkValid, setLinkValid] = useState<boolean | null>(null);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordVerified, setPasswordVerified] = useState(false);

  const [linkLoading, setLinkLoading] = useState(false);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [usingFallback, setUsingFallback] = useState(false);

  // New state to control whether to show the Google Form
  const [showGoogleForm, setShowGoogleForm] = useState(false);
  const [formLoadError, setFormLoadError] = useState(false);

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
      };
      return sciencePoints[subject] || 50;
    }
    return 50; // Default fallback
  };

  const fetchExamLink = useCallback(async () => {
    if (!selectedProvinceId || !selectedGrade || !selectedSubject) {
      setExamLink("");
      setLinkValid(null);
      setLinkError(null);
      return;
    }

    if ((selectedGrade === "11" || selectedGrade === "12") && !scienceStream) {
      setExamLink("");
      setLinkValid(null);
      setLinkError(null);
      return;
    }

    setLinkLoading(true);
    setLinkError(null);
    setLinkValid(null);
    setUsingFallback(false);

    try {
      console.log(`Fetching exam link for ${selectedSubject}...`);
      const link = await getExamLink(
        selectedProvinceId,
        selectedGrade,
        selectedSubject,
        scienceStream
      );
      
      setExamLink(link);
      
      if (link) {
        const isValid = await validateExamLink(link);
        setLinkValid(isValid);
        
        if (!isValid) {
          // Try fallback link if main link is invalid
          console.log(`Main link invalid for ${selectedSubject}, trying fallback...`);
          const fallbackLink = FALLBACK_EXAM_LINKS[selectedSubject];
          
          if (fallbackLink) {
            const isFallbackValid = await validateExamLink(fallbackLink);
            if (isFallbackValid) {
              setExamLink(fallbackLink);
              setLinkValid(true);
              setUsingFallback(true);
              console.log(`Using fallback link for ${selectedSubject}`);
            } else {
              setLinkError(`តំណភ្ជាប់សម្រាប់ ${selectedSubject} មិនត្រឹមត្រូវ ឬមិនអាចចូលបានទេ`);
              console.error(`Both main and fallback links invalid for ${selectedSubject}`);
            }
          } else {
            setLinkError(`រកមិនឃើញតំណភ្ជាប់សម្រាប់ ${selectedSubject}`);
            console.error(`No fallback link found for ${selectedSubject}`);
          }
        } else {
          console.log(`Valid exam link found for ${selectedSubject}: ${link}`);
        }
      } else {
        // Try fallback link if no main link
        console.log(`No main link found for ${selectedSubject}, trying fallback...`);
        const fallbackLink = FALLBACK_EXAM_LINKS[selectedSubject];
        
        if (fallbackLink) {
          const isFallbackValid = await validateExamLink(fallbackLink);
          if (isFallbackValid) {
            setExamLink(fallbackLink);
            setLinkValid(true);
            setUsingFallback(true);
            console.log(`Using fallback link for ${selectedSubject}`);
          } else {
            setLinkValid(false);
            setLinkError(`រកមិនឃើញតំណភ្ជាប់សម្រាប់ ${selectedSubject}`);
            console.error(`No valid links found for ${selectedSubject}`);
          }
        } else {
          setLinkValid(false);
          setLinkError(`រកមិនឃើញតំណភ្ជាប់សម្រាប់ ${selectedSubject}`);
          console.error(`No links found for ${selectedSubject}`);
        }
      }
    } catch (error: any) {
      console.error(`Error fetching exam link for ${selectedSubject}:`, error);
      
      // Try fallback link if there's an error
      console.log(`Error with main link for ${selectedSubject}, trying fallback...`);
      const fallbackLink = FALLBACK_EXAM_LINKS[selectedSubject];
      
      if (fallbackLink) {
        const isFallbackValid = await validateExamLink(fallbackLink);
        if (isFallbackValid) {
          setExamLink(fallbackLink);
          setLinkValid(true);
          setUsingFallback(true);
          console.log(`Using fallback link for ${selectedSubject} after error`);
        } else {
          setLinkError(`កំហុសក្នុងការទាញយកតំណភ្ជាប់: ${error.message}`);
          setLinkValid(false);
        }
      } else {
        setLinkError(`កំហុសក្នុងការទាញយកតំណភ្ជាប់: ${error.message}`);
        setLinkValid(false);
      }
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
      if (examLink && linkValid) {
        setShowGoogleForm(true);
        setFormLoadError(false);
      } else if (!linkValid) {
        setLinkError("តំណភ្ជាប់ប្រឡងមិនត្រឹមត្រូវ សូមព្យាយាមមុខវិជ្ជាផ្សេងៗទៀត");
      }
    } else {
      setPasswordError("លេខសម្ងាត់មិនត្រឹមត្រូវ");
    }
  }, [password, selectedSubject, examLink, linkValid]);

  const handleExamLinkClick = useCallback(() => {
    if (passwordVerified) {
      // Instead of opening a new window, show the Google Form on the same page
      if (examLink && linkValid) {
        setShowGoogleForm(true);
        setFormLoadError(false);
      } else {
        setLinkError("តំណភ្ជាប់ប្រឡងមិនត្រឹមត្រូវ សូមព្យាយាមមុខវិជ្ជាផ្សេងៗទៀត");
      }
    } else {
      setShowPasswordModal(true);
      setPasswordError("");
    }
  }, [passwordVerified, examLink, linkValid]);

  const handleRetryLink = useCallback(() => {
    setRetryCount(prev => prev + 1);
    fetchExamLink();
  }, [fetchExamLink]);

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
    if ((selectedGrade === "11" || selectedGrade === "12")) {
      // Ensure scienceStream is set to a valid value
      const stream = scienceStream || "វិទ្យាសាស្រ្ត";
      key = `${selectedGrade}-${stream}`;
    }

    // Return points if found, otherwise return a default value
    return SUBJECT_POINTS[key]?.[subject] || getDefaultPoints(subject, selectedGrade);
  };

  const subjects = getSubjects();

  // If the Google Form should be shown, render it instead of the normal content
  if (showGoogleForm && examLink && linkValid) {
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
            <Button variant="ghost" onClick={() => {
              setShowGoogleForm(false);
              setFormLoadError(false);
            }}>
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
              {usingFallback && (
                <div className="text-xs text-amber-600 flex items-center mt-1">
                  <Info className="h-3 w-3 mr-1" />
                  កំពុងប្រើតំណភ្ជាប់បម្រុង
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Google Form Container */}
        <div className="p-4 md:p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
            {formLoadError ? (
              <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">មិនអាចផ្ទុកទម្រង់ប្រឡង</h3>
                <p className="text-gray-600 mb-4">សូមព្យាយាមម្តងទៀត ឬជ្រើសរើសមុខវិជ្ជាផ្សេងៗ</p>
                <Button onClick={() => {
                  setShowGoogleForm(false);
                  setFormLoadError(false);
                }} variant="primary">
                  ត្រឡប់ទៅទំព័រជ្រើសរើស
                </Button>
              </div>
            ) : (
              <iframe
                src={examLink}
                width="100%"
                height="100%"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
                title={`${selectedSubject} Exam Form`}
                onError={() => setFormLoadError(true)}
                onLoad={() => console.log(`Form loaded successfully for ${selectedSubject}`)}
              >
                កំពុងផ្ទុក...
              </iframe>
            )}
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
          <Button variant="ghost" onClick={handleBackToCode}>
            <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
            ត្រឡប់
          </Button>
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
                className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${scienceStream === "វិទ្យាសាស្រ្ត"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:bg-gray-50"
                  }`}
                onClick={() => setScienceStream("វិទ្យាសាស្រ្ត")}
              >
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${scienceStream === "វិទ្យាសាស្រ្ត"
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
                className={`flex items-center p-3 border rounded-md cursor-pointer transition-colors ${scienceStream === "វិទ្យាសាស្រ្តសង្គម"
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-300 hover:bg-gray-50"
                  }`}
                onClick={() => setScienceStream("វិទ្យាសាស្រ្តសង្គម")}
              >
                <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${scienceStream === "វិទ្យាសាស្រ្តសង្គម"
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
                  const hasLinkIssue = isSelected && linkValid === false;

                  return (
                    <div
                      key={subject}
                      className={`p-4 border rounded-md cursor-pointer transition-all ${hasLinkIssue
                          ? "border-red-300 bg-red-50"
                          : isSelected
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-300 hover:bg-gray-50"
                        }`}
                      onClick={() => {
                        setSelectedSubject(subject);
                        setPasswordVerified(false);
                        setLinkError(null);
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
                        {hasLinkIssue && (
                          <AlertTriangle className="h-5 w-5 text-red-500" />
                        )}
                      </div>

                      <div className="text-base font-medium text-gray-800 mb-2">
                        {subject}
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <Award className="h-4 w-4 mr-1 text-amber-500" />
                        <span>{points} ពិន្ទុ</span>
                      </div>

                      {hasLinkIssue && (
                        <div className="mt-2 text-xs text-red-600">
                          <Info className="h-3 w-3 inline mr-1" />
                          មិនមានតំណភ្ជាប់
                        </div>
                      )}
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
              ) : linkError ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center py-4 text-center">
                    <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                    <div>
                      <div className="font-medium text-red-700">{linkError}</div>
                      <div className="text-sm text-gray-500">សូមព្យាយាមមុខវិជ្ជាផ្សេងទៀត</div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Button onClick={handleRetryLink} variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      ព្យាយាមម្តងទៀត
                    </Button>
                  </div>
                </div>
              ) : examLink && linkValid ? (
                <div>
                  {usingFallback && (
                    <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-md text-xs text-amber-800 flex items-center">
                      <Info className="h-3 w-3 mr-1" />
                      កំពុងប្រើតំណភ្ជាប់បម្រុងសម្រាប់មុខវិជ្ជានេះ
                    </div>
                  )}
                  <Button
                    onClick={handleExamLinkClick}
                    className="w-full"
                  >
                    <BookOpen className="h-4 w-4 mr-2" />
                    ចូលរួមប្រឡង
                  </Button>
                </div>
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

            {/* Debug Information (only in development) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mt-4 p-3 bg-gray-100 rounded-md text-xs">
                <div className="font-semibold mb-2">Debug Info:</div>
                <div>Link: {examLink || 'None'}</div>
                <div>Valid: {linkValid ? 'Yes' : linkValid === false ? 'No' : 'Not checked'}</div>
                <div>Error: {linkError || 'None'}</div>
                <div>Retry Count: {retryCount}</div>
                <div>Using Fallback: {usingFallback ? 'Yes' : 'No'}</div>
              </div>
            )}
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