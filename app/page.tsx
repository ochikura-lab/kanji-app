import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-100 mb-4">
            <span className="text-3xl">✏️</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            漢字トレーニング
          </h1>
          <p className="mt-2 text-sm text-gray-500">毎日の練習で漢字を覚えよう</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">

          {/* Child selector */}
          <div className="space-y-2">
            <label
              htmlFor="child-select"
              className="block text-sm font-semibold text-gray-700"
            >
              子どもを選ぶ
            </label>
            <div className="relative">
              <select
                id="child-select"
                defaultValue=""
                className="
                  w-full appearance-none rounded-xl border border-gray-200
                  bg-gray-50 px-4 py-3.5 pr-10
                  text-base text-gray-800
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
                  transition
                "
              >
                <option value="" disabled>選択してください</option>
                <option value="sosuke">ソウスケ</option>
                <option value="add">＋ 子どもを追加</option>
              </select>
              {/* Custom chevron */}
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  className="h-5 w-5 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href="/grade"
            className="
              block w-full rounded-xl bg-indigo-500 px-4 py-4
              text-base font-bold text-white text-center
              hover:bg-indigo-600 active:bg-indigo-700
              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
              transition-colors duration-150
              shadow-sm
            "
          >
            次へ進む
          </Link>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          © 2025 漢字トレーニング
        </p>
      </div>
    </main>
  );
}