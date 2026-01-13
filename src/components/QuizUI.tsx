"use client";

import { useEffect, useState, FC } from "react";
import Image from "next/image";
import { usePoints } from "@/app/context/PointsContext";
import QuestionTimer from "@/components/QuestionTimer";
import Results from "@/components/Results";
import { motion, AnimatePresence } from "framer-motion";

// Types remain the same...
interface Option {
  id: string;
  text: string;
  image?: string | null;
  isCorrect: boolean;
}

interface Question {
  id: string;
  text: string;
  image?: string | null;
  score: number;
  options: Option[];
}

interface ExamData {
  id: string;
  year: number;
  month: number;
  grade: number;
  subject: string;
  createdAt: string;
  questions: Question[];
}

interface QuizProps {
  params: {
    subject: string;
  };
  examFilePath?: string;
  examCode?: string;
  selectedStudent?: any;
  selectedSchool?: any;
  selectedGrade?: string;
  selectedProvinceId?: string;
  selectedStream?: "science" | "social";
}

type FinalResults = {
  score: number;
  percentage: number;
  timeSpent: number;
  averageTimePerQuestion: string;
  correct: number;
  wrong: number;
  unattempted: number;
};

const Quiz: FC<QuizProps> = ({
  params,
  examFilePath,
  examCode,
  selectedStudent,
  selectedSchool,
  selectedGrade,
  selectedProvinceId,
  selectedStream,
}) => {
  const { subject } = params;
  const { points, setPoints } = usePoints();

  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showResults, setShowResults] = useState<boolean>(false);
  const [correctAnswers, setCorrectAnswers] = useState<number>(0);
  const [wrongAnswers, setWrongAnswers] = useState<number>(0);
  const [unattemptedQuestions, setUnattemptedQuestions] = useState<number>(0);
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [resultsSaved, setResultsSaved] = useState<boolean>(false);
  const [finalResults, setFinalResults] = useState<FinalResults | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const pointsPerQuestion = 4;

  /* ---------------- Fetch questions ---------------- */

  useEffect(() => {
    const fetchExamData = async () => {
      if (!examFilePath) {
        console.error("[QuizUI] Exam file path is missing.");
        setIsLoading(false);
        return;
      }

      console.log(`[QuizUI] Attempting to fetch from path: "${examFilePath}"`);

      try {
        const response = await fetch(examFilePath);
        
        // This is the critical check. It will tell us WHY it failed.
        if (!response.ok) {
          console.error(`[QuizUI] Fetch failed! Status: ${response.status}. StatusText: ${response.statusText}. URL: ${examFilePath}`);
          // We will NOT throw an error here, just log it and set questions to empty
          // This prevents the page from crashing and shows a proper error message
          setQuestions([]);
          setIsLoading(false);
          return;
        }

        const examData: ExamData = await response.json();
        
        if (examData && examData.questions) {
          setQuestions(examData.questions);
        } else {
          console.error("[QuizUI] Invalid exam data structure:", examData);
          setQuestions([]);
        }
      } catch (error) {
        console.error("[QuizUI] A network or parsing error occurred:", error);
        setQuestions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamData();
  }, [examFilePath]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-xl text-indigo-800 font-medium">
            Loading questions...
          </p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="text-center">
          <p className="text-xl text-red-600 font-medium">
            Failed to load questions. The file may not exist at the expected path.
          </p>
          <p className="mt-2 text-sm text-red-500">
            Check the browser console for more details.
          </p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const getCorrectAnswer = (question: Question): string => {
    const correctOption = question.options.find(opt => opt.isCorrect);
    return correctOption ? correctOption.text : "";
  };

  const getSubjectColor = () => {
    switch (subject?.toLowerCase()) {
      case "math":
      case "គណិតវិទ្យា":
        return {
          primary: "bg-blue-500",
          secondary: "bg-blue-100",
          border: "border-blue-500",
        };
      case "science":
      case "រូបវិទ្យា":
      case "គីមីវិទ្យា":
      case "ជីវវិទ្យា":
        return {
          primary: "bg-green-500",
          secondary: "bg-green-100",
          border: "border-green-500",
        };
      case "history":
      case "ប្រវត្តិវិទ្យា":
        return {
          primary: "bg-amber-500",
          secondary: "bg-amber-100",
          border: "border-amber-500",
        };
      case "english":
      case "អង់គ្លេស":
        return {
          primary: "bg-purple-500",
          secondary: "bg-purple-100",
          border: "border-purple-500",
        };
      default:
        return {
          primary: "bg-indigo-500",
          secondary: "bg-indigo-100",
          border: "border-indigo-500",
        };
    }
  };

  const colors = getSubjectColor();

  const handleSelectOption = (optionText: string) => {
    setSelectedOption(optionText);
    setIsAnswered(true);
  };

  const submitQuizResults = async (payload?: any) => {
    if (!examCode || !selectedStudent) {
      setSubmitError("Missing exam code or student information");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const quizResults =
        payload ??
        ({
          examCode,
          studentId: selectedStudent.student_ID,
          studentName: selectedStudent.fullName,
          schoolId: selectedSchool?.id,
          schoolName: selectedSchool?.name,
          grade: selectedGrade,
          stream: selectedStream,
          provinceId: selectedProvinceId,
          subject,
          score: points,
          totalQuestions: questions.length,
          correctAnswers,
          wrongAnswers,
          unattemptedQuestions,
          percentage: Math.round((correctAnswers / questions.length) * 100),
          timeSpent: totalTimeSpent,
          averageTimePerQuestion: (totalTimeSpent / questions.length).toFixed(2),
          timestamp: new Date().toISOString(),
        } as any);

      try {
        const response = await fetch("/api/quiz/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(quizResults),
        });

        if (response.ok) {
          await response.json();
          setResultsSaved(true);
        } else {
          setResultsSaved(false);
        }
      } catch {
        setResultsSaved(false);
      }
    } catch (error) {
      console.error("Error preparing quiz results:", error);
      setSubmitError("Failed to prepare quiz results.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const finalizeAndSubmit = async (args: {
    nextPoints: number;
    nextCorrect: number;
    nextWrong: number;
    nextUnattempted: number;
    nextTime: number;
  }) => {
    const { nextPoints, nextCorrect, nextWrong, nextUnattempted, nextTime } = args;

    const pct = Math.round((nextCorrect / questions.length) * 100);
    const avg = (nextTime / questions.length).toFixed(2);

    const snapshot: FinalResults = {
      score: nextPoints,
      percentage: pct,
      timeSpent: nextTime,
      averageTimePerQuestion: avg,
      correct: nextCorrect,
      wrong: nextWrong,
      unattempted: nextUnattempted,
    };

    setFinalResults(snapshot);

    const payload = {
      examCode,
      studentId: selectedStudent?.student_ID,
      studentName: selectedStudent?.fullName,
      schoolId: selectedSchool?.id,
      schoolName: selectedSchool?.name,
      grade: selectedGrade,
      stream: selectedStream,
      provinceId: selectedProvinceId,
      subject,

      score: snapshot.score,
      totalQuestions: questions.length,
      correctAnswers: snapshot.correct,
      wrongAnswers: snapshot.wrong,
      unattemptedQuestions: snapshot.unattempted,
      percentage: snapshot.percentage,
      timeSpent: snapshot.timeSpent,
      averageTimePerQuestion: snapshot.averageTimePerQuestion,
      timestamp: new Date().toISOString(),
    };

    await submitQuizResults(payload);
    setShowResults(true);
  };

  const handleNext = () => {
    const nextTime = totalTimeSpent + timePerQuestion;

    let nextCorrect = correctAnswers;
    let nextWrong = wrongAnswers;
    let nextUnattempted = unattemptedQuestions;
    let nextPoints = points;

    if (selectedOption) {
      const correctAnswer = getCorrectAnswer(currentQuestion);
      if (selectedOption === correctAnswer) {
        nextPoints += pointsPerQuestion;
        nextCorrect += 1;

        setPoints((prev) => prev + pointsPerQuestion);
        setCorrectAnswers((prev) => prev + 1);
      } else {
        nextWrong += 1;
        setWrongAnswers((prev) => prev + 1);
      }
    } else {
      nextUnattempted += 1;
      setUnattemptedQuestions((prev) => prev + 1);
    }

    setTotalTimeSpent(nextTime);

    const nextQuestion = currentQuestionIndex + 1;

    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimePerQuestion(0);
      return;
    }

    finalizeAndSubmit({
      nextPoints,
      nextCorrect,
      nextWrong,
      nextUnattempted,
      nextTime,
    });
  };

  const handleTimeUp = () => {
    if (isAnswered) return;

    const nextTime = totalTimeSpent + timePerQuestion;
    const nextUnattempted = unattemptedQuestions + 1;

    setUnattemptedQuestions((prev) => prev + 1);
    setTotalTimeSpent(nextTime);

    const nextQuestion = currentQuestionIndex + 1;

    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimePerQuestion(0);
      return;
    }

    finalizeAndSubmit({
      nextPoints: points,
      nextCorrect: correctAnswers,
      nextWrong: wrongAnswers,
      nextUnattempted,
      nextTime,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      {!showResults ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {/* Progress Bar */}
          <div className="mb-6 bg-white rounded-full shadow-md overflow-hidden">
            <div className="flex h-8">
              <div
                className={`${colors.primary} transition-all duration-500 flex items-center justify-center text-white text-sm font-medium`}
                style={{
                  width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                }}
              >
                {((currentQuestionIndex + 1) / questions.length) * 100 > 10 &&
                  `${currentQuestionIndex + 1}/${questions.length}`}
              </div>
              <div className="bg-gray-200 flex-1 flex items-center justify-center text-gray-600 text-sm font-medium">
                {((currentQuestionIndex + 1) / questions.length) * 100 <= 10 &&
                  `${currentQuestionIndex + 1}/${questions.length}`}
              </div>
            </div>
          </div>

          {/* Student Info Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={`${colors.secondary} rounded-xl p-4 mb-6 shadow-md`}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <p className="font-bold text-lg">{selectedStudent?.fullName}</p>
                <p className="text-gray-700">
                  {selectedSchool?.name} - Grade {selectedGrade}
                </p>
                {(selectedGrade === "11" || selectedGrade === "12") && (
                  <p className="text-gray-700">
                    {selectedStream === "science"
                      ? "ថ្នាក់វិទ្យាសាស្រ្ដ"
                      : "ថ្នាក់វិទ្យាសាស្រ្ដសង្គម"}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">Exam Code: {examCode}</p>
                <p className="text-gray-700 capitalize">{subject}</p>
              </div>
            </div>
          </motion.div>

          {/* Question Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className={`${colors.primary} p-6 text-white`}>
              <h2 className="text-2xl font-bold mb-2">
                Question {currentQuestionIndex + 1}
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium whitespace-nowrap">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-4 text-gray-800">
                {currentQuestion?.text}
              </h3>

              {/* Question Image */}
              {currentQuestion?.image && (
                <div className="mb-6">
                  <Image
                    src={currentQuestion.image}
                    alt="question"
                    width={1000}
                    height={500}
                    className="w-full max-h-[360px] object-contain rounded-xl border bg-white"
                    priority
                  />
                </div>
              )}

              {/* Timer */}
              <div className="mb-6 flex justify-end">
                <QuestionTimer
                  onTimeUp={handleTimeUp}
                  setTimePerQuestion={setTimePerQuestion}
                  isAnswered={isAnswered}
                  resetTimer={currentQuestionIndex}
                />
              </div>

              {/* Options */}
              <AnimatePresence>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {currentQuestion?.options.map((opt, index) => {
                    const optionText = opt.text;
                    const isSelected = selectedOption === optionText;

                    return (
                      <motion.button
                        key={opt.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.25, delay: index * 0.04 }}
                        onClick={() => handleSelectOption(optionText)}
                        className={`p-4 rounded-xl font-medium text-lg transition-all duration-300 focus:outline-none border-2 ${
                          isSelected
                            ? `${colors.secondary} ${colors.border} text-gray-900`
                            : "bg-gray-50 border-gray-200 hover:border-gray-300 hover:bg-gray-100"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold">
                            {String.fromCharCode(65 + index)}
                          </span>

                          <div className="flex-1 text-left">
                            <div className="font-semibold">{optionText}</div>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </AnimatePresence>

              {/* Next Button */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleNext}
                    className={`w-full py-4 px-6 ${colors.primary} text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50`}
                  >
                    {currentQuestionIndex === questions.length - 1
                      ? "Submit Quiz"
                      : "Next Question"}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <Results
          score={finalResults?.score ?? points}
          totalQuestions={questions.length}
          correctAnswers={finalResults?.correct ?? correctAnswers}
          wrongAnswers={finalResults?.wrong ?? wrongAnswers}
          unattemptedQuestions={finalResults?.unattempted ?? unattemptedQuestions}
          percentage={
            finalResults?.percentage ??
            Math.round((correctAnswers / questions.length) * 100)
          }
          timeSpent={finalResults?.timeSpent ?? totalTimeSpent}
          averageTimePerQuestion={
            finalResults?.averageTimePerQuestion ??
            (totalTimeSpent / questions.length).toFixed(2)
          }
          examCode={examCode}
          studentInfo={selectedStudent}
          schoolName={selectedSchool?.name}
          grade={selectedGrade}
          subjectName={subject}
          submitError={submitError}
          isSubmitting={isSubmitting}
          resultsSaved={resultsSaved}
        />
      )}
    </div>
  );
};

export default Quiz;