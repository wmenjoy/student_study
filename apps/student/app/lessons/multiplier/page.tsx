"use client"
import { useState, useRef, useEffect } from "react"
import { MultiplierViz } from "../../../components/MultiplierViz"
import { LessonRunner } from "../../../components/LessonRunner"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function MultiplierPage() {
  const [smallValue, setSmallValue] = useState(20)
  const [multiplier, setMultiplier] = useState(8)
  const [stage, setStage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const bigValue = smallValue * multiplier
  const diff = bigValue - smallValue

  const steps = [
    "步骤1：理解题意——大数是小数的几倍",
    "步骤2：画图分析——把大数分成相等的份",
    "步骤3：找到差——差就是(倍数-1)份",
    "步骤4：推导公式——差÷(倍数-1)=小数",
    "步骤5：计算答案——得出小数的值"
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
    if (stage === 0) return "桌子比椅子贵好多！桌子的价钱是椅子的好几倍呢。我们来算算椅子多少钱吧！"
    if (stage === 1) return "看！把桌子的价钱分成几份，每一份都等于椅子的价钱。"
    if (stage === 2) return "多出来的部分就是'差'！差等于(倍数-1)份。"
    if (stage === 3) return "知道了差和份数，就能算出每份的值啦！"
    if (stage === 4) return "太棒了！用差除以(倍数-1)，就得到答案了！"
    return "试试改变数值，看看图会怎么变化？"
  }

  return (
    <LessonRunner
      title="倍数问题"
      skillId="math-multiplier"
      intro={{
        story: "一张桌子的价钱是一把椅子的好几倍。桌子比椅子贵很多元。想知道椅子多少钱吗？",
        goal: "用图形理解倍数关系，用公式求出较小的数",
        steps: ["设置倍数和差值", "观察图形分割", "用公式计算"]
      }}
      hints={{
        build: ["输入倍数（大数是小数的几倍）", "观察两条长度差多少"],
        map: ["点击评估", "读出小数和大数的值"],
        review: ["改变倍数再观察", "试试倍数为3、5、10的情况"]
      }}
      variantGen={(difficulty) => {
        // Generate problems where small = diff / (mult - 1) is an integer
        const make = (small: number, mult: number) => {
          const d = small * (mult - 1)
          return {
            label: `${mult}倍, 差${d}`,
            apply: () => { setSmallValue(small); setMultiplier(mult); setStage(0) }
          }
        }
        if (difficulty === "easy") return [make(20, 8), make(10, 4), make(15, 3), make(12, 5)]
        if (difficulty === "medium") return [make(25, 9), make(18, 6), make(30, 7), make(22, 4)]
        return [make(35, 12), make(28, 8), make(40, 11), make(45, 10), make(32, 9)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>

        if (difficulty === "easy") {
          items.push({
            prompt: `桌子是椅子的${multiplier}倍，差${diff}元，椅子多少元？`,
            placeholder: "输入椅子价格",
            check: v => Math.abs(parseFloat(v) - smallValue) < 0.01
          })
          items.push({
            prompt: `那桌子多少元？`,
            placeholder: "输入桌子价格",
            check: v => Math.abs(parseFloat(v) - bigValue) < 0.01
          })
        } else if (difficulty === "medium") {
          const newMult = multiplier + 2
          const newSmall = diff / (newMult - 1)
          items.push({
            prompt: `如果倍数改为${newMult}倍，差仍是${diff}元，椅子多少元？`,
            placeholder: "输入价格",
            check: v => Math.abs(parseFloat(v) - newSmall) < 0.01
          })

          const newDiff = diff + 20
          const newSmall2 = newDiff / (multiplier - 1)
          items.push({
            prompt: `如果差改为${newDiff}元，倍数仍是${multiplier}倍，椅子多少元？`,
            placeholder: "输入价格",
            check: v => Math.abs(parseFloat(v) - newSmall2) < 0.01
          })
        } else {
          // Reverse thinking
          items.push({
            prompt: `椅子${smallValue}元，桌子是椅子的几倍才能贵${diff}元？`,
            placeholder: "输入倍数",
            check: v => Math.abs(parseFloat(v) - multiplier) < 0.01
          })
          items.push({
            prompt: `如果椅子涨价到${smallValue + 5}元，倍数不变，差变成多少？`,
            placeholder: "输入差",
            check: v => Math.abs(parseFloat(v) - ((smallValue + 5) * (multiplier - 1))) < 0.01
          })
          items.push({
            prompt: `爸爸年龄是儿子的4倍，比儿子大24岁，儿子几岁？`,
            placeholder: "输入年龄",
            check: v => Math.abs(parseFloat(v) - 8) < 0.01
          })
        }
        return items
      }}
      onEvaluate={() => ({
        correct: true,
        text: `小数 = ${diff} ÷ (${multiplier} - 1) = ${diff} ÷ ${multiplier - 1} = ${smallValue}，大数 = ${smallValue} × ${multiplier} = ${bigValue}`
      })}
    >
      <Narration avatar="/mascots/bear.svg" name="智慧熊">
        {getNarrationText()}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">小数（椅子价格）</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-32 focus:border-blue-500 outline-none"
            value={smallValue}
            onChange={e => { setSmallValue(parseFloat(e.target.value || "1") || 1); setStage(0) }}
            min={1}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">倍数</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-32 focus:border-blue-500 outline-none"
            value={multiplier}
            onChange={e => { setMultiplier(Math.max(2, parseFloat(e.target.value || "2"))); setStage(0) }}
            min={2}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">差（自动计算）</label>
          <div className="border-2 border-slate-100 bg-slate-50 rounded-lg px-3 py-2 text-lg font-mono w-32 text-slate-600">
            {diff}
          </div>
        </div>
      </div>

      <MultiplierViz smallValue={smallValue} multiplier={multiplier} stage={stage} />

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />

      {/* Problem variations */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
        <h3 className="font-bold text-amber-800 mb-2">变形练习</h3>
        <div className="text-sm text-amber-700 space-y-1">
          <p>1. 爸爸年龄是儿子的4倍，比儿子大24岁，儿子几岁？</p>
          <p>2. 哥哥存款是弟弟的3倍，哥哥比弟弟多40元，弟弟存了多少？</p>
          <p>3. 大盒子苹果数是小盒子的5倍，多出32个，小盒子有几个？</p>
        </div>
      </div>

      {/* Key formula reminder */}
      {stage >= 3 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <h3 className="font-bold text-green-800 mb-2">记住公式</h3>
          <div className="text-green-700 font-mono">
            小数 = 差 ÷ (倍数 - 1)
          </div>
          <div className="text-sm text-green-600 mt-2">
            💡 关键：差等于 (倍数-1) 份小数！
          </div>
        </div>
      )}
    </LessonRunner>
  )
}
