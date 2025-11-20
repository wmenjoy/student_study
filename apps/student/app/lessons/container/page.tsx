"use client"
import { useState, useRef, useEffect } from "react"
import { ContainerViz } from "../../../components/ContainerViz"
import { LessonRunner } from "../../../components/LessonRunner"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function ContainerPage() {
  const [bucketWeight, setBucketWeight] = useState(2)
  const [oilWeight, setOilWeight] = useState(14)
  const [stage, setStage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const fullWeight = bucketWeight + oilWeight
  const halfWeight = bucketWeight + oilWeight / 2

  const steps = [
    "步骤1：第一次称重——满桶油连桶",
    "步骤2：第二次称重——用去一半后",
    "步骤3：找差值——两次重量差",
    "步骤4：求桶重——总重减油重"
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
    if (stage === 0) return `一桶油连桶重${fullWeight}千克，先称一下！`
    if (stage === 1) return `用去一半油后，再称一次，现在是${halfWeight}千克。`
    if (stage === 2) return `两次重量差${fullWeight - halfWeight}千克，就是半桶油的重量！`
    if (stage === 3) return `知道油的重量，就能算出桶重啦！`
    return "试试改变数值，再算一次！"
  }

  return (
    <LessonRunner
      title="容量问题"
      skillId="math-container"
      intro={{
        story: "一桶油连桶称重，用去一半后再称一次。能通过两次称重算出桶有多重吗？",
        goal: "用两次称重的差值求桶重",
        steps: ["第一次称满桶", "第二次称半桶", "求差值算桶重"]
      }}
      hints={{
        build: ["输入桶重和油重", "观察两次称重"],
        map: ["点击评估", "读出计算过程"],
        review: ["重量差=半桶油", "全桶油=差值×2"]
      }}
      variantGen={(difficulty) => {
        const make = (bucket: number, oil: number) => ({
          label: `桶${bucket}kg,油${oil}kg`,
          apply: () => { setBucketWeight(bucket); setOilWeight(oil); setStage(0) }
        })
        if (difficulty === "easy") return [make(2, 14), make(3, 12), make(2, 10)]
        if (difficulty === "medium") return [make(4, 16), make(3, 18), make(5, 20)]
        return [make(6, 24), make(8, 32), make(5, 25)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>

        if (difficulty === "easy") {
          items.push({
            prompt: `半桶油重多少千克？`,
            placeholder: "输入重量",
            check: v => Math.abs(parseFloat(v) - oilWeight / 2) < 0.1
          })
          items.push({
            prompt: `桶重多少千克？`,
            placeholder: "输入重量",
            check: v => Math.abs(parseFloat(v) - bucketWeight) < 0.1
          })
        } else if (difficulty === "medium") {
          const newOil = oilWeight + 4
          const newFull = bucketWeight + newOil
          const newHalf = bucketWeight + newOil / 2
          items.push({
            prompt: `如果油重改为${newOil}kg，满桶连桶多重？`,
            placeholder: "输入重量",
            check: v => Math.abs(parseFloat(v) - newFull) < 0.1
          })
          items.push({
            prompt: `倒出2/3的油后，连桶重多少？`,
            placeholder: "输入重量",
            check: v => Math.abs(parseFloat(v) - (bucketWeight + oilWeight / 3)) < 0.1
          })
        } else {
          items.push({
            prompt: `一桶米连袋20kg，吃掉一半后15kg，袋重多少？`,
            placeholder: "输入重量",
            check: v => Math.abs(parseFloat(v) - 10) < 0.1
          })
          items.push({
            prompt: `上题米重多少？`,
            placeholder: "输入重量",
            check: v => Math.abs(parseFloat(v) - 10) < 0.1
          })
          items.push({
            prompt: `一桶水加到2倍重10kg，加到5倍重22kg，原有水多少kg？`,
            placeholder: "输入重量",
            check: v => Math.abs(parseFloat(v) - 4) < 0.1
          })
        }
        return items
      }}
      onEvaluate={() => ({
        correct: true,
        text: `半桶油=${fullWeight}-${halfWeight}=${oilWeight / 2}kg，全桶油=${oilWeight}kg，桶重=${fullWeight}-${oilWeight}=${bucketWeight}kg`
      })}
    >
      <Narration avatar="/mascots/cat.svg" name="乐乐猫">
        {getNarrationText()}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-600 font-bold">桶重（千克）</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-28 focus:border-slate-500 outline-none"
            value={bucketWeight}
            onChange={e => { setBucketWeight(Math.max(1, parseFloat(e.target.value || "1"))); setStage(0) }}
            min={1}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-amber-600 font-bold">油重（千克）</label>
          <input
            type="number"
            className="border-2 border-amber-200 rounded-lg px-3 py-2 text-lg font-mono w-28 focus:border-amber-500 outline-none"
            value={oilWeight}
            onChange={e => { setOilWeight(Math.max(2, parseFloat(e.target.value || "2"))); setStage(0) }}
            min={2}
            step={2}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-red-600 font-bold">满桶重量</label>
          <div className="border-2 border-red-100 bg-red-50 rounded-lg px-3 py-2 text-lg font-mono w-28 text-red-600 font-bold">
            {fullWeight}kg
          </div>
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-blue-600 font-bold">半桶重量</label>
          <div className="border-2 border-blue-100 bg-blue-50 rounded-lg px-3 py-2 text-lg font-mono w-28 text-blue-600 font-bold">
            {halfWeight}kg
          </div>
        </div>
      </div>

      <ContainerViz bucketWeight={bucketWeight} oilWeight={oilWeight} stage={stage} />

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />

      {/* Problem variations */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
        <h3 className="font-bold text-amber-800 mb-2">变形练习</h3>
        <div className="text-sm text-amber-700 space-y-2">
          <p><strong>加水问题:</strong> 桶加到2倍重10kg，加到5倍重22kg，原有水多少？</p>
          <p><strong>吃米问题:</strong> 一袋米连袋20kg，吃掉一半后15kg，袋重多少？</p>
          <p><strong>倒油问题:</strong> 甲桶48kg，乙桶12kg，倒多少能相等？</p>
        </div>
      </div>

      {/* Key formula */}
      {stage >= 3 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <h3 className="font-bold text-green-800 mb-2">解题关键</h3>
          <div className="text-green-700 space-y-1">
            <p className="font-mono">1. 重量差 = 半桶油重</p>
            <p className="font-mono">2. 全桶油 = 重量差 × 2</p>
            <p className="font-mono">3. 桶重 = 满桶重 - 全桶油重</p>
          </div>
          <div className="text-sm text-green-600 mt-2">
            💡 两次称重法：通过差值找到容器重量！
          </div>
        </div>
      )}
    </LessonRunner>
  )
}
