"use client";

import { useEffect, useState } from "react";
import ImagePicker from "./ImagePicker";
import type { OptionKey, LocalOption } from "../page";

export type QuestionDraft = {
  questionText: string;
  questionImagePreview?: string | null;
  options: LocalOption[];
  correctAnswer: OptionKey;
  score: number;
};

export default function QuestionForm({
  mode,
  initialValue,
  onSubmit,
  onCancelEdit,
}: {
  mode: "create" | "edit";
  initialValue?: QuestionDraft;
  onSubmit: (draft: QuestionDraft) => void;
  onCancelEdit?: () => void;
}) {
  const [questionText, setQuestionText] = useState<string>(initialValue?.questionText ?? "");
  const [questionImagePreview, setQuestionImagePreview] = useState<string | null>(
    initialValue?.questionImagePreview ?? null
  );

  const [options, setOptions] = useState<LocalOption[]>(
    initialValue?.options ?? [
      { key: "A", text: "", imagePreview: null },
      { key: "B", text: "", imagePreview: null },
      { key: "C", text: "", imagePreview: null },
      { key: "D", text: "", imagePreview: null },
    ]
  );

  const [correctAnswer, setCorrectAnswer] = useState<OptionKey>(initialValue?.correctAnswer ?? "A");
  const [score, setScore] = useState<number>(Number(initialValue?.score ?? 1));

  useEffect(() => {
    if (!initialValue) return;
    setQuestionText(initialValue.questionText ?? "");
    setQuestionImagePreview(initialValue.questionImagePreview ?? null);
    setOptions(initialValue.options?.length ? initialValue.options : options);
    setCorrectAnswer(initialValue.correctAnswer ?? "A");
    setScore(Number(initialValue.score ?? 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  const setOptionText = (key: OptionKey, text: string) => {
    setOptions((prev) => prev.map((o) => (o.key === key ? { ...o, text } : o)));
  };

  const setOptionImage = (key: OptionKey, preview: string | null) => {
    setOptions((prev) => prev.map((o) => (o.key === key ? { ...o, imagePreview: preview } : o)));
  };

  const validate = () => {
    if (!questionText.trim() && !questionImagePreview) {
      alert("សូមបញ្ចូល Question Text ឬ Image");
      return false;
    }
    const filled = options.filter((o) => (o.text ?? "").trim() || o.imagePreview).length;
    if (filled < 2) {
      alert("សូមបញ្ចូល Option យ៉ាងតិច 2 (Text ឬ Image)");
      return false;
    }
    if ((Number(score) || 0) < 0) {
      alert("Score មិនអាចតិចជាង 0");
      return false;
    }
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      questionText,
      questionImagePreview,
      options,
      correctAnswer,
      score: Number(score) || 0,
    });
  };

  return (
    <div className="rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl p-5 md:p-6 dark:border-white/10 dark:bg-white/5">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="text-lg font-semibold text-slate-900 dark:text-white">
            {mode === "edit" ? "Edit Question" : "Create Question"}
          </div>
          <div className="text-xs text-slate-600 dark:text-white/60">
            * Option យ៉ាងតិច 2 • សម្រាប់បង្កើតសំណួរថ្មី
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-5">
        {/* Question */}
        <div className="rounded-3xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="text-sm font-semibold text-slate-900 dark:text-white">ប្រធានសំណួរ</div>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="បញ្ចូលប្រធានសំណួរ..."
            className="mt-2 w-full min-h-[120px] rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-black/10
                       dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-white/20"
          />

          <div className="mt-4">
            <ImagePicker
              label="Question Image (Optional)"
              previewUrl={questionImagePreview}
              onPick={(_, url) => setQuestionImagePreview(url ?? null)}
            />
          </div>
        </div>

        {/* Score + Correct */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-3xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Score</div>
            <input
              value={score}
              onChange={(e) => setScore(Number(e.target.value))}
              type="number"
              min={0}
              className="mt-2 w-full rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none
                         dark:border-white/10 dark:bg-white/10 dark:text-white"
            />
          </div>

          <div className="rounded-3xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="text-sm font-semibold text-slate-900 dark:text-white">Correct Answer</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["A", "B", "C", "D"] as OptionKey[]).map((k) => (
                <button
                  key={k}
                  type="button"
                  onClick={() => setCorrectAnswer(k)}
                  className={[
                    "rounded-2xl border px-4 py-2 text-sm font-semibold transition",
                    correctAnswer === k
                      ? "border-[#243A7A]/30 bg-[#243A7A] text-white"
                      : "border-black/10 bg-white/70 text-slate-800 hover:bg-white dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15",
                  ].join(" ")}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Options (4) */}
        <div className="rounded-3xl border border-black/10 bg-white/70 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">ជម្រើស (A-D)</div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {options.map((o) => (
              <div
                key={o.key}
                className="rounded-3xl border border-black/10 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-slate-900 dark:text-white">Option {o.key}</div>
                  <span className="text-xs text-slate-500 dark:text-white/50">Text + Image</span>
                </div>

                <input
                  value={o.text}
                  onChange={(e) => setOptionText(o.key, e.target.value)}
                  placeholder={`Option ${o.key} text...`}
                  className="mt-3 w-full rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-sm text-slate-900 outline-none
                             dark:border-white/10 dark:bg-white/10 dark:text-white"
                />

                <div className="mt-3">
                  <ImagePicker
                    label={`Option ${o.key} Image (Optional)`}
                    previewUrl={o.imagePreview ?? null}
                    onPick={(_, url) => setOptionImage(o.key, url ?? null)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ✅ Save button bottom */}
        <div className="sticky bottom-3 z-10">
          <div className="rounded-3xl border border-black/10 bg-white/90 backdrop-blur-xl p-3 dark:border-white/10 dark:bg-slate-900/70">
            <div className="flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
              <div className="text-xs text-slate-600 dark:text-white/60">
                ✅ បំពេញរួចហើយ ចុច “Save Question” ដើម្បីរក្សាទុក
              </div>

              <div className="flex gap-2 justify-end">
                {mode === "edit" && onCancelEdit ? (
                  <button
                    type="button"
                    className="rounded-2xl border border-black/10 bg-white/70 px-4 py-2 text-sm text-slate-800 hover:bg-white
                               dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                    onClick={onCancelEdit}
                  >
                    Cancel
                  </button>
                ) : null}

                <button
                  type="button"
                  className="rounded-2xl bg-[#243A7A] px-5 py-2.5 text-sm font-semibold text-white hover:opacity-95"
                  onClick={handleSubmit}
                >
                  💾 Save Question
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
