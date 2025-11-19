"use client"
type Props = { value: number }

export function PlaceValueBlocks({ value }: Props) {
  const v = Math.max(0, Math.floor(value))
  const h = Math.floor(v / 100)
  const t = Math.floor((v % 100) / 10)
  const o = v % 10
  const width = 600
  const height = 220
  return (
    <svg width={width} height={height} className="svg-panel">
      <text x={24} y={28}>数值={v}</text>
      <text x={24} y={54}>百={h} 十={t} 个={o}</text>
      {[...Array(h)].map((_,i)=> (
        <rect key={"h"+i} x={24 + i*22} y={80} width={20} height={20} fill="#6ba4ff" />
      ))}
      {[...Array(t)].map((_,i)=> (
        <rect key={"t"+i} x={24 + i*22} y={110} width={20} height={20} fill="#f59e0b" />
      ))}
      {[...Array(o)].map((_,i)=> (
        <rect key={"o"+i} x={24 + i*22} y={140} width={20} height={20} fill="#34d399" />
      ))}
      <text x={24} y={180}>位值：{h}×100 + {t}×10 + {o}</text>
    </svg>
  )
}