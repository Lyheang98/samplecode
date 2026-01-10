"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Home,
  Lock,
  X,
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
} from "lucide-react";
import Quiz from "@/app/quiz/[subject]/page";

// Configuration for UI
const SUBJECT_ICONS: Record<string, any> = {
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
  "គណិតវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)": <Calculator className="h-5 w-5" />,
  "រូបវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)": <Zap className="h-5 w-5" />,
  "គីមីវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)": <FlaskConical className="h-5 w-5" />,
  "ជីវវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)": <Dna className="h-5 w-5" />,
  "គណិតវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដសង្គម)": <Calculator className="h-5 w-5" />,
  "ប្រវត្តិវិទ្យា (សង្គម)": <Clock className="h-5 w-5" />,
};

const SUBJECT_PASSWORDS: Record<string, string> = {
  "ភាសាខ្មែរ": "1221", "គណិតវិទ្យា": "1222", "រូបវិទ្យា": "1223",
  "គីមីវិទ្យា": "1224", "ជីវវិទ្យា": "1225", "ប្រវត្តិវិទ្យា": "1226",
  "ភូមិវិទ្យា": "1227", "សីលធម៌-ពលរដ្ឋវិជ្ជា": "1228", "ផែនដីវិទ្យា": "1229",
  "អង់គ្លេស": "1220",
  "គណិតវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)": "1222",
  "រូបវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)": "1223",
  "គីមីវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)": "1224",
  "ជីវវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)": "1225",
  "គណិតវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដសង្គម)": "1222",
  "ប្រវត្តិវិទ្យា (សង្គម)": "1226",
};

// Define subjects for each grade and stream
const SUBJECTS: Record<string, { science: string[], social: string[] }> = {
  "7": {
    science: [
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
    social: []
  },
  "8": {
    science: [
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
    social: []
  },
  "9": {
    science: [
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
    social: []
  },
  "10": {
    science: [
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
    social: []
  },
  "11": {
    science: [
      "ភាសាខ្មែរ",
      "គណិតវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)",
      "រូបវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)",
      "គីមីវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)",
      "ជីវវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)",
      "អង់គ្លេស",
    ],
    social: [
      "ភាសាខ្មែរ",
      "គណិតវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដសង្គម)",
      "ប្រវត្តិវិទ្យា (សង្គម)",
      "ភូមិវិទ្យា",
      "សីលធម៌-ពលរដ្ឋវិជ្ជា",
      "ផែនដីវិទ្យា",
      "អង់គ្លេស",
    ]
  },
  "12": {
    science: [
      "ភាសាខ្មែរ",
      "គណិតវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)",
      "រូបវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)",
      "គីមីវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)",
      "ជីវវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដ)",
      "អង់គ្លេស",
    ],
    social: [
      "ភាសាខ្មែរ",
      "គណិតវិទ្យា (ថ្នាក់វិទ្យាសាស្រ្ដសង្គម)",
      "ប្រវត្តិវិទ្យា (សង្គម)",
      "ភូមិវិទ្យា",
      "សីលធម៌-ពលរដ្ឋវិជ្ជា",
      "ផែនដីវិទ្យា",
      "អង់គ្លេស",
    ]
  },
};

export default function SubjectSelection({
  selectedStudent,
  selectedSchool,
  selectedGrade,
  selectedProvinceId,
  examCode,
  handleBackToCode
}: any) {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [startQuiz, setStartQuiz] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [selectedStream, setSelectedStream] = useState<"science" | "social">("science");

  const handleSubjectClick = (subject: string) => {
    setSelectedSubject(subject);
    setShowPasswordModal(true);
    setPassword("");
    setPasswordError("");
  };

  const verifyPassword = () => {
    if (password === SUBJECT_PASSWORDS[selectedSubject]) {
      setStartQuiz(true);
      setShowPasswordModal(false);
    } else {
      setPasswordError("លេខសម្ងាត់មិនត្រឹមត្រូវ");
    }
  };

  // Get subjects based on grade and stream
  const getSubjects = () => {
    if (selectedGrade === "11" || selectedGrade === "12") {
      return SUBJECTS[selectedGrade][selectedStream];
    }
    return SUBJECTS[selectedGrade].science;
  };

  // --- Direct Quiz Rendering ---
  if (startQuiz) {
    return (
      <div className="fixed inset-0 z-[60] bg-white overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h1 className="text-xl font-bold text-blue-700">
              {selectedSubject} - ថ្នាក់ទី {selectedGrade}
              {(selectedGrade === "11" || selectedGrade === "12") && (
                <span className="ml-2 text-sm">
                  ({selectedStream === "science" ? "វិទ្យាសាស្រ្ដ" : "វិទ្យាសាស្រ្ដសង្គម"})
                </span>
              )}
            </h1>
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
          <Quiz
            params={{ subject: selectedSubject }}
            examCode={examCode}
            selectedStudent={selectedStudent}
            selectedSchool={selectedSchool}
            selectedGrade={selectedGrade}
            selectedProvinceId={selectedProvinceId}
            selectedStream={selectedStream}
          />
        </div>
      </div>
    );
  }

  const subjects = getSubjects();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Student Summary Card */}
        <div className="bg-white p-6 rounded-3xl shadow-xl border border-blue-100">
          <h2 className="text-xl font-bold mb-4 text-gray-800">ព័ត៌មានបេក្ខជន</h2>
          <div className="space-y-2 text-l">
            <p><span className="text-orange-500 ">ឈ្មោះ៖</span> <strong>{selectedStudent?.fullName}</strong></p>
            <p><span className="text-orange-500">សាលា៖</span> {selectedSchool?.name}</p>
            <p><span className="text-orange-500">កូដ៖</span> <code className="bg-gray-100 px-1 rounded">{examCode}</code></p>
          </div>
          <button
            onClick={handleBackToCode}
            className="mt-4 w-full text-blue-600 text-xl font-bold hover:underline"
          >
            កែប្រែព័ត៌មាន
          </button>
        </div>

        {/* Subject Grid */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-xl border border-purple-100">
          <h2 className="text-xl font-bold mb-6">សូមជ្រើសរើសមុខវិជ្ជា</h2>

          {/* Stream selection for grades 11 and 12 */}
          {(selectedGrade === "11" || selectedGrade === "12") && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-bold mb-3">ជ្រើសរើសថ្នាក់ទី {selectedGrade}</h3>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedStream("science")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedStream === "science"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 border border-blue-300"
                    }`}
                >
                  ថ្នាក់វិទ្យាសាស្រ្ដ
                </button>
                <button
                  onClick={() => setSelectedStream("social")}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${selectedStream === "social"
                      ? "bg-blue-600 text-white"
                      : "bg-white text-blue-600 border border-blue-300"
                    }`}
                >
                  ថ្នាក់វិទ្យាសាស្រ្ដសង្គម
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {subjects.map((subject: string) => (
              <button
                key={subject}
                onClick={() => handleSubjectClick(subject)}
                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${selectedSubject === subject ? "border-blue-500 bg-blue-50" : "border-gray-50 hover:border-blue-200"
                  }`}
              >
                <div className="p-3 bg-white rounded-xl shadow-sm">
                  {SUBJECT_ICONS[subject] || <MessageSquare className="h-5 w-5" />}
                </div>
                <span className="text-sm font-bold">{subject}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Lock className="text-yellow-500" /> បញ្ជាក់លេខសម្ងាត់
            </h3>
            <p className="text-gray-600 text-sm mb-6">
              សូមបញ្ចូលលេខសម្ងាត់ដើម្បីចូលប្រឡងមុខវិជ្ជា <strong>{selectedSubject}</strong>
            </p>
            <input
              type="password"
              className="w-full text-center text-2xl tracking-[0.5em] p-4 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none mb-2"
              maxLength={4}
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="text-red-500 text-xs font-bold mb-4 text-center">{passwordError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 rounded-xl transition"
              >
                បោះបង់
              </button>
              <button
                onClick={verifyPassword}
                className="flex-1 py-3 font-bold bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 transition"
              >
                ចូលរួម
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}