"use client"
import { JourneySim } from "../../../components/JourneySim"
import { useState, useEffect, useRef } from "react"
import { mapJourneyState } from "../../../lib/mapping"
import { LessonRunner } from "../../../components/LessonRunner"
import { guidanceFor } from "../../../lib/microGuidance"
import { Narration } from "../../../components/Narration"
import { StepPlayer } from "../../../components/StepPlayer"

export default function JourneyLessonPage() {
  const [a, setA] = useState({ x: 0, v: 3 })
  const [b, setB] = useState({ x: 20, v: -2 })
  const [theme, setTheme] = useState<"ball" | "car" | "run">("ball")
  const [mode, setMode] = useState<"auto" | "manual">("auto")
  const [time, setTime] = useState(0)
  const [stage, setStage] = useState(0)
  const [showRuler, setShowRuler] = useState(true)
  const [showVelocityArrows, setShowVelocityArrows] = useState(true)
  const [afterBehavior, setAfterBehavior] = useState<"stop" | "together" | "bounce">("stop")

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const dx = b.x - a.x
  const dv = a.v - b.v
  const tMeet = dv !== 0 ? dx / dv : Infinity
  const canMeet = dv !== 0 && dx / dv >= 0
  const meetX = a.x + a.v * (canMeet ? tMeet : 0)
  const dA = canMeet ? Math.abs(a.v) * tMeet : 0
  const dB = canMeet ? Math.abs(b.v) * tMeet : 0
  const total = dA + dB

  const steps = [
    "步骤1：准备——设置起点与速度",
    "步骤2：观察——自动播放移动过程",
    "步骤3：相遇——直接跳到相遇时刻",
    "步骤4：总结——读出时间与位置"
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

  const onStepChange = (i: number) => {
    setStage(i)
    clearTimer()

    if (i === 0) {
      setMode("manual")
      setTime(0)
    } else if (i === 1) {
      setMode("manual")
      setTime(0)
      // Auto play logic
      let t = 0
      const maxTime = canMeet ? tMeet + 1 : 10
      timerRef.current = setInterval(() => {
        t += 0.05
        if (t >= maxTime) {
          t = maxTime
          clearTimer()
        }
        setTime(t)
      }, 50)
    } else if (i === 2) {
      setMode("manual")
      setTime(canMeet ? tMeet : 10)
    } else if (i === 3) {
      setMode("manual")
      setTime(canMeet ? tMeet : 10)
    }
  }

  const getNarrationText = () => {
    if (stage === 0) return "小车A和小车B要去见面会。调整起点和速度，准备出发！"
    if (stage === 1) return "仔细看，它们是相向而行吗？谁跑得快一点？"
    if (stage === 2) return "看！这就是它们相遇的时刻。记下这个时间和位置哦。"
    if (stage === 3) return "相遇时间 = 路程差 ÷ 速度差。你算对了吗？"
    return "加油！"
  }

  return (
    <LessonRunner
      title="行程仿真"
      skillId="math-journey"
      intro={{
        story: "小车A与小车B在直线道路上行驶，想知道它们是否会在路上相遇。",
        goal: "通过线段与动画找出相遇时间与位置",
        steps: ["设置起点与速度", "观察移动动画", "点击评估生成表达"]
      }}
      onVariant={() => {
        const nx = Math.floor(Math.random() * 20)
        const ny = nx + Math.floor(Math.random() * 20 + 5)
        const va = Math.floor(1 + Math.random() * 4)
        const vb = -Math.floor(1 + Math.random() * 4)
        setA({ x: nx, v: va }); setB({ x: ny, v: vb }); setStage(0); setMode("manual"); setTime(0)
      }}
      hints={{
        build: ["把A设在左边，B设在右边", "让两者速度方向相向", "观察圆点在路线上移动"],
        map: ["点击评估", "读出‘相遇时间t和位置x’", "记录到练习本"],
        review: ["如果速度一样会怎样？", "改变速度再评估一次"]
      }}
      variantGen={(diff) => {
        const make = (ax: number, av: number, bx: number, bv: number) => ({ label: `A(${ax},${av}) B(${bx},${bv})`, apply: () => { setA({ x: ax, v: av }); setB({ x: bx, v: bv }); setStage(0); setTime(0); } })
        if (diff === "easy") return [make(0, 2, 20, -2), make(5, 1, 15, -1), make(0, 3, 18, -2)]
        if (diff === "medium") return [make(0, 2, 25, -3), make(4, 3, 22, -2), make(2, 1, 16, -2), make(6, 2, 20, -3)]
        return [make(0, 4, 30, -3), make(10, 3, 40, -2), make(5, 5, 35, -3), make(3, 4, 28, -2), make(2, 3, 26, -4)]
      }}
      variantCount={5}
      microTestGen={(diff) => {
        const items = [] as Array<{ prompt: string; placeholder?: string; check: (v: string) => boolean }>
        const dx2 = b.x - a.x
        const dv2 = a.v - b.v
        const t2 = dv2 !== 0 ? dx2 / dv2 : Infinity
        const x2 = a.x + a.v * (isFinite(t2) && t2 >= 0 ? t2 : 0)
        if (diff === "easy") {
          items.push({ prompt: `求相遇时间 t`, placeholder: "输入t", check: v => Math.abs(parseFloat(v) - t2) < 1e-6 })
          items.push({ prompt: `求相遇位置 x`, placeholder: "输入x", check: v => Math.abs(parseFloat(v) - x2) < 1e-6 })
        } else if (diff === "medium") {
          items.push({ prompt: `把 A 速度加 1 后的相遇时间`, placeholder: "输入t", check: v => { const tt = (b.x - a.x) / ((a.v + 1) - b.v); return Math.abs(parseFloat(v) - tt) < 1e-6 } })
          items.push({ prompt: `把 B 速度改为 ${(-Math.abs(b.v)).toFixed(0)} 后的相遇位置`, placeholder: "输入x", check: v => { const tt = (b.x - a.x) / (a.v - (-Math.abs(b.v))); const xx = a.x + a.v * tt; return Math.abs(parseFloat(v) - xx) < 1e-6 } })
        } else {
          items.push({ prompt: `求 A 的路程 与 B 的路程 之和`, placeholder: "输入和", check: v => { const sA = Math.abs(a.v) * (isFinite(t2) && t2 >= 0 ? t2 : 0); const sB = Math.abs(b.v) * (isFinite(t2) && t2 >= 0 ? t2 : 0); return Math.abs(parseFloat(v) - (sA + sB)) < 1e-6 } })
          items.push({ prompt: `把 A 起点改为 ${a.x + 2}，新的相遇时间`, placeholder: "输入t", check: v => { const tt = (b.x - (a.x + 2)) / (a.v - b.v); return Math.abs(parseFloat(v) - tt) < 1e-6 } })
          items.push({ prompt: `把 B 起点改为 ${b.x + 3}，新的相遇位置`, placeholder: "输入x", check: v => { const tt = ((b.x + 3) - a.x) / (a.v - b.v); const xx = a.x + a.v * tt; return Math.abs(parseFloat(v) - xx) < 1e-6 } })
        }
        return items
      }}
      onEvaluate={() => {
        const dx = b.x - a.x
        const dv = a.v - b.v
        const ok = dv !== 0 && dx / dv >= 0
        const text = mapJourneyState({ a, b })
        let hint = guidanceFor("journey_ok")
        if (dv === 0) hint = guidanceFor("journey_same_speed")
        else if (dx / dv < 0) hint = guidanceFor("journey_past")
        return { correct: ok, text, hint }
      }}
    >
      <Narration avatar="/mascots/cat.svg" name="乐乐猫">{getNarrationText()}</Narration>

      <div className="controls">
        <div className="control">
          <label>A 起点</label>
          <input type="number" value={a.x} onChange={e => setA({ ...a, x: parseFloat(e.target.value || "0") })} />
        </div>
        <div className="control">
          <label>A 速度</label>
          <input type="number" value={a.v} onChange={e => setA({ ...a, v: parseFloat(e.target.value || "0") })} />
        </div>
        <div className="control">
          <label>B 起点</label>
          <input type="number" value={b.x} onChange={e => setB({ ...b, x: parseFloat(e.target.value || "0") })} />
        </div>
        <div className="control">
          <label>B 速度</label>
          <input type="number" value={b.v} onChange={e => setB({ ...b, v: parseFloat(e.target.value || "0") })} />
        </div>
        <div className="control">
          <label>主题</label>
          <select value={theme} onChange={e => setTheme(e.target.value as any)}>
            <option value="ball">小球</option>
            <option value="car">小轿车</option>
            <option value="run">赛跑</option>
          </select>
        </div>
      </div>

      <JourneySim a={a} b={b} theme={theme} mode={mode} time={time} onTimeChange={setTime} stage={stage} showRuler={showRuler} showVelocityArrows={showVelocityArrows} afterBehavior={afterBehavior} />

      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStepChange} />

      <div className="controls">
        <div className="control">
          <label>显示选项</label>
          <label><input type="checkbox" checked={showRuler} onChange={e => setShowRuler(e.target.checked)} /> 尺规刻度</label>
          <label><input type="checkbox" checked={showVelocityArrows} onChange={e => setShowVelocityArrows(e.target.checked)} /> 速度箭头</label>
        </div>
      </div>

      {stage >= 2 && (
        <div className="panel">
          <div>相遇时间：{canMeet ? tMeet.toFixed(2) + "s" : "不相遇"}</div>
          <div>相遇位置：{canMeet ? meetX.toFixed(2) : "-"}</div>
          <div>A 路程：{canMeet ? dA.toFixed(2) : "-"}</div>
          <div>B 路程：{canMeet ? dB.toFixed(2) : "-"}</div>
          <div>总路程：{canMeet ? total.toFixed(2) : "-"}</div>
        </div>
      )}
    </LessonRunner>
  )
}