"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { pdf } from "@react-pdf/renderer";
import { KanjiQuizPDF } from "@/components/KanjiQuizPDF";
import { createClient } from "@/lib/supabase/client";
import { getReviewQuestions } from "@/lib/getReviewQuestions"; 
import { grade5Questions } from "@/lib/questions/grade5";
import { Question } from "@/lib/types/question";

function getQuestionsByGrade(grade: number): Question[] {
  if (grade === 5) return grade5Questions;
  return [];
}

async function buildQuestions(
  grade: number
): Promise<{ questions: Question[]; reviewCount: number }> {
  const base = getQuestionsByGrade(grade);
  const supabase = createClient();
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("mistakes")
    .select("question_id, next_review_date, created_at")
    .eq("grade", grade)
    .lte("next_review_date", today)
    .order("created_at", { ascending: false });

  if (error || !data || data.length === 0) {
    return { questions: base, reviewCount: 0 };
  }

  const seen = new Set<string>();
  const reviewIds: string[] = [];
  for (const row of data) {
    if (!seen.has(row.question_id)) {
      seen.add(row.question_id);
      reviewIds.push(row.question_id);
    }
  }

  const reviewIdSet = new Set(reviewIds);
  const reviewQuestions = reviewIds
    .map((id) => base.find((q) => q.id === id))
    .filter((q): q is Question => q !== undefined);

  const normalQuestions = base.filter((q) => !reviewIdSet.has(q.id));

  return {
    questions: [...reviewQuestions, ...normalQuestions],
    reviewCount: reviewQuestions.length,
  };
}

async function downloadPdf(
  mode: "quiz" | "answer",
  grade: number,
  questions: Question[]
) {
  const fileName =
    mode === "quiz"
      ? `kanji_grade${grade}_quiz.pdf`
      : `kanji_grade${grade}_answer.pdf`;

  const blob = await pdf(
    <KanjiQuizPDF questions={questions} mode={mode} grade={grade} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

export default function PdfPreviewPage() {
  const searchParams = useSearchParams();
  const grade = Number(searchParams.get("grade") ?? 5);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [reviewCount, setReviewCount] = useState(0);
  const [quizLoading, setQuizLoading] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);
  
 useEffect(() => {
    const load = async () => {
      const { questions } = await buildQuestions(grade);
      const review = await getReviewQuestions(1);
      console.log("review:", review);

     const reviewQuestions = review
     .map((row) => grade5Questions.find((q) => q.id === row.question_id))
     .filter((q): q is Question => q !== undefined);

      const totalCount = questions.length;
      const reviewCount = reviewQuestions.length;
      const normalCount = Math.max(0, totalCount - reviewCount);
      const normalQuestions = questions.slice(0, normalCount);

      const seen = new Set<string>();
      const merged = [...reviewQuestions, ...normalQuestions].filter((q) => {
        if (seen.has(q.id)) return false;
        seen.add(q.id);
        return true;
      });

      setQuestions(merged);
      setReviewCount(reviewCount);
    };
    load();
  }, [grade]);

  async function handleQuiz() {
    setQuizLoading(true);
    try {
      await downloadPdf("quiz", grade, questions);
    } finally {
      setQuizLoading(false);
    }
  }

  async function handleAnswer() {
    setAnswerLoading(true);
    try {
      await downloadPdf("answer", grade, questions);
    } finally {
      setAnswerLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">PDF を作る</h1>
          <p className="mt-2 text-sm text-gray-500">小{grade}年・{questions.length}問</p>
          {reviewCount > 0 && (
            <p className="mt-1 text-sm text-red-400 font-semibold">復習 {reviewCount}問 含む</p>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          {questions.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-4">小{grade}年の問題データはまだ準備中です。</p>
          ) : (
            <>
              <button type="button" onClick={handleQuiz} disabled={quizLoading} className="w-full rounded-xl bg-indigo-500 px-4 py-4 text-base font-bold text-white hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150 shadow-sm">
                {quizLoading ? "生成中..." : "📝 問題用紙をダウンロード"}
              </button>
              <button type="button" onClick={handleAnswer} disabled={answerLoading} className="w-full rounded-xl border-2 border-indigo-200 bg-white px-4 py-4 text-base font-bold text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150">
                {answerLoading ? "生成中..." : "✅ 解答用紙をダウンロード"}
              </button>
              <Link href={`/mistakes?grade=${grade}`} className="block w-full rounded-xl border-2 border-red-200 bg-red-50 px-4 py-4 text-base font-bold text-red-500 text-center hover:bg-red-100 hover:border-red-300 active:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-colors duration-150">
                ✏️ 間違いを登録する
              </Link>
              <Link href={`/review?grade=${grade}`} className="block w-full rounded-xl border-2 border-amber-200 bg-amber-50 px-4 py-4 text-base font-bold text-amber-600 text-center hover:bg-amber-100 hover:border-amber-300 active:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 transition-colors duration-150">
                📋 間違い一覧を見る
              </Link>
            </>
          )}
          <a href="/grade" className="block w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base font-semibold text-gray-500 text-center hover:bg-gray-50 active:bg-gray-100 transition-colors duration-150">戻る</a>
        </div>
        <p className="mt-6 text-center text-xs text-gray-400">© 2025 漢字トレーニング</p>
      </div>
    </main>
  );
}