"use client"
import { useState, useRef, useEffect } from "react"
import { SumDiff } from "../../../components/SumDiff"
import { LessonRunner } from "../../../components/LessonRunner"
import { mapSumDiff } from "../../../lib/mapping"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function SumDiffPage() {
  const [total, setTotal] = useState(92)
  const [diff, setDiff] = useState(16)
  const [stage, setStage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const steps = [
    "步骤1：准备——设置总和与差值",
    "步骤2：计算A——A = (总和 + 差) ÷ 2",
    "步骤3：计算B——B = (总和 - 差) ÷ 2"
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
      title="和差问题"
      skillId="math-sum-diff"
      intro={{
        story: "两只小熊采苹果的总数与差值已知。",
        goal: "用条形图求出各自的数量",
        steps: ["设置总和与差值", "观察两条长度", "生成表达"]
      }}
      hints={{
        build: ["输入总和与差值", "观察谁更长"],
        map: ["点击评估", "读出A与B的数值"],
        review: ["把差值改小或改大，再观察"]
      }}
      variantGen={(difficulty) => {
        const make = (t: number, d: number) => ({ label: `和=${t} 差=${d}`, apply: () => { setTotal(t); setDiff(d); setStage(0) } })
        if (difficulty === "easy") return [make(92, 16), make(40, 10), make(30, 6)]
        if (difficulty === "medium") return [make(76, 12), make(64, 8), make(50, 14), make(60, 20)]
        return [make(120, 18), make(150, 26), make(200, 40), make(96, 24), make(84, 30)]
      }}
      microTestGen={(difficulty) => {
        const A = (total + diff) / 2
        const B = (total - diff) / 2
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        if (difficulty === "easy") {
          items.push({ prompt: "求 A 的数量", placeholder: "输入A", check: v => Math.abs(parseFloat(v) - A) < 1e-6 })
          items.push({ prompt: "求 B 的数量", placeholder: "输入B", check: v => Math.abs(parseFloat(v) - B) < 1e-6 })
        } else if (difficulty === "medium") {
          items.push({ prompt: `把 差 改为 ${diff + 4} 的新 A`, placeholder: "输入A", check: v => Math.abs(parseFloat(v) - ((total + (diff + 4)) / 2)) < 1e-6 })
          items.push({ prompt: `把 和 改为 ${total + 10} 的新 B`, placeholder: "输入B", check: v => Math.abs(parseFloat(v) - (((total + 10) - diff) / 2)) < 1e-6 })
        } else {
          items.push({ prompt: `A 与 B 的和是多少？`, placeholder: "输入和", check: v => Math.abs(parseFloat(v) - (A + B)) < 1e-6 })
          items.push({ prompt: `A 与 B 的差是多少？`, placeholder: "输入差", check: v => Math.abs(parseFloat(v) - (A - B)) < 1e-6 })
          items.push({ prompt: `解释：为何 A=(和+差)/2？输入 yes`, placeholder: "输入yes", check: v => v.trim().toLowerCase() === "yes" })
        }
        return items
      }}
      onEvaluate={() => ({ correct: true, text: mapSumDiff(total, diff) })}
    >
      <Narration avatar="/mascots/bear.svg" name="阿奇熊">
        {stage === 0 && "总数和差值都告诉你啦！把两条摆出来，看谁长一点。"}
        {stage === 1 && "先算出较大的数A。用公式：A = (总和 + 差) ÷ 2"}
        {stage === 2 && "再算出较小的数B。用公式：B = (总和 - 差) ÷ 2"}
      </Narration>
      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">总和</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-32 focus:border-blue-500 outline-none"
            value={total}
            onChange={e => { setTotal(parseFloat(e.target.value || "0")); setStage(0) }}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">差</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-32 focus:border-blue-500 outline-none"
            value={diff}
            onChange={e => { setDiff(parseFloat(e.target.value || "0")); setStage(0) }}
          />
        </div>
      </div>
      <SumDiff total={total} diff={diff} stage={stage} />
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}