"use client"
type Props = { sum: number; diff: number; years: number; stage: number }

export function AgeDiffSum({ sum, diff, years, stage }: Props) {
  const width = 640
  const height = 240
  const A = (sum + diff)/2
  const B = (sum - diff)/2
  const Af = A + years
  const Bf = B + years
  const box = (x:number,y:number,w:number,h:number,text:string)=> (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} ry={10} fill="#ffffff" stroke="#60a5fa" />
      <text x={x+12} y={y+26} fontSize={16}>{text}</text>
    </g>
  )
  return (
    <svg width={width} height={height} className="svg-panel">
      {stage>=0 && (<g>{box(24,24,300,40,`和=${sum} 差=${diff}`)}</g>)}
      {stage>=1 && (<g>{box(24,84,300,40,`A=${A} B=${B}`)}</g>)}
      {stage>=2 && (<g>{box(24,134,300,40,`${years}年后: A=${Af} B=${Bf}`)}</g>)}
    </svg>
  )
}