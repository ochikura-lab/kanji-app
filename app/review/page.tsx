"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mistake = {
  id: string;
  answer: string;
  reading: string;
  created_at: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
}

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const grade = Number(searchParams.get("grade") ?? 5);

  const [mistakes, setMistakes] = useState<Mistake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMistakes() {
      setLoading(true);
      setError(null);

      const supabase = createClient();
      const { data, error } = await supabase
        .from("mistakes")
        .select("id, answer, reading, created_at")
        .eq("grade", grade)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("取得エラー:", error);
        setError("データの取得に失敗しました。");
      } else {
        setMistakes(data ?? []);
      }

      setLoading(false);
    }

    fetchMistakes();
  }, [grade]);

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 mb-4">
            <span className="text-3xl">📋</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            間違い一覧
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            小{grade}年・これまでの間違い
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">

          {loading ? (
            <p className="text-center text-sm text-gray-400 py-6">読み込み中...</p>
          ) : error ? (
            <p className="text-center text-sm text-red-400 py-6">{error}</p>
          ) : mistakes.length === 0 ? (
            <p className="text-center text-sm text-gray-400 py-6">
              まだ間違いが登録されていません。
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {mistakes.map((m) => (
                <li key={m.id} className="flex items-center justify-between py-3">
                  <div>
                    <span className="text-base font-bold text-gray-800">
                      {m.answer}
                    </span>
                    <span className="text-sm text-gray-400 ml-2">
                      （{m.reading}）
                    </span>
                  </div>
                  <span className="text-xs text-gray-300 ml-4 flex-shrink-0">
                    {formatDate(m.created_at)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* 件数 */}
          {!loading && !error && mistakes.length > 0 && (
            <p className="text-xs text-gray-400 text-right">
              全 {mistakes.length} 件
            </p>
          )}

          {/* 戻る */}
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