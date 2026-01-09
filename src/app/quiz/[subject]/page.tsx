"use client";

import { useEffect, useState, FC } from "react";
import { usePoints } from "@/app/context/PointsContext";
import QuestionTimer from "@/components/QuestionTimer";
import Results from "@/components/Results";
import { motion, AnimatePresence } from "framer-motion";

// 1. Define the Interface for a Single Question
interface Question {
  question: string;
  options: string[];
  answer: string;
}

// 2. Define Props for the Page/Component
interface QuizProps {
  params: {
    subject: string;
  };
  // Add these props to connect with the registration data
  examCode?: string;
  selectedStudent?: any;
  selectedSchool?: any;
  selectedGrade?: string;
  selectedProvinceId?: string;
  selectedStream?: "science" | "social";
}

const Quiz: FC<QuizProps> = ({ 
  params, 
  examCode,
  selectedStudent,
  selectedSchool,
  selectedGrade,
  selectedProvinceId,
  selectedStream
}) => {
  const { subject } = params;
  const { points, setPoints } = usePoints();

  // State with explicit types
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
  const [showExplanation, setShowExplanation] = useState<boolean>(false);
  const [resultsSaved, setResultsSaved] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("/data/questions.json");
        console.log("Fetch Status:", response.status);

        if (response.ok) {
          const data = await response.json();
          console.log("JSON Data:", data);

          let subjectData;
          
          // For grades 11 and 12, we need to match both subject name and grade
          if (selectedGrade === "11" || selectedGrade === "12") {
            subjectData = data.subjects?.find(
              (s: any) => s.name === subject && s.grade === selectedGrade
            );
          } else {
            // For grades 7-10, we just match the subject name
            subjectData = data.subjects?.find(
              (s: any) => s.name === subject
            );
          }
          
          if (subjectData) {
            setQuestions(subjectData.questions);
          } else {
            console.error("Subject not found in JSON:", subject, "Grade:", selectedGrade);
          }
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };
    fetchQuestions();
  }, [subject, selectedGrade]);

  // Function to submit quiz results to the server
  const submitQuizResults = async () => {
    if (!examCode || !selectedStudent) {
      setSubmitError("Missing exam code or student information");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const quizResults = {
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
        timestamp: new Date().toISOString()
      };

      // Try to submit results to your API, but don't fail if it doesn't work
      try {
        const response = await fetch('/api/quiz/results', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(quizResults),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('Quiz results submitted successfully:', result);
          setResultsSaved(true);
        } else {
          console.warn('API endpoint returned error, but continuing with results display');
          setResultsSaved(false);
        }
      } catch (apiError) {
        console.warn('API endpoint not available, but continuing with results display:', apiError);
        setResultsSaved(false);
      }
    } catch (error) {
      console.error('Error preparing quiz results:', error);
      setSubmitError('Failed to prepare quiz results.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Early return or loading state if questions aren't loaded yet
  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-xl text-indigo-800 font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswer = (option: string) => {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);
    setShowExplanation(true);

    // Track time spent
    setTotalTimeSpent((prev) => prev + timePerQuestion);

    if (option === currentQuestion.answer) {
      setPoints((prevPoints) => prevPoints + 4);
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    const nextQuestion = currentQuestionIndex + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestionIndex(nextQuestion);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowExplanation(false);
      setTimePerQuestion(0);
    } else {
      // Submit quiz results when showing results
      submitQuizResults().then(() => {
        setShowResults(true);
      });
    }
  };

  const handleTimeUp = () => {
    if (isAnswered) return; // Prevent double trigger
    setIsAnswered(true);
    setShowExplanation(true);
    setUnattemptedQuestions((prev) => prev + 1);
    setTotalTimeSpent((prev) => prev + 10);
    handleNext();
  };

  // Calculations
  const percentage = Math.round((correctAnswers / questions.length) * 100);
  const averageTimePerQuestion = (totalTimeSpent / questions.length).toFixed(2);

  // Subject color scheme
  const getSubjectColor = () => {
    switch(subject?.toLowerCase()) {
      case 'math':
      case 'គណិតវិទ្យា':
        return { primary: 'bg-blue-500', secondary: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' };
      case 'science':
      case 'រូបវិទ្យា':
      case 'គីមីវិទ្យា':
      case 'ជីវវិទ្យា':
        return { primary: 'bg-green-500', secondary: 'bg-green-100', text: 'text-green-600', border: 'border-green-500' };
      case 'history':
      case 'ប្រវត្តិវិទ្យា':
        return { primary: 'bg-amber-500', secondary: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-500' };
      case 'english':
      case 'អង់គ្លេស':
        return { primary: 'bg-purple-500', secondary: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500' };
      default:
        return { primary: 'bg-indigo-500', secondary: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-500' };
    }
  };

  const colors = getSubjectColor();

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
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              >
                {((currentQuestionIndex + 1) / questions.length) * 100 > 10 && `${currentQuestionIndex + 1}/${questions.length}`}
              </div>
              <div className="bg-gray-200 flex-1 flex items-center justify-center text-gray-600 text-sm font-medium">
                {((currentQuestionIndex + 1) / questions.length) * 100 <= 10 && `${currentQuestionIndex + 1}/${questions.length}`}
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
                <p className="text-gray-700">{selectedSchool?.name} - Grade {selectedGrade}</p>
                {(selectedGrade === "11" || selectedGrade === "12") && (
                  <p className="text-gray-700">
                    {selectedStream === "science" ? "ថ្នាក់វិទ្យាសាស្រ្ដ" : "ថ្នាក់វិទ្យាសាស្រ្ដសង្គម"}
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
              <h2 className="text-2xl font-bold mb-2">Question {currentQuestionIndex + 1}</h2>
              <div className="flex items-center gap-2">
                <div className="w-full bg-white bg-opacity-30 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500"
                    style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium whitespace-nowrap">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
            </div>
            
            <div className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold mb-6 text-gray-800">
                {currentQuestion?.question}
              </h3>

              {/* Timer */}
              <div className="mb-6">
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
                  {currentQuestion?.options.map((option, index) => {
                    const isCorrect = option === currentQuestion.answer;
                    const isSelected = option === selectedOption;
                    
                    // Determine button styles
                    let btnClass = "p-4 rounded-xl font-medium text-lg transition-all duration-300 border-2 relative flex justify-between items-center w-full text-left ";
                    
  

                    return (
                      <motion.button
                        key={option}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        onClick={() => handleAnswer(option)}
                        disabled={isAnswered}
                        className={btnClass}
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex-1">{option}</span>
                        </div>

                        {/* Icons Section */}
                        {isAnswered && (
                          <div className="flex-shrink-0 ml-2">
                            {isCorrect && 
                              <div className="p-1 rounded-full text-white shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                              </div>
                            }
                            {isSelected && !isCorrect && (
                              <div className="p-1 rounded-full  text-white shadow-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </AnimatePresence>

              {/* Explanation */}
             

              {/* Next Button */}
              <AnimatePresence>
                {isAnswered && (
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleNext}
                    className={`w-full py-4 px-6 ${colors.primary} text-white rounded-xl font-bold text-lg hover:opacity-90 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-opacity-50 focus:ring-blue-300`}
                  >
                    {currentQuestionIndex === questions.length - 1 ? "Submit Quiz" : "Next Question"}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      ) : (
        <Results
          score={points}
          totalQuestions={questions.length}
          correctAnswers={correctAnswers}
          wrongAnswers={wrongAnswers}
          unattemptedQuestions={unattemptedQuestions}
          percentage={percentage}
          timeSpent={totalTimeSpent}
          averageTimePerQuestion={averageTimePerQuestion}
          examCode={examCode}
          studentInfo={selectedStudent}
          submitError={submitError}
          isSubmitting={isSubmitting}
          resultsSaved={resultsSaved}
        />
      )}
    </div>
  );
};

export default Quiz;