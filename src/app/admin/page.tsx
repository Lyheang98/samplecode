"use client";

import { useState, useEffect } from "react";
import { 
  Shield, 
  BookOpen, 
  MapPin, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Lock,
  Settings,
  Users,
  School,
  Clock,
  Eye,
  EyeOff
} from "lucide-react";

// Provinces data
const PROVINCES = [
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
  { id: "22", name: "ខេត្តឧត្តរមានជ័យ" },
  { id: "23", name: "ខេត្តកែប" },
  { id: "24", name: "ខេត្តប៉ៃលិន" },
  { id: "25", name: "ខេត្តត្បូងឃ្មុំ" },
];

// Grades data
const GRADES = ["7", "8", "9", "10", "11", "12"];

// Subjects data
const SUBJECTS = [
  "ភាសាខ្មែរ",
  "គណិតវិទ្យា",
  "រូបវិទ្យា",
  "គីមីវិទ្យា",
  "ជីវវិទ្យា",
  "ប្រវត្តិវិទ្យា",
  "ភូមិវិទ្យា",
  "សីលធម៌-ពលរដ្ឋវិជ្ជា",
  "ផែនដីវិទ្យា",
  "អង់គ្លេស"
];

// Default subject passwords
const DEFAULT_SUBJECT_PASSWORDS: { [key: string]: string } = {
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
};

interface Province {
  id: string;
  name: string;
  isActive: boolean;
  examDeadline: string;
}

interface Grade {
  grade: string;
  isActive: boolean;
  examDeadline: string;
}

interface SubjectPassword {
  password: string;
  showPassword: boolean;
}

interface ExamCode {
  id: string;
  code: string;
  isActive: boolean;
  description: string;
}

export default function AdminDashboard() {
  // State for province controls
  const [provinces, setProvinces] = useState<Province[]>(
    PROVINCES.map(p => ({ 
      ...p, 
      isActive: true,
      examDeadline: "2024-12-31" // Default deadline
    }))
  );
  
  // State for grade controls
  const [grades, setGrades] = useState<Grade[]>(
    GRADES.map(g => ({ 
      grade: g, 
      isActive: true,
      examDeadline: "2024-12-31" // Default deadline
    }))
  );
  
  // State for subject passwords
  const [subjectPasswords, setSubjectPasswords] = useState<Record<string, SubjectPassword>>(
    SUBJECTS.reduce((acc, subject) => {
      acc[subject] = { 
        password: DEFAULT_SUBJECT_PASSWORDS[subject], 
        showPassword: false 
      };
      return acc;
    }, {} as Record<string, SubjectPassword>)
  );
  
  // State for exam codes
  const [examCodes, setExamCodes] = useState<ExamCode[]>([
    { id: "1", code: "EXAM1", isActive: true, description: "ប្រឡងទី 1 - ភាសាខ្មែរ" },
    { id: "2", code: "EXAM2", isActive: true, description: "ប្រឡងទី 2 - គណិតវិទ្យា" },
    { id: "3", code: "EXAM3", isActive: false, description: "ប្រឡងទី 3 - វិទ្យាសាស្រ្ត" },
  ]);
  
  // State for new exam code
  const [newExamCode, setNewExamCode] = useState("");
  const [newExamDescription, setNewExamDescription] = useState("");
  
  // Loading and saving states
  const [loading, setLoading] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");
  
  // State for active tab
  const [activeTab, setActiveTab] = useState<"provinces" | "grades" | "passwords" | "examCodes">("provinces");

  // Toggle province active status
  const toggleProvince = (provinceId: string): void => {
    setProvinces(prev => 
      prev.map(p => 
        p.id === provinceId ? { ...p, isActive: !p.isActive } : p
      )
    );
  };

  // Update province deadline
  const updateProvinceDeadline = (provinceId: string, deadline: string): void => {
    setProvinces(prev => 
      prev.map(p => 
        p.id === provinceId ? { ...p, examDeadline: deadline } : p
      )
    );
  };

  // Toggle grade active status
  const toggleGrade = (grade: string): void => {
    setGrades(prev => 
      prev.map(g => 
        g.grade === grade ? { ...g, isActive: !g.isActive } : g
      )
    );
  };

  // Update grade deadline
  const updateGradeDeadline = (grade: string, deadline: string): void => {
    setGrades(prev => 
      prev.map(g => 
        g.grade === grade ? { ...g, examDeadline: deadline } : g
      )
    );
  };

  // Update subject password
  const updateSubjectPassword = (subject: string, password: string): void => {
    setSubjectPasswords(prev => ({
      ...prev,
      [subject]: { ...prev[subject], password }
    }));
  };

  // Toggle password visibility
  const togglePasswordVisibility = (subject: string): void => {
    setSubjectPasswords(prev => ({
      ...prev,
      [subject]: { ...prev[subject], showPassword: !prev[subject].showPassword }
    }));
  };

  // Toggle exam code active status
  const toggleExamCode = (codeId: string): void => {
    setExamCodes(prev => 
      prev.map(c => 
        c.id === codeId ? { ...c, isActive: !c.isActive } : c
      )
    );
  };

  // Add new exam code
  const addExamCode = (): void => {
    if (!newExamCode.trim()) return;
    
    const newCode: ExamCode = {
      id: Date.now().toString(),
      code: newExamCode,
      description: newExamDescription,
      isActive: true
    };
    
    setExamCodes(prev => [...prev, newCode]);
    setNewExamCode("");
    setNewExamDescription("");
  };

  // Delete exam code
  const deleteExamCode = (codeId: string): void => {
    setExamCodes(prev => prev.filter(c => c.id !== codeId));
  };

  // Save all settings
  const saveSettings = async (): Promise<void> => {
    setLoading(true);
    setSaveMessage("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real implementation, you would send this data to your API
      const settingsData = {
        provinces: provinces,
        grades: grades,
        subjectPasswords: Object.entries(subjectPasswords).reduce((acc, [subject, { password }]) => {
          acc[subject] = password;
          return acc;
        }, {} as Record<string, string>),
        examCodes: examCodes
      };
      
      console.log("Saving settings:", settingsData);
      
      setSaveMessage("ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ!");
      setMessageType("success");
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveMessage("មានបញ្ហាក្នុងការរក្សាទុកការកំណត់។ សូមព្យាយាមម្តងទៀត។");
      setMessageType("error");
    } finally {
      setLoading(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setSaveMessage("");
      }, 5000);
    }
  };

  // Toggle all provinces
  const toggleAllProvinces = (active: boolean): void => {
    setProvinces(prev => 
      prev.map(p => ({ ...p, isActive: active }))
    );
  };

  // Toggle all grades
  const toggleAllGrades = (active: boolean): void => {
    setGrades(prev => 
      prev.map(g => ({ ...g, isActive: active }))
    );
  };

  // Check if a date is in the past
  const isDateInPast = (dateString: string): boolean => {
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 text-white rounded-full p-4">
              <Shield className="h-10 w-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">ផ្ទាំងគ្រប់គ្រងរបស់អ្នកគ្រប់គ្រង</h1>
          <p className="text-gray-600 mt-2">គ្រប់គ្រងការចូលប្រើប្រាស់ប្រឡងតាមខេត្ត ថ្នាក់ និងមុខវិជ្ជា</p>
        </header>

        {/* Success/Error Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            messageType === "success" 
              ? "bg-green-100 text-green-700" 
              : "bg-red-100 text-red-700"
          }`}>
            {messageType === "success" ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {saveMessage}
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-md mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("provinces")}
              className={`flex items-center px-6 py-3 font-medium text-sm ${
                activeTab === "provinces"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <MapPin className="h-4 w-4 mr-2" />
              ខេត្ត
            </button>
            <button
              onClick={() => setActiveTab("grades")}
              className={`flex items-center px-6 py-3 font-medium text-sm ${
                activeTab === "grades"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              ថ្នាក់
            </button>
            <button
              onClick={() => setActiveTab("passwords")}
              className={`flex items-center px-6 py-3 font-medium text-sm ${
                activeTab === "passwords"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Lock className="h-4 w-4 mr-2" />
              លេខសម្ងាត់
            </button>
            <button
              onClick={() => setActiveTab("examCodes")}
              className={`flex items-center px-6 py-3 font-medium text-sm ${
                activeTab === "examCodes"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Settings className="h-4 w-4 mr-2" />
              កូដប្រឡង
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Province Controls */}
          {activeTab === "provinces" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <MapPin className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-800">គ្រប់គ្រងខេត្ត</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAllProvinces(true)}
                    className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                  >
                    បើកទាំងអស់
                  </button>
                  <button
                    onClick={() => toggleAllProvinces(false)}
                    className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    បិទទាំងអស់
                  </button>
                </div>
              </div>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  បើក/បិទការអនុញ្ញាតឱ្យប្រឡងតាមខេត្ត។ ខេត្តដែលត្រូវបានបិទនឹងមិនអាចចូលប្រើប្រព័ន្ធប្រឡងបានទេ។
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ខេត្ត/ក្រុង
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ស្ថានភាព
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        កាលបរិច្ឆេទប្រឡង
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        សកម្មភាព
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {provinces.map((province: Province) => (
                      <tr key={province.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{province.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            province.isActive 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {province.isActive ? "អនុញ្ញាតឱ្យប្រឡង" : "មិនអនុញ្ញាតឱ្យប្រឡង"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="date"
                              value={province.examDeadline}
                              onChange={(e) => updateProvinceDeadline(province.id, e.target.value)}
                              className="text-sm border border-gray-300 rounded-md px-2 py-1 w-36"
                            />
                            {isDateInPast(province.examDeadline) && (
                              <AlertCircle className="ml-2 h-4 w-4 text-red-500"  />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              province.isActive ? "bg-green-600" : "bg-gray-300"
                            } cursor-pointer`}
                            onClick={() => toggleProvince(province.id)}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                province.isActive ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Grade Controls */}
          {activeTab === "grades" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-800">គ្រប់គ្រងថ្នាក់</h2>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleAllGrades(true)}
                    className="text-sm px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                  >
                    បើកទាំងអស់
                  </button>
                  <button
                    onClick={() => toggleAllGrades(false)}
                    className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                  >
                    បិទទាំងអស់
                  </button>
                </div>
              </div>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  បើក/បិទការអនុញ្ញាតឱ្យប្រឡងតាមថ្នាក់។ ថ្នាក់ដែលត្រូវបានបិទនឹងមិនអាចចូលរួមប្រឡងបានទេ។
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ថ្នាក់
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ស្ថានភាព
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        កាលបរិច្ឆេទប្រឡង
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        សកម្មភាព
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {grades.map(({ grade, isActive, examDeadline }: Grade) => (
                      <tr key={grade}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">ថ្នាក់ {grade}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            isActive 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {isActive ? "អនុញ្ញាតឱ្យប្រឡង" : "មិនអនុញ្ញាតឱ្យប្រឡង"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <input
                              type="date"
                              value={examDeadline}
                              onChange={(e) => updateGradeDeadline(grade, e.target.value)}
                              className="text-sm border border-gray-300 rounded-md px-2 py-1 w-36"
                            />
                            {isDateInPast(examDeadline) && (
                              <AlertCircle className="ml-2 h-4 w-4 text-red-500" />
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button
                            type="button"
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              isActive ? "bg-green-600" : "bg-gray-300"
                            } cursor-pointer`}
                            onClick={() => toggleGrade(grade)}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                isActive ? "translate-x-6" : "translate-x-1"
                              }`}
                            />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Subject Password Controls */}
          {activeTab === "passwords" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <Shield className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-800">ការពារលេខសម្ងាត់មុខវិជ្ជា</h2>
              </div>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  កំណត់លេខសម្ងាត់ 4 ខ្ទង់សម្រាប់មុខវិជ្ជានីមួយៗ។ សិស្សត្រូវការលេខសម្ងាត់នេះដើម្បីចូលរួមប្រឡងមុខវិជ្ជាដែលបានជ្រើសរើស។
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(subjectPasswords).map(([subject, { password, showPassword }]: [string, SubjectPassword]) => (
                  <div key={subject} className="p-3 bg-gray-50 rounded-lg">
                    <div className="font-medium mb-2">{subject}</div>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => updateSubjectPassword(subject, e.target.value)}
                        placeholder="លេខសម្ងាត់ 4 ខ្ទង់"
                        maxLength={4}
                        className="w-full h-10 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm pr-10"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => togglePasswordVisibility(subject)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exam Code Controls */}
          {activeTab === "examCodes" && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-6">
                <Settings className="h-6 w-6 text-blue-600 mr-3" />
                <h2 className="text-xl font-bold text-gray-800">គ្រប់គ្រងកូដប្រឡង</h2>
              </div>
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  បង្កើត និងគ្រប់គ្រងកូដប្រឡងសម្រាប់ការប្រឡងផ្សេងៗ។ កូដប្រឡងអាចត្រូវបានបើក/បិទតាមតម្រូវការ។
                </p>
              </div>
              
              {/* Add New Exam Code Form */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-medium mb-3">បង្កើតកូដប្រឡងថ្មី</h3>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={newExamCode}
                    onChange={(e) => setNewExamCode(e.target.value)}
                    placeholder="កូដប្រឡង (ត្រឹមតែ 4 តួ)"
                    maxLength={4}
                    className="flex-1 h-10 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm"
                  />
                  <input
                    type="text"
                    value={newExamDescription}
                    onChange={(e) => setNewExamDescription(e.target.value)}
                    placeholder="ការពិពណ៌នាអំពីកូដប្រឡង"
                    className="flex-1 h-10 bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded-lg text-sm"
                  />
                  <button
                    onClick={addExamCode}
                    disabled={!newExamCode.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    បង្កើត
                  </button>
                </div>
              </div>
              
              {/* Exam Codes List */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        កូដប្រឡង
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ការពិពណ៌នា
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ស្ថានភាព
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        សកម្មភាព
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {examCodes.map((examCode: ExamCode) => (
                      <tr key={examCode.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{examCode.code}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{examCode.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            examCode.isActive 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {examCode.isActive ? "សកម្ម" : "មិនសកម្ម"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex gap-2">
                            <button
                              type="button"
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                examCode.isActive ? "bg-green-600" : "bg-gray-300"
                              } cursor-pointer`}
                              onClick={() => toggleExamCode(examCode.id)}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  examCode.isActive ? "translate-x-6" : "translate-x-1"
                                }`}
                              />
                            </button>
                            <button
                              type="button"
                              className="text-red-600 hover:text-red-900"
                              onClick={() => deleteExamCode(examCode.id)}
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={saveSettings}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-12 px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                កំពុងរក្សាទុក...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                រក្សាទុកការកំណត់
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}