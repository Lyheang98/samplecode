// app/admin/page.tsx
"use client";

import { useState } from "react";

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

interface Province {
  id: string;
  name: string;
  isActive: boolean;
}

interface Grade {
  grade: string;
  isActive: boolean;
}

interface SubjectPassword {
  password: string;
  showPassword: boolean;
}

export default function AdminDashboard() {
  // State for province controls
  const [provinces, setProvinces] = useState<Province[]>(
    PROVINCES.map(p => ({ ...p, isActive: true }))
  );
  
  // State for grade controls
  const [grades, setGrades] = useState<Grade[]>(
    GRADES.map(g => ({ grade: g, isActive: true }))
  );
  
  // State for subject passwords
  const [subjectPasswords, setSubjectPasswords] = useState<Record<string, SubjectPassword>>(
    SUBJECTS.reduce((acc, subject) => {
      acc[subject] = { password: "", showPassword: false };
      return acc;
    }, {} as Record<string, SubjectPassword>)
  );
  
  // Loading and saving states
  const [loading, setLoading] = useState<boolean>(false);
  const [saveMessage, setSaveMessage] = useState<string>("");

  // Toggle province active status
  const toggleProvince = (provinceId: string): void => {
    setProvinces(prev => 
      prev.map(p => 
        p.id === provinceId ? { ...p, isActive: !p.isActive } : p
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

  // Save all settings
  const saveSettings = async (): Promise<void> => {
    setLoading(true);
    setSaveMessage("");
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSaveMessage("ការកំណត់ត្រូវបានរក្សាទុកដោយជោគជ័យ!");
    } catch (error) {
      console.error("Error saving settings:", error);
      setSaveMessage("មានបញ្ហាក្នុងការរក្សាទុកការកំណត់។ សូមព្យាយាមម្តងទៀត។");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 text-white rounded-full p-4">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">ផ្ទាំងគ្រប់គ្រងរបស់អ្នកគ្រប់គ្រង</h1>
          <p className="text-gray-600 mt-2">គ្រប់គ្រងការចូលប្រើប្រាស់ប្រឡងតាមខេត្ត ថ្នាក់ និងមុខវិជ្ជា</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Province Controls */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">គ្រប់គ្រងខេត្ត</h2>
            </div>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {provinces.map((province: Province) => (
                <div key={province.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">{province.name}</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-3 text-gray-600">
                      {province.isActive ? "អនុញ្ញាតឱ្យប្រឡង" : "មិនអនុញ្ញាតឱ្យប្រឡង"}
                    </span>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        province.isActive ? "bg-blue-600" : "bg-gray-200"
                      } cursor-pointer`}
                      onClick={() => toggleProvince(province.id)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          province.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grade Controls */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center mb-6">
              <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">គ្រប់គ្រងថ្នាក់</h2>
            </div>
            <div className="space-y-3">
              {grades.map(({ grade, isActive }: Grade) => (
                <div key={grade} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">ថ្នាក់ {grade}</span>
                  <div className="flex items-center">
                    <span className="text-sm mr-3 text-gray-600">
                      {isActive ? "អនុញ្ញាតឱ្យប្រឡង" : "មិនអនុញ្ញាតឱ្យប្រឡង"}
                    </span>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isActive ? "bg-blue-600" : "bg-gray-200"
                      } cursor-pointer`}
                      onClick={() => toggleGrade(grade)}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subject Password Controls */}
          <div className="bg-white rounded-xl shadow-md p-6 lg:col-span-2">
            <div className="flex items-center mb-6">
              <svg className="h-6 w-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 className="text-xl font-bold text-gray-800">ការពារលេខសម្ងាត់មុខវិជ្ជា</h2>
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
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.442 9.942 9.942 0 017.963 4.442c.527 0 1.04-.055 1.545-.162M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.442 9.942 9.942 0 017.963 4.442c.527 0 1.04-.055 1.545-.162M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-2.442 9.942 9.942 0 017.963 4.442c.527 0 1.04-.055 1.545-.162M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      ) : (
                        <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Save Button and Message */}
        <div className="mt-8 flex flex-col items-center">
          {saveMessage && (
            <div className={`mb-4 p-3 rounded-lg ${saveMessage.includes("ជោគជ័យ") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {saveMessage}
            </div>
          )}
          <button
            onClick={saveSettings}
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none h-10 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                កំពុងរក្សាទុក...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                រក្សាទុកការកំណត់
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}