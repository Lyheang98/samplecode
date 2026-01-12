"use client";

import { useMemo, useState } from "react";
import type { LocalQuestion, OptionKey } from "../page";

export default function QuestionTable({
  items,
  onEdit,
  onDelete,
}: {
  items: LocalQuestion[];
  onEdit: (item: LocalQuestion) => void;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState<{ title: string; url: string } | null>(null);

  const totalPoints = useMemo(() => {
    return items.reduce((sum, q) => sum + (Number(q.score) || 0), 0);
  }, [items]);

  return (
    <div className="rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl overflow-hidden dark:border-white/10 dark:bg-white/5 shadow-sm">
      <div className="p-4 md:p-5 flex items-start justify-between gap-3">
        <div>
          <div className="text-lg font-semibold text-slate-900 dark:text-white">Question List (Row)</div>
          <div className="text-sm text-slate-600 dark:text-white/60">
            In this filter: <b>{items.length}</b> • Points: <b>{totalPoints}</b>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-[1100px] w-full text-sm">
          <thead className="bg-black/[0.03] dark:bg-white/[0.06] border-b border-black/10 dark:border-white/10">
            <tr className="text-left text-slate-700 dark:text-white/70">
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Question</th>
              <th className="px-4 py-3">Q Img</th>
              <th className="px-4 py-3">A</th>
              <th className="px-4 py-3">B</th>
              <th className="px-4 py-3">C</th>
              <th className="px-4 py-3">D</th>
              <th className="px-4 py-3">Correct</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/10 dark:divide-white/10">
            {items.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-10 text-center text-slate-600 dark:text-white/60">
                  No questions for current filters.
                </td>
              </tr>
            ) : (
              items.map((q, idx) => {
                const getOpt = (k: OptionKey) => q.options?.find((o) => o.key === k);
                const A = getOpt("A");
                const B = getOpt("B");
                const C = getOpt("C");
                const D = getOpt("D");

                return (
                  <tr key={q.id} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.05]">
                    <td className="px-4 py-3 text-slate-700 dark:text-white/80">{idx + 1}</td>

                    <td className="px-4 py-3">
                      <div className="max-w-[280px] truncate text-slate-900 dark:text-white">
                        {q.questionText || "—"}
                      </div>
                      <div className="mt-1 text-[11px] text-slate-500 dark:text-white/50">
                        Grade {q.grade} {q.stream ? `• ${q.stream === "sci" ? "វិទ្យាសាស្រ្ត" : "សង្គម"}` : ""} • {q.subject}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      {q.questionImagePreview ? (
                        <button
                          type="button"
                          className="rounded-2xl border border-black/10 bg-white/70 px-2.5 py-1 text-xs text-slate-700 hover:bg-white
                                     dark:border-white/10 dark:bg-white/10 dark:text-white/80 dark:hover:bg-white/15"
                          onClick={() => setOpen({ title: "Question Image", url: q.questionImagePreview! })}
                        >
                          View
                        </button>
                      ) : (
                        <span className="text-xs text-slate-500 dark:text-white/50">—</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="max-w-[160px] truncate text-slate-900 dark:text-white">{A?.text || "—"}</div>
                      {A?.imagePreview ? (
                        <button
                          type="button"
                          className="mt-1 text-[11px] underline text-slate-600 dark:text-white/70"
                          onClick={() => setOpen({ title: "Option A Image", url: A.imagePreview! })}
                        >
                          image
                        </button>
                      ) : null}
                    </td>

                    <td className="px-4 py-3">
                      <div className="max-w-[160px] truncate text-slate-900 dark:text-white">{B?.text || "—"}</div>
                      {B?.imagePreview ? (
                        <button
                          type="button"
                          className="mt-1 text-[11px] underline text-slate-600 dark:text-white/70"
                          onClick={() => setOpen({ title: "Option B Image", url: B.imagePreview! })}
                        >
                          image
                        </button>
                      ) : null}
                    </td>

                    <td className="px-4 py-3">
                      <div className="max-w-[160px] truncate text-slate-900 dark:text-white">{C?.text || "—"}</div>
                      {C?.imagePreview ? (
                        <button
                          type="button"
                          className="mt-1 text-[11px] underline text-slate-600 dark:text-white/70"
                          onClick={() => setOpen({ title: "Option C Image", url: C.imagePreview! })}
                        >
                          image
                        </button>
                      ) : null}
                    </td>

                    <td className="px-4 py-3">
                      <div className="max-w-[160px] truncate text-slate-900 dark:text-white">{D?.text || "—"}</div>
                      {D?.imagePreview ? (
                        <button
                          type="button"
                          className="mt-1 text-[11px] underline text-slate-600 dark:text-white/70"
                          onClick={() => setOpen({ title: "Option D Image", url: D.imagePreview! })}
                        >
                          image
                        </button>
                      ) : null}
                    </td>

                    <td className="px-4 py-3">
                      <span className="inline-flex items-center rounded-2xl border border-emerald-300/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-800 dark:text-emerald-100">
                        {q.correctAnswer}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-900 dark:text-white">{q.score}</td>

                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-xs text-slate-800 hover:bg-white
                                     dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                          onClick={() => onEdit(q)}
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="rounded-2xl border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 hover:bg-rose-500/15
                                     dark:border-rose-300/20 dark:bg-rose-500/20 dark:text-rose-100 dark:hover:bg-rose-500/25"
                          onClick={() => onDelete(q.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Image Modal */}
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setOpen(null)}>
          <div
            className="w-full max-w-4xl rounded-3xl border border-black/10 bg-white p-4 shadow-lg dark:border-white/10 dark:bg-slate-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-slate-900 dark:text-white truncate">{open.title}</div>
                <div className="text-xs text-slate-500 dark:text-white/60">Preview image</div>
              </div>

              <button
                type="button"
                className="rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-slate-800 hover:bg-slate-50
                           dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
                onClick={() => setOpen(null)}
              >
                Close
              </button>
            </div>

            <div className="mt-4 rounded-3xl border border-black/10 bg-white/60 p-3 dark:border-white/10 dark:bg-white/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={open.url} alt="preview" className="max-h-[80dvh] w-full rounded-2xl object-contain" />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
