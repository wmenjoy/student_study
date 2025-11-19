"use client"
import { useEffect, useState } from "react"
import { updateSkill, nextExercise } from "../lib/adaptive"
import { GuideBanner } from "./GuideBanner"
import { StepPlayer } from "./StepPlayer"
import { VariantPanel } from "./VariantPanel"
import { MicroQuiz } from "./MicroQuiz"
import { LessonShell } from "./LessonShell"

type Eval = { correct: boolean; text: string; hint?: string }
type Props = {
  title: string
  skillId: string
  onEvaluate: () => Eval
  children: React.ReactNode
  intro?: { story: string; goal: string; steps: string[] }
  onVariant?: () => void
  hints?: { build: string[]; map: string[]; microtest?: string[]; review?: string[] }
  variantGen?: (difficulty: "easy" | "medium" | "hard") => Array<{ label: string; apply: () => void }>
  variantCount?: number
  microTestGen?: (difficulty: "easy" | "medium" | "hard") => Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
}

export function LessonRunner({ title, skillId, onEvaluate, children, intro, onVariant, hints, variantGen, variantCount = 3, microTestGen }: Props) {
  const [state, setState] = useState<"intro" | "build" | "map" | "microtest" | "review">("intro")
  const [text, setText] = useState("")
  const [hint, setHint] = useState("")
  const [nextInfo, setNextInfo] = useState<{ difficulty: string } | null>(null)
  const [stars, setStars] = useState(0)
  const [variants, setVariants] = useState<Array<{ label: string; apply: () => void }>>([])
  const [quizItems, setQuizItems] = useState<Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>>([])

  const go = (s: typeof state) => setState(s)
  const runEval = async () => {
    const res = onEvaluate()
    setText(res.text)
    setHint(res.hint || "")
    await updateSkill(skillId, res.correct)
    const nx = await nextExercise(skillId)
    setNextInfo(nx)
    if (res.correct) setStars(s => s + 1)
    setState("review")
  }
  useEffect(() => {
    const init = async () => {
      if (!variantGen) return
      const nx = await nextExercise(skillId)
      const diff = (nx.difficulty as "easy" | "medium" | "hard")
      const all = variantGen(diff)
      setVariants(all.slice(0, variantCount))
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const loadQuiz = async () => {
      if (!microTestGen || state !== "microtest") return
      const nx = await nextExercise(skillId)
      const diff = (nx.difficulty as "easy" | "medium" | "hard")
      const items = microTestGen(diff)
      setQuizItems(items)
    }
    loadQuiz()
  }, [state])

  const speak = (msg: string) => {
    if (typeof window === "undefined") return
    const s = new SpeechSynthesisUtterance(msg)
    s.lang = "zh-CN"
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(s)
  }

  const tabs = [
    { id: "intro", label: "引导" },
    { id: "build", label: "操作" },
    { id: "map", label: "图→式" },
    { id: "microtest", label: "微测" },
    { id: "review", label: "复盘" }
  ] as const

  return (
    <LessonShell title={title} action={stars > 0 && <span className="star">⭐ × {stars}</span>}>
      <div className="tab-controls">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`tab-btn ${state === t.id ? "active" : ""}`}
            onClick={() => go(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {state === "intro" && (
        <div className="intro-block">
          {intro && (
            <div>
              <div className="intro-title">故事背景</div>
              <div>{intro.story}</div>
              <div className="intro-title" style={{ marginTop: 12 }}>小目标</div>
              <div>{intro.goal}</div>
              <div className="intro-title" style={{ marginTop: 12 }}>怎么玩</div>
              <ul className="intro-list">
                {intro.steps.map((t, i) => (<li key={i}>{t}</li>))}
              </ul>
              <div className="controls" style={{ marginTop: 16 }}>
                <button className="btn" onClick={() => go("build")}>开始任务</button>
                <button className="btn ghost" onClick={() => {
                  speak(`${intro.story}。目标是：${intro.goal}。步骤：${intro.steps.join("，")}`)
                }}>语音讲解</button>
              </div>
            </div>
          )}
        </div>
      )}
      {state !== "review" && children}
      {state === "map" && (
        <div className="controls">
          <button className="btn" onClick={runEval}>生成表达并评估</button>
          {onVariant && (
            <button className="btn ghost" onClick={onVariant}>变形题</button>
          )}
        </div>
      )}
      {variantGen && (
        <VariantPanel
          items={variants}
          onRefresh={async () => {
            const nx = await nextExercise(skillId)
            const diff = (nx.difficulty as "easy" | "medium" | "hard")
            const all = variantGen(diff)
            setVariants(all.slice(0, variantCount))
          }}
        />
      )}
      {state === "build" && hints?.build && <GuideBanner stage="操作" hints={hints.build} onSpeak={speak} />}
      {state === "map" && hints?.map && <GuideBanner stage="图→式" hints={hints.map} onSpeak={speak} />}
      {state === "microtest" && hints?.microtest && <GuideBanner stage="微测" hints={hints.microtest} onSpeak={speak} />}
      {state === "microtest" && microTestGen && (
        <MicroQuiz items={quizItems} onFinish={async (c, tot) => {
          const ok = c / tot >= 0.8
          await updateSkill(skillId, ok)
          const nx = await nextExercise(skillId)
          setNextInfo(nx)
          setState("review")
        }} />
      )}
      {state === "review" && hints?.review && <GuideBanner stage="复盘" hints={hints.review} onSpeak={speak} />}
      {state === "build" && hints?.build && <StepPlayer steps={hints.build} title="跟随演示" />}
      {state === "map" && hints?.map && <StepPlayer steps={hints.map} title="跟随演示" />}
      {state === "review" && (
        <div>
          <div className="hint">{hint}</div>
          <pre>{text}</pre>
          {nextInfo && <div className="hint">下一题建议难度：{nextInfo.difficulty}</div>}
        </div>
      )}
    </LessonShell>
  )
}