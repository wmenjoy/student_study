"use client"
import { WordsGame } from "../../../components/WordsGame"
import { LessonShell } from "../../../components/LessonShell"

export default function WordsPage() {
  return (
    <LessonShell title="词语小游戏">
      <WordsGame />
    </LessonShell>
  )
}