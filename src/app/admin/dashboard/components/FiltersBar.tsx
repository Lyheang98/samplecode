"use client";

export type StreamType = "sci" | "soc";

export type FiltersValue = {
  year: number | "all";
  month: number | "all";
  grade: number | "all";
  stream: StreamType | "all"; // only used if grade 11/12 or all
  subject: string | "all";
};

type Props = {
  value: FiltersValue;
  years: number[];
  months: number[];
  grades: number[];
  subjects: string[];
  onChange: (next: FiltersValue) => void;
};

export default function FiltersBar({ value, years, months, grades, subjects, onChange }: Props) {
  const is1112 = value.grade === 11 || value.grade === 12;
  const showStream = value.grade === "all" || is1112;

  return (
    <div className="rounded-3xl border border-black/10 bg-white/80 backdrop-blur-xl p-4 md:p-5 dark:border-white/10 dark:bg-white/5">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {/* Year */}
        <SelectField
          label="ឆ្នាំ"
          value={String(value.year)}
          onChange={(v) => onChange({ ...value, year: v === "all" ? "all" : Number(v) })}
          options={[
            { value: "all", label: "All" },
            ...years.map((y) => ({ value: String(y), label: String(y) })),
          ]}
        />

        {/* Month */}
        <SelectField
          label="ខែ"
          value={String(value.month)}
          onChange={(v) => onChange({ ...value, month: v === "all" ? "all" : Number(v) })}
          options={[
            { value: "all", label: "All" },
            ...months.map((m) => ({ value: String(m), label: String(m) })),
          ]}
        />

        {/* Grade */}
        <SelectField
          label="ថ្នាក់ទី"
          value={String(value.grade)}
          onChange={(v) => {
            const nextGrade = v === "all" ? "all" : Number(v);

            // when not 11/12 => stream should be "all" (or keep if grade all)
            if (nextGrade !== 11 && nextGrade !== 12) {
              onChange({ ...value, grade: nextGrade, stream: "all" });
            } else {
              // grade 11/12 default stream sci if current is all
              onChange({ ...value, grade: nextGrade, stream: value.stream === "all" ? "sci" : value.stream });
            }
          }}
          options={[
            { value: "all", label: "All" },
            ...grades.map((g) => ({ value: String(g), label: `ថ្នាក់ទី ${g}` })),
          ]}
        />

        {/* Stream */}
        <div className="space-y-1">
          <div className="text-sm font-medium text-slate-700 dark:text-white/80">ផ្នែក</div>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              disabled={!showStream}
              className={[
                "rounded-2xl border px-3 py-2 text-sm font-semibold",
                !showStream ? "opacity-40 cursor-not-allowed" : "hover:bg-white",
                value.stream === "all"
                  ? "border-[#243A7A]/30 bg-[#243A7A] text-white"
                  : "border-black/10 bg-white/70 text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-white",
              ].join(" ")}
              onClick={() => onChange({ ...value, stream: "all" })}
            >
              All
            </button>

            <button
              type="button"
              disabled={!showStream}
              className={[
                "rounded-2xl border px-3 py-2 text-sm font-semibold",
                !showStream ? "opacity-40 cursor-not-allowed" : "hover:bg-white",
                value.stream === "sci"
                  ? "border-[#243A7A]/30 bg-[#243A7A] text-white"
                  : "border-black/10 bg-white/70 text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-white",
              ].join(" ")}
              onClick={() => onChange({ ...value, stream: "sci" })}
            >
              វិទ្យាសាស្រ្ត
            </button>

            <button
              type="button"
              disabled={!showStream}
              className={[
                "rounded-2xl border px-3 py-2 text-sm font-semibold",
                !showStream ? "opacity-40 cursor-not-allowed" : "hover:bg-white",
                value.stream === "soc"
                  ? "border-[#243A7A]/30 bg-[#243A7A] text-white"
                  : "border-black/10 bg-white/70 text-slate-800 dark:border-white/10 dark:bg-white/10 dark:text-white",
              ].join(" ")}
              onClick={() => onChange({ ...value, stream: "soc" })}
            >
              សង្គម
            </button>
          </div>
          <div className="text-[11px] text-slate-500 dark:text-white/50">
            * Stream អាចចុចបានតែ Grade 11/12 ឬ All
          </div>
        </div>

        {/* Subject */}
        <SelectField
          label="មុខវិជ្ជា"
          value={String(value.subject)}
          onChange={(v) => onChange({ ...value, subject: v === "all" ? "all" : v })}
          options={[
            { value: "all", label: "All" },
            ...subjects.map((s) => ({ value: s, label: s })),
          ]}
        />
      </div>
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="space-y-1">
      <div className="text-sm font-medium text-slate-700 dark:text-white/80">{label}</div>
      <select
        className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-black/10
                   dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:ring-white/20"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="text-slate-900">
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}
