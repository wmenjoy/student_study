"use client"
import { useState, useRef, useEffect } from "react"
import { MixAdd } from "../../../components/MixAdd"
import { LessonRunner } from "../../../components/LessonRunner"
import { mapMixAdd } from "../../../lib/mapping"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function MixAddPage() {
  const [start, setStart] = useState(36)
  const [inMorning, setIn] = useState(12)
  const [outAfternoon, setOut] = useState(18)
  const [stage, setStage] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const steps = [
    "步骤1：初始状态——仓库里原本有一些货物",
    "步骤2：上午入库——新货物运进来了，数量增加",
    "步骤3：下午出库——部分货物被运走，数量减少"
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
    // Optional: Auto-advance logic could go here if we wanted fully automatic play
  }

  return (
    <LessonRunner title="加混合" skillId="math-mix-add" intro={{ story: "仓库上午入货、下午出货，想知道现在还有多少。", goal: "把变化过程画成线段并计算结果", steps: ["设定初始数量", "加入上午入库", "再减去下午出库"] }} hints={{ build: ["输入初始数量", "输入‘加上’的数量", "输入‘减去’的数量"], map: ["点击评估", "读出‘先加再减’的过程表达"], review: ["变式：先减后加会怎样？"] }} variantGen={(diff) => {
      const make = (s: number, i: number, o: number) => ({ label: `初=${s} +${i} -${o}`, apply: () => { setStart(s); setIn(i); setOut(o); setStage(0) } })
      if (diff === "easy") return [make(36, 12, 18), make(20, 5, 4), make(15, 6, 3)]
      if (diff === "medium") return [make(50, 10, 15), make(40, 8, 12), make(60, 12, 20), make(26, 9, 5)]
      return [make(100, 30, 25), make(80, 15, 30), make(90, 20, 35), make(120, 40, 50), make(72, 18, 27)]
    }} microTestGen={(diff) => {
      const afterIn = start + inMorning
      const end = afterIn - outAfternoon
      const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
      if (diff === "easy") { items.push({ prompt: "求上午入库后的数量", placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - afterIn) < 1e-6 }); items.push({ prompt: "求最终数量", placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - end) < 1e-6 }) }
      else if (diff === "medium") { items.push({ prompt: `把下午出库改为 ${outAfternoon + 2} 的最终数量`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - (afterIn - (outAfternoon + 2))) < 1e-6 }); items.push({ prompt: `把上午入库改为 ${inMorning + 3} 的最终数量`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - ((start + (inMorning + 3)) - outAfternoon)) < 1e-6 }) }
      else { items.push({ prompt: `先减 ${outAfternoon} 再加 ${inMorning} 的最终数量`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - ((start - outAfternoon) + inMorning)) < 1e-6 }); items.push({ prompt: `把初始改为 ${start + 10} 的最终数量`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - (((start + 10) + inMorning) - outAfternoon)) < 1e-6 }); items.push({ prompt: `把入库与出库都加 5 的最终数量`, placeholder: "输入数量", check: v => Math.abs(parseFloat(v) - (((start) + (inMorning + 5)) - (outAfternoon + 5))) < 1e-6 }) }
      return items
    }} onEvaluate={() => ({ correct: true, text: mapMixAdd(start, inMorning, outAfternoon) })}>
      <Narration avatar="/mascots/cat.svg" name="乐乐猫">早上来了好多箱，下午拿走了一些，现在还剩多少呢？用线段一步一步表示出来吧！</Narration>
      <div className="controls">
        <div className="control"><label>初始</label><input type="number" value={start} onChange={e => setStart(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>上午入库</label><input type="number" value={inMorning} onChange={e => setIn(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>下午出库</label><input type="number" value={outAfternoon} onChange={e => setOut(parseFloat(e.target.value || "0"))} /></div>
      </div>
      <MixAdd start={start} inMorning={inMorning} outAfternoon={outAfternoon} stage={stage} />
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}