"use client";

import { motion } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Trophy, 
  RotateCcw,
  Download,
  AlertCircle
} from "lucide-react";

interface ResultsProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  unattemptedQuestions: number;
  percentage: number;
  timeSpent: number;
  averageTimePerQuestion: string;
  examCode?: string;
  studentInfo?: any;
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
  submitError,
  isSubmitting,
  resultsSaved
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getGradeColor = () => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    if (percentage >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getGradeMessage = () => {
    if (percentage >= 80) return "Excellent work!";
    if (percentage >= 60) return "Good job!";
    if (percentage >= 40) return "Keep practicing!";
    return "More practice needed.";
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleDownloadResults = () => {
    // Create a simple text representation of the results
    const resultsText = `
Exam Results
============
Exam Code: ${examCode}
Student: ${studentInfo?.fullName}
Date: ${new Date().toLocaleDateString()}

Score: ${score}/${totalQuestions * 4} (${percentage}%)
Correct Answers: ${correctAnswers}/${totalQuestions}
Wrong Answers: ${wrongAnswers}
Unattempted: ${unattemptedQuestions}

Time Spent: ${formatTime(timeSpent)}
Average Time per Question: ${averageTimePerQuestion} seconds
    `.trim();

    // Create a blob and download
    const blob = new Blob([resultsText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `exam-results-${examCode}-${studentInfo?.fullName || "student"}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 text-white">
          <h1 className="text-3xl font-bold mb-2">Quiz Results</h1>
          <p className="text-blue-100">Exam Code: {examCode}</p>
        </div>

        <div className="p-6 md:p-8">
          {/* Score Summary */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gray-100 mb-4">
              <Trophy className={`w-16 h-16 ${getGradeColor()}`} />
            </div>
            <h2 className={`text-4xl font-bold ${getGradeColor()} mb-2`}>
              {percentage}%
            </h2>
            <p className="text-xl text-gray-600">{getGradeMessage()}</p>
          </div>

          {/* Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                <h3 className="text-lg font-semibold">Correct Answers</h3>
              </div>
              <p className="text-3xl font-bold text-green-600">{correctAnswers}</p>
              <p className="text-gray-600">out of {totalQuestions} questions</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <XCircle className="w-8 h-8 text-red-500 mr-3" />
                <h3 className="text-lg font-semibold">Wrong Answers</h3>
              </div>
              <p className="text-3xl font-bold text-red-600">{wrongAnswers}</p>
              <p className="text-gray-600">out of {totalQuestions} questions</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <Clock className="w-8 h-8 text-blue-500 mr-3" />
                <h3 className="text-lg font-semibold">Time Spent</h3>
              </div>
              <p className="text-3xl font-bold text-blue-600">{formatTime(timeSpent)}</p>
              <p className="text-gray-600">Avg: {averageTimePerQuestion}s per question</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-8 h-8 text-amber-500 mr-3" />
                <h3 className="text-lg font-semibold">Unattempted</h3>
              </div>
              <p className="text-3xl font-bold text-amber-600">{unattemptedQuestions}</p>
              <p className="text-gray-600">out of {totalQuestions} questions</p>
            </div>
          </div>

          {/* Save Status */}
          {isSubmitting && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-700">Saving your results...</p>
            </div>
          )}

          {!isSubmitting && resultsSaved && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
              <p className="text-green-700">Your results have been saved successfully.</p>
            </div>
          )}

          {!isSubmitting && !resultsSaved && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-600 mr-3" />
              <p className="text-amber-700">Results could not be saved to the server, but you can download them below.</p>
            </div>
          )}

          {submitError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-3" />
              <p className="text-red-700">{submitError}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleRetry}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              Try Again
            </button>
            <button
              onClick={handleDownloadResults}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-6 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
            >
              <Download className="w-5 h-5" />
              Download Results
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Results;