export type Question = {
  id: string;
  grade: number;
  sentence: string;
  answer: string;
  reading: string;
  readingPerChar: string[];
};

export const sampleQuestions: Question[] = [
  {
    id: "g5-001",
    grade: 5,
    sentence: "友達と（さいかい）する。",
    answer: "再会",
    reading: "さいかい",
    readingPerChar: ["さい", "かい"],
  },
  {
    id: "g5-002",
    grade: 5,
    sentence: "先生に（かんしゃ）する。",
    answer: "感謝",
    reading: "かんしゃ",
    readingPerChar: ["かん", "しゃ"],
  },
  {
    id: "g5-003",
    grade: 5,
    sentence: "動物に（きょうみ）があります。",
    answer: "興味",
    reading: "きょうみ",
    readingPerChar: ["きょう", "み"],
  },
  {
    id: "g5-004",
    grade: 5,
    sentence: "体の（じょうたい）を調べる。",
    answer: "状態",
    reading: "じょうたい",
    readingPerChar: ["じょう", "たい"],
  },
  {
    id: "g5-005",
    grade: 5,
    sentence: "仕事の（せきにん）を持つ。",
    answer: "責任",
    reading: "せきにん",
    readingPerChar: ["せき", "にん"],
  },
];
