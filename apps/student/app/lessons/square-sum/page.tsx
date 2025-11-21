"use client"
import { useState, useEffect } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { SquareSumVisualization } from "../../../components/SquareSumVisualization"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"

export default function SquareSumPage() {
  const [a, setA] = useState(3)
  const [b, setB] = useState(4)
  const [stage, setStage] = useState(0)

  const steps = [
    "步骤1：准备——设置两个正方形的边长",
    "步骤2：构建——画出两个正方形",
    "步骤3：计算——分别计算两个正方形的面积",
    "步骤4：求和——将两个面积相加"
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
      "让我们来学习平方和公式。首先设置两个正方形的边长。",
      "现在画出两个正方形，一个边长为a，一个边长为b。",
      "计算第一个正方形的面积是a²，第二个正方形的面积是b²。",
      "平方和就是两个正方形面积的总和：a² + b²"
    ][stage] || ""

    if (narrationText) {
      speak(narrationText)
    }
  }, [stage, a, b])

  return (
    <LessonRunner
      title="平方和公式 a² + b²"
      skillId="math-square-sum"
      intro={{
        story: "两个正方形的面积之和就是平方和。通过几何图形理解代数公式。",
        goal: "掌握平方和公式的几何意义和计算方法",
        steps: ["设置边长", "观察图形", "理解公式", "熟练计算"]
      }}
      hints={{
        build: ["输入两个正方形的边长", "观察几何图形的变化"],
        map: ["理解面积与边长的关系", "掌握平方和的计算"],
        review: ["尝试不同的边长组合", "观察规律"]
      }}
      variantGen={(difficulty) => {
        const make = (aa: number, bb: number) => ({ 
          label: `a=${aa}, b=${bb}`, 
          apply: () => { setA(aa); setB(bb); setStage(0) } 
        })
        if (difficulty === "easy") return [make(2, 3), make(3, 4), make(1, 5)]
        if (difficulty === "medium") return [make(4, 5), make(6, 8), make(5, 12)]
        return [make(7, 24), make(8, 15), make(9, 12), make(10, 24)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        const sum = a * a + b * b
        
        if (difficulty === "easy") {
          items.push({ prompt: "第一个正方形的面积是多少？", placeholder: "输入面积", check: v => Math.abs(parseFloat(v) - a * a) < 1e-6 })
          items.push({ prompt: "第二个正方形的面积是多少？", placeholder: "输入面积", check: v => Math.abs(parseFloat(v) - b * b) < 1e-6 })
        } else if (difficulty === "medium") {
          items.push({ prompt: "平方和 a² + b² 是多少？", placeholder: "输入结果", check: v => Math.abs(parseFloat(v) - sum) < 1e-6 })
          items.push({ prompt: "如果 a=2b，用 b 表示平方和", placeholder: "如 5b²", check: v => v.trim() === "5b²" || v.trim() === "5b^2" })
        } else {
          items.push({ prompt: "如果 a² + b² = 25，且 a=3，求 b", placeholder: "输入b的值", check: v => Math.abs(parseFloat(v) - 4) < 1e-6 })
          items.push({ prompt: "证明：a² + b² ≥ 2ab（输入 yes）", placeholder: "输入yes", check: v => v.trim().toLowerCase() === "yes" })
        }
        return items
      }}
      onEvaluate={() => ({ 
        correct: true, 
        text: `平方和公式：${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}\n几何意义：两个正方形面积之和` 
      })}
    >
      <Narration avatar="/icons/area.svg" name="数学老师">
        {stage === 0 && `让我们设置两个正方形的边长：第一个边长为 ${a}，第二个边长为 ${b}。`}
        {stage === 1 && `观察这两个正方形，第一个有 ${a * a} 个小方格，第二个有 ${b * b} 个小方格。`}
        {stage === 2 && `第一个正方形的面积是 ${a}² = ${a * a}，第二个正方形的面积是 ${b}² = ${b * b}。`}
        {stage === 3 && `平方和就是两个面积相加：${a}² + ${b}² = ${a * a} + ${b * b} = ${a * a + b * b}`}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">边长 a</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={a}
            onChange={e => { setA(Math.max(1, Math.min(10, parseFloat(e.target.value || "1")))); setStage(0) }}
            min="1"
            max="10"
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">边长 b</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={b}
            onChange={e => { setB(Math.max(1, Math.min(10, parseFloat(e.target.value || "1")))); setStage(0) }}
            min="1"
            max="10"
          />
        </div>
      </div>

      <SquareSumVisualization a={a} b={b} stage={stage} />
      
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}