"use client"
import { useState } from "react"
import { NetWeight } from "../../../components/NetWeight"
import { LessonRunner } from "../../../components/LessonRunner"
import { mapNetWeight } from "../../../lib/mapping"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function NetWeightPage() {
  const [gb, setGb] = useState(30)
  const [ga, setGa] = useState(17)
  const [stage, setStage] = useState(0)
  const steps = ["准备：输入两次连同重量", "计算：半袋重=第一次−第二次", "计算：原物重=2×半袋重"]
  const onStep = (i: number) => { setStage(i) }
  return (
    <LessonRunner title="净重问题" skillId="math-net-weight" intro={{ story: "袋子里装着铜锣烧，拿出一半后再称重。", goal: "根据两次称重求出原物重量", steps: ["设置取出前后连同重量", "观察差值关系", "生成表达"] }} hints={{ build: ["输入第一次连同重量", "输入拿走一半后的连同重量"], map: ["点击评估", "读出‘原物重=2×(第一次−第二次)’"], review: ["换一个数值再试试"] }} variantGen={(diff) => {
      const make = (x: number, y: number) => ({ label: `前=${x} 后=${y}`, apply: () => { setGb(x); setGa(y) } })
      if (diff === "easy") return [make(30, 17), make(40, 22), make(50, 26)]
      if (diff === "medium") return [make(60, 33), make(70, 38), make(55, 29), make(80, 43)]
      return [make(100, 53), make(120, 62), make(90, 47), make(110, 58), make(140, 73)]
    }} microTestGen={(diff) => {
      const half = gb - ga
      const net = half * 2
      const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
      if (diff === "easy") { items.push({ prompt: "求 半袋重", placeholder: "输入重量", check: v => Math.abs(parseFloat(v) - half) < 1e-6 }); items.push({ prompt: "求 原物重", placeholder: "输入重量", check: v => Math.abs(parseFloat(v) - net) < 1e-6 }) }
      else if (diff === "medium") { items.push({ prompt: `把 第二次连同 重改为 ${ga + 2} 的原物重`, placeholder: "输入重量", check: v => Math.abs(parseFloat(v) - ((gb - (ga + 2)) * 2)) < 1e-6 }); items.push({ prompt: `把 第一次连同 重改为 ${gb + 5} 的原物重`, placeholder: "输入重量", check: v => Math.abs(parseFloat(v) - (((gb + 5) - ga) * 2)) < 1e-6 }) }
      else { items.push({ prompt: `解释：为何原物重=2×(第一次−第二次)？输入 yes`, placeholder: "输入yes", check: v => v.trim().toLowerCase() === "yes" }); items.push({ prompt: `把 两次称重都增加 3 的原物重`, placeholder: "输入重量", check: v => Math.abs(parseFloat(v) - (((gb + 3) - (ga + 3)) * 2)) < 1e-6 }) }
      return items
    }} onEvaluate={() => ({ correct: true, text: mapNetWeight(gb, ga) })}>
      <Narration avatar="/mascots/bear.svg" name="阿奇熊">先拿走一半再称，就能知道原来东西有多重。你来算算吧！</Narration>
      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">取出前连同重量</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-32 focus:border-blue-500 outline-none"
            value={gb}
            onChange={e => setGb(parseFloat(e.target.value || "0"))}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">取出半数后连同重量</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-32 focus:border-blue-500 outline-none"
            value={ga}
            onChange={e => setGa(parseFloat(e.target.value || "0"))}
          />
        </div>
      </div>
      <NetWeight grossBefore={gb} grossAfter={ga} stage={stage} />
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}