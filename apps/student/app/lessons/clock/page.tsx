"use client"
import { useEffect, useState, useRef } from "react"
import { ClockDiff } from "../../../components/ClockDiff"
import { LessonRunner } from "../../../components/LessonRunner"
import { mapClockDiff } from "../../../lib/mapping"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"
import { AnalogClock } from "../../../components/AnalogClock"

export default function ClockPage() {
  const [sh, setSh] = useState(8)
  const [sm, setSm] = useState(5)
  const [eh, setEh] = useState(8)
  const [em, setEm] = useState(30)

  const [stage, setStage] = useState(0)
  const [curH, setCurH] = useState(sh)
  const [curM, setCurM] = useState(sm)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const start = sh * 60 + sm
  const end = eh * 60 + em
  const diff = end - start

  const steps = [
    "步骤1：准备——设置出发时间和到达时间",
    "步骤2：观察——看着分针怎么走，数数过了多少分",
    "步骤3：计算——把时间都换成分钟，用减法算一算"
  ]

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    return () => clearTimer()
  }, [])

  // Reset current time when start/end changes, if in step 0
  useEffect(() => {
    if (stage === 0) {
      setCurH(sh)
      setCurM(sm)
    }
  }, [sh, sm, stage])

  const onStep = (i: number) => {
    setStage(i)
    clearTimer()

    if (i === 0) {
      setCurH(sh)
      setCurM(sm)
    } else if (i === 1) {
      // Animate from start to end
      setCurH(sh)
      setCurM(sm)
      const totalMinutes = end - start
      if (totalMinutes === 0) return

      let p = 0
      const duration = 2000 // 2 seconds animation
      const frameTime = 20
      const totalFrames = duration / frameTime
      const stepSize = totalMinutes / totalFrames

      timerRef.current = setInterval(() => {
        p += stepSize
        let currentMin = start + p

        // Handle direction
        if (totalMinutes > 0 && currentMin >= end) {
          currentMin = end
          clearTimer()
        } else if (totalMinutes < 0 && currentMin <= end) {
          currentMin = end
          clearTimer()
        }

        setCurH(Math.floor(currentMin / 60) % 24)
        setCurM(Math.floor(currentMin % 60))
      }, frameTime)
    } else if (i === 2) {
      setCurH(eh)
      setCurM(em)
    }
  }

  const getNarrationText = () => {
    if (stage === 0) return "先拨好钟表，确定出发和到达的时间吧！"
    if (stage === 1) return "注意看分针走了多远？每走一小格是1分钟，一大格是5分钟哦。"
    if (stage === 2) return "把时间都换成分钟，再用到达时间减去出发时间，就能算出经过了多久啦！"
    return "加油！"
  }

  return (
    <LessonRunner
      title="时钟问题"
      skillId="math-clock"
      intro={{
        story: "从家出发到游乐场，看看花了多久。",
        goal: "学会用分钟计算时间差",
        steps: ["设置出发与到达时间", "在时间条上观察差值", "生成表达"]
      }}
      hints={{
        build: ["输入出发时分与到达时分", "把时间换成分钟在心里算"],
        map: ["点击评估", "读出‘用时=到达−出发’（分钟）"],
        review: ["如果跨小时怎么办？先换成分钟再算"]
      }}
      variantGen={(diff) => {
        const make = (shh: number, smm: number, ehh: number, emm: number) => ({
          label: `${shh}:${smm} → ${ehh}:${emm}`,
          apply: () => { setSh(shh); setSm(smm); setEh(ehh); setEm(emm); setStage(0); setCurH(shh); setCurM(smm); }
        })
        if (diff === "easy") return [make(8, 5, 8, 30), make(7, 10, 7, 40), make(9, 0, 9, 20)]
        if (diff === "medium") return [make(8, 50, 9, 20), make(7, 45, 8, 15), make(6, 30, 7, 10), make(5, 55, 6, 25)]
        return [make(8, 5, 9, 30), make(6, 40, 8, 10), make(7, 20, 8, 45), make(9, 10, 10, 5), make(5, 0, 6, 50)]
      }}
      microTestGen={(diff) => {
        const s = sh * 60 + sm
        const e = eh * 60 + em
        const d = e - s
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        if (diff === "easy") {
          items.push({ prompt: "把开始时间换成分钟", placeholder: "输入分钟", check: v => Math.abs(parseFloat(v) - s) < 1e-6 })
          items.push({ prompt: "求用时(分钟)", placeholder: "输入分钟", check: v => Math.abs(parseFloat(v) - d) < 1e-6 })
        } else if (diff === "medium") {
          items.push({ prompt: `把到达时间换成分钟`, placeholder: "输入分钟", check: v => Math.abs(parseFloat(v) - e) < 1e-6 })
          items.push({ prompt: `把开始时间提前5分钟的新用时`, placeholder: "输入分钟", check: v => Math.abs(parseFloat(v) - (e - (s - 5))) < 1e-6 })
        } else {
          items.push({ prompt: `把到达时间延后10分钟的新用时`, placeholder: "输入分钟", check: v => Math.abs(parseFloat(v) - ((e + 10) - s)) < 1e-6 })
          items.push({ prompt: `从 ${sh}:${String(sm).padStart(2, '0')} 到 ${eh}:${String(em).padStart(2, '0')} 的用时是否跨小时（yes/no）`, placeholder: "yes 或 no", check: v => ((eh > sh || (eh === sh && em >= sm)) ? v.toLowerCase() === "yes" : v.toLowerCase() === "no") })
        }
        return items
      }}
      onEvaluate={() => ({ correct: true, text: mapClockDiff(sh, sm, eh, em) })}
    >
      <Narration avatar="/mascots/bunny.svg" name="泡泡兔">{getNarrationText()}</Narration>

      <div className="flex justify-center my-4">
        <AnalogClock hour={curH} minute={curM} />
      </div>

      <div className="controls">
        <div className="control"><label>开始时</label><input type="number" value={sh} onChange={e => setSh(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>开始分</label><input type="number" value={sm} onChange={e => setSm(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>结束时</label><input type="number" value={eh} onChange={e => setEh(parseFloat(e.target.value || "0"))} /></div>
        <div className="control"><label>结束分</label><input type="number" value={em} onChange={e => setEm(parseFloat(e.target.value || "0"))} /></div>
      </div>

      <ClockDiff startH={sh} startM={sm} endH={eh} endM={em} />

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} />
    </LessonRunner>
  )
}