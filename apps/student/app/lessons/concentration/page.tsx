"use client"
import { useState, useRef, useEffect } from "react"
import { ConcentrationViz } from "../../../components/ConcentrationViz"
import { LessonRunner } from "../../../components/LessonRunner"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function ConcentrationPage() {
  const [saltWeight, setSaltWeight] = useState(20)
  const [waterWeight, setWaterWeight] = useState(180)
  const [stage, setStage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate results
  const totalWeight = saltWeight + waterWeight
  const concentration = (saltWeight / totalWeight) * 100

  const steps = [
    "步骤1：理解题意——盐和水各多少",
    "步骤2：混合溶解——盐溶解在水中",
    "步骤3：计算总重——盐+水=盐水",
    "步骤4：求浓度——盐÷总重×100%"
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

  const getNarrationText = () => {
    if (stage === 0) return "我们来配一杯盐水！先准备好盐和水。"
    if (stage === 1) return "把盐倒进水里，搅一搅，盐就溶解啦！"
    if (stage === 2) return "盐水的总重量等于盐加上水的重量。"
    if (stage === 3) return "浓度就是盐占整杯盐水的百分比！"
    return "改变盐或水的量，看看浓度怎么变！"
  }

  return (
    <LessonRunner
      title="浓度问题"
      skillId="math-concentration"
      intro={{
        story: "配制盐水需要盐和水。想知道这杯盐水有多咸吗？我们用浓度来表示！",
        goal: "理解浓度的概念，用公式计算浓度",
        steps: ["输入盐和水的重量", "观察溶解过程", "计算浓度百分比"]
      }}
      hints={{
        build: ["输入盐的重量", "输入水的重量"],
        map: ["点击评估", "读出浓度百分比"],
        review: ["浓度 = 盐 ÷ 盐水 × 100%", "盐水 = 盐 + 水"]
      }}
      variantGen={(difficulty) => {
        // Generate problems with nice concentration percentages
        const make = (salt: number, water: number) => ({
          label: `盐${salt}g, 水${water}g`,
          apply: () => { setSaltWeight(salt); setWaterWeight(water); setStage(0) }
        })
        if (difficulty === "easy") return [make(20, 180), make(10, 90), make(15, 85), make(25, 75)]
        if (difficulty === "medium") return [make(30, 120), make(40, 160), make(25, 225), make(12, 88)]
        return [make(45, 255), make(36, 144), make(50, 200), make(18, 162), make(24, 96)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>

        if (difficulty === "easy") {
          items.push({
            prompt: `盐水总重多少克？`,
            placeholder: "输入克数",
            check: v => Math.abs(parseFloat(v) - totalWeight) < 0.1
          })
          items.push({
            prompt: `浓度是百分之几？`,
            placeholder: "输入百分比",
            check: v => Math.abs(parseFloat(v) - concentration) < 0.5
          })
        } else if (difficulty === "medium") {
          // Add more salt
          const addSalt = 10
          const newConc = ((saltWeight + addSalt) / (totalWeight + addSalt)) * 100
          items.push({
            prompt: `再加${addSalt}克盐，浓度变成百分之几？`,
            placeholder: "输入百分比",
            check: v => Math.abs(parseFloat(v) - newConc) < 0.5
          })
          // Add more water
          const addWater = 50
          const newConc2 = (saltWeight / (totalWeight + addWater)) * 100
          items.push({
            prompt: `再加${addWater}克水，浓度变成百分之几？`,
            placeholder: "输入百分比",
            check: v => Math.abs(parseFloat(v) - newConc2) < 0.5
          })
        } else {
          // Reverse problem
          items.push({
            prompt: `要配制浓度20%的盐水200克，需要盐多少克？`,
            placeholder: "输入克数",
            check: v => Math.abs(parseFloat(v) - 40) < 0.1
          })
          items.push({
            prompt: `上题需要水多少克？`,
            placeholder: "输入克数",
            check: v => Math.abs(parseFloat(v) - 160) < 0.1
          })
          // Mix two solutions
          items.push({
            prompt: `100克10%盐水和100克20%盐水混合，浓度是多少？`,
            placeholder: "输入百分比",
            check: v => Math.abs(parseFloat(v) - 15) < 0.5
          })
        }
        return items
      }}
      onEvaluate={() => ({
        correct: true,
        text: `盐水总重 = ${saltWeight} + ${waterWeight} = ${totalWeight}克，浓度 = ${saltWeight} ÷ ${totalWeight} × 100% = ${concentration.toFixed(1)}%`
      })}
    >
      <Narration avatar="/mascots/bear.svg" name="智慧熊">
        {getNarrationText()}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-amber-600 font-bold">盐（克）</label>
          <input
            type="number"
            className="border-2 border-amber-200 rounded-lg px-3 py-2 text-lg font-mono w-28 focus:border-amber-500 outline-none"
            value={saltWeight}
            onChange={e => { setSaltWeight(Math.max(1, parseFloat(e.target.value || "1"))); setStage(0) }}
            min={1}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-blue-600 font-bold">水（克）</label>
          <input
            type="number"
            className="border-2 border-blue-200 rounded-lg px-3 py-2 text-lg font-mono w-28 focus:border-blue-500 outline-none"
            value={waterWeight}
            onChange={e => { setWaterWeight(Math.max(1, parseFloat(e.target.value || "1"))); setStage(0) }}
            min={1}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-green-600 font-bold">浓度</label>
          <div className="border-2 border-green-100 bg-green-50 rounded-lg px-3 py-2 text-lg font-mono w-28 text-green-600 font-bold">
            {concentration.toFixed(1)}%
          </div>
        </div>
      </div>

      <ConcentrationViz saltWeight={saltWeight} waterWeight={waterWeight} stage={stage} />

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />

      {/* Problem variations */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
        <h3 className="font-bold text-amber-800 mb-2">变形练习</h3>
        <div className="text-sm text-amber-700 space-y-2">
          <p><strong>加盐问题:</strong> 加盐后浓度变大</p>
          <p><strong>加水问题:</strong> 加水后浓度变小（稀释）</p>
          <p><strong>混合问题:</strong> 两种盐水混合后的浓度</p>
          <p><strong>蒸发问题:</strong> 水蒸发后浓度变大</p>
        </div>
      </div>

      {/* Key formula reminder */}
      {stage >= 3 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <h3 className="font-bold text-green-800 mb-2">核心公式</h3>
          <div className="text-green-700 space-y-1">
            <p className="font-mono">浓度 = 溶质 ÷ 溶液 × 100%</p>
            <p className="font-mono">溶液 = 溶质 + 溶剂（盐水 = 盐 + 水）</p>
          </div>
          <div className="text-sm text-green-600 mt-2">
            💡 记住：浓度是溶质占溶液的百分比，不是占溶剂的！
          </div>
        </div>
      )}
    </LessonRunner>
  )
}
