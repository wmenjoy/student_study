"use client"
import { RatioBar } from "../../../components/RatioBar"
import { useState, useRef, useEffect } from "react"
import { mapRatioState } from "../../../lib/mapping"
import { LessonRunner } from "../../../components/LessonRunner"
import { guidanceFor } from "../../../lib/microGuidance"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function RatioLessonPage() {
  const [a, setA] = useState(6)
  const [k, setK] = useState(2)
  const [stage, setStage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const steps = [
    "步骤1：准备——设置基准量A和倍数k",
    "步骤2：观察——看看B是A的几倍",
    "步骤3：计算差值——B和A相差多少"
  ]

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => { return () => clearTimer() }, [])

  const onStep = (i: number) => {
    setStage(i)
    clearTimer()
  }

  return (
    <LessonRunner
      title="比例条"
      skillId="math-ratio"
      intro={{
        story: "两位好朋友比拼收集贴纸，蓝色是基准A，橙色是A的倍数k。",
        goal: "用条形表示倍数关系，读出差值并写成等式",
        steps: ["设置A与k", "拖动圆点调整长度", "点击评估生成口语与等式"]
      }}
      onVariant={() => { setA(Math.floor(4 + Math.random() * 8)); setK(parseFloat((1 + Math.random() * 3).toFixed(2))); setStage(0) }}
      hints={{
        build: ["在输入框设置A和k", "拖动橙色圆点改变长度", "观察差值标签的变化"],
        map: ["点击'生成表达并评估'", "大声读出口语'B是A的k倍'", "写下等式 B=k·A"],
        review: ["想一想：如果k变大，差值会怎样？", "把结果记录到小本子"]
      }}
      variantGen={(diff) => {
        const make = (A: number, k: number) => ({ label: `A=${A}, k=${k.toFixed(2)}`, apply: () => { setA(A); setK(k); setStage(0) } })
        if (diff === "easy") return [make(4, 1.5), make(6, 2), make(5, 1)]
        if (diff === "medium") return [make(7, 1.8), make(9, 2.5), make(8, 1.2), make(6, 2.2)]
        return [make(12, 2.75), make(15, 1.6), make(10, 3.2), make(9, 2.1), make(11, 1.33)]
      }}
      variantCount={5}
      microTestGen={(diff) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        if (diff === "easy") {
          items.push({ prompt: `已知 A=${a}, k=${k.toFixed(2)}，求 B`, placeholder: "输入B", check: v => Math.abs(parseFloat(v) - a * k) < 1e-6 })
          items.push({ prompt: `已知 A=${a}, B=${(a * k).toFixed(2)}，求 差`, placeholder: "输入差值", check: v => Math.abs(parseFloat(v) - Math.abs(a * k - a)) < 1e-6 })
        } else if (diff === "medium") {
          items.push({ prompt: `已知 A=${a}，B=${(a * k).toFixed(2)}，求 k`, placeholder: "输入k", check: v => Math.abs(parseFloat(v) - (a * k) / a) < 1e-6 })
          items.push({ prompt: `把 k 加 0.5 后的新 B`, placeholder: "输入B", check: v => Math.abs(parseFloat(v) - a * (k + 0.5)) < 1e-6 })
          items.push({ prompt: `把 A 乘 2 后的新 差`, placeholder: "输入差值", check: v => Math.abs(parseFloat(v) - Math.abs(2 * a * k - 2 * a)) < 1e-6 })
        } else {
          items.push({ prompt: `已知 A=${a}, k=${k.toFixed(2)}，求 B 与 差 的和`, placeholder: "输入和", check: v => Math.abs(parseFloat(v) - (a * k + Math.abs(a * k - a))) < 1e-6 })
          items.push({ prompt: `把 k 改为 ${(k + 0.25).toFixed(2)} 的新 B`, placeholder: "输入B", check: v => Math.abs(parseFloat(v) - a * (k + 0.25)) < 1e-6 })
          items.push({ prompt: `把 A 改为 ${a + 3} 的新 B`, placeholder: "输入B", check: v => Math.abs(parseFloat(v) - (a + 3) * k) < 1e-6 })
        }
        return items
      }}
      onEvaluate={() => {
        const valid = a > 0 && k > 0
        const text = mapRatioState({ base: a, ratio: k })
        const hint = valid ? guidanceFor("ratio_ok") : guidanceFor("ratio_invalid")
        return { correct: valid, text, hint }
      }}
    >
      <Narration avatar="/mascots/bear.svg" name="阿奇熊">
        {stage === 0 && "蓝色是我的贴纸，橙色是朋友的。请帮我看看橙色是不是蓝色的 k 倍！"}
        {stage === 1 && "拖动红色圆点试试吧！看看B是A的几倍。"}
        {stage === 2 && "现在算算B和A相差多少。差值 = B - A 或 A - B。"}
      </Narration>
      <div className="controls">
        <div className="control">
          <label>基准量 A</label>
          <input type="number" value={a} onChange={e => setA(parseFloat(e.target.value || "0"))} />
        </div>
        <div className="control">
          <label>倍数 k</label>
          <input type="number" value={k} onChange={e => setK(parseFloat(e.target.value || "0"))} />
        </div>
      </div>
      <RatioBar base={a} ratio={k} onChange={(na, nk) => { setA(na); setK(nk) }} stage={stage} />
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}