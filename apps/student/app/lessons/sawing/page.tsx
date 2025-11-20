"use client"
import { useState, useRef, useEffect } from "react"
import { SawingViz } from "../../../components/SawingViz"
import { LessonRunner } from "../../../components/LessonRunner"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function SawingPage() {
  const [segments, setSegments] = useState(5)
  const [timePerCut, setTimePerCut] = useState(3)
  const [stage, setStage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const cuts = segments - 1
  const totalTime = cuts * timePerCut

  const steps = [
    "步骤1：理解题意——要锯成几段",
    "步骤2：开始锯——看看锯了几次",
    "步骤3：发现规律——段数和刀数的关系",
    "步骤4：计算时间——每次时间×锯的次数",
    "步骤5：变形应用——换个段数试试"
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
    if (stage === 0) return "木匠要把一根木头锯成好几段。我们来看看要锯多少次！"
    if (stage === 1) return "注意看！每锯一刀，木头就多出一段。"
    if (stage === 2) return "发现了吗？段数总是比刀数多1！"
    if (stage === 3) return "知道每次时间和次数，就能算出总时间啦！"
    if (stage === 4) return "试试其他段数，规律还是一样的！"
    return "改变数值，再观察一次吧！"
  }

  return (
    <LessonRunner
      title="锯木头问题"
      skillId="math-sawing"
      intro={{
        story: "木匠师傅要把一根木头锯成好几段。每锯一次要花几分钟，问一共要花多少时间？",
        goal: "发现段数和刀数的关系，计算总时间",
        steps: ["设置段数和每次时间", "观察锯木过程", "用公式计算总时间"]
      }}
      hints={{
        build: ["输入要锯成的段数", "输入每次需要的时间"],
        map: ["点击评估", "读出锯的次数和总时间"],
        review: ["记住：段数 = 刀数 + 1", "这和植树问题很像哦！"]
      }}
      variantGen={(difficulty) => {
        const make = (seg: number, time: number) => ({
          label: `${seg}段, 每次${time}分`,
          apply: () => { setSegments(seg); setTimePerCut(time); setStage(0) }
        })
        if (difficulty === "easy") return [make(5, 3), make(4, 2), make(6, 4), make(3, 5)]
        if (difficulty === "medium") return [make(8, 3), make(7, 4), make(9, 2), make(10, 3)]
        return [make(12, 5), make(15, 3), make(10, 6), make(20, 2), make(8, 7)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>

        if (difficulty === "easy") {
          items.push({
            prompt: `锯成${segments}段需要锯几次？`,
            placeholder: "输入次数",
            check: v => parseInt(v) === cuts
          })
          items.push({
            prompt: `总共需要多少分钟？`,
            placeholder: "输入时间",
            check: v => parseInt(v) === totalTime
          })
        } else if (difficulty === "medium") {
          const newSegs = segments + 3
          items.push({
            prompt: `如果改成${newSegs}段，需要锯几次？`,
            placeholder: "输入次数",
            check: v => parseInt(v) === newSegs - 1
          })
          items.push({
            prompt: `锯成${newSegs}段总共需要多少分钟？`,
            placeholder: "输入时间",
            check: v => parseInt(v) === (newSegs - 1) * timePerCut
          })
        } else {
          // Reverse problems
          items.push({
            prompt: `锯了${cuts + 4}次，锯成了几段？`,
            placeholder: "输入段数",
            check: v => parseInt(v) === cuts + 5
          })
          items.push({
            prompt: `用了${totalTime + timePerCut * 2}分钟，每次${timePerCut}分钟，锯成了几段？`,
            placeholder: "输入段数",
            check: v => parseInt(v) === (totalTime + timePerCut * 2) / timePerCut + 1
          })
          items.push({
            prompt: `一根绳子对折3次后剪一刀，剪成几段？`,
            placeholder: "输入段数",
            check: v => parseInt(v) === 9  // 2^3 + 1 = 9
          })
        }
        return items
      }}
      onEvaluate={() => ({
        correct: true,
        text: `锯成 ${segments} 段需要锯 ${cuts} 次，总时间 = ${cuts} × ${timePerCut} = ${totalTime} 分钟`
      })}
    >
      <Narration avatar="/mascots/cat.svg" name="乐乐猫">
        {getNarrationText()}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">锯成几段</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-32 focus:border-blue-500 outline-none"
            value={segments}
            onChange={e => { setSegments(Math.max(2, parseInt(e.target.value || "2"))); setStage(0) }}
            min={2}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">每次时间（分钟）</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-32 focus:border-blue-500 outline-none"
            value={timePerCut}
            onChange={e => { setTimePerCut(Math.max(1, parseInt(e.target.value || "1"))); setStage(0) }}
            min={1}
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">锯的次数</label>
          <div className="border-2 border-red-100 bg-red-50 rounded-lg px-3 py-2 text-lg font-mono w-32 text-red-600 font-bold">
            {cuts} 次
          </div>
        </div>
      </div>

      <SawingViz segments={segments} timePerCut={timePerCut} stage={stage} />

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />

      {/* Problem variations */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
        <h3 className="font-bold text-amber-800 mb-2">变形练习</h3>
        <div className="text-sm text-amber-700 space-y-2">
          <p><strong>爬楼梯:</strong> 从1楼到6楼，要爬几层楼梯？（答案：5层）</p>
          <p><strong>敲钟:</strong> 钟敲8下用14秒，敲12下要多少秒？</p>
          <p><strong>排队:</strong> 10个人排成一排，人与人之间各隔2米，从第一个到最后一个相距多少米？</p>
        </div>
      </div>

      {/* Key formula reminder */}
      {stage >= 3 && (
        <div className="mt-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
          <h3 className="font-bold text-green-800 mb-2">核心公式</h3>
          <div className="text-green-700 space-y-1">
            <p className="font-mono">刀数 = 段数 - 1</p>
            <p className="font-mono">总时间 = 刀数 × 每次时间</p>
          </div>
          <div className="text-sm text-green-600 mt-2">
            💡 这类问题的关键：段数总比刀数多1！和植树问题是同一类型。
          </div>
        </div>
      )}
    </LessonRunner>
  )
}
