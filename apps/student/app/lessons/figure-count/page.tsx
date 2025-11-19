"use client"
import { useState } from "react"
import { LessonRunner } from "../../../components/LessonRunner"
import { StepPlayer } from "../../../components/StepPlayer"
import { Narration } from "../../../components/Narration"
import { FigureCountGrid } from "../../../components/FigureCountGrid"
import { figureScript } from "../../../lib/stepdsl"
import { mapFigureCount } from "../../../lib/mapping"

export default function FigureCountPage() {
  const [rows,setRows]=useState(5)
  const [cols,setCols]=useState(6)
  const [filled,setFilled]=useState(23)
  const [stage,setStage]=useState(0)
  const steps=figureScript.labels
  const onStep=(i:number)=> setStage(i)
  return (
    <LessonRunner title="枚举法：图形计数" skillId="math-figure-count" intro={{ story: "用网格统计图形数量，按行列分组更快捷。", goal: "会按行列枚举并求总数", steps }} hints={figureScript.hints} variantGen={(diff)=>{
      const make=(r:number,c:number,f:number)=>({label:`${r}×${c} 填${f}`,apply:()=>{setRows(r);setCols(c);setFilled(f);setStage(0)}})
      if(diff==="easy") return [make(4,5,12),make(5,5,20)]
      if(diff==="medium") return [make(5,6,23),make(6,6,29)]
      return [make(8,8,49),make(7,9,52)]
    }} microTestGen={(diff)=>{
      const items=[] as Array<{prompt:string;placeholder?:string;check:(v:string)=>boolean}>
      const total=Math.min(rows*cols,Math.max(0,filled))
      if(diff==="easy") items.push({prompt:"总数是多少？",placeholder:"输入数字",check:x=>parseInt(x)===total})
      else if(diff==="medium") items.push({prompt:"每行大约多少？（整数）",placeholder:"输入数字",check:x=>parseInt(x)===Math.floor(total/rows)})
      else items.push({prompt:"余下多少？",placeholder:"输入数字",check:x=>parseInt(x)===total%rows})
      return items
    }} onEvaluate={()=>({ correct: true, text: mapFigureCount(rows,cols,filled) })}>
      <div className="controls">
        <div className="control"><label>行</label><input type="number" value={rows} onChange={e=>setRows(parseFloat(e.target.value||"5"))} /></div>
        <div className="control"><label>列</label><input type="number" value={cols} onChange={e=>setCols(parseFloat(e.target.value||"6"))} /></div>
        <div className="control"><label>填充</label><input type="number" value={filled} onChange={e=>setFilled(parseFloat(e.target.value||"0"))} /></div>
      </div>
      <FigureCountGrid rows={rows} cols={cols} filled={filled} stage={stage} />
      <Narration avatar="/icons/area.svg" name="老师">{figureScript.narration[stage]||""}</Narration>
      <StepPlayer steps={steps} title="分步骤演示" index={stage} onIndexChange={onStep} durations={figureScript.durations} auto />
    </LessonRunner>
  )
}