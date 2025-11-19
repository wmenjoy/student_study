"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { Narration } from "../../../components/Narration"
import { MathClimbingGame } from "../../../components/MathClimbingGame"
import { generateQuestions, validateAnswer, Difficulty, Question } from "../../../lib/mathQuestions"

export default function MathClimbingPage() {
  const [difficulty, setDifficulty] = useState<Difficulty>("easy")
  const [total, setTotal] = useState(10)
  const [questions, setQuestions] = useState<Question[]>([])
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle")
  const [explain, setExplain] = useState<string>("")
  const [startAt, setStartAt] = useState<number | null>(null)
  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    setQuestions(generateQuestions(difficulty, total))
    setIdx(0)
    setScore(0)
    setStatus("idle")
    setExplain("")
    setStartAt(Date.now())
  }, [difficulty, total])

  useEffect(() => { return () => { if (timerRef.current) clearTimeout(timerRef.current as any) } }, [])

  const current = questions[idx]
  const progress = Math.min(score, total)
  const done = progress >= total
  const timeUsed = useMemo(() => {
    if (!startAt) return 0
    return Math.round((Date.now() - startAt) / 1000)
  }, [startAt, idx, status])

  const handleAnswerSubmit = (answer: string) => {
    if (!current || done) return
    const ok = validateAnswer(current, answer.trim())
    if (ok) {
      setStatus("correct")
      setScore(s => Math.min(total, s + 1))
      setExplain(current.explain || current.prompt)
      setIdx(i => Math.min(questions.length - 1, i + 1))
      // Reset status after animation
      timerRef.current = setTimeout(() => setStatus("idle"), 600) as any
    } else {
      setStatus("wrong")
      setExplain(current.hint || "再想一想")
      timerRef.current = setTimeout(() => setStatus("idle"), 400) as any
    }
  }

  const microItems = (diff: Difficulty) => {
    const arr = generateQuestions(diff, 3)
    return arr.map(q => ({ prompt: q.prompt, placeholder: "输入答案", check: (v: string) => validateAnswer(q, v) }))
  }

  return (
    <LessonRunner
      title="数学冒险游戏"
      skillId="math-climbing"
      intro={{
        story: "化身超级英雄，通过解答数学题目攀登高峰，收集金币，到达终点获得胜利！",
        goal: "选择难度，在游戏中答题，登顶获胜",
        steps: ["选择难度与关卡数", "在游戏界面答题", "收集金币并通关"]
      }}
      hints={{
        build: ["易/中/难对应不同年级题型", "可输入分数如1/2", "答对获得金币奖励"],
        map: ["答对前进，答错停留", "观察角色动画反馈", "收集所有金币"],
        review: ["挑战更高难度", "尝试更多关卡", "提升答题速度"]
      }}
      microTestGen={(diff) => microItems(diff)}
      onEvaluate={() => ({ correct: true, text: explain })}
    >
      <Narration avatar="/mascots/cat.svg" name="乐乐猫">
        欢迎来到数学冒险世界！你将化身超级英雄，通过解答数学题目来攀登高峰。每答对一题就能前进一步，还能获得金币奖励！加油，勇敢的冒险者！
      </Narration>

      <div className="controls" style={{ marginBottom: "20px" }}>
        <div className="control">
          <label>选择难度</label>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value as Difficulty)}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              borderRadius: "6px",
              border: "2px solid #ddd"
            }}
          >
            <option value="easy">🌟 简单（1-2年级）</option>
            <option value="medium">⭐⭐ 中等（3-4年级）</option>
            <option value="hard">⭐⭐⭐ 困难（5-6年级）</option>
          </select>
        </div>
        <div className="control">
          <label>关卡数量</label>
          <input
            type="number"
            value={total}
            onChange={e => setTotal(Math.max(5, Math.min(20, parseInt(e.target.value || "10"))))}
            style={{
              padding: "8px 12px",
              fontSize: "14px",
              borderRadius: "6px",
              border: "2px solid #ddd",
              width: "80px"
            }}
          />
        </div>
        <div className="control">
          <label>用时</label>
          <span style={{
            padding: "8px 12px",
            fontSize: "14px",
            fontWeight: "bold",
            color: "#667eea"
          }}>
            ⏱️ {timeUsed}秒
          </span>
        </div>
      </div>

      <MathClimbingGame
        total={total}
        current={progress}
        status={status}
        currentQuestion={current ? current.prompt : ""}
        onAnswerSubmit={handleAnswerSubmit}
        showVictory={done}
      />

      {explain && (
        <div style={{
          marginTop: "16px",
          padding: "16px",
          background: status === "correct" ? "#e8f5e9" : "#fff3e0",
          borderLeft: `4px solid ${status === "correct" ? "#4CAF50" : "#FF9800"}`,
          borderRadius: "8px",
          fontSize: "14px",
          color: "#333"
        }}>
          <strong>{status === "correct" ? "✅ 正确！" : "💡 提示："}</strong> {explain}
        </div>
      )}
    </LessonRunner>
  )
}