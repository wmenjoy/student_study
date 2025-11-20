"use client"
import { useState, useRef, useEffect } from "react"
import { EngineeringViz } from "../../../components/EngineeringViz"
import { LessonRunner } from "../../../components/LessonRunner"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function EngineeringPage() {
  const [daysA, setDaysA] = useState(6)
  const [daysB, setDaysB] = useState(12)
  const [stage, setStage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate results
  const rateA = 1 / daysA
  const rateB = 1 / daysB
  const combinedRate = rateA + rateB
  const combinedDays = 1 / combinedRate

  const steps = [
    "步骤1：理解题意——各自需要多少天",
    "步骤2：求工作效率——每天完成多少",
    "步骤3：合作效率——两人效率相加",
    "步骤4：计算时间——1÷合作效率"
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
    if (stage === 0) return `甲${daysA}天能完成，乙${daysB}天能完成。如果他们一起做会更快吗？`
    if (stage === 1) return "先算每人每天能做多少。把整个工程看作'1'，甲每天做1/" + daysA + "！"
    if (stage === 2) return "两人一起做，效率就是两个效率加起来！速度更快了！"
    if (stage === 3) return "用1除以合作效率，就是合作需要的天数啦！"
    return "试试改变天数，看看结果会怎么变！"
  }

  return (
    <LessonRunner
      title="工程问题"
      skillId="math-engineering"
      intro={{
        story: "一项工程，甲单独做需要几天，乙单独做需要几天。如果甲乙合作，需要多少天？",
        goal: "理解工作效率概念，用公式计算合作时间",
        steps: ["设置各自完成天数", "计算每人的效率", "求合作时间"]
      }}
      hints={{
        build: ["输入甲单独完成的天数", "输入乙单独完成的天数"],
        map: ["点击评估", "读出合作完成的天数"],
        review: ["关键：把工程总量看作1", "效率 = 1 ÷ 天数"]
      }}
      variantGen={(difficulty) => {
        // Generate problems where combined days is a nice number
        const make = (a: number, b: number) => ({
          label: `甲${a}天, 乙${b}天`,
          apply: () => { setDaysA(a); setDaysB(b); setStage(0) }
        })
        if (difficulty === "easy") return [make(6, 12), make(4, 8), make(3, 6), make(10, 15)]
        if (difficulty === "medium") return [make(8, 24), make(6, 9), make(10, 15), make(12, 20)]
        return [make(15, 20), make(12, 18), make(8, 12), make(9, 18), make(10, 25)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>

        if (difficulty === "easy") {
          items.push({
            prompt: `甲每天完成工程的几分之一？（输入分母）`,
            placeholder: "输入分母",
            check: v => parseInt(v) === daysA
          })
          items.push({
            prompt: `甲乙合作需要几天？（保留1位小数）`,
            placeholder: "输入天数",
            check: v => Math.abs(parseFloat(v) - combinedDays) < 0.1
          })
        } else if (difficulty === "medium") {
          // A works for some days, then B finishes
          const daysAWork = 2
          const workDone = daysAWork * rateA
          const remaining = 1 - workDone
          const daysBFinish = remaining / rateB
          items.push({
            prompt: `甲先做${daysAWork}天，剩下的乙做，乙要做几天？`,
            placeholder: "输入天数",
            check: v => Math.abs(parseFloat(v) - daysBFinish) < 0.1
          })
          items.push({
            prompt: `合作2天后，还剩工程的几分之几？（输入小数）`,
            placeholder: "输入小数",
            check: v => Math.abs(parseFloat(v) - (1 - combinedRate * 2)) < 0.01
          })
        } else {
          items.push({
            prompt: `甲乙合作3天完成了多少？（输入小数）`,
            placeholder: "输入小数",
            check: v => Math.abs(parseFloat(v) - combinedRate * 3) < 0.01
          })
          items.push({
            prompt: `一水池，甲管6小时注满，乙管4小时放完。同时开，几小时注满？`,
            placeholder: "输入小时",
            check: v => Math.abs(parseFloat(v) - 12) < 0.1
          })
          items.push({
            prompt: `甲10天完成，乙15天完成，丙20天完成，三人合作几天？`,
            placeholder: "输入天数",
            check: v => Math.abs(parseFloat(v) - (1 / (1/10 + 1/15 + 1/20))) < 0.1
          })
        }
        return items
      }}
      onEvaluate={() => ({
        correct: true,
        text: `甲效率=1/${daysA}, 乙效率=1/${daysB}, 合作效率=1/${daysA}+1/${daysB}=${combinedRate.toFixed(4)}, 合作时间=1÷${combinedRate.toFixed(4)}≈${combinedDays.toFixed(1)}天`
      })}
    >
      <Narration avatar="/mascots/cat.svg" name="乐乐猫">
        {getNarrationText()}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-blue-600 font-bold">甲单独完成（天）</label>
          <input
            type="number"
            className="border-2 border-blue-200 rounded-lg px-3 py-2 text-lg font-mono w-28 focus:border-blue-500 outline-none"
            value={daysA}
            onChange={e => { setDaysA(Math.max(1, parseInt(e.target.value || "1"))); setStage(0) }}
            min={1}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-amber-600 font-bold">乙单独完成（天）</label>
          <input
            type="number"
            className="border-2 border-amber-200 rounded-lg px-3 py-2 text-lg font-mono w-28 focus:border-amber-500 outline-none"
            value={daysB}
            onChange={e => { setDaysB(Math.max(1, parseInt(e.target.value || "1"))); setStage(0) }}
            min={1}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-purple-600 font-bold">合作时间</label>
          <div className="border-2 border-purple-100 bg-purple-50 rounded-lg px-3 py-2 text-lg font-mono w-28 text-purple-600 font-bold">
            {combinedDays.toFixed(1)}天
          </div>
        </div>
      </div>

      <EngineeringViz daysA={daysA} daysB={daysB} stage={stage} />

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />

      {/* Problem variations */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
        <h3 className="font-bold text-amber-800 mb-2">变形练习</h3>
        <div className="text-sm text-amber-700 space-y-2">
          <p><strong>接力问题:</strong> 甲先做几天，乙接着做完</p>
          <p><strong>水池问题:</strong> 注水管和放水管同时开</p>
          <p><strong>三人合作:</strong> 甲乙丙三人一起做</p>
        </div>
      </div>

      {/* Key formula reminder */}
      {stage >= 3 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <h3 className="font-bold text-green-800 mb-2">核心公式</h3>
          <div className="text-green-700 space-y-1">
            <p className="font-mono">工作效率 = 1 ÷ 单独完成时间</p>
            <p className="font-mono">合作时间 = 1 ÷ (效率A + 效率B)</p>
          </div>
          <div className="text-sm text-green-600 mt-2">
            💡 关键思想：把工程总量看作"1"！
          </div>
        </div>
      )}
    </LessonRunner>
  )
}
