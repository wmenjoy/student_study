"use client"
import { useMemo, useRef, useState } from "react"

type Props = { wrongSum: number; wrongDigit: number; correctDigit: number; place: number; onChange?: (w:number,wd:number,cd:number,pl:number)=>void }

export function ErrorAdjust({ wrongSum, wrongDigit, correctDigit, place, onChange }: Props) {
  const width = 600
  const height = 160
  const scale = 4
  const svgRef = useRef<SVGSVGElement | null>(null)
  const delta = (correctDigit - wrongDigit) * place
  const rightSum = wrongSum + delta
  const wrongLen = Math.max(1, wrongSum) * scale
  const rightLen = Math.max(1, rightSum) * scale
  const [wd,setWd]=useState(wrongDigit)
  const [cd,setCd]=useState(correctDigit)
  const [pl,setPl]=useState(place)
  const setByX = (x:number) => {
    const k = Math.round(x/10)
    setCd(k)
    onChange?.(wrongSum, wd, k, pl)
  }
  const onPointer = (e: React.PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect()
    const x = e.clientX - (rect?.left||0)
    setByX(x)
  }
  const d = useMemo(()=>delta,[wrongSum,wd,cd,pl])
  return (
    <svg ref={svgRef} width={width} height={height} className="svg-panel" onPointerDown={onPointer}>
      <text x={24} y={24}>错误和={wrongSum}</text>
      <rect x={24} y={40} width={wrongLen} height={24} fill="#fca5a5" />
      <text x={24} y={84}>调整=({cd}-{wd})×{pl}={d}</text>
      <rect x={24} y={100} width={rightLen} height={24} fill="#6ba4ff" />
      <text x={24} y={140}>正确和={rightSum}</text>
    </svg>
  )
}