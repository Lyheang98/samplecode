"use client";

import { useRef } from "react";

type Props = {
  label?: string;
  previewUrl?: string | null;
  onPick: (file: File | null, previewUrl?: string | null) => void;
};

export default function ImagePicker({ label = "Image", previewUrl, onPick }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-semibold text-slate-800 dark:text-white/80">
          {label}
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            className="rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-xs text-slate-800 hover:bg-white
                       dark:border-white/10 dark:bg-white/10 dark:text-white dark:hover:bg-white/15"
            onClick={() => inputRef.current?.click()}
          >
            Upload
          </button>

          <button
            type="button"
            className="rounded-2xl border border-rose-300/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-700 hover:bg-rose-500/15
                       dark:border-rose-300/20 dark:bg-rose-500/20 dark:text-rose-100 dark:hover:bg-rose-500/25"
            onClick={() => {
              onPick(null, null);
              if (inputRef.current) inputRef.current.value = "";
            }}
          >
            Remove
          </button>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0] ?? null;
          if (!file) return onPick(null, null);
          const url = URL.createObjectURL(file);
          onPick(file, url);
        }}
      />

      {previewUrl ? (
        <div className="rounded-3xl border border-black/10 p-3 bg-white/70 dark:border-white/10 dark:bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={previewUrl} alt="preview" className="max-h-56 w-auto rounded-2xl object-contain" />
        </div>
      ) : (
        <div className="rounded-3xl border border-dashed border-black/15 p-6 text-center text-sm text-slate-500 bg-white/60
                        dark:border-white/15 dark:text-white/60 dark:bg-white/5">
          No image selected
        </div>
      )}
    </div>
  );
}
