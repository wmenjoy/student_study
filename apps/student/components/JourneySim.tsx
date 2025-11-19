"use client"
import { useEffect, useRef, useState } from "react"

type Body = { x: number; v: number }
type Props = {
  a: Body
  b: Body
  theme?: "ball" | "car" | "run"
  mode?: "auto" | "manual"
  time?: number
  onTimeChange?: (t: number) => void
  stage?: number
  showRuler?: boolean
  showVelocityArrows?: boolean
  afterBehavior?: "stop" | "together" | "bounce"
}

export function JourneySim({ a, b, theme = "ball", mode = "auto", time, onTimeChange, stage = 0, showRuler = true, showVelocityArrows = true, afterBehavior = "stop" }: Props) {
  const [t, setT] = useState(0)
  const reqRef = useRef<number | null>(null)
  const startRef = useRef<number | null>(null)

  useEffect(() => {
    if (mode === "auto") {
      if (reqRef.current) cancelAnimationFrame(reqRef.current)
      startRef.current = null
      setT(0)
      const step = (ts: number) => {
        if (!startRef.current) startRef.current = ts
        const dt = (ts - startRef.current) / 1000
        setT(dt)
        if (onTimeChange) onTimeChange(dt)
        reqRef.current = requestAnimationFrame(step)
      }
      reqRef.current = requestAnimationFrame(step)
      return () => { if (reqRef.current) cancelAnimationFrame(reqRef.current) }
    } else {
      if (reqRef.current) cancelAnimationFrame(reqRef.current)
      startRef.current = null
      setT(time ?? 0)
      return () => {}
    }
  }, [a.x, a.v, b.x, b.v, mode])

  useEffect(() => {
    if (mode === "manual") setT(time ?? 0)
  }, [time, mode])

  const dv = a.v - b.v
  const dx = b.x - a.x
  const tMeet = dv !== 0 ? dx / dv : Infinity
  const meetHappens = isFinite(tMeet) && tMeet >= 0
  const ax0 = a.x + a.v * t
  const bx0 = b.x + b.v * t
  const meetX = a.x + a.v * (meetHappens ? tMeet : 0)
  let ax = ax0
  let bx = bx0
  if (meetHappens && t >= tMeet) {
    const dt = t - tMeet
    if (afterBehavior === "stop") {
      ax = meetX; bx = meetX
    } else if (afterBehavior === "together") {
      const v = a.v
      ax = meetX + v * dt
      bx = meetX + v * dt
    } else if (afterBehavior === "bounce") {
      ax = meetX + (-a.v) * dt
      bx = meetX + (-b.v) * dt
    }
  }
  const width = 600
  const height = 120
  const scale = 10
  const meet = meetHappens && t >= tMeet
  const sA = Math.abs(a.v) * (meet ? tMeet : t)
  const sB = Math.abs(b.v) * (meet ? tMeet : t)
  const sep = Math.abs(b.x - a.x)
  const maxUnits = Math.floor((width - 40) / scale)

  return (
    <svg width={width} height={height} className="svg-panel">
      <line x1={20} y1={60} x2={width - 20} y2={60} stroke="#333" />
      {showRuler && (
        <g>
          {Array.from({ length: maxUnits + 1 }).map((_, i) => (
            <line key={i} x1={20 + i * scale} y1={60} x2={20 + i * scale} y2={i % 5 === 0 ? 52 : 56} stroke="#999" />
          ))}
          {Array.from({ length: Math.floor(maxUnits / 5) + 1 }).map((_, i) => (
            <text key={i} x={20 + i * 5 * scale - 6} y={48} fill="#666" fontSize={10}>{i * 5}</text>
          ))}
        </g>
      )}
      {theme === "ball" && (
        <>
          <circle cx={20 + ax * scale} cy={60} r={10} fill="#6ba4ff" />
          <circle cx={20 + bx * scale} cy={60} r={10} fill="#f5a623" />
        </>
      )}
      {theme === "car" && (
        <>
          <text x={20 + ax * scale - 10} y={64} fontSize={20}>🚗</text>
          <text x={20 + bx * scale - 10} y={64} fontSize={20}>🚕</text>
        </>
      )}
      {theme === "run" && (
        <>
          <text x={20 + ax * scale - 10} y={64} fontSize={20}>🏃</text>
          <text x={20 + bx * scale - 10} y={64} fontSize={20}>🏃‍♀️</text>
        </>
      )}
      {showVelocityArrows && (
        <g>
          {(() => {
            const lenA = 12 + 4 * Math.min(5, Math.abs(a.v))
            const dirA = Math.sign(a.v) >= 0 ? 1 : -1
            const phase = Math.sin(t * 4)
            const axp = 20 + ax * scale + dirA * 16
            return (
              <g>
                <line x1={axp - dirA * lenA} y1={48} x2={axp} y2={48} stroke="#6ba4ff" strokeWidth={2} />
                <polygon points={`${axp},48 ${axp - dirA * 6},44 ${axp - dirA * 6},52`} fill="#6ba4ff" />
                <circle cx={axp - dirA * (lenA * 0.4 + phase * 2)} cy={48} r={2} fill="#6ba4ff" />
              </g>
            )
          })()}
          {(() => {
            const lenB = 12 + 4 * Math.min(5, Math.abs(b.v))
            const dirB = Math.sign(b.v) >= 0 ? 1 : -1
            const phase = Math.cos(t * 4)
            const bxp = 20 + bx * scale + dirB * 16
            return (
              <g>
                <line x1={bxp - dirB * lenB} y1={72} x2={bxp} y2={72} stroke="#f5a623" strokeWidth={2} />
                <polygon points={`${bxp},72 ${bxp - dirB * 6},68 ${bxp - dirB * 6},76`} fill="#f5a623" />
                <circle cx={bxp - dirB * (lenB * 0.4 + phase * 2)} cy={72} r={2} fill="#f5a623" />
              </g>
            )
          })()}
        </g>
      )}
      <text x={24} y={24}>t={t.toFixed(2)}s</text>
      {meet && <text x={width - 140} y={24}>相遇</text>}
      {stage >= 1 && (
        <>
          <text x={20 + a.x * scale - 8} y={90} fill="#6ba4ff">A起点</text>
          <text x={20 + b.x * scale - 8} y={90} fill="#f5a623">B起点</text>
          <text x={20 + a.x * scale - 8} y={36} fill="#6ba4ff">vA={a.v}</text>
          <text x={20 + b.x * scale - 8} y={36} fill="#f5a623">vB={b.v}</text>
        </>
      )}
      {stage >= 2 && (
        <>
          <line x1={20 + Math.min(a.x, ax) * scale} y1={72} x2={20 + Math.max(a.x, ax) * scale} y2={72} stroke="#6ba4ff" strokeDasharray="6 4" />
          <text x={20 + ax * scale - 12} y={70} fill="#6ba4ff">sA={sA.toFixed(1)}</text>
          <line x1={20 + Math.min(b.x, bx) * scale} y1={84} x2={20 + Math.max(b.x, bx) * scale} y2={84} stroke="#f5a623" strokeDasharray="6 4" />
          <text x={20 + bx * scale - 12} y={82} fill="#f5a623">sB={sB.toFixed(1)}</text>
        </>
      )}
      {stage >= 3 && (
        <>
          <line x1={20 + a.x * scale} y1={48} x2={20 + b.x * scale} y2={48} stroke="#333" strokeDasharray="4 4" />
          <text x={20 + ((a.x + b.x)/2) * scale - 24} y={44}>Δx={sep.toFixed(1)}</text>
          {meetHappens && (
            <text x={width - 260} y={24}>sA+sB=Δx</text>
          )}
        </>
      )}
      {stage >= 4 && (
        <g>
          <rect x={width - 240} y={64} width={220} height={50} fill="#ffffff" opacity="0.85" rx={8} />
          <text x={width - 228} y={82} fill="#333">固定量: 起点/速度</text>
          <text x={width - 228} y={98} fill="#333">自变量: t</text>
          <text x={width - 228} y={114} fill="#333">因变量: xA(t), xB(t)</text>
        </g>
      )}
    </svg>
  )
}