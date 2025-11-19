"use client"
import { useState, useRef, useEffect } from "react"
import { Planting } from "../../../components/Planting"
import { LessonRunner } from "../../../components/LessonRunner"
import { mapPlanting } from "../../../lib/mapping"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"

export default function PlantingPage() {
  const [trees, setTrees] = useState(8)
  const [spacing, setSpacing] = useState(5)
  const [stage, setStage] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const steps = [
    "步骤1：准备——确定要种多少棵树，每棵树之间隔多远",
    "步骤2：种树——一棵一棵种下去，数数看",
    "步骤3：数间隔——两棵树之间有一个间隔",
    "步骤4：计算——总长 = 间隔数 × 间距"
  ]

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => { return () => clearTimer() }, [])

  const onStep = (i: number) => {
    setStage(i)
    clearTimer()

    if (i === 0) {
      setProgress(0)
    } else if (i === 1) {
      // Animate planting trees
      setProgress(0)
      let p = 0
      timerRef.current = setInterval(() => {
        p += 2 // Speed of planting
        if (p >= 100) {
          p = 100
          clearTimer()
        }
        setProgress(p)
      }, 20)
    } else if (i === 2) {
      // Show intervals (progress > 50 triggers intervals in component)
      setProgress(100)
    } else if (i === 3) {
      setProgress(100)
    }
  }

  return (
    <LessonRunner title="植树问题" skillId="math-planting" intro={{ story: "在小路两侧按固定间距种树。", goal: "理解间隔=棵数-1，并计算路长", steps: ["设置棵数与间距", "观察间隔数与路长", "生成表达"] }} hints={{ build: ["输入棵数（至少2棵）", "输入相邻间距", "观察‘间隔=棵数-1’"], map: ["点击评估", "读出路长=间隔×间距"], review: ["把间距扩大或缩小，路长如何变？"] }} variantGen={(diff) => {
      const make = (t: number, s: number) => ({ label: `棵=${t} 间=${s}`, apply: () => { setTrees(t); setSpacing(s); setStage(0); setProgress(0) } })
      if (diff === "easy") return [make(8, 5), make(6, 4), make(5, 3)]
      if (diff === "medium") return [make(10, 5), make(12, 4), make(9, 6), make(7, 7)]
      return [make(15, 5), make(18, 4), make(20, 6), make(12, 8), make(25, 3)]
    }} microTestGen={(diff) => {
      const intervals = Math.max(0, trees - 1)
      const roadLen = intervals * spacing
      const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
      if (diff === "easy") { items.push({ prompt: "求 间隔 数量", placeholder: "输入间隔", check: v => Math.abs(parseFloat(v) - intervals) < 1e-6 }); items.push({ prompt: "求 路长", placeholder: "输入路长", check: v => Math.abs(parseFloat(v) - roadLen) < 1e-6 }) }
      else if (diff === "medium") { items.push({ prompt: `把 间距 改为 ${spacing + 2} 的路长`, placeholder: "输入路长", check: v => Math.abs(parseFloat(v) - intervals * (spacing + 2)) < 1e-6 }); items.push({ prompt: `把 棵数 改为 ${trees + 3} 的间隔`, placeholder: "输入间隔", check: v => Math.abs(parseFloat(v) - (trees + 3 - 1)) < 1e-6 }) }
      else { items.push({ prompt: `把 间距 翻倍 的路长`, placeholder: "输入路长", check: v => Math.abs(parseFloat(v) - intervals * (spacing * 2)) < 1e-6 }); items.push({ prompt: `把 棵数 改为 ${trees - 2} 的路长`, placeholder: "输入路长", check: v => Math.abs(parseFloat(v) - ((trees - 2 - 1) * spacing)) < 1e-6 }); items.push({ prompt: `解释：为何间隔=棵数-1？输入 yes`, placeholder: "输入yes", check: v => v.trim().toLowerCase() === "yes" }) }
      return items
    }} onEvaluate={() => ({ correct: true, text: mapPlanting(trees, spacing) })}>
      <Narration avatar="/mascots/bear.svg" name="阿奇熊">两树之间的空隙就是‘间隔’。数一数间隔有几个，再乘上每个间隔的长度，就能得到小路的长度啦！</Narration>
      <div className="controls">
        <div className="control"><label>每侧棵数</label><input type="number" value={trees} onChange={e => setTrees(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>相邻间距</label><input type="number" value={spacing} onChange={e => setSpacing(parseFloat(e.target.value || "0"))} /></div>
      </div>
      <Planting trees={trees} spacing={spacing} progress={progress} />
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}