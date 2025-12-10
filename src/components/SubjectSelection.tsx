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
} from "lucide-react";

import { getExamLink } from "@/utils/examLinks";

const Card = ({ children, className = "" }: any) => (
  <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}>
    {children}
  </div>
);

const Button = ({
  children,
  onClick,
  className = "",
  disabled = false,
  ...props
}: any) => (
  <button
    onClick={onClick}
    className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2 ${className}`}
    disabled={disabled}
    type="button"
    {...props}
  >
    {children}
  </button>
);

const Input = ({ value, onChange, type = "text", placeholder, className = "", ...props }: any) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange && onChange(e.target.value)}
    placeholder={placeholder}
    className={`w-full h-10 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm ${className}`}
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
      if (examLink) {
        window.open(examLink, '_blank');
      }
    } else {
      setPasswordError("លេខសម្ងាត់មិនត្រឹមត្រូវ");
    }
  }, [password, selectedSubject, examLink, subjectPasswords]);

  const handleExamLinkClick = useCallback(() => {
    if (passwordVerified) {
      if (examLink) {
        window.open(examLink, '_blank');
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

  const subjects = getSubjects();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 rounded-xl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center" style={{ perspective: "1000px" }}>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-3">
          <Card className="shadow-2xl bg-white/80 backdrop-blur-sm border-0 overflow-hidden transform transition-all duration-300 hover:shadow-xl" style={{ transformStyle: "preserve-3d" }}>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white transform transition-all duration-300 hover:shadow-inner">
              <div className="flex items-center">
                <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mr-4 shadow-lg transform transition-all duration-300 hover:scale-110">
                  <User className="h-8 w-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">ព័ត៌មានសិស្ស</h2>
                  <p className="text-blue-100 text-sm">ព័ត៌មានលម្អិតអំពីសិស្ស</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-blue-500 to-indigo-600 rounded-r-full"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center">
                  <div className="bg-blue-100 text-blue-600 rounded-lg p-2 mr-3 shadow-md transform transition-all duration-300 group-hover:scale-110">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">ឈ្មោះ</div>
                    <div className="font-semibold text-gray-800">{selectedStudent?.fullName || ""}</div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-green-500 to-emerald-600 rounded-r-full"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center">
                  <div className="bg-green-100 text-green-600 rounded-lg p-2 mr-3 shadow-md transform transition-all duration-300 group-hover:scale-110">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">សាលារៀន</div>
                    <div className="font-semibold text-gray-800">{selectedSchool?.name || ""}</div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 p-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-purple-500 to-pink-600 rounded-r-full"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center">
                  <div className="bg-purple-100 text-purple-600 rounded-lg p-2 mr-3 shadow-md transform transition-all duration-300 group-hover:scale-110">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">ថ្នាក់</div>
                    <div className="font-semibold text-gray-800">{selectedGrade}</div>
                  </div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 p-4 transition-all duration-300 hover:shadow-lg hover:scale-105">
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-500 to-orange-600 rounded-r-full"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="flex items-center">
                  <div className="bg-amber-100 text-amber-600 rounded-lg p-2 mr-3 shadow-md transform transition-all duration-300 group-hover:scale-110">
                    <Home className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 uppercase tracking-wide">ខេត្ត/ក្រុង</div>
                    <div className="font-semibold text-gray-800">
                      {PROVINCES.find((p) => p.id === selectedProvinceId)?.name || ""}
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-4 shadow-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                <div className="relative flex items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 mr-3 shadow-md transform transition-all duration-300 hover:scale-110">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-blue-100 uppercase tracking-wide">កូដប្រឡង</div>
                    <div className="font-mono font-bold text-lg text-white">{examCode}</div>
                  </div>
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 shadow-md transform transition-all duration-300 hover:scale-110">
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
            </div>

            {(selectedGrade === "11" || selectedGrade === "12") && (
              <div className="px-6 pb-6">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 transform transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
                    <div className="bg-blue-100 text-blue-600 rounded-lg p-2 mr-3 shadow-md transform transition-all duration-300 hover:scale-110">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    ជ្រើសរើសជំនាញវិទ្យាសាស្រ្ត
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => setScienceStream("វិទ្យាសាស្រ្ត")}
                      className={`${
                        scienceStream === "វិទ្យាសាស្រ្ត"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transform scale-105 transition-all duration-300"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                      } p-4 h-auto flex flex-col items-center justify-center rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                    >
                      <div
                        className={`${
                          scienceStream === "វិទ្យាសាស្រ្ត"
                            ? "bg-white/20 backdrop-blur-sm"
                            : "bg-blue-100 text-blue-600"
                        } rounded-lg p-2 mb-2 shadow-md transform transition-all duration-300 hover:scale-110`}
                      >
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="font-medium">វិទ្យាសាស្រ្ត</div>
                    </Button>
                    <Button
                      onClick={() => setScienceStream("វិទ្យាសាស្រ្តសង្គម")}
                      className={`${
                        scienceStream === "វិទ្យាសាស្រ្តសង្គម"
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg transform scale-105 transition-all duration-300"
                          : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                      } p-4 h-auto flex flex-col items-center justify-center rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg`}
                    >
                      <div
                        className={`${
                          scienceStream === "វិទ្យាសាស្រ្តសង្គម"
                            ? "bg-white/20 backdrop-blur-sm"
                            : "bg-blue-100 text-blue-600"
                        } rounded-lg p-2 mb-2 shadow-md transform transition-all duration-300 hover:scale-110`}
                      >
                        <BookOpen className="h-5 w-5" />
                      </div>
                      <div className="font-medium">វិទ្យាសាស្រ្តសង្គម</div>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="px-6 pb-6">
              <Button
                onClick={handleBackToCode}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
                ត្រឡប់ទៅកាន់ទំព័រកូដប្រឡង
              </Button>
            </div>
          </Card>

          <Card className="shadow-2xl bg-white/80 backdrop-blur-sm border-0 overflow-hidden transform transition-all duration-300 hover:shadow-xl" style={{ transformStyle: "preserve-3d" }}>
            <div className="bg-gradient-to-r from-green-600 to-emerald-700 p-6 text-white transform transition-all duration-300 hover:shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-xl p-3 mr-4 shadow-lg transform transition-all duration-300 hover:scale-110">
                    <BookOpen className="h-8 w-8" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">ជ្រើសរើសមុខវិជ្ជា</h2>
                    <p className="text-green-100 text-sm">ជ្រើសរើសមុខវិជ្ជាដើម្បីចូលរួមប្រឡង</p>
                  </div>
                </div>
                {selectedGrade && (
                  <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium transform transition-all duration-300 hover:scale-110">
                    ថ្នាក់ {selectedGrade}
                  </div>
                )}
              </div>
            </div>

            <div className="p-6">
              {(selectedGrade === "11" || selectedGrade === "12") && !scienceStream ? (
                <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 transform transition-all duration-300 hover:shadow-lg">
                  <div className="bg-blue-100 text-blue-600 rounded-full p-4 mb-4 shadow-lg transform transition-all duration-300 hover:scale-110">
                    <AlertTriangle className="h-8 w-8" />
                  </div>
                  <p className="text-gray-600 text-lg font-medium">សូមជ្រើសរើសជំនាញវិទ្យាសាស្រ្តជាមុនសិន</p>
                  <p className="text-gray-500 text-sm mt-2">សូមជ្រើសរើសជំនាញវិទ្យាសាស្រ្តនៅក្នុងផ្នែកព័ត៌មានសិស្ស</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto pr-2">
                    {subjects.length > 0 ? (
                      subjects.map((subject) => (
                        <Button
                          key={subject}
                          onClick={() => {
                            setSelectedSubject(subject);
                            setPasswordVerified(false);
                          }}
                          className={`${
                            selectedSubject === subject
                              ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg transform scale-105 transition-all duration-300 border-0"
                              : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-gray-100 hover:to-gray-200 border border-gray-200 shadow-sm"
                          } p-4 h-auto flex flex-col items-center justify-center rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-lg group`}
                        >
                          <div
                            className={`${
                              selectedSubject === subject
                                ? "bg-white/20 backdrop-blur-sm"
                                : "bg-blue-100 text-blue-600"
                            } rounded-lg p-3 mb-3 shadow-md transform transition-all duration-300 group-hover:scale-110`}
                          >
                            {subject === "ភាសាខ្មែរ" && <BookOpen className="h-6 w-6" />}
                            {subject === "គណិតវិទ្យា" && <BookOpen className="h-6 w-6" />}
                            {subject === "រូបវិទ្យា" && <BookOpen className="h-6 w-6" />}
                            {subject === "គីមីវិទ្យា" && <BookOpen className="h-6 w-6" />}
                            {subject === "ជីវវិទ្យា" && <BookOpen className="h-6 w-6" />}
                            {subject === "ប្រវត្តិវិទ្យា" && <BookOpen className="h-6 w-6" />}
                            {subject === "ភូមិវិទ្យា" && <BookOpen className="h-6 w-6" />}
                            {subject === "សីលធម៌-ពលរដ្ឋវិជ្ជា" && <BookOpen className="h-6 w-6" />}
                            {subject === "ផែនដីវិទ្យា" && <BookOpen className="h-6 w-6" />}
                            {subject === "អង់គ្លេស" && <BookOpen className="h-6 w-6" />}
                          </div>
                          <div className="text-center">
                            <div className="font-medium text-sm">{subject}</div>
                            {selectedSubject === subject && (
                              <div className="text-xs mt-1 opacity-90">បានជ្រើសរើស</div>
                            )}
                          </div>
                        </Button>
                      ))
                    ) : (
                      <div className="col-span-full flex flex-col items-center justify-center py-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <div className="bg-gray-200 text-gray-500 rounded-full p-4 mb-4 shadow-lg transform transition-all duration-300 hover:scale-110">
                          <BookOpen className="h-8 w-8" />
                        </div>
                        <p className="text-gray-600 text-lg font-medium">មិនមានមុខវិជ្ជាសម្រាប់ថ្នាក់ {selectedGrade}</p>
                      </div>
                    )}
                  </div>

                  {selectedSubject && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-200 shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl">
                      <div className="flex items-center mb-4">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-3 mr-4 shadow-md transform transition-all duration-300 hover:scale-110">
                          <ExternalLink className="h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-gray-700 font-medium">តំណភ្ជាប់ទៅកាន់កម្មវិធីប្រឡង</p>
                          <p className="text-gray-500 text-sm">សម្រាប់មុខវិជ្ជា {selectedSubject}</p>
                        </div>
                      </div>

                      {linkLoading ? (
                        <div className="flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-xl shadow-md transform transition-all duration-300 hover:scale-105">
                          <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                          <span className="font-medium">កំពុងរកតំណភ្ជាប់...</span>
                        </div>
                      ) : examLink ? (
                        <button
                          onClick={handleExamLinkClick}
                          className="flex items-center justify-between bg-gradient-to-r from-green-600 to-emerald-600 text-white p-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 shadow-md group transform hover:scale-105 hover:shadow-xl w-full"
                        >
                          <div className="flex items-center">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 mr-3">
                              <BookOpen className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium">{selectedSubject}</div>
                              <div className="text-xs opacity-90">ចុចដើម្បីចូលរួមប្រឡង</div>
                            </div>
                          </div>
                          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-2 group-hover:bg-white/30 transition-all">
                            <ExternalLink className="h-5 w-5" />
                          </div>
                        </button>
                      ) : (
                        <div className="bg-gradient-to-r from-red-50 to-red-100 text-red-700 p-4 rounded-xl flex items-center border border-red-200 transform transition-all duration-300 hover:scale-105 hover:shadow-lg">
                          <div className="bg-red-100 rounded-lg p-2 mr-3">
                            <AlertTriangle className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="font-medium">មិនមានតំណភ្ជាប់សម្រាប់មុខវិជ្ជានេះ</div>
                            <div className="text-sm opacity-90">សូមព្យាយាមមុខវិជ្ជាផ្សេងទៀត</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </Card>
        </div>
      </div>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full transform transition-all duration-300 scale-100">
            <div className="flex items-center mb-4">
              <Lock className="h-6 w-6 text-blue-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-800">តម្រូវឱ្យមានលេខសម្ងាត់</h3>
            </div>
            <p className="text-gray-600 mb-4">សូមបញ្ចូលលេខសម្ងាត់ 4 ខ្ទង់ដើម្បីចូលប្រើប្រាស់ការប្រឡងមុខវិជ្ជា {selectedSubject}</p>
            <div className="flex gap-3">
              <div className="relative flex-1">
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
              <Button
                onClick={verifyPassword}
                disabled={!password || password.length !== 4}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                ផ្ទៀងផ្ទាត់
              </Button>
            </div>
            {passwordError && (
              <div className="mt-3 text-red-600 text-sm">{passwordError}</div>
            )}
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPassword("");
                  setPasswordError("");
                }}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700"
              >
                បោះបង់
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}