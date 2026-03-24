import { createClient } from "@/lib/supabase/client";

export type MistakeRow = {
  id: string;
  question_id: string;
  answer: string;
  reading: string;
  grade: number;
  interval_stage: number;
  next_review_date: string;
  created_at: string;
};

export async function getReviewQuestions(grade: number): Promise<MistakeRow[]> {
  const supabase = createClient();

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const todayStr = `${yyyy}-${mm}-${dd}`;

  const { data, error } = await supabase
    .from("mistakes")
    .select("id, question_id, answer, reading, grade, interval_stage, next_review_date, created_at")
    .lte("next_review_date", todayStr)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getReviewQuestions error:", error);
    return [];
  }

  const seen = new Set<string>();
  const unique = (data ?? []).filter((row) => {
    if (seen.has(row.question_id)) return false;
    seen.add(row.question_id);
    return true;
  });

  return unique;
}