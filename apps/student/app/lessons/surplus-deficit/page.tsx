"use client"
import { useState, useRef, useEffect } from "react"
import { SurplusDeficitViz } from "../../../components/SurplusDeficitViz"
import { LessonRunner } from "../../../components/LessonRunner"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function SurplusDeficitPage() {
  const [perPerson1, setPerPerson1] = useState(3)
  const [perPerson2, setPerPerson2] = useState(5)
  const [surplus, setSurplus] = useState(6)
  const [shortage, setShortage] = useState(4)
  const [stage, setStage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Calculate results
  const diff = perPerson2 - perPerson1
  const people = diff > 0 ? (surplus + shortage) / diff : 0
  const totalItems = people * perPerson1 + surplus

  const steps = [
    "步骤1：理解题意——两种分配方案",
    "步骤2：观察差异——一个多一个少",
    "步骤3：找关键——每人多分几个",
    "步骤4：用公式——算出人数"
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
    if (stage === 0) return "分糖果啦！第一种分法多了，第二种分法又不够，到底有多少人呢？"
    if (stage === 1) return "看！第一次多出来的，第二次又不够。把这两个数加起来！"
    if (stage === 2) return "每人多分了几个？从方案一到方案二，每人多拿了" + diff + "个！"
    if (stage === 3) return "太棒了！用(多的+少的)除以每人多分的，就是人数啦！"
    return "试试改变数值，再算一次！"
  }

  return (
    <LessonRunner
      title="盈亏问题"
      skillId="math-surplus-deficit"
      intro={{
        story: "老师分糖果，每人分3个还多6个，每人分5个又少4个。想知道有几个小朋友吗？",
        goal: "用图形理解盈亏关系，用公式求出人数",
        steps: ["设置两种分配方案", "观察多和少的数量", "用公式计算人数"]
      }}
      hints={{
        build: ["输入两种分法每人分几个", "输入多出和缺少的数量"],
        map: ["点击评估", "读出人数和总数"],
        review: ["盈亏问题的关键：比较两种方案的差异"]
      }}
      variantGen={(difficulty) => {
        // Generate problems where (surplus + shortage) / (per2 - per1) is an integer
        const make = (p1: number, p2: number, s: number, sh: number) => ({
          label: `每人${p1}多${s}, 每人${p2}少${sh}`,
          apply: () => { setPerPerson1(p1); setPerPerson2(p2); setSurplus(s); setShortage(sh); setStage(0) }
        })
        if (difficulty === "easy") return [make(3, 5, 6, 4), make(4, 6, 8, 4), make(2, 4, 10, 6)]
        if (difficulty === "medium") return [make(5, 8, 9, 6), make(3, 7, 12, 8), make(6, 9, 15, 6)]
        return [make(4, 9, 15, 10), make(7, 12, 20, 15), make(5, 11, 18, 12), make(8, 14, 24, 12)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>

        if (difficulty === "easy") {
          items.push({
            prompt: `有多少人？`,
            placeholder: "输入人数",
            check: v => Math.abs(parseFloat(v) - people) < 0.01
          })
          items.push({
            prompt: `一共有多少个糖果？`,
            placeholder: "输入总数",
            check: v => Math.abs(parseFloat(v) - totalItems) < 0.01
          })
        } else if (difficulty === "medium") {
          const newPer2 = perPerson2 + 1
          const newShortage = shortage + people
          items.push({
            prompt: `如果第二次每人分${newPer2}个，会少多少个？`,
            placeholder: "输入缺少数",
            check: v => Math.abs(parseFloat(v) - newShortage) < 0.01
          })
          items.push({
            prompt: `如果每人分${perPerson1 + 1}个，会多多少个？`,
            placeholder: "输入多出数",
            check: v => Math.abs(parseFloat(v) - (surplus - people)) < 0.01
          })
        } else {
          items.push({
            prompt: `每人分${Math.floor((totalItems) / people)}个，刚好分完，验证人数是否正确`,
            placeholder: "输入人数",
            check: v => Math.abs(parseFloat(v) - people) < 0.01
          })
          items.push({
            prompt: `买练习本，每人5本多10本，每人7本少8本，有几人？`,
            placeholder: "输入人数",
            check: v => Math.abs(parseFloat(v) - 9) < 0.01
          })
          items.push({
            prompt: `上题共有多少本练习本？`,
            placeholder: "输入本数",
            check: v => Math.abs(parseFloat(v) - 55) < 0.01
          })
        }
        return items
      }}
      onEvaluate={() => ({
        correct: diff > 0 && Number.isInteger(people),
        text: `人数 = (${surplus} + ${shortage}) ÷ (${perPerson2} - ${perPerson1}) = ${surplus + shortage} ÷ ${diff} = ${people}人，共${totalItems}个`
      })}
    >
      <Narration avatar="/mascots/bear.svg" name="智慧熊">
        {getNarrationText()}
      </Narration>

      <div className="controls flex flex-wrap gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">方案一：每人分</label>
          <input
            type="number"
            className="border-2 border-blue-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={perPerson1}
            onChange={e => { setPerPerson1(Math.max(1, parseInt(e.target.value || "1"))); setStage(0) }}
            min={1}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-green-600 font-bold">多出</label>
          <input
            type="number"
            className="border-2 border-green-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-green-500 outline-none"
            value={surplus}
            onChange={e => { setSurplus(Math.max(0, parseInt(e.target.value || "0"))); setStage(0) }}
            min={0}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">方案二：每人分</label>
          <input
            type="number"
            className="border-2 border-amber-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-amber-500 outline-none"
            value={perPerson2}
            onChange={e => { setPerPerson2(Math.max(perPerson1 + 1, parseInt(e.target.value || "2"))); setStage(0) }}
            min={perPerson1 + 1}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-red-600 font-bold">缺少</label>
          <input
            type="number"
            className="border-2 border-red-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-red-500 outline-none"
            value={shortage}
            onChange={e => { setShortage(Math.max(0, parseInt(e.target.value || "0"))); setStage(0) }}
            min={0}
          />
        </div>
      </div>

      <SurplusDeficitViz
        perPerson1={perPerson1}
        perPerson2={perPerson2}
        surplus={surplus}
        shortage={shortage}
        stage={stage}
      />

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />

      {/* Problem variations */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
        <h3 className="font-bold text-amber-800 mb-2">变形练习</h3>
        <div className="text-sm text-amber-700 space-y-2">
          <p><strong>双盈:</strong> 每人分4个多8个，每人分6个多2个 → 都是多，用大多减小多</p>
          <p><strong>双亏:</strong> 每人分5个少3个，每人分7个少11个 → 都是少，用大少减小少</p>
          <p><strong>租船:</strong> 每船坐4人多2人，每船坐6人少4人，有多少人？</p>
        </div>
      </div>

      {/* Key formula reminder */}
      {stage >= 3 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <h3 className="font-bold text-green-800 mb-2">核心公式</h3>
          <div className="text-green-700 space-y-1">
            <p className="font-mono">人数 = (盈 + 亏) ÷ (每人多分的数量)</p>
            <p className="font-mono">总数 = 人数 × 每人数量 + 多出 或 - 缺少</p>
          </div>
          <div className="text-sm text-green-600 mt-2">
            💡 口诀：盈亏相加除以差！
          </div>
        </div>
      )}
    </LessonRunner>
  )
}
