"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Question } from "@/lib/types/question";

// @react-pdf/renderer はデフォルトで日本語フォントを持たないため、
// Google Fonts から Noto Sans JP を登録する
Font.register({
  family: "NotoSansJP",
  src: "https://fonts.gstatic.com/s/notosansjp/v52/-F6jfjtqLzI2JPCgQBnw7HFyzSD-AsregP8VFBEj75vY0rw-oME.ttf",
});

const styles = StyleSheet.create({
  page: {
    fontFamily: "NotoSansJP",
    padding: 40,
    fontSize: 12,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 24,
    borderBottomWidth: 2,
    borderBottomColor: "#333333",
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: "NotoSansJP",
  },
  meta: {
    fontSize: 10,
    color: "#555555",
  },
  nameArea: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  nameLabel: {
    fontSize: 11,
    marginRight: 4,
  },
  nameLine: {
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
    width: 120,
    marginLeft: 4,
  },
  questionBlock: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
  },
  questionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  questionNumber: {
    fontSize: 12,
    fontFamily: "NotoSansJP",
    width: 32,
    color: "#444444",
  },
  sentence: {
    fontSize: 14,
    fontFamily: "NotoSansJP",
    flex: 1,
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 32,
  },
  answerLabel: {
    fontSize: 10,
    color: "#777777",
    marginRight: 8,
  },
  answerBox: {
    borderWidth: 1,
    borderColor: "#aaaaaa",
    width: 80,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
  },
  answerText: {
    fontSize: 14,
    fontFamily: "NotoSansJP",
    color: "#cc0000",
  },
  footer: {
    position: "absolute",
    bottom: 24,
    left: 40,
    right: 40,
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 9,
    color: "#aaaaaa",
  },
});

type Props = {
  questions: Question[];
  mode: "quiz" | "answer";
  grade: number;
};

export function KanjiQuizPDF({ questions, mode, grade }: Props) {
  const isAnswer = mode === "answer";
  const titleText = isAnswer
    ? `小${grade}年　漢字テスト【解答】`
    : `小${grade}年　漢字テスト`;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>{titleText}</Text>
          <View style={styles.nameArea}>
            {!isAnswer && (
              <>
                <Text style={styles.nameLabel}>名前：</Text>
                <View style={styles.nameLine} />
              </>
            )}
            <Text style={[styles.meta, { marginLeft: 16 }]}>
              （　　）年（　　）組
            </Text>
          </View>
        </View>

        {/* Questions */}
        {questions.map((q, index) => (
          <View key={q.id} style={styles.questionBlock}>
            {/* Sentence row */}
            <View style={styles.questionRow}>
              <Text style={styles.questionNumber}>（{index + 1}）</Text>
              <Text style={styles.sentence}>{q.sentence}</Text>
            </View>

            {/* Answer row */}
            <View style={styles.answerRow}>
              <Text style={styles.answerLabel}>漢字：</Text>
              <View style={styles.answerBox}>
                {isAnswer && (
                  <Text style={styles.answerText}>{q.answer}</Text>
                )}
              </View>
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>漢字トレーニング</Text>
          <Text render={({ pageNumber, totalPages }) =>
            `${pageNumber} / ${totalPages}`
          } />
        </View>
      </Page>
    </Document>
  );
}
