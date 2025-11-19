"use client"
import { useRef } from "react"

type Props = {
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
}

export function NumberLine({ min, max, step, value, onChange }: Props) {
  const width = 600
  const height = 100
  const svgRef = useRef<SVGSVGElement | null>(null)
  const scale = (width - 80) / (max - min)
  const x = 40 + (value - min) * scale

  const onPointer = (e: React.PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect()
    const px = e.clientX - (rect?.left || 0)
    const v = min + Math.round(((px - 40) / scale) / step) * step
    const clamped = Math.max(min, Math.min(max, v))
    onChange(clamped)
  }

  const ticks = []
  for (let v = min; v <= max; v += step) ticks.push(v)

  return (
    <svg ref={svgRef} width={width} height={height} className="svg-panel" onPointerDown={onPointer}>
      <line x1={40} y1={50} x2={width - 40} y2={50} stroke="#333" />
      {ticks.map(t => {
        const tx = 40 + (t - min) * scale
        return (
          <g key={t}>
            <line x1={tx} y1={46} x2={tx} y2={54} stroke="#333" />
            <text x={tx - 4} y={70}>{t}</text>
          </g>
        )
      })}
      <circle cx={x} cy={50} r={8} fill="#6ba4ff" />
    </svg>
  )
}