export type OptionKey = "A" | "B" | "C" | "D";

export type LocalOption = {
  key: OptionKey;
  text?: string;
  imagePreview?: string | null;
};

export type LocalQuestion = {
  id: string;
  year: number;
  month: number;
  grade: string;
  subject: string;

  questionText: string;
  questionImagePreview?: string | null;

  options: LocalOption[];
  correctAnswer: OptionKey;
  score: number;

  createdAt: string;
};
