"use client"
import { useState, useRef, useEffect } from "react"
import { MoveEqual } from "../../../components/MoveEqual"
import { LessonRunner } from "../../../components/LessonRunner"
import { mapMoveEqual } from "../../../lib/mapping"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function MoveEqualPage() {
  const [a, setA] = useState(40)
  const [b, setB] = useState(28)
  const [stage, setStage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const steps = [
    "步骤1：准备——设置A与B的数量",
    "步骤2：计算——找出差值和转移量",
    "步骤3：结果——转移后相等"
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
      title="移多补少"
      skillId="math-move-equal"
      intro={{
        story: "两堆糖不一样多，通过转移让它们一样多。",
        goal: "找出需要转移的数量",
        steps: ["设置两堆数量", "读出转移量", "生成表达"]
      }}
      hints={{
        build: ["输入A与B", "观察差值A−B"],
        map: ["点击评估", "读出'转移量=(A−B)/2'"],
        review: ["把A与B互换再试试"]
      }}
      variantGen={(diff) => {
        const make = (x: number, y: number) => ({ label: `A=${x} B=${y}`, apply: () => { setA(x); setB(y); setStage(0) } })
        if (diff === "easy") return [make(40, 28), make(20, 12), make(18, 10)]
        if (diff === "medium") return [make(50, 35), make(60, 44), make(72, 60), make(30, 18)]
        return [make(100, 64), make(96, 80), make(88, 70), make(120, 84), make(54, 30)]
      }}
      microTestGen={(diff) => {
        const m = Math.abs(a - b) / 2
        const eq = (a + b) / 2
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        if (diff === "easy") {
          items.push({ prompt: "求 需要转移 的数量", placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - m) < 1e-6 })
          items.push({ prompt: "转移后每堆的数量是多少？", placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - eq) < 1e-6 })
        } else if (diff === "medium") {
          items.push({ prompt: `把 A 增加 4 后新的转移量`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - Math.abs((a + 4) - b) / 2) < 1e-6 })
          items.push({ prompt: `把 B 减少 2 后新的相等值`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - ((a + (b - 2)) / 2)) < 1e-6 })
        } else {
          items.push({ prompt: `解释：为何转移量=(A−B)/2？输入 yes`, placeholder: "输入yes", check: v => v.trim().toLowerCase() === "yes" })
          items.push({ prompt: `把 A 与 B 都加 3 后新的相等值`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - (((a + 3) + (b + 3)) / 2)) < 1e-6 })
        }
        return items
      }}
      onEvaluate={() => ({ correct: true, text: mapMoveEqual(a, b) })}
    >
      <Narration avatar="/mascots/cat.svg" name="乐乐猫">
        {stage === 0 && "把多的那一堆分一些到另一堆，让它们一样多。你能算出要转移多少吗？"}
        {stage === 1 && "看！差值是 " + Math.abs(a - b) + "，转移量就是差值的一半！"}
        {stage === 2 && "转移后，两堆都变成了 " + ((a + b) / 2) + "，完全相等啦！"}
      </Narration>
      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">A 的数量</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-32 focus:border-blue-500 outline-none"
            value={a}
            onChange={e => { setA(parseFloat(e.target.value || "0")); setStage(0) }}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">B 的数量</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-32 focus:border-blue-500 outline-none"
            value={b}
            onChange={e => { setB(parseFloat(e.target.value || "0")); setStage(0) }}
          />
        </div>
      </div>
      <MoveEqual a={a} b={b} stage={stage} />
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}