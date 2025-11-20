"use client"
import { useEffect, useMemo, useRef, useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { Narration } from "../../../components/Narration"
import { MathClimbingGame } from "../../../components/MathClimbingGame"
import { generateQuestionsByGrade, validateAnswer, Grade, Question } from "../../../lib/mathQuestions"

// 年级配置
const gradeConfig = {
  1: { name: "一年级", emoji: "🌱", color: "#4CAF50", desc: "加减法、图形认识" },
  2: { name: "二年级", emoji: "🌿", color: "#8BC34A", desc: "乘除法、时间长度" },
  3: { name: "三年级", emoji: "🌳", color: "#FF9800", desc: "万以内数、周长面积" },
  4: { name: "四年级", emoji: "🌲", color: "#FF5722", desc: "混合运算、行程问题" },
  5: { name: "五年级", emoji: "⭐", color: "#9C27B0", desc: "分数、方程、工程问题" },
  6: { name: "六年级", emoji: "🏆", color: "#673AB7", desc: "百分数、圆、比例" },
}

export default function MathClimbingPage() {
  const [grade, setGrade] = useState<Grade>(3)
  const [total, setTotal] = useState(20)
  const [questions, setQuestions] = useState<Question[]>([])
  const [idx, setIdx] = useState(0)
  const [score, setScore] = useState(0)
  const [status, setStatus] = useState<"idle" | "correct" | "wrong">("idle")
  const [explain, setExplain] = useState<string>("")
  const [startAt, setStartAt] = useState<number | null>(null)
  const [showGradeSelector, setShowGradeSelector] = useState(true)
  const timerRef = useRef<number | undefined>(undefined)

  // 生成新题目
  const regenerateQuestions = () => {
    setQuestions(generateQuestionsByGrade(grade, total))
    setIdx(0)
    setScore(0)
    setStatus("idle")
    setExplain("")
    setStartAt(Date.now())
  }

  useEffect(() => {
    regenerateQuestions()
  }, [grade, total])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current as any)
    }
  }, [])

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
      timerRef.current = setTimeout(() => setStatus("idle"), 600) as any
    } else {
      setStatus("wrong")
      setExplain(current.hint || "再想一想")
      timerRef.current = setTimeout(() => setStatus("idle"), 400) as any
    }
  }

  const handleStartGame = () => {
    setShowGradeSelector(false)
    regenerateQuestions()
  }

  const microItems = (g: Grade) => {
    const arr = generateQuestionsByGrade(g, 3)
    return arr.map(q => ({
      prompt: q.prompt,
      placeholder: "输入答案",
      check: (v: string) => validateAnswer(q, v)
    }))
  }

  return (
    <LessonRunner
      title="数学冒险RPG"
      skillId="math-climbing"
      intro={{
        story: "选择你的英雄，踏入数学王国！通过解答数学题目攻击怪物，收集经验和金币，挑战强大的冰霜巨龙！",
        goal: "选择年级和英雄，击败怪物，解锁成就",
        steps: ["选择年级和题目数量", "选择英雄和场景", "用数学知识攻击怪物"]
      }}
      hints={{
        build: ["不同年级有不同的应用题", "连续答对可以暴击", "升级可以提高攻击力"],
        map: ["答错会受到怪物攻击", "不同英雄有不同技能", "挑战高级场景获得更多经验"],
        review: ["收集成就徽章", "挑战更高年级", "尝试击败冰霜巨龙"]
      }}
      microTestGen={(diff) => microItems(diff === 'easy' ? 1 : diff === 'medium' ? 3 : 5)}
      onEvaluate={() => ({ correct: true, text: explain })}
    >
      <Narration avatar="/mascots/cat.svg" name="数学精灵">
        欢迎来到数学冒险世界！在这里，你将化身勇敢的冒险者，用数学知识击败各种怪物。每答对一题就能对怪物造成伤害，答错则会被怪物攻击。选择你的英雄，开始冒险吧！
      </Narration>

      {showGradeSelector ? (
        // 年级选择界面
        <div style={{
          padding: "20px",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          borderRadius: "16px",
          color: "white"
        }}>
          <h2 style={{
            textAlign: "center",
            marginBottom: "24px",
            fontSize: "24px"
          }}>
            选择挑战难度
          </h2>

          {/* 年级选择 */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ marginBottom: "12px", fontSize: "16px" }}>选择年级（决定题目难度）</h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "12px"
            }}>
              {([1, 2, 3, 4, 5, 6] as Grade[]).map(g => (
                <button
                  key={g}
                  onClick={() => setGrade(g)}
                  style={{
                    padding: "16px 12px",
                    borderRadius: "12px",
                    border: grade === g ? "3px solid white" : "2px solid rgba(255,255,255,0.3)",
                    background: grade === g ? gradeConfig[g].color : "rgba(255,255,255,0.1)",
                    color: "white",
                    cursor: "pointer",
                    transition: "all 0.3s",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <span style={{ fontSize: "24px" }}>{gradeConfig[g].emoji}</span>
                  <span style={{ fontWeight: "bold", fontSize: "14px" }}>{gradeConfig[g].name}</span>
                  <span style={{ fontSize: "10px", opacity: 0.8 }}>{gradeConfig[g].desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 题目数量选择 */}
          <div style={{ marginBottom: "24px" }}>
            <h3 style={{ marginBottom: "12px", fontSize: "16px" }}>冒险时长</h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "10px"
            }}>
              {[15, 20, 30, 50].map(num => (
                <button
                  key={num}
                  onClick={() => setTotal(num)}
                  style={{
                    padding: "12px",
                    borderRadius: "8px",
                    border: total === num ? "3px solid white" : "2px solid rgba(255,255,255,0.3)",
                    background: total === num ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)",
                    color: "white",
                    cursor: "pointer",
                    transition: "all 0.3s"
                  }}
                >
                  <div style={{ fontWeight: "bold" }}>{num}题</div>
                  <div style={{ fontSize: "10px", opacity: 0.7 }}>
                    {num <= 15 ? '快速' : num <= 20 ? '标准' : num <= 30 ? '挑战' : '史诗'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 开始按钮 */}
          <button
            onClick={handleStartGame}
            style={{
              width: "100%",
              padding: "16px",
              fontSize: "18px",
              fontWeight: "bold",
              background: gradeConfig[grade].color,
              color: "white",
              border: "none",
              borderRadius: "12px",
              cursor: "pointer",
              boxShadow: `0 4px 20px ${gradeConfig[grade].color}80`,
              transition: "transform 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            进入冒险！
          </button>

          {/* 当前选择预览 */}
          <div style={{
            marginTop: "16px",
            padding: "12px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "8px",
            textAlign: "center",
            fontSize: "14px"
          }}>
            已选择：{gradeConfig[grade].emoji} {gradeConfig[grade].name} · {total}道题
          </div>
        </div>
      ) : (
        // 游戏界面
        <>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
            padding: "12px",
            background: "rgba(0,0,0,0.05)",
            borderRadius: "8px"
          }}>
            <button
              onClick={() => setShowGradeSelector(true)}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                background: "transparent",
                color: "#667eea",
                border: "2px solid #667eea",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              ← 返回
            </button>

            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
              <span style={{
                padding: "4px 10px",
                background: gradeConfig[grade].color,
                color: "white",
                borderRadius: "4px",
                fontSize: "12px",
                fontWeight: "bold"
              }}>
                {gradeConfig[grade].name}
              </span>
              <span style={{ fontSize: "14px", color: "#666" }}>
                进度：{score}/{total}
              </span>
              <span style={{ fontSize: "14px", color: "#667eea" }}>
                ⏱️ {timeUsed}秒
              </span>
            </div>

            <button
              onClick={regenerateQuestions}
              style={{
                padding: "8px 16px",
                fontSize: "14px",
                background: "#FF9800",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              🔄 重置
            </button>
          </div>

          <MathClimbingGame
            total={total}
            current={progress}
            status={status}
            currentQuestion={current ? current.prompt : ""}
            onAnswerSubmit={handleAnswerSubmit}
            showVictory={done}
            questionCategory={current?.category}
            questionDifficulty={current?.difficulty}
            questionPoints={current?.points}
          />

          {/* 答题反馈 */}
          {explain && status !== "idle" && (
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
        </>
      )}
    </LessonRunner>
  )
}
