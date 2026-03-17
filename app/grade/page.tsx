import Link from "next/link";

// 表示ラベルと学年番号のペア
const grades = [
  { label: "小1", value: 1 },
  { label: "小2", value: 2 },
  { label: "小3", value: 3 },
  { label: "小4", value: 4 },
  { label: "小5", value: 5 },
  { label: "小6", value: 6 },
];

export default function GradePage() {
  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            どの学年を勉強しますか？
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">

          {/* Grade grid */}
          <div className="grid grid-cols-2 gap-3">
            {grades.map(({ label, value }) => (
              <Link
                key={value}
                href={`/pdf-preview?grade=${value}`}
                className="
                  rounded-xl border-2 border-indigo-100 bg-indigo-50
                  px-4 py-5
                  text-lg font-bold text-indigo-600 text-center
                  hover:bg-indigo-100 hover:border-indigo-300
                  active:bg-indigo-200
                  focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
                  transition-colors duration-150
                "
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Back button */}
          <Link
            href="/"
            className="
              block w-full rounded-xl border border-gray-200 bg-white
              px-4 py-3.5
              text-base font-semibold text-gray-500 text-center
              hover:bg-gray-50 active:bg-gray-100
              focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2
              transition-colors duration-150
            "
          >
            戻る
          </Link>
        </div>
      </div>
    </main>
  );
}