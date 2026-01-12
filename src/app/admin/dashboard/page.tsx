"use client";

import { useEffect, useMemo, useState } from "react";
import FiltersBar, { FiltersValue, StreamType } from "./components/FiltersBar";
import QuestionForm, { QuestionDraft } from "./components/QuestionForm";
import QuestionTable from "./components/QuestionTable";

export type OptionKey = "A" | "B" | "C" | "D";

export type LocalOption = {
  key: OptionKey;
  text: string;
  imagePreview?: string | null;
};

export type LocalQuestion = {
  id: string;
  year: number;
  month: number;
  grade: number;
  stream?: StreamType;
  subject: string;

  questionText: string;
  questionImagePreview?: string | null;

  options: LocalOption[];
  correctAnswer: OptionKey;
  score: number;

  createdAt: number;
};

const LS_QUESTIONS_KEY = "qb.questions.v2";
const LS_FILTERS_KEY = "qb.filters.v2";
const LS_THEME_KEY = "qb.theme.v1";

type ThemeMode = "dark" | "light";

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function uid() {
  return Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
}

function downloadJSON(filename: string, data: unknown) {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();

  URL.revokeObjectURL(url);
}

export default function Page() {
  const years = useMemo(() => [2024, 2025, 2026], []);
  const months = useMemo(() => Array.from({ length: 12 }, (_, i) => i + 1), []);
  const grades = useMemo(() => [7, 8, 9, 10, 11, 12], []);

  // 10 subjects example list (បងអាចកែតាមតម្រូវការ)
  const SUBJECTS_SCI = useMemo(
    () => ["គណិតវិទ្យា", "រូបវិទ្យា", "គីមីវិទ្យា", "ជីវវិទ្យា", "ភាសាអង់គ្លេស"],
    []
  );
  const SUBJECTS_SOC = useMemo(
    () => ["ភាសាខ្មែរ", "ប្រវត្តិវិទ្យា", "ភូមិសាស្ត្រ", "សីលធម៌-ពលរដ្ឋ", "ផែនការអាជីវកម្ម"],
    []
  );
  const SUBJECTS_GENERAL = useMemo(
    () => [
      "ភាសាខ្មែរ",
      "គណិតវិទ្យា",
      "រូបវិទ្យា",
      "គីមីវិទ្យា",
      "ជីវវិទ្យា",
      "ប្រវត្តិវិទ្យា",
      "ភូមិសាស្ត្រ",
      "សីលធម៌-ពលរដ្ឋ",
      "ភាសាអង់គ្លេស",
      "កីឡា/សុខភាព",
    ],
    []
  );

  // ✅ IMPORTANT: hooks must be inside component
  const [filters, setFilters] = useState<FiltersValue>({
    year: "all",
    month: "all",
    grade: "all",
    stream: "all",
    subject: "all",
  });

  const [questions, setQuestions] = useState<LocalQuestion[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [theme, setTheme] = useState<ThemeMode>("light");

  // ✅ subjects list attachSubjects (handle "all")
  const attachSubjects = useMemo(() => {
    if (filters.grade === "all") return SUBJECTS_GENERAL;

    const is1112 = filters.grade === 11 || filters.grade === 12;
    if (!is1112) return SUBJECTS_GENERAL;

    // if stream is all, default sci list for dropdown
    const stream = filters.stream === "all" ? "sci" : filters.stream;
    return stream === "soc" ? SUBJECTS_SOC : SUBJECTS_SCI;
  }, [filters.grade, filters.stream, SUBJECTS_GENERAL, SUBJECTS_SCI, SUBJECTS_SOC]);

  // ✅ update subject if not exists (but allow "all")
  useEffect(() => {
    if (filters.subject === "all") return;
    if (!attachSubjects.includes(filters.subject)) {
      setFilters((p) => ({ ...p, subject: attachSubjects[0] ?? "all" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.grade, filters.stream]);

  const editingItem = useMemo(
    () => (editingId ? questions.find((q) => q.id === editingId) ?? null : null),
    [editingId, questions]
  );

  // ✅ filtered (handle "all")
  const filtered = useMemo(() => {
    return questions.filter((q) => {
      if (filters.year !== "all" && q.year !== filters.year) return false;
      if (filters.month !== "all" && q.month !== filters.month) return false;
      if (filters.grade !== "all" && q.grade !== filters.grade) return false;
      if (filters.subject !== "all" && q.subject !== filters.subject) return false;

      // stream filter (only if selected)
      if (filters.stream !== "all") {
        if (q.stream !== filters.stream) return false;
      }

      return true;
    });
  }, [questions, filters]);

  // Load localStorage
  useEffect(() => {
    const savedQ = safeParseJSON<LocalQuestion[]>(localStorage.getItem(LS_QUESTIONS_KEY));
    if (savedQ?.length) setQuestions(savedQ);

    const savedF = safeParseJSON<FiltersValue>(localStorage.getItem(LS_FILTERS_KEY));
    if (savedF) setFilters(savedF);

    const savedTheme = localStorage.getItem(LS_THEME_KEY) as ThemeMode | null;
    if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
  }, []);

  // Persist
  useEffect(() => {
    localStorage.setItem(LS_QUESTIONS_KEY, JSON.stringify(questions));
  }, [questions]);

  useEffect(() => {
    localStorage.setItem(LS_FILTERS_KEY, JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem(LS_THEME_KEY, theme);
  }, [theme]);

  // Create / Update / Delete
  const handleCreate = (draft: QuestionDraft) => {
    const streamValue =
      filters.grade === 11 || filters.grade === 12
        ? filters.stream === "all"
          ? "sci"
          : filters.stream
        : undefined;

    const item: LocalQuestion = {
      id: uid(),
      year: filters.year === "all" ? years[0] : filters.year,
      month: filters.month === "all" ? months[0] : filters.month,
      grade: filters.grade === "all" ? grades[0] : filters.grade,
      stream: streamValue,
      subject: filters.subject === "all" ? attachSubjects[0] ?? "Unknown" : filters.subject,
      questionText: draft.questionText,
      questionImagePreview: draft.questionImagePreview,
      options: draft.options,
      correctAnswer: draft.correctAnswer,
      score: draft.score,
      createdAt: Date.now(),
    };

    setQuestions((prev) => [item, ...prev]);
    setEditingId(null);
  };

  const handleUpdate = (draft: QuestionDraft) => {
    if (!editingId) return;
    setQuestions((prev) =>
      prev.map((q) =>
        q.id !== editingId
          ? q
          : {
              ...q,
              questionText: draft.questionText,
              questionImagePreview: draft.questionImagePreview,
              options: draft.options,
              correctAnswer: draft.correctAnswer,
              score: draft.score,
            }
      )
    );
    setEditingId(null);
  };

  const handleDelete = (id: string) => {
    const ok = window.confirm("តើបងចង់លុបសំណួរនេះមែនទេ?");
    if (!ok) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (editingId === id) setEditingId(null);
  };

  // Download JSON
  const handleDownloadAll = () => {
    const filename = `questions_all_${new Date().toISOString().slice(0, 10)}.json`;
    downloadJSON(filename, questions);
  };

  const handleDownloadFiltered = () => {
    const filename = `questions_filtered_${new Date().toISOString().slice(0, 10)}.json`;
    downloadJSON(filename, filtered);
  };

  return (
    <div
      className={[
        "min-h-screen w-full",
        "bg-gradient-to-br from-[#243A7A]/10 via-white to-sky-50",
        "dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950",
      ].join(" ")}
    >
      <div className="pointer-events-none fixed inset-0 overflow-hidden block dark:hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#243A7A]/15 blur-3xl" />
        <div className="absolute top-1/3 -right-24 h-72 w-72 rounded-full bg-sky-400/15 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-[#243A7A]/10 blur-3xl" />
      </div>

      <div className="relative w-full px-4 py-6 md:px-8 md:py-10 space-y-6">
        {/* Header */}
        <div className="rounded-3xl border border-[#243A7A]/15 bg-white/80 backdrop-blur-xl p-5 md:p-6 dark:border-white/10 dark:bg-white/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-semibold text-[#243A7A] dark:text-white">
                Question Dashboard
              </h1>
              <p className="text-sm text-[#243A7A]/80 dark:text-white/70">
                ប្រព័ន្ធគ្រប់គ្រងសំណួរ MoEYS EdTech
              </p>
            </div>

            <div className="flex flex-wrap gap-2 items-center">
              <div className="rounded-2xl border border-[#243A7A]/15 bg-white/70 px-4 py-2 text-sm text-[#243A7A]/90 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                Total saved:{" "}
                <span className="font-semibold text-[#243A7A] dark:text-white">{questions.length}</span>
              </div>

              <div className="rounded-2xl border border-[#243A7A]/15 bg-white/70 px-4 py-2 text-sm text-[#243A7A]/90 dark:border-white/10 dark:bg-white/5 dark:text-white/80">
                Showing:{" "}
                <span className="font-semibold text-[#243A7A] dark:text-white">{filtered.length}</span>
              </div>

              <button
                type="button"
                className="rounded-2xl border border-[#243A7A]/20 bg-white/70 px-4 py-2 text-sm font-semibold text-[#243A7A] hover:bg-white
                           dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                onClick={handleDownloadFiltered}
              >
                ⬇️ Download Filtered JSON
              </button>

              <button
                type="button"
                className="rounded-2xl border border-[#243A7A]/20 bg-[#243A7A]/10 px-4 py-2 text-sm font-semibold text-[#243A7A] hover:bg-[#243A7A]/15
                           dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                onClick={handleDownloadAll}
              >
                ⬇️ Download All JSON
              </button>

              <button
                type="button"
                className="rounded-2xl border border-[#243A7A]/20 bg-[#243A7A]/10 px-4 py-2 text-sm text-[#243A7A] hover:bg-[#243A7A]/15
                           dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
              >
                {theme === "dark" ? "🌙 Night" : "☀️ Light"}
              </button>

              <button
                type="button"
                className="rounded-2xl bg-[#243A7A] px-4 py-2 text-sm font-semibold text-white hover:opacity-95"
                onClick={() => setEditingId(null)}
              >
                New Question
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-5">
            <FiltersBar
              value={filters}
              years={years}
              months={months}
              grades={grades}
              subjects={attachSubjects}
              onChange={setFilters}
            />
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 xl:grid-cols-6 gap-6 items-start">
          <div className="xl:col-span-4">
            <QuestionForm
              mode={editingItem ? "edit" : "create"}
              initialValue={
                editingItem
                  ? {
                      questionText: editingItem.questionText,
                      questionImagePreview: editingItem.questionImagePreview ?? null,
                      options: editingItem.options,
                      correctAnswer: editingItem.correctAnswer,
                      score: editingItem.score,
                    }
                  : undefined
              }
              onSubmit={(draft) => (editingItem ? handleUpdate(draft) : handleCreate(draft))}
              onCancelEdit={() => setEditingId(null)}
            />
          </div>

          <div className="xl:col-span-2 space-y-4">
            <QuestionTable items={filtered} onEdit={(q) => setEditingId(q.id)} onDelete={handleDelete} />
          </div>
        </div>

        <div className="pb-10 text-center text-xs text-slate-500 dark:text-white/50">
          <em>MoEYS EdTech © 2024. All rights reserved.</em>
        </div>
      </div>
    </div>
  );
}
