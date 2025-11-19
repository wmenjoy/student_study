"use client"
import { useState } from "react"
import { Pairing } from "../../../components/Pairing"
import { LessonRunner } from "../../../components/LessonRunner"
import { mapPairing } from "../../../lib/mapping"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function PairingPage() {
  const [a, setA] = useState(3)
  const [b, setB] = useState(4)
  const [stage, setStage] = useState(0)

  const steps = [
    "准备：确认两类物品的数量",
    "计数：每一个格子代表一种搭配",
    "总结：总搭配数 = 行数 × 列数"
  ]

  const onStep = (i: number) => setStage(i)
  const [viewMode, setViewMode] = useState<"connection" | "grid">("connection")

  return (
    <LessonRunner title="搭配问题" skillId="math-pairing" intro={{ story: "公主在挑裙子和水晶鞋的搭配。", goal: "用网格图数出所有搭配方法", steps: ["设置两类物品的种数", "观察网格数量", "生成表达"] }} hints={{ build: ["输入A与B的种数", "观察网格格数"], map: ["点击评估", "读出‘总搭配=A×B’"], review: ["把某一类的种数加1观察变化"] }} variantGen={(diff) => {
      const make = (x: number, y: number) => ({ label: `A=${x} B=${y}`, apply: () => { setA(x); setB(y); setStage(0) } })
      if (diff === "easy") return [make(3, 4), make(2, 5), make(4, 3)]
      if (diff === "medium") return [make(5, 6), make(6, 4), make(7, 3), make(8, 5)]
      return [make(10, 6), make(9, 7), make(12, 5), make(11, 8), make(13, 9)]
    }} microTestGen={(diff) => {
      const total = a * b
      const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
      if (diff === "easy") { items.push({ prompt: "求 总搭配 数量", placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - total) < 1e-6 }); items.push({ prompt: `把 A 改为 ${a + 1} 的新总搭配`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - ((a + 1) * b)) < 1e-6 }) }
      else if (diff === "medium") { items.push({ prompt: `把 B 改为 ${b + 2} 的新总搭配`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - (a * (b + 2))) < 1e-6 }); items.push({ prompt: `把 A 与 B 都加 1 的新总搭配`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - ((a + 1) * (b + 1))) < 1e-6 }) }
      else { items.push({ prompt: `解释：为何总搭配=A×B？输入 yes`, placeholder: "输入yes", check: v => v.trim().toLowerCase() === "yes" }); items.push({ prompt: `把 A 乘 2 的新总搭配`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - ((2 * a) * b)) < 1e-6 }) }
      return items
    }} onEvaluate={() => ({ correct: true, text: mapPairing(a, b) })}>
      <div className="flex flex-col items-center gap-8">
        <Narration avatar="/mascots/cat.svg" name="乐乐猫">
          {stage === 0 && "准备：确认两类物品的数量。"}
          {stage === 1 && "计数：每一个连线/格子代表一种搭配。"}
          {stage === 2 && "总结：总搭配数 = A的数量 × B的数量。"}
        </Narration>

        <div className="controls flex gap-6 items-end">
          <div className="control flex flex-col gap-1">
            <label className="text-sm text-slate-500 font-bold">物品 A 数量</label>
            <input
              type="number"
              className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
              value={a}
              onChange={e => { setA(parseFloat(e.target.value || "0")); setStage(0) }}
            />
          </div>
          <div className="control flex flex-col gap-1">
            <label className="text-sm text-slate-500 font-bold">物品 B 数量</label>
            <input
              type="number"
              className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
              value={b}
              onChange={e => { setB(parseFloat(e.target.value || "0")); setStage(0) }}
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("connection")}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'connection' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              连线图
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              网格图
            </button>
          </div>
        </div>

        <Pairing a={a} b={b} stage={stage} mode={viewMode} />
        <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
      </div>
    </LessonRunner>
  )
}