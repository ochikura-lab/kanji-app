"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { sampleQuestions, Question } from "@/lib/sampleQuestions";
import { createClient } from "@/lib/supabase/client";

// grade に応じた問題データを返す（現状 grade=5 のみ実データ）
function getQuestionsByGrade(grade: number): Question[] {
  if (grade === 5) return sampleQuestions;
  return [];
}

export default function MistakesPage() {
  const searchParams = useSearchParams();
  const grade = Number(searchParams.get("grade") ?? 5);
  const questions = getQuestionsByGrade(grade);

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  function toggle(id: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleSave() {
    const mistakes = questions.filter((q) => checked.has(q.id));
    if (mistakes.length === 0) return;

    setSaving(true);
    const supabase = createClient();

    // mistakes テーブルに insert
    // テーブル構成例:
    //   id         uuid (PK, default gen_random_uuid())
    //   question_id text
    //   answer      text
    //   reading     text
    //   grade       int2
    //   created_at  timestamptz (default now())
    const rows = mistakes.map((q) => ({
      question_id: q.id,
      answer: q.answer,
      reading: q.reading,
      grade,
    }));

    const { error } = await supabase.from("mistakes").insert(rows);

    setSaving(false);

    if (error) {
      console.error("保存エラー:", error);
      alert(`保存に失敗しました。\n${error.message}`);
      return;
    }

    alert(`${mistakes.length}問を保存しました！`);
    setChecked(new Set()); // 保存後にチェックをリセット
  }

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-100 mb-4">
            <span className="text-3xl">✏️</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            間違い登録
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            小{grade}年・間違えた漢字を選んでください
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">

          {questions.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-4">
              小{grade}年の問題データはまだ準備中です。
            </p>
          ) : (
            <>
              {/* Question list */}
              <ul className="space-y-3">
                {questions.map((q, index) => (
                  <li key={q.id}>
                    <label className="flex items-center gap-4 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={checked.has(q.id)}
                        onChange={() => toggle(q.id)}
                        className="
                          w-5 h-5 rounded border-gray-300
                          text-red-500 accent-red-500
                          cursor-pointer flex-shrink-0
                        "
                      />
                      <span className="text-base text-gray-800 group-hover:text-gray-600 transition-colors">
                        <span className="text-gray-400 text-sm mr-2">
                          {index + 1}
                        </span>
                        {q.answer}
                        <span className="text-gray-400 text-xs ml-2">
                          （{q.reading}）
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>

              {/* Selected count */}
              <p className="text-xs text-gray-400 text-right">
                {checked.size} 問 選択中
              </p>

              {/* Save */}
              <button
                type="button"
                onClick={handleSave}
                disabled={checked.size === 0 || saving}
                className="
                  w-full rounded-xl bg-red-500 px-4 py-4
                  text-base font-bold text-white
                  hover:bg-red-600 active:bg-red-700
                  focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
                  disabled:opacity-40 disabled:cursor-not-allowed
                  transition-colors duration-150 shadow-sm
                "
              >
                {saving ? "保存中..." : "保存する"}
              </button>
            </>
          )}

          {/* Back */}
          <a
            href={`/pdf-preview?grade=${grade}`}
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