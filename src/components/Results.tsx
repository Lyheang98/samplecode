"use client";

import React, { FC } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Clock,
  Trophy,
  Download,
  AlertCircle,
  User,
  School,
  BookOpen,
  BadgeCheck,
  BadgeX,
  Hash,
  ClipboardList,
} from "lucide-react";

interface ResultsProps {
  score: number; // your raw score points (if already calculated)
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattemptedQuestions: number;
  percentage: number;
  timeSpent: number; // seconds
  averageTimePerQuestion: string;
  examCode?: string;
  studentInfo?: any;
  schoolName?: string;
  grade?: string;
  subjectName?: string;
  submitError?: string | null;
  isSubmitting?: boolean;
  resultsSaved?: boolean;
}

const Results: FC<ResultsProps> = ({
  score,
  totalQuestions,
  correctAnswers,
  wrongAnswers,
  unattemptedQuestions,
  percentage,
  timeSpent,
  averageTimePerQuestion,
  examCode,
  studentInfo,
  schoolName,
  grade,
  subjectName,
  submitError,
  isSubmitting,
  resultsSaved,
}) => {
  // ✅ If each question = 4 points (as in your download file)
  const pointsPerQuestion = 4;
  const maxScore = totalQuestions * pointsPerQuestion;

  // ✅ If your "score" prop is already correct total points, keep it.
  // If not, you can uncomment this version:
  // const totalScore = correctAnswers * pointsPerQuestion;
  const totalScore = score;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // ✅ Khmer grade letter (និទ្ទេស)
  const getLetterGrade = () => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  // ✅ Pass/Fail (ជាប់/ធ្លាក់) — change passMark if you want
  const passMark = 50;
  const isPass = percentage >= passMark;

  const getGradeColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getGradeMessage = () => {
    if (percentage >= 80) return "Excellent work! (ល្អណាស់)";
    if (percentage >= 60) return "Good job! (ល្អ)";
    if (percentage >= 40) return "Keep practicing! (មធ្យម)";
    return "More practice needed. (ខ្សោយ)";
  };

  const getPassFailBadge = () => {
    if (isPass) return { label: "ជាប់ (PASS)", icon: <BadgeCheck />, cls: "bg-green-100 text-green-800" };
    return { label: "ធ្លាក់ (FAIL)", icon: <BadgeX />, cls: "bg-red-100 text-red-800" };
  };

  const handleDownloadResults = () => {
    const SchoolName = schoolName ? `វិទ្យាល័យ ${schoolName}` : "មិនស្គាល់វិទ្យាល័យ";
    const Grade = grade ? `ថ្នាក់ទី ${grade}` : "មិនស្គាល់ថ្នាក់";
    const Subject = subjectName || "មិនស្គាល់មុខវិជ្ជា";

    const resultsText = `
លទ្ធផលប្រឡង (Exam Results)
=========================
លេខកូដវិញ្ញាសា (Exam Code): ${examCode || "N/A"}

ទិន្នន័យសិស្ស (Student Info)
----------------------------
ឈ្មោះសិស្ស (Student): ${studentInfo?.fullName || "N/A"}
លេខសម្គាល់ (ID): ${studentInfo?.studentId || "N/A"}
ភេទ (Gender): ${studentInfo?.gender || "N/A"}
ថ្នាក់ (Grade): ${Grade}
វិទ្យាល័យ (School): ${SchoolName}
មុខវិជ្ជា (Subject): ${Subject}
កាលបរិច្ឆេទ (Date): ${new Date().toLocaleDateString("km-KH")}

ទិន្នន័យសរុប (Summary)
----------------------
ពិន្ទុសរុប (Total Score): ${totalScore}/${maxScore}
ភាគរយ (Percentage): ${percentage}%
និទ្ទេស (Grade): ${getLetterGrade()}
លទ្ធផល (Result): ${isPass ? "ជាប់ (PASS)" : "ធ្លាក់ (FAIL)"}

ឆ្លើយត្រូវ (Correct): ${correctAnswers}/${totalQuestions}
ឆ្លើយខុស (Wrong): ${wrongAnswers}
មិនបានឆ្លើយ (Unattempted): ${unattemptedQuestions}

រយៈពេលប្រើប្រាស់ (Time Spent): ${formatTime(timeSpent)}
មធ្យមភាគក្នុងមួយសំណួរ: ${averageTimePerQuestion} វិនាទី
    `.trim();

    const blob = new Blob([resultsText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `result-${studentInfo?.fullName || "student"}-${new Date().toISOString().split("T")[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const passFail = getPassFailBadge();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">លទ្ធផលនៃការធ្វើតេស្ត</h1>
          <p className="text-blue-100 font-mono">Exam Code: {examCode}</p>
        </div>

        <div className="p-6 md:p-8">
          {/* ✅ TOP SUMMARY */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gray-50 mb-4 border-4 border-gray-100">
              <Trophy className={`w-16 h-16 ${getGradeColor()}`} />
            </div>

            <h2 className={`text-5xl font-extrabold ${getGradeColor()} mb-2`}>{percentage}%</h2>
            <p className="text-xl font-medium text-gray-700">{getGradeMessage()}</p>

            {/* ✅ PASS/FAIL + LETTER GRADE + TOTAL SCORE */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm inline-flex items-center gap-2 ${passFail.cls}`}>
                {React.cloneElement(passFail.icon as any, { className: "w-4 h-4" })}
                {passFail.label}
              </span>

              <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm inline-flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                និទ្ទេស (Grade): <b>{getLetterGrade()}</b>
              </span>

              <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm inline-flex items-center gap-2">
                <Hash className="w-4 h-4" />
                ពិន្ទុសរុប: <b>{totalScore}/{maxScore}</b>
              </span>

              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm inline-flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Spent time: <b>{formatTime(timeSpent)}</b>
              </span>
            </div>

            {/* ✅ EXTRA INFO */}
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {schoolName && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm inline-flex items-center gap-2">
                  <School className="w-4 h-4" />
                  {schoolName}
                </span>
              )}
              {grade && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm inline-flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4" />
                  ថ្នាក់ទី {grade}
                </span>
              )}
              {subjectName && (
                <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm inline-flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  {subjectName}
                </span>
              )}
            </div>
          </div>

          {/* ✅ STUDENT INFO BOX */}
          <div className="bg-gray-50 rounded-xl border border-gray-100 p-5 mb-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              ទិន្នន័យសិស្ស (Student Info)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <InfoRow label="ឈ្មោះសិស្ស" value={studentInfo?.fullName || "N/A"} />
              <InfoRow label="លេខសម្គាល់" value={studentInfo?.studentId || "N/A"} />
              <InfoRow label="ភេទ" value={studentInfo?.gender || "N/A"} />
              <InfoRow label="ថ្នាក់" value={grade ? `ថ្នាក់ទី ${grade}` : "N/A"} />
              <InfoRow label="វិទ្យាល័យ" value={schoolName || "N/A"} />
              <InfoRow label="មុខវិជ្ជា" value={subjectName || "N/A"} />
            </div>
          </div>

          {/* ✅ SUMMARY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <ResultCard
              icon={<CheckCircle className="text-green-500" />}
              label="ឆ្លើយត្រូវ"
              value={correctAnswers}
              subLabel={`ពីចំណោម ${totalQuestions}`}
              color="text-green-600"
            />
            <ResultCard
              icon={<XCircle className="text-red-500" />}
              label="ឆ្លើយខុស"
              value={wrongAnswers}
              color="text-red-600"
            />
            <ResultCard
              icon={<Clock className="text-blue-500" />}
              label="រយៈពេល (Spent Time)"
              value={formatTime(timeSpent)}
              subLabel={`មធ្យម ${averageTimePerQuestion}ស/សំណួរ`}
              color="text-blue-600"
            />
            <ResultCard
              icon={<AlertCircle className="text-amber-500" />}
              label="មិនបានឆ្លើយ"
              value={unattemptedQuestions}
              color="text-amber-600"
            />
          </div>

          {/* ✅ Status Messages */}
          {isSubmitting && <StatusBox color="blue" message="កំពុងរក្សាទុកលទ្ធផល..." loading />}
          {!isSubmitting && resultsSaved && <StatusBox color="green" message="លទ្ធផលត្រូវបានរក្សាទុកដោយជោគជ័យ!" />}
          {!isSubmitting && !resultsSaved && !submitError && (
            <StatusBox
              color="amber"
              message="មិនអាចតភ្ជាប់ទៅកាន់ម៉ាស៊ីនមេបានទេ ប៉ុន្តែអ្នកអាចទាញយកលទ្ធផលបាន។"
            />
          )}

          <button
            onClick={handleDownloadResults}
            className="w-full flex items-center justify-center gap-2 py-4 px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg active:scale-95"
          >
            <Download className="w-5 h-5" />
            ទាញយកលទ្ធផល (Download PDF/Text)
          </button>
        </div>
      </div>
    </motion.div>
  );
};

/** ✅ Small helper row for Student Info */
const InfoRow = ({ label, value }: { label: string; value: any }) => (
  <div className="flex items-center justify-between bg-white rounded-lg border border-gray-100 px-4 py-3">
    <span className="text-gray-500 font-medium">{label}</span>
    <span className="text-gray-800 font-semibold">{value}</span>
  </div>
);

const ResultCard = ({ icon, label, value, subLabel, color }: any) => (
  <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
    <div className="flex items-center mb-2">
      {React.cloneElement(icon, { className: "w-6 h-6 mr-2" })}
      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">{label}</h3>
    </div>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    {subLabel && <p className="text-xs text-gray-400">{subLabel}</p>}
  </div>
);

const StatusBox = ({ color, message, loading }: any) => {
  const colors: any = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    green: "bg-green-50 border-green-200 text-green-700",
    amber: "bg-amber-50 border-amber-200 text-amber-700",
  };
  return (
    <div className={`border rounded-lg p-4 mb-6 flex items-center ${colors[color]}`}>
      {loading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-3" />}
      <p className="text-sm font-medium">{message}</p>
    </div>
  );
};

export default Results;
