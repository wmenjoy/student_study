"use client"
type Props = { rows: number; cols: number; filled: number; stage: number }

export function FigureCountGrid({ rows, cols, filled, stage }: Props) {
  const width = 640
  const height = 260
  const cellSize = 24
  const total = Math.min(rows*cols, Math.max(0, filled))
  const box = (x:number,y:number,w:number,h:number,text:string)=> (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} ry={10} fill="#ffffff" stroke="#60a5fa" />
      <text x={x+12} y={y+26} fontSize={16}>{text}</text>
    </g>
  )
  const grid = [] as JSX.Element[]
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const idx = r*cols+c
      const fill = idx < total
      grid.push(<rect key={`${r}-${c}`} x={24+c*cellSize} y={60+r*cellSize} width={cellSize-2} height={cellSize-2} fill={fill?"#93c5fd":"#ffffff"} stroke="#e5e7eb" />)
    }
  }
  const perRow = Math.floor(total/rows)
  const remainder = total%rows
  return (
    <svg width={width} height={height} className="svg-panel">
      {stage>=0 && (<g>{box(24,24,220,40,`网格 ${rows}×${cols}`)}</g>)}
      {stage>=1 && (<g>{grid}</g>)}
      {stage>=2 && (
        <g>
          {box(360,60,240,40,`每行约=${perRow}${remainder?`，余=${remainder}`:""}`)}
        </g>
      )}
      {stage>=3 && (
        <g>
          {box(360,110,240,40,`总数=${total}`)}
        </g>
      )}
    </svg>
  )
}