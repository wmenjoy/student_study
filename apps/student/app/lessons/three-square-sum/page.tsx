"use client"
import { useState, useEffect } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { ThreeSquareSumVisualization } from "../../../components/ThreeSquareSumVisualization"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"

export default function ThreeSquareSumPage() {
  const [a, setA] = useState(2)
  const [b, setB] = useState(3)
  const [c, setC] = useState(4)
  const [stage, setStage] = useState(0)

  const steps = [
    "步骤1：准备——设置三个正方形的边长",
    "步骤2：构建——画出三个正方形",
    "步骤3：计算——分别计算三个正方形的面积",
    "步骤4：求和——将三个面积相加"
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
      "让我们来学习三个数的平方和公式。设置三个正方形的边长。",
      "现在画出三个正方形，边长分别为a、b、c。",
      "计算三个正方形的面积分别是a²、b²、c²。",
      "三个数的平方和就是三个面积相加：a² + b² + c²"
    ][stage] || ""

    if (narrationText) {
      speak(narrationText)
    }
  }, [stage, a, b, c])

  return (
    <LessonRunner
      title="三个数的平方和 a² + b² + c²"
      skillId="math-three-square-sum"
      intro={{
        story: "三个正方形的面积之和就是三个数的平方和。通过几何图形理解代数公式。",
        goal: "掌握三个数平方和公式的几何意义和计算方法",
        steps: ["设置边长", "观察图形", "理解公式", "熟练计算"]
      }}
      hints={{
        build: ["输入三个正方形的边长", "观察几何图形的变化"],
        map: ["理解面积与边长的关系", "掌握平方和的计算"],
        review: ["尝试不同的边长组合", "观察勾股定理特例"]
      }}
      variantGen={(difficulty) => {
        const make = (aa: number, bb: number, cc: number) => ({ 
          label: `a=${aa}, b=${bb}, c=${cc}`, 
          apply: () => { setA(aa); setB(bb); setC(cc); setStage(0) } 
        })
        if (difficulty === "easy") return [make(1, 2, 2), make(2, 3, 4), make(1, 3, 3)]
        if (difficulty === "medium") return [make(3, 4, 5), make(5, 12, 13), make(6, 8, 10)]
        return [make(7, 24, 25), make(8, 15, 17), make(9, 12, 15), make(12, 16, 20)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        const sum = a * a + b * b + c * c
        
        if (difficulty === "easy") {
          items.push({ prompt: "第一个正方形的面积是多少？", placeholder: "输入面积", check: v => Math.abs(parseFloat(v) - a * a) < 1e-6 })
          items.push({ prompt: "第二个正方形的面积是多少？", placeholder: "输入面积", check: v => Math.abs(parseFloat(v) - b * b) < 1e-6 })
        } else if (difficulty === "medium") {
          items.push({ prompt: "三个数的平方和 a² + b² + c² 是多少？", placeholder: "输入结果", check: v => Math.abs(parseFloat(v) - sum) < 1e-6 })
          items.push({ prompt: "如果 a=b=c，用 a 表示平方和", placeholder: "如 3a²", check: v => v.trim() === "3a²" || v.trim() === "3a^2" })
        } else {
          items.push({ prompt: "如果 a² + b² + c² = 50，且 a=3, b=4，求 c", placeholder: "输入c的值", check: v => Math.abs(parseFloat(v) - 5) < 1e-6 })
          items.push({ prompt: "如果 3²+4²+5²=50，这是直角三角形三边吗？（输入 yes）", placeholder: "输入yes", check: v => v.trim().toLowerCase() === "yes" })
        }
        return items
      }}
      onEvaluate={() => ({ 
        correct: true, 
        text: `三个数平方和公式：${a}² + ${b}² + ${c}² = ${a * a} + ${b * b} + ${c * c} = ${a * a + b * b + c * c}\n几何意义：三个正方形面积之和\n特例：当满足勾股定理时，可构成直角三角形` 
      })}
    >
      <Narration avatar="/icons/area.svg" name="数学老师">
        {stage === 0 && `让我们设置三个正方形的边长：分别为 ${a}、${b}、${c}。`}
        {stage === 1 && `观察这三个正方形，分别有 ${a * a}、${b * b}、${c * c} 个小方格。`}
        {stage === 2 && `三个正方形的面积分别是 ${a}² = ${a * a}、${b}² = ${b * b}、${c}² = ${c * c}。`}
        {stage === 3 && `平方和就是三个面积相加：${a}² + ${b}² + ${c}² = ${a * a} + ${b * b} + ${c * c} = ${a * a + b * b + c * c}`}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">边长 a</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-20 focus:border-blue-500 outline-none"
            value={a}
            onChange={e => { setA(Math.max(1, Math.min(6, parseFloat(e.target.value || "1")))); setStage(0) }}
            min="1"
            max="6"
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">边长 b</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-20 focus:border-blue-500 outline-none"
            value={b}
            onChange={e => { setB(Math.max(1, Math.min(6, parseFloat(e.target.value || "1")))); setStage(0) }}
            min="1"
            max="6"
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">边长 c</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-20 focus:border-blue-500 outline-none"
            value={c}
            onChange={e => { setC(Math.max(1, Math.min(6, parseFloat(e.target.value || "1")))); setStage(0) }}
            min="1"
            max="6"
          />
        </div>
      </div>

      <ThreeSquareSumVisualization a={a} b={b} c={c} stage={stage} />
      
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}