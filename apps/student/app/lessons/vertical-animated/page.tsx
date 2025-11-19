"use client"
import { useState, useEffect } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { VerticalAddSubAnimated } from "../../../components/VerticalAddSubAnimated"
import { StepPlayer } from "../../../components/StepPlayer"
import { verticalScript } from "../../../lib/stepdsl"
import { Narration } from "../../../components/Narration"

export default function VerticalAnimatedPage() {
  const [a, setA] = useState(456)
  const [b, setB] = useState(278)
  const [op, setOp] = useState<"+" | "-">("+")
  const [stage, setStage] = useState(0)
  const steps = verticalScript.labels

  const onStep = (i: number) => setStage(i)

  // Speak function
  const speak = (msg: string) => {
    if (typeof window !== 'undefined') {
      const u = new SpeechSynthesisUtterance(msg)
      u.lang = 'zh-CN'
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    }
  }

  // Effect for narration and events
  useEffect(() => {
    const narrationText = verticalScript.narration[stage] || ''

    const digits = (n: number) => String(Math.floor(Math.abs(n))).split("").map(x => parseInt(x))
    const len = Math.max(digits(a).length, digits(b).length)
    const colIndex = (stage >= 1 && stage <= len) ? (len - stage) : -1
    const aDigit = colIndex >= 0 ? parseInt(String(Math.floor(Math.abs(a))).padStart(len, "0")[colIndex]) : 0
    const bDigit = colIndex >= 0 ? parseInt(String(Math.floor(Math.abs(b))).padStart(len, "0")[colIndex]) : 0

    let eventText = ""
    if (colIndex >= 0) {
      const ev = verticalScript.events?.[stage] || ""
      if (ev === "carry_or_borrow") {
        if (op === "+") {
          eventText = (aDigit + bDigit) >= 10 ? "注意：本列产生进位" : "注意：本列不进位"
        } else {
          eventText = aDigit < bDigit ? "注意：本列需要借位" : "注意：本列不借位"
        }
      }
    }

    const fullText = [narrationText, eventText].filter(Boolean).join("。")
    if (fullText) {
      speak(fullText)
    }
  }, [stage, a, b, op])

  // Helper for event text display
  const getEventText = () => {
    const digits = (n: number) => String(Math.floor(Math.abs(n))).split("").map(x => parseInt(x))
    const len = Math.max(digits(a).length, digits(b).length)
    const colIndex = (stage >= 1 && stage <= len) ? (len - stage) : -1
    const aDigit = colIndex >= 0 ? parseInt(String(Math.floor(Math.abs(a))).padStart(len, "0")[colIndex]) : 0
    const bDigit = colIndex >= 0 ? parseInt(String(Math.floor(Math.abs(b))).padStart(len, "0")[colIndex]) : 0

    if (colIndex < 0) return ""
    const ev = verticalScript.events?.[stage] || ""
    if (ev === "carry_or_borrow") {
      if (op === "+") return (aDigit + bDigit) >= 10 ? "事件：本列产生进位" : "事件：本列不进位"
      return aDigit < bDigit ? "事件：本列需要借位" : "事件：本列不借位"
    }
    return ""
  }

  const eventText = getEventText()

  return (
    <LessonRunner
      title="竖式进/借位动画"
      skillId="math-vertical-animated"
      intro={{ story: "用动画理解进位与借位。", goal: "会逐列计算并理解进/借位", steps: steps }}
      hints={verticalScript.hints}
      variantGen={(diff) => {
        const make = (x: number, y: number, opx: "+" | "-") => ({ label: `${x} ${opx} ${y}`, apply: () => { setA(x); setB(y); setOp(opx); setStage(0) } })
        if (diff === "easy") return [make(124, 208, "+"), make(532, 124, "-"), make(250, 350, "+")]
        if (diff === "medium") return [make(456, 278, "+"), make(705, 389, "-"), make(389, 512, "+")]
        return [make(999, 888, "+"), make(1000, 999, "-"), make(876, 543, "+")]
      }}
      microTestGen={(diff) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        const res = op === "+" ? a + b : a - b
        const digits = (n: number) => String(Math.floor(Math.abs(n))).split("").map(x => parseInt(x))
        const len = Math.max(digits(a).length, digits(b).length)
        const colIndex = (stage >= 1 && stage <= len) ? (len - stage) : (len - 1)
        const aDigit = parseInt(String(Math.floor(Math.abs(a))).padStart(len, "0")[colIndex])
        const bDigit = parseInt(String(Math.floor(Math.abs(b))).padStart(len, "0")[colIndex])
        const carriedFromRight = (() => {
          if (op === "+") return (aDigit + bDigit) >= 10
          return aDigit < bDigit
        })()
        if (diff === "easy") { items.push({ prompt: "结果是多少？", placeholder: "输入结果", check: x => Math.abs(parseFloat(x) - res) < 1e-6 }) }
        else if (diff === "medium") { items.push({ prompt: "当前列是否进位/借位（yes/no）", placeholder: "yes 或 no", check: x => ((carriedFromRight ? "yes" : "no") === (x.toLowerCase())) }) }
        else {
          const outDigit = (() => {
            if (op === "+") return (aDigit + bDigit) % 10
            let top = aDigit
            if (aDigit < bDigit) top += 10
            return top - bDigit
          })()
          items.push({ prompt: "这一列的结果是多少？", placeholder: "输入0-9", check: x => parseInt(x) === outDigit })
        }
        return items
      }}
      onEvaluate={() => ({ correct: true, text: `结果=${op === "+" ? a + b : a - b}` })}
    >
      <Narration avatar="/icons/ratio.svg" name="老师">{verticalScript.narration[stage] || "请观察竖式计算过程"}</Narration>
      {eventText && <Narration avatar="/icons/ratio.svg" name="事件">{eventText}</Narration>}

      <div className="controls">
        <div className="control"><label>上</label><input type="number" value={a} onChange={e => setA(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>下</label><input type="number" value={b} onChange={e => setB(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>运算</label><select value={op} onChange={e => setOp(e.target.value as any)}><option value="+">加</option><option value="-">减</option></select></div>
      </div>

      <VerticalAddSubAnimated a={a} b={b} op={op} stage={stage} />

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} durations={verticalScript.durations} auto />
    </LessonRunner>
  )
}