"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { CoinCashier } from "../../../components/CoinCashier"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"

export default function CashierPage() {
  const [price, setPrice] = useState(73)
  const [pay, setPay] = useState(100)
  const [stage, setStage] = useState(0)

  const steps = [
    "准备：确认商品价格与支付金额",
    "计算：支付 - 价格 = 找零",
    "找零：用最少的纸币/硬币组合"
  ]

  const onStep = (i: number) => setStage(i)

  const [viewMode, setViewMode] = useState<"optimal" | "explore">("optimal")

  return (
    <LessonRunner title="钱币与找零" skillId="math-cashier" intro={{ story: "在小卖部购物并找零。", goal: "能用面值凑整与找零", steps: ["输入价格与支付", "读出找零", "观察面值分解"] }} hints={{ build: ["输入价格", "输入支付"], map: ["读出找零与面值分解"], review: ["换一组数再试"] }} variantGen={(diff) => {
      const make = (p: number, g: number) => ({ label: `价格=${p} 支付=${g}`, apply: () => { setPrice(p); setPay(g); setStage(0) } })
      if (diff === "easy") return [make(23, 50), make(45, 100), make(12, 20)]
      if (diff === "medium") return [make(68, 100), make(125, 200), make(34, 50)]
      return [make(156, 200), make(289, 300), make(47, 100)]
    }} microTestGen={(diff) => {
      const change = Math.max(0, pay - price)
      const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
      if (diff === "easy") { items.push({ prompt: "求 找零 数量", placeholder: "输入金额", check: x => Math.abs(parseFloat(x) - change) < 1e-6 }) }
      else if (diff === "medium") { items.push({ prompt: `把 支付 改为 ${pay + 20} 的找零`, placeholder: "输入金额", check: x => Math.abs(parseFloat(x) - ((pay + 20) - price)) < 1e-6 }) }
      else { items.push({ prompt: `把 价格 改为 ${price - 5} 的找零`, placeholder: "输入金额", check: x => Math.abs(parseFloat(x) - (pay - (price - 5))) < 1e-6 }) }
      return items
    }} onEvaluate={() => ({ correct: true, text: `找零=${Math.max(0, pay - price)}` })}>
      <div className="flex flex-col items-center gap-8">
        <Narration avatar="/mascots/cat.svg" name="乐乐猫">买东西要算清楚找零哦！看看收银员是怎么找钱的。</Narration>

        <div className="controls flex gap-6 items-end">
          <div className="control flex flex-col gap-1">
            <label className="text-sm text-slate-500 font-bold">商品价格</label>
            <input
              type="number"
              className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-32 focus:border-blue-500 outline-none"
              value={price}
              onChange={e => { setPrice(parseFloat(e.target.value || "0")); setStage(0) }}
            />
          </div>
          <div className="control flex flex-col gap-1">
            <label className="text-sm text-slate-500 font-bold">支付金额</label>
            <input
              type="number"
              className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-32 focus:border-blue-500 outline-none"
              value={pay}
              onChange={e => { setPay(parseFloat(e.target.value || "0")); setStage(0) }}
            />
          </div>

          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("optimal")}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'optimal' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              最少张数
            </button>
            <button
              onClick={() => setViewMode("explore")}
              className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'explore' ? 'bg-white shadow text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              多种找法
            </button>
          </div>
        </div>

        <CoinCashier price={price} pay={pay} stage={stage} mode={viewMode} />
        <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
      </div>
    </LessonRunner>
  )
}