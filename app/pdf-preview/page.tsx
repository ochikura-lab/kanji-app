"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { pdf } from "@react-pdf/renderer";
import { KanjiQuizPDF } from "@/components/KanjiQuizPDF";
import { sampleQuestions, Question } from "@/lib/sampleQuestions";

// grade に応じた問題データを返す
// 現時点では grade=5 のみ実データ、それ以外は空配列
function getQuestionsByGrade(grade: number): Question[] {
  if (grade === 5) return sampleQuestions;
  return [];
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
  const questions = getQuestionsByGrade(grade);

  const [quizLoading, setQuizLoading] = useState(false);
  const [answerLoading, setAnswerLoading] = useState(false);

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

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-4">
            <span className="text-3xl">📄</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            PDF を作る
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            小{grade}年・{questions.length}問
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">

          {questions.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-4">
              小{grade}年の問題データはまだ準備中です。
            </p>
          ) : (
            <>
              {/* 問題用紙 */}
              <button
                type="button"
                onClick={handleQuiz}
                disabled={quizLoading}
                className="
                  w-full rounded-xl bg-indigo-500 px-4 py-4
                  text-base font-bold text-white
                  hover:bg-indigo-600 active:bg-indigo-700
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-150 shadow-sm
                "
              >
                {quizLoading ? "生成中..." : "📝 問題用紙をダウンロード"}
              </button>

              {/* 解答用紙 */}
              <button
                type="button"
                onClick={handleAnswer}
                disabled={answerLoading}
                className="
                  w-full rounded-xl border-2 border-indigo-200 bg-white px-4 py-4
                  text-base font-bold text-indigo-600
                  hover:bg-indigo-50 active:bg-indigo-100
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-150
                "
              >
                {answerLoading ? "生成中..." : "✅ 解答用紙をダウンロード"}
              </button>

              {/* 間違い登録 */}
              <Link
                href={`/mistakes?grade=${grade}`}
                className="
                  block w-full rounded-xl border-2 border-red-200 bg-red-50 px-4 py-4
                  text-base font-bold text-red-500 text-center
                  hover:bg-red-100 hover:border-red-300
                  active:bg-red-200
                  focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
                  transition-colors duration-150
                "
              >
                ✏️ 間違いを登録する
              </Link>
            </>
          )}

          {/* 戻る */}
          <a
            href="/grade"
            className="
              block w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5
              text-base font-semibold text-gray-500 text-center
              hover:bg-gray-50 active:bg-gray-100
              transition-colors duration-150
            "
          >
            戻る
          </a>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © 2025 漢字トレーニング
        </p>
      </div>
    </main>
  );
}