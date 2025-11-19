"use client"
import { useMemo, useRef, useState, useEffect } from "react"

type Props = {
  base: number
  ratio: number
  onChange?: (base: number, ratio: number) => void
  stage?: number
}

export function RatioBar({ base, ratio, onChange, stage = 0 }: Props) {
  const width = 640
  const height = 280
  const scale = 30
  const startX = 60
  const startY = 80

  const [dragK, setDragK] = useState(ratio)
  const [animProgress, setAnimProgress] = useState(1)
  const svgRef = useRef<SVGSVGElement | null>(null)

  const aLen = Math.max(1, base) * scale
  const bLen = Math.max(1, base * dragK) * scale
  const diff = useMemo(() => Math.abs(base * dragK - base), [base, dragK])

  useEffect(() => {
    setDragK(ratio)
  }, [ratio])

  useEffect(() => {
    if (stage === 0) {
      setAnimProgress(1)
    } else if (stage === 1) {
      setAnimProgress(0)
      let p = 0
      const interval = setInterval(() => {
        p += 0.05
        setAnimProgress(Math.min(1, p))
        if (p >= 1) clearInterval(interval)
      }, 30)
      return () => clearInterval(interval)
    } else if (stage >= 2) {
      setAnimProgress(1)
    }
  }, [stage])

  const handleDown = (e: React.PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect()
    const x = e.clientX - (rect?.left || 0) - startX
    const k = Math.max(0.1, Math.min(5, x / aLen))
    setDragK(k)
    onChange?.(base, k)
  }

  return (
    <svg ref={svgRef} width={width} height={height} className="svg-panel" style={{ touchAction: "none" }} onPointerDown={handleDown}>
      <defs>
        <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="orangeGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>

      {/* Summary Header */}
      <g>
        <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">比例演示</text>
        <text x={24} y={56} fontSize="14" fill="#6b7280">基准 A = {base}</text>
        <text x={140} y={56} fontSize="14" fill="#6b7280">倍数 k = {dragK.toFixed(2)}</text>
        {stage >= 2 && (
          <>
            <text x={280} y={56} fontSize="14" fontWeight="bold" fill="#2563eb">
              B = {(base * dragK).toFixed(2)}
            </text>
            <text x={400} y={56} fontSize="14" fill="#ef4444">
              差 = {diff.toFixed(2)}
            </text>
          </>
        )}
      </g>

      <g transform={`translate(${startX}, ${startY})`}>
        {/* Base Bar (A) */}
        <g>
          <rect
            x={0}
            y={0}
            width={aLen * animProgress}
            height={40}
            rx={4}
            fill="url(#blueGrad)"
            stroke="#2563eb"
            strokeWidth="2"
            style={{ transition: "width 0.3s ease" }}
          />
          <text x={aLen / 2} y={25} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">
            A = {base}
          </text>

          {/* Length bracket */}
          <g style={{ opacity: stage >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
            <path d={`M0,50 v5 h${aLen} v-5`} fill="none" stroke="#2563eb" strokeWidth="1.5" />
            <text x={aLen / 2} y={70} textAnchor="middle" fill="#2563eb" fontSize="12">{base}</text>
          </g>
        </g>

        {/* Ratio Bar (B = k × A) */}
        <g transform="translate(0, 100)">
          <rect
            x={0}
            y={0}
            width={bLen * animProgress}
            height={40}
            rx={4}
            fill="url(#orangeGrad)"
            stroke="#f97316"
            strokeWidth="2"
            style={{ transition: "width 0.3s ease" }}
          />
          <text x={bLen / 2} y={25} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">
            B = {(base * dragK).toFixed(2)}
          </text>

          {/* Draggable handle */}
          <circle
            cx={bLen}
            cy={20}
            r={10}
            fill="#dc2626"
            stroke="#fff"
            strokeWidth="2"
            style={{ cursor: "pointer", transition: "cx 0.3s ease" }}
          />
          <text x={bLen} y={25} textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">⇄</text>

          {/* Length bracket */}
          <g style={{ opacity: stage >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
            <path d={`M0,50 v5 h${bLen} v-5`} fill="none" stroke="#f97316" strokeWidth="1.5" />
            <text x={bLen / 2} y={70} textAnchor="middle" fill="#f97316" fontSize="12">{(base * dragK).toFixed(2)}</text>
          </g>
        </g>

        {/* Difference visualization */}
        {stage >= 2 && dragK !== 1 && (
          <g transform="translate(0, 100)" style={{ opacity: 1, transition: "opacity 0.5s 0.3s" }}>
            {dragK > 1 ? (
              <>
                {/* B is longer, show difference at the end */}
                <rect
                  x={aLen}
                  y={0}
                  width={bLen - aLen}
                  height={40}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path d={`M${aLen},-20 v-5 h${bLen - aLen} v5`} fill="none" stroke="#ef4444" strokeWidth="1.5" />
                <text x={aLen + (bLen - aLen) / 2} y={-30} textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">
                  差 = {diff.toFixed(2)}
                </text>
              </>
            ) : (
              <>
                {/* A is longer, show difference */}
                <rect
                  x={bLen}
                  y={-100}
                  width={aLen - bLen}
                  height={40}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <path d={`M${bLen},-120 v-5 h${aLen - bLen} v5`} fill="none" stroke="#ef4444" strokeWidth="1.5" />
                <text x={bLen + (aLen - bLen) / 2} y={-130} textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">
                  差 = {diff.toFixed(2)}
                </text>
              </>
            )}
          </g>
        )}
      </g>

      {/* Instruction text */}
      <text x={width / 2} y={height - 20} textAnchor="middle" fill="#6b7280" fontSize="12">
        拖动红色圆点调整倍数 k
      </text>
    </svg>
  )
}