"use client"
type Props = { base: number; delta: number }

export function CompareMoreLess({ base, delta }: Props) {
  const other = base + delta
  const width = 600
  const height = 140
  const scale = 8
  return (
    <svg width={width} height={height} className="svg-panel">
      <text x={24} y={28}>基准={base} 差={delta}</text>
      <rect x={24} y={50} width={base*scale} height={18} fill="#6ba4ff" />
      <rect x={24} y={80} width={other*scale} height={18} fill="#f5a623" />
      <text x={24} y={116}>另一项={other}</text>
    </svg>
  )
}