"use client"
import { useMemo } from "react"

type Props = { a: number; b: number; c: number; stage: number }

export function AlgebraTransform({ a, b, c, stage }: Props) {
  const width = 600
  const height = 220
  const inter = useMemo(()=>a - b, [a,b])
  const result = useMemo(()=>a - b - c, [a,b,c])
  const box = (x:number,y:number,w:number,h:number,text:string)=> (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} ry={10} fill="#ffffff" stroke="#60a5fa" strokeWidth={2} />
      <text x={x+12} y={y+26} fontSize={16}>{text}</text>
    </g>
  )
  const arrow = (x1:number,y1:number,x2:number,y2:number)=> (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#60a5fa" strokeWidth={2} />
      <polygon points={`${x2},${y2} ${x2-8},${y2-4} ${x2-8},${y2+4}`} fill="#60a5fa" />
    </g>
  )
  return (
    <svg width={width} height={height} className="svg-panel">
      {stage>=0 && box(24,24,260,40,`${a}−(${b}+${c})`)}
      {stage>=1 && (
        <g>
          {arrow(154,70,154,90)}
          <text x={180} y={86} fontSize={14}>根据 a−(b+c)=a−b−c</text>
        </g>
      )}
      {stage>=2 && box(24,100,260,40,`${a}−${b}−${c}`)}
      {stage>=3 && box(24,150,260,40,`${inter}−${c}`)}
      {stage>=4 && (
        <g>
          {box(320,150,240,40,`结果=${result}`)}
        </g>
      )}
    </svg>
  )
}