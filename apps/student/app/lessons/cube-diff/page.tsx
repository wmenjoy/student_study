"use client"
import { useState, useEffect } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { CubeDiffVisualization } from "../../../components/CubeDiffVisualization"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"

export default function CubeDiffPage() {
  const [a, setA] = useState(4)
  const [b, setB] = useState(2)
  const [stage, setStage] = useState(0)

  const steps = [
    "步骤1：准备——设置两个立方体的边长（a > b）",
    "步骤2：构建——画出大立方体和小立方体",
    "步骤3：计算——分别计算两个立方体的体积",
    "步骤4：求差——大立方体体积减去小立方体体积"
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
      "让我们来学习立方差公式。设置两个立方体的边长，确保 a > b。",
      "现在画出两个立方体，大立方体边长为a，小立方体边长为b。",
      "计算大立方体的体积是a³，小立方体的体积是b³。",
      "立方差就是大立方体体积减去小立方体体积：a³ - b³"
    ][stage] || ""

    if (narrationText) {
      speak(narrationText)
    }
  }, [stage, a, b])

  return (
    <LessonRunner
      title="立方差公式 a³ - b³"
      skillId="math-cube-diff"
      intro={{
        story: "大立方体体积减去小立方体体积就是立方差。通过3D图形理解代数公式。",
        goal: "掌握立方差公式的几何意义和计算方法",
        steps: ["设置边长", "观察3D图形", "理解公式", "熟练计算"]
      }}
      hints={{
        build: ["输入两个立方体的边长（确保 a > b）", "观察3D图形的变化"],
        map: ["理解体积差与边长的关系", "掌握立方差的计算"],
        review: ["尝试不同的边长组合", "观察规律"]
      }}
      variantGen={(difficulty) => {
        const make = (aa: number, bb: number) => ({ 
          label: `a=${aa}, b=${bb}`, 
          apply: () => { setA(aa); setB(bb); setStage(0) } 
        })
        if (difficulty === "easy") return [make(3, 1), make(4, 2), make(5, 3)]
        if (difficulty === "medium") return [make(5, 2), make(6, 3), make(7, 4)]
        return [make(6, 4), make(8, 5), make(9, 6), make(10, 7)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        const diff = a * a * a - b * b * b
        
        if (difficulty === "easy") {
          items.push({ prompt: "大立方体的体积是多少？", placeholder: "输入体积", check: v => Math.abs(parseFloat(v) - a * a * a) < 1e-6 })
          items.push({ prompt: "小立方体的体积是多少？", placeholder: "输入体积", check: v => Math.abs(parseFloat(v) - b * b * b) < 1e-6 })
        } else if (difficulty === "medium") {
          items.push({ prompt: "立方差 a³ - b³ 是多少？", placeholder: "输入结果", check: v => Math.abs(parseFloat(v) - diff) < 1e-6 })
          items.push({ prompt: "如果 a=2b，用 b 表示立方差", placeholder: "如 7b³", check: v => v.trim() === "7b³" || v.trim() === "7b^3" })
        } else {
          items.push({ prompt: "如果 a³ - b³ = 19，且 a=3，求 b", placeholder: "输入b的值", check: v => Math.abs(parseFloat(v) - 2) < 1e-6 })
          items.push({ prompt: "因式分解：a³ - b³ = ?（输入 (a-b)(a²+ab+b²)）", placeholder: "输入因式分解结果", check: v => {
            const clean = v.trim().toLowerCase().replace(/\s+/g, '')
            return clean === "(a-b)(a²+ab+b²)" || clean === "(a-b)(a^2+ab+b^2)" || clean === "(a-b)(a2+ab+b2)"
          }})
        }
        return items
      }}
      onEvaluate={() => ({ 
        correct: true, 
        text: `立方差公式：${a}³ - ${b}³ = ${a * a * a} - ${b * b * b} = ${a * a * a - b * b * b}\n几何意义：大立方体体积减去小立方体体积\n因式分解：(${a}-${b})(${a}²+${a}${b}+${b}²) = (${a}-${b})(${a*a}+${a*b}+${b*b})` 
      })}
    >
      <Narration avatar="/icons/area.svg" name="数学老师">
        {stage === 0 && `让我们设置两个立方体的边长：大立方体边长为 ${a}，小立方体边长为 ${b}。`}
        {stage === 1 && `观察这两个立方体，大立方体有 ${a * a * a} 个小方块，小立方体有 ${b * b * b} 个小方块。`}
        {stage === 2 && `大立方体的体积是 ${a}³ = ${a * a * a}，小立方体的体积是 ${b}³ = ${b * b * b}。`}
        {stage === 3 && `立方差就是体积相减：${a}³ - ${b}³ = ${a * a * a} - ${b * b * b} = ${a * a * a - b * b * b} = (${a}-${b})(${a}²+${a}${b}+${b}²)`}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">边长 a (大)</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={a}
            onChange={e => { 
              const newA = Math.max(2, Math.min(5, parseFloat(e.target.value || "2")))
              setA(Math.max(newA, b + 1)); // Ensure a > b
              setStage(0) 
            }}
            min="2"
            max="5"
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">边长 b (小)</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={b}
            onChange={e => { 
              const newB = Math.max(1, Math.min(4, parseFloat(e.target.value || "1")))
              setB(Math.min(newB, a - 1)); // Ensure b < a
              setStage(0) 
            }}
            min="1"
            max="4"
          />
        </div>
      </div>

      <CubeDiffVisualization a={a} b={b} stage={stage} />
      
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}