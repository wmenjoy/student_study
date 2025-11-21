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
  const [showCanvas, setShowCanvas] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(1000)

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
      `小朋友们，今天我们来学习平方差公式。设置两个正方形的边长：第一个边长为 ${a}，第二个边长为 ${b}。`,
      `让我们一步步展开(a-b)²，就像搭积木一样！`,
      `通过彩色方块，我们可以看到每一项都对应一个具体的几何图形。`,
      `记住公式：(a-b)² = a² - 2ab + b²`
    ][stage] || ""

    if (narrationText) {
      speak(narrationText)
    }
  }, [stage, a, b])

  return (
    <LessonRunner
      title="平方差公式 (a-b)²"
      skillId="math-square-diff"
      intro={{
        story: "就像搭积木一样，我们把两个数的差平方，看看会变成什么样子！",
        goal: "掌握平方差公式，理解每一项的几何意义",
        steps: ["设置数字", "展开演示", "图形验证", "公式记忆"]
      }}
      hints={{
        build: ["输入两个数，就像选择积木大小", "观察展开的动画过程"],
        map: ["理解每一项对应的图形", "记住展开公式"],
        review: ["尝试不同的数字组合", "发现规律"]
      }}
      variantGen={(difficulty) => {
        const make = (aa: number, bb: number) => ({ 
          label: `a=${aa}, b=${bb}`, 
          apply: () => { setA(aa); setB(bb); setStage(0) } 
        })
        if (difficulty === "easy") return [make(5, 3), make(6, 4), make(4, 2)]
        if (difficulty === "medium") return [make(7, 5), make(8, 6), make(6, 4)]
        return [make(9, 7), make(8, 6), make(5, 4)]
      }}
      microTestGen={(difficulty) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        const A = a * a
        const B = b * b
        
        if (difficulty === "easy") {
          items.push({ prompt: "a²是多少？", placeholder: "输入数字", check: v => Math.abs(parseFloat(v) - A) < 1e-6 })
          items.push({ prompt: "b²是多少？", placeholder: "输入数字", check: v => Math.abs(parseFloat(v) - B) < 1e-6 })
        } else if (difficulty === "medium") {
          items.push({ prompt: "2ab是多少？", placeholder: "输入数字", check: v => Math.abs(parseFloat(v) - 2 * a * b) < 1e-6 })
          items.push({ prompt: "完全平方差展开式有几项？", placeholder: "输入数字", check: v => parseInt(v) === 4 })
        } else {
          items.push({ prompt: "因式分解(a-b)² = ?（输入 (a-b)(a+b)）", placeholder: "输入因式", check: v => {
            const clean = v.replace(/\s+/g, '').toLowerCase()
            return clean.includes('(a-b)(a+b)') || clean.includes('(a-b)(b+a)') || clean.includes('(a+b)(a-b)')
          }})
        }
        return items
      }}
      onEvaluate={() => ({ 
        correct: true, 
        text: `平方差公式：${a}² - ${b}² = ${a * a} - 2 * a * b + ${b * b} = ${a * a} - 2 * a * b + ${b * b}\n几何意义：大正方形减去小正方形` 
      })}
    >
      <Narration avatar="/icons/area.svg" name="数学老师">
        {stage === 0 && `小朋友们，今天我们来学习平方差公式。设置两个正方形的边长：第一个边长为 ${a}，第二个边长为 ${b}。`}
        {stage === 1 && `让我们一步步展开(a-b)²，就像搭积木一样！`}
        {stage === 2 && `通过彩色方块，我们可以看到每一项都对应一个具体的几何图形。`}
        {stage === 3 && `记住公式：(a-b)² = a² - 2ab + b²`}
      </Narration>

      <div className="controls flex gap-4 mb-6">
        <div className="control flex flex-col gap-1">
          <label className="text-sm text-slate-500 font-bold">边长 a</label>
          <input
            type="number"
            className="border-2 border-slate-200 rounded-lg px-3 py-2 text-lg font-mono w-24 focus:border-blue-500 outline-none"
            value={a}
            onChange={e => { 
              const newA = Math.max(1, Math.min(10, parseFloat(e.target.value || "1")))
              if (newA > b) {
                setA(newA)
              }
              setA(newA)
              setStage(0) 
            }}
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
            onChange={e => { 
              const newB = Math.max(1, Math.min(9, parseFloat(e.target.value || "1")))
              if (a > newB) {
                setB(newB)
              }
              setB(newB)
              setStage(0) 
            }}
            min="1"
            max="9"
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

      <SquareDiffVisualization a={a} b={b} stage={stage} showCanvas={showCanvas} animationSpeed={animationSpeed} />
      
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}