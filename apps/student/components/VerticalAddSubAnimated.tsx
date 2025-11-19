"use client"
import { useMemo } from "react"

type Props = { a: number; b: number; op: "+" | "-"; stage: number }

export function VerticalAddSubAnimated({ a, b, op, stage }: Props) {
  const width = 420
  const height = 260
  const A = Math.max(0, Math.floor(Math.abs(a)))
  const B = Math.max(0, Math.floor(Math.abs(b)))
  const dsA = useMemo(() => String(A).split("").map(n => parseInt(n)), [A])
  const dsB = useMemo(() => String(B).split("").map(n => parseInt(n)), [B])
  const len = Math.max(dsA.length, dsB.length)
  const pad = (arr: number[]) => Array(len - arr.length).fill(0).concat(arr)
  const aP = pad(dsA)
  const bP = pad(dsB)
  const carry = Array(len).fill(0)
  const out: number[] = Array(len).fill(0)
  for (let i = len - 1; i >= 0; i--) {
    const ai = aP[i]
    const bi = bP[i]
    if (op === "+") {
      const s = ai + bi + (i < len - 1 ? carry[i + 1] : 0)
      out[i] = s % 10
      carry[i] = s >= 10 ? 1 : 0
    } else {
      let top = ai - (i < len - 1 ? carry[i + 1] : 0)
      let c = 0
      if (top < bi) { top += 10; c = 1 }
      out[i] = top - bi
      carry[i] = c
    }
  }
  const res = op === "+" ? A + B : A - B
  const selCol = stage >= 1 && stage <= len ? len - stage : -1
  const cell = (x: number, y: number, v: string, hl: boolean) => (
    <g>
      <rect x={x - 8} y={y - 16} width={26} height={26} className="fade-change" fill={hl ? "#fff6e5" : "#ffffff"} stroke="#e5e7eb" />
      <text x={x} y={y} className={hl?"pulse":""}>{v}</text>
    </g>
  )
  const arrow = (fromX: number, fromY: number, toX: number, toY: number, color: string) => (
    <g>
      <line x1={fromX} y1={fromY} x2={toX} y2={toY} stroke={color} strokeWidth={2} />
      <polygon points={`${toX},${toY} ${toX-6},${toY-3} ${toX-6},${toY+3}`} fill={color} />
    </g>
  )
  return (
    <svg width={width} height={height} className="svg-panel">
      {aP.map((d, i) => cell(40 + i * 28, 84, String(d), selCol === i))}
      {bP.map((d, i) => cell(40 + i * 28, 118, String(d), selCol === i))}
      <text x={40 + len * 28 + 12} y={118}>{op}</text>
      <line x1={40} y1={128} x2={40 + len * 28} y2={128} stroke="#333" />
      {out.map((d, i) => cell(40 + i * 28, 158, String((selCol === -1 || i >= selCol) ? d : "?"), selCol === i))}
      {op === "+" && carry.map((c, i) => c ? <text key={"c"+i} x={40 + i * 28 + 10} y={70} fontSize={12} fill="#ef4444">{c}</text> : null)}
      {op === "-" && carry.map((c, i) => c ? <text key={"b"+i} x={40 + i * 28 + 10} y={70} fontSize={12} fill="#ef4444">借1</text> : null)}
      {selCol >= 0 && op === "+" && carry[selCol] === 1 && selCol-1 >= 0 && (
        <g className="blink" style={{ animationDelay: "0.2s" }}>{arrow(40 + selCol*28 + 13, 140, 40 + (selCol-1)*28 + 13, 74, "#ef4444")}</g>
      )}
      {selCol >= 0 && op === "-" && carry[selCol] === 1 && (
        <g className="blink" style={{ animationDelay: "0.2s" }}>{arrow(40 + (selCol-1>=0? (selCol-1)*28 + 13 : 40), 74, 40 + selCol*28 + 13, 142, "#ef4444")}</g>
      )}
      <text x={40} y={200} className="fade-change">{op === "+" ? "中途和" : "中途差"}={out.map((d,i)=> (selCol===-1||i>=selCol)?String(d):"?").join("")}</text>
      <text x={40} y={220}>结果={res}</text>
    </svg>
  )
}