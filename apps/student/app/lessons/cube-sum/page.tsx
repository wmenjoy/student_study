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
  const [showCanvas, setShowCanvas] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)

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
      `小朋友们，今天我们来学习立方和公式。设置两个立方体的边长：第一个边长为 ${a}，第二个边长为 ${b}。`,
      `让我们一步步构建(${a}+${b})³，就像搭积木一样！`,
      `通过3D图形，我们可以看到每一项都对应一个具体的几何图形。`,
      `记住公式：(${a}+${b})³ = ${a}³ + ${b}³ + 3a²b + 3ab²`
    ][stage] || ""

    if (narrationText) {
      speak(narrationText)
    }
  }, [stage, a, b])

  return (
    <LessonRunner
      title="立方和公式 (a+b)³"
      skillId="math-cube-sum"
      intro={{
        story: "就像搭积木一样，我们把两个数的和立方，看看会变成什么样子！",
        goal: "掌握立方和公式，理解每一项的几何意义",
        steps: ["设置数字", "构建演示", "图形验证", "公式记忆"]
      }}
      hints={{
        build: ["输入两个数，就像选择积木大小", "观察3D图形的构建过程"],
        map: ["理解每一项对应的图形", "记住展开公式"],
        review: ["尝试不同的数字组合", "发现规律"]
      }}
      variantGen={(difficulty) => {
        const make = (aa: number, bb: number) => ({ 
          label: `a=${aa}, b=${bb}`, 
          apply: () => { setA(aa); setB(bb); setStage(0) } 
        })
        if (difficulty === "easy") return [make(1, 2), make(2, 3), make(3, 4)]
        if (difficulty === "medium") return [make(2, 3), make(3, 4), make(4, 5), make(5, 6)]
        return [make(3, 4), make(4, 5), make(6, 7), make(5, 8), make(6, 9), make(7, 10)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        const total = a * a * a + b * b * b
        
        if (difficulty === "easy") {
          items.push({ prompt: "第一个立方体的体积是多少？", placeholder: "输入数字", check: v => Math.abs(parseFloat(v) - a * a * a) < 1e-6 })
          items.push({ prompt: "第二个立方体的体积是多少？", placeholder: "输入数字", check: v => Math.abs(parseFloat(v) - b * b * b) < 1e-6 })
        } else if (difficulty === "medium") {
          items.push({ prompt: "立方和是多少？", placeholder: "输入结果", check: v => Math.abs(parseFloat(v) - total) < 1e-6 })
          items.push({ prompt: "展开式有几项？", placeholder: "输入数字", check: v => parseInt(v) === 8 })
        } else {
          items.push({ prompt: "如果a=b，用 b 表示立方和", placeholder: "输入表达式", check: v => v.trim() === "2b³" || v.trim() === "2b^3" })
          items.push({ prompt: "立方和公式是什么？", placeholder: "输入公式", check: v => {
            const clean = v.replace(/\s+/g, '').toLowerCase()
            return clean.includes('(a+b)³') || clean.includes('(a+b)^3') || clean.includes('a³+3a²b+3ab²')
          }})
        }
        return items
      }}
      onEvaluate={() => ({ 
        correct: true, 
        text: `立方和公式：(${a}+${b})³ = ${a}³ + ${b}³ + 3a²b + 3ab²\n计算结果：${total}\n几何意义：两个立方体体积加上三个长方体` 
      })}
    >
      <Narration avatar="/icons/area.svg" name="数学老师">
        {stage === 0 && `小朋友们，今天我们来学习立方和公式。设置两个立方体的边长：第一个边长为 ${a}，第二个边长为 ${b}。`}
        {stage === 1 && `让我们一步步构建(${a}+${b})³，就像搭积木一样！`}
        {stage === 2 && `通过3D图形，我们可以看到每一项都对应一个具体的几何图形。`}
        {stage === 3 && `记住公式：(${a}+${b})³ = ${a}³ + ${b}³ + 3a²b + 3ab²`}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">边长 a</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={a}
            onChange={e => { 
              const newA = Math.max(1, Math.min(6, parseFloat(e.target.value || "1")))
              setA(newA)
              setStage(0) 
            }}
            min="1"
            max="6"
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">边长 b</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={b}
            onChange={e => { 
              const newB = Math.max(1, Math.min(6, parseFloat(e.target.value || "1")))
              setB(newB)
              setStage(0) 
            }}
            min="1"
            max="6"
          />
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">显示选项</label>
          <div className="flex gap-2">
            <button
              className={`px-3 py-2 rounded-lg text-sm ${showCanvas ? "bg-blue-500 text-white" : "bg-gray-200"}`}
              onClick={() => { setShowCanvas(!showCanvas); setStage(0) }}
            >
              Canvas动画
            </button>
          </div>
        </div>
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">动画速度</label>
          <select
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-sm"
            value={animationSpeed}
            onChange={e => setAnimationSpeed(parseInt(e.target.value))}
          >
            <option value={2000}>慢速</option>
            <option value={1000}>正常</option>
            <option value={500}>快速</option>
          </select>
        </div>
      </div>

      <CubeSumVisualization a={a} b={b} stage={stage} showCanvas={showCanvas} animationSpeed={animationSpeed} />
      
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}