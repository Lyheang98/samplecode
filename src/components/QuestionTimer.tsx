"use client";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

interface QuestionTimerProps {
  onTimeUp: () => void;
  setTimePerQuestion: Dispatch<SetStateAction<number>>;
  isAnswered: boolean;
  resetTimer: number | string; // Typically the current question index
}

const QuestionTimer: React.FC<QuestionTimerProps> = ({
  onTimeUp,
  setTimePerQuestion,
  isAnswered,
  resetTimer,
}) => {
  const [seconds, setSeconds] = useState<number>(10); // 10 seconds for each question

  useEffect(() => {
    if (!isAnswered && seconds > 0) {
      const timer = setTimeout(() => {
        setSeconds((prev) => prev - 1);
        // Track time spent: Total duration (10) minus remaining seconds
        setTimePerQuestion(10 - (seconds - 1)); 
      }, 1000);
      return () => clearTimeout(timer);
    } else if (seconds === 0 && !isAnswered) {
      onTimeUp();
    }
  }, [seconds, isAnswered, onTimeUp, setTimePerQuestion]);

  // Reset the timer whenever a new question is loaded
  useEffect(() => {
    setSeconds(10); // Reset the timer to 10 seconds
  }, [resetTimer]);

  return (
    <div className="text-lg font-mono">
      Time Left: <span className={seconds <= 3 ? "text-red-500" : ""}>{seconds}s</span>
    </div>
  );
};

export default QuestionTimer;