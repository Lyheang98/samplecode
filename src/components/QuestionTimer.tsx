"use client";

import React, { useEffect, useState, Dispatch, SetStateAction } from "react";

/* ---------------- Timer Component ---------------- */

interface QuestionTimerProps {
  onTimeUp: () => void;
  setTimePerQuestion: Dispatch<SetStateAction<number>>;
  isAnswered: boolean; // if true => stop timer
  resetTimer: number | string;
}

const TOTAL_TIME = 60 * 60; // 60 minutes = 3600 seconds

export const QuestionTimer: React.FC<QuestionTimerProps> = ({
  onTimeUp,
  setTimePerQuestion,
  isAnswered,
  resetTimer,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(TOTAL_TIME);

  useEffect(() => {
    if (!isAnswered && secondsLeft > 0) {
      const timer = setTimeout(() => {
        setSecondsLeft((prev) => prev - 1);
        setTimePerQuestion(TOTAL_TIME - (secondsLeft - 1)); // time spent
      }, 1000);

      return () => clearTimeout(timer);
    }

    if (secondsLeft === 0 && !isAnswered) {
      onTimeUp();
    }
  }, [secondsLeft, isAnswered, onTimeUp, setTimePerQuestion]);

  useEffect(() => {
    setSecondsLeft(TOTAL_TIME);
  }, [resetTimer]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="text-lg font-mono">
      Time Left:{" "}
      <span className={secondsLeft <= 60 ? "text-red-500" : ""}>
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};

/* ---------------- Question UI Component ---------------- */

export type Option = { id: string; label: string };

interface QuestionProps {
  questionText: string;
  options?: Option[]; // optional => avoid undefined.map crash
  resetKey: number | string; // question index/id
  onSelect?: (optionId: string) => void; // send selection to parent if needed
}

export default function QuestionWithTimer({
  questionText,
  options = [],
  resetKey,
  onSelect,
}: QuestionProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timePerQuestion, setTimePerQuestion] = useState<number>(0);

  // Reset when new question loads
  useEffect(() => {
    setSelectedOption(null);
    setTimePerQuestion(0);
  }, [resetKey]);

  const onTimeUp = () => {
    // ✅ no correct/wrong message
    // you can auto-next question here if you want
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-gray-800">{questionText}</h2>

        <QuestionTimer
          onTimeUp={onTimeUp}
          setTimePerQuestion={setTimePerQuestion}
          isAnswered={false} // ✅ keep running; user can change option anytime
          resetTimer={resetKey}
        />
      </div>

      {/* ✅ OPTIONS (ONLY STYLE, NO CORRECT/WRONG) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.length === 0 ? (
          <div className="p-4 rounded-xl border border-gray-300 bg-white text-gray-600">
            No options available
          </div>
        ) : (
          options.map((opt, idx) => {
            const id = opt.id ?? String(idx);
            const label = opt.label ?? "";

            const isSelected = selectedOption === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setSelectedOption(id); // ✅ highlight only
                  onSelect?.(id); // optional callback
                }}
                className={[
                  "w-full flex items-center justify-between p-4 rounded-xl border transition font-semibold",
                  isSelected
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-50",
                ].join(" ")}
              >
                <span>{label}</span>

                {/* ✅ NO CHECK ICON, NO CORRECT/WRONG ICON */}
                <span className="text-xs opacity-70">
                  {String.fromCharCode(65 + idx)}
                </span>
              </button>
            );
          })
        )}
      </div>

      {/* optional debug */}
      <div className="text-sm text-gray-500">Time spent: {timePerQuestion}s</div>
    </div>
  );
}
