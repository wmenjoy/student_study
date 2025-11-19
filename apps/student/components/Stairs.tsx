"use client"
type Props = { from: number; to: number; timePerFloor: number; count?: number; progress?: number }

export function Stairs({ from, to, timePerFloor, count = 0, progress = 0 }: Props) {
  const floors = Math.abs(from - to)
  const total = floors * timePerFloor
  const width = 640
  const height = 320
  const stepW = 60
  const dir = to > from ? -1 : 1
  const baseX = 60
  // If going up (dir=-1), start low (height - 80). If going down (dir=1), start high (80).
  const baseY = dir === -1 ? height - 80 : 80
  const rise = 24 // Increased rise for better visibility
  const p = Math.max(0, Math.min(floors, progress))
  const ip = Math.floor(p)
  const fp = p - ip
  const treadLen = stepW - 10
  const phaseH = 0.6

  // Rabbit position calculation
  const currentStepIndex = Math.min(ip, floors)
  const treadX = baseX + currentStepIndex * stepW
  const riserX = treadX + treadLen
  const currY = baseY + currentStepIndex * rise * dir

  let rx = treadX + 10
  let ry = currY

  if (p >= floors) {
    // At the end
    rx = baseX + floors * stepW
    ry = baseY + floors * rise * dir
  } else if (fp <= phaseH) {
    // Walking on tread
    rx = treadX + 10 + (fp / phaseH) * (treadLen - 20)
    ry = currY
  } else {
    // Climbing riser
    const k = (fp - phaseH) / (1 - phaseH)
    rx = riserX - 10 // Stay near the edge
    ry = currY + k * rise * dir
  }

  const stepColor = dir === -1 ? "#22c55e" : "#fb923c"
  const stepDoneColor = dir === -1 ? "#16a34a" : "#f59e0b"

  // Summary text position: If going up, put it top-left. If going down, put it bottom-left.
  const summaryX = 24
  const summaryY = dir === -1 ? 40 : height - 60

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#9ca3af" />
        </marker>
      </defs>

      {/* Summary Text */}
      <g>
        <text x={summaryX} y={summaryY} fontSize="16" fontWeight="bold" fill="#374151">
          {to > from ? "上楼模式" : "下楼模式"}
        </text>
        <text x={summaryX} y={summaryY + 24} fontSize="14" fill="#6b7280">
          层数 = {floors}
        </text>
        <text x={summaryX} y={summaryY + 48} fontSize="14" fill="#6b7280">
          每层时间 = {timePerFloor}
        </text>
        <text x={summaryX} y={summaryY + 72} fontSize="16" fontWeight="bold" fill="#ef4444">
          总时间 = {total}
        </text>
      </g>

      {/* Stairs */}
      {[...Array(floors + 1)].map((_, i) => {
        const isLast = i === floors
        const floorNum = from + (to > from ? i : -i)
        const x = baseX + i * stepW
        const y = baseY + i * rise * dir

        return (
          <g key={i}>
            {/* Floor Line */}
            <line
              x1={x}
              y1={y}
              x2={x + treadLen}
              y2={y}
              stroke={i <= count ? stepDoneColor : "#e5e7eb"}
              strokeWidth={4}
              strokeLinecap="round"
            />
            {/* Floor Label */}
            <text x={x - 10} y={y + 5} textAnchor="end" fontSize="12" fill="#9ca3af">
              {floorNum}F
            </text>

            {/* Riser (Vertical line connecting to next step) */}
            {!isLast && (
              <line
                x1={x + treadLen}
                y1={y}
                x2={x + treadLen}
                y2={y + rise * dir}
                stroke="#e5e7eb"
                strokeWidth={2}
                strokeDasharray="4 2"
              />
            )}

            {/* Interval Label (Time) */}
            {!isLast && (
              <text x={x + treadLen + 5} y={y + (rise * dir) / 2 + 4} fontSize="10" fill="#6b7280">
                {timePerFloor}s
              </text>
            )}
          </g>
        )
      })}

      {/* Start/End Labels */}
      <text x={baseX} y={baseY - (dir === -1 ? 20 : -30)} textAnchor="middle" fontWeight="bold" fill="#22c55e">起点</text>
      <text x={baseX + floors * stepW} y={baseY + floors * rise * dir - (dir === -1 ? 20 : -30)} textAnchor="middle" fontWeight="bold" fill="#ef4444">终点</text>

      {/* Rabbit */}
      <g style={{ transition: "all 0.1s linear" }}>
        <text x={rx - 12} y={ry - 10} fontSize="24">🐰</text>
        {ip > 0 && (
          <text x={rx} y={ry - 35} fontSize="14" fill="#ef4444" fontWeight="bold" textAnchor="middle" style={{ textShadow: "0 1px 2px rgba(255,255,255,0.8)" }}>
            已走{ip}层
          </text>
        )}
      </g>
    </svg>
  )
}