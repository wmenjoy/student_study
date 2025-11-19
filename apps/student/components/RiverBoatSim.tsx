"use client"
type Props = { boat: number; current: number; distance: number; stage: number }

export function RiverBoatSim({ boat, current, distance, stage }: Props) {
  const width = 640
  const height = 240
  const up = distance / Math.max(0.1, boat - current)
  const down = distance / Math.max(0.1, boat + current)
  const diff = up - down
  const box = (x:number,y:number,w:number,h:number,text:string)=> (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} ry={10} fill="#ffffff" stroke="#60a5fa" />
      <text x={x+12} y={y+26} fontSize={16}>{text}</text>
    </g>
  )
  return (
    <svg width={width} height={height} className="svg-panel">
      {stage>=0 && (
        <g>{box(24,24,320,40,`船速=${boat} 水速=${current} 距离=${distance}`)}</g>
      )}
      {stage>=1 && (
        <g>
          {box(24,84,280,40,`上行时间=${up.toFixed(2)}`)}
          {box(320,84,280,40,`下行时间=${down.toFixed(2)}`)}
        </g>
      )}
      {stage>=2 && (
        <g>
          {box(24,134,320,40,`时间差=${diff.toFixed(2)}`)}
          <text x={360} y={160}>(上: L/(v-c), 下: L/(v+c))</text>
        </g>
      )}
    </svg>
  )
}