"use client"
type Props = { startH: number; startM: number; endH: number; endM: number }

export function ClockDiff({ startH, startM, endH, endM }: Props) {
  const start = startH*60 + startM
  const end = endH*60 + endM
  const diff = end - start
  const width = 600
  const height = 140
  const scale = 3
  return (
    <svg width={width} height={height} className="svg-panel">
      <text x={24} y={28}>开始={startH}:{String(startM).padStart(2,'0')} 结束={endH}:{String(endM).padStart(2,'0')}</text>
      <rect x={24} y={50} width={Math.max(0,diff)*scale} height={20} fill="#6ba4ff" />
      <text x={24} y={90}>用时={diff} 分钟</text>
    </svg>
  )
}