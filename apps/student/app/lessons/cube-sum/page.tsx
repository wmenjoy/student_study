"use client"
import { useState, useEffect } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { CubeSumVisualization } from "../../../components/CubeSumVisualization"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"

export default function CubeSumPage() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(3)
  const [stage, setStage] = useState(0)

  const steps = [
    "步骤1：准备——设置两个立方体的边长",
    "步骤2：构建——画出两个立方体",
    "步骤3：计算——分别计算两个立方体的体积",
    "步骤4：求和——将两个体积相加"
  ]

  const onStep = (i: number) => setStage(i)

  // Speak function
  const speak = (msg: string) => {
    if (typeof window !== 'undefined') {
      const u = new SpeechSynthesisUtterance(msg)
      u.lang = 'zh-CN'
      window.speechSynthesis.cancel()
      window.speechSynthesis.speak(u)
    }
  }

  useEffect(() => {
    const narrationText = [
      "让我们来学习立方和公式。设置两个立方体的边长。",
      "现在画出两个立方体，一个边长为a，一个边长为b。",
      "计算第一个立方体的体积是a³，第二个立方体的体积是b³。",
      "立方和就是两个体积相加：a³ + b³"
    ][stage] || ""

    if (narrationText) {
      speak(narrationText)
    }
  }, [stage, a, b])

  return (
    <LessonRunner
      title="立方和公式 a³ + b³"
      skillId="math-cube-sum"
      intro={{
        story: "两个立方体的体积之和就是立方和。通过3D图形理解代数公式。",
        goal: "掌握立方和公式的几何意义和计算方法",
        steps: ["设置边长", "观察3D图形", "理解公式", "熟练计算"]
      }}
      hints={{
        build: ["输入两个立方体的边长", "观察3D图形的变化"],
        map: ["理解体积与边长的关系", "掌握立方和的计算"],
        review: ["尝试不同的边长组合", "观察规律"]
      }}
      variantGen={(difficulty) => {
        const make = (aa: number, bb: number) => ({ 
          label: `a=${aa}, b=${bb}`, 
          apply: () => { setA(aa); setB(bb); setStage(0) } 
        })
        if (difficulty === "easy") return [make(1, 2), make(2, 3), make(1, 3)]
        if (difficulty === "medium") return [make(2, 4), make(3, 5), make(2, 5)]
        return [make(3, 6), make(4, 7), make(5, 8), make(2, 6)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        const sum = a * a * a + b * b * b
        
        if (difficulty === "easy") {
          items.push({ prompt: "第一个立方体的体积是多少？", placeholder: "输入体积", check: v => Math.abs(parseFloat(v) - a * a * a) < 1e-6 })
          items.push({ prompt: "第二个立方体的体积是多少？", placeholder: "输入体积", check: v => Math.abs(parseFloat(v) - b * b * b) < 1e-6 })
        } else if (difficulty === "medium") {
          items.push({ prompt: "立方和 a³ + b³ 是多少？", placeholder: "输入结果", check: v => Math.abs(parseFloat(v) - sum) < 1e-6 })
          items.push({ prompt: "如果 a=2b，用 b 表示立方和", placeholder: "如 9b³", check: v => v.trim() === "9b³" || v.trim() === "9b^3" })
        } else {
          items.push({ prompt: "如果 a³ + b³ = 35，且 a=2，求 b", placeholder: "输入b的值", check: v => Math.abs(parseFloat(v) - 3) < 1e-6 })
          items.push({ prompt: "因式分解：a³ + b³ = ?（输入 (a+b)(a²-ab+b²)）", placeholder: "输入因式分解结果", check: v => {
            const clean = v.trim().toLowerCase().replace(/\s+/g, '')
            return clean === "(a+b)(a²-ab+b²)" || clean === "(a+b)(a^2-ab+b^2)" || clean === "(a+b)(a2-ab+b2)"
          }})
        }
        return items
      }}
      onEvaluate={() => ({ 
        correct: true, 
        text: `立方和公式：${a}³ + ${b}³ = ${a * a * a} + ${b * b * b} = ${a * a * a + b * b * b}\n几何意义：两个立方体体积之和\n因式分解：(${a}+${b})(${a}²-${a}${b}+${b}²) = (${a}+${b})(${a*a}-${a*b}+${b*b})` 
      })}
    >
      <Narration avatar="/icons/area.svg" name="数学老师">
        {stage === 0 && `让我们设置两个立方体的边长：第一个边长为 ${a}，第二个边长为 ${b}。`}
        {stage === 1 && `观察这两个立方体，第一个有 ${a * a * a} 个小方块，第二个有 ${b * b * b} 个小方块。`}
        {stage === 2 && `第一个立方体的体积是 ${a}³ = ${a * a * a}，第二个立方体的体积是 ${b}³ = ${b * b * b}。`}
        {stage === 3 && `立方和就是两个体积相加：${a}³ + ${b}³ = ${a * a * a} + ${b * b * b} = ${a * a * a + b * b * b}`}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">边长 a</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={a}
            onChange={e => { setA(Math.max(1, Math.min(5, parseFloat(e.target.value || "1")))); setStage(0) }}
            min="1"
            max="5"
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">边长 b</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={b}
            onChange={e => { setB(Math.max(1, Math.min(5, parseFloat(e.target.value || "1")))); setStage(0) }}
            min="1"
            max="5"
          />
        </div>
      </div>

      <CubeSumVisualization a={a} b={b} stage={stage} />
      
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}