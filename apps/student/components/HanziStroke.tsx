"use client"
import { useEffect, useRef, useState } from "react"

type Props = { char: string }

export function HanziStroke({ char }: Props) {
  const size = 240
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [points, setPoints] = useState<Array<{x:number;y:number}>>([])
  const [down, setDown] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    setPoints([])
    setScore(0)
  }, [char])

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0,0,size,size)
    ctx.fillStyle = "#fff"
    ctx.fillRect(0,0,size,size)
    ctx.strokeStyle = "#e5e7eb"
    for (let i=0;i<=6;i++) {
      ctx.beginPath()
      ctx.moveTo(i*(size/6),0)
      ctx.lineTo(i*(size/6),size)
      ctx.stroke()
    }
    for (let i=0;i<=6;i++) {
      ctx.beginPath()
      ctx.moveTo(0,i*(size/6))
      ctx.lineTo(size,i*(size/6))
      ctx.stroke()
    }
    ctx.font = "180px serif"
    ctx.fillStyle = "#f0f9ff"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(char, size/2, size/2)
    if (points.length>1) {
      ctx.strokeStyle = "#6ba4ff"
      ctx.lineWidth = 6
      ctx.beginPath()
      ctx.moveTo(points[0].x, points[0].y)
      for (let i=1;i<points.length;i++) ctx.lineTo(points[i].x, points[i].y)
      ctx.stroke()
    }
  }, [points, char])

  const onDown = (e: React.PointerEvent) => {
    setDown(true)
    addPoint(e)
  }
  const onMove = (e: React.PointerEvent) => { if (down) addPoint(e) }
  const onUp = () => { setDown(false); evaluate() }
  const addPoint = (e: React.PointerEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect()
    const x = e.clientX - (rect?.left||0)
    const y = e.clientY - (rect?.top||0)
    setPoints(p => [...p, {x, y}])
  }
  const evaluate = () => {
    if (points.length<4) { setScore(0); return }
    const xs = points.map(p=>p.x)
    const ys = points.map(p=>p.y)
    const len = totalLength(points)
    const bbox = { w: Math.max(...xs)-Math.min(...xs), h: Math.max(...ys)-Math.min(...ys) }
    const area = bbox.w*bbox.h
    const s = Math.max(0, Math.min(100, 100 - Math.abs(area-240*240*0.2)/1000 - Math.abs(len-600)/8))
    setScore(Math.round(s))
  }
  const totalLength = (ps: Array<{x:number;y:number}>) => {
    let l=0
    for (let i=1;i<ps.length;i++) l+=Math.hypot(ps[i].x-ps[i-1].x, ps[i].y-ps[i-1].y)
    return l
  }

  return (
    <div>
      <canvas ref={canvasRef} width={size} height={size} className="svg-panel" onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} />
      <div className="hint">匹配度 {score}%</div>
      <div className="controls">
        <button className="btn ghost" onClick={() => setPoints([])}>清除</button>
      </div>
    </div>
  )
}