"use client"
import { useState, useEffect } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { SquareDiffVisualization } from "../../../components/SquareDiffVisualization"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"

export default function SquareDiffPage() {
  const [a, setA] = useState(5)
  const [b, setB] = useState(3)
  const [stage, setStage] = useState(0)

  const steps = [
    "步骤1：准备——设置两个正方形的边长（a > b）",
    "步骤2：构建——画出大正方形和小正方形",
    "步骤3：计算——分别计算两个正方形的面积",
    "步骤4：求差——大正方形面积减去小正方形面积"
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
      "让我们来学习平方差公式。设置两个正方形的边长，确保 a > b。",
      "现在画出两个正方形，大正方形边长为a，小正方形边长为b。",
      "计算大正方形的面积是a²，小正方形的面积是b²。",
      "平方差就是大正方形面积减去小正方形面积：a² - b²"
    ][stage] || ""

    if (narrationText) {
      speak(narrationText)
    }
  }, [stage, a, b])

  return (
    <LessonRunner
      title="平方差公式 a² - b²"
      skillId="math-square-diff"
      intro={{
        story: "大正方形面积减去小正方形面积就是平方差。通过几何图形理解代数公式。",
        goal: "掌握平方差公式的几何意义和计算方法",
        steps: ["设置边长", "观察图形", "理解公式", "熟练计算"]
      }}
      hints={{
        build: ["输入两个正方形的边长（确保 a > b）", "观察几何图形的变化"],
        map: ["理解面积差与边长的关系", "掌握平方差的计算"],
        review: ["尝试不同的边长组合", "观察规律"]
      }}
      variantGen={(difficulty) => {
        const make = (aa: number, bb: number) => ({ 
          label: `a=${aa}, b=${bb}`, 
          apply: () => { setA(aa); setB(bb); setStage(0) } 
        })
        if (difficulty === "easy") return [make(4, 2), make(5, 3), make(6, 4)]
        if (difficulty === "medium") return [make(7, 4), make(8, 5), make(9, 6)]
        return [make(10, 6), make(12, 8), make(15, 9), make(13, 5)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        const diff = a * a - b * b
        
        if (difficulty === "easy") {
          items.push({ prompt: "大正方形的面积是多少？", placeholder: "输入面积", check: v => Math.abs(parseFloat(v) - a * a) < 1e-6 })
          items.push({ prompt: "小正方形的面积是多少？", placeholder: "输入面积", check: v => Math.abs(parseFloat(v) - b * b) < 1e-6 })
        } else if (difficulty === "medium") {
          items.push({ prompt: "平方差 a² - b² 是多少？", placeholder: "输入结果", check: v => Math.abs(parseFloat(v) - diff) < 1e-6 })
          items.push({ prompt: "如果 a=2b，用 b 表示平方差", placeholder: "如 3b²", check: v => v.trim() === "3b²" || v.trim() === "3b^2" })
        } else {
          items.push({ prompt: "如果 a² - b² = 21，且 a=5，求 b", placeholder: "输入b的值", check: v => Math.abs(parseFloat(v) - 2) < 1e-6 })
          items.push({ prompt: "因式分解：a² - b² = ?（输入 (a+b)(a-b)）", placeholder: "输入因式分解结果", check: v => v.trim() === "(a+b)(a-b)" || v.trim() === "(a-b)(a+b)" })
        }
        return items
      }}
      onEvaluate={() => ({ 
        correct: true, 
        text: `平方差公式：${a}² - ${b}² = ${a * a} - ${b * b} = ${a * a - b * b}\n几何意义：大正方形面积减去小正方形面积\n因式分解：(${a}+${b})(${a}-${b}) = ${a + b} × ${a - b} = ${(a + b) * (a - b)}` 
      })}
    >
      <Narration avatar="/icons/area.svg" name="数学老师">
        {stage === 0 && `让我们设置两个正方形的边长：大正方形边长为 ${a}，小正方形边长为 ${b}。`}
        {stage === 1 && `观察这两个正方形，大正方形有 ${a * a} 个小方格，小正方形有 ${b * b} 个小方格。`}
        {stage === 2 && `大正方形的面积是 ${a}² = ${a * a}，小正方形的面积是 ${b}² = ${b * b}。`}
        {stage === 3 && `平方差就是面积相减：${a}² - ${b}² = ${a * a} - ${b * b} = ${a * a - b * b} = (${a}+${b})(${a}-${b})`}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">边长 a (大)</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={a}
            onChange={e => { 
              const newA = Math.max(2, Math.min(10, parseFloat(e.target.value || "2")))
              setA(Math.max(newA, b + 1)); // Ensure a > b
              setStage(0) 
            }}
            min="2"
            max="10"
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">边长 b (小)</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={b}
            onChange={e => { 
              const newB = Math.max(1, Math.min(9, parseFloat(e.target.value || "1")))
              setB(Math.min(newB, a - 1)); // Ensure b < a
              setStage(0) 
            }}
            min="1"
            max="9"
          />
        </div>
      </div>

      <SquareDiffVisualization a={a} b={b} stage={stage} />
      
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}