"use client"
import { useRef, useState, useEffect } from "react"
import { Stairs } from "../../../components/Stairs"
import { LessonRunner } from "../../../components/LessonRunner"
import { mapStairs } from "../../../lib/mapping"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function StairsPage() {
  const [from, setFrom] = useState(7)
  const [to, setTo] = useState(1)
  const [tp, setTp] = useState(3)
  const [stage, setStage] = useState(0)
  const [count, setCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const timerRef = useRef<number | undefined>(undefined)
  const floors = Math.abs(from - to)
  const goingUp = to > from
  const steps = [
    goingUp ? "步骤1：先判断方向——今天我们要上楼！" : "步骤1：先判断方向——今天我们要下楼！",
    "步骤2：标记起点与目标——从起点开始，看看要到哪一层",
    "步骤3：一起数层——一层、两层……数到目标，得到层数",
    "步骤4：乘法计算——总时间 = 层数 × 每层时间",
    goingUp ? "步骤5：动起来——小兔向上爬，体验每层用时" : "步骤5：动起来——小兔向下走，体验每层用时"
  ]
  const clearTimer = () => { if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = undefined } }
  useEffect(() => { return () => clearTimer() }, [])
  const onStep = (i: number) => {
    setStage(i)
    clearTimer()
    if (i === 0) { setCount(0); setProgress(0) }
    if (i === 1) { setCount(0); setProgress(0) }
    if (i === 2) { setCount(0); setProgress(0); timerRef.current = setInterval(() => { setCount(c => { const nx = Math.min(floors, c + 1); if (nx === floors) clearTimer(); return nx }) }, 500) as any }
    if (i === 3) { setCount(floors); setProgress(0) }
    if (i === 4) {
      setCount(0); setProgress(0)
      timerRef.current = setInterval(() => {
        setProgress(v => {
          const nx = Math.min(floors, v + 0.05)
          setCount(Math.floor(nx))
          if (nx === floors) clearTimer()
          return nx
        })
      }, tp * 10) as any
    }
  }
  return (
    <LessonRunner title="爬楼问题" skillId="math-stairs" intro={{ story: "从某一层跑到另一层，每层需要固定时间。", goal: "计算层数与总时间", steps: ["设置起始与目标楼层", "设置每层时间", "生成表达"] }} hints={{ build: ["输入起始楼层与目标楼层", "输入每层时间"], map: ["点击评估", "读出‘层数×时间’"], review: ["把目标楼层变远一些再试试"] }} microTestGen={(diff) => {
      const fl = Math.abs(from - to)
      const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
      if (diff === "easy") {
        items.push({ prompt: `求 层数`, placeholder: "输入层数", check: v => Math.abs(parseFloat(v) - fl) < 1e-6 })
        items.push({ prompt: `求 总时间`, placeholder: "输入总时间", check: v => Math.abs(parseFloat(v) - fl * tp) < 1e-6 })
      } else if (diff === "medium") {
        items.push({ prompt: `把 每层时间 改为 ${tp + 1} 的总时间`, placeholder: "输入总时间", check: v => Math.abs(parseFloat(v) - fl * (tp + 1)) < 1e-6 })
        items.push({ prompt: `把 目标楼层 改为 ${to + (to > from ? 2 : -2)} 的层数`, placeholder: "输入层数", check: v => Math.abs(parseFloat(v) - Math.abs(from - (to + (to > from ? 2 : -2)))) < 1e-6 })
      } else {
        items.push({ prompt: `若从 ${from} 到 ${to} 先上再下共 ${fl} 层，求 总时间`, placeholder: "输入总时间", check: v => Math.abs(parseFloat(v) - fl * tp) < 1e-6 })
        items.push({ prompt: `把 起始楼层 改为 ${from + (to > from ? 1 : -1)} 的新层数`, placeholder: "输入层数", check: v => Math.abs(parseFloat(v) - Math.abs((from + (to > from ? 1 : -1)) - to)) < 1e-6 })
        items.push({ prompt: `若每层时间变为 ${tp * 2}，总时间是多少？`, placeholder: "输入总时间", check: v => Math.abs(parseFloat(v) - fl * tp * 2) < 1e-6 })
      }
      return items
    }} onEvaluate={() => ({ correct: true, text: mapStairs(from, to, tp) })}>
      <Narration avatar="/mascots/cat.svg" name="乐乐猫">每上一层都要花一样的时间。数一数要过几层，再乘上每层时间，就知道总时间啦！</Narration>
      <div className="controls">
        <div className="control"><label>起始楼层</label><input type="number" value={from} onChange={e => setFrom(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>目标楼层</label><input type="number" value={to} onChange={e => setTo(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>每层时间</label><input type="number" value={tp} onChange={e => setTp(parseFloat(e.target.value || "0"))} /></div>
      </div>
      <Stairs from={from} to={to} timePerFloor={tp} count={count} progress={progress} />
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}